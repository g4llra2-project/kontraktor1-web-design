/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ViewPath } from '../../types';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  currentView: ViewPath;
  onNavigate: (view: ViewPath) => void;
  onOpenEnquiry?: () => void;
}

export default function Navbar({ currentView, onNavigate, onOpenEnquiry }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Monitor window scrolling for floating overlay transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 280);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'works', label: 'Karya' },
    { id: 'studio', label: 'Studio' },
    { id: 'process', label: 'Alur Kerja' },
    { id: 'kalkulator-rab', label: 'Kalkulator RAB' },
  ] as const;

  const handleLinkClick = (id: ViewPath) => {
    onNavigate(id);
    setIsOpen(false);
  };

  const isDarkHeader = currentView === 'home' && !isScrolled;

  return (
    <>
      {/* 1. LAYERED NAVIGATION ENGINE */}
      <AnimatePresence mode="wait">
        {!isScrolled ? (
          /* ==================== STATE A: FULL STATIC OVERLAY NAVBAR ==================== */
          <motion.nav
            key="navbar-full"
            initial={{ opacity: 0, y: -20, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 240, damping: 24 }}
            className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
              isDarkHeader
                ? 'bg-gradient-to-b from-black/80 via-black/40 to-transparent pb-14 pt-6'
                : 'bg-brand-white/90 border-b border-brand-black/10 backdrop-blur-md py-5'
            }`}
          >
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
              {/* LOGO */}
              <button
                onClick={() => handleLinkClick('home')}
                className={`font-serif text-xl font-semibold tracking-wide focus:outline-none transition-all hover:tracking-wider duration-300 cursor-pointer ${
                  isDarkHeader ? 'text-white' : 'text-brand-black'
                }`}
                id="navbar-logo"
              >
                OH <span className={`font-sans text-[8px] xs:text-[10px] sm:text-xs uppercase tracking-widest font-light border-l pl-2 ml-2 xs:pl-2.5 xs:ml-2.5 leading-none transition-colors duration-300 ${
                  isDarkHeader ? 'text-white/50 border-white/15' : 'text-brand-grey border-brand-black/15'
                }`}>Architecture &amp; Build</span>
              </button>

              {/* DESKTOP NAV LINKS */}
              <ul className="hidden xl:flex items-center gap-8 self-stretch">
                {navLinks.map((link) => {
                  const isActive = currentView === link.id || (link.id === 'kalkulator-rab' && currentView === 'generator-denah');
                  return (
                    <li key={link.id} className="relative flex items-center h-full">
                      <button
                        onClick={() => handleLinkClick(link.id)}
                        className={`text-xs uppercase tracking-[0.14em] transition-colors focus:outline-none cursor-pointer py-1 font-semibold ${
                          isActive
                            ? 'text-brand-orange'
                            : isDarkHeader
                            ? 'text-white/75 hover:text-white'
                            : 'text-brand-dark-grey hover:text-brand-black'
                        }`}
                        id={`nav-link-${link.id}`}
                      >
                        {link.label}
                      </button>
                      {isActive && (
                        <motion.div
                          layoutId="navbar-active-under-indicator"
                          className="absolute bottom-[-22px] left-0 right-0 h-[2.5px] bg-[#E05C38]"
                          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                        />
                      )}
                    </li>
                  );
                })}
              </ul>

              {/* DESKTOP CTA */}
              <button
                onClick={() => onOpenEnquiry && onOpenEnquiry()}
                className={`hidden md:inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.15em] border px-5 py-2 transition-all duration-300 font-semibold rounded-none cursor-pointer focus:outline-none ${
                  isDarkHeader
                    ? 'text-white border-white hover:bg-white hover:text-brand-black'
                    : 'text-brand-black border-brand-black hover:bg-brand-black hover:text-brand-white'
                }`}
                id="nav-cta-btn"
              >
                Hubungi Kami <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              {/* MOBILE TRIGGER (ONLY WHEN NOT SCROLLED) */}
              <button
                onClick={() => setIsOpen(true)}
                className={`xl:hidden p-1.5 rounded-full transition-colors focus:outline-none cursor-pointer ml-auto ${
                  isDarkHeader ? 'text-white hover:bg-white/10' : 'text-brand-black hover:bg-brand-cream/60'
                }`}
                aria-label="Toggle Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </motion.nav>
        ) : (
          /* ==================== STATE B: COLLAPSED COMPACT FLOATING PILL ==================== */
          <motion.div
            key="navbar-pill"
            initial={{ opacity: 0, scale: 0.85, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -20 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="fixed top-5 left-0 right-0 z-40 max-w-7xl mx-auto px-6 md:px-12 pointer-events-none flex justify-between items-center"
          >
            {/* Minimal floating Branding Pill on Scroll */}
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.1 } }}
              onClick={() => handleLinkClick('home')}
              className="bg-brand-white/90 backdrop-blur-md md:inline-flex items-center gap-2 border border-brand-black/10 py-2.5 px-5 rounded-full shadow-md pointer-events-auto select-none hover:border-[#E05C38] transition-colors cursor-pointer hidden"
            >
              <span className="font-serif text-sm font-semibold text-brand-black tracking-wide">OH</span>
              <span className="w-[1px] h-3 bg-brand-black/15" />
              <span className="font-sans text-[9px] uppercase tracking-wider text-brand-dark-grey font-medium">Architecture</span>
            </motion.button>

            {/* Compact Right Side floating Pill Container with CTA & Menu */}
            <div className="bg-brand-white/90 backdrop-blur-md border border-brand-black/10 p-1.5 rounded-full shadow-lg pointer-events-auto flex items-center gap-1.5 ml-auto">
              <button
                onClick={() => onOpenEnquiry && onOpenEnquiry()}
                className="inline-flex items-center gap-1 px-4 py-2 text-[9px] uppercase tracking-[0.12em] font-bold text-brand-black hover:bg-brand-cream/65 rounded-full transition-all cursor-pointer focus:outline-none"
              >
                Hubungi Kami
              </button>
              
              <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-brand-black text-brand-white hover:bg-[#E05C38] rounded-full transition-all text-[9.5px] uppercase font-bold tracking-[0.14em] cursor-pointer focus:outline-none shadow-xs"
              >
                <Menu className="w-3.5 h-3.5" />
                <span>Menu</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== PREMIUM SLIDE-OVER DRAWER (HANDLES BOTH MODES) ==================== */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-neutral-950/40 backdrop-blur-xs z-50 cursor-pointer"
            />

            {/* Slider Sheet Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm sm:max-w-md bg-[#131211] text-brand-cream border-l border-brand-white/10 z-50 flex flex-col justify-between p-8 md:p-12 shadow-2xl"
              id="menu-sidebar-drawer"
            >
              {/* Header inside drawer */}
              <div className="flex justify-between items-center pb-6 border-b border-brand-white/10">
                <span className="font-serif text-lg tracking-wider font-semibold text-brand-white">
                  OH <span className="font-sans text-[9px] uppercase tracking-widest font-light text-[#C4B99A] pl-1.5">Studio</span>
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-brand-white/10 rounded-full transition-colors focus:outline-none cursor-pointer text-brand-white"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main links list with staggered custom fonts */}
              <nav className="my-auto py-8">
                <ul className="space-y-6">
                  {/* Home option in drawer */}
                  <li>
                    <button
                      onClick={() => handleLinkClick('home')}
                      className={`font-serif text-3xl md:text-4xl text-left block w-full transition-all focus:outline-none cursor-pointer hover:pl-3 ${
                        currentView === 'home' ? 'text-[#E05C38] font-semibold' : 'text-brand-white hover:text-[#C4B99A]'
                      }`}
                    >
                      Home
                    </button>
                  </li>
                  
                  {navLinks.map((link) => {
                    const isActive = currentView === link.id || (link.id === 'kalkulator-rab' && currentView === 'generator-denah');
                    return (
                      <li key={link.id}>
                        <button
                          onClick={() => handleLinkClick(link.id)}
                          className={`font-serif text-3xl md:text-4xl text-left block w-full transition-all focus:outline-none cursor-pointer hover:pl-3 ${
                            isActive ? 'text-[#E05C38] font-semibold' : 'text-brand-white/90 hover:text-[#C4B99A]'
                          }`}
                        >
                          {link.label}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Footer and contact details */}
              <div className="pt-8 border-t border-brand-white/10 space-y-4">
                <div className="text-[10px] font-mono tracking-widest uppercase text-[#7A7870]">
                  REKAN DESAIN PEMBANGUNAN ANDA
                </div>
                <div className="text-xs text-[#C4B99A]/80 font-sans space-y-1">
                  <p>Inquiry: support@oharchitecture.id</p>
                  <p>Jakarta / Bali / Brisbane</p>
                </div>
                
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenEnquiry && onOpenEnquiry();
                  }}
                  className="w-full text-center text-xs uppercase tracking-[0.15em] text-brand-black bg-brand-cream hover:bg-brand-white py-3.5 font-bold transition-all cursor-pointer focus:outline-none shadow-md mt-4"
                >
                  HUBUNGI KAMI SEKARANG
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
