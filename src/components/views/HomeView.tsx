/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { ViewPath } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, ArrowDown, Shield, Compass, CircleDollarSign, PencilRuler, Sparkles, Sliders } from 'lucide-react';
import gsap from 'gsap';
import ThreeInteractiveCanvas from '../ThreeInteractiveCanvas';

interface HomeViewProps {
  onNavigate: (view: ViewPath) => void;
  onOpenEnquiry: () => void;
}

export default function HomeView({ onNavigate, onOpenEnquiry }: HomeViewProps) {
  const [activeHeroIdx, setActiveHeroIdx] = useState(0);
  const [hoveredWorkIdx, setHoveredWorkIdx] = useState(0);
  const [activeTabEthos, setActiveTabEthos] = useState<'passive' | 'budget' | 'material' | 'flow'>('passive');
  const [scrollY, setScrollY] = useState(0);
  const [blueprintMode, setBlueprintMode] = useState<'2d' | '3d'>('2d');

  // Monitor scroll positioning for butter-smooth parallax and scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Premium GSAP landing page reveal of key hero markers
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.gsap-stagger-item', 
        { opacity: 0, y: 30, skewY: 1.5 },
        { opacity: 1, y: 0, skewY: 0, duration: 1.2, stagger: 0.15, ease: 'power4.out', delay: 0.1 }
      );
    });
    return () => ctx.revert();
  }, []);

  // Hero Slider Projects data
  const heroSlides = [
    {
      num: '01',
      title: 'Paviliun Tirta Myrtle',
      location: 'Ascot, QLD',
      year: '2024',
      tagline: 'Paviliun kayu minimalis dan tempat perlindungan outdoor yang dirancang untuk relaksasi fungsional di luar ruangan sub-tropis.',
      bgGradient: 'from-[#2B2A26] to-[#1A1A18]',
      accentColor: '#E05C38',
      type: 'Paviliun Kolam & Ekstensi',
      imageUrl: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1920&q=80',
      displayTitle: 'PENGALAMAN'
    },
    {
      num: '02',
      title: 'Griya Jaloura Utama',
      location: 'Paddington, QLD',
      year: 'Dalam Konstruksi',
      tagline: 'Menyelaraskan struktur beton ekspos yang kokoh dengan atap tritisan kayu lebar dan penyangga iklim mikro menghadap ke utara.',
      bgGradient: 'from-[#3A3832] to-[#1A1A18]',
      accentColor: '#C4B99A',
      type: 'Rumah Kustom Mewah Baru',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80',
      displayTitle: 'KOLABORATIF'
    },
    {
      num: '03',
      title: 'Graha Roster Grange',
      location: 'Grange, QLD',
      year: 'Selesai 2026',
      tagline: 'Ruang kerja komersial tiga lantai yang mengintegrasikan roster keramik kustom dan sumur cahaya pasif alami.',
      bgGradient: 'from-[#282E2E] to-[#1A1A18]',
      accentColor: '#D96B3F',
      type: 'Ruang Kantor Kustom',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80',
      displayTitle: 'BIOKLIMATIK'
    }
  ];

  // Auto-play the Hero Slide every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveHeroIdx((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Selected works matching official site portfolio
  const selectedWorks = [
    { num: '01', title: 'Graha Roster Grange', year: '2026', desc: 'Ruang Kantor Komersial', location: 'Grange, QLD', material: 'Roster tanah liat terakota + rangka beton ekspos kasar', area: '420 m²', imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80' },
    { num: '02', title: 'Paviliun Tirta Myrtle', year: '2024', desc: 'Paviliun Kolam & Ekstensi', location: 'Ascot, QLD', material: 'Kisi-kisi kayu ulin solid + ubin batu alam andesit', area: '85 m²', imageUrl: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80' },
    { num: '03', title: 'Omah Runic Padma', year: '2026', desc: 'Rumah Kustom Residensial', location: 'Paddington, QLD', material: 'Struktur beton kantilever berat + sekat kayu pivot otomatis', area: '310 m²', imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80' },
    { num: '04', title: 'Griya Stanley Klasik', year: '2026', desc: 'Renovasi Kontemporer', location: 'Grange, QLD', material: 'Pelestarian dinding papan kayu klasik + ruang void kaca masif', area: '190 m²', imageUrl: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80' },
    { num: '05', title: 'Vila Clifton Lestari', year: '2025', desc: 'Vila Minimalis Kontemporer', location: 'Clifton Hill, QLD', material: 'Dinding terakota ekspos + struktur baja hitam anti karat', area: '275 m²', imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80' },
    { num: '06', title: 'Wisma Dickens Tropis', year: '2026', desc: 'Residensial Tropis Bioklimatik', location: 'Alderley, QLD', material: 'Atap tritisan lengkung penahan panas + panel termal surya', area: '225 m²', imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80' }
  ];

  // Render highly-polished high-end vector drawing schematics for each project on hover
  const renderVectorDrawing = (index: number) => {
    switch (index) {
      case 0: // Days Road Office
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full stroke-brand-grey/40 fill-none stroke-[1.2] transition-colors" id="schem-days-road">
            {/* Grid background lines */}
            <path d="M 0,50 L 400,50 M 0,150 L 400,150 M 0,250 L 400,250 M 50,0 L 50,300 M 200,0 L 200,300 M 350,0 L 350,300" strokeDasharray="3,3" className="stroke-brand-black/[0.04]" />
            {/* Building skeleton structure */}
            <rect x="70" y="60" width="260" height="190" className="stroke-brand-black/35 stroke-[1.5]" />
            {/* Horizontal divisions (3 Floors) */}
            <line x1="70" y1="120" x2="330" y2="120" />
            <line x1="70" y1="185" x2="330" y2="185" />
            {/* Custom Breeze Blocks facade segment */}
            <g className="stroke-[#bc552b]/55">
              {[...Array(6)].map((_, r) =>
                [...Array(6)].map((_, c) => (
                  <rect key={`${r}-${c}`} x={110 + c * 15} y={135 + r * 7} width="11" height="5" rx="1" />
                ))
              )}
            </g>
            {/* Dimensions and Callouts */}
            <line x1="60" y1="60" x2="60" y2="250" className="stroke-brand-orange/40 stroke-[1]" />
            <path d="M 57,60 L 63,60 M 57,250 L 63,250" />
            <text x="40" y="160" transform="rotate(-90, 40, 160)" className="fill-[#7A7870] font-mono text-[8px] uppercase tracking-wider">3-STOREY ELEVATION · 11.20M</text>
            <text x="140" y="110" className="fill-[#1A1A18]/60 font-serif text-[10px] italic">Deep shading recess</text>
            {/* Solar Compass vector overlay */}
            <circle cx="310" cy="90" r="18" className="stroke-brand-orange/20" />
            <line x1="310" y1="68" x2="310" y2="112" strokeDasharray="2,2" />
            <line x1="288" y1="90" x2="332" y2="90" strokeDasharray="2,2" />
            <path d="M 310,90 L 322,78" className="stroke-brand-orange/70 stroke-[1.5]" />
            <text x="325" y="75" className="fill-brand-orange font-sans text-[7px] font-bold">N</text>
          </svg>
        );
      case 1: // Myrtle Pool House
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full stroke-brand-grey/40 fill-none stroke-[1.2] transition-colors" id="schem-myrtle">
            <path d="M 0,30 L 400,30 M 0,150 L 400,150 M 0,270 L 400,270" strokeDasharray="4,4" className="stroke-brand-black/[0.04]" />
            {/* Ground line */}
            <line x1="30" y1="210" x2="370" y2="210" className="stroke-brand-black/60 stroke-[1.5]" />
            {/* Pool water basin representation */}
            <rect x="50" y="210" width="130" height="25" className="stroke-brand-orange/30 fill-brand-orange/[0.03]" />
            <path d="M 50,218 Q 82.5,215 115,218 T 180,218" className="stroke-brand-orange/40 stroke-[0.8]" />
            {/* Timber pavilion core */}
            <rect x="200" y="90" width="140" height="120" className="stroke-brand-black/35 stroke-[1.5]" />
            {/* Timber fins / screen louvres overlay */}
            <g className="stroke-[#7A7870]/70">
              {[...Array(14)].map((_, i) => (
                <line key={i} x1={215 + i * 8} y1="95" x2={215 + i * 8} y2="205" />
              ))}
            </g>
            {/* Text labeling and compass indicator */}
            <text x="215" y="80" className="fill-[#1A1A18]/60 font-serif text-[10px] italic">Batten Canopy</text>
            <text x="50" y="250" className="fill-[#7A7870] font-sans text-[8px] uppercase tracking-wider">Ascot Pool Ground line section</text>
            {/* Dimensions */}
            <line x1="200" y1="222" x2="340" y2="222" className="stroke-brand-grey/30" />
            <text x="250" y="235" className="fill-brand-dark-grey font-mono text-[8px]">SPAN WIDTH STABILITY: 14.0M</text>
          </svg>
        );
      case 2: // Runic House
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full stroke-brand-grey/40 fill-none stroke-[1.2] transition-colors" id="schem-runic">
            {/* Angular heavy blocks representation */}
            <polygon points="60,220 180,220 180,120 60,120" className="stroke-brand-black/45" />
            <polygon points="180,220 340,220 310,90 180,90" className="stroke-brand-black/55 stroke-[1.8]" />
            {/* Suspended concrete slab cantilever lines */}
            <line x1="150" y1="120" x2="350" y2="120" className="stroke-brand-orange/60 stroke-[2]" />
            <text x="230" y="112" className="fill-brand-orange font-sans text-[8px] font-bold tracking-widest">CANTILEVER SLAB 3.5M</text>
            {/* Site topography angle */}
            <line x1="30" y1="250" x2="370" y2="190" strokeDasharray="5,2" className="stroke-brand-black/25" />
            <text x="40" y="265" className="fill-[#7A7870] font-mono text-[8px] uppercase">TOPOGRAPHY: 18.2° SLOPED PADDINGTON</text>
            <circle cx="245" cy="155" r="15" className="stroke-brand-grey/30" />
            <line x1="245" y1="140" x2="245" y2="170" />
            <line x1="230" y1="155" x2="260" y2="155" />
          </svg>
        );
      case 3: // Stanley Residence
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full stroke-brand-grey/40 fill-none stroke-[1.2]" id="schem-stanley">
            {/* Symmetrical Queenslander roof lines */}
            <polygon points="60,140 180,70 300,140" className="stroke-brand-black/35" />
            <rect x="75" y="140" width="210" height="90" className="stroke-brand-black/45" />
            {/* Overlaid modern double height glass void panel */}
            <rect x="180" y="110" width="130" height="120" className="stroke-brand-orange/50 fill-brand-orange/[0.02] stroke-[1.5]" />
            <line x1="180" y1="170" x2="310" y2="170" />
            <line x1="245" y1="110" x2="245" y2="230" strokeDasharray="3,3" />
            <text x="195" y="100" className="fill-[#E05C38] font-serif text-[10px] italic">Modern Void addition</text>
            <text x="75" y="250" className="fill-[#7A7870] font-mono text-[8px] uppercase">EXISTING ROOF STRUCTURE PRESERVED</text>
          </svg>
        );
      case 4: // Clifton Residence
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full stroke-brand-grey/40 fill-none stroke-[1.2]" id="schem-clifton">
            {/* Dynamic high contrast geometric boxes */}
            <rect x="50" y="140" width="180" height="90" className="stroke-brand-black/35" />
            <rect x="150" y="70" width="200" height="80" className="stroke-brand-black/55 stroke-[1.8]" />
            {/* Coastal wind flow vectors */}
            <path d="M 30,110 Q 90,80 150,110 T 270,110" strokeDasharray="4,4" className="stroke-[#3D8361]/55" />
            <path d="M 30,125 Q 90,95 150,125 T 270,125" strokeDasharray="4,4" className="stroke-[#3D8361]/35" />
            <text x="35" y="85" className="fill-[#3D8361] font-sans text-[8px] font-bold tracking-widest uppercase">DOMINANT SOUTH-EAST BREEZE</text>
            <text x="160" y="62" className="fill-[#1A1A18]/60 font-serif text-[10px] italic">Aerodynamic roof profile</text>
            <text x="50" y="255" className="fill-[#7A7870] font-mono text-[8px] uppercase">CLIFTON HILL SEISMIC BRACING ZONE 2</text>
          </svg>
        );
      case 5: // Dickens House
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full stroke-brand-grey/40 fill-none stroke-[1.2]" id="schem-dickens">
            {/* Bioclimatic curve roof line */}
            <path d="M 50,150 Q 200,60 350,150" className="stroke-brand-black/60 stroke-[1.8]" />
            <rect x="80" y="130" width="240" height="100" className="stroke-brand-black/45" />
            {/* Solar sun angle lines showing solar passive study */}
            <line x1="160" y1="40" x2="260" y2="170" className="stroke-[#d9a93f] stroke-[1]" strokeDasharray="5,2" />
            <circle cx="152" cy="30" r="8" className="stroke-[#d9a93f] fill-[#d9a93f]/10" />
            <text x="168" y="33" className="fill-[#d9a93f] font-sans text-[7px] font-bold">WINTER SUN ANGLE: 34°</text>
            <line x1="280" y1="30" x2="240" y2="130" className="stroke-brand-orange/60" strokeDasharray="4,4" />
            <circle cx="288" cy="22" r="8" className="stroke-brand-orange fill-brand-orange/10" />
            <text x="302" y="25" className="fill-brand-orange font-sans text-[7px] font-bold">SUMMER ANGLE: 68° (SHADED)</text>
            <text x="80" y="255" className="fill-[#7A7870] font-mono text-[8px] uppercase">BIOCLIMATIC SUN-TRACKING SIMULATOR</text>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col w-full text-brand-black bg-brand-white" id="page-home-root">
      
      {/* 1. HERO HOME WITH FULL-SCREEN INTERACTIVE SLIDER/CAROUSEL (STICKY FOR PARALLAX OVERLAP) */}
      <section className="sticky top-0 h-[90vh] w-full bg-[#131312] flex flex-col justify-end overflow-hidden z-0" id="hero-sliding-stage">
        
        {/* Crisp soft vignette only at the bottom 50% for absolute text readability without dark masking the rest of the canvas */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/20 to-transparent pointer-events-none z-10" />

        {/* Dynamic Project Indicator/Eyebrow on Top Right - repositioned to avoid navbar overlap */}
        <div className="absolute top-24 md:top-28 right-6 md:right-12 text-right z-20 font-sans select-none hidden sm:block">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#C4B99A] block mb-1">
            Karya Utama Pilihan
          </span>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeHeroIdx}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.35 }}
              className="space-y-0.5"
            >
              <strong className="text-white text-sm tracking-widest uppercase block drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                {heroSlides[activeHeroIdx].title}
              </strong>
              <div className="text-[10px] text-white/50 space-x-2 drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
                <span>{heroSlides[activeHeroIdx].location}</span>
                <span>·</span>
                <span>{heroSlides[activeHeroIdx].year}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sliding Background Frame Placeholder Simulating Architect Study */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeHeroIdx}
              initial={{ scale: 1.12, opacity: 0 }}
              animate={{ scale: 1.03, opacity: 0.95 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute inset-0 flex items-center justify-center bg-zinc-900"
              style={{
                backgroundImage: `url(${heroSlides[activeHeroIdx].imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                scale: 1.03
              }}
            >
              <div className="opacity-10 w-[85%] max-w-[500px] z-20 pointer-events-none mix-blend-screen">
                {renderVectorDrawing(activeHeroIdx)}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Main Hero Copy Container */}
        <div className="relative z-20 max-w-4xl px-6 md:px-12 pb-16 md:pb-24" id="hero-main-content">
          <span className="text-[10px] uppercase tracking-[0.25em] text-brand-orange font-bold block mb-4 gsap-stagger-item">
            (OH ARCHITECTURE &amp; BUILD)
          </span>

          <div className="min-h-[220px] flex flex-col justify-end gsap-stagger-item">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeHeroIdx}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className="space-y-4"
              >
                <div className="inline-block px-2.5 py-0.5 border border-[#C4B99A]/45 text-[#C4B99A] text-[9px] uppercase tracking-widest font-sans font-medium animate-pulse">
                  {heroSlides[activeHeroIdx].type}
                </div>
                <h1 className="font-sans text-3.5xl xs:text-4.5xl sm:text-7xl md:text-8.5xl font-black text-white uppercase leading-[0.9] tracking-tighter drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
                  {heroSlides[activeHeroIdx].displayTitle}
                  <br />
                  <span className="text-[#C4B99A] text-2.5xl xs:text-3.5xl sm:text-5xl md:text-7.5xl">RANCANGAN PRESISI</span>
                </h1>
                <p className="font-serif italic text-base sm:text-lg text-white/95 max-w-2xl leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]">
                  <strong className="font-sans not-italic uppercase tracking-widest text-xs text-brand-orange font-semibold mr-2">
                    {heroSlides[activeHeroIdx].title} // {heroSlides[activeHeroIdx].location}
                  </strong>
                  — {heroSlides[activeHeroIdx].tagline}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex flex-wrap gap-4 mt-10 gsap-stagger-item">
            <button
              onClick={() => onNavigate('works')}
              className="px-8 py-3.5 border border-white/60 text-white text-xs uppercase tracking-[0.16em] hover:bg-white/10 transition-colors font-medium flex items-center gap-1.5 focus:outline-none cursor-pointer"
            >
              Jelajahi Portofolio <span>→</span>
            </button>
            <button
              onClick={() => onNavigate('kalkulator-rab')}
              className="px-8 py-3.5 bg-brand-orange text-white text-xs uppercase tracking-[0.16em] hover:bg-brand-orange-hover transition-colors font-semibold flex items-center gap-1.5 focus:outline-none shadow-md cursor-pointer"
            >
              Hitung Estimasi RAB
            </button>
          </div>
        </div>

        {/* Carousel Slide Indicators and Navigation Ticks with real-time progress bar */}
        <div className="absolute bottom-6 left-6 md:left-12 z-20 flex items-center gap-5 select-none font-sans">
          {heroSlides.map((slide, sIdx) => (
            <button
              key={slide.num}
              onClick={() => setActiveHeroIdx(sIdx)}
              className="flex items-center gap-2 text-[10px] focus:outline-none cursor-pointer group py-2"
            >
              <span className={`transition-all duration-350 font-mono tracking-tighter ${activeHeroIdx === sIdx ? 'text-[#E05C38] scale-110 font-bold' : 'text-white/45 group-hover:text-white'}`}>
                {slide.num}
              </span>
              <span className="relative h-[2px] bg-white/15 overflow-hidden w-10 sm:w-14 rounded-full block">
                {activeHeroIdx === sIdx ? (
                  <motion.span
                    key={`bar-${sIdx}`}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 7, ease: 'linear' }}
                    className="absolute left-0 top-0 bottom-0 bg-[#E05C38]"
                  />
                ) : (
                  <span className="absolute left-0 top-0 bottom-0 bg-transparent transition-all w-0" />
                )}
              </span>
            </button>
          ))}
        </div>

        {/* Scroll down indicator line */}
        <div className="absolute bottom-6 right-6 md:right-12 text-white/45 text-[9px] uppercase tracking-[0.25em] hidden sm:flex items-center gap-2.5 z-20 font-sans pointer-events-none select-none">
          <span>Gulir ke Bawah</span>
          <div className="w-[1px] h-9 bg-white/20 animate-bounce" />
        </div>
      </section>

      {/* 2. OVERLAPPING CANVAS CONTENT (ROLLS OVER THE STICKY HERO FOR MECHANICAL BLIND PARALLAX REVEAL) */}
      <div className="relative z-20 bg-brand-white shadow-[0_-20px_50px_rgba(0,0,0,0.18)] mt-[85vh] border-t border-brand-black/5" id="parallax-overlapping-canvas">

      {/* 2. INFINITE MARQUEE BANNER */}
      <div className="bg-brand-white border-t border-b border-brand-black/10 py-5 overflow-hidden w-full flex" id="section-marquee-sticker">
        <div className="animate-marquee whitespace-nowrap flex gap-12 text-[10px] sm:text-xs uppercase tracking-[0.18em] text-[#7A7870] font-sans">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-12 items-center shrink-0">
              <span className="font-semibold">Studio Arsitektur &amp; Desain Interior</span>
              <span className="text-brand-orange text-lg">·</span>
              <span className="font-serif lowercase italic text-[#1A1A18]">Mewujudkan Hunian Presisi Berkarakter</span>
              <span className="text-brand-orange text-lg">·</span>
              <span className="font-semibold">Pendekatan Desain Kolaboratif &amp; Humanis</span>
              <span className="text-brand-orange text-lg">·</span>
              <span className="font-serif lowercase italic text-[#1A1A18]">Harmoni Arsitektur Tropis Berkelanjutan</span>
              <span className="text-brand-orange text-lg">·</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. CORE DESIGN PASSIONS / VALUES TABS ACCORDION */}
      <section className="bg-[#EDEAE3] py-24 px-6 md:px-12 border-b border-[#D6D2C8] w-full" id="ethics-accordion-section">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Column A: Sticky Heading and Navigator */}
          <div className="lg:col-span-12 xl:col-span-5 flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-[0.22em] text-[#7A7870] block mb-4">
                (Prinsip &amp; Pendekatan Desain Kami)
              </span>
              <h2 className="font-serif text-3.5xl sm:text-4.5xl md:text-5xl font-light text-[#1A1A18] leading-[1.08] tracking-tight">
                Mendesain ruang dengan kejujuran struktur dan kenyamanan alami
              </h2>
              <p className="text-[#7A7870] font-sans text-xs sm:text-sm leading-relaxed mt-4 max-w-sm">
                Kami percaya bahwa tiap karya arsitektur lahir dari perpaduan hangat antara impian Anda, keasrian alam tropis, kejelasan anggaran, serta keindahan material aslinya yang berkarakter.
              </p>
            </div>

            {/* Quick buttons */}
            <div className="flex flex-col gap-2 mt-8 lg:mt-16 border-l border-[#D6D2C8] pl-2 relative">
              {[
                { id: 'passive', label: 'Studi Desain Pasif', icon: Compass },
                { id: 'budget', label: 'Transparansi Anggaran', icon: CircleDollarSign },
                { id: 'material', label: 'Kejujuran Material', icon: Shield },
                { id: 'flow', label: 'Alur Ruang Intuitif', icon: PencilRuler }
              ].map((tab) => {
                const isActive = activeTabEthos === tab.id;
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTabEthos(tab.id as any)}
                    className={`relative w-full py-3 px-4 text-left text-xs uppercase tracking-widest font-semibold transition-all duration-300 focus:outline-none cursor-pointer flex items-center gap-3 z-10 select-none ${
                      isActive ? 'text-[#E05C38] font-bold' : 'text-brand-grey hover:text-brand-black'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="ethosActiveTabPill"
                        className="absolute inset-0 bg-[#EDEAE3] rounded-xs -z-10 border-l-2 border-[#E05C38] pl-2 shadow-xs"
                        style={{ background: 'rgba(214,210,200,0.15)' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                      />
                    )}
                    <IconComponent className={`w-4 h-4 shrink-0 transition-transform duration-300 ${isActive ? 'scale-110 rotate-12' : 'opacity-70 group-hover:opacity-100'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Column B: Dynamic visual presentation detail */}
          <div className="lg:col-span-12 xl:col-span-7 bg-brand-white border border-[#D6D2C8] p-8 md:p-12 shadow-sm rounded-xs flex flex-col justify-between min-h-[360px]">
            <AnimatePresence mode="wait">
              {activeTabEthos === 'passive' && (
                <motion.div
                  key="passive"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 text-brand-orange text-xs font-mono tracking-widest uppercase font-bold">
                    [01 · DESAIN TROPIS PASIF]
                  </div>
                  <h3 className="font-serif text-2.5xl sm:text-3.5xl text-brand-black font-normal leading-tight">
                    Memaksimalkan sirkulasi udara alami dan pencahayaan yang teduh
                  </h3>
                  <p className="text-sm text-brand-grey leading-relaxed">
                    Rumah tropis yang ideal harus bisa bernapas bebas. Kami merancang tata letak bangunan agar selalu sejuk sepanjang hari dengan memanfaatkan arah embusan angin dan meminimalkan paparan panas matahari langsung. Melalui bukaan jendela yang strategis, sirkulasi vertikal, dan kisi-kisi kayu, hunian Anda tetap terasa nyaman tanpa harus bergantung sepenuhnya pada pendingin udara.
                  </p>
                  <div className="grid grid-cols-2 gap-4 border-t border-[#D6D2C8]/60 pt-6 font-sans">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-brand-grey block">Kenyamanan Termal</span>
                      <strong className="text-xs text-brand-black">Aliran udara mengalir alami tanpa pengap</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-brand-grey block">Orientasi Kedudukan</span>
                      <strong className="text-xs text-brand-black">Mengurangi paparan terik matahari langsung</strong>
                    </div>
                  </div>
                </motion.div>
              )}
 
              {activeTabEthos === 'budget' && (
                <motion.div
                  key="budget"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 text-brand-orange text-xs font-mono tracking-widest uppercase font-bold">
                    [02 · KETERBUKAAN ANGGARAN]
                  </div>
                  <h3 className="font-serif text-2.5xl sm:text-3.5xl text-brand-black font-normal leading-tight">
                    Perencanaan biaya yang terbuka sejak langkah pertama
                  </h3>
                  <p className="text-sm text-brand-grey leading-relaxed">
                    Bagi kami, kepercayaan dimulai dari keterbukaan biaya. Kami berkomitmen penuh untuk menghindari pembengkakan anggaran saat masa konstruksi berlangsung. Melalui sistem perhitungan RAB yang terintegrasi, Anda bisa memantau estimasi kebutuhan biaya sejak tahap perencanaan denah awal secara transparan dan akurat.
                  </p>
                  <div className="grid grid-cols-2 gap-4 border-t border-[#D6D2C8]/60 pt-6 font-sans">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-brand-grey block">Rencana Anggaran</span>
                      <strong className="text-xs text-brand-black">Deviasi estimasi minimal di bawah ±5%</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-brand-grey block">Acuan Harga Lokal</span>
                      <strong className="text-xs text-brand-black">Berdasarkan harga material aktual di lapangan</strong>
                    </div>
                  </div>
                </motion.div>
              )}
 
              {activeTabEthos === 'material' && (
                <motion.div
                  key="material"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 text-brand-orange text-xs font-mono tracking-widest uppercase font-bold">
                    [03 · KEJUJURAN MATERIAL]
                  </div>
                  <h3 className="font-serif text-2.5xl sm:text-3.5xl text-brand-black font-normal leading-tight">
                    Mengekspos keindahan alami material yang berkarakter
                  </h3>
                  <p className="text-sm text-brand-grey leading-relaxed">
                    Setiap material memiliki jiwanya sendiri. Kami senang menggunakan elemen-elemen alami yang semakin indah seiring berjalannya waktu—seperti kayu solid, batu alam lokal, semen bertekstur, dan ubin terakota. Dengan meminimalkan lapisan finishing sintetis yang tebal, kami menghadirkan karakter asli material yang ramah di mata dan hangat disentuh.
                  </p>
                  <div className="grid grid-cols-2 gap-4 border-t border-[#D6D2C8]/60 pt-6 font-sans">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-brand-grey block">Kayu Keras Pilihan</span>
                      <strong className="text-xs text-brand-black">Hanya memakai kayu bersertifikat legal resmi</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-brand-grey block">Apresiasi Tekstur</span>
                      <strong className="text-xs text-brand-black">Karakter asri dari serat alami tanpa penutup cat</strong>
                    </div>
                  </div>
                </motion.div>
              )}
 
              {activeTabEthos === 'flow' && (
                <motion.div
                  key="flow"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-2 text-brand-orange text-xs font-mono tracking-widest uppercase font-bold">
                    [04 · ALUR RUANG INTUITIF]
                  </div>
                  <h3 className="font-serif text-2.5xl sm:text-3.5xl text-brand-black font-normal leading-tight">
                    Transisi ruang yang mengalir luwes dan terasa luas
                  </h3>
                  <p className="text-sm text-brand-grey leading-relaxed">
                    Rumah tidak semestinya terasa seperti labirin yang kaku dan sempit. Kami merancang hubungan antarruang yang menyatu dengan lembut dan minim sekat tebal. Desain kami mendekatkan area santai keluarga dengan hijaunya taman luar, menciptakan pengalaman ruang yang luas, dinamis, dan selalu menyambut dengan hangat.
                  </p>
                  <div className="grid grid-cols-2 gap-4 border-t border-[#D6D2C8]/60 pt-6 font-sans">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-brand-grey block">Keluwesan Layout</span>
                      <strong className="text-xs text-brand-black">Zonasi adaptif &amp; ruang multi-fungsi</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-brand-grey block">Sinar Matahari Alami</span>
                      <strong className="text-xs text-brand-black">Cahaya menyinari setiap sudut sela ruangan</strong>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="mt-8 pt-4 flex gap-4 items-center">
              <span className="text-[10px] text-brand-grey font-mono uppercase tracking-widest">Panel Studi Interaktif</span>
              <div className="h-[1px] flex-grow bg-[#D6D2C8]" />
              <button
                onClick={() => onNavigate('studio')}
                className="text-xs uppercase tracking-wider text-brand-black font-bold flex items-center hover:opacity-70 cursor-pointer"
              >
                Pahami Studio Kami ↗
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. STUDIO STATEMENT WITH PARENTHESIS EXPLANATION */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20" id="section-about">
        <div className="flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#7A7870] mb-8 block font-sans">
              (Studio Kami)
            </span>
            <h2 className="font-serif text-3.5xl sm:text-4.5xl md:text-5xl font-light text-brand-black leading-[1.08] mb-8">
              Di OH, kami mendengar dahulu, merancang kemudian.
            </h2>
            <div className="space-y-6 text-[#7A7870] font-sans text-sm sm:text-base leading-relaxed max-w-md">
              <p>
                Kami percaya arsitektur seharusnya merupakan proses kolaboratif yang inklusif dan menyenangkan. Tim desainer kami membimbing Anda sepanjang perjalanan, mencocokkan respon iklim tropis yang fungsional dengan kehalusan struktural kelas atas.
              </p>
              <p>
                Kami tidak memaksakan ego personal arsitek, melainkan mendampingi impian Anda menjadi kenyataan nyata. Dengan mendalami kebiasaan keseharian, keunikan lahan, serta target batas anggaran Anda, kami menggubah rumah bernilai tinggi yang nyaman ditinggali selamanya.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('studio')}
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-black border-b border-brand-black pb-0.5 mt-10 w-fit hover:opacity-75 transition-opacity focus:outline-none"
          >
            KENALI TIM ARSITEK KAMI
          </button>
        </div>

        <div className="h-full min-h-[340px] sm:min-h-[460px] relative overflow-hidden flex flex-col justify-between border border-[#D6D2C8]/75 group shadow-sm bg-neutral-900 rounded-xs">
          {/* Background Image with stable render */}
          <div 
            className="absolute inset-0 scale-100 pointer-events-none group-hover:scale-105 transition-transform duration-700"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          {/* Overlay gradient to reinforce contrast for the typography */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/95 via-neutral-950/70 to-neutral-950/35 z-10 pointer-events-none" />

          <div className="text-[10px] uppercase font-mono text-white/50 tracking-widest flex justify-between items-center z-20 p-8 md:p-12 pb-0">
            <span>STUDI ELEVASI RESIDENSIAL</span>
            <span className="text-brand-orange font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-ping" /> ● FILOSOFI INTERAKSIAN
            </span>
          </div>

          <div className="flex flex-col gap-3 relative z-20 py-12 px-8 md:px-12">
            <span className="h-0.5 w-12 bg-brand-orange" />
            <blockquote className="font-serif italic text-lg sm:text-xl md:text-2xl text-white leading-snug font-light">
              "Kombinasi geometri arsitektural yang bersahaja dengan pemanfaatan ubin tanah liat lokal, tiang batu utuh, serta jalur cahaya alami yang tenang."
            </blockquote>
          </div>

          <div className="text-[10px] uppercase font-mono text-white/40 tracking-widest flex justify-between items-end z-20 p-8 md:p-12 pt-0">
            <span>OH ARCHITECTURE &amp; BUILD</span>
            <span>©ANDY MACPHERSON</span>
          </div>
        </div>
      </section>

      {/* 5. SELECTED PROJECTS LIST WITH INTERACTIVE BLUEPRINT PANEL COLS */}
      <section className="py-24 px-6 md:px-12 border-t border-[#D6D2C8] bg-brand-white" id="section-home-selected">
        <div className="max-w-7xl mx-auto">
          
          {/* Subsection Head */}
          <div className="flex justify-between items-end border-b border-brand-black/10 pb-6 mb-12">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#7A7870] mb-3 block font-sans font-bold">
                (Karya Pilihan Unggulan)
              </span>
              <h2 className="font-serif text-3.5xl sm:text-4.5xl text-brand-black font-light leading-none">
                Karya Terpilih
              </h2>
            </div>
            <div className="font-serif text-4xl sm:text-5xl font-light text-[#D6D2C8] select-none">
              06
            </div>
          </div>

          {/* Interactive Split Screen */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
            
            {/* Left side: Hover-sensitive Project List (col-span-7) */}
            <div className="lg:col-span-7 divide-y divide-[#D6D2C8]/60 flex flex-col justify-center">
              {selectedWorks.map((work, idx) => (
                <div
                  key={work.num}
                  onMouseEnter={() => setHoveredWorkIdx(idx)}
                  onClick={() => onNavigate('works')}
                  className={`grid grid-cols-12 gap-3 py-6 items-center cursor-pointer group transition-all duration-350 px-4 relative overflow-hidden ${hoveredWorkIdx === idx ? 'bg-[#EDEAE3] pl-6 border-l-3 border-[#E05C38]' : 'hover:bg-[#EDEAE3]/30 border-l-3 border-transparent'}`}
                >
                  <div className="col-span-1 text-[10px] font-bold text-brand-grey/80 tracking-widest font-mono">
                    {work.num}
                  </div>
                  <div className="col-span-7 flex items-center gap-2">
                    <span className={`font-serif text-xl sm:text-2xl text-brand-black leading-tight transition-transform duration-300 ${hoveredWorkIdx === idx ? 'translate-x-1 text-[#E05C38] font-medium' : 'group-hover:translate-x-1'}`}>
                      {work.title}
                    </span>
                    <ArrowUpRight className={`w-4 h-4 text-[#E05C38] opacity-0 -translate-y-1 translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 ${hoveredWorkIdx === idx ? 'opacity-100 translate-y-0 translate-x-0' : ''}`} />
                  </div>
                  <div className="col-span-4 text-right">
                    <span className="text-[10px] md:text-xs tracking-wider uppercase text-brand-grey font-sans block font-semibold">{work.location}</span>
                    <span className="text-[8.5px] uppercase tracking-widest text-[#E05C38] font-bold block mt-1 font-mono">{work.year}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right side: Dynamic Visual Blueprint Dashboard Cabinet (col-span-12 lg:col-span-5) - adjusted to blank solid white as requested */}
            <div className="lg:col-span-5 bg-white p-6 md:p-8 border border-[#D6D2C8] flex flex-col justify-between rounded-sm relative overflow-hidden min-h-[440px]">
              
              {/* Grid or structural sheet overlay removed to make a pure solid blank white workspace */}
              
              {/* Cabinet Heading */}
              <div className="relative z-10 flex justify-between items-center pb-4 border-b border-[#D6D2C8] select-none font-sans text-[9px] uppercase tracking-widest font-semibold text-brand-grey">
                <span>DOKUMEN RANCANGAN PRESISI</span>
                <span>ID: {selectedWorks[hoveredWorkIdx].num} // {selectedWorks[hoveredWorkIdx].year}</span>
              </div>

              {/* Dynamic Interactive/Blueprint Drawing Block - restored with highly polished 3D interactive construction canvas */}
              <div className="relative z-10 flex-grow flex items-center justify-center scale-95 md:scale-100 transition-all min-h-[340px] bg-white border border-[#D6D2C8]/35 mt-4 rounded-xs overflow-hidden">
                <div className="absolute inset-0 w-full h-full">
                  <ThreeInteractiveCanvas activeIdx={hoveredWorkIdx} />
                </div>
              </div>

              {/* Dynamic Metadata details */}
              <div className="pt-4 border-t border-[#D6D2C8] space-y-2.5 text-[10px] font-sans text-[#7A7870]">
                <div className="flex justify-between">
                  <span className="uppercase tracking-[0.1em] font-semibold text-brand-grey">Kategori/Fungsi:</span>
                  <strong className="text-brand-black font-serif italic text-xs">{selectedWorks[hoveredWorkIdx].desc}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="uppercase tracking-[0.1em] font-semibold text-brand-grey">Lokasi Tapak:</span>
                  <strong className="text-brand-black font-semibold">{selectedWorks[hoveredWorkIdx].location}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="uppercase tracking-[0.1em] font-semibold text-brand-grey">Material Struktural:</span>
                  <strong className="text-brand-black max-w-[200px] text-right text-[9px] font-semibold">{selectedWorks[hoveredWorkIdx].material}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="uppercase tracking-[0.1em] font-semibold text-brand-grey">Luas Bangunan:</span>
                  <strong className="text-[#E05C38] font-semibold font-mono">{selectedWorks[hoveredWorkIdx].area}</strong>
                </div>
              </div>

            </div>

          </div>

          {/* Bottom redirection */}
          <div className="text-right mt-14">
            <button
              onClick={() => onNavigate('works')}
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-black border-b border-brand-black pb-0.5 ml-auto hover:opacity-75 transition-opacity focus:outline-none cursor-pointer"
            >
              LIHAT SELURUH ARSIP KARYA
            </button>
          </div>
        </div>
      </section>

      {/* 6. OUR 6-STAGE ROADMAP RECAP */}
      <section className="py-24 px-6 md:px-12 bg-[#EDEAE3] border-t border-b border-[#D6D2C8]" id="section-home-process">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#7A7870] mb-4 block font-sans">
                (Alur Panduan Proses Kerja)
              </span>
              <h2 className="font-serif text-3.5xl sm:text-4.5xl md:text-5xl font-light text-[#1A1A18] leading-[1.08] tracking-tight">
                Dari goresan sketsa tangan awal hingga serah terima kunci fisik.
              </h2>
              <p className="text-brand-grey font-sans text-sm leading-relaxed mt-4 max-w-sm">
                Setiap proyek dirancang berjalan selaras melalui sistem kolaboratif enam tahapan kami yang sistematis, menjaga transparansi biaya pembangunan dan ketepatan regulasi.
              </p>
              <button
                onClick={() => onNavigate('process')}
                className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-black border-b border-[#1A1A18] pb-0.5 mt-8 w-fit hover:opacity-75 transition-opacity focus:outline-none cursor-pointer"
              >
                PELAJARI ALUR KERJA DETAIL KAMI
              </button>
            </div>
            {/* Visual stage panel */}
            <div className="h-68 relative overflow-hidden shadow-sm flex items-center justify-center border border-[#A8A49C] rounded-xs select-none bg-neutral-900 group">
              {/* Clean Background Image */}
              <div 
                className="absolute inset-0 scale-100 pointer-events-none transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: 'url("https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
            </div>
          </div>

          {/* The 6 grid cards brief */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
            {[
              { num: '01', title: 'Sketsa Gagasan Awal', desc: 'Konfirmasi komprehensif tapak bangunan dan mitigasi iklim mikro. Pembuatan draf tata letak awal sketsa tangan untuk menyelaraskan gagasan dasar serta pagu anggaran.' },
              { num: '02', title: 'Pengembangan Desain', desc: 'Verifikasi pedoman mutu material serta kejelasan struktur utama. Kami menyajikan gambar kerja 2D detail disertai visualisasi model digital 3D berkualitas.' },
              { num: '03', title: 'Perizinan & Kelayakan', desc: 'Pengurusan dokumen kelayakan lingkungan dan tata ruang daerah. Penyusunan paket administrasi perizinan demi ketepatan kepatuhan hukum konstruksi.' },
              { num: '04', title: 'Desain Interior & Detail', desc: 'Integrasi tekstur, detail kabinet fungsional, dan estetika perabot terpasang. Tim interior kami merancang sirkulasi udara kamar mandi, penataan ubin, serta fiting kayu.' },
              { num: '05', title: 'Gambar Rencana Struktur', desc: 'Koordinasi terpadu dengan instansi sertifikasi kelaikan teknis. Kami memadukan kelayakan rekayasa struktur untuk memastikan kemudahan legalitas bangunan.' },
              { num: '06', title: 'Gambar Kerja Lapangan', desc: 'Penyusunan gambar perencanaan teknik terperinci (DED). Dokumen detail arsitektur yang memandu pelaksana di lapangan terkait ketebalan material dan kepatuhan mutu.' }
            ].map((step) => (
              <div
                key={step.num}
                onClick={() => onNavigate('process')}
                className="bg-brand-white p-8 border border-[#D6D2C8] hover:border-brand-black transition-all duration-300 flex flex-col justify-between min-h-[200px] cursor-pointer group"
              >
                <div>
                  <div className="font-serif text-3xl font-light text-[#D6D2C8] group-hover:text-brand-orange transition-colors mb-4 border-b border-[#D6D2C8]/50 pb-2">
                    {step.num}
                  </div>
                  <h3 className="font-sans text-[11px] uppercase tracking-widest text-[#1A1A18] font-bold mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[11.5px] text-[#7A7870] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. HIGH-FIDELITY TESTIMONIAL VIEW FROM CARMEN */}
      <section className="relative overflow-hidden bg-brand-white" id="section-home-testimonial">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 border-b border-brand-black/10">
          
          <div className="lg:col-span-5 h-[340px] lg:h-auto min-h-[340px] relative flex flex-col justify-end p-8 overflow-hidden border-r border-[#D6D2C8] bg-neutral-900 group">
            {/* Clean Background Image */}
            <div 
              className="absolute inset-0 scale-100 pointer-events-none transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </div>

          <div className="lg:col-span-7 px-8 py-20 md:p-20 flex flex-col justify-center">
            <span className="text-brand-orange text-xs block mb-4">“</span>
            <blockquote className="font-serif italic text-lg sm:text-xl md:text-2xl text-[#1A1A18] leading-[1.62] mb-8 font-light">
              "Sejak pertemuan awal kami, saya sangat terkesan oleh antusiasme tulus dan keterbukan mereka dalam menyambut gagasan desain saya. Tim OH Architecture menumbuhkan kepercayaan diri yang luar biasa sejak awal. Mereka sangat peduli terhadap proyek ini; selama proses perancangan, mereka tekun mendengar dan berinteraksi secara positif, profesional, namun tetap bersahabat dan santai."
            </blockquote>
            <p className="text-[10px] tracking-[0.16em] uppercase text-[#7A7870] font-bold font-sans">
              Carmen — Pemilik Hunian Sidney House
            </p>
            <button
              onClick={() => onNavigate('works')}
              className="mt-6 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand-black border-b border-[#D6D2C8] pb-0.5 w-fit hover:border-[#1A1A18] transition-colors focus:outline-none cursor-pointer"
            >
              Detail Perancangan Sidney House →
            </button>
          </div>
        </div>
      </section>

      {/* 8. STATEMENT PRE-FOOTER CALL TO ACTION */}
      <section className="relative bg-[#1A1A18] text-brand-white py-28 px-6 md:px-12 overflow-hidden" id="section-prefoot-cta">
        <div className="absolute inset-x-0 bottom-0 py-6 border-t border-white/5 overflow-hidden w-full select-none pointer-events-none">
          <div className="animate-marquee whitespace-nowrap flex gap-10 font-serif text-[4vw] sm:text-[5vw] italic text-white/[0.03] leading-none select-none uppercase tracking-tight">
            {[...Array(3)].map((_, idx) => (
              <span key={idx}>
                MENCIPTAKAN RUANG YANG BERNAPAS · HARMONI MATERIAL SEJATI DAN KEHENINGAN ALAM · MENYELARASKAN INTEGRITAS STRUKTUR DENGAN KEHANGATAN HUNIAN · 
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-4">
          <div className="text-left">
            <h2 className="font-serif text-3.5xl sm:text-4.5xl font-light leading-tight text-white mb-3">
              Siap mewujudkan impian hunian ideal Anda berikutnya?
            </h2>
            <p className="text-white/40 text-xs tracking-wider uppercase font-sans">
              Simulasikan perkiraan RAB, buat draf denah awal secara instan, atau hubungi tim ahli kami.
            </p>
          </div>
          <div className="md:text-right">
            <button
              onClick={onOpenEnquiry}
              className="px-8 py-4 bg-brand-orange hover:bg-brand-orange-hover text-white text-xs uppercase tracking-[0.18em] transition-all font-semibold inline-flex items-center gap-2 focus:outline-none shadow-md cursor-pointer rounded-none"
            >
              MULAI SEKARANG →
            </button>
          </div>
        </div>
      </section>

      </div> {/* Close parallax-overlapping-canvas wrapping div */}

    </div>
  );
}
