/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { ViewPath, LeadInput, RabEstimateInput, RabEstimateResult } from '../../types';
import { Mail, Phone, MapPin, Check, Send, AlertTriangle, FileText, Layout, Sparkles, Building2 } from 'lucide-react';
import { motion } from 'motion/react';

interface KonsultasiViewProps {
  rabData: { input: RabEstimateInput; result: RabEstimateResult } | null;
  floorPlanData: {
    landAreaSqm: number;
    floors: number;
    roomsConfig: Record<string, number>;
  } | null;
  aiRenderData: { imageUrl: string; styleName: string; promptUsed: string } | null;
  onNavigate: (view: ViewPath) => void;
  onSubmitLead: (lead: LeadInput) => Promise<boolean>;
}

export default function KonsultasiView({
  rabData,
  floorPlanData,
  aiRenderData,
  onNavigate,
  onSubmitLead,
}: KonsultasiViewProps) {
  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  // UI state managers
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [globalError, setGlobalError] = useState('');

  // Validation rules checker
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Nama lengkap wajib diisi.';
    } else if (name.length > 100) {
      newErrors.name = 'Nama terlalu panjang, maksimal 100 karakter.';
    }

    // WA / Phone Indonesian validation (08xx or +62xx, 10 to 15 digits)
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{7,12}$/;
    if (!phone.trim()) {
      newErrors.phone = 'Nomor HP/WhatsApp wajib diisi.';
    } else if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
      newErrors.phone = 'Masukkan format nomor WhatsApp Indonesia yang valid (contoh: 0812xxxxxxxx atau +62812xxxxxxxx).';
    }

    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Format alamat email tidak valid.';
      }
    }

    if (message.length > 1000) {
      newErrors.message = 'Pesan terlalu panjang, maksimal 1000 karakter.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setGlobalError('');

    if (!validateForm()) return;

    setSubmitting(true);

    try {
      const leadPayload: LeadInput = {
        name,
        phone,
        email: email || undefined,
        message: message || undefined,
        // Attach any active completed metrics
        rabEstimateId: rabData ? 'estimate_active_session' : undefined,
        floorPlanId: floorPlanData ? 'floor_plan_active_session' : undefined,
        aiRenderId: aiRenderData ? 'ai_render_active_session' : undefined,
      };

      const success = await onSubmitLead(leadPayload);
      if (success) {
        setIsSuccess(true);
      } else {
        setGlobalError('Gagal menyimpan pendaftaran konsultasi. Silakan periksa jaringan Anda atau coba beberapa saat lagi.');
      }
    } catch (err) {
      setGlobalError('Terjadi kesalahan tak terduga pada server kami. Silakan coba sesaat lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 text-brand-black" id="konsultasi-panel-container">
      {/* SUCCESS CONFIRMATION BOARD (S-04 / Flow F-05) */}
      {isSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl mx-auto bg-brand-white border border-brand-black/10 p-10 md:p-14 text-center rounded-xs shadow-md flex flex-col items-center gap-6"
          id="lead-success-board"
        >
          <div className="w-16 h-16 bg-brand-green/10 border border-brand-green/20 rounded-full flex items-center justify-center text-brand-green">
            <Check className="w-8 h-8 stroke-[3]" />
          </div>

          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-brand-orange font-bold font-mono">
              (PENDAFTARAN BERHASIL DISIMPAN)
            </span>
            <h2 className="font-serif text-2xl md:text-3xl font-normal mt-2 leading-tight">
              Terima Kasih, {name}!
            </h2>
            <p className="text-xs text-brand-dark-grey leading-relaxed mt-4">
              Pengajuan data spesifikasi konstruksi Anda telah kami terima secara lengkap di basis database kami. Arsitek &amp; estimator lapangan kami akan segera meninjau detail draf Anda dan menghubungi via WhatsApp/HP dalam 1-2 hari kerja.
            </p>
          </div>

          <div className="w-full h-px bg-brand-black/10 my-2" />

          <button
            onClick={() => onNavigate('home')}
            className="w-full bg-brand-orange text-brand-white hover:bg-brand-orange-hover py-3.5 text-xs font-semibold uppercase tracking-[0.2em] transition-all"
            id="back-home-success-btn"
          >
            Kembali ke Beranda
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" id="lead-form-grid">
          {/* LEFT PANEL: SEED CONTENT NOTES & CONTACT DETAILS */}
          <div className="lg:col-span-5 flex flex-col gap-10">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-brand-orange font-bold italic mb-4 block">
                (Keterbukaan Kolaborasi)
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl font-normal leading-tight" id="lead-headline">
                Bincang Proyek &amp; Survey Lahan
              </h1>
              <p className="text-xs text-brand-grey mt-3 leading-relaxed">
                Kami percaya setiap mahakarya bangunan diawali bincang santai yang setara. Silakan hubungi kami untuk survey lokasi, drafing denah lanjutan, pengurusan PBG (IMB), atau kalkulasi penawaran resmi RAB kontraktor.
              </p>
            </div>

            {/* QUICK CONTACT RAIL */}
            <div className="flex flex-col gap-5 border-t border-b border-brand-black/10 py-8 text-xs text-brand-dark-grey">
              <div className="flex items-start gap-4" id="contact-rail-address">
                <MapPin className="w-5 h-5 text-brand-orange shrink-0" />
                <div>
                  <h4 className="font-bold text-brand-black uppercase tracking-wider text-[10px] mb-0.5">Studio Utama</h4>
                  <p>Jl. Wijaya Timur Raya No. 12, Kebayoran Baru, Jakarta Selatan 12170</p>
                </div>
              </div>

              <div className="flex items-center gap-4" id="contact-rail-phone">
                <Phone className="w-5 h-5 text-brand-orange shrink-0" />
                <div>
                  <h4 className="font-bold text-brand-black uppercase tracking-wider text-[10px] mb-0.5">Telepon &amp; WhatsApp</h4>
                  <p>+62 (21) 7280 1024</p>
                </div>
              </div>

              <div className="flex items-center gap-4" id="contact-rail-email">
                <Mail className="w-5 h-5 text-brand-orange shrink-0" />
                <div>
                  <h4 className="font-bold text-brand-black uppercase tracking-wider text-[10px] mb-0.5">Email Penawaran</h4>
                  <p>info@oh-architecture-build.id</p>
                </div>
              </div>
            </div>

            <div className="bg-brand-orange/5 p-4 rounded-xs border border-brand-orange/15 text-[11px] leading-relaxed text-brand-dark-grey">
              <strong className="text-brand-black block tracking-wide uppercase text-[10px] mb-1">💡 NOTE KONSULTASI GRATIS:</strong>
              Masa konsultasi draf sketsa awal &amp; RAB estimasi kasar bersifat 100% bebas biaya awal. Tim kami bersedia melakukan asisten survey lokasi wilayah Jabodetabek, Bandung, dan Bali.
            </div>
          </div>

          {/* RIGHT PANEL: MAIN FORM INPUTS & CARRIED DATA CARDS */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            {/* CARRIED PREVIEW SUMMARY CARD (S-04 F-05 main flow) */}
            {(rabData || floorPlanData || aiRenderData) && (
              <div className="border border-brand-black/15 bg-brand-cream/45 p-6 rounded-xs shadow-xs" id="carried-summaries">
                <h3 className="text-[10px] uppercase tracking-[0.18em] text-brand-orange font-bold mb-4 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-brand-black" /> (REFERENSI DRAF SESI AKTIF ANDA)
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  {/* RAB Cost Preview Summary */}
                  {rabData && (
                    <div className="bg-brand-white border border-brand-black/10 p-4 rounded-xs flex items-center justify-between text-xs" id="summary-rab">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-semibold block text-brand-black">Draf RAB Terhitung</span>
                          <span className="text-[10px] text-brand-grey uppercase font-mono">
                            {rabData.input.buildingType === 'new' ? 'Ba. Baru' : 'Renovasi'} • {rabData.input.areaSqm}m² • Grade {rabData.input.specification}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-brand-orange bg-brand-orange/5 border border-brand-orange/15 px-3 py-1.5 rounded-sm">
                        {formatIDR(rabData.result.estimatedMin)} – {formatIDR(rabData.result.estimatedMax)}
                      </span>
                    </div>
                  )}

                  {/* Floor Plan Layout Summary */}
                  {floorPlanData && (
                     <div className="bg-brand-white border border-brand-black/10 p-4 rounded-xs flex items-center justify-between text-xs" id="summary-floor-plan">
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-brand-black/5 flex items-center justify-center text-brand-black shrink-0">
                           <Layout className="w-4 h-4" />
                         </div>
                         <div>
                           <span className="font-semibold block text-brand-black">Draf Blueprint Denah</span>
                           <span className="text-[10px] text-brand-grey uppercase font-mono">
                             Tanah: {floorPlanData.landAreaSqm} m² • {floorPlanData.floors} Lantai
                           </span>
                         </div>
                       </div>
                       <span className="text-[10px] font-semibold uppercase font-mono bg-brand-black/5 border border-brand-black/10 px-3 py-1.5 rounded-sm">
                         {Object.values(floorPlanData.roomsConfig).reduce((sum, v) => sum + v, 0)} Ruang Terpilih
                       </span>
                     </div>
                  )}

                  {/* AI Render Concept Summary */}
                  {aiRenderData && (
                    <div className="bg-brand-white border border-brand-black/10 p-4 rounded-xs flex items-center gap-4 text-xs" id="summary-ai-render">
                      <div className="w-16 aspect-video bg-brand-warm-grey border border-brand-black/10 rounded-xs overflow-hidden shrink-0">
                        <img src={aiRenderData.imageUrl} alt="AI Preview Mini" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-brand-black block flex items-center gap-1.5">
                          Concept Render AI <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                        </span>
                        <p className="text-[10px] text-brand-grey line-clamp-1 italic mt-0.5">
                          Style: {aiRenderData.styleName} ({aiRenderData.promptUsed})
                        </p>
                      </div>
                      <span className="text-[9px] font-mono text-brand-green border border-brand-green/20 bg-brand-green/5 font-bold px-2 py-1 rounded-sm">TERLAMPIR</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CONSULTATION CONTACT FORM */}
            <form onSubmit={handleSubmit} className="border border-brand-black/15 bg-brand-white p-6 md:p-10 rounded-xs shadow-xs flex flex-col gap-6" id="lead-form-core">
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-brand-dark-grey border-b border-brand-black/10 pb-4 mb-2">
                (Pengisian Formulir Kontak)
              </h3>

              {/* FIELD: FULL NAME */}
              <div className="flex flex-col gap-2">
                <label htmlFor="fullName" className="text-xs uppercase tracking-wider font-semibold text-brand-dark-grey">
                  Nama Lengkap Anda <span className="text-brand-orange">*</span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Misal: Andi Wijaya"
                  className={`w-full bg-brand-white border px-4 py-3 text-sm focus:outline-none rounded-xs ${
                    errors.name ? 'border-brand-red focus:border-brand-red' : 'border-brand-black/15 focus:border-brand-orange'
                  }`}
                />
                {errors.name && <span className="text-brand-red text-xs mt-0.5 font-sans flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> {errors.name}</span>}
              </div>

              {/* FIELD: MOBILE / WHATSAPP */}
              <div className="flex flex-col gap-2">
                <label htmlFor="phoneNumber" className="text-xs uppercase tracking-wider font-semibold text-brand-dark-grey">
                  Nomor Handphone / WhatsApp WA <span className="text-brand-orange">*</span>
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Contoh: 081234567890"
                  className={`w-full bg-brand-white border px-4 py-3 text-sm focus:outline-none rounded-xs font-mono ${
                    errors.phone ? 'border-brand-red focus:border-brand-red' : 'border-brand-black/15 focus:border-brand-orange'
                  }`}
                />
                {errors.phone && <span className="text-brand-red text-xs mt-0.5 font-sans flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> {errors.phone}</span>}
              </div>

              {/* FIELD: EMAIL (OPTIONAL) */}
              <div className="flex flex-col gap-2">
                <label htmlFor="emailAddress" className="text-xs uppercase tracking-wider font-semibold text-brand-dark-grey">
                  Alamat Email (Opsional)
                </label>
                <input
                  type="email"
                  id="emailAddress"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contoh: andiwijaya@clover.com"
                  className={`w-full bg-brand-white border px-4 py-3 text-sm focus:outline-none rounded-xs ${
                    errors.email ? 'border-brand-red focus:border-brand-red' : 'border-brand-black/15 focus:border-brand-orange'
                  }`}
                />
                {errors.email && <span className="text-brand-red text-xs mt-0.5 font-sans flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> {errors.email}</span>}
              </div>

              {/* FIELD: MESSAGE / NOTES */}
              <div className="flex flex-col gap-2">
                <label htmlFor="contactMessage" className="text-xs uppercase tracking-wider font-semibold text-brand-dark-grey">
                  Tuliskan Ringkasan Pesan atau Lokasi/Tipe Proyek Anda
                </label>
                <textarea
                  id="contactMessage"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Misal jika di luar draf: Pembangunan rumah villa minimalis di Canggu Bali, target tanah sawah luas 150m2..."
                  rows={4}
                  maxLength={1000}
                  className={`w-full bg-brand-white border px-4 py-3 text-sm focus:outline-none rounded-xs font-sans ${
                    errors.message ? 'border-brand-red focus:border-brand-red' : 'border-brand-black/15 focus:border-brand-orange'
                  }`}
                />
                <div className="flex justify-between items-center text-[10px] text-brand-grey mt-0.5">
                  <span>Maksimal 1000 karakter</span>
                  <span>{message.length}/1000</span>
                </div>
                {errors.message && <span className="text-brand-red text-xs mt-0.5 font-sans flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> {errors.message}</span>}
              </div>

              {/* GLOBAL EXCEPTION ERROR FLAG */}
              {globalError && (
                <div className="flex items-start gap-2 bg-brand-red/10 border border-brand-red/15 text-brand-red text-xs p-4 rounded-xs" id="lead-global-error">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{globalError}</span>
                </div>
              )}

              {/* SUBMIT LEADS ACTION TRIGGER */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-brand-orange hover:bg-brand-orange-hover text-brand-white py-4 text-xs font-semibold uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-2 rounded-xs disabled:opacity-50 disabled:pointer-events-none mt-2 select-none"
                id="form-submit-button"
              >
                {submitting ? (
                  <>
                    Memproses Pengiriman...
                  </>
                ) : (
                  <>
                    Kirim Permintaan Konsultasi <Send className="w-3.5 h-3.5 fill-current" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
