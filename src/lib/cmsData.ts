/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RoomConfig } from '../types';

export interface CmsHeroSlide {
  num: string;
  title: string;
  location: string;
  year: string;
  tagline: string;
  type: string;
  imageUrl: string;
  displayTitle: string;
}

export interface CmsHomeEthicsTab {
  id: string;
  title: string;
  sub: string;
  desc: string;
  point1Title: string;
  point1Desc: string;
  point2Title: string;
  point2Desc: string;
}

export interface CmsStudioHeader {
  title: string;
  italicText: string;
  aboutTitle: string;
  aboutDesc1: string;
  aboutDesc2: string;
  quoteText: string;
  quoteAuthor: string;
  philosophyTitle: string;
  philosophyMain: string;
  philosophyDesc1: string;
  philosophyDesc2: string;
}

export interface CmsTeamMember {
  name: string;
  role: string;
  credentials: string;
  initials: string;
  bgPattern: string;
}

export interface CmsSpecialization {
  num: string;
  title: string;
  desc: string;
  iconName: 'Compass' | 'Layers' | 'Sun' | 'Ruler';
  highlights: string[];
}

export interface CmsProcessIntro {
  title: string;
  subtitle: string;
  desc1: string;
  desc2: string;
  imageUrl: string;
  imageTag: string;
  imageDesc: string;
}

export interface CmsProcessStage {
  num: string;
  title: string;
  desc: string;
  tag: string;
  imageUrl: string;
  badge: string;
  deliverables: string[];
}

export interface CmsWorkProject {
  id: string;
  title: string;
  category: string;
  sub: string;
  location: string;
  year: string;
  area: string;
  imageUrl: string;
  materiality: string;
  description: string;
  details: string[];
}

// Default datasets setup
export const DEFAULT_HERO_SLIDES: CmsHeroSlide[] = [
  {
    num: '01',
    title: 'Paviliun Tirta Myrtle',
    location: 'Ascot, QLD',
    year: '2024',
    tagline: 'Paviliun kayu minimalis dan tempat perlindungan outdoor yang dirancang untuk relaksasi fungsional di luar ruangan sub-tropis.',
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
    type: 'Ruang Kantor Kustom',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80',
    displayTitle: 'BIOKLIMATIK'
  }
];

export const DEFAULT_ETHICS_TABS: CmsHomeEthicsTab[] = [
  {
    id: 'passive',
    title: 'Studi Desain Pasif',
    sub: '[01 · DESAIN TROPIS PASIF]',
    desc: 'Rumah tropis yang ideal harus bisa bernapas bebas. Kami merancang tata letak bangunan agar selalu sejuk sepanjang hari dengan memanfaatkan arah embusan angin dan meminimalkan paparan panas matahari langsung. Melalui bukaan jendela yang strategis, sirkulasi vertikal, dan kisi-kisi kayu, hunian Anda tetap terasa nyaman tanpa harus bergantung sepenuhnya pada pendingin udara.',
    point1Title: 'Kenyamanan Termal',
    point1Desc: 'Aliran udara mengalir alami tanpa pengap',
    point2Title: 'Orientasi Kedudukan',
    point2Desc: 'Mengurangi paparan terik matahari langsung'
  },
  {
    id: 'budget',
    title: 'Transparansi Anggaran',
    sub: '[02 · KETERBUKAAN ANGGARAN]',
    desc: 'Bagi kami, kepercayaan dimulai dari keterbukaan biaya. Kami berkomitmen penuh untuk menghindari pembengkakan anggaran saat masa konstruksi berlangsung. Melalui sistem perhitungan RAB yang terintegrasi, Anda bisa memantau estimasi kebutuhan biaya sejak tahap perencanaan denah awal secara transparan dan akurat.',
    point1Title: 'Rencana Anggaran',
    point1Desc: 'Deviasi estimasi minimal di bawah ±5%',
    point2Title: 'Acuan Harga Lokal',
    point2Desc: 'Berdasarkan harga material aktual di lapangan'
  },
  {
    id: 'material',
    title: 'Kejujuran Material',
    sub: '[03 · KEJUJURAN MATERIAL]',
    desc: 'Setiap material memiliki jiwanya sendiri. Kami senang menggunakan elemen-elemen alami yang semakin indah seiring berjalannya waktu—seperti kayu solid, batu alam lokal, semen bertekstur, dan ubin terakota. Dengan meminimalkan lapisan finishing sintetis yang tebal, kami menghadirkan karakter asli material yang ramah di mata dan hangat disentuh.',
    point1Title: 'Kayu Keras Pilihan',
    point1Desc: 'Hanya memakai kayu bersertifikat legal resmi',
    point2Title: 'Apresiasi Tekstur',
    point2Desc: 'Karakter asri dari serat alami tanpa penutup cat'
  },
  {
    id: 'flow',
    title: 'Alur Ruang Intuitif',
    sub: '[04 · ALUR RUANG INTUITIF]',
    desc: 'Rumah tidak semestinya terasa seperti labirin yang kaku dan sempit. Kami merancang hubungan antarruang yang menyatu dengan lembut dan minim sekat tebal. Desain kami mendekatkan area santai keluarga dengan hijaunya taman luar, menciptakan pengalaman ruang yang luas, dinamis, dan selalu menyambut dengan hangat.',
    point1Title: 'Keluwesan Layout',
    point1Desc: 'Zonasi adaptif & ruang multi-fungsi',
    point2Title: 'Sinar Matahari Alami',
    point2Desc: 'Cahaya menyinari setiap sudut sela ruangan'
  }
];

export const DEFAULT_STUDIO_HEADER: CmsStudioHeader = {
  title: 'Di OH, kami mendengar dahulu, merancang kemudian.',
  italicText: 'Baik saat bekerja di dalam studio maupun berdampingan dengan klien dan mitra, proses bersinergi ini melahirkan karya nyata yang seirama dengan impian Anda dan idealisme arsitektural kami.',
  aboutTitle: 'Di OH, kami mendengar dahulu, merancang kemudian.',
  aboutDesc1: 'Kami percaya arsitektur seharusnya merupakan proses kolaboratif yang inklusif dan menyenangkan. Tim desainer kami membimbing Anda sepanjang perjalanan, mencocokkan respon iklim tropis yang fungsional dengan kehalusan struktural kelas atas.',
  aboutDesc2: 'Kami tidak memaksakan ego personal arsitek, melainkan mendampingi impian Anda menjadi kenyataan nyata. Dengan mendalami kebiasaan keseharian, keunikan lahan, serta target batas anggaran Anda, kami menggubah rumah bernilai tinggi yang nyaman ditinggali selamanya.',
  quoteText: 'Kombinasi geometri arsitektural yang bersahaja dengan pemanfaatan ubin tanah liat lokal, tiang batu utuh, serta jalur cahaya alami yang tenang.',
  quoteAuthor: '©ANDY MACPHERSON',
  philosophyTitle: 'Kesetimbangan Intuisi Arsitektural serta Tanggapan Iklim Khas Tapak.',
  philosophyMain: 'Etos perancangan kami berakar kuat pada nilai-nilai desain pasif tropis, perencanaan ruang yang cermat, dan sirkulasi alur yang intuitif.',
  philosophyDesc1: 'Kami membidani setiap rancangan dengan tekad melerai kerumitan hidup harian — menyuguhkan kenyamanan dan kejujuran bentuk melalui ruang yang fungsional sekaligus anggun.',
  philosophyDesc2: 'Di OH Architecture, kami meyakini bahwa arsitektur yang bernilai adalah perwujudan selaras antara manusia dan tapak tempatnya berpijak, keserasian wujud dan kegunaan, serta kecocokan visi masa depan dengan karakter materialitas natural.'
};

export const DEFAULT_TEAM_MEMBERS: CmsTeamMember[] = [
  { 
    name: 'Johnny Hyde', 
    role: 'Director / Principal', 
    credentials: 'M. Arch (QUT), B.Be Arch (QUT)\nBOA Queensland No. 4787\nNSW Reg. No. 10589',
    initials: 'JH',
    bgPattern: 'bg-[#1A1A18]/5 text-brand-black/10'
  },
  { 
    name: 'Poppie Kenneally', 
    role: 'Director — Interior Designer', 
    credentials: 'B.Be Arch (QUT)\nDip Interior Des (IDI)\nRegistrasi Desainer Interior Senior',
    initials: 'PK',
    bgPattern: 'bg-brand-orange/5 text-brand-orange/10'
  },
  { 
    name: 'Daniel Hickey', 
    role: 'Associate Architect', 
    credentials: 'M.Arch (UQ), B.Arch Des (UQ)\nBOA Queensland No. 5881\nSertifikasi Gedung Hijau Madya',
    initials: 'DH',
    bgPattern: 'bg-[#B0AC9F]/10 text-[#4E4D48]/10'
  },
  { 
    name: 'Nick Tan', 
    role: 'Senior Registered Architect', 
    credentials: 'M.Arch (QUT), B.Des (ArchSt) Hons.\nBOA Queensland No. 6021',
    initials: 'NT',
    bgPattern: 'bg-[#1A1A18]/5 text-brand-black/10'
  },
  { 
    name: 'Rachael Mellick', 
    role: 'Registered Architect', 
    credentials: 'M.Arch (UQ), B.Arch Des (UQ)\nBOA Queensland No. 5501\nSpesialis Simulasi Iklim Makro',
    initials: 'RM',
    bgPattern: 'bg-brand-orange/5 text-brand-orange/10'
  },
  { 
    name: 'Laura Sherriff', 
    role: 'Architect & Sustainability Lead', 
    credentials: 'M.Arch (UQ), B.Arch Des (UQ)\nBOA Queensland No. 5673',
    initials: 'LS',
    bgPattern: 'bg-[#B0AC9F]/10 text-[#4E4D48]/10'
  },
  { 
    name: 'Larisa Wright', 
    role: 'Studio & Office Operations Manager', 
    credentials: 'B.Bus Studio & Enterprise Management\nKombinasi 12 Th Pengalaman Layanan',
    initials: 'LW',
    bgPattern: 'bg-[#1A1A18]/5 text-brand-black/10'
  }
];

export const DEFAULT_SPECIALIZATIONS: CmsSpecialization[] = [
  {
    num: '01',
    title: 'Arsitektur Tropis Kontemporer',
    desc: 'Formulasi gubahan masa bangunan modern yang responsif terhadap radiasi matahari, mengoptimalkan peneduh alami, dan memaksimalkan integrasi ruang hijau terbuka.',
    iconName: 'Compass',
    highlights: ['Passive Cooling', 'Sirkulasi Angin Silang', 'Overhanging Roofs']
  },
  {
    num: '02',
    title: 'Desain Interior & Tata Spasial',
    desc: 'Penyusunan alur sirkulasi ruang dalam yang mengalir tanpa sekat (open-plan) berbadankan materialitas lokal bersahaja seperti kayu natural, batu pori, serta beton expose.',
    iconName: 'Layers',
    highlights: ['Custom Millwork', 'Material Kejujuran', 'Pencahayaan Warm-Tone']
  },
  {
    num: '03',
    title: 'Simulasi Energi & Iklim Mikro',
    desc: 'Penerapan teknologi digital untuk mensimulasikan pergerakan cahaya matahari musiman serta aliran fluida angin demi menjamin kenyamanan termal tanpa ketergantungan AC.',
    iconName: 'Sun',
    highlights: ['Solar Shadow Studies', 'Natural Daylighting', 'Thermal Comfort Index']
  },
  {
    num: '04',
    title: 'Manajemen Detail Konstruksi',
    desc: 'Asistensi kurasi material premium berkualitas tinggi, pengawasan presisi detail sambungan struktur di lapangan, hingga koordinasi berkala bersama kontraktor terpilih.',
    iconName: 'Ruler',
    highlights: ['Material Sourcing', 'Precision Detailing', 'Owner Representation']
  }
];

export const DEFAULT_PROCESS_INTRO: CmsProcessIntro = {
  title: 'Alur Proses Kerja',
  subtitle: 'Arsitektur yang luar biasa tak hanya lahir dari sketsa, melainkan dari alur kolaborasi yang presisi dan saling percaya.',
  desc1: 'Kami mengawal dan mendampingi rencana pembangunan Anda secara jujur di setiap jenjang perancangan — mulai dari sketsa goresan pensil pertama hingga serah terima kunci fisik bangunan yang matang terhadap tantangan iklim tropis setempat.',
  desc2: 'Transparansi diutamakan sejak langkah awal. Kami menyusun estimasi alokasi biaya, jadwal rekayasa dinamis, serta pedoman keterandalan struktur sipil secara rinci, melerai keraguan konstruktif demi ketenangan hati proyek Anda.',
  imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
  imageTag: 'Diskusi Tapak',
  imageDesc: 'Interaksi intim memetakan kebutuhan unik ruangan bernapas.'
};

export const DEFAULT_PROCESS_STAGES: CmsProcessStage[] = [
  {
    num: '01',
    title: 'Sketsa Gagasan Awal (Sketch Design)',
    desc: 'Kami memulai dengan kunjungan langsung ke lokasi tapak dan diskusi kreatif mendalam untuk menyelaraskan impian, preferensi gaya, serta kebutuhan fungsional ruang Anda. Kami juga memetakan potensi keindahan tapak pasif matahari sekaligus batas sirkulasi lingkungan. Melalui analisis ini, kami merangkai kumpulan sketsa gagasan gambar-tangan awal sebagai visualisasi dasar filosofi rancangan.',
    tag: 'Studi sketsa gagasan awal goresan tangan',
    imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
    badge: 'Orientasi & Konseptualisasi',
    deliverables: ['Sketsa Goresan Tangan Konsep Sektoral', 'Studi Lintasan Gerak Matahari', 'Estimasi Kasar Alokasi Volume Massa']
  },
  {
    num: '02',
    title: 'Pengembangan Desain & Visualisasi',
    desc: 'Pada tahap ini, tim kami menuangkan gagasan dasar menjadi detail rancangan siap pakai, mulai dari pemilihan material alam yang bernapas, integrasi batas area luar-dalam, sirkulasi draf perabot terpasang (joinery), hingga keterbukaan cahaya udara. Kami menyajikan gambar teknik 2D yang presisi disandingkan dengan model visualisasi digital 3D berkualitas tinggi.',
    tag: 'Studi detail visualisasi model 3D terpadu',
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    badge: 'Visualisasi Realistis 3D',
    deliverables: ['Perspektif 3D Render Resolusi Ultra', 'Denah Pembagian Zona Skala Detil', 'Daftar Kurasi Jenis Material Dasar']
  },
  {
    num: '03',
    title: 'Perizinan & Kelayakan Tata Ruang',
    desc: 'Tidak seluruh jenis proyek konstruksi wajib melewati proses asesmen tata ruang di instansi pemerintah daerah. Bila karakteristik bidang lahan Anda memerlukannya, kami akan mengawal penuh alur pengajuan tersebut. Mulai dari mengoordinasikan masukan dari ahli perencana wilayah, menyusun berkas kelayakan lingkungan para konsultan spesialis.',
    tag: 'Penyusunan administrasi perizinan resmi daerah',
    imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
    badge: 'Administrasi & Legalitas',
    deliverables: ['Pengurusan Izin Pemanfaatan Ruang (IPR)', 'Pemetaan Garis Sempadan Sesuai Perda', 'Verifikasi Dokumen Kelayakan Lahan']
  },
  {
    num: '04',
    title: 'Desain Interior & Detail Sentuhan',
    desc: 'Kami merayu dan menyelaraskan area ruang-dalam agar menyatu padu dan berdialog mesra dengan struktur arsitektur utama hunian Anda. Perancang interior kami mendesain sirkulasi kenyamanan fungsional yang disesuaikan secara khusus bagi kebiasaan harian Anda. Kami merancang tata kabinet fungsional, pemilihan jenis ubin.',
    tag: 'Pedoman kurasi material & keselarasan interior',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80',
    badge: 'Tata Spasial Interior',
    deliverables: ['Detail Joinery Desain Lemari Kustom', 'Spesifikasi Kode Ubin & Sanitari', 'Skema Luminasi Lampu Hangat Interior']
  },
  {
    num: '05',
    title: 'Rencana Detail Teknis & Kelayakan Struktur',
    desc: 'Sebelum pekerjaan konstruksi di lokasi dapat dimulai, rancangan arsitektur wajib memperoleh sertifikat kelayakan struktur dari lembaga sertifikasi berwenang. Tim kami menyiapkan, melaraskan, dan memegang kendali atas penyiapan seluruh dokumen perhitungan detail teknis kekuatan struktur bangunan.',
    tag: 'Dokumentasi kelayakan rekayasa struktur sipil',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    badge: 'Rekayasa Kekuatan Struktur',
    deliverables: ['Gambar Detail Rangka Pembesian Sipil', 'Kalkulasi Statika Beban Gempa & Massa', 'Sertifikat Kelayakan Teknis Kekuatan']
  },
  {
    num: '06',
    title: 'Gambar Kerja Lapangan (DED)',
    desc: 'Setelah seluruh detail keindahan interior dan legalitas sipil dirampungkan, kami memfokuskan pengerjaan pada Gambar Perencanaan Teknik Terinci (DED) yang komprehensif. Dokumen teknis yang sangat tebal dan detail ini menjadi kitab panduan mutlak bagi tim kontraktor pelaksana serta tukang ahli spesialis di lapangan.',
    tag: 'Gambar detail rekayasa pengerjaan bagi kontraktor',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80',
    badge: 'Dokumen Gambar Kerja Final',
    deliverables: ['Buku Detail Rekayasa Konstruksi Terinci', 'Rencana Anggaran Biaya Final Kontraktor', 'Daftar Kuantitas Material (Bill of Quantities)']
  }
];

export const DEFAULT_PROJECTS: CmsWorkProject[] = [
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
      'Void ganda setinggi 7.2 meter menghubungkan ruang tengah lantai satu and loteng baca atas',
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

// Content loader helper functions
export const loadData = <T>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(`oh_cms_${key}`);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (e) {
    console.warn('Storage isolated in iframe, using memory defaults', e);
    return defaultValue;
  }
};

export const saveData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(`oh_cms_${key}`, JSON.stringify(data));
  } catch (e) {
    console.warn('Saving to localStorage failed in sandbox', e);
  }
};

// Site general settings
export interface CmsGeneralSettings {
  siteName: string;
  subTitle: string;
  supportEmail: string;
  phone: string;
  address: string;
}

const DEFAULT_SETTINGS: CmsGeneralSettings = {
  siteName: 'OH Architecture & Build',
  subTitle: 'Website kalkulator RAB, generator denah interaktif, dan visualisasi AI konsep desain arsitektur.',
  supportEmail: 'info@oh-architecture-build.id',
  phone: '+62 (21) 7280 1024',
  address: 'Jl. Wijaya Timur Raya No. 12, Kebayoran Baru, Jakarta Selatan 12170'
};

// RAB configurations
export interface CmsRabConfig {
  priceStandard: number;
  priceMedium: number;
  pricePremium: number;
  floorMultipliers: Record<number, number>;
  renovationMultiplier: number;
  styleTags: { id: string; label: string; prompt: string }[];
  addonCosts: Record<string, { label: string; cost: number; description: string }>;
  roomTemplates: RoomConfig[];
}

export const DEFAULT_RAB_CONFIG: CmsRabConfig = {
  priceStandard: 3200000,
  priceMedium: 4500000,
  pricePremium: 6800000,
  floorMultipliers: {
    1: 1.0,
    2: 1.15,
    3: 1.25,
    4: 1.35,
  },
  renovationMultiplier: 0.65,
  styleTags: [
    { id: 'minimalist', label: 'Minimalis Modern', prompt: 'modern minimalist architecture, white walls, warm timber cladding, large glass openings, sharp lines' },
    { id: 'tropical', label: 'Tropis Modern', prompt: 'modern tropical architecture, lush greenery integrated, high pitched roof, natural stone, open spaces, timber slats' },
    { id: 'industrial', label: 'Industrial Kontemporer', prompt: 'contemporary industrial residential exterior, exposed raw concrete, matte black steel columns, sleek windows, architectural brick accents' },
    { id: 'classic', label: 'Klasik Modern', prompt: 'classic modern elegant architecture, symmetric facades, subtle moldings, tall windows, warm white lighting, luxury feel' },
  ],
  addonCosts: {
    swimming_pool: {
      label: 'Kolam Renang Minimalis',
      cost: 150000000,
      description: 'Ukuran standar 3x7m, termasuk pompa & filter',
    },
    carport_canopy: {
      label: 'Carport & Canopy Besi Hollow',
      cost: 15000000,
      description: 'Kapasitas 1-2 mobil dengan atap tempered glass / alderon',
    },
    smart_home: {
      label: 'Sistem Smart Home Kunci & CCTV',
      cost: 12000000,
      description: 'Integrasi IoT smart lock, CCTV outdoor/indoor, switch bertenaga WiFi',
    },
    gate_and_fence: {
      label: 'Pagar & Pintu Gerbang Utama',
      cost: 18000000,
      description: 'Pagar minimalis besi hollow, tinggi 1.8m, finishing doff cat dasar hitam',
    },
    garden_landscape: {
      label: 'Taman Minimalis & Kolam Ikan',
      cost: 10000000,
      description: 'Rumput gajah mini, tanaman hias lokal & sirkulasi air mancur kecil',
    },
  },
  roomTemplates: [
    { id: 'bedroom', name: 'Kamar Tidur Utama', count: 1, minAreaSqm: 12, label: '🛏️ Kamar Utama' },
    { id: 'kid_room', name: 'Kamar Tidur Anak', count: 1, minAreaSqm: 9, label: '🧸 Kamar Anak' },
    { id: 'bathroom', name: 'Kamar Mandi', count: 1, minAreaSqm: 4, label: '🚿 Kamar Mandi' },
    { id: 'living_room', name: 'Ruang Tamu', count: 1, minAreaSqm: 12, label: '🛋️ Ruang Tamu' },
    { id: 'family_room', name: 'Ruang Keluarga', count: 1, minAreaSqm: 15, label: '📺 Ruang Keluarga' },
    { id: 'kitchen', name: 'Dapur & Area Makan', count: 1, minAreaSqm: 10, label: '🍳 Dapur' },
    { id: 'carport', name: 'Garasi / Carport', count: 1, minAreaSqm: 15, label: '🚗 Carport' },
    { id: 'laundry', name: 'Area Cuci Jemur', count: 0, minAreaSqm: 6, label: '🧺 Cuci Jemur' },
    { id: 'garden', name: 'Taman Belakang', count: 0, minAreaSqm: 8, label: '🌿 Taman' },
  ]
};

// Facades for easy usage
export const getGeneralSettings = (): CmsGeneralSettings => loadData('settings', DEFAULT_SETTINGS);
export const saveGeneralSettings = (data: CmsGeneralSettings) => saveData('settings', data);

export const getHeroSlides = (): CmsHeroSlide[] => loadData('hero_slides', DEFAULT_HERO_SLIDES);
export const saveHeroSlides = (data: CmsHeroSlide[]) => saveData('hero_slides', data);

export const getEthicsTabs = (): CmsHomeEthicsTab[] => loadData('ethics_tabs', DEFAULT_ETHICS_TABS);
export const saveEthicsTabs = (data: CmsHomeEthicsTab[]) => saveData('ethics_tabs', data);

export const getStudioHeader = (): CmsStudioHeader => loadData('studio_header', DEFAULT_STUDIO_HEADER);
export const saveStudioHeader = (data: CmsStudioHeader) => saveData('studio_header', data);

export const getTeamMembers = (): CmsTeamMember[] => loadData('team_members', DEFAULT_TEAM_MEMBERS);
export const saveTeamMembers = (data: CmsTeamMember[]) => saveData('team_members', data);

export const getSpecializations = (): CmsSpecialization[] => loadData('specializations', DEFAULT_SPECIALIZATIONS);
export const saveSpecializations = (data: CmsSpecialization[]) => saveData('specializations', data);

export const getProcessIntro = (): CmsProcessIntro => loadData('process_intro', DEFAULT_PROCESS_INTRO);
export const saveProcessIntro = (data: CmsProcessIntro) => saveData('process_intro', data);

export const getProcessStages = (): CmsProcessStage[] => loadData('process_stages', DEFAULT_PROCESS_STAGES);
export const saveProcessStages = (data: CmsProcessStage[]) => saveData('process_stages', data);

export const getWorksProjects = (): CmsWorkProject[] => loadData('works_projects', DEFAULT_PROJECTS);
export const saveWorksProjects = (data: CmsWorkProject[]) => saveData('works_projects', data);

export const getRabConfig = (): CmsRabConfig => loadData('rab_config', DEFAULT_RAB_CONFIG);
export const saveRabConfig = (data: CmsRabConfig) => saveData('rab_config', data);

export const resetCmsToDefault = (): void => {
  try {
    const keys = localStorage.length;
    for (let i = 0; i < keys; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('oh_cms_')) {
        localStorage.removeItem(key);
      }
    }
  } catch (e) {
    console.warn('Reset failed', e);
  }
};
