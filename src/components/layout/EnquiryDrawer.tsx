/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowLeft, ArrowRight, Check, AlertTriangle } from 'lucide-react';
import { LeadInput } from '../../types';

interface EnquiryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitLead: (lead: any) => Promise<boolean>;
  initialRabData?: any;
  initialFloorPlanData?: any;
}

export default function EnquiryDrawer({
  isOpen,
  onClose,
  onSubmitLead,
  initialRabData,
  initialFloorPlanData
}: EnquiryDrawerProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMess, setErrorMess] = useState('');

  // Form Fields State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    workedWithArchitect: '',
    projectTypes: [] as string[],
    location: '',
    timeline: '',
    budgetRange: '',
    hasBuilder: '',
    builderDetails: '',
    additionalInfo: '',
    source: '',
    sourceOther: ''
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Nama lengkap wajib diisi.';
      if (!formData.email.trim()) {
        newErrors.email = 'Alamat email wajib diisi.';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Format email tidak valid.';
      }
    } else if (step === 4) {
      if (!formData.location.trim()) newErrors.location = 'Lokasi pembangunan wajib diisi.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 8) {
        setCurrentStep(prev => prev + 1);
        setErrorMess('');
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setErrorMess('');
    }
  };

  const toggleProjectType = (type: string) => {
    setFormData(prev => {
      const isSelected = prev.projectTypes.includes(type);
      const updated = isSelected
        ? prev.projectTypes.filter(t => t !== type)
        : [...prev.projectTypes, type];
      return { ...prev, projectTypes: updated };
    });
  };

  const setRadioField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateStep(8)) return;

    setIsSubmitting(true);
    setErrorMess('');

    try {
      // Craft structural submission matching our types & carrying metadata
      const leadPayload: LeadInput = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        message: `
          [8-Step Enquiry Lead]
          Bekerja dengan arsitek sebelumnya: ${formData.workedWithArchitect || 'Tidak disebutkan'}
          Jenis proyek: ${formData.projectTypes.join(', ') || 'Tidak disebutkan'}
          Lokasi: ${formData.location}
          Timeline: ${formData.timeline || 'Tidak disebutkan'}
          Budget Range: ${formData.budgetRange || 'Tidak disebutkan'}
          Sudah sewa kontraktor: ${formData.hasBuilder || 'Tidak disebutkan'}
          Detail kontraktor: ${formData.builderDetails || '-'}
          Catatan design: ${formData.additionalInfo || '-'}
          Sumber informasi: ${formData.source}${formData.sourceOther ? ` (${formData.sourceOther})` : ''}
        `.trim(),
        rabEstimateId: initialRabData ? 'local_rab_estimate' : undefined,
        floorPlanId: initialFloorPlanData ? 'local_floor_layout' : undefined,
      };

      const success = await onSubmitLead(leadPayload);
      if (success) {
        setIsSubmitted(true);
      } else {
        setErrorMess('Terjadi kesalahan. Silakan coba kirim kembali.');
      }
    } catch (err) {
      setErrorMess('Oops! Gagal mengirimkan data formulir. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPct = (currentStep / 8) * 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay with motion */}
          <motion.div
            key="drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1A1A18]/65 z-50 backdrop-blur-[2px]"
          />

          {/* Sliding panel drawer */}
          <motion.div
            key="drawer-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-[540px] bg-[#F5F3EF] z-50 shadow-2xl flex flex-col focus:outline-none"
            id="enquiry-drawer-panel"
          >
            {/* Header control */}
            <div className="flex justify-between items-center px-8 py-5 border-b border-[#D6D2C8] bg-[#EDEAE3]">
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-medium tracking-wide text-[#1A1A18]">OH</span>
                <span className="text-[10px] uppercase tracking-[0.14em] text-[#7A7870] border-l border-[#D6D2C8] pl-3 ml-2.5">
                  Konsultasi Proyek
                </span>
              </div>
              <button
                onClick={onClose}
                className="text-[#7A7870] hover:text-[#1A1A18] text-xs uppercase tracking-[0.15em] flex items-center gap-1.5 focus:outline-none transition-colors"
                aria-label="Tutup Panel"
              >
                Tutup <X className="w-4 h-4" />
              </button>
            </div>

            {/* Progress bar line */}
            {!isSubmitted && (
              <div className="w-full h-[3px] bg-[#D6D2C8] relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.35 }}
                  className="absolute h-full left-0 top-0 bg-[#E05C38]"
                />
              </div>
            )}

            {/* Scrollable Step Body */}
            <div className="flex-grow overflow-y-auto px-8 py-10">
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success-container"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center text-center py-20"
                  >
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6 border border-emerald-100 shadow-sm animate-bounce">
                      <Check className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif text-3xl font-normal text-[#1A1A18] mb-4">
                      Terima Kasih.
                    </h3>
                    <p className="text-sm text-[#7A7870] leading-relaxed max-w-sm">
                      Kami telah menerima berkas pengajuan konsultasi Anda. Tim arsitek OH akan meninjau rincian proyek Anda dan menghubungi Anda kembali dalam waktu maksimal 5 hari kerja.
                    </p>
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setCurrentStep(1);
                        setFormData({
                          name: '',
                          email: '',
                          phone: '',
                          workedWithArchitect: '',
                          projectTypes: [],
                          location: '',
                          timeline: '',
                          budgetRange: '',
                          hasBuilder: '',
                          builderDetails: '',
                          additionalInfo: '',
                          source: '',
                          sourceOther: ''
                        });
                        onClose();
                      }}
                      className="mt-10 px-6 py-2.5 border border-[#1A1A18] text-xs uppercase tracking-widest text-[#1A1A18] font-medium hover:bg-[#1A1A18] hover:text-[#FFFFFF] transition-colors"
                    >
                      Kembali ke Website
                    </button>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`step-${currentStep}`}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col"
                  >
                    {/* STEP 1: Personal Details */}
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <span className="text-[10px] uppercase tracking-[0.14em] text-[#7A7870] font-sans block">
                          Formulir Rincian Pribadi (01/08)
                        </span>
                        <h3 className="font-serif text-2xl font-light text-[#1A1A18] leading-tight">
                          Silakan isi data kontak utama Anda
                        </h3>
                        <div className="space-y-4 pt-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] uppercase tracking-[0.1em] text-[#7A7870] font-medium">
                              Nama Lengkap *
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.name}
                              onChange={e => setFormData({ ...formData, name: e.target.value })}
                              placeholder="Ketik nama lengkap Anda"
                              className="w-full bg-white border border-[#D6D2C8] px-4 py-3 text-sm text-[#1A1A18] focus:outline-none focus:border-[#1A1A18] transition-colors"
                            />
                            {errors.name && (
                              <span className="text-red-600 text-[11px] font-sans flex items-center gap-1.5 mt-0.5">
                                <AlertTriangle className="w-3.5 h-3.5" /> {errors.name}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] uppercase tracking-[0.1em] text-[#7A7870] font-medium">
                              Alamat Email *
                            </label>
                            <input
                              type="email"
                              required
                              value={formData.email}
                              onChange={e => setFormData({ ...formData, email: e.target.value })}
                              placeholder="nama@email.com"
                              className="w-full bg-white border border-[#D6D2C8] px-4 py-3 text-sm text-[#1A1A18] focus:outline-none focus:border-[#1A1A18] transition-colors"
                            />
                            {errors.email && (
                              <span className="text-red-600 text-[11px] font-sans flex items-center gap-1.5 mt-0.5">
                                <AlertTriangle className="w-3.5 h-3.5" /> {errors.email}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] uppercase tracking-[0.1em] text-[#7A7870] font-medium">
                              Nomor Telepon / WhatsApp (Opsional)
                            </label>
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={e => setFormData({ ...formData, phone: e.target.value })}
                              placeholder="Contoh: 0812XXXXXXXX"
                              className="w-full bg-white border border-[#D6D2C8] px-4 py-3 text-sm text-[#1A1A18] focus:outline-none focus:border-[#1A1A18] transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 2: Previous Experience */}
                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <span className="text-[10px] uppercase tracking-[0.14em] text-[#7A7870] font-sans block">
                          Formulir Rincian Pribadi (02/08)
                        </span>
                        <h3 className="font-serif text-2xl font-light text-[#1A1A18] leading-tight">
                          Apakah Anda pernah berkonsultasi atau bekerja dengan arsitek sebelumnya?
                        </h3>
                        <div className="flex flex-col gap-3.5 pt-4">
                          {['Ya', 'Belum pernah'].map(opt => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setRadioField('workedWithArchitect', opt)}
                              className={`w-full text-left px-5 py-3.5 border transition-all duration-150 uppercase tracking-widest text-xs font-semibold select-none ${
                                formData.workedWithArchitect === opt
                                  ? 'bg-[#1A1A18] text-[#FFFFFF] border-[#1A1A18]'
                                  : 'bg-white text-[#1A1A18] border-[#D6D2C8] hover:border-[#1A1A18]'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* STEP 3: Project Type */}
                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <span className="text-[10px] uppercase tracking-[0.14em] text-[#7A7870] font-sans block">
                          Formulir Rincian Proyek (03/08)
                        </span>
                        <h3 className="font-serif text-2xl font-light text-[#1A1A18] leading-tight">
                          Jenis rancang-bangun apa yang Anda butuhkan?
                        </h3>
                        <p className="text-xs text-[#7A7870]">
                          * Anda bisa memilih lebih dari satu opsi apabila diperlukan.
                        </p>
                        <div className="grid grid-cols-1 gap-3.5 pt-4">
                          {[
                            'Rumah Baru / New Build',
                            'Renovasi & Ekstensi Bangunan',
                            'Bangunan Komersial / Kantor',
                            'Hanya Desain Interior (Cabinetry/Joinery)',
                            'Lainnya / Belum Yakin'
                          ].map(opt => {
                            const selected = formData.projectTypes.includes(opt);
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => toggleProjectType(opt)}
                                className={`w-full text-left px-5 py-3.5 border transition-all duration-150 uppercase tracking-widest text-[10px] sm:text-xs font-semibold select-none ${
                                  selected
                                    ? 'bg-[#1A1A18] text-[#FFFFFF] border-[#1A1A18]'
                                    : 'bg-white text-[#1A1A18] border-[#D6D2C8] hover:border-[#1A1A18]'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* STEP 4: Location & Timeline */}
                    {currentStep === 4 && (
                      <div className="space-y-6">
                        <span className="text-[10px] uppercase tracking-[0.14em] text-[#7A7870] font-sans block">
                          Formulir Rincian Proyek (04/08)
                        </span>
                        <h3 className="font-serif text-2xl font-light text-[#1A1A18] leading-tight">
                          Di mana lokasi tapak pembangunan serta rencana timeline proyek?
                        </h3>
                        <div className="space-y-4 pt-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] uppercase tracking-[0.1em] text-[#7A7870] font-medium">
                              Lokasi Tapak Pembangunan / Rencana Proyek *
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.location}
                              onChange={e => setFormData({ ...formData, location: e.target.value })}
                              placeholder="Contoh: Grange, QLD atau Jakarta Selatan"
                              className="w-full bg-white border border-[#D6D2C8] px-4 py-3 text-sm text-[#1A1A18] focus:outline-none focus:border-[#1A1A18] transition-colors"
                            />
                            {errors.location && (
                              <span className="text-red-600 text-[11px] font-sans flex items-center gap-1.5 mt-0.5">
                                <AlertTriangle className="w-3.5 h-3.5" /> {errors.location}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-[10px] uppercase tracking-[0.1em] text-[#7A7870] font-medium">
                              Kapan Rencana Pembangunan Dimulai?
                            </label>
                            <input
                              type="text"
                              value={formData.timeline}
                              onChange={e => setFormData({ ...formData, timeline: e.target.value })}
                              placeholder="Contoh: 12-18 Bulan, atau Segera"
                              className="w-full bg-white border border-[#D6D2C8] px-4 py-3 text-sm text-[#1A1A18] focus:outline-none focus:border-[#1A1A18] transition-colors"
                            />
                          </div>

                          <span className="text-[11px] leading-relaxed text-[#7A7870] italic block pt-2 bg-[#EDEAE3] p-3 border-l-2 border-[#D6D2C8]">
                            Catatan: Studio kami memiliki daftar antrean (minimum wait time) 8–12 minggu untuk peluncuran konsep awal. Perlu waktu minimal 6–12 bulan dari proses sketching murni hingga penyerahan berkas konstruksi matang.
                          </span>
                        </div>
                      </div>
                    )}

                    {/* STEP 5: Budget Range */}
                    {currentStep === 5 && (
                      <div className="space-y-6">
                        <span className="text-[10px] uppercase tracking-[0.14em] text-[#7A7870] font-sans block">
                          Formulir Rincian Proyek (05/08)
                        </span>
                        <h3 className="font-serif text-2xl font-light text-[#1A1A18] leading-tight">
                          Berapa alokasi budget pembangunan Anda?
                        </h3>
                        <div className="grid grid-cols-1 gap-3 pt-4">
                          {[
                            '< Rp 500 Juta',
                            'Rp 500 Juta - Rp 1.5 Miliar',
                            'Rp 1.5 Miliar - Rp 3 Miliar',
                            'Rp 3 Miliar - Rp 5 Miliar',
                            'Rp 5 Miliar+'
                          ].map(opt => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setRadioField('budgetRange', opt)}
                              className={`w-full text-left px-5 py-3.5 border transition-all duration-150 uppercase tracking-widest text-[#10px] sm:text-xs font-semibold select-none ${
                                formData.budgetRange === opt
                                  ? 'bg-[#1A1A18] text-[#FFFFFF] border-[#1A1A18]'
                                  : 'bg-white text-[#1A1A18] border-[#D6D2C8] hover:border-[#1A1A18]'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                        <span className="text-[11px] text-[#7A7870] block leading-relaxed italic p-2.5">
                          Jasa desain & supervisi terhitung menyesuaikan skala luas bangunan m² dan tingkat kesulitan struktural. Estimasi rincian penawaran disepakati pasca meeting tatap muka pertama.
                        </span>
                      </div>
                    )}

                    {/* STEP 6: Contract Builder */}
                    {currentStep === 6 && (
                      <div className="space-y-6">
                        <span className="text-[10px] uppercase tracking-[0.14em] text-[#7A7870] font-sans block">
                          Formulir Rincian Proyek (06/08)
                        </span>
                        <h3 className="font-serif text-2xl font-light text-[#1A1A18] leading-tight">
                          Apakah Anda sudah menunjuk atau memilih Kontraktor Pembangunan?
                        </h3>
                        <div className="flex flex-col gap-3 pt-4">
                          {[
                            'Ya, sudah mempunyai kontraktor tetap',
                            'Belum, namun sudah ada kandidat terpilih',
                            'Belum, kami butuh rekomendasi & bantuan pemilihan'
                          ].map(opt => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setRadioField('hasBuilder', opt)}
                              className={`w-full text-left px-5 py-3.5 border transition-all duration-150 uppercase tracking-widest text-[10px] sm:text-xs font-semibold select-none ${
                                formData.hasBuilder === opt
                                  ? 'bg-[#1A1A18] text-[#FFFFFF] border-[#1A1A18]'
                                  : 'bg-white text-[#1A1A18] border-[#D6D2C8] hover:border-[#1A1A18]'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>

                        {formData.hasBuilder.startsWith('Ya') && (
                          <div className="flex flex-col gap-2 pt-2">
                            <label className="text-[10px] uppercase tracking-[0.1em] text-[#7A7870] font-medium">
                              Rincian Kontraktor (Nama / Kredensial Lapangan)
                            </label>
                            <input
                              type="text"
                              value={formData.builderDetails}
                              onChange={e => setFormData({ ...formData, builderDetails: e.target.value })}
                              placeholder="Tulis nama kontraktor atau detailnya..."
                              className="w-full bg-white border border-[#D6D2C8] px-4 py-3 text-sm text-[#1A1A18] focus:outline-none focus:border-[#1A1A18] transition-colors"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {/* STEP 7: Design Brief */}
                    {currentStep === 7 && (
                      <div className="space-y-6">
                        <span className="text-[10px] uppercase tracking-[0.14em] text-[#7A7870] font-sans block">
                          Formulir Rincian Proyek (07/08)
                        </span>
                        <h3 className="font-serif text-2xl font-light text-[#1A1A18] leading-tight">
                          Deskripsikan deskripsi desain impian Anda secara ringkas
                        </h3>
                        <div className="flex flex-col gap-2 pt-4">
                          <label className="text-[10px] uppercase tracking-[0.1em] text-[#7A7870] font-medium">
                            Kebutuhan Ruang, Inspirasi Visual, Maupun Catatan Khusus
                          </label>
                          <textarea
                            rows={6}
                            value={formData.additionalInfo}
                            onChange={e => setFormData({ ...formData, additionalInfo: e.target.value })}
                            placeholder="Contoh: Butuh 3 kamar tidur, bukaan sirkulasi tropis alami terarah, kolam renang outdoor kecil, bernuansa beton ekspos, hemat energi dsb..."
                            className="w-full bg-white border border-[#D6D2C8] px-4 py-3 text-sm text-[#1A1A18] focus:outline-none focus:border-[#1A1A18] transition-colors resize-none font-sans"
                          />
                        </div>
                      </div>
                    )}

                    {/* STEP 8: Source / Discovery */}
                    {currentStep === 8 && (
                      <div className="space-y-6">
                        <span className="text-[10px] uppercase tracking-[0.14em] text-[#7A7870] font-sans block">
                          Formulir Tambahan (08/08)
                        </span>
                        <h3 className="font-serif text-2xl font-light text-[#1A1A18] leading-tight">
                          Bagaimana Anda mendengar tentang OH Design Studio?
                        </h3>
                        <div className="grid grid-cols-2 gap-3 pt-4">
                          {['Teman', 'Keluarga', 'Google Search', 'Instagram', 'Lainnya'].map(opt => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => setRadioField('source', opt)}
                              className={`text-left px-5 py-3 border transition-all duration-150 uppercase tracking-widest text-[10px] font-semibold select-none ${
                                formData.source === opt
                                  ? 'bg-[#1A1A18] text-[#FFFFFF] border-[#1A1A18]'
                                  : 'bg-white text-[#1A1A18] border-[#D6D2C8] hover:border-[#1A1A18]'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>

                        {formData.source === 'Lainnya' && (
                          <div className="flex flex-col gap-2 pt-2 animate-in fade-in">
                            <label className="text-[10px] uppercase tracking-[0.1em] text-[#7A7870] font-medium">
                              Sebutkan sumber referensi secara spesifik
                            </label>
                            <input
                              type="text"
                              value={formData.sourceOther}
                              onChange={e => setFormData({ ...formData, sourceOther: e.target.value })}
                              placeholder="Isi rinciannya..."
                              className="w-full bg-white border border-[#D6D2C8] px-4 py-3 text-sm text-[#1A1A18] focus:outline-none focus:border-[#1A1A18] transition-colors"
                            />
                          </div>
                        )}

                        {errorMess && (
                          <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-sm text-xs flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            <span>{errorMess}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Navigation buttons */}
                    <div className="flex justify-between items-center mt-12 pt-6 border-t border-[#D6D2C8]">
                      {currentStep > 1 ? (
                        <button
                          type="button"
                          onClick={handleBack}
                          className="flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-[#7A7870] hover:text-[#1A1A18] focus:outline-none transition-colors py-2"
                        >
                          <ArrowLeft className="w-4 h-4" /> Kembali
                        </button>
                      ) : (
                        <div />
                      )}

                      {currentStep < 8 ? (
                        <button
                          type="button"
                          onClick={handleNext}
                          className="flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-[#1A1A18] border border-[#1A1A18] hover:bg-[#1A1A18] hover:text-white transition-all px-6 py-2.5 focus:outline-none"
                        >
                          Lanjut <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSubmit}
                          disabled={isSubmitting}
                          className="flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-white bg-[#E05C38] hover:bg-[#bc4a2a] disabled:opacity-50 transition-all px-8 py-3.5 focus:outline-none font-semibold shadow-sm"
                        >
                          {isSubmitting ? 'Mengirimkan...' : 'Kirim Pengajuan →'}
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
