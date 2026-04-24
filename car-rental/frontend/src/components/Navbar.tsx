import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import {
  Car, Menu, X, Bell, User, LogOut, LayoutDashboard,
  ChevronDown, Search, Sparkles
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isIntroComplete } = useUIStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileOpen(false);
  };

  const getDashboardPath = () => {
    if (!user) return '/auth/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'owner') return '/owner/dashboard';
    return '/user/dashboard';
  };

  const isActive = (path: string) => location.pathname === path;

  const isLanding = location.pathname === '/';
  const showNav = !isLanding || isIntroComplete;

  return (
    <div id="global-navbar" className={`fixed top-0 left-0 w-full z-[9999] px-4 pt-4 sm:pt-6 pointer-events-none flex justify-center transition-all duration-[2000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${showNav ? 'translate-y-0 opacity-100' : '-translate-y-[120%] opacity-0'}`}>
      <nav className="pointer-events-auto w-full max-w-5xl transition-all duration-300 ease-in-out font-sans rounded-full bg-white/10 backdrop-blur-[20px] backdrop-saturate-[180%] border border-white/10 shadow-lg">
        <a href="#main-content" className="skip-to-content focus:top-[-10px] focus:left-4">
          Skip to content
        </a>
        <div className="w-full px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between h-[52px]">
          
          {/* LEFT: Logo / Product Name */}
          <div className="flex-1 flex items-center justify-start">
            <Link to="/" className="flex items-center gap-2 group" aria-label="DriveX Home">
              <span className="text-[17px] font-medium tracking-tight transition-colors duration-300 text-white">
                DriveX Pro
              </span>
            </Link>
          </div>

          {/* CENTER: Navigation Links */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-6">
            {[
              { to: '/search', label: 'Browse Cars', icon: Search },
              ...(isAuthenticated
                ? [{ to: getDashboardPath(), label: 'Dashboard' }]
                : []),
            ].map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 text-[13px] font-normal transition-colors duration-200 ${
                  isActive(to) || (label === 'Dashboard' && (location.pathname.includes('dashboard') || location.pathname.includes('admin')))
                    ? 'text-white font-medium'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {label}
              </Link>
            ))}
          </div>

          {/* RIGHT: CTAs & Profile */}
          <div className="flex-1 flex items-center justify-end gap-4">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <Link
                  to="/notifications"
                  className="relative p-1.5 rounded-full transition-all duration-200 hover:bg-white/10"
                  aria-label="Notifications"
                >
                  <Bell className="w-[16px] h-[16px] text-white" strokeWidth={2}/>
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-accent-500 rounded-full" />
                </Link>

                {/* Profile dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className={`flex items-center gap-1.5 p-0.5 pr-2 rounded-full transition-all duration-300 ${
                      profileOpen
                        ? 'bg-white/10 ring-1 ring-white/20'
                        : 'hover:bg-white/10'
                    }`}
                    aria-expanded={profileOpen}
                    aria-haspopup="true"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                      <span className="text-[10px] font-medium text-white">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''} text-white`} strokeWidth={2}/>
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-3 w-56 rounded-xl overflow-hidden animate-scale-in border border-white/20 bg-[#0d0e14]/95 backdrop-blur-2xl shadow-2xl">
                      <div className="p-3 bg-white/5 border-b border-white/10">
                        <p className="text-[13px] font-medium text-white truncate">{user?.name}</p>
                        <p className="text-[11px] text-gray-400 truncate mt-0.5">{user?.email}</p>
                      </div>
                      <div className="p-1.5">
                        <Link
                          to="/profile"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-2.5 py-2 text-[13px] text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <User className="w-3.5 h-3.5" /> Profile
                        </Link>
                        <Link
                          to={getDashboardPath()}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2 px-2.5 py-2 text-[13px] text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                        </Link>
                        <div className="h-px bg-white/10 my-1 mx-2" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-2.5 py-2 text-[13px] text-red-400 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5" /> Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/auth/login"
                  className="text-[12px] font-medium transition-colors text-white hover:text-gray-300"
                >
                  Sign in
                </Link>
                <Link 
                  to="/auth/signup" 
                  className="bg-[#0071e3] hover:bg-[#0077ED] text-white text-[12px] font-medium px-3.5 py-1 rounded-full transition-colors"
                >
                  Buy
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-1.5 rounded-full hover:bg-white/10 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-4 h-4 text-white" strokeWidth={2} /> : <Menu className="w-4 h-4 text-white" strokeWidth={2} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu (Classic frosted backdrop) */}
      {mobileOpen && (
        <div className="md:hidden absolute top-[52px] left-0 w-full bg-dark-950/95 backdrop-blur-[20px] backdrop-saturate-[180%] border-b border-white/10 shadow-sm animate-slide-down">
          <div className="px-4 py-3 space-y-1">
            <Link
              to="/search"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white hover:bg-white/10 text-[14px] font-medium transition-colors"
            >
              Browse Cars
            </Link>
            {isAuthenticated && (
              <Link
                to={getDashboardPath()}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white hover:bg-white/10 text-[14px] font-medium transition-colors"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
    </div>
  );
}
