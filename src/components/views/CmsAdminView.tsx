/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ViewPath } from '../../types';
import { 
  getGeneralSettings, saveGeneralSettings, CmsGeneralSettings,
  getHeroSlides, saveHeroSlides, CmsHeroSlide,
  getEthicsTabs, saveEthicsTabs, CmsHomeEthicsTab,
  getStudioHeader, saveStudioHeader, CmsStudioHeader,
  getTeamMembers, saveTeamMembers, CmsTeamMember,
  getSpecializations, saveSpecializations, CmsSpecialization,
  getProcessIntro, saveProcessIntro, CmsProcessIntro,
  getProcessStages, saveProcessStages, CmsProcessStage,
  getWorksProjects, saveWorksProjects, CmsWorkProject,
  getRabConfig, saveRabConfig, CmsRabConfig,
  resetCmsToDefault
} from '../../lib/cmsData';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Save, Settings, Home, Briefcase, Users, Compass, 
  DollarSign, Mail, Plus, Trash2, Edit2, CheckCircle2, 
  RefreshCw, ListChecks, Inbox, Search, Building2, Eye,
  ArrowRight, ShieldCheck, FileSpreadsheet, KeyRound, AlertCircle
} from 'lucide-react';

interface CmsAdminViewProps {
  onNavigate: (view: ViewPath) => void;
}

interface UserLead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  rabEstimateId?: string;
  floorPlanId?: string;
  aiRenderId?: string;
  submittedAt: string;
}

export default function CmsAdminView({ onNavigate }: CmsAdminViewProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'home' | 'works' | 'studio' | 'process' | 'rab' | 'leads'>('general');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 1. General Settings states
  const [generalSettings, setGeneralSettings] = useState<CmsGeneralSettings>(getGeneralSettings());

  // 2. Home Page states
  const [heroSlides, setHeroSlides] = useState<CmsHeroSlide[]>(getHeroSlides());
  const [ethicsTabs, setEthicsTabs] = useState<CmsHomeEthicsTab[]>(getEthicsTabs());

  // 3. Works (Portfolio) states
  const [worksProjects, setWorksProjects] = useState<CmsWorkProject[]>(getWorksProjects());
  const [editingProject, setEditingProject] = useState<CmsWorkProject | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);

  // 4. Studio states
  const [studioHeader, setStudioHeader] = useState<CmsStudioHeader>(getStudioHeader());
  const [teamMembers, setTeamMembers] = useState<CmsTeamMember[]>(getTeamMembers());
  const [specializations, setSpecializations] = useState<CmsSpecialization[]>(getSpecializations());

  // 5. Process states
  const [processIntro, setProcessIntro] = useState<CmsProcessIntro>(getProcessIntro());
  const [processStages, setProcessStages] = useState<CmsProcessStage[]>(getProcessStages());

  // 6. RAB Spec states
  const [rabConfig, setRabConfig] = useState<CmsRabConfig>(getRabConfig());

  // 7. Inbox (Leads / Consultations) states
  const [leads, setLeads] = useState<UserLead[]>([]);
  const [searchLeadQuery, setSearchLeadQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<UserLead | null>(null);

  // Load leads from localStorage
  const loadLeadsFromStore = () => {
    try {
      const savedLeads = JSON.parse(localStorage.getItem('oh_leads') || '[]');
      // Sort newest first
      savedLeads.sort((a: any, b: any) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      setLeads(savedLeads);
    } catch (e) {
      console.error('Failed to load leads list', e);
    }
  };

  useEffect(() => {
    loadLeadsFromStore();
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  // Safe save handlers
  const handleSaveGeneral = () => {
    saveGeneralSettings(generalSettings);
    triggerToast('Pengaturan Umum berhasil disimpan.');
  };

  const handleSaveHome = () => {
    saveHeroSlides(heroSlides);
    saveEthicsTabs(ethicsTabs);
    triggerToast('Konten Halaman Beranda berhasil disimpan.');
  };

  const handleSaveWorks = () => {
    saveWorksProjects(worksProjects);
    triggerToast('Daftar Portofolio Karya berhasil disimpan.');
  };

  const handleSaveStudio = () => {
    saveStudioHeader(studioHeader);
    saveTeamMembers(teamMembers);
    saveSpecializations(specializations);
    triggerToast('Konten Studio & Staf berhasil disimpan.');
  };

  const handleSaveProcess = () => {
    saveProcessIntro(processIntro);
    saveProcessStages(processStages);
    triggerToast('Alur Kerja 6 Tahapan berhasil disimpan.');
  };

  const handleSaveRab = () => {
    saveRabConfig(rabConfig);
    triggerToast('Konfigurasi Formula Estimasi RAB berhasil disimpan.');
  };

  const handleResetDefaults = () => {
    if (confirm('Apakah Anda yakin ingin mengembalikan seluruh konten website ke pengaturan pabrik semula? Seluruh perubahan CMS Anda akan dihapus.')) {
      resetCmsToDefault();
      
      // Reload states from clean default boundaries
      setGeneralSettings(getGeneralSettings());
      setHeroSlides(getHeroSlides());
      setEthicsTabs(getEthicsTabs());
      setWorksProjects(getWorksProjects());
      setStudioHeader(getStudioHeader());
      setTeamMembers(getTeamMembers());
      setSpecializations(getSpecializations());
      setProcessIntro(getProcessIntro());
      setProcessStages(getProcessStages());
      setRabConfig(getRabConfig());
      
      triggerToast('Konten website berhasil di-reset ke default awal.');
    }
  };

  // Portfolio items operations
  const handleStartAddProject = () => {
    setEditingProject({
      id: String(Date.now()),
      title: '',
      category: 'Rumah Baru',
      sub: '',
      location: '',
      year: new Date().getFullYear().toString(),
      area: '200 m²',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      materiality: '',
      description: '',
      details: ['Fitur atau spesifik 1', 'Fitur atau spesifik 2']
    });
    setIsAddingProject(true);
  };

  const handleStartEditProject = (proj: CmsWorkProject) => {
    setEditingProject({ ...proj });
    setIsAddingProject(false);
  };

  const handleSaveProjectForm = () => {
    if (!editingProject) return;
    if (!editingProject.title.trim()) {
      alert('Judul proyek tidak boleh kosong!');
      return;
    }

    let updatedList;
    if (isAddingProject) {
      updatedList = [...worksProjects, editingProject];
    } else {
      updatedList = worksProjects.map(p => p.id === editingProject.id ? editingProject : p);
    }
    
    setWorksProjects(updatedList);
    saveWorksProjects(updatedList);
    setEditingProject(null);
    triggerToast('Proyek portofolio berhasil disimpan.');
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus proyek portofolio ini dari website?')) {
      const updatedList = worksProjects.filter(p => p.id !== id);
      setWorksProjects(updatedList);
      saveWorksProjects(updatedList);
      triggerToast('Proyek portofolio berhasil dihapus.');
    }
  };

  // Team members modification helpers
  const handleTeamMemberChange = (idx: number, field: keyof CmsTeamMember, val: string) => {
    const updated = [...teamMembers];
    updated[idx] = { ...updated[idx], [field]: val };
    setTeamMembers(updated);
  };

  // Process Stage modification helpers
  const handleStageChange = (idx: number, field: keyof CmsProcessStage, val: any) => {
    const updated = [...processStages];
    updated[idx] = { ...updated[idx], [field]: val };
    setProcessStages(updated);
  };

  // Leads list helpers
  const handleDeleteLead = (leadId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data konsultasi ini?')) {
      try {
        const savedLeads = JSON.parse(localStorage.getItem('oh_leads') || '[]');
        const filtered = savedLeads.filter((l: any) => l.id !== leadId);
        localStorage.setItem('oh_leads', JSON.stringify(filtered));
        setLeads(filtered);
        setSelectedLead(null);
        triggerToast('Pesan konsultasi masuk berhasil dihapus.');
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Mock simulator to help user inspect leads inbox
  const handleSimulateInboundLead = () => {
    const mockNames = ['Rian Baskoro', 'Siti Amalia', 'Vania Wijaya', 'Bima Putera', 'Andi Pratama'];
    const mockPhones = ['081234567890', '085712345678', '081399887766', '089911223344', '081122334455'];
    const mockEmails = ['rian.baskoro@gmail.com', 'siti.amalia@outlook.com', 'vania.wijaya@gmail.com', 'bima.putera@yahoo.com', 'andi@mail.id'];
    const mockMessages = [
      'Halo, saya berminat membuat desain villa tropis modern untuk lahan perkebunan saya di Canggu, Bali. Ingin mendiskusikan lebih lanjut terkait sirkulasi angin pasif.',
      'Sangat menyukai konsep materialitas dari Griya Jaloura. Berencana merenovasi rumah tua klaster di Kebayoran Baru dengan tambahan kolam renang minimalis.',
      'Butuh konsultasi arsitek untuk rumah baru 3 lantai dekat perbukitan. Ingin memaksimalkan skylight dan atap kantilever lebar.',
      'Rencana pembangunan kantor kreatif startup kami tahun depan di Grange. Butuh sirkulasi yang tidak bersekat tebal.',
      'Mohon berikan rincian penawaran alur kerja untuk rancang bangun vila minimalis ramah lingkungan di Yogyakarta.'
    ];

    const randomIdx = Math.floor(Math.random() * mockNames.length);

    try {
      const savedLeads = JSON.parse(localStorage.getItem('oh_leads') || '[]');
      const newLead: UserLead = {
        id: crypto.randomUUID(),
        name: mockNames[randomIdx],
        phone: mockPhones[randomIdx],
        email: mockEmails[randomIdx],
        message: mockMessages[randomIdx],
        submittedAt: new Date().toISOString(),
      };
      savedLeads.push(newLead);
      localStorage.setItem('oh_leads', JSON.stringify(savedLeads));
      
      loadLeadsFromStore();
      triggerToast('Simulasi pesan masuk berhasil ditambahkan!');
    } catch (e) {
      console.error(e);
    }
  };

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchLeadQuery.toLowerCase()) || 
    (l.email && l.email.toLowerCase().includes(searchLeadQuery.toLowerCase())) || 
    (l.message && l.message.toLowerCase().includes(searchLeadQuery.toLowerCase())) || 
    l.phone.includes(searchLeadQuery)
  );

  return (
    <div className="flex flex-col w-full text-brand-black bg-[#FAF9F5] min-h-screen pt-12" id="cms-dashboard-root">
      
      {/* HEADER CMS */}
      <header className="bg-brand-black text-[#EDEAE3] py-10 px-6 md:px-12 border-b border-white/5 shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <span className="text-[10px] md:text-xs tracking-[0.2em] text-brand-orange uppercase font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" /> PANEL CMS UTAMA ADMINISTRATOR
            </span>
            <h1 className="font-serif text-3xl sm:text-4.5xl text-white font-normal leading-tight tracking-tight">
              Sistem Manajemen Konten (CMS)
            </h1>
            <p className="font-sans text-xs text-brand-grey/90 max-w-2xl">
              Platform internal studio untuk mengelola tata letak halaman utama, detail teks ethos, daftar portofolio karya, kredensial tim professional, hingga formula kalkulator estimasi RAB.
            </p>
          </div>

          <div className="flex gap-4 items-center flex-wrap">
            <button
              onClick={handleResetDefaults}
              className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-[#C4B99A] border border-brand-orange/30 hover:border-brand-orange bg-brand-orange/5 transition-all text-xs flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Default
            </button>
            
            <button
              onClick={() => onNavigate('home')}
              className="px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-[#131211] bg-brand-cream hover:bg-white transition-all text-xs flex items-center gap-1.5 shadow-md"
            >
              Kembali ke Website <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* DASHBOARD BODY */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 w-full flex-grow flex flex-col lg:flex-row gap-8">
        
        {/* NAV BAR CMS SIDEBAR */}
        <nav className="w-full lg:w-64 shrink-0 flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible border-b lg:border-b-0 lg:border-r border-brand-black/10 pb-4 lg:pb-0 lg:pr-6 whitespace-nowrap self-start">
          
          <button
            onClick={() => { setActiveTab('general'); setEditingProject(null); }}
            className={`flex items-center gap-2.5 px-4 py-3 text-xs uppercase tracking-wider font-bold transition-all text-left w-full border-b-2 lg:border-b-0 lg:border-l-4 ${
              activeTab === 'general' ? 'text-brand-orange border-brand-orange bg-[#EDEAE3]/40' : 'text-brand-dark-grey border-transparent hover:text-brand-black hover:bg-brand-cream/30'
            }`}
          >
            <Settings className="w-4 h-4" /> Pengaturan Umum
          </button>

          <button
            onClick={() => { setActiveTab('home'); setEditingProject(null); }}
            className={`flex items-center gap-2.5 px-4 py-3 text-xs uppercase tracking-wider font-bold transition-all text-left w-full border-b-2 lg:border-b-0 lg:border-l-4 ${
              activeTab === 'home' ? 'text-brand-orange border-brand-orange bg-[#EDEAE3]/40' : 'text-brand-dark-grey border-transparent hover:text-brand-black hover:bg-brand-cream/30'
            }`}
          >
            <Home className="w-4 h-4" /> Halaman Utama
          </button>

          <button
            onClick={() => { setActiveTab('works'); setEditingProject(null); }}
            className={`flex items-center gap-2.5 px-4 py-3 text-xs uppercase tracking-wider font-bold transition-all text-left w-full border-b-2 lg:border-b-0 lg:border-l-4 ${
              activeTab === 'works' ? 'text-brand-orange border-brand-orange bg-[#EDEAE3]/40' : 'text-brand-dark-grey border-transparent hover:text-brand-black hover:bg-brand-cream/30'
            }`}
          >
            <Briefcase className="w-4 h-4" /> Portofolio Karya
          </button>

          <button
            onClick={() => { setActiveTab('studio'); setEditingProject(null); }}
            className={`flex items-center gap-2.5 px-4 py-3 text-xs uppercase tracking-wider font-bold transition-all text-left w-full border-b-2 lg:border-b-0 lg:border-l-4 ${
              activeTab === 'studio' ? 'text-brand-orange border-brand-orange bg-[#EDEAE3]/40' : 'text-brand-dark-grey border-transparent hover:text-brand-black hover:bg-brand-cream/30'
            }`}
          >
            <Users className="w-4 h-4" /> Tentang Studio
          </button>

          <button
            onClick={() => { setActiveTab('process'); setEditingProject(null); }}
            className={`flex items-center gap-2.5 px-4 py-3 text-xs uppercase tracking-wider font-bold transition-all text-left w-full border-b-2 lg:border-b-0 lg:border-l-4 ${
              activeTab === 'process' ? 'text-brand-orange border-brand-orange bg-[#EDEAE3]/40' : 'text-brand-dark-grey border-transparent hover:text-brand-black hover:bg-brand-cream/30'
            }`}
          >
            <Compass className="w-4 h-4" /> Alur 6 Tahapan
          </button>

          <button
            onClick={() => { setActiveTab('rab'); setEditingProject(null); }}
            className={`flex items-center gap-2.5 px-4 py-3 text-xs uppercase tracking-wider font-bold transition-all text-left w-full border-b-2 lg:border-b-0 lg:border-l-4 ${
              activeTab === 'rab' ? 'text-brand-orange border-brand-orange bg-[#EDEAE3]/40' : 'text-brand-dark-grey border-transparent hover:text-brand-black hover:bg-brand-cream/30'
            }`}
          >
            <DollarSign className="w-4 h-4" /> Konfigurasi RAB
          </button>

          <button
            onClick={() => { setActiveTab('leads'); setEditingProject(null); }}
            className={`flex items-center justify-between gap-1.5 px-4 py-3 text-xs uppercase tracking-wider font-bold transition-all text-left w-full border-b-2 lg:border-b-0 lg:border-l-4 ${
              activeTab === 'leads' ? 'text-brand-orange border-brand-orange bg-[#EDEAE3]/40' : 'text-brand-dark-grey border-transparent hover:text-brand-black hover:bg-brand-cream/30'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Inbox className="w-4 h-4" /> Kotak Masuk
            </div>
            {leads.length > 0 && (
              <span className="bg-brand-orange text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{leads.length}</span>
            )}
          </button>

        </nav>

        {/* CMS WORKSPACE CONTENT */}
        <main className="flex-1 bg-white border border-[#D6D2C8] p-6 sm:p-8 min-h-[500px] shadow-sm relative">

          {/* SAVE SUCCESS TOAST ACTION FLOATING */}
          <AnimatePresence>
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 15 }}
                className="absolute top-4 right-4 bg-emerald-500 text-white py-3.5 px-5 select-none z-50 flex items-center gap-2 text-xs font-bold shadow-xl border border-emerald-400 rounded-none"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{toastMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ==================== TAB 1: GENERAL CONFIGS ==================== */}
          {activeTab === 'general' && (
            <div className="space-y-6" id="cms-tab-general">
              <div className="border-b border-[#D6D2C8] pb-4">
                <h2 className="text-xl font-serif text-[#1A1A18] font-normal tracking-tight">Pengaturan Utama Website</h2>
                <p className="text-xs text-brand-grey">Konfigurasikan variabel inti global seperti Kontak, Email Inquiry, dan Nama Profil yang akan direfleksikan di footer dan navigasi.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-brand-dark-grey block">Nama Website (Site Title)</label>
                  <input
                    type="text"
                    value={generalSettings.siteName}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                    className="w-full text-xs font-sans px-3 py-2.5 border border-[#D6D2C8] bg-brand-white focus:border-brand-orange focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-brand-dark-grey block">Email Inquiry Penjualan</label>
                  <input
                    type="email"
                    value={generalSettings.supportEmail}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, supportEmail: e.target.value })}
                    className="w-full text-xs font-sans px-3 py-2.5 border border-[#D6D2C8] bg-brand-white focus:border-brand-orange focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-brand-dark-grey block">Nomer Telepon Kantor (P)</label>
                  <input
                    type="text"
                    value={generalSettings.phone}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, phone: e.target.value })}
                    className="w-full text-xs font-sans px-3 py-2.5 border border-[#D6D2C8] bg-brand-white focus:border-brand-orange focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-brand-dark-grey block">Alamat Kantor Pusat (A)</label>
                  <textarea
                    rows={2}
                    value={generalSettings.address}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                    className="w-full text-xs font-sans p-3 border border-[#D6D2C8] bg-brand-white focus:border-brand-orange focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-brand-dark-grey block">Meta Deskripsi Website (Footer sub)</label>
                  <textarea
                    rows={2}
                    value={generalSettings.subTitle}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, subTitle: e.target.value })}
                    className="w-full text-xs font-sans p-3 border border-[#D6D2C8] bg-brand-white focus:border-brand-orange focus:outline-none"
                  />
                </div>

                {/* MEDIA VISUAL BACKGROUND BERANDA (HOMEPAGE IMAGES) */}
                <div className="md:col-span-2 pt-4 border-t border-[#D6D2C8] mt-4 space-y-4">
                  <h3 className="text-sm font-serif text-[#1A1A18] font-normal tracking-tight">Media Gambar Beranda (Homepage Images)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[9px] uppercase font-bold tracking-wider text-[#A8A49C] block">Gambar Studi Elevasi Residensial (Quote Section)</label>
                      <input
                        type="text"
                        value={generalSettings.homeElevasiImageUrl || ''}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, homeElevasiImageUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full text-xs font-sans px-3 py-2.5 border border-[#D6D2C8] bg-brand-white focus:border-brand-orange focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase font-bold tracking-wider text-[#A8A49C] block">Gambar Alur Panduan Proses Brief (Beranda)</label>
                      <input
                        type="text"
                        value={generalSettings.homeProcessBriefImageUrl || ''}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, homeProcessBriefImageUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full text-xs font-sans px-3 py-2.5 border border-[#D6D2C8] bg-brand-white focus:border-brand-orange focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase font-bold tracking-wider text-[#A8A49C] block">Gambar Testimonial Pemilik Carmen (Beranda)</label>
                      <input
                        type="text"
                        value={generalSettings.homeTestimonialImageUrl || ''}
                        onChange={(e) => setGeneralSettings({ ...generalSettings, homeTestimonialImageUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full text-xs font-sans px-3 py-2.5 border border-[#D6D2C8] bg-brand-white focus:border-brand-orange focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#D6D2C8] flex justify-end">
                <button
                  onClick={handleSaveGeneral}
                  className="px-5 py-3.5 bg-brand-black text-[#EDEAE3] hover:bg-brand-orange hover:text-white transition-all text-xs font-bold uppercase tracking-widest inline-flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Simpan Perubahan
                </button>
              </div>
            </div>
          )}

          {/* ==================== TAB 2: HOME PAGE CONTENT ==================== */}
          {activeTab === 'home' && (
            <div className="space-y-8" id="cms-tab-home">
              <div className="border-b border-[#D6D2C8] pb-4">
                <h2 className="text-xl font-serif text-[#1A1A18] font-normal tracking-tight">Halaman Utama (Beranda)</h2>
                <p className="text-xs text-brand-grey">Perbarui list slides hero bertata estetik dan detail ethos perancangan kustom tropis.</p>
              </div>

              {/* HERO SLIDES MANAGERS (3 SLIDES) */}
              <div className="space-y-6">
                <h3 className="text-xs uppercase font-bold tracking-wider text-brand-orange font-mono flex items-center gap-1.5 border-b border-[#D6D2C8] pb-2">
                  ✦ EDIT HERO SLIDER CAROUSEL (3 SLIDES)
                </h3>

                {heroSlides.map((slide, idx) => (
                  <div key={idx} className="bg-[#FAF9F5] p-5 border border-[#D6D2C8] rounded-xs space-y-4">
                    <div className="flex justify-between items-center border-b border-brand-black/5 pb-2">
                      <span className="font-mono text-[10px] font-bold text-brand-orange">SLIDE_NUM_{slide.num}</span>
                      <span className="text-[9px] font-sans text-brand-grey">Slide Utama Ke-{idx + 1}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-bold text-brand-dark-grey block">Judul Desain (Title)</label>
                        <input
                          type="text"
                          value={slide.title}
                          onChange={(e) => {
                            const updated = [...heroSlides];
                            updated[idx].title = e.target.value;
                            setHeroSlides(updated);
                          }}
                          className="w-full text-xs font-sans px-2.5 py-1.5 border border-[#D6D2C8] bg-white focus:border-brand-orange focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-bold text-brand-dark-grey block">Display Tag (Eksperimen / Bioklimatik)</label>
                        <input
                          type="text"
                          value={slide.displayTitle}
                          onChange={(e) => {
                            const updated = [...heroSlides];
                            updated[idx].displayTitle = e.target.value;
                            setHeroSlides(updated);
                          }}
                          className="w-full text-xs font-sans px-2.5 py-1.5 border border-[#D6D2C8] bg-white focus:border-brand-orange focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-bold text-brand-dark-grey block">Lokasi / Tahun (Location)</label>
                        <input
                          type="text"
                          value={`${slide.location}`}
                          onChange={(e) => {
                            const updated = [...heroSlides];
                            updated[idx].location = e.target.value;
                            setHeroSlides(updated);
                          }}
                          className="w-full text-xs font-sans px-2.5 py-1.5 border border-[#D6D2C8] bg-white focus:border-brand-orange focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5 md:col-span-3">
                        <label className="text-[9px] uppercase font-bold text-brand-dark-grey block">Url Gambar Cover (Unsplash URL)</label>
                        <input
                          type="text"
                          value={slide.imageUrl}
                          onChange={(e) => {
                            const updated = [...heroSlides];
                            updated[idx].imageUrl = e.target.value;
                            setHeroSlides(updated);
                          }}
                          className="w-full text-xs font-sans px-2.5 py-1.5 border border-[#D6D2C8] bg-white focus:border-brand-orange focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5 md:col-span-3">
                        <label className="text-[9px] uppercase font-bold text-brand-dark-grey block">Tagline Singkat (Deskripsi Slide)</label>
                        <textarea
                          rows={2}
                          value={slide.tagline}
                          onChange={(e) => {
                            const updated = [...heroSlides];
                            updated[idx].tagline = e.target.value;
                            setHeroSlides(updated);
                          }}
                          className="w-full text-xs font-sans p-2.5 border border-[#D6D2C8] bg-white focus:border-brand-orange focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* ETHICS VALUES TABS MANAGERS */}
              <div className="space-y-6">
                <h3 className="text-xs uppercase font-bold tracking-wider text-brand-orange font-mono flex items-center gap-1.5 border-b border-[#D6D2C8] pb-2">
                  ✦ EDIT TABS ETOS PERANCANGAN (4 TABS)
                </h3>

                {ethicsTabs.map((tab, idx) => (
                  <div key={tab.id} className="bg-[#FAF9F5] p-5 border border-[#D6D2C8] rounded-xs space-y-4">
                    <div className="flex justify-between items-center border-b border-brand-black/5 pb-2">
                      <span className="font-mono text-[10px] font-bold text-brand-orange uppercase">{tab.title} ({tab.id})</span>
                      <span className="text-[9px] font-sans text-brand-grey">Tab Filosofis Ke-{idx + 1}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-bold text-brand-dark-grey block">Label Heading Tab</label>
                        <input
                          type="text"
                          value={tab.title}
                          onChange={(e) => {
                            const updated = [...ethicsTabs];
                            updated[idx].title = e.target.value;
                            setEthicsTabs(updated);
                          }}
                          className="w-full text-xs font-sans px-2.5 py-1.5 border border-[#D6D2C8] bg-white focus:border-brand-orange focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-bold text-brand-dark-grey block">Sub-label Angka (e.g. [01 · DESAIN PASIF])</label>
                        <input
                          type="text"
                          value={tab.sub}
                          onChange={(e) => {
                            const updated = [...ethicsTabs];
                            updated[idx].sub = e.target.value;
                            setEthicsTabs(updated);
                          }}
                          className="w-full text-xs font-sans px-2.5 py-1.5 border border-[#D6D2C8] bg-white focus:border-brand-orange focus:outline-none"
                        />
                      </div>

                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[9px] uppercase font-bold text-brand-dark-grey block">Deskripsi Detail Filosofi</label>
                        <textarea
                          rows={3}
                          value={tab.desc}
                          onChange={(e) => {
                            const updated = [...ethicsTabs];
                            updated[idx].desc = e.target.value;
                            setEthicsTabs(updated);
                          }}
                          className="w-full text-xs font-sans p-2.5 border border-[#D6D2C8] bg-white focus:border-brand-orange focus:outline-none"
                        />
                      </div>

                      <div className="bg-white p-3 border border-[#D6D2C8]/50 space-y-3 rounded-xs col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[9px] uppercase font-bold text-brand-orange block">Bullet Point 1: Judul</label>
                          <input
                            type="text"
                            value={tab.point1Title}
                            onChange={(e) => {
                              const updated = [...ethicsTabs];
                              updated[idx].point1Title = e.target.value;
                              setEthicsTabs(updated);
                            }}
                            className="w-full text-xs font-sans px-2 py-1 border border-[#D6D2C8]"
                          />
                          <label className="text-[8px] uppercase font-semibold text-brand-dark-grey block">Bullet Point 1: Keterangan</label>
                          <input
                            type="text"
                            value={tab.point1Desc}
                            onChange={(e) => {
                              const updated = [...ethicsTabs];
                              updated[idx].point1Desc = e.target.value;
                              setEthicsTabs(updated);
                            }}
                            className="w-full text-xs font-sans px-2 py-1 border border-[#D6D2C8]"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[9px] uppercase font-bold text-brand-orange block">Bullet Point 2: Judul</label>
                          <input
                            type="text"
                            value={tab.point2Title}
                            onChange={(e) => {
                              const updated = [...ethicsTabs];
                              updated[idx].point2Title = e.target.value;
                              setEthicsTabs(updated);
                            }}
                            className="w-full text-xs font-sans px-2 py-1 border border-[#D6D2C8]"
                          />
                          <label className="text-[8px] uppercase font-semibold text-brand-dark-grey block">Bullet Point 2: Keterangan</label>
                          <input
                            type="text"
                            value={tab.point2Desc}
                            onChange={(e) => {
                              const updated = [...ethicsTabs];
                              updated[idx].point2Desc = e.target.value;
                              setEthicsTabs(updated);
                            }}
                            className="w-full text-xs font-sans px-2 py-1 border border-[#D6D2C8]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-[#D6D2C8] flex justify-end">
                <button
                  onClick={handleSaveHome}
                  className="px-5 py-3.5 bg-brand-black text-[#EDEAE3] hover:bg-brand-orange hover:text-white transition-all text-xs font-bold uppercase tracking-widest inline-flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Simpan Beranda
                </button>
              </div>
            </div>
          )}

          {/* ==================== TAB 3: PORTFOLIO (WORKS) LIST AND FORM ==================== */}
          {activeTab === 'works' && (
            <div className="space-y-6" id="cms-tab-portfolio">
              <div className="border-b border-[#D6D2C8] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-serif text-[#1A1A18] font-normal tracking-tight">Portofolio Karya Arsitektural</h2>
                  <p className="text-xs text-brand-grey">Atur dan tambahkan karya baru yang ditampilkan pada filter utama halaman Galeri / Karya.</p>
                </div>
                {!editingProject && (
                  <button
                    onClick={handleStartAddProject}
                    className="px-4 py-2.5 bg-brand-orange text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1 hover:bg-brand-black transition-all"
                  >
                    <Plus className="w-4 h-4" /> Tambah Karya Baru
                  </button>
                )}
              </div>

              {/* PROJECT EDITING/ADDING FORM SHOWN DYNAMICALLY */}
              {editingProject ? (
                <div className="bg-[#FAF9F5] p-6 border border-brand-orange/40 rounded-xs space-y-4">
                  <div className="flex justify-between items-center border-b border-brand-orange/20 pb-2">
                    <span className="font-mono text-xs font-bold text-brand-orange">
                      {isAddingProject ? 'TAMBAH ARSIP BARU' : `EDIT ARSIP: ID ${editingProject.id}`}
                    </span>
                    <button
                      onClick={() => setEditingProject(null)}
                      className="text-[10px] font-bold uppercase tracking-wider text-brand-dark-grey hover:text-brand-orange"
                    >
                      Batal [X]
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase font-bold text-brand-dark-grey block">Judul Desain (e.g. Griya Jaloura)</label>
                      <input
                        type="text"
                        value={editingProject.title}
                        onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                        className="w-full text-xs font-sans px-2.5 py-1.5 border border-[#D6D2C8]"
                        placeholder="Nama gedung atau rumah..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-bold text-brand-dark-grey block">Kategori</label>
                        <select
                          value={editingProject.category}
                          onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                          className="w-full text-xs font-sans px-2 py-1.5 border border-[#D6D2C8] bg-white"
                        >
                          <option value="Rumah Baru">Rumah Baru</option>
                          <option value="Renovasi">Renovasi</option>
                          <option value="Komersial">Komersial</option>
                          <option value="Desain Interior">Desain Interior</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-bold text-brand-dark-grey block">Tahun Selesai</label>
                        <input
                          type="text"
                          value={editingProject.year}
                          onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                          className="w-full text-xs font-sans px-2 py-1 border border-[#D6D2C8]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase font-bold text-brand-dark-grey block">Lokasi Tapak (e.g. Canggu, Bali)</label>
                      <input
                        type="text"
                        value={editingProject.location}
                        onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                        className="w-full text-xs font-sans px-2.5 py-1.5 border border-[#D6D2C8]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase font-bold text-brand-dark-grey block">Luas Area Bangunan (e.g. 240 m²)</label>
                      <input
                        type="text"
                        value={editingProject.area}
                        onChange={(e) => setEditingProject({ ...editingProject, area: e.target.value })}
                        className="w-full text-xs font-sans px-2.5 py-1.5 border border-[#D6D2C8]"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[9px] uppercase font-bold text-brand-dark-grey block">Sub-header / Tag Status (e.g. Paddington, QLD · Selesai 2024)</label>
                      <input
                        type="text"
                        value={editingProject.sub}
                        onChange={(e) => setEditingProject({ ...editingProject, sub: e.target.value })}
                        className="w-full text-xs font-sans px-2.5 py-1.5 border border-[#D6D2C8]"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[9px] uppercase font-bold text-brand-dark-grey block">Cover Image URL (HD Unsplash Link)</label>
                      <input
                        type="text"
                        value={editingProject.imageUrl}
                        onChange={(e) => setEditingProject({ ...editingProject, imageUrl: e.target.value })}
                        className="w-full text-xs font-sans px-2.5 py-1.5 border border-[#D6D2C8]"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[9px] uppercase font-bold text-brand-dark-grey block">Narasi Karakter Materialitas (Materiality)</label>
                      <textarea
                        rows={2}
                        value={editingProject.materiality}
                        onChange={(e) => setEditingProject({ ...editingProject, materiality: e.target.value })}
                        className="w-full text-xs font-sans p-2.5 border border-[#D6D2C8]"
                        placeholder="Rangka beton pratekan kustom, batu alam lokal..."
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[9px] uppercase font-bold text-brand-dark-grey block">Narasi Konseptual Utama (Description)</label>
                      <textarea
                        rows={3}
                        value={editingProject.description}
                        onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                        className="w-full text-xs font-sans p-2.5 border border-[#D6D2C8]"
                        placeholder="Uraikan filosofi tapak dan sirkulasi bioklimatik..."
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[9px] uppercase font-bold text-brand-dark-grey block">Rincian Detail Unggulan Teknis (Garis Baru per Item)</label>
                      <textarea
                        rows={3}
                        value={editingProject.details.join('\n')}
                        onChange={(e) => setEditingProject({ ...editingProject, details: e.target.value.split('\n') })}
                        className="w-full text-xs font-sans p-2.5 border border-[#D6D2C8]"
                        placeholder="Point superior 1&#10;Point superior 2"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-[#D6D2C8]/30">
                    <button
                      onClick={() => setEditingProject(null)}
                      className="px-4 py-2 text-xs uppercase font-bold tracking-wider text-brand-dark-grey hover:bg-[#EDEAE3] rounded-none"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSaveProjectForm}
                      className="px-5 py-2.5 bg-brand-black text-white hover:bg-brand-orange text-xs font-bold uppercase tracking-wider flex items-center gap-1"
                    >
                      <Save className="w-4 h-4" /> Simpan Karya
                    </button>
                  </div>
                </div>
              ) : (
                /* PROJECTS ARSIP GRID LIST */
                <div className="space-y-3">
                  <span className="text-[10px] uppercase font-bold text-[#7A7870] block">Daftar Karya Tersimpan ({worksProjects.length})</span>
                  
                  <div className="divide-y divide-[#D6D2C8] border border-[#D6D2C8]">
                    {worksProjects.map((proj) => (
                      <div key={proj.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 gap-4 bg-white hover:bg-[#FAF9F5] transition-all">
                        <div className="flex items-center gap-4">
                          <img 
                            src={proj.imageUrl} 
                            alt={proj.title} 
                            referrerPolicy="no-referrer"
                            className="w-16 h-12 object-cover bg-neutral-100 border border-[#D6D2C8]/50" 
                          />
                          <div>
                            <span className="font-serif text-sm font-semibold text-[#1A1A18] block">{proj.title}</span>
                            <span className="text-[10px] text-brand-grey font-sans">{proj.category} · {proj.location} ({proj.year}) · {proj.area}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStartEditProject(proj)}
                            className="p-2 border border-[#D6D2C8] text-brand-dark-grey hover:text-brand-orange hover:border-brand-orange/40 bg-[#FAF9F5] rounded-none"
                            title="Edit Proyek"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="p-2 border border-red-200 text-red-500 hover:text-red-700 hover:bg-red-50 hover:border-red-400 rounded-none animate-pulse"
                            title="Hapus Proyek"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================== TAB 4: STUDIO INFO & MEMBERS ==================== */}
          {activeTab === 'studio' && (
            <div className="space-y-8" id="cms-tab-studio">
              <div className="border-b border-[#D6D2C8] pb-4">
                <h2 className="text-xl font-serif text-[#1A1A18] font-normal tracking-tight">Kanal Tentang Studio &amp; Tim Kredensial</h2>
                <p className="text-xs text-brand-grey">Kelola narrative branding biro arsitektur, quote, spesifikasi keahlian, dan 7 staf professional arsitek.</p>
              </div>

              {/* HEADING TEXTS */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase font-bold tracking-wider text-brand-orange font-mono border-b border-[#D6D2C8]/60 pb-1 flex items-center gap-1">
                  ✦ EDIT NARRATIVE ABOUT
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[9px] uppercase font-bold text-brand-dark-grey block">Headline Terbuka Studio (Studio Hero Title)</label>
                    <input
                      type="text"
                      value={studioHeader.aboutTitle}
                      onChange={(e) => setStudioHeader({ ...studioHeader, aboutTitle: e.target.value })}
                      className="w-full text-xs font-sans px-2.5 py-1.5 border border-[#D6D2C8]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-bold text-brand-dark-grey block">Paragraf Keterangan 1 (Studio Text Left)</label>
                    <textarea
                      rows={4}
                      value={studioHeader.aboutDesc1}
                      onChange={(e) => setStudioHeader({ ...studioHeader, aboutDesc1: e.target.value })}
                      className="w-full text-xs font-sans p-2.5 border border-[#D6D2C8]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-bold text-brand-dark-grey block">Paragraf Keterangan 2 (Studio Text Right)</label>
                    <textarea
                      rows={4}
                      value={studioHeader.aboutDesc2}
                      onChange={(e) => setStudioHeader({ ...studioHeader, aboutDesc2: e.target.value })}
                      className="w-full text-xs font-sans p-2.5 border border-[#D6D2C8]"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[9px] uppercase font-bold text-brand-dark-grey block">Branding Quote Terbuka (e.g. Kombinasi geometri arsitektural...)</label>
                    <textarea
                      rows={2}
                      value={studioHeader.quoteText}
                      onChange={(e) => setStudioHeader({ ...studioHeader, quoteText: e.target.value })}
                      className="w-full text-xs font-sans p-2.5 border border-[#D6D2C8]"
                    />
                  </div>

                  {/* ARSITEKTUR MEDIA VISUAL (STUDIO IMAGES) */}
                  <div className="md:col-span-2 pt-4 border-t border-[#D6D2C8] mt-4 space-y-3">
                    <h4 className="text-[10px] uppercase font-bold tracking-wider text-brand-orange font-mono">✦ ARSITEKTUR MEDIA VISUAL (STUDIO IMAGES)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-bold text-brand-dark-grey block">Gambar Kolom Kiri - Eksplorasi Ruang</label>
                        <input
                          type="text"
                          value={studioHeader.studioExplorasiImageUrl || ''}
                          onChange={(e) => setStudioHeader({ ...studioHeader, studioExplorasiImageUrl: e.target.value })}
                          className="w-full text-xs font-sans px-2.5 py-1.5 border border-[#D6D2C8] bg-brand-white focus:border-brand-orange focus:outline-none"
                          placeholder="https://images.unsplash.com/..."
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-bold text-brand-dark-grey block">Gambar Diagonal Kanan - Detil Kejujuran Material</label>
                        <input
                          type="text"
                          value={studioHeader.studioDetailImageUrl || ''}
                          onChange={(e) => setStudioHeader({ ...studioHeader, studioDetailImageUrl: e.target.value })}
                          className="w-full text-xs font-sans px-2.5 py-1.5 border border-[#D6D2C8] bg-brand-white focus:border-brand-orange focus:outline-none"
                          placeholder="https://images.unsplash.com/..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ARSITEK TEAM MEMBERS (7 members) */}
              <div className="space-y-6">
                <h3 className="text-xs uppercase font-bold tracking-wider text-brand-orange font-mono border-b border-[#D6D2C8]/60 pb-1 flex items-center gap-1">
                  ✦ EDIT DAFTAR 7 ANGGOTA TIM PROFESSIONAL
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {teamMembers.map((member, mIdx) => (
                    <div key={mIdx} className="bg-[#FAF9F5] border border-[#D6D2C8] p-4 rounded-xs space-y-3">
                      <div className="flex justify-between items-center border-b border-brand-black/5 pb-1">
                        <span className="font-mono text-[9px] uppercase font-bold text-brand-orange">[ANGGOTA_INTI_0{mIdx + 1}]</span>
                        <span className="text-[9px] font-serif italic text-brand-grey">{member.name || 'Arsitek Baru'}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2 space-y-1">
                          <label className="text-[8px] uppercase font-bold text-brand-dark-grey block">Nama Lengkap</label>
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) => handleTeamMemberChange(mIdx, 'name', e.target.value)}
                            className="w-full text-xs font-sans px-2 py-1 border border-[#D6D2C8]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[8px] uppercase font-bold text-brand-dark-grey block">Inisial (2 huruf)</label>
                          <input
                            type="text"
                            value={member.initials}
                            onChange={(e) => handleTeamMemberChange(mIdx, 'initials', e.target.value)}
                            className="w-full text-xs font-sans px-2 py-1 border border-[#D6D2C8]"
                          />
                        </div>

                        <div className="col-span-3 space-y-1">
                          <label className="text-[8px] uppercase font-bold text-brand-dark-grey block">Jabatan / Role</label>
                          <input
                            type="text"
                            value={member.role}
                            onChange={(e) => handleTeamMemberChange(mIdx, 'role', e.target.value)}
                            className="w-full text-xs font-sans px-2 py-1 border border-[#D6D2C8]"
                          />
                        </div>

                        <div className="col-span-3 space-y-1">
                          <label className="text-[8px] uppercase font-bold text-brand-dark-grey block">Kredensial / Surat Registrasi IAI BOA</label>
                          <textarea
                            rows={3}
                            value={member.credentials}
                            onChange={(e) => handleTeamMemberChange(mIdx, 'credentials', e.target.value)}
                            className="w-full text-[10px] font-sans p-2 border border-[#D6D2C8]"
                            placeholder="M. Arch (QUT)&#10;BOA Queensland No..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-[#D6D2C8] flex justify-end">
                <button
                  onClick={handleSaveStudio}
                  className="px-5 py-3.5 bg-brand-black text-[#EDEAE3] hover:bg-brand-orange hover:text-white transition-all text-xs font-bold uppercase tracking-widest inline-flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Simpan Perubahan Tim
                </button>
              </div>
            </div>
          )}

          {/* ==================== TAB 5: PROCESS ALUR 6 TAHAPAN ==================== */}
          {activeTab === 'process' && (
            <div className="space-y-8" id="cms-tab-process">
              <div className="border-b border-[#D6D2C8] pb-4">
                <h2 className="text-xl font-serif text-[#1A1A18] font-normal tracking-tight">Alur Kerja Sisitematika 6 Tahapan</h2>
                <p className="text-xs text-brand-grey">Sesuaikan 6 langkah utama pengawalan rancang-bangunan, status penyerahan dokumen hasil deliverables, dan ilustrasi penunjangnya.</p>
              </div>

              {/* INTRO SPECS */}
              <div className="space-y-4">
                <h3 className="text-xs uppercase font-bold tracking-wider text-brand-orange font-mono border-b border-[#D6D2C8]/60 pb-1 flex items-center gap-1">
                  ✦ EDIT KALIMAT PEMBUKA ALUR KERJA
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[9px] uppercase font-bold text-brand-dark-grey block">Judul Halaman (Hero Title)</label>
                    <input
                      type="text"
                      value={processIntro.subtitle}
                      onChange={(e) => setProcessIntro({ ...processIntro, subtitle: e.target.value })}
                      className="w-full text-xs font-sans px-2.5 py-1.5 border border-[#D6D2C8]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-bold text-brand-dark-grey block">Paragraf Pengenalan 1</label>
                    <textarea
                      rows={3}
                      value={processIntro.desc1}
                      onChange={(e) => setProcessIntro({ ...processIntro, desc1: e.target.value })}
                      className="w-full text-xs font-sans p-2.5 border border-[#D6D2C8]"
                    />
                  </div>

                  <div className="space-y-1.5 grayscale-0">
                    <label className="text-[9px] uppercase font-bold text-brand-dark-grey block">Paragraf Pengenalan 2</label>
                    <textarea
                      rows={3}
                      value={processIntro.desc2}
                      onChange={(e) => setProcessIntro({ ...processIntro, desc2: e.target.value })}
                      className="w-full text-xs font-sans p-2.5 border border-[#D6D2C8]"
                    />
                  </div>

                  {/* PROCESS COLLABORATION IMAGE */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[9px] uppercase font-bold text-brand-dark-grey block">URL Gambar Ilustrasi Kolaborasi Samping (Process Intro Image)</label>
                    <input
                      type="text"
                      value={processIntro.imageUrl || ''}
                      onChange={(e) => setProcessIntro({ ...processIntro, imageUrl: e.target.value })}
                      className="w-full text-xs font-sans px-2.5 py-1.5 border border-[#D6D2C8] bg-brand-white focus:border-brand-orange focus:outline-none"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                </div>
              </div>

              {/* 6 STAGES EDITORS */}
              <div className="space-y-6">
                <h3 className="text-xs uppercase font-bold tracking-wider text-brand-orange font-mono border-b border-[#D6D2C8]/60 pb-1 flex items-center gap-1">
                  ✦ EDIT DOKUMEN 6 TAHAP KONSTRUKSI
                </h3>

                {processStages.map((stage, sIdx) => (
                  <div key={sIdx} className="bg-[#FAF9F5] border border-[#D6D2C8] p-5 rounded-xs space-y-4">
                    <div className="flex justify-between items-center border-b border-brand-black/5 pb-1">
                      <span className="font-mono text-[9px] uppercase font-bold text-brand-orange">[TAHAPAN_KERJA_0{stage.num}]</span>
                      <span className="text-[9px] font-serif italic text-brand-grey">{stage.badge}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-bold text-brand-dark-grey block">Judul Tahapan</label>
                        <input
                          type="text"
                          value={stage.title}
                          onChange={(e) => handleStageChange(sIdx, 'title', e.target.value)}
                          className="w-full text-xs font-sans px-2.5 py-1.5 border border-[#D6D2C8]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] uppercase font-bold text-brand-dark-grey block">Kelompok / Badge (e.g. Visualisasi Realistis)</label>
                        <input
                          type="text"
                          value={stage.badge}
                          onChange={(e) => handleStageChange(sIdx, 'badge', e.target.value)}
                          className="w-full text-xs font-sans px-2.5 py-1.5 border border-[#D6D2C8]"
                        />
                      </div>

                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[9px] uppercase font-bold text-brand-dark-grey block">Ilustrasi Gambar URL (Next Image Source)</label>
                        <input
                          type="text"
                          value={stage.imageUrl}
                          onChange={(e) => handleStageChange(sIdx, 'imageUrl', e.target.value)}
                          className="w-full text-xs font-sans px-2.5 py-1.5 border border-[#D6D2C8]"
                        />
                      </div>

                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-[9px] uppercase font-bold text-brand-dark-grey block">Narasi Penjabaran Detail Tahapan</label>
                        <textarea
                          rows={3}
                          value={stage.desc}
                          onChange={(e) => handleStageChange(sIdx, 'desc', e.target.value)}
                          className="w-full text-xs font-sans p-2.5 border border-[#D6D2C8]"
                        />
                      </div>

                      <div className="space-y-1.5 md:col-span-2 bg-white p-3 border border-[#D6D2C8]/50 rounded-xs">
                        <label className="text-[9px] uppercase font-bold text-brand-orange block">Dokumen Deliverables Penyerahan Khusus (Satu baris per Item)</label>
                        <textarea
                          rows={3}
                          value={stage.deliverables.join('\n')}
                          onChange={(e) => handleStageChange(sIdx, 'deliverables', e.target.value.split('\n'))}
                          className="w-full text-xs font-sans p-2 border border-[#D6D2C8]"
                          placeholder="Draft PDF Gambar kerja..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-[#D6D2C8] flex justify-end">
                <button
                  onClick={handleSaveProcess}
                  className="px-5 py-3.5 bg-brand-black text-[#EDEAE3] hover:bg-brand-orange hover:text-white transition-all text-xs font-bold uppercase tracking-widest inline-flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Simpan Proses Kerja
                </button>
              </div>
            </div>
          )}

          {/* ==================== TAB 6: RAB CONFIGURATION & FORMULAS ==================== */}
          {activeTab === 'rab' && (
            <div className="space-y-6" id="cms-tab-rab-config">
              <div className="border-b border-[#D6D2C8] pb-4">
                <h2 className="text-xl font-serif text-[#1A1A18] font-normal tracking-tight">Konfigurasi Formula Kalkulasi RAB</h2>
                <p className="text-xs text-brand-grey">Sesuaikan nominal harga standar per meter persegi untuk tiap tingkatan spesifikasi, perkiraan multipliers, sirkulasi, dan add-ons.</p>
              </div>

              <div className="bg-[#FAF9F5] border border-[#D6D2C8] p-5 rounded-xs space-y-4">
                <span className="text-[10px] uppercase font-bold text-brand-orange font-mono block">✦ HARGA RUANG PER METER PERSEGI (KURS IDR)</span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-brand-dark-grey block">Sederhana / Praktis (Rp / m²)</label>
                    <input
                      type="number"
                      value={rabConfig.priceStandard}
                      onChange={(e) => setRabConfig({ ...rabConfig, priceStandard: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs font-sans px-2.5 py-1.5 border border-[#D6D2C8]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-brand-dark-grey block">Menengah / Modern (Rp / m²)</label>
                    <input
                      type="number"
                      value={rabConfig.priceMedium}
                      onChange={(e) => setRabConfig({ ...rabConfig, priceMedium: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs font-sans px-2.5 py-1.5 border border-[#D6D2C8]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-brand-dark-grey block">Premium / Luxury (Rp / m²)</label>
                    <input
                      type="number"
                      value={rabConfig.pricePremium}
                      onChange={(e) => setRabConfig({ ...rabConfig, pricePremium: parseInt(e.target.value) || 0 })}
                      className="w-full text-xs font-sans px-2.5 py-1.5 border border-[#D6D2C8]"
                    />
                  </div>
                </div>
              </div>

              {/* FLOOR AND RENOVATION MULTIPLIERS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#FAF9F5] border border-[#D6D2C8] p-4 rounded-xs space-y-3">
                  <span className="text-[10px] uppercase font-bold text-brand-orange font-mono block">✦ KELIPATAN JASA LANTAI TINGKAT (MULTIPLIER)</span>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase font-bold text-brand-dark-grey block">Lantai 2 (e.g. 1.15)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={rabConfig.floorMultipliers[2]}
                        onChange={(e) => {
                          const updated = { ...rabConfig.floorMultipliers, 2: parseFloat(e.target.value) || 1 };
                          setRabConfig({ ...rabConfig, floorMultipliers: updated });
                        }}
                        className="w-full text-xs px-2 py-1 border border-[#D6D2C8]"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-[8px] uppercase font-bold text-brand-dark-grey block">Lantai 3 (e.g. 1.25)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={rabConfig.floorMultipliers[3]}
                        onChange={(e) => {
                          const updated = { ...rabConfig.floorMultipliers, 3: parseFloat(e.target.value) || 1 };
                          setRabConfig({ ...rabConfig, floorMultipliers: updated });
                        }}
                        className="w-full text-xs px-2 py-1 border border-[#D6D2C8]"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-[#FAF9F5] border border-[#D6D2C8] p-4 rounded-xs space-y-3">
                  <span className="text-[10px] uppercase font-bold text-brand-orange font-mono block">✦ FAKTOR DISKON SUB-STRUKTUR RENOVASI</span>
                  <div className="space-y-1">
                    <label className="text-[8px] uppercase font-bold text-brand-dark-grey block">Koefisien Diskon Pekerjaan (default 0.65)</label>
                    <input
                      type="number"
                      step="0.05"
                      value={rabConfig.renovationMultiplier}
                      onChange={(e) => setRabConfig({ ...rabConfig, renovationMultiplier: parseFloat(e.target.value) || 0.65 })}
                      className="w-full text-xs px-2.5 py-1.5 border border-[#D6D2C8]"
                    />
                    <span className="text-[8px] text-brand-grey block mt-1">Menghemat ±35% porsi pondasi dasar struktural dibanding konstruksi dari nol.</span>
                  </div>
                </div>
              </div>

              {/* ADDITIONAL AND LUXURY SERVICES */}
              <div className="bg-[#FAF9F5] border border-[#D6D2C8] p-5 rounded-xs space-y-4">
                <span className="text-[10px] uppercase font-bold text-brand-orange font-mono block">✦ TARIF JASA TAMBAHAN &amp; AKSESORIS LUXURY (ADD-ONS)</span>

                <div className="space-y-4 divide-y divide-[#D6D2C8]/50">
                  {Object.keys(rabConfig.addonCosts).map((key) => {
                    const addon = rabConfig.addonCosts[key];
                    return (
                      <div key={key} className="pt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <span className="text-[9px] font-semibold text-brand-grey italic">Sistem Key: {key}</span>
                          <input
                            type="text"
                            value={addon.label}
                            onChange={(e) => {
                              const updated = { ...rabConfig.addonCosts };
                              updated[key].label = e.target.value;
                              setRabConfig({ ...rabConfig, addonCosts: updated });
                            }}
                            className="w-full text-xs font-sans px-2 py-1 border border-[#D6D2C8]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[8px] uppercase font-bold text-brand-dark-grey block">Biaya Tetap Sewaan (IDR)</label>
                          <input
                            type="number"
                            value={addon.cost}
                            onChange={(e) => {
                              const updated = { ...rabConfig.addonCosts };
                              updated[key].cost = parseInt(e.target.value) || 0;
                              setRabConfig({ ...rabConfig, addonCosts: updated });
                            }}
                            className="w-full text-xs font-sans px-2 py-1 border border-[#D6D2C8]"
                          />
                        </div>

                        <div className="space-y-1 col-span-1">
                          <label className="text-[8px] uppercase font-bold text-brand-dark-grey block">Batas Keterangan Aksesoris</label>
                          <input
                            type="text"
                            value={addon.description}
                            onChange={(e) => {
                              const updated = { ...rabConfig.addonCosts };
                              updated[key].description = e.target.value;
                              setRabConfig({ ...rabConfig, addonCosts: updated });
                            }}
                            className="w-full text-xs font-sans px-2 py-1 border border-[#D6D2C8]"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RAB STYLE PREVIEW IMAGES */}
              <div className="bg-[#FAF9F5] border border-[#D6D2C8] p-5 rounded-xs space-y-4">
                <span className="text-[10px] uppercase font-bold text-brand-orange font-mono block">✦ GAMBAR ILUSTRASI FASAD RENDER PERSPEKTIF AI (STYLE PREVIEWS)</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-brand-dark-grey block">Minimalis Modern (Preview Image URL)</label>
                    <input
                      type="text"
                      value={rabConfig.styleMinimalistImg || ''}
                      onChange={(e) => setRabConfig({ ...rabConfig, styleMinimalistImg: e.target.value })}
                      className="w-full text-xs font-sans px-2.5 py-1.5 border border-[#D6D2C8] bg-brand-white"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-brand-dark-grey block">Tropis Modern (Preview Image URL)</label>
                    <input
                      type="text"
                      value={rabConfig.styleTropicalImg || ''}
                      onChange={(e) => setRabConfig({ ...rabConfig, styleTropicalImg: e.target.value })}
                      className="w-full text-xs font-sans px-2.5 py-1.5 border border-[#D6D2C8] bg-brand-white"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-brand-dark-grey block">Industrial Kontemporer (Preview Image URL)</label>
                    <input
                      type="text"
                      value={rabConfig.styleIndustrialImg || ''}
                      onChange={(e) => setRabConfig({ ...rabConfig, styleIndustrialImg: e.target.value })}
                      className="w-full text-xs font-sans px-2.5 py-1.5 border border-[#D6D2C8] bg-brand-white"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase font-bold text-brand-dark-grey block">Klasik Modern (Preview Image URL)</label>
                    <input
                      type="text"
                      value={rabConfig.styleClassicImg || ''}
                      onChange={(e) => setRabConfig({ ...rabConfig, styleClassicImg: e.target.value })}
                      className="w-full text-xs font-sans px-2.5 py-1.5 border border-[#D6D2C8] bg-brand-white"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#D6D2C8] flex justify-end">
                <button
                  onClick={handleSaveRab}
                  className="px-5 py-3.5 bg-brand-black text-[#EDEAE3] hover:bg-brand-orange hover:text-white transition-all text-xs font-bold uppercase tracking-widest inline-flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Simpan Rumus RAB
                </button>
              </div>
            </div>
          )}

          {/* ==================== TAB 7: LEADER INBOX MANAGEMENT ==================== */}
          {activeTab === 'leads' && (
            <div className="space-y-6" id="cms-tab-leads">
              <div className="border-b border-[#D6D2C8] pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-serif text-[#1A1A18] font-normal tracking-tight">Kotak Masuk Konsultasi Klien</h2>
                  <p className="text-xs text-brand-grey">Tingkatkan efektivitas follow-up dengan mengakses seluruh masukan (leads) dari form janji konsultasi dan sirkulasi estimasi RAB.</p>
                </div>

                <button
                  onClick={handleSimulateInboundLead}
                  className="px-4 py-2.5 bg-brand-black text-[#EDEAE3] hover:text-[#EDEAE3] hover:bg-brand-orange transition-all text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Simulasikan Pesan Masuk
                </button>
              </div>

              {/* SEARCH FILTER BOX */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-brand-grey" />
                <input
                  type="text"
                  value={searchLeadQuery}
                  onChange={(e) => setSearchLeadQuery(e.target.value)}
                  placeholder="Cari nama klien, nomor telfon, email atau bagian pesan..."
                  className="w-full text-xs font-sans pl-10 pr-4 py-2.5 border border-[#D6D2C8] bg-[#FAF9F5] focus:bg-white focus:outline-none focus:border-brand-orange"
                />
              </div>

              {/* TWO SIDES GRID: LEFT LIST, RIGHT DETAIL PANEL */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* LIST PANEL (5 COLS) */}
                <div className="lg:col-span-12 xl:col-span-5 space-y-3 max-h-[460px] overflow-y-auto border border-[#D6D2C8] divide-y divide-[#D6D2C8]">
                  {filteredLeads.length > 0 ? (
                    filteredLeads.map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className={`p-3.5 text-left cursor-pointer transition-all flex flex-col gap-1 ${
                          selectedLead && selectedLead.id === lead.id ? 'bg-[#EDEAE3]/65 border-l-4 border-brand-orange' : 'bg-white hover:bg-[#FAF9F5]'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <h4 className="font-serif text-xs font-semibold text-[#1A1A18]">{lead.name}</h4>
                          <span className="font-mono text-[8px] text-brand-grey">{new Date(lead.submittedAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-[10px] text-brand-dark-grey truncate max-w-sm">{lead.phone} · {lead.email || 'tanpa_email'}</p>
                        {lead.message && (
                          <p className="text-[10px] text-brand-grey italic line-clamp-1">"{lead.message}"</p>
                        )}
                        {lead.rabEstimateId && (
                          <span className="font-mono text-[8pm] scale-90 self-start mt-1 text-brand-orange py-0.5 px-2 bg-brand-orange/5 border border-brand-orange/15 rounded-full uppercase tracking-wider font-bold">Terlampir RAB</span>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-brand-grey text-xs py-14 bg-white">
                      <AlertCircle className="w-8 h-8 text-brand-grey/50 mx-auto mb-2" />
                      Belum ada konsultasi masuk atau tidak ditemukan kecocokan pencarian.
                    </div>
                  )}
                </div>

                {/* DETAIL PANEL (7 COLS) */}
                <div className="lg:col-span-12 xl:col-span-7 border border-[#D6D2C8] p-5 bg-[#FAF9F5] rounded-xs space-y-4">
                  {selectedLead ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-start border-b border-[#D6D2C8] pb-3">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-mono uppercase tracking-widest text-brand-orange font-bold">[Detail Lembar Konsultasi Klien]</span>
                          <h3 className="font-serif text-base font-semibold text-brand-black">{selectedLead.name}</h3>
                          <span className="text-[10px] text-brand-grey font-sans">Masuk pada: {new Date(selectedLead.submittedAt).toLocaleString('id-ID')}</span>
                        </div>
                        <button
                          onClick={() => handleDeleteLead(selectedLead.id)}
                          className="px-2.5 py-1 text-[9px] bg-red-50 hover:bg-red-200 text-red-600 rounded-none uppercase font-bold text-xs"
                        >
                          Hapus Data
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-xs font-sans bg-white p-3 border border-[#D6D2C8]/50">
                        <div>
                          <span className="text-[9px] text-[#7A7870] uppercase font-bold block">No. HP / Whatsapp</span>
                          <p className="font-semibold text-brand-black">{selectedLead.phone}</p>
                        </div>
                        <div>
                          <span className="text-[9px] text-[#7A7870] uppercase font-bold block">Alamat Email</span>
                          <p className="font-semibold text-brand-black">{selectedLead.email || 'Tidak dicantumkan'}</p>
                        </div>
                      </div>

                      {selectedLead.message && (
                        <div className="space-y-1">
                          <span className="text-[9px] text-[#7A7870] uppercase font-bold block">Pesan Lengkap</span>
                          <p className="text-xs text-[#3C3A35] bg-white p-3 border border-[#D6D2C8]/50 leading-relaxed italic">
                            "{selectedLead.message}"
                          </p>
                        </div>
                      )}

                      {/* EXTRA DATA ATTACHED CHECK */}
                      <div className="space-y-2 pt-2">
                        <span className="text-[9px] uppercase font-bold text-brand-orange font-mono block">✦ INTEGRASI ARSIP INTEGRASI</span>
                        <div className="text-[11px] text-[#4E4D48] bg-white p-3.5 border border-[#D6D2C8]/50 space-y-2 rounded-xs font-sans">
                          <p className="flex items-center gap-1.5">&#8226; <strong>ID Estimasi RAB:</strong> {selectedLead.rabEstimateId ? <span className="text-brand-orange">{selectedLead.rabEstimateId}</span> : 'Belum mengkalkulasi'}</p>
                          <p className="flex items-center gap-1.5">&#8226; <strong>ID Layout Denah:</strong> {selectedLead.floorPlanId ? <span className="text-brand-orange">{selectedLead.floorPlanId}</span> : 'Belum membuat penataan'}</p>
                          <p className="flex items-center gap-1.5">&#8226; <strong>ID Model Visualisasi:</strong> {selectedLead.aiRenderId ? <span className="text-[#3399FF]">{selectedLead.aiRenderId}</span> : 'Belum render visual'}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-24 text-brand-grey text-xs">
                      <Inbox className="w-10 h-10 text-brand-grey/40 mx-auto mb-2 animate-bounce" />
                      Silakan pilih salah satu baris pesan masuk di panel kiri untuk membuka rincian deskripsi, no Whasapp, dan lampiran perhitungan RAB.
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
