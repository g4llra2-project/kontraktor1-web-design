/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ViewPath } from '../../types';
import { HelpCircle } from 'lucide-react';

interface ProcessViewProps {
  onNavigate: (view: ViewPath) => void;
  onOpenEnquiry: () => void;
}

export default function ProcessView({ onNavigate, onOpenEnquiry }: ProcessViewProps) {
  // Rincian 6 Process stages details matching process mockup precisely!
  const processStages = [
    {
      num: '01',
      title: 'Sketsa Gagasan Awal (Sketch Design)',
      desc: 'Kami memulai dengan kunjungan langsung ke lokasi tapak dan diskusi kreatif mendalam untuk menyelaraskan impian, preferensi gaya, serta kebutuhan fungsional ruang Anda. Kami juga memetakan potensi keindahan tapak pasif matahari sekaligus batas sirkulasi lingkungan. Melalui analisis ini, kami merangkai kumpulan sketsa gagasan gambar-tangan awal sebagai visualisasi dasar filosofi rancangan. Melalui proses diskusi dua arah yang hangat, konsep ini disempurnakan agar sesuai secara transparan dengan ekspektasi pagu biaya dan rencana jangka waktu pembangunan.',
      tag: 'Studi sketsa gagasan awal goresan tangan'
    },
    {
      num: '02',
      title: 'Pengembangan Desain & Visualisasi',
      desc: 'Pada tahap ini, tim kami menuangkan gagasan dasar menjadi detail rancangan siap pakai, mulai dari pemilihan material alam yang bernapas, integrasi batas area luar-dalam, sirkulasi draf perabot terpasang (joinery), hingga keterbukaan cahaya udara. Kami menyajikan gambar teknik 2D yang presisi disandingkan dengan model visualisasi digital 3D berkualitas tinggi yang menghidupkan gambaran suasana riil hunian masa depan Anda.',
      tag: 'Studi detail visualisasi model 3D terpadu'
    },
    {
      num: '03',
      title: 'Perizinan & Kelayakan Tata Ruang',
      desc: 'Tidak seluruh jenis proyek konstruksi wajib melewati proses asesmen tata ruang di instansi pemerintah daerah. Bila karakteristik bidang lahan Anda memerlukannya, kami akan mengawal penuh alur pengajuan tersebut. Mulai dari mengoordinasikan masukan dari ahli perencana wilayah, menyusun berkas kelayakan lingkungan para konsultan spesialis, hingga menuntaskan seluruh proses administrasi resmi.',
      tag: 'Penyusunan administrasi perizinan resmi daerah'
    },
    {
      num: '04',
      title: 'Desain Interior & Detail Sentuhan',
      desc: 'Kami merayu dan menyelaraskan area ruang-dalam agar menyatu padu dan berdialog mesra dengan struktur arsitektur utama hunian Anda. Perancang interior kami mendesain sirkulasi kenyamanan fungsional yang disesuaikan secara khusus bagi kebiasaan harian Anda. Kami merancang tata kabinet fungsional, pemilihan jenis ubin, fiting lampu beraksen hangat, hingga detail tekstur kayu pelapis alam.',
      tag: 'Pedoman kurasi material & keselarasan interior'
    },
    {
      num: '05',
      title: 'Rencana Detail Teknis & Kelayakan Struktur',
      desc: 'Sebelum pekerjaan konstruksi di lokasi dapat dimulai, rancangan arsitektur wajib memperoleh sertifikat kelayakan struktur dari lembaga sertifikasi berwenang. Tim kami menyiapkan, melaraskan, dan memegang kendali atas penyiapan seluruh dokumen perhitungan detail teknis kekuatan struktur bangunan guna memastikan kelancaran penerbitan legalitas kelaikan teknis pembangunan.',
      tag: 'Dokumentasi kelayakan rekayasa struktur sipil'
    },
    {
      num: '06',
      title: 'Gambar Kerja Lapangan (DED)',
      desc: 'Setelah seluruh detail keindahan interior dan legalitas sipil dirampungkan, kami memfokuskan pengerjaan pada Gambar Perencanaan Teknik Terinci (DED) yang komprehensif. Dokumen teknis yang sangat tebal dan detail ini menjadi kitab panduan mutlak bagi tim kontraktor pelaksana serta tukang ahli spesialis di lapangan guna menjamin ketepatan mutu pengerjaan konstruksi semenjak hari pertama.',
      tag: 'Gambar detail rekayasa pengerjaan bagi kontraktor'
    }
  ];

  return (
    <div className="flex flex-col w-full text-brand-black bg-brand-white" id="page-process-root">
      
      {/* 1. PROCESS PAGE HERO */}
      <section className="relative px-6 md:px-12 pt-20 pb-16 max-w-7xl mx-auto w-full">
        <span className="text-[10px] uppercase tracking-[0.22em] text-[#E05C38] font-bold block mb-4">
          (ALUR PROSES KERJA)
        </span>
        <h1 className="font-serif text-3.5xl sm:text-5xl md:text-6xl font-normal text-[#1A1A18] leading-[1.12] tracking-tight max-w-5xl">
          Arsitektur yang luar biasa tak hanya lahir dari bakat dan jam terbang, melainkan dari proses kolaborasi yang didasari rasa saling percaya.
        </h1>
      </section>

      {/* 2. APPROACH INTRO DESCRIPTION */}
      <section className="px-6 md:px-12 pb-24 max-w-7xl mx-auto w-full border-b border-brand-black/10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-end">
          {/* Left panel placeholder simulating professional consultant photo */}
          <div className="bg-[#EDEAE3] aspect-[4/3] rounded-xs shadow-md border border-[#D6D2C8] flex flex-col justify-center items-center p-6 group">
            <div className="absolute inset-0 bg-brand-black/5 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
            <div className="w-full h-full border border-dashed border-brand-grey/40 p-4 flex flex-col justify-between items-center text-center">
              <span className="text-[32px]">🤝</span>
              <span className="font-serif italic text-[#1A1A18]/70 text-sm">
                Studi konsultasi perencanaan tata rancang kreatif
              </span>
              <span className="text-[9px] font-mono text-brand-grey uppercase tracking-widest">
                ©Andy MacPherson
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <span className="text-[10px] uppercase tracking-[0.18em] text-[#7A7870] font-sans block">
              (Pendekatan Kami)
            </span>
            <div className="space-y-4 text-brand-grey text-sm leading-relaxed max-w-md">
              <p>
                Tim arsitek kami akan senantiasa mengawal dan mendampingi rencana pembangunan Anda secara jujur di tiap proses langkah perancangan — mulai dari sketsa gagasan dasar hingga serah terima bangunan fisik yang melampaui mimpi estetika awal Anda.
              </p>
              <p>
                Kami mengawali pertemuan tatap muka pertama dengan bersahabat demi menyimak visi prioritas hunian yang ingin Anda bangun. Berdasarkan hal tersebut, kami akan menyajikan rincian draf penawaran komprehensif dan rencana biaya kerja sama yang transparan.
              </p>
            </div>
            <button
              onClick={onOpenEnquiry}
              className="px-6 py-3 border border-brand-black text-brand-black hover:bg-brand-black hover:text-white transition-all text-xs font-semibold uppercase tracking-[0.16em] inline-flex items-center gap-1 mt-4"
            >
              Hubungi Tim Kami Sekarang →
            </button>
          </div>
        </div>
      </section>

      {/* 3. STICKY DETAILED STAGES */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto w-full">
        <span className="text-[10px] uppercase tracking-[0.2em] text-brand-grey font-sans block mb-12">
          (Rangkuman detail 6 tahapan kerja kami)
        </span>

        <div className="space-y-12">
          {processStages.map((stage, idx) => {
            const isEven = idx % 2 !== 0;
            return (
              <div
                key={stage.num}
                className="border-b border-[#D6D2C8] pb-16 pt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              >
                <div className={`lg:col-span-6 space-y-4 ${isEven ? 'lg:order-2' : ''}`}>
                  <div className="font-serif text-6xl sm:text-7xl md:text-8xl leading-none text-brand-orange/20 select-none">
                    {stage.num}
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-brand-black leading-tight">
                    {stage.title}
                  </h3>
                  <p className="text-sm text-brand-grey leading-relaxed font-sans max-w-lg">
                    {stage.desc}
                  </p>
                </div>

                <div className={`lg:col-span-6 ${isEven ? 'lg:order-1' : ''}`}>
                  {/* Stage Visual Placeholder */}
                  <div className="bg-[#EDEAE3]/65 border border-[#D6D2C8]/50 aspect-[4/3] rounded-sm flex items-center justify-center relative p-6">
                    <div className="w-full h-full border border-dashed border-[#D6D2C8]/80 flex flex-col justify-between items-center text-center py-6">
                      <div className="text-[32px]">📋</div>
                      <div className="font-serif text-sm italic text-brand-grey">
                        {stage.tag}
                      </div>
                      <span className="text-[9px] font-mono text-brand-grey uppercase tracking-widest">
                        OH-STAGE-{stage.num}-REF
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. PROCESS FAQ / HELPLINE */}
      <section className="bg-[#EDEAE3] border-t border-b border-[#D6D2C8] py-16 px-6 md:px-12 w-full">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-2 max-w-md">
            <span className="text-[10px] uppercase font-sans tracking-widest text-[#7A7870] flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-brand-orange" /> Butuh Informasi Terkait Biaya?
            </span>
            <h4 className="font-serif text-lg text-brand-black">Rencana Anggaran Biaya (RAB) &amp; Estimasi Nilai Pembangunan</h4>
            <p className="text-xs text-brand-grey leading-relaxed">
              Kami meyakini transparansi biaya sebagai kunci kepercayaan. Gunakan kalkulator RAB interaktif kami untuk menyimulasikan taksiran awal anggaran pembangunan secara instan!
            </p>
          </div>
          <button
            onClick={() => onNavigate('kalkulator-rab')}
            className="px-6 py-3.5 bg-brand-black text-white hover:bg-brand-orange hover:text-white transition-colors text-xs font-semibold uppercase tracking-[0.16em] inline-flex items-center gap-1.5 focus:outline-none shrink-0"
          >
            Hitung Simulasi RAB Anda →
          </button>
        </div>
      </section>

    </div>
  );
}
