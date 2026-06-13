/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { ViewPath } from '../../types';
import { ArrowDown, X, MapPin, Calendar, Maximize, Hammer, Check } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';

interface WorksViewProps {
  onNavigate: (view: ViewPath) => void;
  onOpenEnquiry: () => void;
}

// 1. Smooth scroll-parallax effect component
function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll position of this container relative to the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Map progress (0 to 1) to a slight translateY shift (-10% to 10%)
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden w-full h-full">
      <motion.img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        style={{ y, scale: 1.25 }} // Scale up slightly to prevent clean limits leakage
        className="w-full h-full object-cover transition-transform duration-700 ease-out"
      />
      {/* Soft gradient filter overlay */}
      <div className="absolute inset-0 bg-radial-gradient(circle_at_center,transparent_40%,rgba(26,26,24,0.15)_95%) pointer-events-none" />
    </div>
  );
}

// 2. Main WorksView Component
export default function WorksView({ onNavigate, onOpenEnquiry }: WorksViewProps) {
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [scrollPct, setScrollPct] = useState(0);
  const [selectedProj, setSelectedProj] = useState<typeof allProjects[0] | null>(null);
  const [activeTabDetail, setActiveTabDetail] = useState<'gagasan' | 'material' | 'teknis'>('gagasan');

  // List of high-quality architectural works with complete spec structures (No placeholders!)
  const allProjects = [
    { 
      id: '1', 
      title: 'Griya Jaloura Utama', 
      category: 'Rumah Baru', 
      sub: 'Paddington, QLD · Sedang Konstruksi',
      location: 'Paddington, QLD',
      year: '2026',
      area: '345 m²',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      materiality: 'Rangka beton pratekan kustom, dinding batu kapur kasar belah lokal, kusen kayu ulin regenerasi tahan cuaca, kaca berlapis ganda rendah emisi (low-e).',
      description: 'Griya Jaloura Utama bertumpu pada kontur perbukitan terjal Paddington. Dirancang dengan pendekatan tapak tertingkat, hunian dua lantai ini mengandalkan celah sirkulasi udara vertikal di bagian pusat untuk membuang udara panas secara alami melalui prinsip efek cerobong. Sirkulasi silang yang ekstensif memastikan suhu dalam ruangan tetap sejuk tanpa ketergantungan pada penyejuk udara mekanis.',
      details: [
        'Void sentral setinggi 6.2 meter bertindak sebagai jalur hembusan udara panas',
        'Tembok penahan tanah termal terintegrasi untuk mendinginkan pondasi dasar secara alami',
        'Tritisan atap kantilever sepanjang 2.4 meter melindungi kaca dari sengatan matahari barat'
      ]
    },
    { 
      id: '2', 
      title: 'Griya Jaloura Paviliun', 
      category: 'Rumah Baru', 
      sub: 'Paddington, QLD · Selesai 2024',
      location: 'Paddington, QLD',
      year: '2024',
      area: '185 m²',
      imageUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
      materiality: 'Struktur rangka kayu jati jawa bersertifikasi FSC, cladding luar lembaran baja corten protektif, lantai halus beton teraso abu-abu polesan tangan.',
      description: 'Sebuah paviliun kontemporer yang berdiri anggun sebagai perluasan sayap hunian lama Jaloura. Pendekatan minimalis struktural diekspresikan lewat detail sambungan purlin kayu tradisional yang presisi dan kolom baja langsing. Ruang tengah terbuka lebar menyatu dengan halaman rumput dan kolam reflektif, membusungkan pendinginan evaporatif ke seluruh ruang tidur.',
      details: [
        'Orientasi utara-selatan penuh guna memanen hembusan angin pasifik harian secara merata',
        'Pintu geser lipat kaca frameless untuk perluasan ruang transisi tanpa batas visual',
        'Lantai teraso pasif berkepadatan termal tinggi mereduksi fluktuasi naik-turun suhu ruangan'
      ]
    },
    { 
      id: '3', 
      title: 'Graha Roster Grange', 
      category: 'Komersial', 
      sub: 'Grange, QLD · Tahap Konstruksi 2026',
      location: 'Grange, QLD',
      year: '2026',
      area: '520 m²',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
      materiality: 'Blok roster tanah liat terakota panggang kustom, beton cor mentah bertekstur papan kayu cetakan asli, kisi-kisi aluminium anodized hitam.',
      description: 'Didesain sebagai markas studio kreatif multi-disiplin, Graha Roster Grange merevolusi selubung bangunan komersial dengan mengaplikasikan kulit dekoratif sekunder (double skin facade) berupa jajaran blok roster terakota buatan pengrajin lokal. Kulit berpori ini menyaring radiasi sinar matahari hingga 65%, menyisakan pendaran bayangan geometris puitis.',
      details: [
        'Metode kulit pelindung ganda menyerap beban termal luar sebelum sampai ke tembok dalam',
        'Konsep tata ruang terbuka fleksibel dengan sirkulasi udara sentral terkoneksi void atrium',
        'Sistem pemanenan air hujan terintegrasi pengairan taman gantung fasad otomatis'
      ]
    },
    { 
      id: '4', 
      title: 'Paviliun Tirta Myrtle', 
      category: 'Renovasi', 
      sub: 'Ascot, QLD · Karya Pilihan 2024',
      location: 'Ascot, QLD',
      year: '2024',
      area: '110 m²',
      imageUrl: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80',
      materiality: 'Kisi-kisi bilah kayu cedar merah barat daur ulang, lantai ubin batu andesit mentah bertekstur kasar, tiang penyangga baja hitam struktur tipis.',
      description: 'Paviliun luar ruangan yang melengkapi kolam renang infinity di kawasan pemukiman bernuansa sejarah Ascot. Atap datar yang diringankan ditopang oleh kolom baja ramping berjarak dinamis untuk meminimalkan dampak visual. Kisi-kisi kayu cedar dapat digeser secara adaptif, memadukan privasi mutlak dengan sirkulasi angin segar dari air kolam.',
      details: [
        'Mekanisme louvers cedar fleksibel berpivot atas-bawah penyesuai sudut arah semburan angin',
        'Batu alam andesit non-slip tahan lumut pemantul panas berlebih',
        'Bak penenang (overwash basin) kolam didesain mereduksi limpahan suara angin bising'
      ]
    },
    { 
      id: '5', 
      title: 'Vila Clifton Lestari', 
      category: 'Rumah Baru', 
      sub: 'Clifton Hill, QLD · Selesai 2023',
      location: 'Clifton Hill, QLD',
      year: '2023',
      area: '290 m²',
      imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      materiality: 'Dinding bata sisa pembongkaran pabrik daur ulang, panel atap baja seng berlapis seng-alumunium terisolasi, lantai kayu ek alami.',
      description: 'Vila keluarga modern yang menonjolkan tektonika material mentah dan jujur. Peletakan denah memanjang mengutamakan proteksi sisi barat menggunakan lorong fungsional tanpa jendela masif, sedangkan ruang hidup utama di sisi timur sepenuhnya dipasangi jendela kaca tinggi. Desain atap miring asimetris berfungsi mengalirkan air hujan ke tangki bawah tanah.',
      details: [
        'Dinding bata tebal gantung ganda dengan rongga udara isolasi hantaran hawa luar',
        'Struktur kantilever beton tebal menaungi teras bersantai dari cuaca hujan ekstrem',
        'Kalkulasi atap miring optimal terintegrasi panel sel surya fotovoltaik'
      ]
    },
    { 
      id: '6', 
      title: 'Wisma Sidney Tropis', 
      category: 'Rumah Baru', 
      sub: 'Alderley, QLD · Penghargaan Arsitekur 2023',
      location: 'Alderley, QLD',
      year: '2023',
      area: '320 m²',
      imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      materiality: 'Pondasi batu kali belah belantara lokal, tiang kayu jati jawa tua daur ulang, detail flensa penghubung kuningan cuaca.',
      description: 'Pemenang Penghargaan Arsitekur Regional, Wisma Sidney Tropis adalah contoh rancang bangunan yang bersatu padu dengan ekosistemnya. Pondasi batu kali mengangkat tingkat lantai dasar hingga 1.2 meter di atas tanah untuk menghindari kelembapan tropis, sekaligus memberikan sirkulasi udara konstan di bawah rongga lantai kayu.',
      details: [
        'Konstruksi berkonsep rumah panggung modern vernakular bebas rembesan kelembapan tapak',
        'Ventilasi celah berventilasi udara di bawah bawah atap (soffit venting) pencegah akumulasi panas draf',
        'Peletakan dinding kayu sekat geser bermanuver penuh meminimalkan penggunaan AC'
      ]
    },
    { 
      id: '7', 
      title: 'Griya Haig Harmoni', 
      category: 'Renovasi', 
      sub: 'Haig, QLD · Tampil di Grand Designs AU',
      location: 'Haig, QLD',
      year: '2024',
      area: '230 m²',
      imageUrl: 'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80',
      materiality: 'Penggunaan kembali struktur pondok kayu eucalyptus heritase, panel dinding kaca tempered argon ganda, tangga semen ekspos monolitik.',
      description: 'Renovasi dramatis atas pondok kayu klasik bersejarah. Kami melestarikan struktur utama pondok kayu depan yang ikonik, lalu membentangkan bagian perluasan belakang menjadi volume struktur kaca gantry berlapis tinggi yang spektakuler. Konstruksi void masif ini menjamin limpahan sinar mentari pagi menerangi interior secara merata.',
      details: [
        'Void ganda setinggi 7.2 meter menghubungkan ruang tengah lantai satu dan loteng baca atas',
        'Penyelamatan kayu eucalyptus historis diolah kembali menggunakan wax lebah ramah lingkungan',
        'Jendela atap (skylight) otomatis terintegrasi sensor hujan otomatis menutup saat cuaca mendung'
      ]
    },
    { 
      id: '8', 
      title: 'Apartemen Mowbray Senja', 
      category: 'Desain Interior', 
      sub: 'New Farm, QLD · Selesai 2023',
      location: 'New Farm, QLD',
      year: '2023',
      area: '145 m²',
      imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
      materiality: 'Panel kabinet built-in kayu cedar wangi, ubin keramik glazed buatan tangan kustom berpola air, pilar microcement abu-abu redup.',
      description: 'Intervensi desain ruang minimalis di lantai atas apartemen tepi sungai New Farm. Penataan difokuskan pada merapikan sekat ruang yang kaku dengan kabinet built-in melingkar terintegrasi. Kamar tidur utama diposisikan fleksibel menggunakan sekat kisi kayu berputar (rotating louvers) yang mengatur sejuknya hembusan sungai.',
      details: [
        'Partisi sekat bilah vertikal kayu cedar berputar 360 derajat pengatur privasi tidur dinamis',
        'Pencahayaan cove hangat ganda berlapis yang diintegrasikan otomatis demi kenyamanan rehat',
        'Kabinet gantung custom melayang mengoptimalkan ruang gerak horizontal lantai'
      ]
    },
    { 
      id: '9', 
      title: 'Townhouse Hawken Asri', 
      category: 'Rumah Baru', 
      sub: 'St Lucia, QLD · Selesai 2022',
      location: 'St Lucia, QLD',
      year: '2022',
      area: '410 m²',
      imageUrl: 'https://images.unsplash.com/photo-1602075433054-01d57ddd48be?auto=format&fit=crop&w=1200&q=80',
      materiality: 'Blok bata semen aerasi ringan (ALC), rangka baja ringan bergalvanis, ubin semen basah abu-abu industri.',
      description: 'Kompleks hunian kopel townhouse bertingkat tiga yang berdaya guna energi tinggi di St Lucia. Dirancang melingkari halaman dalam (inner courtyard) bertanam kerimbunan bambu hias yang memicu tarikan sirkulasi efek cerobong pendingin klaster pemukiman.',
      details: [
        'Taman dalam (inner courtyard) terbuka penampung hawa sejuk malam untuk dilepas siang hari',
        'Dinding pembatas beton aerasi dengan daya kedap suara antar unit hingga 55dB',
        'Instalasi atap pengumpul air bersirkulasi filter arang bambu murni'
      ]
    }
  ];

  const categories = ['Semua', 'Rumah Baru', 'Renovasi', 'Komersial', 'Desain Interior'];

  const filteredProjects = activeCategory === 'Semua'
    ? allProjects
    : allProjects.filter(p => p.category === activeCategory);

  // Monitor scroll positioning for unique numeric simulation counters
  useEffect(() => {
    const handleScroll = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable > 0) {
        const pct = Math.min(Math.round((window.scrollY / scrollable) * 100), 100);
        setScrollPct(pct);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Function mapping standard indices to precise editorial, staggered asymmetrical offsets (Desain Penataan Asimetris)
  const getAsymmetricStyles = (idx: number) => {
    const layouts = [
      {
        colSpan: 'col-span-12 lg:col-span-8',
        aspect: 'aspect-[3/2] sm:aspect-[16/10] lg:aspect-[21/9]',
        spacing: 'pt-0',
      },
      {
        colSpan: 'col-span-12 md:col-span-6 lg:col-span-4',
        aspect: 'aspect-[4/3] lg:aspect-[3/4]',
        spacing: 'lg:pt-20',
      },
      {
        colSpan: 'col-span-12 md:col-span-6 lg:col-span-5',
        aspect: 'aspect-[4/3]',
        spacing: 'lg:-mt-12',
      },
      {
        colSpan: 'col-span-12 lg:col-span-7',
        aspect: 'aspect-[3/2] md:aspect-[16/10]',
        spacing: 'lg:pl-8',
      },
      {
        colSpan: 'col-span-12 md:col-span-6 lg:col-span-4',
        aspect: 'aspect-[4/3] lg:aspect-[3/4]',
        spacing: 'lg:-mt-24',
      },
      {
        colSpan: 'col-span-12 md:col-span-6 lg:col-span-8',
        aspect: 'aspect-[3/2] sm:aspect-[16/10] lg:aspect-[16/8]',
        spacing: 'lg:pt-6',
      },
      {
        colSpan: 'col-span-12 md:col-span-6 lg:col-span-6',
        aspect: 'aspect-[4/3]',
        spacing: 'lg:-mt-8',
      },
      {
        colSpan: 'col-span-12 md:col-span-6 lg:col-span-6',
        aspect: 'aspect-[4/3]',
        spacing: 'lg:translate-y-16 lg:pb-16',
      },
      {
        colSpan: 'col-span-12',
        aspect: 'aspect-[3/2] sm:aspect-[16/10] lg:aspect-[21/7]',
        spacing: 'lg:pt-24 lg:pb-12',
      }
    ];

    return layouts[idx % layouts.length];
  };

  return (
    <div className="flex flex-col w-full text-brand-black bg-brand-white" id="page-works-root">
      
      {/* 1. Works Banner Header */}
      <section className="relative px-6 md:px-12 pt-20 pb-8 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
        <div className="md:col-span-8 space-y-4">
          <span className="text-[10px] uppercase tracking-[0.2em] text-brand-grey font-sans block">
            (Galeri Karya Portofolio)
          </span>
          <h1 className="font-serif text-5.5xl sm:text-7xl md:text-8.5xl font-normal tracking-tight text-[#1A1A18] leading-[0.9]">
            Karya Utama
          </h1>
          <p className="text-brand-grey font-sans text-xs sm:text-sm max-w-[480px] leading-relaxed pt-2">
            Peletakan dan tata rancang karya arsitektur tropis modern. Klik pada kartu visual proyek untuk membuka lembar spesifikasi bagan teknik, rincian material penyusun, serta konsep filosofis struktural terperinci.
          </p>
        </div>

        {/* Dynamic Project Match Counter Indicator */}
        <div className="md:col-span-4 text-left md:text-right font-serif text-[80px] leading-none text-brand-orange/15 relative select-none">
          <div className="absolute -top-6 right-0 text-[10px] uppercase tracking-[0.2em] text-brand-grey font-sans pointer-events-none">
            [Karya Terpilih]
          </div>
          {filteredProjects.length.toString().padStart(2, '0')}<span className="text-3xl text-brand-grey/40">/</span>{allProjects.length.toString().padStart(2, '0')}
        </div>
      </section>

      {/* 2. Category selection filters */}
      <section className="px-6 md:px-12 py-6 max-w-7xl mx-auto w-full border-b border-brand-black/10">
        <div className="flex flex-wrap gap-2 overflow-x-auto scrollbar-none pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 text-[10px] uppercase tracking-[0.16em] font-sans font-semibold border transition-all duration-200 select-none cursor-pointer rounded-none outline-none ${
                activeCategory === cat
                  ? 'bg-brand-black text-[#FFFFFF] border-brand-black'
                  : 'bg-brand-white text-brand-grey border-[#D6D2C8] hover:border-brand-black hover:text-brand-black'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 3. Guide info */}
      <section className="px-6 md:px-12 py-5 max-w-7xl mx-auto w-full flex justify-between items-center text-brand-grey text-[10px] uppercase font-sans tracking-[0.2em]">
        <div className="flex items-center gap-2">
          <div className="w-[8px] h-[8px] rounded-full bg-brand-orange animate-pulse" />
          <span>Klik salah satu karya untuk meneliti rincian spesifikasi rancangan</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>Skala dinamis parralax diaktifkan</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
        </div>
      </section>

      {/* 4. ASYMMETRIC WORKS GRID WITH PARALLAX IMAGES */}
      <section className="px-6 md:px-12 pb-32 max-w-7xl mx-auto w-full">
        {filteredProjects.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-[#D6D2C8] font-serif italic text-brand-grey text-lg">
            Tidak ditemukan karya arsitektur sesuai filter kategori ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-y-16 gap-x-6 md:gap-x-12 mt-8">
            {filteredProjects.map((p, idx) => {
              const sysStyles = getAsymmetricStyles(idx);
              return (
                <div
                  key={p.id}
                  onClick={() => {
                    setSelectedProj(p);
                    setActiveTabDetail('gagasan');
                  }}
                  className={`relative flex flex-col justify-between h-full overflow-hidden cursor-pointer group bg-[#EDEAE3] border border-[#D6D2C8]/50 transition-all duration-500 rounded-sm hover:border-brand-black hover:shadow-xl ${sysStyles.colSpan} ${sysStyles.spacing}`}
                  id={`works-card-${p.id}`}
                >
                  {/* Card top administrative tag */}
                  <div className="p-4 flex justify-between items-center bg-brand-white/70 backdrop-blur-sm border-b border-[#D6D2C8]/30 relative z-20 font-sans text-[9px] uppercase tracking-widest text-[#7A7870] font-semibold select-none">
                    <span>({String(idx + 1).padStart(2, '0')}) // {p.category}</span>
                    <span className="text-brand-orange font-bold font-mono">{p.year}</span>
                  </div>

                  {/* Parallax Image stage */}
                  <div className={`relative w-full overflow-hidden flex-grow ${sysStyles.aspect} z-10 min-h-[280px] sm:min-h-[340px]`}>
                    <ParallaxImage src={p.imageUrl} alt={p.title} />
                    
                    {/* Darkened subtle overlay on card hover */}
                    <div className="absolute inset-0 bg-neutral-950/20 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </div>

                  {/* Card Metadata details board */}
                  <div className="p-5 sm:p-6 bg-brand-white relative z-20 flex flex-col justify-between border-t border-[#D6D2C8]/40 h-28">
                    <div>
                      <h3 className="font-serif text-[18px] sm:text-[21px] text-[#1A1A18] leading-tight font-normal group-hover:text-brand-orange transition-colors duration-300">
                        {p.title}
                      </h3>
                      <p className="text-brand-grey font-sans text-[11px] mt-1 line-clamp-1">
                        {p.sub}
                      </p>
                    </div>
                    <div className="flex justify-between items-center pt-2.5 border-t border-dashed border-[#D6D2C8]/40 mt-1 select-none">
                      <span className="font-mono text-[9px] text-[#7A7870] uppercase tracking-wider">{p.area} // {p.location}</span>
                      <span className="text-[9px] uppercase font-sans tracking-[0.15em] text-brand-black font-bold border-b border-brand-black pb-0.5 scale-90 origin-right sm:opacity-0 sm:group-hover:opacity-100 sm:group-hover:scale-100 transition-all duration-300">
                        Bagan Spesifikasi →
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* INTERACTIVE DETAIL SPEC DRAWER MODAL OVERLAY */}
      <AnimatePresence>
        {selectedProj && (
          <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 sm:p-6 md:p-12" id="project-detail-overlay">
            {/* Dark Backdrop with blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProj(null)}
              className="absolute inset-0 bg-[#1A1A18]/85 backdrop-blur-md cursor-zoom-out"
            />

            {/* Spec Sheet Document Card */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 40, scale: 0.98 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-5xl bg-brand-white border border-[#D6D2C8] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] rounded-sm flex flex-col md:grid md:grid-cols-12 overflow-hidden max-h-[92vh]"
            >
              {/* Close Button Circle inside sheet edge */}
              <button
                onClick={() => setSelectedProj(null)}
                className="absolute top-4 right-4 z-40 bg-brand-black text-white hover:bg-brand-orange w-8 h-8 rounded-full flex items-center justify-center transition-colors focus:outline-none shadow-md cursor-pointer"
                title="Tutup lembar"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Column 1: Graphic / Photo frame underlay (col-span-5) */}
              <div className="relative col-span-5 h-[220px] md:h-full min-h-[220px] bg-neutral-900 overflow-hidden border-b md:border-b-0 md:border-r border-[#D6D2C8]">
                <img
                  src={selectedProj.imageUrl}
                  alt={selectedProj.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover pointer-events-none select-none"
                />
                {/* Visual compass asset watermark */}
                <span className="absolute bottom-4 left-4 font-mono text-[9px] text-white/50 bg-[#1A1A18]/60 py-1.5 px-3 backdrop-blur-xs select-none uppercase tracking-widest rounded-xs">
                  RENDERING_3D // DOKUMEN_ARSIF
                </span>
              </div>

              {/* Column 2: Architectural Details specs book (col-span-12 md:col-span-7) */}
              <div className="col-span-7 flex flex-col justify-between overflow-y-auto p-6 sm:p-8 md:p-10 bg-brand-white h-[60vh] md:h-full md:max-h-[82vh]">
                
                {/* Block header */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-sans text-brand-orange font-bold select-none">
                    <span>{selectedProj.category}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-ping" />
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl text-[#1A1A18] leading-tight font-normal tracking-tight">
                    {selectedProj.title}
                  </h2>
                  <p className="text-[#7A7870] font-sans text-xs italic">
                    Lokasi Pengembangan: {selectedProj.sub}
                  </p>
                </div>

                {/* 2x2 Clean spec metrics summary */}
                <div className="grid grid-cols-2 gap-4 border-t border-b border-[#D6D2C8]/70 py-5 my-6">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-brand-orange mt-0.5 shrink-0" />
                    <div>
                      <span className="block font-sans text-[9px] uppercase tracking-wider text-brand-grey font-bold leading-none">Lokasi Tapak</span>
                      <span className="font-serif text-sm text-[#1A1A18] font-normal leading-normal">{selectedProj.location}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Calendar className="w-4 h-4 text-brand-orange mt-0.5 shrink-0" />
                    <div>
                      <span className="block font-sans text-[9px] uppercase tracking-wider text-brand-grey font-bold leading-none">Tahun Rancang</span>
                      <span className="font-serif text-sm text-[#1A1A18] font-normal leading-normal">{selectedProj.year}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Maximize className="w-4 h-4 text-brand-orange mt-0.5 shrink-0" />
                    <div>
                      <span className="block font-sans text-[9px] uppercase tracking-wider text-brand-grey font-bold leading-none">Metrase Lantai</span>
                      <span className="font-serif text-sm text-[#1A1A18] font-normal leading-normal">{selectedProj.area}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <Hammer className="w-4 h-4 text-brand-orange mt-0.5 shrink-0" />
                    <div>
                      <span className="block font-sans text-[9px] uppercase tracking-wider text-brand-grey font-bold leading-none">Rekomendasi Konstruksi</span>
                      <span className="font-serif text-sm text-[#1A1A18] font-normal leading-normal">Bahan Lokal Kustom</span>
                    </div>
                  </div>
                </div>

                {/* TAB SWITCHER inside spec drawer */}
                <div className="border-b border-[#D6D2C8]/60 flex gap-6 text-[10px] uppercase font-sans tracking-[0.16em] font-bold select-none pb-1">
                  <button
                    onClick={() => setActiveTabDetail('gagasan')}
                    className={`cursor-pointer pb-2.5 border-b-2 transition-all transition-colors duration-200 ${activeTabDetail === 'gagasan' ? 'text-[#1A1A18] border-brand-orange font-extrabold' : 'border-transparent text-brand-grey hover:text-brand-black'}`}
                  >
                    Konsep Teknis
                  </button>
                  <button
                    onClick={() => setActiveTabDetail('material')}
                    className={`cursor-pointer pb-2.5 border-b-2 transition-all transition-colors duration-200 ${activeTabDetail === 'material' ? 'text-[#1A1A18] border-brand-orange font-extrabold' : 'border-transparent text-brand-grey hover:text-brand-black'}`}
                  >
                    Bahan Utama
                  </button>
                  <button
                    onClick={() => setActiveTabDetail('teknis')}
                    className={`cursor-pointer pb-2.5 border-b-2 transition-all transition-colors duration-200 ${activeTabDetail === 'teknis' ? 'text-[#1A1A18] border-brand-orange font-extrabold' : 'border-transparent text-brand-grey hover:text-brand-black'}`}
                  >
                    Rincian Keunggulan
                  </button>
                </div>

                {/* Display tab content cleanly and warmth */}
                <div className="flex-grow pt-5 min-h-[140px] text-[#1A1A18]">
                  <AnimatePresence mode="wait">
                    {activeTabDetail === 'gagasan' && (
                      <motion.div
                        key="tab-detail-gagasan"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-2"
                      >
                        <p className="font-sans text-xs sm:text-sm text-[#3C3A35] leading-relaxed">
                          {selectedProj.description}
                        </p>
                      </motion.div>
                    )}

                    {activeTabDetail === 'material' && (
                      <motion.div
                        key="tab-detail-material"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-2"
                      >
                        <span className="block text-[9px] uppercase tracking-wider text-[#7A7870] font-sans font-bold">Spesifikasi Materialitas:</span>
                        <p className="font-sans text-xs sm:text-sm text-[#3C3A35] leading-relaxed">
                          {selectedProj.materiality}
                        </p>
                      </motion.div>
                    )}

                    {activeTabDetail === 'teknis' && (
                      <motion.div
                        key="tab-detail-teknis"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-2"
                      >
                        <span className="block text-[9px] uppercase tracking-wider text-[#7A7870] font-sans font-semibold mb-2">Terobosan Rekayasa Konstruksi:</span>
                        <ul className="space-y-2 font-sans text-xs text-[#3C3A35]">
                          {selectedProj.details.map((detail, idxDetail) => (
                            <li key={idxDetail} className="flex gap-2.5 items-start">
                              <Check className="w-3.5 h-3.5 text-brand-orange shrink-0 mt-0.5" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer transactional block inside sheet */}
                <div className="pt-6 border-t border-[#D6D2C8]/70 flex flex-col sm:flex-row gap-3 items-center justify-end select-none mt-4">
                  <button
                    onClick={() => {
                      setSelectedProj(null);
                      onNavigate('kalkulator-rab');
                    }}
                    className="w-full sm:w-auto text-center border border-[#7A7870]/40 text-brand-black hover:bg-brand-black/5 text-[10px] uppercase font-bold tracking-widest px-5 py-3 transition-colors cursor-pointer"
                  >
                    Estimasi Anggaran Serupa
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProj(null);
                      onOpenEnquiry();
                    }}
                    className="w-full sm:w-auto text-center bg-brand-orange text-white hover:bg-brand-orange-hover text-[10px] uppercase font-bold tracking-widest px-5 py-3 transition-colors cursor-pointer"
                  >
                    Konsultasi Desain Ini
                  </button>
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. STATS SECTION */}
      <section className="bg-[#EDEAE3] border-t border-b border-[#D6D2C8] py-16 px-6 md:px-12 w-full">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-1">
            <div className="font-serif text-4xl sm:text-5xl font-light text-[#1A1A18]">26</div>
            <div className="text-[10px] uppercase font-sans tracking-[0.16em] text-[#7A7870]">Total Seluruh Karya</div>
          </div>
          <div className="space-y-1">
            <div className="font-serif text-4xl sm:text-5xl font-light text-[#1A1A18]">14</div>
            <div className="text-[10px] uppercase font-sans tracking-[0.16em] text-[#7A7870]">Karya Hunian Baru</div>
          </div>
          <div className="space-y-1">
            <div className="font-serif text-4xl sm:text-5xl font-light text-[#1A1A18]">07</div>
            <div className="text-[10px] uppercase font-sans tracking-[0.16em] text-[#7A7870]">Renovasi &amp; Penambahan</div>
          </div>
          <div className="space-y-1">
            <div className="font-serif text-4xl sm:text-5xl font-light text-[#1A1A18]">05</div>
            <div className="text-[10px] uppercase font-sans tracking-[0.16em] text-[#7A7870]">Interior &amp; Komersial</div>
          </div>
        </div>
      </section>

      {/* 6. LOCAL BRAND AND PILAR FILOSOFI DESIGN */}
      <section className="py-24 px-6 md:px-12 bg-brand-white border-t border-[#D6D2C8]/40" id="section-design-philosophy">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-4">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#7A7870] font-sans font-bold block">
              // Filosofi Rancang
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-[#1A1A18] leading-[1.1] font-light">
              Menciptakan Ruang Yang <span className="italic text-brand-orange text-3xl sm:text-4xl font-serif">Bernapas Secara Alami</span>
            </h3>
            <p className="text-xs sm:text-sm text-brand-grey font-sans leading-relaxed">
              Kami meyakini arsitektur sejati tidak dipandu oleh tren kosmetik sesaat, melainkan oleh keandalan struktur dan tanggapan iklim mikro setempat. Setiap detail karya kami dianalisis demi meminimalkan emisi karbon operasional.
            </p>
          </div>
          
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8 lg:pl-8">
            <div className="space-y-2 border-l-2 border-brand-orange/40 pl-4">
              <h5 className="font-serif text-[15px] font-normal text-brand-black">Keberlanjutan Pasif</h5>
              <p className="text-xs text-brand-grey font-sans leading-relaxed">
                Pemanfaatan sirkulasi pasif silang, orientasi matahari optimal, dan massa pelindung ganda guna kesejukan alami sepanjang tahun.
              </p>
            </div>
            <div className="space-y-2 border-l-2 border-brand-orange/40 pl-4">
              <h5 className="font-serif text-[15px] font-normal text-brand-black">Kejujuran Materialitas</h5>
              <p className="text-xs text-brand-grey font-sans leading-relaxed">
                Penggunaan kayu sekunder daur ulang, bata lokal berpori tebal, dan sisa cetakan kayu kasutan beton asli yang menua dengan indah.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. WORKS PAGE BOTTOM CTA */}
      <section className="bg-brand-black text-brand-white py-16 px-6 md:px-12 flex flex-col justify-center items-center text-center">
        <div className="max-w-2xl space-y-4">
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-white">
            Siap merancang dan menghitung anggaran pembangunan Anda?
          </h2>
          <p className="text-xs sm:text-sm text-white/50 max-w-md mx-auto leading-relaxed">
            Hitung anggaran transparan terstruktur lewat kalkulator kami serta simulasikan draft denah awal sebelum memulai meeting konsultasi.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-3 w-full">
            <button
              onClick={() => onNavigate('kalkulator-rab')}
              className="w-full sm:w-auto bg-brand-orange text-white hover:bg-brand-orange-hover text-xs font-semibold uppercase tracking-[0.18em] px-8 py-3.5 transition-colors"
            >
              Kalkulator RAB →
            </button>
            <button
              onClick={onOpenEnquiry}
              className="w-full sm:w-auto border border-white/20 text-white hover:bg-white/10 text-xs font-semibold uppercase tracking-[0.18em] px-8 py-3.5 transition-colors"
            >
              Hubungi Kami
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
