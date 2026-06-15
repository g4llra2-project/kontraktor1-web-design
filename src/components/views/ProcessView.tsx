/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ViewPath } from '../../types';
import { motion } from 'motion/react';
import { HelpCircle, FileText, Compass, Sparkles, Hammer, CheckSquare, Search, ClipboardCheck } from 'lucide-react';
import NextImage from '../NextImage';
import { getProcessIntro, getProcessStages } from '../../lib/cmsData';

interface ProcessViewProps {
  onNavigate: (view: ViewPath) => void;
  onOpenEnquiry: () => void;
}

export default function ProcessView({ onNavigate, onOpenEnquiry }: ProcessViewProps) {
  // CMS dynamic state loaders
  const [introInfo] = useState(() => getProcessIntro());
  const [processStages] = useState(() => getProcessStages());

  return (
    <div className="flex flex-col w-full text-brand-black bg-brand-white" id="page-process-root">
      
      {/* 1. PROCESS PAGE HERO */}
      <section className="relative px-6 md:px-12 pt-24 pb-16 max-w-7xl mx-auto w-full">
        <span className="text-[10px] uppercase tracking-[0.22em] text-brand-orange font-bold block mb-4 text-left">
          {introInfo.eyebrow}
        </span>
        <h1 className="font-serif text-3.5xl sm:text-5.5xl md:text-6.5xl font-light text-[#1A1A18] leading-[1.08] tracking-tight max-w-5xl text-left">
          {introInfo.heading}
        </h1>
      </section>

      {/* 2. APPROACH INTRO DESCRIPTION WITH PARALLAX ASYMMETRICAL LAYOUT */}
      <section className="px-6 md:px-12 pb-28 max-w-7xl mx-auto w-full border-b border-brand-black/10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left panel simulating real human discussion on-site with manual parallax offset (NextJS Opt) */}
          <div className="lg:col-span-6 relative group overflow-hidden bg-[#EDEAE3] rounded-xs border border-[#D6D2C8] shadow-md aspect-[4/3]">
            <NextImage 
              src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80"
              alt="Kolaborasi tim arsitek dan klien"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover absolute top-0 -translate-y-[10%] group-hover:translate-y-0 transition-transform duration-1000 ease-out pointer-events-none select-none"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 via-black/35 to-transparent text-white">
              <span className="font-mono text-[9px] uppercase tracking-widest text-brand-orange block font-bold text-left">[Diskusi Tapak]</span>
              <p className="font-serif italic text-xs text-white/80 mt-1 text-left">Interaksi intim memetakan kebutuhan unik ruangan bernapas.</p>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.18em] text-[#7A7870] font-sans font-bold block text-left">
                // Pendekatan Personalisasi Kami
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-brand-black font-light leading-snug text-left">
                Menerjemahkan visi abstrak ke dalam koordinasi materialitas yang nyata.
              </h3>
            </div>
            
            <div className="space-y-4 text-brand-grey text-sm sm:text-base leading-relaxed max-w-xl text-left">
              <p>
                {introInfo.para1}
              </p>
              <p>
                {introInfo.para2}
              </p>
            </div>

            <div className="pt-2 text-left">
              <button
                onClick={onOpenEnquiry}
                className="px-6 py-3.5 bg-brand-black text-brand-white hover:bg-brand-orange hover:text-brand-white transition-all text-xs font-semibold uppercase tracking-[0.16em] inline-flex items-center gap-1.5 shadow-sm rounded-xs"
              >
                Mulai Konsultasi Tapak Anda →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ASYMMETRICAL DETAILED STAGES WITH REAL SCROLL PARALLAX SYSTEM */}
      <section className="py-28 px-6 md:px-12 max-w-7xl mx-auto w-full id-stages-section">
        <div className="mb-20 space-y-3">
          <span className="text-[10px] uppercase tracking-[0.2em] text-brand-orange font-bold font-sans block">
            // DETIL SISTEMATIKA 6 TAHAP KERJA
          </span>
          <h2 className="font-serif text-3xl sm:text-4.5xl text-[#1A1A18] font-normal tracking-tight">
            Metodologi Teruji dari Gagasan ke Konstruksi
          </h2>
        </div>

        <div className="space-y-24 md:space-y-32">
          {processStages.map((stage, idx) => {
            const isEven = idx % 2 !== 0;
            return (
              <motion.div
                key={stage.num}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-120px" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="border-b border-[#D6D2C8]/50 pb-20 md:pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center"
              >
                
                {/* Narratives Column */}
                <div className={`lg:col-span-6 space-y-6 ${isEven ? 'lg:order-2' : ''}`}>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs font-bold text-brand-orange px-3 py-1 bg-brand-orange/5 border border-brand-orange/20 rounded-full tracking-wide">
                      Tahap {stage.num}
                    </span>
                    <span className="text-[9px] uppercase tracking-widest text-[#7A7870] font-sans font-semibold">
                      {stage.badge}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-serif text-2xl sm:text-3.5xl text-brand-black font-light leading-tight">
                      {stage.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-brand-grey leading-relaxed font-sans mt-2">
                      {stage.desc}
                    </p>
                  </div>

                  {/* Curated list of Technical Deliverables inside stage */}
                  <div className="pt-4 border-t border-[#D6D2C8]/30 space-y-2.5">
                    <span className="text-[10px] uppercase tracking-wider text-brand-black/40 font-mono font-bold block">
                      // Dokumen Hasil Deliverables:
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#4E4D48] font-sans">
                      {stage.deliverables.map((doc, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-2">
                          <CheckSquare className="w-3.5 h-3.5 text-brand-orange shrink-0 mt-0.5" />
                          <span className="leading-tight">{doc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Parallax Image Frame Column */}
                <div className={`lg:col-span-6 ${isEven ? 'lg:order-1' : ''}`}>
                  <div className="relative group overflow-hidden bg-[#EDEAE3] pointer-events-auto rounded-sm border border-[#D6D2C8]/80 shadow-md aspect-[16/11]">
                    
                    {/* Visual Parallax Element - absolute positioned slightly taller than frame container (NextJS Opt) */}
                    <NextImage
                      src={stage.imageUrl}
                      alt={stage.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover absolute top-0 -translate-y-[12%] group-hover:translate-y-0 transition-transform duration-[1200ms] ease-out select-none"
                    />

                    {/* Translucit administrative ribbon */}
                    <div className="absolute top-4 left-4 bg-brand-white/90 backdrop-blur-sm border border-[#D6D2C8]/50 py-1.5 px-3 rounded-full text-[9px] font-mono uppercase tracking-wider text-[#1A1A18] flex items-center gap-1">
                      <Search className="w-3 h-3 text-brand-orange" />
                      <span>STUDI REF_{stage.num}</span>
                    </div>

                    {/* Dark gradient vignette layer */}
                    <div className="absolute inset-0 bg-neutral-900/10 group-hover:bg-transparent transition-colors duration-500" />
                    
                    {/* Bottom overlay with technical metadata tag */}
                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 bg-gradient-to-t from-brand-black/90 via-brand-black/50 to-transparent text-white flex justify-between items-end opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-450">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-brand-orange flex items-center gap-1.5">
                        <ClipboardCheck className="w-3.5 h-3.5" />
                        {stage.tag}
                      </span>
                      <span className="text-[10px] font-serif italic text-white/60">OH Architecture Co.</span>
                    </div>

                  </div>
                </div>

              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. PROCESS FAQ / HELPLINE LINKING TO RAB CALCULATOR */}
      <section className="bg-[#EDEAE3] border-t border-b border-[#D6D2C8] py-20 px-6 md:px-12 w-full" id="section-process-faq">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-[10px] uppercase font-sans tracking-widest text-[#7A7870] flex items-center gap-1 font-bold">
              <HelpCircle className="w-4 h-4 text-brand-orange animate-pulse" /> Butuh Informasi Terkait Biaya Konstruksi?
            </span>
            <h4 className="font-serif text-2xl text-brand-black font-light leading-snug">Rencana Anggaran Biaya (RAB) &amp; Estimasi Nilai Pembangunan</h4>
            <p className="text-xs sm:text-sm text-brand-grey leading-relaxed">
              Kami meyakini komparasi RAB di muka sebagai pondasi kepercayaan. Kami menyediakan simulasi perhitungan anggaran adaptif otomatis berbasis jenis pekerjaan struktur dan spesifikasi interior. Sederhanakan perhitungan Anda dalam hitungan detik!
            </p>
          </div>
          <button
            onClick={() => onNavigate('kalkulator-rab')}
            className="px-6 py-4 bg-brand-black text-white hover:bg-brand-orange hover:text-white transition-all text-xs font-semibold uppercase tracking-[0.16em] inline-flex items-center gap-2 focus:outline-none shrink-0 rounded-xs shadow-md"
          >
            Hitung Simulasi RAB Sekarang →
          </button>
        </div>
      </section>

    </div>
  );
}
