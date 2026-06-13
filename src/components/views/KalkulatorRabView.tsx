/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ViewPath, RabEstimateInput, RabEstimateResult, BuildingType } from '../../types';
import { PRICE_PER_SQM, FLOOR_MULTIPLIERS, RENOVATION_MULTIPLIER, ADDON_COSTS, ESTIMATE_BREAKDOWN_PERCENTAGES } from '../../constants';
import { ArrowLeft, ArrowRight, Check, AlertTriangle, Calculator, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface KalkulatorRabViewProps {
  onCompleteEstimate: (input: RabEstimateInput, result: RabEstimateResult) => void;
  onNavigate: (view: ViewPath) => void;
  initialInput?: RabEstimateInput | null;
}

export default function KalkulatorRabView({ onCompleteEstimate, onNavigate, initialInput }: KalkulatorRabViewProps) {
  const [step, setStep] = useState(1);

  // States for form steps
  const [buildingType, setBuildingType] = useState<BuildingType>(initialInput?.buildingType || 'new');
  const [areaSqm, setAreaSqm] = useState<string>(initialInput?.areaSqm?.toString() || '');
  const [floors, setFloors] = useState<number>(initialInput?.floors || 1);
  const [specification, setSpecification] = useState<'standard' | 'medium' | 'premium'>(initialInput?.specification || 'medium');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(initialInput?.addons || []);

  // Validation state
  const [validationError, setValidationError] = useState('');

  // Result state
  const [calculatedResult, setCalculatedResult] = useState<RabEstimateResult | null>(null);

  // Format currency
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleNextStep = () => {
    setValidationError('');

    if (step === 2) {
      const area = parseFloat(areaSqm);
      if (isNaN(area) || area <= 0) {
        setValidationError('Luas bangunan wajib diisi dengan angka minimal 1 m².');
        return;
      }
      if (area > 10000) {
        setValidationError('Maksimal estimasi luas bangunan adalah 10,000 m².');
        return;
      }
    }

    if (step < 4) {
      setStep(prev => prev + 1);
    } else {
      // Step 4 complete: Process calculation
      calculateRAB();
    }
  };

  const handlePrevStep = () => {
    setValidationError('');
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const toggleAddon = (key: string) => {
    setSelectedAddons(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const calculateRAB = () => {
    const area = parseFloat(areaSqm);
    const baseRate = PRICE_PER_SQM[specification];
    const floorFactor = FLOOR_MULTIPLIERS[floors] ?? 1.35;

    // Base cost formula
    let baseCost = area * baseRate * floorFactor;

    // Apply discount for renovation model
    if (buildingType === 'renovation') {
      baseCost = baseCost * RENOVATION_MULTIPLIER;
    }

    // Addons cost calculation
    const addonsCost = selectedAddons.reduce((sum, key) => {
      const addon = ADDON_COSTS[key];
      return sum + (addon ? addon.cost : 0);
    }, 0);

    const totalCost = baseCost + addonsCost;

    // Variance margin +-10%
    const lowerMargin = 0.9;
    const upperMargin = 1.1;
    const estimatedMin = totalCost * lowerMargin;
    const estimatedMax = totalCost * upperMargin;

    // Breakdown formatting based on default percentages
    const breakdown = ESTIMATE_BREAKDOWN_PERCENTAGES.map(item => ({
      category: item.category,
      percentage: item.percentage,
      estimatedCost: (totalCost * item.percentage) / 100,
    }));

    const result: RabEstimateResult = {
      estimatedMin,
      estimatedMax,
      breakdown,
      disclaimer: 'Estimasi RAB di atas dihitung secara sistematis berbasis standar koefisien material umum Indonesia. Angka ini merupakan estimasi budget awal (bukan penawaran resmi kerja) untuk dasar konsultasi dan perancangan denah berikutnya. Silakan hubungi tim kami untuk survey lahan, penentuan struktur tanah, dan pengajuan penawaran resmi kontraktor.',
    };

    setCalculatedResult(result);
    onCompleteEstimate(
      { buildingType, areaSqm: area, floors, specification, addons: selectedAddons },
      result
    );
    setStep(5); // Switch to Results view
  };

  const resetCalculator = () => {
    setStep(1);
    setBuildingType('new');
    setAreaSqm('');
    setFloors(1);
    setSpecification('medium');
    setSelectedAddons([]);
    setCalculatedResult(null);
    setValidationError('');
  };

  // Step names
  const stepsMeta = [
    { title: 'Jenis Proyek' },
    { title: 'Skala Luas & Lantai' },
    { title: 'Fasilitas & Material' },
    { title: 'Tambahan (Opsional)' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-brand-black" id="rab-calculator-container">
      {/* SECTION TABS FOR DEEP INTEGRATION (RAB & AI FLOOR PLAN) */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex bg-[#f3efe4] p-1 border border-brand-black/5 rounded-full relative shadow-xs">
          <button
            onClick={() => onNavigate('kalkulator-rab')}
            className="px-4 sm:px-6 py-2.5 text-[10px] sm:text-xs uppercase tracking-widest font-bold transition-all relative z-10 cursor-pointer focus:outline-none text-[#E05C38]"
          >
            📊 Kalkulator Estimasi RAB
          </button>
          <button
            onClick={() => onNavigate('generator-denah')}
            className="px-4 sm:px-6 py-2.5 text-[10px] sm:text-xs uppercase tracking-widest font-bold transition-all relative z-10 cursor-pointer focus:outline-none text-brand-dark-grey hover:text-brand-black"
          >
            📐 AI Generator Denah
          </button>
          
          {/* Framer motion active accent slider container */}
          <motion.div
            className="absolute top-1 bottom-1 left-1 rounded-full bg-brand-white shadow-sm border border-brand-black/5 -z-0"
            style={{ width: 'calc(50% - 4px)' }}
            layoutId="toolSubActiveTabIndicator"
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          />
        </div>
      </div>

      {/* HEADER STATEMENT */}
      <div className="mb-12 text-center">
        <span className="text-[10px] uppercase tracking-[0.25em] text-brand-orange font-bold italic mb-4 block">
          (Akurasi Finansial Terbuka)
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal leading-tight" id="rab-title">
          Kalkulator Estimasi Anggaran (RAB)
        </h1>
        <p className="text-xs text-brand-grey max-w-lg mx-auto mt-2">
          Dapatkan gambaran kasar nilai investasi konstruksi pembangunan baru atau renovasi hunian impian dalam 4 langkah terarah.
        </p>
      </div>

      {step <= 4 ? (
        <div className="border border-brand-black/15 bg-brand-cream/40 p-6 md:p-10 rounded-xs flex flex-col shadow-xs">
          {/* STEP INDICATOR HEADER */}
          <div className="flex flex-col gap-4 mb-10 border-b border-brand-black/10 pb-6 w-full" id="step-indicators">
            <div className="flex justify-between items-center w-full">
              {stepsMeta.map((sMeta, idx) => {
                const stepNum = idx + 1;
                const isActive = step === stepNum;
                const isCompleted = step > stepNum;

                return (
                  <div key={idx} className="flex flex-col items-center flex-1 relative last:flex-initial">
                    {/* Circle icon marker */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono transition-all z-10 ${
                        isActive
                          ? 'bg-brand-orange text-brand-white scale-110 font-bold ring-4 ring-brand-orange/20'
                          : isCompleted
                          ? 'bg-brand-green text-brand-white'
                          : 'bg-brand-warm-grey text-brand-grey border border-brand-black/10'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : stepNum}
                    </div>
                    <span className={`text-[10px] uppercase tracking-wider mt-2.5 text-center hidden sm:block ${isActive ? 'text-brand-orange font-semibold' : 'text-brand-grey'}`}>
                      {sMeta.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SCRIPT CONTENT WRAPPERS */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-6"
                id="step-content-1"
              >
                <div>
                  <h3 className="font-serif text-lg font-medium text-brand-black mb-1">
                    Silakan tentukan jenis pengerjaan proyek Anda:
                  </h3>
                  <p className="text-xs text-brand-grey">
                    Pekerjaan renovasi menghemat biaya struktur utama, sedangkan pembangunan baru merancang penuh dari nol.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                  <button
                    onClick={() => setBuildingType('new')}
                    className={`flex flex-col text-left p-6 border transition-all rounded-xs relative ${
                      buildingType === 'new'
                        ? 'border-brand-orange bg-brand-orange/5 ring-1 ring-brand-orange'
                        : 'border-brand-black/15 bg-brand-white hover:border-brand-black'
                    }`}
                    id="btn-choose-new"
                  >
                    {buildingType === 'new' && <span className="absolute top-4 right-4 text-brand-orange"><Check className="w-4 h-4" /></span>}
                    <span className="text-sm font-semibold text-brand-black uppercase tracking-wider mb-2">Pembangunan Baru</span>
                    <span className="text-xs text-brand-dark-grey leading-relaxed">
                      Mendirikan bangunan / hunian baru dari perencanaan fondasi nol di atas lahan kosong.
                    </span>
                  </button>

                  <button
                    onClick={() => setBuildingType('renovation')}
                    className={`flex flex-col text-left p-6 border transition-all rounded-xs relative ${
                      buildingType === 'renovation'
                        ? 'border-brand-orange bg-brand-orange/5 ring-1 ring-brand-orange'
                        : 'border-brand-black/15 bg-brand-white hover:border-brand-black'
                    }`}
                    id="btn-choose-renovation"
                  >
                    {buildingType === 'renovation' && <span className="absolute top-4 right-4 text-brand-orange"><Check className="w-4 h-4" /></span>}
                    <span className="text-sm font-semibold text-brand-black uppercase tracking-wider mb-2">Renovasi / Ekstensi</span>
                    <span className="text-xs text-brand-dark-grey leading-relaxed">
                      Perbaikan minor-mayor, peninggian lantai, bongkaran, atau penambahan ruang samping & belakang.
                    </span>
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-6"
                id="step-content-2"
              >
                <div>
                  <h3 className="font-serif text-lg font-medium text-brand-black mb-1">
                    Tentukan skala dimensi luas dan tinggi lantai bangunan:
                  </h3>
                  <p className="text-xs text-brand-grey">
                    Biaya pondasi dinaikkan secara proporsional seiring bertambahnya jumlah lantai konstruksi.
                  </p>
                </div>

                <div className="flex flex-col gap-6">
                  {/* LUAS INTUITIVE FORM */}
                  <div className="flex flex-col gap-2">
                    <label htmlFor="areaSqm" className="text-xs uppercase tracking-wider font-semibold text-brand-dark-grey">
                      Estimasi Luas Bangunan Total (m²)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="areaSqm"
                        value={areaSqm}
                        onChange={(e) => setAreaSqm(e.target.value)}
                        placeholder="Misal: 120"
                        min="1"
                        max="10000"
                        className="w-full bg-brand-white border border-brand-black/15 px-4 py-3 text-sm focus:border-brand-orange focus:outline-none rounded-xs pr-12 font-mono"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-brand-grey uppercase">
                        m²
                      </span>
                    </div>
                  </div>

                  {/* LANTAI SELECT CHIPS */}
                  <div className="flex flex-col gap-2">
                    <span className="text-xs uppercase tracking-wider font-semibold text-brand-dark-grey">
                      Jumlah Lantai Konstruksi
                    </span>
                    <div className="grid grid-cols-4 gap-3">
                      {[1, 2, 3, 4].map((fl) => (
                        <button
                          key={fl}
                          type="button"
                          onClick={() => setFloors(fl)}
                          className={`py-3 text-xs font-mono font-bold border transition-all rounded-xs focus:outline-none ${
                            floors === fl
                              ? 'border-brand-orange bg-brand-orange text-brand-white font-bold'
                              : 'border-brand-black/15 bg-brand-white hover:border-brand-black text-brand-black'
                          }`}
                          id={`btn-floor-sel-${fl}`}
                        >
                          {fl} Lantai
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-6"
                id="step-content-3"
              >
                <div>
                  <h3 className="font-serif text-lg font-medium text-brand-black mb-1">
                    Pilih standar spesifikasi material finishing Anda:
                  </h3>
                  <p className="text-xs text-brand-grey">
                    Pemilihan material sangat mempengaruhi rincian finishing lantai, kusen jendela, dinding, saniter, dan cat.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  {/* STANDARD BUTTON LINE */}
                  <button
                    onClick={() => setSpecification('standard')}
                    className={`flex flex-col md:flex-row text-left p-5 border gap-4 transition-all rounded-xs ${
                      specification === 'standard'
                        ? 'border-brand-orange bg-brand-orange/5 ring-1 ring-brand-orange'
                        : 'border-brand-black/15 bg-brand-white hover:border-brand-black'
                    }`}
                    id="spec-select-standard"
                  >
                    <div className="md:w-1/3">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider block text-brand-grey">
                        Grade C
                      </span>
                      <span className="text-sm font-bold text-brand-black uppercase tracking-wider block mt-1">
                        Standar Proyek
                      </span>
                      <span className="text-xs text-brand-orange font-bold mt-2 block">
                        {formatIDR(PRICE_PER_SQM.standard)} / m²
                      </span>
                    </div>
                    <div className="md:w-2/3 md:border-l md:border-brand-black/10 md:pl-4 text-xs text-brand-dark-grey leading-relaxed">
                      Cocok untuk kos-kosan, kontrakan, ruko standar. Lantai keramik lokal 40x40, dinding bata merah acian cat standar, jendela kayu/alumunium standar lokal, semen atap genteng beton flat cor lokal, saniter lokal biasa.
                    </div>
                  </button>

                  {/* MEDIUM */}
                  <button
                    onClick={() => setSpecification('medium')}
                    className={`flex flex-col md:flex-row text-left p-5 border gap-4 transition-all rounded-xs ${
                      specification === 'medium'
                        ? 'border-brand-orange bg-brand-orange/5 ring-1 ring-brand-orange'
                        : 'border-brand-black/15 bg-brand-white hover:border-brand-black'
                    }`}
                    id="spec-select-medium"
                  >
                    <div className="md:w-1/3">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider block text-brand-orange">
                        Grade B (Rekomendasi)
                      </span>
                      <span className="text-sm font-bold text-brand-black uppercase tracking-wider block mt-1">
                        Menengah / Eksekutif
                      </span>
                      <span className="text-xs text-brand-orange font-bold mt-2 block">
                        {formatIDR(PRICE_PER_SQM.medium)} / m²
                      </span>
                    </div>
                    <div className="md:w-2/3 md:border-l md:border-brand-black/10 md:pl-4 text-xs text-brand-dark-grey leading-relaxed">
                      Lantai homogenous tile bermotif/granite tile 60x60, cat dinding exterior tahan cuaca, aksen kusen aluminium powder coating tebal, daun pintu utama kayu meranti/kamper oven, atap baja ringan bergaransi, saniter standar Toto premium.
                    </div>
                  </button>

                  {/* PREMIUM */}
                  <button
                    onClick={() => setSpecification('premium')}
                    className={`flex flex-col md:flex-row text-left p-5 border gap-4 transition-all rounded-xs ${
                      specification === 'premium'
                        ? 'border-brand-orange bg-brand-orange/5 ring-1 ring-brand-orange'
                        : 'border-brand-black/15 bg-brand-white hover:border-brand-black'
                    }`}
                    id="spec-select-premium"
                  >
                    <div className="md:w-1/3">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider block text-brand-orange font-semibold">
                        Grade A
                      </span>
                      <span className="text-sm font-bold text-brand-black uppercase tracking-wider block mt-1">
                        Premium / Mewah (Lux)
                      </span>
                      <span className="text-xs text-brand-orange font-bold mt-2 block">
                        {formatIDR(PRICE_PER_SQM.premium)} / m²
                      </span>
                    </div>
                    <div className="md:w-2/3 md:border-l md:border-brand-black/10 md:pl-4 text-xs text-brand-dark-grey leading-relaxed">
                      Lantai full marmer impor slab besar, parquet kayu jati solid berkelas, cat eksterior premium anti noda Jotun/Dulux, jendela kedap sistem uPVC, daun pintu kayu jati oven pilihan, integrasi smart home system, saniter Toto Neorest / Kohler.
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col gap-6"
                id="step-content-4"
              >
                <div>
                  <h3 className="font-serif text-lg font-medium text-brand-black mb-1">
                    Tambahkan fasilitas khusus ekstra (Opsional):
                  </h3>
                  <p className="text-xs text-brand-grey">
                    Beri tanda centang pada item pengerjaan di bawah ini jika proyek Anda membutuhkan fasilitas eksterior tambahan.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  {Object.entries(ADDON_COSTS).map(([key, item]) => {
                    const isChecked = selectedAddons.includes(key);
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleAddon(key)}
                        className={`flex items-start text-left p-4 border rounded-xs transition-all gap-4 focus:outline-none ${
                          isChecked
                            ? 'border-brand-orange bg-brand-orange/5 ring-1 ring-brand-orange'
                            : 'border-brand-black/10 bg-brand-white hover:border-brand-black'
                        }`}
                        id={`addon-btn-${key}`}
                      >
                        <div className={`mt-0.5 w-4 h-4 rounded-xs border flex items-center justify-center transition-colors ${isChecked ? 'bg-brand-orange border-brand-orange text-brand-white' : 'border-brand-black/25 bg-brand-white'}`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                            <span className="text-xs font-semibold text-brand-black uppercase tracking-wide">
                              {item.label}
                            </span>
                            <span className="text-xs text-brand-orange font-semibold tracking-wide">
                              +{formatIDR(item.cost)}
                            </span>
                          </div>
                          <p className="text-[11px] text-brand-grey mt-0.5 leading-normal">
                            {item.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SCRIPT ERROR ALERT */}
          {validationError && (
            <div className="mt-6 flex items-start gap-2 bg-brand-red/10 border border-brand-red/15 text-brand-red text-xs p-3.5 rounded-xs" id="rab-validation-error">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {/* ACTION BUTTON RAILS */}
          <div className="mt-8 pt-6 border-t border-brand-black/10 flex justify-between items-center bg-transparent">
            <button
              type="button"
              onClick={handlePrevStep}
              className={`text-xs uppercase tracking-widest text-brand-grey hover:text-brand-black font-semibold flex items-center gap-2 transition-all focus:outline-none py-2 ${
                step === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
              id="rab-prev-button"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali
            </button>

            <button
              type="button"
              onClick={handleNextStep}
              className="bg-brand-orange text-brand-white hover:bg-brand-orange-hover px-10 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] transition-all flex items-center gap-2 select-none"
              id="rab-next-button"
            >
              {step === 4 ? (
                <>
                  Hitung Estimasi <Calculator className="w-4 h-4" />
                </>
              ) : (
                <>
                  Lanjut <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* RESULTS INTERACTION BOARD (step === 5) */
        calculatedResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-8"
            id="rab-results-view"
          >
            {/* LARGE ESTIMATED COST BANNER */}
            <div className="bg-[#131110] text-brand-white p-8 md:p-12 text-center border border-brand-white/10 rounded-xs relative overflow-hidden">
              <div className="absolute inset-0 opacity-5 bg-[linear-gradient(45deg,#fff_12.5%,transparent_12.5%,transparent_50%,#fff_50%,#fff_62.5%,transparent_62.5%,transparent_100%)] bg-[size:20px_20px]" />
              
              <span className="text-[10px] uppercase tracking-[0.2em] text-brand-orange font-bold italic mb-4 block">
                (Rentang Estimasi Kasar Budget RAB)
              </span>

              <div className="flex flex-col md:flex-row gap-2 justify-center items-center font-serif text-3xl sm:text-4xl md:text-5xl font-light py-2">
                <span className="text-brand-white/70 font-sans text-xs uppercase tracking-widest block md:hidden mb-1">Minimal</span>
                <span className="font-semibold text-brand-white">{formatIDR(calculatedResult.estimatedMin)}</span>
                <span className="text-brand-grey text-base md:text-3xl font-sans font-light mx-2">s.d</span>
                <span className="text-brand-white/70 font-sans text-xs uppercase tracking-widest block md:hidden mb-1">Maksimal</span>
                <span className="font-semibold text-brand-orange">{formatIDR(calculatedResult.estimatedMax)}</span>
              </div>

              <div className="mt-6 text-brand-white/40 text-[10px] uppercase font-mono tracking-[0.15em] flex flex-wrap justify-center gap-4 border-t border-brand-white/10 pt-6">
                <span>Konstruksi: {buildingType === 'new' ? 'Pembangunan Baru' : 'Renovasi'}</span>
                <span>•</span>
                <span>Luas: {areaSqm} m²</span>
                <span>•</span>
                <span>Tinggi: {floors} Lantai</span>
                <span>•</span>
                <span>Grade: {specification.toUpperCase()}</span>
              </div>
            </div>

            {/* BREAKDOWN SECTION */}
            <div className="border border-brand-black/10 bg-brand-warm-grey p-6 md:p-10 rounded-xs">
              <h3 className="font-serif text-lg font-medium text-brand-black mb-6 border-b border-brand-black/10 pb-4 flex items-center justify-between">
                <span>Rincian Estimasi Kategori Pengerjaan</span>
                <span className="text-xs font-sans uppercase font-semibold text-brand-grey tracking-widest">(Cost Breakdown)</span>
              </h3>

              <div className="flex flex-col gap-6">
                {calculatedResult.breakdown.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.1, ease: 'easeOut' }}
                    className="flex flex-col gap-2"
                    id={`breakdown-item-${index}`}
                  >
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="font-semibold text-brand-black tracking-tight">{item.category}</span>
                      <span className="font-mono text-brand-grey">
                        {item.percentage}% —{' '}
                        <span className="text-[#E05C38] font-bold">{formatIDR(item.estimatedCost)}</span>
                      </span>
                    </div>
                    {/* Visual Progress Shimmering bar with animated width load */}
                    <div className="w-full h-2 bg-brand-white border border-brand-black/5 rounded-full overflow-hidden relative">
                      <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 0.85, delay: index * 0.1 + 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full bg-[#E05C38] rounded-full"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* DISCLAIMER WRAPPER */}
            <div className="flex items-start gap-4 p-5 bg-amber-500/5 border-l-4 border-brand-orange text-brand-dark-grey text-xs rounded-r-xs leading-relaxed" id="rab-disclaimer-card">
              <AlertTriangle className="w-5 h-5 shrink-0 text-brand-orange mt-0.5" />
              <div>
                <strong className="block text-brand-black font-semibold uppercase tracking-wide mb-1">(Penting untuk Diperhatikan)</strong>
                <p>{calculatedResult.disclaimer}</p>
                <p className="text-[10px] text-brand-grey italic mt-2">
                  *Perekaman data RAB ini disimpan secara aman sebagai basis riwayat analitik portofolio perencanaan studio.
                </p>
              </div>
            </div>

            {/* INTERACTIVE NAVIGATION PATH RAILS */}
            <div className="flex flex-col sm:flex-row gap-5 items-stretch bg-transparent pt-4">
              <button
                onClick={resetCalculator}
                className="flex-1 border border-brand-black/15 text-brand-black hover:border-brand-black hover:bg-brand-cream/10 py-4 text-xs font-semibold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 rounded-none"
                id="btn-recalculate-rab"
              >
                Hitung Ulang RAB
              </button>

              <button
                onClick={() => onNavigate('generator-denah')}
                className="flex-1 bg-brand-black text-brand-white hover:bg-brand-orange-hover hover:text-brand-white py-4 text-xs font-semibold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 rounded-none"
                id="btn-go-to-denah"
              >
                Lanjut Gores Denah <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('konsultasi')}
                className="flex-1 bg-brand-orange text-brand-white hover:bg-brand-orange-hover py-4 text-xs font-semibold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 rounded-none"
                id="btn-go-to-konsultasi"
              >
                Konsultasi Penuh <Check className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )
      )}
    </div>
  );
}
