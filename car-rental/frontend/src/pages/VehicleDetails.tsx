import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { vehiclesAPI, reviewsAPI, bookingsAPI, paymentsAPI, searchAPI } from '../lib/api';
import { useAuthStore } from '../store/authStore';
import BookingStepper from '../components/BookingStepper';
import StatusBadge from '../components/StatusBadge';
import { ErrorState } from '../components/States';
import ScrollReveal from '../components/ScrollReveal';
import {
  MapPin, Users, Fuel, Settings2, Star, Calendar,
  ChevronLeft, ChevronRight, Shield, Clock, CreditCard, Check, X, Zap, AlertCircle, UserCheck,
} from 'lucide-react';
import { format, addDays, differenceInDays, isAfter, isBefore, parseISO } from 'date-fns';
import { customToast } from '../components/CustomToast';
import { useConfetti } from '../hooks/useConfetti';
import type { Vehicle, Review } from '../types';
import PickupMap, { LocationPin } from '../components/PickupMap';

class MapErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: string}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: '' };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error: error.toString() };
  }
  render() {
    if (this.state.hasError) {
      return <div className="p-4 bg-red-900 text-white rounded-xl">Map Error: {this.state.error}</div>;
    }
    return this.props.children;
  }
}



const LOCATIONS_MAP: Record<string, string[]> = {
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik'],
  'Karnataka': ['Bengaluru', 'Mysuru', 'Hubballi', 'Mangaluru'],
  'Delhi': ['New Delhi'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Noida'],
  'Telangana': ['Hyderabad', 'Warangal'],
  'West Bengal': ['Kolkata', 'Darjeeling'],
  'Kerala': ['Kochi', 'Thiruvananthapuram', 'Kozhikode'],
};

export default function VehicleDetails() {

  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const { fireworks } = useConfetti();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Booking state
  const [bookingStep, setBookingStep] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('mock_card');
  const [booking, setBooking] = useState<any>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [holdTimer, setHoldTimer] = useState<number | null>(null);

  // Image gallery
  const [activeImage, setActiveImage] = useState(0);

  // Pick-up Location state
  const [pickupState, setPickupState] = useState('');
  const [pickupCity, setPickupCity] = useState('');
  const [pickupPincode, setPickupPincode] = useState('');
  const [nearestLocations, setNearestLocations] = useState<LocationPin[]>([]);
  const [selectedPickupLocation, setSelectedPickupLocation] = useState('');
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]); // Default India
  const [findingLocations, setFindingLocations] = useState(false);


  const STEPS = ['Select Dates', 'Location', 'Payment', 'Confirmation'];

  useEffect(() => {

    if (!id) return;
    
    // Check if returning from payment gateway
    const urlParams = new URLSearchParams(window.location.search);
    const confirmedBookingId = urlParams.get('confirmed_booking_id');
    
    if (confirmedBookingId) {
      const loadWithBooking = async () => {
        setLoading(true);
        try {
          const [vehicleRes, reviewsRes, bookingRes] = await Promise.all([
            vehiclesAPI.get(id),
            reviewsAPI.getForVehicle(id),
            bookingsAPI.get(confirmedBookingId),
          ]);
          setVehicle(vehicleRes.data);
          setReviews(reviewsRes.data.reviews);
          setAvgRating(reviewsRes.data.averageRating);
          setBooking(bookingRes.data);
          setBookingStep(3); // Go straight to confirmation
          fireworks();
          
          // Track recently viewed
          searchAPI.trackView(id).catch(() => {});
        } catch (err: any) {
          setError('Failed to load vehicle or booking details');
        } finally {
          setLoading(false);
        }
      };
      loadWithBooking();
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        const [vehicleRes, reviewsRes] = await Promise.all([
          vehiclesAPI.get(id),
          reviewsAPI.getForVehicle(id),
        ]);
        setVehicle(vehicleRes.data);
        setReviews(reviewsRes.data.reviews);
        setAvgRating(reviewsRes.data.averageRating);
        // Track recently viewed (fire and forget)
        searchAPI.trackView(id).catch(() => {});
      } catch (err: any) {
        setError(err?.response?.data?.detail || 'Failed to load vehicle');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Hold TTL timer
  useEffect(() => {
    if (!booking?.holdExpiresAt) return;
    const interval = setInterval(() => {
      const now = new Date();
      const expires = new Date(booking.holdExpiresAt);
      const diff = Math.max(0, Math.floor((expires.getTime() - now.getTime()) / 1000));
      setHoldTimer(diff);
      if (diff <= 0) {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [booking?.holdExpiresAt]);

  const days = startDate && endDate
    ? Math.max(differenceInDays(new Date(endDate), new Date(startDate)), 1)
    : 0;

  const estimatedTotal = vehicle && days > 0
    ? (() => {
        const base = days * vehicle.pricing.baseRate;
        const cleaning = vehicle.pricing.cleaningFee || 0;
        const serviceFee = Math.round(base * 0.05);
        const tax = Math.round((base + serviceFee + cleaning) * 0.18);
        const deposit = vehicle.pricing.securityDeposit || 0;
        return base + cleaning + serviceFee + tax + deposit;
      })()
    : 0;

  const isDateBlocked = (dateStr: string) => {
    if (!vehicle) return false;
    const d = new Date(dateStr);
    // Check availability blocks
    for (const block of vehicle.availability || []) {
      if (d >= new Date(block.start) && d <= new Date(block.end)) return true;
    }
    // Check booked ranges
    for (const range of vehicle.bookedRanges || []) {
      if (d >= new Date(range.start) && d <= new Date(range.end)) return true;
    }
    return false;
  };

  const handleCreateBooking = async () => {
    if (!isAuthenticated) {
      navigate('/auth/login');
      return;
    }
    if (!vehicle || !startDate || !endDate) return;

    setBookingLoading(true);
    try {
      // Find the name of the selected location to save
      const locName = nearestLocations.find(l => l.id === selectedPickupLocation)?.name || selectedPickupLocation;
      
      const idempotencyKey = `${user?._id}_${vehicle._id}_${startDate}_${endDate}_${selectedPickupLocation}`;
      const res = await bookingsAPI.create({
        idempotencyKey,
        vehicleId: vehicle._id,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        paymentMethod,
        pickupLocation: locName || undefined,
      });
      setBooking(res.data);
      setBookingStep(2); // Move to payment step
      customToast.booking('Booking hold created!');

    } catch (err: any) {
      customToast.error(err?.response?.data?.detail || 'Booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  const handlePayment = () => {
    if (!booking) return;
    navigate(`/payment/${booking._id}`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-[400px] bg-[#1b1b1b] shadow-sm rounded-2xl mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-8 bg-[#1b1b1b] shadow-sm rounded w-64" />
            <div className="h-4 bg-[#1b1b1b] shadow-sm rounded w-full" />
            <div className="h-4 bg-[#1b1b1b] shadow-sm rounded w-3/4" />
          </div>
          <div className="h-64 bg-[#1b1b1b] shadow-sm rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return <ErrorState message={error || 'Vehicle not found'} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="max-w-none min-h-screen bg-[#0d0e14] text-white px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <button onClick={() => navigate(-1)} className="btn-ghost mb-4 text-sm">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back
      </button>

      {/* Image Gallery */}
      <div className="relative rounded-2xl overflow-hidden mb-8 h-[300px] sm:h-[400px] lg:h-[500px]">
        {vehicle.images.length > 0 ? (
          <>
            <img
              src={vehicle.images[activeImage]?.url}
              alt={`${vehicle.title} - Image ${activeImage + 1}`}
              className="w-full h-full object-cover"
            />
            {vehicle.images.length > 1 && (
              <>
                <button
                  onClick={() => setActiveImage((prev) => (prev === 0 ? vehicle.images.length - 1 : prev - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveImage((prev) => (prev === vehicle.images.length - 1 ? 0 : prev + 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {vehicle.images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all ${i === activeImage ? 'bg-[#1b1b1b] w-6' : 'bg-[#1b1b1b]/50'}`}
                      aria-label={`View image ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-[#1b1b1b] shadow-sm flex items-center justify-center">
            <span className="text-gray-4000">No images</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Details */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex items-start gap-3 flex-wrap">
              <h1 className="text-3xl font-display font-bold text-white">{vehicle.title}</h1>
              {vehicle.instantBooking && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2.5 py-1 rounded-full mt-2">
                  <Zap className="w-3 h-3" /> Instant Book
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 mt-2 text-gray-400 flex-wrap">
              {vehicle.location && (
                <span className="flex items-center gap-1 text-sm">
                  <MapPin className="w-4 h-4" /> {vehicle.location}
                </span>
              )}
              {((vehicle.avgRating ?? 0) > 0 || avgRating > 0) && (
                <span className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  {vehicle.avgRating || avgRating} ({vehicle.totalRatings || reviews.length} reviews)
                </span>
              )}
              {vehicle.distanceKm != null && (
                <span className="text-sm text-gray-400">{vehicle.distanceKm.toFixed(1)} km away</span>
              )}
            </div>
            {/* Trust Badges */}
            {(vehicle.ownerVerified || vehicle.insuranceVerified) && (
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {vehicle.ownerVerified && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-1 rounded-full">
                    <UserCheck className="w-3.5 h-3.5" /> Owner Verified
                  </span>
                )}
                {vehicle.insuranceVerified && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium bg-neon-blue/10 text-neon-blue border border-neon-blue/20 px-2.5 py-1 rounded-full">
                    <Shield className="w-3.5 h-3.5" /> Insurance Verified
                  </span>
                )}
              </div>
            )}
            {/* Cancellation Policy */}
            {vehicle.cancellationPolicy && (
              <div className="mt-3 flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">Cancellation: </span>
                <span className={`font-medium capitalize ${
                  vehicle.cancellationPolicy === 'flexible' ? 'text-green-600' :
                  vehicle.cancellationPolicy === 'moderate' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>{vehicle.cancellationPolicy}</span>
              </div>
            )}
          </div>

          {/* Specs */}
          <ScrollReveal delay={100}>
          <div className="glass-enhanced rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-4">Specifications</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Users, label: 'Seats', value: vehicle.specs.seats },
                { icon: Settings2, label: 'Transmission', value: vehicle.specs.transmission === 'auto' ? 'Automatic' : 'Manual' },
                { icon: Fuel, label: 'Fuel', value: vehicle.specs.fuel },
                ...(vehicle.specs.year ? [{ icon: Calendar, label: 'Year', value: vehicle.specs.year }] : []),
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="text-center p-3 bg-[#1b1b1b] shadow-sm border border-gray-800 rounded-xl">
                  <Icon className="w-5 h-5 text-primary-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="font-semibold text-white text-sm capitalize">{value}</p>
                </div>
              ))}
            </div>
          </div>
          </ScrollReveal>

          {/* Description */}
          {vehicle.description && (
            <div className="glass-enhanced rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-3">About this car</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{vehicle.description}</p>
            </div>
          )}

          {/* Reviews */}
          <ScrollReveal delay={200}>
          <div className="glass-enhanced rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-4">
              Reviews {reviews.length > 0 && `(${reviews.length})`}
            </h3>
            {reviews.length === 0 ? (
              <p className="text-gray-400 text-sm">No reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {reviews.slice(0, 5).map((r) => (
                  <div key={r._id} className="border-b border-gray-800 pb-4 last:border-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < r.rating ? 'text-yellow-500 fill-yellow-500' : 'text-dark-600'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">
                        {r.createdAt ? format(new Date(r.createdAt), 'MMM d, yyyy') : ''}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          </ScrollReveal>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="glass-enhanced rounded-2xl p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-3xl font-bold text-white">
                  ₹{vehicle.pricing.baseRate.toLocaleString()}
                </span>
                <span className="text-gray-400">/day</span>
              </div>
              {vehicle.pricing.weekendRate && (
                <span className="text-xs text-gray-400 bg-[#1b1b1b] shadow-sm border border-gray-800 px-2 py-1 rounded-lg">
                  Weekend: ₹{vehicle.pricing.weekendRate.toLocaleString()}
                </span>
              )}
            </div>

            {/* Booking Stepper */}
            {bookingStep > 0 && (
              <BookingStepper currentStep={bookingStep} steps={STEPS} />
            )}

            {/* Step 0: Select Dates */}
            {bookingStep === 0 && (
              <div className="space-y-4">

                <div>
                  <label className="label">Pick-up Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={format(new Date(), 'yyyy-MM-dd')}
                    className="input-field"
                    aria-label="Pick-up date"
                  />
                </div>
                <div>
                  <label className="label">Return Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || format(addDays(new Date(), 1), 'yyyy-MM-dd')}
                    className="input-field"
                    aria-label="Return date"
                  />
                </div>

                {/* Price estimate */}
                {days > 0 && (
                  <div className="bg-[#1b1b1b] shadow-sm border border-gray-800 rounded-xl p-4 space-y-2 animate-fade-in">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">{days} day{days > 1 ? 's' : ''} × ₹{vehicle.pricing.baseRate.toLocaleString()}</span>
                      <span className="text-gray-400">₹{(days * vehicle.pricing.baseRate).toLocaleString()}</span>
                    </div>
                    {vehicle.pricing.cleaningFee > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Cleaning fee</span>
                        <span className="text-gray-400">₹{vehicle.pricing.cleaningFee.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Service fee (5%)</span>
                      <span className="text-gray-400">₹{Math.round(days * vehicle.pricing.baseRate * 0.05).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Tax (18%)</span>
                      <span className="text-gray-400">₹{Math.round((days * vehicle.pricing.baseRate * 1.05 + (vehicle.pricing.cleaningFee || 0)) * 0.18).toLocaleString()}</span>
                    </div>
                    {vehicle.pricing.securityDeposit > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Security deposit (refundable)</span>
                        <span className="text-gray-400">₹{vehicle.pricing.securityDeposit.toLocaleString()}</span>
                      </div>
                    )}
                    <hr className="border-gray-800" />
                    <div className="flex justify-between font-semibold">
                      <span className="text-white">Total</span>
                      <span className="text-white text-lg">₹{estimatedTotal.toLocaleString()}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => {
                    if (!startDate || !endDate) {
                      customToast.error('Please select dates');
                      return;
                    }
                    setBookingStep(1); // Move to location step
                  }}
                  disabled={!startDate || !endDate}
                  className="btn-primary w-full"
                >
                  Continue to Location
                </button>
              </div>
            )}

            {/* Step 1: Location */}
            {bookingStep === 1 && (
              <div className="space-y-4 animate-fade-in">
                {!nearestLocations.length ? (
                  <>
                    <div>
                      <label className="label">State</label>
                      <select
                        value={pickupState}
                        onChange={(e) => {
                          setPickupState(e.target.value);
                          setPickupCity(''); // Reset city when state changes
                        }}
                        className="input-field appearance-none"
                      >
                        <option value="" disabled>Select State</option>
                        {Object.keys(LOCATIONS_MAP).map((state) => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label">City</label>
                      <select
                        value={pickupCity}
                        onChange={(e) => setPickupCity(e.target.value)}
                        className="input-field appearance-none"
                        disabled={!pickupState}
                      >
                        <option value="" disabled>Select City</option>
                        {!!pickupState && LOCATIONS_MAP[pickupState]?.map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                    <div>

                      <label className="label">Pincode</label>
                      <input
                        type="text"
                        value={pickupPincode}
                        onChange={(e) => setPickupPincode(e.target.value)}
                        placeholder="e.g., 400001"
                        className="input-field"
                      />
                    </div>
                    <button
                      onClick={async () => {
                        if (!pickupState || !pickupCity || !pickupPincode) {
                          customToast.error('Please fill in state, city, and pincode');
                          return;
                        }
                        
                        setFindingLocations(true);
                        try {
                          const query = encodeURIComponent(`${pickupCity}, ${pickupState}, ${pickupPincode}`);
                          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
                          const data = await res.json();
                          
                          let lat = 20.5937;
                          let lng = 78.9629;

                          const parseCoordinate = (val: any, fallback: number) => {
                            const parsed = parseFloat(val);
                            return isNaN(parsed) ? fallback : parsed;
                          };

                          if (data && Array.isArray(data) && data.length > 0) {
                            lat = parseCoordinate(data[0].lat, lat);
                            lng = parseCoordinate(data[0].lon, lng);
                          } else {
                            // Fallback to City name search if full address fails
                            const fallbackQuery = encodeURIComponent(`${pickupCity}, India`);
                            const fallbackRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${fallbackQuery}`);
                            const fallbackData = await fallbackRes.json();
                            if (fallbackData && Array.isArray(fallbackData) && fallbackData.length > 0) {
                              lat = parseCoordinate(fallbackData[0].lat, lat);
                              lng = parseCoordinate(fallbackData[0].lon, lng);
                            } else {
                              customToast.error('Could not accurately locate area, falling back to default mapping');
                            }
                          }
                          
                          if (isNaN(lat) || isNaN(lng)) {
                            lat = 20.5937;
                            lng = 78.9629;
                          }

                          setMapCenter([lat, lng]);
                          
                          // Generate 3 mock locations slightly offset from center
                          const offset = 0.02; // Roughly 2 km offset
                          setNearestLocations([
                            { id: `${pickupCity}-downtown`, name: `${pickupCity} Downtown Hub`, lat: lat + (Math.random() * offset - offset/2), lng: lng + (Math.random() * offset - offset/2) },
                            { id: `${pickupCity}-station`, name: `${pickupCity} Station Branch`, lat: lat + (Math.random() * offset - offset/2), lng: lng + (Math.random() * offset - offset/2) },
                            { id: `${pickupCity}-airport`, name: `${pickupCity} Airport Dropoff`, lat: lat + (Math.random() * offset - offset/2), lng: lng + (Math.random() * offset - offset/2) },
                          ]);
                        } catch (err) {
                          customToast.error('Error finding locations');
                        } finally {
                          setFindingLocations(false);
                        }
                      }}
                      disabled={findingLocations}
                      className="btn-secondary w-full"
                    >
                      {findingLocations ? 'Locating on Map...' : 'Find Nearest Locations'}
                    </button>
                    <button

                      onClick={() => setBookingStep(0)}
                      className="btn-ghost w-full"
                    >
                      Back to Dates
                    </button>
                  </>
                ) : (
                  <>
                    <h4 className="font-semibold text-white mb-4">Select a Nearest Hub:</h4>
                    
                    {/* Interactive React-Leaflet Map */}
                    <div className="mb-6 h-[250px] relative z-0">
                      <MapErrorBoundary>
                        <PickupMap 
                          center={mapCenter} 
                          locations={nearestLocations} 
                          selectedLocationId={selectedPickupLocation} 
                          onSelect={(id) => setSelectedPickupLocation(id)} 
                        />
                      </MapErrorBoundary>
                    </div>

                    <div className="space-y-3">
                      {nearestLocations.map((loc, idx) => {
                        const isSelected = selectedPickupLocation === loc.id;
                        return (
                          <label
                            key={loc.id}
                            className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              isSelected
                                ? 'border-primary-500 bg-primary-500/10 scale-[1.02] shadow-[0_0_15px_rgba(var(--primary-500),0.2)]' 
                                : 'border-gray-800 bg-[#1b1b1b] hover:border-gray-600 shadow-sm'
                            }`}
                          >
                            <input
                              type="radio"
                              name="pickupLocation"
                              value={loc.name}
                              checked={isSelected}
                              onChange={() => setSelectedPickupLocation(loc.id)}
                              className="sr-only"
                            />
                            <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 ${isSelected ? 'border-primary-500' : 'border-gray-500'}`}>
                              {isSelected && <div className="w-2.5 h-2.5 bg-primary-500 rounded-full" />}
                            </div>
                            <div className="flex-1">
                              <span className="text-sm font-semibold text-white block mb-0.5">{loc.name}</span>
                              <span className="text-xs text-gray-400 block flex items-center gap-1">
                                <MapPin className="w-3 h-3" /> {(Math.random() * 3 + 1).toFixed(1)} km away
                              </span>
                            </div>
                          </label>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => {
                        if (!selectedPickupLocation) {
                          customToast.error('Please select a pick-up location');
                          return;
                        }
                        handleCreateBooking();
                      }}

                      disabled={bookingLoading}
                      className="btn-primary w-full mt-4"
                    >
                      {bookingLoading ? 'Processing...' : 'Review & Reserve'}
                    </button>
                    <button
                      onClick={() => {
                        setNearestLocations([]);
                        setSelectedPickupLocation('');
                      }}
                      disabled={bookingLoading}
                      className="btn-ghost w-full"
                    >
                      Change Area
                    </button>
                  </>
                )}
              </div>
            )}

            {/* Step 2: Payment Gateway Redirect */}
            {bookingStep === 2 && booking && (

              <div className="space-y-4 animate-fade-in">
                {/* Hold timer */}
                {holdTimer !== null && holdTimer > 0 && (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-yellow-300">Hold expires in</p>
                      <p className="text-lg font-bold text-yellow-400">
                        {Math.floor(holdTimer / 60)}:{String(holdTimer % 60).padStart(2, '0')}
                      </p>
                    </div>
                  </div>
                )}

                {/* Price summary */}
                <div className="bg-[#1b1b1b] shadow-sm border border-gray-800 rounded-xl p-4 space-y-2">
                  <h4 className="font-semibold text-white">Price Breakdown</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Base ({booking.priceBreakdown.days} days)</span>
                    <span>₹{booking.priceBreakdown.base.toLocaleString()}</span>
                  </div>
                  {booking.priceBreakdown.fees?.map((f: any, i: number) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-400">{f.name}</span>
                      <span className={f.amount < 0 ? 'text-green-600' : ''}>
                        {f.amount < 0 ? '-' : ''}₹{Math.abs(f.amount).toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Tax</span>
                    <span>₹{booking.priceBreakdown.tax.toLocaleString()}</span>
                  </div>
                    <hr className="border-gray-800" />
                    <div className="flex justify-between font-bold">
                      <span className="text-white">Total</span>
                      <span className="text-lg text-white">₹{booking.priceBreakdown.total.toLocaleString()}</span>
                    </div>
                </div>

                {/* Pickup Location read-only */}
                {booking.pickupLocation && (
                  <div className="bg-[#1b1b1b] shadow-sm border border-gray-800 rounded-xl p-4">
                    <h4 className="text-xs text-gray-400 mb-1">Pick-up Location</h4>
                    <p className="text-sm font-medium text-white flex items-center gap-2">
                       <MapPin className="w-4 h-4 text-primary-500" /> {booking.pickupLocation}
                    </p>
                  </div>
                )}

                {/* Payment redirect button */}
                <div>
                  <button
                    onClick={handlePayment}
                    className="btn-primary w-full"
                  >
                    Proceed to Payment Gateway
                  </button>
                  <p className="text-xs text-center text-gray-500 mt-3">You will be redirected to securely complete your payment.</p>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {bookingStep === 3 && booking && (
              <div className="text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Booking Confirmed!</h3>
                <p className="text-gray-400 text-sm">
                  Your booking for {vehicle.title} has been confirmed.
                </p>
                <div className="bg-[#1b1b1b] shadow-sm border border-gray-800 rounded-xl p-4 text-left space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Booking ID</span>
                    <span className="font-mono text-white">{booking._id?.slice(-8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status</span>
                    <StatusBadge status={booking.status} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Dates</span>
                    <span className="text-white">
                      {format(new Date(booking.startDate), 'MMM d')} - {format(new Date(booking.endDate), 'MMM d, yyyy')}
                    </span>
                  </div>
                  {booking.pickupLocation && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Pick-up Location</span>
                    <span className="text-white text-right max-w-[60%]">{booking.pickupLocation}</span>
                  </div>
                  )}
                </div>
                <button

                  onClick={() => navigate('/user/dashboard')}
                  className="btn-primary w-full"
                >
                  Go to Dashboard
                </button>
              </div>
            )}

            {/* Features */}
            <div className="mt-6 pt-6 border-t border-gray-800 space-y-3">
              {[
                { icon: Shield, text: 'Free cancellation (48h+)' },
                { icon: Clock, text: '10-min hold during payment' },
                { icon: Star, text: 'Verified owner & vehicle' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-gray-400">
                  <Icon className="w-4 h-4 text-green-500 flex-shrink-0" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
