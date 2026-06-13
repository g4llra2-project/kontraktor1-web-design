/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ViewPath, RoomConfig, RoomLayoutResult } from '../../types';
import { DEFAULT_ROOM_TEMPLATES, STYLE_TAGS } from '../../constants';
import { generateFloorPlanLayout } from '../../lib/floor-plan-algorithm';
import { Check, RefreshCw, Layers, Plus, Minus, Info, ClipboardCheck, Sparkles, Image, CheckCircle, ChevronRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GeneratorDenahViewProps {
  onCompleteFloorPlan: (data: {
    landAreaSqm: number;
    floors: number;
    roomsConfig: Record<string, number>;
    layoutResult: RoomLayoutResult[];
  }, aiRender?: { imageUrl: string; styleName: string; promptUsed: string } | null) => void;
  onNavigate: (view: ViewPath) => void;
  initialRabArea?: number;
  initialRabFloors?: number;
}

export default function GeneratorDenahView({
  onCompleteFloorPlan,
  onNavigate,
  initialRabArea,
  initialRabFloors,
}: GeneratorDenahViewProps) {
  // Input settings
  const [landArea, setLandArea] = useState<number>(initialRabArea || 120);
  const [lotWidth, setLotWidth] = useState<number>(8); // default width 8m
  const [floors, setFloors] = useState<number>(initialRabFloors || 1);
  const [seed, setSeed] = useState<number>(42);
  const [currentFloorTab, setCurrentFloorTab] = useState<number>(1);

  // Room config counter list
  const [roomQuantities, setRoomQuantities] = useState<Record<string, number>>(() => {
    const initialCounts: Record<string, number> = {};
    DEFAULT_ROOM_TEMPLATES.forEach(r => {
      initialCounts[r.id] = r.count;
    });
    return initialCounts;
  });

  // Derived layout results
  const [layout, setLayout] = useState<ReturnType<typeof generateFloorPlanLayout> | null>(null);

  // AI Render configurations (S-04)
  const [selectedStyle, setSelectedStyle] = useState<string>('minimalist');
  const [notes, setNotes] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiProgress, setAiProgress] = useState<number>(0);
  const [aiStatusMessage, setAiStatusMessage] = useState<string>('');
  const [aiResult, setAiResult] = useState<{ imageUrl: string; styleName: string; promptUsed: string } | null>(null);
  const [aiError, setAiError] = useState<string>('');

  // Auto layout recalculation when inputs state registers any change
  useEffect(() => {
    const selectedRooms = Object.entries(roomQuantities).map(([templateId, count]) => ({
      templateId,
      count: count as number,
    }));

    const result = generateFloorPlanLayout({
      landAreaSqm: landArea,
      floors,
      selectedRooms,
      allTemplates: DEFAULT_ROOM_TEMPLATES,
      widthMeters: lotWidth,
      seed,
    });

    setLayout(result);

    // Keep active floor tab within bounds
    if (currentFloorTab > floors) {
      setCurrentFloorTab(floors);
    }
  }, [landArea, lotWidth, floors, roomQuantities, seed, currentFloorTab]);

  // Adjust room quantities
  const handleRoomCountChange = (id: string, delta: number) => {
    setRoomQuantities(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  // Check if any room is selected
  const hasRoomsSelected = Object.values(roomQuantities).some(count => (count as number) > 0);

  // Cycle different seed for layout variation
  const handleShuffleLayout = () => {
    setSeed(prev => prev + Math.floor(Math.random() * 100) + 1);
  };

  // Color mapping per room category for clean, blueprint style visual graphics
  const getRoomColorClasses = (roomId: string) => {
    if (roomId.startsWith('bedroom')) {
      return { fill: 'fill-[#e3dbc5]', stroke: 'stroke-[#928157]', text: 'text-[#564828]', bg: 'bg-[#e3dbc5]' }; // warm wood
    }
    if (roomId.startsWith('kid_room')) {
      return { fill: 'fill-[#eedbbb]', stroke: 'stroke-[#9c773b]', text: 'text-[#61451a]', bg: 'bg-[#eedbbb]' }; // soft ochre
    }
    if (roomId.startsWith('bathroom')) {
      return { fill: 'fill-[#d7e5e3]', stroke: 'stroke-[#57817b]', text: 'text-[#1e514a]', bg: 'bg-[#d7e5e3]' }; // watery blue-grey
    }
    if (roomId.startsWith('carport')) {
      return { fill: 'fill-[#e3e3df]', stroke: 'stroke-[#7c7c77]', text: 'text-[#383834]', bg: 'bg-[#e3e3df]' }; // concrete
    }
    if (roomId.startsWith('garden')) {
      return { fill: 'fill-[#dfebd9]', stroke: 'stroke-[#678e56]', text: 'text-[#2e511e]', bg: 'bg-[#dfebd9]' }; // grass
    }
    if (roomId.startsWith('kitchen')) {
      return { fill: 'fill-[#ecdacf]', stroke: 'stroke-[#a96645]', text: 'text-[#693417]', bg: 'bg-[#ecdacf]' }; // warm terracotta
    }
    // Default living rooms or secondary spaces
    return { fill: 'fill-[#f2eeea]', stroke: 'stroke-[#9a9590]', text: 'text-[#2e2e2c]', bg: 'bg-[#f2eeea]' }; // bone cream
  };

  // Mocking S-04 AI Render Generation
  const handleGenerateAiRender = () => {
    setAiError('');
    setAiResult(null);
    setAiLoading(true);
    setAiProgress(0);
    setAiStatusMessage('Menganalisis koefisien dinding & zoning ruang...');

    // Progress bar simulating steps
    const messages = [
      'Menyusun kerangka fasad tropis bertingkat...',
      'Merekatkan materialitas beton ekspos tebal...',
      'Mengintegrasikan sirkulasi pencahayaan sore...',
      'Melakukan render suasana visual resolusi tinggi...',
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      setAiProgress(prev => {
        const next = prev + 5;
        if (next % 25 === 0 && currentStep < messages.length) {
          setAiStatusMessage(messages[currentStep]);
          currentStep++;
        }

        if (next >= 100) {
          clearInterval(interval);
          setAiLoading(false);
          
          // Complete render mock result
          const styleTemplate = STYLE_TAGS.find(s => s.id === selectedStyle);
          const mockImages: Record<string, string> = {
            minimalist: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
            tropical: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
            industrial: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
            classic: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
          };

          setAiResult({
            imageUrl: mockImages[selectedStyle] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
            styleName: styleTemplate?.label || 'Minimalis Modern',
            promptUsed: `${styleTemplate?.prompt}${notes ? ', dengan catatan tambahan: ' + notes : ''}. Architectural detail rendering, realistic materials, octane render style.`,
          });
        }
        return next;
      });
    }, 150);
  };

  const handleConsultWithPlan = () => {
    if (!layout) return;

    onCompleteFloorPlan(
      {
        landAreaSqm: landArea,
        floors,
        roomsConfig: roomQuantities,
        layoutResult: layout.layoutResult,
      },
      aiResult
    );
    onNavigate('konsultasi');
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 text-brand-black" id="floor-generator-container">
      {/* SECTION TABS FOR DEEP INTEGRATION (RAB & AI FLOOR PLAN) */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex bg-[#f3efe4] p-1 border border-brand-black/5 rounded-full relative shadow-xs">
          <button
            onClick={() => onNavigate('kalkulator-rab')}
            className="px-4 sm:px-6 py-2.5 text-[10px] sm:text-xs uppercase tracking-widest font-bold transition-all relative z-10 cursor-pointer focus:outline-none text-brand-dark-grey hover:text-brand-black"
          >
            📊 Kalkulator Estimasi RAB
          </button>
          <button
            onClick={() => onNavigate('generator-denah')}
            className="px-4 sm:px-6 py-2.5 text-[10px] sm:text-xs uppercase tracking-widest font-bold transition-all relative z-10 cursor-pointer focus:outline-none text-[#E05C38]"
          >
            📐 AI Generator Denah
          </button>
          
          {/* Framer motion active accent slider container */}
          <motion.div
            className="absolute top-1 bottom-1 right-1 rounded-full bg-brand-white shadow-sm border border-brand-black/5 -z-0"
            style={{ width: 'calc(50% - 4px)' }}
            layoutId="toolSubActiveTabIndicator"
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          />
        </div>
      </div>

      {/* SECTION HEADER */}
      <div className="mb-12 text-center">
        <span className="text-[10px] uppercase tracking-[0.25em] text-brand-orange font-bold italic mb-4 block">
          (Pemodelan Spasial Cepat)
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal leading-tight" id="denah-title">
          Interactive Floor Plan &amp; AI Render
        </h1>
        <p className="text-xs text-brand-grey max-w-lg mx-auto mt-2">
          Masukkan parameter lot lahan dan rincian kebutuhan ruangan. Mesin kami akan mendistribusikan zonasi area secara proporsional.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" id="denah-grid-layout">
        {/* LEFT COLUMN: INTERACTIVE FORM INPUTS */}
        <div className="lg:col-span-5 flex flex-col gap-8 bg-brand-cream/30 border border-brand-black/10 p-6 md:p-8 rounded-xs shadow-xs" id="denah-forms">
          <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-brand-orange border-b border-brand-black/10 pb-3 flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-brand-black" /> (Konfigurasi Lahan &amp; Ruang)
          </h2>

          {/* LOT AREA INPUTS */}
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="landArea" className="text-[10px] uppercase tracking-wider font-semibold text-brand-dark-grey">
                  Luas Tanah Lahan (m²)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="landArea"
                    value={landArea}
                    onChange={(e) => setLandArea(Math.max(20, parseInt(e.target.value) || 0))}
                    placeholder="Luas m2"
                    className="w-full bg-brand-white border border-brand-black/15 px-3 py-2 text-xs focus:border-brand-orange focus:outline-none rounded-xs pr-10 font-mono"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-brand-grey font-mono uppercase">m²</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="lotWidth" className="text-[10px] uppercase tracking-wider font-semibold text-brand-dark-grey">
                  Lebar Depan Lahan (m)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="lotWidth"
                    value={lotWidth}
                    onChange={(e) => {
                      const w = Math.max(3, parseInt(e.target.value) || 0);
                      setLotWidth(w);
                    }}
                    placeholder="Lebar"
                    className="w-full bg-brand-white border border-brand-black/15 px-3 py-2 text-xs focus:border-brand-orange focus:outline-none rounded-xs pr-10 font-mono"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-brand-grey font-mono uppercase">Meter</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-brand-dark-grey">
                Jumlah Lantai Rumah
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((fl) => (
                  <button
                    key={fl}
                    type="button"
                    onClick={() => setFloors(fl)}
                    className={`py-2 text-[11px] font-mono border transition-all rounded-xs focus:outline-none ${
                      floors === fl
                        ? 'border-brand-orange bg-brand-orange text-brand-white font-bold'
                        : 'border-brand-black/12 bg-brand-white hover:border-brand-black'
                    }`}
                  >
                    {fl} Lantai
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ROOM DETAILS COUNT CONTROLLERS */}
          <div className="flex flex-col gap-4">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-brand-dark-grey block border-t border-brand-black/10 pt-4">
              Kebutuhan Utilitas Ruangan
            </span>

            {/* ERROR FLAG WRAPPER */}
            {!hasRoomsSelected && (
              <div className="flex items-center gap-2 p-3.5 bg-brand-red/10 border border-brand-red/15 text-brand-red text-xs rounded-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Pilih minimal 1 jenis ruangan untuk digarap sistem layout.</span>
              </div>
            )}

            <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-1">
              {DEFAULT_ROOM_TEMPLATES.map((room) => {
                const count = roomQuantities[room.id] || 0;
                return (
                  <div
                    key={room.id}
                    className="flex justify-between items-center bg-brand-white border border-brand-black/10 p-3 rounded-xs"
                    id={`room-ctrl-${room.id}`}
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-brand-black">
                        {room.label}
                      </span>
                      <span className="text-[9px] text-brand-grey lowercase tracking-tight">
                        fungsional area min {room.minAreaSqm} m²
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleRoomCountChange(room.id, -1)}
                        className="w-7 h-7 hover:bg-brand-red/10 rounded-full border border-brand-black/10 flex items-center justify-center hover:border-brand-red text-brand-grey hover:text-brand-red transition-all focus:outline-none"
                        id={`btn-minus-${room.id}`}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-5 text-center text-xs font-mono font-bold">
                        {count}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRoomCountChange(room.id, 1)}
                        className="w-7 h-7 hover:bg-brand-orange/15 rounded-full border border-brand-black/10 flex items-center justify-center hover:border-brand-orange text-brand-grey hover:text-brand-orange transition-all focus:outline-none"
                        id={`btn-plus-${room.id}`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: blueprint & render output */}
        <div className="lg:col-span-7 flex flex-col gap-10">
          {/* SVG RENDERING AREA */}
          {layout && hasRoomsSelected ? (
            <div className="border border-brand-black/15 bg-brand-white p-6 md:p-8 rounded-xs shadow-xs">
              <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 border-b border-brand-black/10 pb-5 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-[0.15em] font-semibold text-brand-grey block">
                    (Blueprint Zoning)
                  </span>
                  {floors > 1 && (
                    <div className="flex gap-1.5 bg-brand-warm-grey px-1.5 py-1 rounded-sm">
                      {[...Array(floors)].map((_, i) => {
                        const floorNum = i + 1;
                        return (
                          <button
                            key={i}
                            onClick={() => setCurrentFloorTab(floorNum)}
                            className={`px-3 py-1 text-[10px] font-bold font-mono transition-all rounded-xs focus:outline-none ${
                              currentFloorTab === floorNum
                                ? 'bg-brand-black text-brand-white'
                                : 'text-brand-grey hover:text-brand-black'
                            }`}
                            id={`tab-floor-${floorNum}`}
                          >
                            Fl.{floorNum}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleShuffleLayout}
                  className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-brand-orange border border-brand-orange/20 px-4 py-2 hover:bg-brand-orange/5 transition-all focus:outline-none"
                  id="btn-shuffle-layout"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-brand-orange" /> Tata Ulang Struktur
                </button>
              </div>

              {/* ESTIMATED DIMENSIONS BAR */}
              <div className="grid grid-cols-3 gap-2 bg-brand-cream/45 p-4 rounded-xs text-[10px] uppercase font-mono text-brand-grey tracking-wider mb-6 border border-brand-black/5">
                <div>Lot: {layout.lotWidth}m x {layout.lotLength}m</div>
                <div>Lahan: {layout.totalLotArea} m²</div>
                <div>Zonasi KDB: 70%</div>
              </div>

              {/* REAL SVG BOUNDARY CANVAS */}
              <div className="relative w-full aspect-[4/3] bg-brand-cream/25 border-2 border-dashed border-brand-grey/20 flex flex-col items-center justify-center p-4 rounded-xs overflow-hidden" id="denah-svg-canvas">
                {/* SVG Blueprint Draw */}
                <svg
                  viewBox={`0 0 ${layout.lotWidth * 40} ${layout.lotLength * 40}`}
                  className="w-full max-h-full drop-shadow-md font-sans border border-brand-black/10 bg-brand-white"
                >
                  {/* Outer Lot Background Grid */}
                  <defs>
                    <pattern id="blueprint-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0ede8" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#blueprint-grid)" />

                  {/* Lot dimensions label */}
                  <text x="10" y="25" fill="#9a9590" fontSize="8" letterSpacing="1" className="font-mono">
                    (REKONSILIASI PLOT BIDANG)
                  </text>

                  {/* Drawing packed rooms on active selected floor */}
                  {layout.layoutResult
                    .filter(room => room.floor === currentFloorTab)
                    .map((room) => {
                      const colors = getRoomColorClasses(room.id);
                      
                      // Map custom coordinates to SVG scale (grid multiplier x40)
                      const rx = room.x * 40;
                      const ry = room.y * 40;
                      const rw = room.width * 40;
                      const rh = room.height * 40;

                      return (
                        <g key={room.id} className="group/room">
                          <rect
                            x={rx}
                            y={ry}
                            width={rw}
                            height={rh}
                            className={`${colors.fill} ${colors.stroke} stroke-[1.5] transition-all duration-300 pointer-events-auto`}
                            rx="2"
                          />
                          {/* Room dimensions labels */}
                          <text
                            x={rx + rw / 2}
                            y={ry + rh / 2 - 2}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className={`${colors.text} font-bold text-[8px] sm:text-[9px] uppercase tracking-wider`}
                          >
                            {room.name}
                          </text>
                          <text
                            x={rx + rw / 2}
                            y={ry + rh / 2 + 10}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="fill-brand-dark-grey/65 font-mono text-[7px]"
                          >
                            {room.width.toFixed(1)}m x {room.height.toFixed(1)}m
                          </text>

                          {/* Hover Overlay Guide showing area */}
                          <title>
                            {room.name}: {(room.width * room.height).toFixed(1)} m²
                          </title>
                        </g>
                      );
                    })}
                </svg>

                {/* SVG SCALE CAPTION */}
                <span className="absolute bottom-6 right-6 font-mono text-[9px] text-brand-grey tracking-wider uppercase bg-brand-white/80 border border-brand-black/5 px-2 py-0.5 whitespace-nowrap">
                  Skala Visual Props · 1m : 40px
                </span>
              </div>

              {/* OVERFLOW WARNING MESSAGE BANNER */}
              {layout.warningMessage && (
                <div className="mt-6 flex gap-3 p-4 bg-yellow-500/10 border-l-4 border-brand-mustard text-brand-dark-grey text-xs rounded-r-xs leading-relaxed" id="layout-overflow-warning">
                  <Info className="w-5 h-5 text-brand-mustard shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-brand-black block tracking-wide uppercase mb-0.5">(Koefisien Padat Lahan)</span>
                    <p>{layout.warningMessage}</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-[250px] border-2 border-dashed border-brand-black/15 bg-brand-cream/10 rounded-xs flex flex-col items-center justify-center text-center p-6 select-none">
              <Layers className="w-12 h-12 text-brand-grey mb-3 stroke-[1.5]" />
              <p className="text-xs font-serif font-medium text-brand-dark-grey">Aparatus Blueprint Belum Siap</p>
              <p className="text-[10px] text-brand-grey max-w-xs mt-1">Gunakan formulir kontrol ruangan di samping kiri untuk mengaktifkan rendering denah.</p>
            </div>
          )}

          {/* S-04: AI RENDER KONSEP GENERATION BAY */}
          {layout && hasRoomsSelected && (
            <div className="border border-brand-black/15 bg-brand-cream/30 p-6 md:p-8 rounded-xs shadow-xs" id="ai-render-segment">
              <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-brand-orange border-b border-brand-black/10 pb-4 mb-6 flex items-center justify-between">
                <span className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-brand-black" /> (F-04 — AI Render Konsep Visual)</span>
                <span className="text-[9px] bg-brand-black text-brand-white px-2 py-0.5 rounded-sm">AKTIF</span>
              </h3>

              <div className="flex flex-col gap-6">
                {/* STYLE CHIPS */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-brand-dark-grey">
                    Pilih Gaya Visual Arsitektur
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {STYLE_TAGS.map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => setSelectedStyle(tag.id)}
                        className={`py-2 px-1 text-[10px] uppercase tracking-wider font-semibold border transition-all rounded-xs focus:outline-none ${
                          selectedStyle === tag.id
                            ? 'border-brand-orange bg-brand-orange text-brand-white'
                            : 'border-brand-black/12 bg-brand-white hover:border-brand-grey text-brand-dark-grey'
                        }`}
                        id={`style-chip-${tag.id}`}
                      >
                        {tag.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* ADDITIONAL PROMPT NOTES TEXTAREA WITH PRO COMPONENT ACCENTS */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="styleNotes" className="text-[10px] uppercase tracking-wider font-semibold text-brand-dark-grey">
                      Catatan Modifikasi Desain Ekstensi (Opsional)
                    </label>
                    <span className="text-[9px] text-[#E05C38] font-mono animate-pulse">PRO FEATURE</span>
                  </div>
                  <textarea
                    id="styleNotes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Misal: Cat tembok abu-abu doff, tambahkan aksen kisi kayu ulin vertikal tebal, pagar gerbang warna hitam metalik..."
                    maxLength={300}
                    rows={2.5}
                    className="w-full bg-brand-white border border-brand-black/15 px-3 py-2 text-xs focus:border-[#E05C38] focus:ring-1 focus:ring-[#E05C38] focus:outline-none rounded-xs placeholder-brand-grey font-sans transition-all"
                  />
                  
                  {/* Clickable Suggestion Tags Tray for instant high fidelity prompt additions */}
                  <div className="space-y-1.5 bg-brand-white p-2.5 border border-brand-black/5 rounded-xs mt-1">
                    <span className="text-[9px] text-brand-grey uppercase tracking-widest block font-medium">✨ Rekomendasi Fitur Tropis (Klik untuk menambahkan):</span>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: 'Double Ceiling 🏛️', val: 'Double-height volume ceiling mewah' },
                        { label: 'Taman Dalam 🌿', val: 'Courtyard taman dalam pengalir udara' },
                        { label: 'Dinding Roster 🧱', val: 'Aksen partisi dinding roster tanah liat' },
                        { label: 'Bilah Kayu 🪵', val: 'Kisi-kisi bilah kayu ulin vertikal' },
                        { label: 'Sumur Cahaya ☀️', val: 'Skylight sumur cahaya alami gantung' },
                        { label: 'Beton Ekspos 🪨', val: 'Tekstur acian semen dinding beton ekspos otentik' }
                      ].map((chip) => (
                        <button
                          key={chip.label}
                          type="button"
                          onClick={() => {
                            if (notes.includes(chip.val)) return;
                            setNotes(prev => {
                              const trimmed = prev.trim();
                              if (!trimmed) return chip.val;
                              return trimmed.endsWith(',') || trimmed.endsWith('.')
                                ? `${trimmed} ${chip.val}`
                                : `${trimmed}, ${chip.val}`;
                            });
                          }}
                          className="px-2 py-1 bg-brand-cream hover:bg-[#E05C38]/10 hover:text-[#E05C38] hover:border-[#E05C38]/30 text-[9px] font-medium tracking-tight text-brand-dark-grey border border-brand-black/5 rounded-xs transition-colors cursor-pointer"
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="text-right text-[9px] text-brand-grey font-mono">
                    {notes.length}/300 Karakter
                  </div>
                </div>

                {/* GENERATE ACTION BUTTON OR LOADING SHIMMER */}
                <div className="bg-transparent">
                  {aiLoading ? (
                    <div className="bg-brand-black text-brand-white p-6 rounded-xs flex flex-col items-center justify-center gap-4 border border-brand-white/10" id="ai-loading-panel">
                      <RefreshCw className="w-6 h-6 text-brand-orange animate-spin" />
                      <div className="text-center">
                        <p className="text-xs font-serif font-medium tracking-wide">{aiStatusMessage}</p>
                        <p className="text-[10px] text-brand-grey mt-0.5">Memproses request AI, mohon tunggu sebentar ({aiProgress}%)</p>
                      </div>
                      <div className="w-full max-w-xs h-1.5 bg-brand-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-brand-orange rounded-full transition-all duration-150"
                          style={{ width: `${aiProgress}%` }}
                        />
                      </div>
                    </div>
                  ) : aiResult ? (
                    <div className="flex flex-col gap-6" id="ai-result-panel">
                      {/* HIGH CONTRAST IMAGE OUTPUT CARD */}
                      <div className="relative aspect-[16/10] bg-brand-warm-grey border border-brand-black/10 rounded-xs overflow-hidden shadow-sm">
                        <img
                          src={aiResult.imageUrl}
                          alt="AI Concept Render Architecture"
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-4 left-4 z-10 bg-brand-green text-brand-white text-[9px] font-bold uppercase tracking-wider px-2 py-1 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> Render Konseptual ({aiResult.styleName})
                        </div>
                      </div>

                      {/* Prompt trace display */}
                      <div className="bg-brand-cream/55 p-4 rounded-xs border border-brand-black/5 text-[10px] text-brand-dark-grey leading-relaxed select-all">
                        <span className="font-bold text-brand-black block uppercase tracking-wider mb-0.5">System Prompt yang Dikonsolidasikan:</span>
                        "{aiResult.promptUsed}"
                      </div>

                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={handleGenerateAiRender}
                          className="flex-1 bg-brand-cream hover:bg-brand-warm-grey border border-brand-black/12 text-brand-black py-3 text-xs uppercase tracking-wider font-semibold transition-all focus:outline-none"
                          id="btn-ai-regenerate"
                        >
                          Pertajam Konsep Baru
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleGenerateAiRender}
                      className="w-full bg-brand-black text-brand-white hover:bg-brand-orange hover:text-brand-white py-4 text-xs font-semibold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 rounded-xs"
                      id="btn-ai-render-generate"
                    >
                      Bentuk Visual Konsep AI <Sparkles className="w-4 h-4 text-brand-orange" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* FINAL BOTTOM SUBMIT TO CONSULT BUTTON */}
          {layout && hasRoomsSelected && (
            <div className="mt-4 pt-6 border-t border-brand-black/10 flex flex-col sm:flex-row gap-4 items-center justify-between" id="denah-next-route">
              <span className="text-[11px] text-brand-grey italic">
                *Tata letak &amp; render AI di atas akan otomatis terbawa saat pendaftaran form konsultasi.
              </span>
              <button
                type="button"
                onClick={handleConsultWithPlan}
                className="w-full sm:w-auto bg-brand-orange text-brand-white hover:bg-brand-orange-hover px-10 py-4 text-xs font-semibold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                id="btn-consult-floor-plan"
              >
                Gunakan Denah Ini Untuk Konsultasi <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
