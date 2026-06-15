/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ViewPath } from '../../types';
import { motion } from 'motion/react';
import { Shield, Sparkles, User, FileCheck, ArrowRight, Layers, Compass, Sun, Ruler } from 'lucide-react';
import NextImage from '../NextImage';
import { getStudioHeader, getTeamMembers, getSpecializations } from '../../lib/cmsData';

interface StudioViewProps {
  onNavigate: (view: ViewPath) => void;
  onOpenEnquiry: () => void;
}

export default function StudioView({ onNavigate, onOpenEnquiry }: StudioViewProps) {
  // CMS state loaders
  const [headerInfo] = useState(() => getStudioHeader());
  const [teamMembers] = useState(() => {
    const cmsTeam = getTeamMembers();
    const patterns = ['bg-[#1A1A18]/5 text-brand-black/10', 'bg-brand-orange/5 text-brand-orange/10', 'bg-[#B0AC9F]/10 text-[#4E4D48]/10'];
    return cmsTeam.map((m, idx) => ({
      ...m,
      bgPattern: patterns[idx % patterns.length]
    }));
  });
  const [specializations] = useState(() => {
    const cmsSpecs = getSpecializations();
    const icons = [Compass, Layers, Sun, Ruler];
    return cmsSpecs.map((s, idx) => ({
      ...s,
      icon: icons[idx % icons.length]
    }));
  });

  return (
    <div className="flex flex-col w-full text-brand-black bg-brand-white" id="page-studio-root">
      
      {/* 1. STUDIO HERO */}
      <section className="relative h-[65vh] min-h-[440px] w-full bg-[#1A1A18] flex flex-col justify-end px-6 md:px-12 py-16 overflow-hidden">
        <div className="absolute inset-0 bg-[#A8A49C]/15 z-0 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#1A1A18] to-transparent z-10" />

        <div className="relative z-10 max-w-4xl animate-fadeIn" id="studio-hero-content">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#E05C38] font-bold block mb-4 text-left">
            {headerInfo.eyebrow}
          </span>
          <h1 className="font-serif text-3.5xl sm:text-4.5xl md:text-5xl font-normal text-white leading-snug tracking-tight text-left">
            {headerInfo.heading}
          </h1>
          <p className="font-serif italic text-base sm:text-lg text-white/70 max-w-2xl mt-4 leading-relaxed text-left">
            {headerInfo.narrativeSubtitle}
          </p>
        </div>
      </section>

      {/* 2. DESIGN ETHOS ASYMMETRIC (Etos Perancangan dengan tata letak visual asimetris kustom) */}
      <section className="py-28 px-6 md:px-12 max-w-7xl mx-auto w-full border-b border-brand-black/10" id="section-studio-philosophy">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Left Column: Vertical Image with Staggered Caption */}
          <div className="lg:col-span-5 space-y-8 lg:mt-12">
            <div className="relative aspect-[3/4] bg-[#EDEAE3] overflow-hidden border border-[#D6D2C8]/50 rounded-xs group shadow-sm">
              <NextImage 
                src={headerInfo.studioExplorasiImageUrl || "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=80"}
                alt="Studio Eksperimen" 
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-105 pointer-events-none select-none"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/85 via-black/40 to-transparent text-white">
                <span className="font-mono text-[9px] uppercase tracking-widest text-brand-orange block font-bold">[Eksplorasi Ruang]</span>
                <span className="font-serif italic text-xs text-white/85 block mt-1">Studi proporsi volume, tata cahaya alami tropis, dan kejujuran materialitas.</span>
              </div>
            </div>
            
            <div className="border-l-2 border-brand-orange pl-4 space-y-2">
              <span className="text-[10px] uppercase tracking-widest text-[#7A7870] font-sans font-bold block">INTEGRITAS BENTUK //</span>
              <p className="font-sans text-xs text-brand-grey leading-relaxed">
                Kami menghindari detail kosmetik berlebih. Setiap elemen dirawat untuk menopang beban mekanis pasif, menyaring radiasi surya, atau meloloskan arah angin musiman.
              </p>
            </div>
          </div>

          {/* Right Column: Title, Narrative text, and Asymmetric Horizontal Image */}
          <div className="lg:col-span-7 space-y-12">
            <div className="space-y-4">
              <span className="text-[9px] uppercase tracking-[0.24em] text-brand-grey font-sans font-bold block text-left">
                // Etos Perancangan
              </span>
              <h2 className="font-serif text-4xl sm:text-5.5xl text-[#1A1A18] font-light leading-[1.05] tracking-tight text-left">
                {headerInfo.aboutHeading}
              </h2>
            </div>

            <div className="space-y-6 max-w-2xl leading-relaxed text-[#3C3A35] font-sans text-sm sm:text-base text-left">
              {headerInfo.aboutText.split('\n').filter(Boolean).map((para, pIdx) => (
                <p key={pIdx}>
                  {para}
                </p>
              ))}
            </div>

            {/* Asymmetric Overlapped Image */}
            <div className="relative aspect-[16/10] bg-[#EDEAE3] overflow-hidden border border-[#D6D2C8]/50 rounded-xs group shadow-md lg:translate-x-12">
              <NextImage 
                src={headerInfo.studioDetailImageUrl || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80"}
                alt="Detil Kejujuran Material" 
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-105 pointer-events-none select-none"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-[#1A1A18]/90 via-[#1A1A18]/45 to-transparent text-white flex justify-between items-end">
                <span className="font-serif text-xs italic text-white/90">Instalasi Kisi Bilah Kayu Cedar Adaptif</span>
                <span className="font-mono text-[9px] text-[#A8A49C] uppercase tracking-wider">[Myrtle Pavilion - Detail]</span>
              </div>
            </div>
            
          </div>

        </div>
      </section>

      {/* 3. MEET THE TEAM GRID WITH MOTION GRAPHICS AND CARDS (7 Members) */}
      <section className="py-28 px-6 md:px-12 max-w-7xl mx-auto w-full bg-brand-white" id="section-studio-team">
        <div className="mb-16 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-8 space-y-3">
            <span className="text-[10px] uppercase tracking-[0.2em] text-brand-orange font-sans font-bold block">
              // Tim Professional Kami
            </span>
            <h2 className="font-serif text-3.5xl sm:text-5xl text-[#1A1A18] font-normal leading-tight tracking-tight">
              Sosok Kreatif di Sisi Anda
            </h2>
            <p className="text-brand-grey font-sans text-xs max-w-xl leading-relaxed">
              Tim spesialis kami menggabungkan kualifikasi teknis tingkat tinggi, registrasi profesi dewan arsitek, serta rasa kecintaan mendalam pada kelestarian lingkungan hidup.
            </p>
          </div>
          
          <div className="md:col-span-4 text-left md:text-right">
            <span className="inline-block text-[9px] text-brand-orange font-bold font-mono border border-brand-orange/30 bg-brand-orange/5 px-3 py-1.5 rounded-full select-none tracking-wider">
              ✦ 7 TENAGA AHLI UTAMA
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 gap-y-12">
          {teamMembers.map((member, index) => (
            <motion.div 
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group cursor-pointer relative"
            >
              {/* Card Container with structural aesthetics */}
              <div className="relative aspect-[3/4.2] overflow-hidden mb-5 rounded-xs border border-[#D6D2C8] bg-[#EDEAE3] shadow-xs group-hover:shadow-lg group-hover:border-brand-black transition-all duration-500">
                
                {/* Visual underlay graphic: Initials & Technical Lines */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 ${member.bgPattern} transition-transform duration-700 group-hover:scale-102`}>
                  {/* Grid Lines mockup */}
                  <div className="absolute inset-4 border border-brand-black/[0.03] border-dashed pointer-events-none" />
                  
                  <div className="font-serif text-[110px] leading-none select-none font-extralight tracking-tighter opacity-80 filter blur-[0.5px]">
                    {member.initials}
                  </div>
                  
                  <div className="absolute top-6 left-6 text-[8px] font-mono tracking-widest text-[#7A7870] font-semibold select-none flex items-center gap-1">
                    <Layers className="w-2.5 h-2.5 text-brand-orange" />
                    <span>OH // PARTNER_{String(index + 1).padStart(2, '0')}</span>
                  </div>
                </div>

                {/* Always-on bottom ribbon wrapper */}
                <div className="absolute inset-x-0 bottom-0 p-5 bg-brand-white/80 backdrop-blur-md border-t border-[#D6D2C8]/40 z-10 flex justify-between items-center transition-all duration-500 group-hover:bg-brand-white">
                  <div className="space-y-0.5">
                    <span className="block text-[11px] font-mono text-brand-orange uppercase font-bold tracking-widest">[ANGGOTA_INTI]</span>
                    <span className="block text-10px text-brand-grey font-sans uppercase tracking-[0.1em]">BOARD OF DIRECTORS</span>
                  </div>
                  <div className="w-5 h-5 bg-brand-black text-white rounded-full flex items-center justify-center scale-90 group-hover:bg-brand-orange group-hover:scale-100 transition-all duration-300">
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>

                {/* Sliding Overlay for Credentials */}
                <div className="absolute inset-0 bg-[#1A1A18]/95 p-6 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-450 z-20" id={`team-credentials-drawer-${member.initials}`}>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-[#E05C38] font-sans font-bold">
                      <FileCheck className="w-3.5 h-3.5 text-brand-orange" />
                      <span>Sertifikasi Profesional</span>
                    </div>
                    
                    <p className="text-[11px] font-sans text-brand-white/85 leading-relaxed whitespace-pre-line border-l border-brand-orange/40 pl-3">
                      {member.credentials}
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[8px] text-white/50 font-sans tracking-widest uppercase">
                    <span>Dewan Arsitek Registrasi</span>
                    <Shield className="w-3 h-3 text-brand-orange" />
                  </div>
                </div>

              </div>

              {/* Title descriptions */}
              <div className="space-y-1">
                <h4 className="font-serif text-[16px] font-medium tracking-tight text-[#1A1A18] group-hover:text-brand-orange transition-colors duration-300">
                  {member.name}
                </h4>
                <p className="text-[10px] uppercase tracking-widest text-brand-grey font-sans">
                  {member.role}
                </p>
              </div>

            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. LAYANAN & SPESIALISASI STUDIO */}
      <section className="py-24 px-6 md:px-12 w-full bg-[#EDEAE3] border-t border-b border-[#D6D2C8]" id="section-studio-services">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16 items-start">
            <div className="lg:col-span-5 space-y-3">
              <span className="text-[10px] uppercase tracking-[0.2em] text-brand-orange font-sans font-bold block">
                // Keahlian & Layanan Spesialis
              </span>
              <h2 className="font-serif text-3.5xl sm:text-4.5xl text-[#1A1A18] font-normal leading-tight tracking-tight">
                Layanan Desain Komprehensif
              </h2>
            </div>
            <div className="lg:col-span-7">
              <p className="text-sm text-[#5E5C54] leading-relaxed font-sans max-w-2xl">
                Dari konsepsi gagasan awal hingga pengawasan detail konstruksi di lapangan, kami memberikan layanan terintegrasi yang memastikan setiap faset estetika dan fungsi bangunan bersinergi secara sempurna dengan kondisi iklim setempat.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
            {specializations.map((spec, idx) => {
              const SpecIcon = spec.icon;
              return (
                <motion.div
                  key={spec.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-brand-white p-8 rounded-sm border border-[#D6D2C8]/60 hover:border-brand-black transition-all duration-400 group flex flex-col justify-between h-full hover:shadow-md"
                  id={`spec-card-${spec.num}`}
                >
                  <div className="space-y-6">
                    {/* Card Top */}
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 rounded-xs bg-[#EDEAE3] border border-[#D6D2C8]/50 flex items-center justify-center group-hover:bg-brand-black group-hover:border-brand-black transition-colors duration-400">
                        <SpecIcon className="w-5 h-5 text-[#4E4D48] group-hover:text-brand-white transition-colors duration-400" />
                      </div>
                      <span className="font-mono text-2xl font-light text-brand-orange/20 group-hover:text-brand-orange transition-colors duration-400">
                        {spec.num}
                      </span>
                    </div>

                    {/* Card Middle */}
                    <div className="space-y-3">
                      <h3 className="font-serif text-lg font-medium text-[#1A1A18]">
                        {spec.title}
                      </h3>
                      <p className="text-xs text-brand-grey font-sans leading-relaxed">
                        {spec.desc}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom: Tags list */}
                  <div className="mt-8 pt-4 border-t border-[#D6D2C8]/30 flex flex-wrap gap-2">
                    {spec.highlights.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] font-mono uppercase tracking-wider text-[#7A7870] bg-[#EDEAE3]/40 px-2.5 py-1 rounded-sm border border-[#D6D2C8]/30"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. STUDIO CTA */}
      <section className="bg-brand-black text-brand-white py-20 px-6 md:px-12 text-center relative overflow-hidden" id="studio-foot-ready">
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl text-white">
            Siap merancang ruang ideal Anda berikutnya?
          </h2>
          <p className="font-serif italic text-base text-white/50">
            FOKUS PADA INTEGRITAS KUALITAS — DIKEMUDIKAN OLEH KREATIFITAS TANPA BATAS
          </p>
          <div className="pt-6">
            <button
              onClick={onOpenEnquiry}
              className="px-8 py-3.5 border border-white/55 text-white text-xs uppercase tracking-[0.18em] transition-all font-semibold hover:bg-white/10"
            >
              Ceritakan Rencana Proyek Anda →
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
