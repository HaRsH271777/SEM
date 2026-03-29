import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingsAPI, paymentsAPI } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import { ErrorState } from '../components/States';
import { CreditCard, Lock, Clock, Check, ChevronLeft } from 'lucide-react';
import { customToast } from '../components/CustomToast';

export default function PaymentGateway() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [holdTimer, setHoldTimer] = useState<number | null>(null);

  // Form State
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [name, setName] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }

    if (!bookingId) return;

    const loadBooking = async () => {
      try {
        const res = await bookingsAPI.get(bookingId);
        if (res.data.status !== 'held' && res.data.status !== 'pending') {
          setError('This booking is no longer awaiting payment.');
        } else {
          setBooking(res.data);
        }
      } catch (err: any) {
        setError(err?.response?.data?.detail || 'Failed to load booking');
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [bookingId, isAuthenticated, navigate]);

  // Timer logic for 10-mins hold
  useEffect(() => {
    if (!booking?.holdExpiresAt) return;
    const interval = setInterval(() => {
      const now = new Date();
      const expires = new Date(booking.holdExpiresAt);
      const diff = Math.max(0, Math.floor((expires.getTime() - now.getTime()) / 1000));
      setHoldTimer(diff);
      if (diff <= 0) {
        clearInterval(interval);
        customToast.error('Hold has expired. Please restart the booking process.');
        navigate(`/vehicle/${booking.vehicleId}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [booking, navigate]);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 3) {
      return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
    }
    return v;
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!booking) return;

    if (!cardNumber || !expiry || !cvv || !name) {
      customToast.error('Please fill in all card details');
      return;
    }

    setProcessing(true);
    try {
      await paymentsAPI.charge({
        bookingId: booking._id,
        method: booking.paymentMethod || 'mock_card',
        amount: booking.priceBreakdown.total,
      });
      // Payment successful, redirect back with confirmation query parameter
      navigate(`/vehicle/${booking.vehicleId}?confirmed_booking_id=${booking._id}`);
    } catch (err: any) {
      customToast.error(err?.response?.data?.detail || 'Payment failed');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-none min-h-[80vh] flex flex-col justify-center items-center bg-[#0d0e14]">
        <div className="animate-pulse flex items-center gap-3">
          <Lock className="w-6 h-6 text-gray-400" />
          <span className="text-gray-400">Loading secure checkout...</span>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <ErrorState message={error || 'Booking not found'} onRetry={() => navigate(-1)} />
      </div>
    );
  }

  return (
    <div className="max-w-none min-h-screen bg-[#0d0e14] py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-xl">
        <button onClick={() => navigate(-1)} className="btn-ghost mb-6 text-sm flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Go Back
        </button>

        <div className="glass-enhanced rounded-3xl p-6 sm:p-10 border border-gray-800 relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                Secure Checkout <Lock className="w-5 h-5 text-green-500" />
              </h1>
              <p className="text-sm text-gray-400">Finalize your payment to confirm the booking.</p>
            </div>

            {holdTimer !== null && holdTimer > 0 && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-2 flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-400 animate-pulse" />
                <div className="text-right">
                  <p className="text-xs text-yellow-300 font-medium uppercase tracking-wider">Expires In</p>
                  <p className="text-xl font-bold font-mono text-yellow-400 leading-none">
                    {Math.floor(holdTimer / 60)}:{String(holdTimer % 60).padStart(2, '0')}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-[#1b1b1b] shadow-sm rounded-2xl p-6 mb-8 border border-gray-800 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-400 mb-1">Amount Payable</p>
              <p className="text-3xl font-bold text-white leading-none">₹{booking.priceBreakdown.total.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">Ref ID</p>
              <p className="text-sm font-mono text-gray-300">#{booking._id.slice(-8).toUpperCase()}</p>
            </div>
          </div>

          <form onSubmit={handlePayment} className="space-y-6 relative z-10">
            <div className="space-y-4">
              <div>
                <label className="label">Name on Card</label>
                <input
                  type="text"
                  placeholder="JOHN DOE"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field uppercase"
                  required
                />
              </div>

              <div>
                <label className="label">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    className="input-field pl-10 font-mono tracking-widest text-lg"
                    required
                  />
                  <CreditCard className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    maxLength={5}
                    className="input-field font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="label">CVV</label>
                  <input
                    type="password"
                    placeholder="•••"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    maxLength={4}
                    className="input-field font-mono"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800/80 mt-8">
              <button
                type="submit"
                disabled={processing || holdTimer === 0}
                className="btn-primary w-full py-4 text-lg font-bold flex items-center justify-center relative overflow-hidden transition-all hover:scale-[1.02]"
              >
                <span className={`transition-opacity duration-200 ${processing ? 'opacity-0' : 'opacity-100'}`}>
                  Pay ₹{booking.priceBreakdown.total.toLocaleString()}
                </span>
                
                {processing && (
                  <span className="absolute inset-0 flex items-center justify-center gap-2 bg-primary-600">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                )}
              </button>
              
              <p className="text-xs text-center text-gray-500 mt-4 flex items-center justify-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> 256-bit AES Encrypted checkout
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
