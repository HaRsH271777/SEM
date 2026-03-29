import React, { useState } from 'react';
import { useUIStore } from '../store/uiStore';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, Shield, Clock, Star, ArrowRight, Car, MapPin,
  Zap, ChevronRight, ArrowUpRight, CheckCircle2
} from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import AnimatedCar from '../components/AnimatedCar';
import RoadDivider from '../components/RoadDivider';
import MouseSpotlight from '../components/MouseSpotlight';
import FAQAccordion from '../components/FAQAccordion';
import DragCarousel from '../components/DragCarousel';
import { useMagnetic } from '../hooks/useMagnetic';
import { useTypewriter } from '../hooks/useTypewriter';
import GibberishText from '../components/animata/text/gibberish-text';

export default function Landing() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCar, setExpandedCar] = useState<string | null>(null);
  const { ref: magneticRef, magneticProps } = useMagnetic({ strength: 0.2 });
  const { displayText, cursorVisible } = useTypewriter('dream car', { speed: 80, startDelay: 800 });

  const { isIntroComplete, setIntroComplete } = useUIStore();
  
  // 0: Black, 1: Video, 2: "WE", 3: "ARE", 4: "DRIVE X", 5: Fadeout Black, 6: Done
  const [introStep, setIntroStep] = useState(isIntroComplete ? 6 : 0); 
  const introVideoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (isIntroComplete) return;

    if (introStep === 0) {
      const timer = setTimeout(() => setIntroStep(1), 800);
      return () => clearTimeout(timer);
    } else if (introStep === 2) {
      const timer = setTimeout(() => setIntroStep(3), 1200);
      return () => clearTimeout(timer);
    } else if (introStep === 3) {
      const timer = setTimeout(() => setIntroStep(4), 1200);
      return () => clearTimeout(timer);
    } else if (introStep === 4) {
      const timer = setTimeout(() => setIntroStep(5), 2500);
      return () => clearTimeout(timer);
    } else if (introStep === 5) {
      const timer = setTimeout(() => {
        setIntroComplete(true);
        setIntroStep(6);
      }, 1000); // 1s to fade out text
      return () => clearTimeout(timer);
    }
  }, [introStep, isIntroComplete, setIntroComplete]);

  const handleIntroTimeUpdate = () => {
    if (introVideoRef.current && introStep === 1) {
      const { currentTime, duration } = introVideoRef.current;
      if (duration > 0 && currentTime >= duration - 2) {
        setIntroStep(2);
      }
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  const handleCarClick = (carName: string) => {
    if (expandedCar === carName) {
      navigate('/search');
    } else {
      setExpandedCar(carName);
    }
  };

  const faqItems = [
    { question: 'How does DriveX work?', answer: 'Browse our curated fleet of verified vehicles, select your dates, and book instantly. Pick up from the owner or a designated spot — no paperwork, no hidden fees.' },
    { question: 'Is insurance included?', answer: 'Yes! Every booking includes comprehensive insurance coverage. You drive worry-free, and we handle the rest.' },
    { question: 'Can I list my own car?', answer: 'Absolutely. Sign up as an owner, add your vehicle details and photos, set your pricing, and start earning. We handle payments, insurance, and support.' },
    { question: 'What if I need to cancel?', answer: 'Free cancellation up to 24 hours before your trip. After that, a small fee may apply depending on the owner\'s cancellation policy.' },
    { question: 'How are vehicles verified?', answer: 'Every vehicle goes through a multi-point inspection. We verify registration, insurance, owner identity, and vehicle condition before listing.' },
  ];

  return (
    <div className={`overflow-hidden bg-[#0d0e14] text-white ${!isIntroComplete ? 'h-[100dvh]' : ''}`}>

      {/* ═══════════════════════════════════════════════
          IN-PAGE INTRO SEQUENCE
         ═══════════════════════════════════════════════ */}
      <div 
        onClick={() => { if (!isIntroComplete) { setIntroComplete(true); setIntroStep(6); } }}
        className={`absolute inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-[2000ms] ease-in-out ${isIntroComplete ? 'opacity-0 pointer-events-none' : 'opacity-100 cursor-pointer'}`}
      >
          {introStep < 2 && (
            <video
              ref={introVideoRef}
              src="/hero-video.mp4"
              autoPlay
              muted
              playsInline
              onTimeUpdate={handleIntroTimeUpdate}
              onEnded={() => { if (introStep === 1) setIntroStep(2); }}
              className={`w-full h-full object-cover transition-opacity duration-1000 ${introStep === 1 ? 'opacity-100' : 'opacity-0'}`}
            />
          )}

          {introStep >= 2 && introStep <= 5 && (
             <div className={`absolute inset-0 flex items-center justify-center text-8xl md:text-9xl font-display font-black tracking-widest uppercase transition-opacity duration-1000 ease-in-out ${introStep === 5 ? 'opacity-0' : 'opacity-100'}`}>
              {introStep === 2 && <GibberishText text="WE" className="text-white" />}
              {introStep === 3 && <GibberishText text="ARE" className="text-white" />}
              {(introStep === 4 || introStep === 5) && <GibberishText text="DRIVE X" className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600" />}
            </div>
          )}
      </div>

      {/* ═══════════════════════════════════════════════
          MAIN PAGE CONTENT
         ═══════════════════════════════════════════════ */}
      <div className={`transition-all duration-[2400ms] ease-[cubic-bezier(0.16,1,0.3,1)] transform ${!isIntroComplete ? 'opacity-0 translate-y-16 pointer-events-none' : 'opacity-100 translate-y-0'}`}>

      {/* ═══════════════════════════════════════════════
          HERO — asymmetric split, immersive dark
         ═══════════════════════════════════════════════ */}
      <MouseSpotlight size={500} intensity={0.1} color="255, 68, 51">
      <section className="relative min-h-[92vh] flex items-center">
        {/* Decorative bg elements — neon gradient blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary-500/[0.08] blur-[120px] animate-aurora" />
          <div className="absolute bottom-20 left-10 w-[300px] h-[300px] rounded-full bg-neon-blue/[0.06] blur-[100px] animate-aurora-2" />
          <div className="absolute top-[40%] left-[40%] w-[200px] h-[200px] rounded-full bg-neon-purple/[0.05] blur-[80px] animate-aurora-3" />
          <div className="absolute top-20 right-20 w-96 h-96 bg-dot-pattern bg-dot opacity-[0.15]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
            {/* Left — text content */}
            <div className="lg:col-span-5 space-y-8">

              <ScrollReveal delay={100}>
                <h1 className="text-white !leading-[1.06]">
                  Drive your
                  <br />
                  <span className="relative inline-block">
                    <span className="text-gradient">{displayText}</span>

                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                      <path d="M2 8 C50 2, 150 2, 198 8" stroke="url(#hero-line)" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
                      <defs><linearGradient id="hero-line" x1="0" y1="0" x2="200" y2="0"><stop offset="0%" stopColor="#ff4433"/><stop offset="100%" stopColor="#00d4ff"/></linearGradient></defs>
                    </svg>
                  </span>
                  <br />
                  today.
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={200}>
                <p className="text-gray-300 text-lg max-w-md leading-relaxed">
                  Premium vehicles from verified owners.
                  Book in under 2 minutes, pick up and go.
                </p>
              </ScrollReveal>


            </div>

            {/* Right — asymmetric overlapping composition */}
            <div className="lg:col-span-7 relative lg:pl-12">
              <ScrollReveal direction="right" delay={200}>
                <div className="relative">
                  {/* Main image — asymmetric crop */}
                  <div className="rounded-[28px] overflow-hidden shadow-2xl shadow-primary-500/10 aspect-[4/3] lg:aspect-[16/10] border border-white/10 relative">
                    <video
                      src="/rain.mp4"
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950/40 via-transparent to-transparent" />
                  </div>



                  {/* Floating stat card — overlaps image edge */}
                  <div className="absolute -bottom-5 -left-4 sm:left-6 bg-white/5 shadow-sm  border border-white/10 p-4 rounded-2xl shadow-2xl shadow-black/40 z-20 hidden sm:flex items-center gap-3 ">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent-500 to-neon-green flex items-center justify-center shadow-glow-accent">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">500+ verified</p>
                      <p className="text-xs text-gray-300">vehicles available</p>
                    </div>
                  </div>

                  {/* Floating price — rotated slightly for asymmetry */}
                  <div className="absolute -top-6 -right-3 sm:right-6 bg-white/5 shadow-sm  border border-white/10 px-5 py-3 rounded-2xl shadow-2xl shadow-black/40 z-20 hidden sm:block rotate-2 hover:rotate-0 transition-transform duration-500 ">
                    <p className="text-xs text-gray-300 font-medium">Starting from</p>
                    <p className="text-xl font-extrabold text-white">$29<span className="text-sm font-normal text-gray-300">/day</span></p>
                  </div>

                  {/* Decorative neon ring — offset asymmetrically */}
                  <div className="absolute -bottom-16 -right-8 w-32 h-32 border-[2px] border-dashed border-primary-500/20 rounded-full hidden lg:block animate-spin-slow" style={{ animationDuration: '20s' }} />
                  <div className="absolute -top-8 -left-6 w-16 h-16 border border-neon-blue/15 rounded-full hidden lg:block" />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
      </MouseSpotlight>

      {/* ═══════════════════════════════════════════════
          MARQUEE — scrolling brand bar
         ═══════════════════════════════════════════════ */}
      <section className="border-y border-white/10 bg-white/5 shadow-sm py-4 overflow-hidden ">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, setIdx) => (
            <React.Fragment key={setIdx}>
              {['Tesla','BMW','Mercedes','Audi','Porsche','Toyota','Range Rover','Lamborghini','Ferrari','Honda','Hyundai','Kia'].map((brand) => (
                <span key={`${setIdx}-${brand}`} className="inline-flex items-center gap-3 mx-8 text-gray-300 text-sm font-semibold uppercase tracking-wider">
                  <span className="w-1 h-1 rounded-full bg-primary-500/60" />
                  {brand}
                </span>
              ))}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          ROAD DIVIDER
         ═══════════════════════════════════════════════ */}
      <RoadDivider className="my-4" />

      {/* ═══════════════════════════════════════════════
          HOW IT WORKS — horizontal timeline with neon accents
         ═══════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden">
          {/* Background Video (absolute positioned behind content) */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <video
              className="absolute inset-0 w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
            >
              <source src="/how-it-works-bg.mp4" type="video/mp4" />
            </video>
            {/* Dark overlay to ensure text remains readable */}
            <div className="absolute inset-0 bg-dark-950/80" />
          </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
              <div>
                <span className="section-label mb-4 block w-fit">How it works</span>
                <h2 className="text-white">Rent in three moves</h2>
              </div>
              <Link
                to="/search"
                className="text-sm font-semibold text-primary-400 flex items-center gap-1 hover:gap-2 transition-all group"
              >
                Start browsing <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                num: '01',
                title: 'Search & discover',
                desc: 'Browse by type, brand, price range, or pickup location. Smart filters find your perfect match.',
                color: 'bg-primary-500/10 text-primary-400 border-primary-500/20',
                iconColor: 'text-primary-400',
                icon: Search,
              },
              {
                num: '02',
                title: 'Book instantly',
                desc: "Select dates, review transparent pricing, and confirm in seconds. No hidden charges — ever.",
                color: 'bg-accent-500/10 text-accent-400 border-accent-500/20',
                iconColor: 'text-accent-400',
                icon: Clock,
              },
              {
                num: '03',
                title: 'Pick up & drive',
                desc: 'Meet the owner, grab the keys, and hit the road. Full insurance included on every trip.',
                color: 'bg-neon-blue/10 text-neon-blue border-neon-blue/20',
                iconColor: 'text-neon-blue',
                icon: Car,
              },
            ].map(({ num, title, desc, color, iconColor, icon: Icon }, idx) => (
              <ScrollReveal key={num} delay={idx * 120}>
                <div
                  className={`group relative p-8 rounded-3xl border border-white/20 bg-dark-900/60 backdrop-blur-md shadow-sm transition-all duration-500  h-full`}
                >
                  {/* Number + line connector */}
                  <div className="flex items-center gap-4 mb-6">
                    <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-sm font-extrabold border ${color}`}>
                      {num}
                    </span>
                    {idx < 2 && (
                      <div className="hidden md:block flex-1 h-px bg-white/[0.06] group-hover:bg-primary-500/30 transition-colors" />
                    )}
                  </div>
                  <Icon className={`w-6 h-6 ${iconColor} mb-4`} />
                  <h4 className="text-white mb-2">{title}</h4>
                  <p className="text-sm text-gray-300 leading-relaxed">{desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          ROAD DIVIDER 2
         ═══════════════════════════════════════════════ */}
      <RoadDivider className="my-4" />

      {/* ═══════════════════════════════════════════════
          BENTO GRID — dark glass variant
         ═══════════════════════════════════════════════ */}
      <section className="pb-24 pt-8 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <span className="section-label mb-4 block w-fit">Why DriveX</span>
            <h2 className="text-white mb-12 max-w-lg">
              Not your average<br />rental platform
            </h2>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Large feature card */}
            <ScrollReveal className="md:col-span-4" delay={0}>
              <div className="rounded-3xl overflow-hidden relative group min-h-[320px] border border-white/10 ">
                <video
                  src="/interior.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 z-10">
                  <span className="badge-neutral mb-3 !bg-white/10 !text-white  !border-white/10">Premium Fleet</span>
                  <h3 className="text-white mb-2">Curated, not crowded</h3>
                  <p className="text-gray-300 text-sm max-w-xs">
                    Every vehicle is hand-inspected. We reject 40% of listings to keep quality high.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            {/* Tall stat card */}
            <ScrollReveal className="md:col-span-2" delay={150}>
              <div className="flip-card min-h-[320px] group rounded-3xl w-full h-full">
                <div className="flip-card-inner shadow-sm hover:shadow-md transition-shadow rounded-3xl w-full h-full">
                  
                  {/* Front */}
                  <div className="flip-card-front bg-white/5 border border-white/10 flex items-center justify-center p-8 rounded-3xl w-full h-full">
                    <Shield className="w-20 h-20 text-accent-400 opacity-80 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
                  </div>

                  {/* Back */}
                  <div className="flip-card-back bg-white/5 border border-white/10 p-8 flex flex-col justify-between text-white rounded-3xl w-full h-full">
                    <div>
                      <Shield className="w-7 h-7 text-accent-400 mb-4" />
                      <h4 className="text-white mb-2">Fully insured</h4>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        Comprehensive coverage included with every booking. Drive worry-free.
                      </p>
                    </div>
                    <div className="flex items-end gap-2 mt-auto pt-6">
                      <span className="text-4xl font-extrabold text-gradient">100%</span>
                      <span className="text-sm text-gray-300 pb-1">coverage</span>
                    </div>
                  </div>
                  
                </div>
              </div>
            </ScrollReveal>

            {/* Row of 3 smaller feature cards */}
            <ScrollReveal className="md:col-span-2" delay={100}>
              <div className="flip-card min-h-[200px] group rounded-3xl w-full h-full">
                <div className="flip-card-inner rounded-3xl w-full h-full">
                  {/* Front */}
                  <div className="flip-card-front bg-accent-500/[0.06] border border-accent-500/20 flex items-center justify-center p-6 rounded-3xl w-full h-full">
                    <Zap className="w-16 h-16 text-accent-400 opacity-80 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
                  </div>
                  {/* Back */}
                  <div className="flip-card-back bg-accent-500/[0.06] border border-accent-500/20 p-6 flex flex-col justify-between hover:bg-accent-500/10 transition-colors rounded-3xl w-full h-full">
                    <Zap className="w-6 h-6 text-accent-400 mb-3" />
                    <div>
                      <h5 className="text-white mb-1 font-bold">Instant booking</h5>
                      <p className="text-xs text-gray-300">No waiting for approval. Most cars are instant-book enabled.</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal className="md:col-span-2" delay={200}>
              <div className="flip-card min-h-[200px] group rounded-3xl w-full h-full">
                <div className="flip-card-inner rounded-3xl w-full h-full">
                  {/* Front */}
                  <div className="flip-card-front bg-primary-500/[0.06] border border-primary-500/20 flex items-center justify-center p-6 rounded-3xl w-full h-full">
                    <Star className="w-16 h-16 text-primary-400 opacity-80 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
                  </div>
                  {/* Back */}
                  <div className="flip-card-back bg-primary-500/[0.06] border border-primary-500/20 p-6 flex flex-col justify-between hover:bg-primary-500/10 transition-colors rounded-3xl w-full h-full">
                    <Star className="w-6 h-6 text-primary-400 mb-3" />
                    <div>
                      <h5 className="text-white mb-1 font-bold">4.8★ average</h5>
                      <p className="text-xs text-gray-300">Rated by 10,000+ real riders. Read verified reviews before booking.</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal className="md:col-span-2" delay={300}>
              <div className="flip-card min-h-[200px] group rounded-3xl w-full h-full">
                <div className="flip-card-inner rounded-3xl w-full h-full">
                  {/* Front */}
                  <div className="flip-card-front bg-neon-blue/[0.06] border border-neon-blue/20 flex items-center justify-center p-6 rounded-3xl w-full h-full">
                    <MapPin className="w-16 h-16 text-neon-blue opacity-80 group-hover:scale-110 transition-transform duration-500" strokeWidth={1.5} />
                  </div>
                  {/* Back */}
                  <div className="flip-card-back bg-neon-blue/[0.06] border border-neon-blue/20 p-6 flex flex-col justify-between hover:bg-neon-blue/10 transition-colors rounded-3xl w-full h-full">
                    <MapPin className="w-6 h-6 text-neon-blue mb-3" />
                    <div>
                      <h5 className="text-white mb-1 font-bold">12+ cities</h5>
                      <p className="text-xs text-gray-300">Mumbai, Delhi, Bangalore, Pune, and expanding every month.</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <RoadDivider className="my-4" />

      {/* ═══════════════════════════════════════════════
          TESTIMONIALS — dark glass cards
         ═══════════════════════════════════════════════ */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="section-label mb-4 inline-block">What riders say</span>
              <h2 className="text-white">Loved by thousands</h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "DriveX made renting a car feel effortless. Found a BMW within 5 minutes and the pickup was smooth.",
                name: 'Arjun Mehta',
                role: 'Frequent traveler',
                initials: 'AM',
                bg: 'bg-gradient-to-br from-primary-500 to-primary-600',
              },
              {
                quote: "As an owner, I've earned ₹2L+ in 6 months listing my car. The platform handles everything.",
                name: 'Priya Sharma',
                role: 'Vehicle owner',
                initials: 'PS',
                bg: 'bg-gradient-to-br from-accent-500 to-neon-green',
              },
              {
                quote: "Transparent pricing, no hidden fees, and great customer support. 10/10 would recommend.",
                name: 'Rohit Kumar',
                role: 'Weekend road-tripper',
                initials: 'RK',
                bg: 'bg-gradient-to-br from-neon-blue to-neon-purple',
              },
            ].map(({ quote, name, role, initials, bg }, idx) => (
              <ScrollReveal key={name} delay={idx * 150}>
                <div
                  className={`p-8 rounded-3xl border border-white/10 bg-white/5 shadow-sm  hover:bg-white/5 shadow-sm hover:border-white/10 transition-all duration-500  h-full ${idx === 1 ? 'md:-translate-y-4' : ''}`}
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-6">"{quote}"</p>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center text-white text-xs font-bold shadow-lg`}>
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{name}</p>
                      <p className="text-xs text-gray-300">{role}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <RoadDivider variant="tracks" className="my-4" />

      {/* ═══════════════════════════════════════════════
          FEATURED VEHICLES — continuous loop marquee
         ═══════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`transition-all duration-700 ${expandedCar ? 'blur-xl scale-95 origin-center' : ''}`}>
              <div className="mb-6">
                <span className="section-label mb-3 inline-block">Featured rides</span>
                <h2 className="text-white">Top picks for you</h2>
              </div>
            </div>
        </div>

        <div className={`transition-all duration-700 relative overflow-hidden ${expandedCar ? 'blur-xl scale-95 origin-center' : ''}`}>
          {/* Gradient fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0d0e14] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0d0e14] to-transparent z-10 pointer-events-none" />
          
          <div className={`flex animate-marquee hover:[animation-play-state:paused] w-max gap-6 py-4 px-2 ${expandedCar ? '[animation-play-state:paused]' : ''}`}>
            {[
              { name: 'Tesla Model 3', price: '₹4,500', img: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=500&q=80', tag: 'Electric' },
              { name: 'BMW 3 Series', price: '₹5,200', img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&q=80', tag: 'Luxury' },
              { name: 'Range Rover Sport', price: '₹8,000', img: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500&q=80', tag: 'SUV' },
              { name: 'Mercedes C-Class', price: '₹6,500', img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=500&q=80', tag: 'Premium' },
              { name: 'Porsche 911', price: '₹15,000', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&q=80', tag: 'Sports' },
              { name: 'Hyundai Creta', price: '₹2,200', img: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&q=80', tag: 'Popular' },
            ].concat([
              { name: 'Tesla Model 3', price: '₹4,500', img: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=500&q=80', tag: 'Electric' },
              { name: 'BMW 3 Series', price: '₹5,200', img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&q=80', tag: 'Luxury' },
              { name: 'Range Rover Sport', price: '₹8,000', img: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500&q=80', tag: 'SUV' },
              { name: 'Mercedes C-Class', price: '₹6,500', img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=500&q=80', tag: 'Premium' },
              { name: 'Porsche 911', price: '₹15,000', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&q=80', tag: 'Sports' },
              { name: 'Hyundai Creta', price: '₹2,200', img: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&q=80', tag: 'Popular' },
            ]).map((car, idx) => (
              <div
                key={`${car.name}-${idx}`}
                onClick={() => handleCarClick(car.name)}
                className="flex-shrink-0 w-[280px] group cursor-pointer perspective-2000"
              >
                <div className="rounded-3xl overflow-hidden border border-white/10 bg-white/5 shadow-sm hover:border-white/20 transition-all duration-500 hover:-translate-y-2">
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={car.img}
                      alt={car.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 badge-info !text-[10px]">{car.tag}</span>
                  </div>
                  <div className="p-4 relative">
                    <h5 className="text-white text-sm font-bold group-hover:text-primary-400 transition-colors">{car.name}</h5>
                    <div className="flex items-end justify-between mt-2">
                      <span className="text-lg font-extrabold text-white">{car.price}<span className="text-xs text-gray-300 font-normal">/day</span></span>
                      <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-primary-400 transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

            {/* EXPANDED MODAL OVERLAY */}
            {expandedCar && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <div 
                  className="absolute inset-0 bg-dark-950/80 backdrop-blur-md animate-in fade-in duration-500"
                  onClick={() => setExpandedCar(null)}
                />
                
                {/* Expanded Card */}
                {(() => {
                  const car = [
                    { name: 'Tesla Model 3', price: '₹4,500', img: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=500&q=80', tag: 'Electric' },
                    { name: 'BMW 3 Series', price: '₹5,200', img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=500&q=80', tag: 'Luxury' },
                    { name: 'Range Rover Sport', price: '₹8,000', img: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=500&q=80', tag: 'SUV' },
                    { name: 'Mercedes C-Class', price: '₹6,500', img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=500&q=80', tag: 'Premium' },
                    { name: 'Porsche 911', price: '₹15,000', img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&q=80', tag: 'Sports' },
                    { name: 'Hyundai Creta', price: '₹2,200', img: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&q=80', tag: 'Popular' },
                  ].find(c => c.name === expandedCar);
                  
                  if (!car) return null;

                  return (
                    <div 
                      className="relative w-full max-w-sm aspect-[4/5] [perspective:1000px] cursor-pointer animate-in zoom-in-95 duration-500"
                      onClick={() => handleCarClick(car.name)}
                    >
                      <div className="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] [transform:rotateY(180deg)]">
                        {/* Front (Hidden initially because we start flipped for 'expansion effect') */}
                        {/* Actually, user said 'flip and expand', so maybe it should start at 0 and flip to 180 */}
                        {/* Let's make it start at 0, then flip to 180 automatically or on first click? */}
                        {/* User: 'clicked card should first flip and expand' */}
                        
                        <div className="absolute inset-0 [backface-visibility:hidden] rounded-[32px] overflow-hidden border border-white/10 bg-dark-900 shadow-2xl">
                           <img src={car.img} className="w-full h-2/3 object-cover" />
                           <div className="p-6">
                              <h3 className="text-white">{car.name}</h3>
                              <p className="text-gray-400">Expanding focus...</p>
                           </div>
                        </div>

                        {/* Back (The Detail view) */}
                        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-[32px] overflow-hidden border border-primary-500/50 bg-dark-950 shadow-[0_0_50px_rgba(255,68,51,0.2)] flex flex-col p-8">
                          <div className="flex-1">
                            <span className="badge-info mb-4">{car.tag}</span>
                            <h2 className="text-white mb-2 !text-3xl">{car.name}</h2>
                            <p className="text-2xl font-extrabold text-primary-400 mb-6">{car.price}<span className="text-sm font-normal text-gray-400">/day</span></p>
                            
                            <div className="space-y-4 mb-8">
                               <div className="flex items-center gap-3 text-gray-300">
                                  <Shield className="w-5 h-5 text-primary-400" />
                                  <span>Fully Insured & Verified</span>
                               </div>
                               <div className="flex items-center gap-3 text-gray-300">
                                  <Zap className="w-5 h-5 text-primary-400" />
                                  <span>Instant Booking Available</span>
                               </div>
                               <div className="flex items-center gap-3 text-gray-300">
                                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                                  <span>4.9/5 Rating (Verified)</span>
                               </div>
                            </div>
                          </div>
                          
                          <div className="text-center mt-auto">
                            <p className="text-primary-400 font-bold mb-4 animate-bounce">Click again to Book Now</p>
                            <div className="btn-primary w-full py-4 rounded-2xl shadow-glow-primary">
                               Continue to Search <ArrowRight className="w-5 h-5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
      </section>

      <RoadDivider className="my-4" />

      {/* ═══════════════════════════════════════════════
          CTA — bold with neon accents
         ═══════════════════════════════════════════════ */}
      <section className="py-24 relative">
        <ScrollReveal direction="scale">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[32px] overflow-hidden bg-dark-950 shadow-sm border border-white/10 p-10 md:p-16 text-white text-shadow-sm h-full w-full">
            {/* Background Video */}
            <div className="absolute inset-0 z-0 text-white">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/roaddrive.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-dark-950/60 transition-opacity hover:bg-dark-950/50" />
            </div>

            {/* Decorative neon blobs (lowered opacity to not wash out video) */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/[0.15] rounded-full blur-[100px] z-0" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-neon-blue/[0.15] rounded-full blur-[100px] z-0" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-white mb-4 !text-3xl md:!text-4xl drop-shadow-md">
                  Ready to hit<br />the open road?
                </h2>
                <p className="text-gray-200 max-w-sm mb-8 leading-relaxed drop-shadow">
                  Join 10,000+ riders who've discovered a better way to rent. Your first ride is just a click away.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link to="/search" className="btn-primary !px-8 !py-4 shadow-xl">
                    Browse cars <ArrowUpRight className="w-4 h-4" />
                  </Link>
                  <Link
                    to="/auth/signup"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-white font-semibold flex-shrink-0 backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-all duration-300 border border-white/20"
                  >
                    List your car
                  </Link>
                </div>
              </div>

              <div className="hidden lg:flex justify-end">
                <div className="grid grid-cols-2 gap-4 max-w-xs">
                  {[
                    { val: '500+', label: 'Vehicles' },
                    { val: '10K+', label: 'Happy riders' },
                    { val: '4.8★', label: 'Avg. rating' },
                    { val: '12+', label: 'Cities' },
                  ].map(({ val, label }, idx) => (
                    <ScrollReveal key={label} delay={idx * 100} direction="scale">
                      <div className="p-5 rounded-2xl bg-dark-950/40 backdrop-blur-md border border-white/10 text-center hover:bg-white/10 transition-colors shadow-2xl">
                        <p className="text-2xl font-extrabold text-white">{val}</p>
                        <p className="text-xs text-gray-300 mt-1">{label}</p>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        </ScrollReveal>
      </section>

      {/* ═══════════════════════════════════════════════
          FAQ — animated accordion
         ═══════════════════════════════════════════════ */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <ScrollReveal>
              <div className="sticky top-32">
                <span className="section-label mb-4 block w-fit">FAQ</span>
                <h2 className="text-white mb-4">Got questions?<br />We've got answers.</h2>
                <p className="text-gray-600 max-w-sm leading-relaxed mb-6">
                  Everything you need to know about renting with DriveX. Can't find what you're looking for? Reach out to our support team.
                </p>
                <Link
                  to="/search"
                  className="btn-primary !px-6 !py-3"
                >
                  Browse cars <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <FAQAccordion items={faqItems} />
            </ScrollReveal>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}
