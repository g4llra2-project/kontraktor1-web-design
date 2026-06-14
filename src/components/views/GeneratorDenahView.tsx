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

  // Technical scales for CAD-like Gambar Kerja fitting
  const getRoomCADLabelAndElev = (roomId: string, name: string) => {
    let label = name.toUpperCase();
    let elev = "±0.00";
    
    if (roomId.startsWith('bedroom')) {
      label = "K. TIDUR UTAMA";
      elev = "±0.00";
    } else if (roomId.startsWith('kid_room')) {
      label = "K. TIDUR ANAK";
      elev = "±0.00";
    } else if (roomId.startsWith('bathroom')) {
      label = "K. MANDI";
      elev = "-0.05";
    } else if (roomId.startsWith('carport')) {
      label = "CARPORT";
      elev = "-0.10";
    } else if (roomId.startsWith('garden')) {
      label = "TAMAN";
      elev = "-0.15";
    } else if (roomId.startsWith('kitchen')) {
      label = "DAPUR & MAKAN";
      elev = "-0.02";
    } else if (roomId.startsWith('living_room')) {
      label = "RUANG TAMU";
      elev = "±0.00";
    } else if (roomId.startsWith('family_room')) {
      label = "R. KELUARGA";
      elev = "±0.00";
    } else if (roomId.startsWith('laundry')) {
      label = "AREA CUCI";
      elev = "-0.05";
    }
    return { label, elev };
  };

  const canvasW = 800;
  const canvasH = 580;
  const kopW = 160;
  const drawAreaW = canvasW - kopW - 20; // 620px
  const drawAreaH = canvasH - 20; // 560px

  // Centered rendering coordinates inside CAD paper size
  const drawBoxW = drawAreaW - 120; // 500px
  const drawBoxH = drawAreaH - 120; // 440px

  const scaleX = layout ? (drawBoxW / layout.lotWidth) : 40;
  const scaleY = layout ? (drawBoxH / layout.lotLength) : 40;
  const scaleVal = Math.min(scaleX, scaleY, 60);

  const drawW = layout ? (layout.lotWidth * scaleVal) : 300;
  const drawH = layout ? (layout.lotLength * scaleVal) : 400;
  const startX = 10 + 60 + (drawBoxW - drawW) / 2;
  const startY = 10 + 50 + (drawBoxH - drawH) / 2;

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
              <div className="relative w-full aspect-[4/3] bg-[#FCFCFA] border border-brand-black/20 flex flex-col items-center justify-center p-0 rounded-xs overflow-hidden" id="denah-svg-canvas">
                {/* SVG Blueprint Draw */}
                <svg
                  viewBox="0 0 800 580"
                  className="w-full h-full font-sans bg-[#FCFCFA]"
                >
                  {/* Outer Lot Background Grid */}
                  <defs>
                    <pattern id="blueprint-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ECE9E1" strokeWidth="0.6" />
                    </pattern>
                  </defs>
                  
                  {/* Canvas Outer Aesthetic Frame Borders */}
                  <rect x="5" y="5" width="790" height="570" fill="none" stroke="#1D1B18" strokeWidth="1.2" />
                  <rect x="8" y="8" width="784" height="564" fill="url(#blueprint-grid)" stroke="#1D1B18" strokeWidth="0.5" />

                  {/* Main Drawing Boundary Box for Centered Lot Grid */}
                  {layout && (
                    <g>
                      {/* Drawing the main boundary plot lot dashed lines */}
                      <rect
                        x={startX}
                        y={startY}
                        width={drawW}
                        height={drawH}
                        className="fill-[#FDFCFA]/40 stroke-[#1D1B18]/30 stroke-[1] stroke-dasharray-[4,4] select-none"
                      />

                      {/* SECTION LINE A-A (Horizontal through center of lot) */}
                      <g opacity="0.45" className="select-none">
                        <line x1={startX - 20} y1={startY + drawH/2} x2={startX + drawW + 20} y2={startY + drawH/2} stroke="#8D8B84" strokeWidth="0.8" strokeDasharray="6,4,2,4" />
                        
                        {/* Left Section bubble A */}
                        <circle cx={startX - 25} cy={startY + drawH/2} r="8" fill="#FCFCFA" stroke="#1D1B18" strokeWidth="1" />
                        <text x={startX - 25} y={startY + drawH/2 + 2.5} textAnchor="middle" fontSize="8" fontWeight="bold" className="font-mono fill-[#1D1B18]">A</text>
                        <path d={`M ${startX - 25} ${startY + drawH/2 - 8} L ${startX - 28} ${startY + drawH/2 - 12} L ${startX - 22} ${startY + drawH/2 - 12} Z`} fill="#1D1B18" />

                        {/* Right Section bubble A */}
                        <circle cx={startX + drawW + 25} cy={startY + drawH/2} r="8" fill="#FCFCFA" stroke="#1D1B18" strokeWidth="1" />
                        <text x={startX + drawW + 25} y={startY + drawH/2 + 2.5} textAnchor="middle" fontSize="8" fontWeight="bold" className="font-mono fill-[#1D1B18]">A</text>
                        <path d={`M ${startX + drawW + 25} ${startY + drawH/2 - 8} L ${startX + drawW + 22} ${startY + drawH/2 - 12} L ${startX + drawW + 28} ${startY + drawH/2 - 12} Z`} fill="#1D1B18" />
                      </g>

                      {/* SECTION LINE B-B (Vertical through center of lot) */}
                      <g opacity="0.45" className="select-none">
                        <line x1={startX + drawW/2} y1={startY - 20} x2={startX + drawW/2} y2={startY + drawH + 20} stroke="#8D8B84" strokeWidth="0.8" strokeDasharray="6,4,2,4" />
                        
                        {/* Top Section bubble B */}
                        <circle cx={startX + drawW/2} cy={startY - 25} r="8" fill="#FCFCFA" stroke="#1D1B18" strokeWidth="1" />
                        <text x={startX + drawW/2} y={startY - 25 + 2.5} textAnchor="middle" fontSize="8" fontWeight="bold" className="font-mono fill-[#1D1B18]">B</text>
                        <path d={`M ${startX + drawW/2 + 8} ${startY - 25} L ${startX + drawW/2 + 12} ${startY - 28} L ${startX + drawW/2 + 12} ${startY - 22} Z`} fill="#1D1B18" />

                        {/* Bottom Section bubble B */}
                        <circle cx={startX + drawW/2} cy={startY + drawH + 25} r="8" fill="#FCFCFA" stroke="#1D1B18" strokeWidth="1" />
                        <text x={startX + drawW/2} y={startY + drawH + 25 + 2.5} textAnchor="middle" fontSize="8" fontWeight="bold" className="font-mono fill-[#1D1B18]">B</text>
                        <path d={`M ${startX + drawW/2 + 8} ${startY + drawH + 25} L ${startX + drawW/2 + 12} ${startY + drawH + 25 - 3} L ${startX + drawW/2 + 12} ${startY + drawH + 25 + 3} Z`} fill="#1D1B18" />
                      </g>

                      {/* TOP HORIZONTAL PERIMETER DIMENSION LINE */}
                      <g className="font-mono text-[9px] fill-[#4D4B44] stroke-[#4D4B44]">
                        <line x1={startX} y1={startY - 35} x2={startX + drawW} y2={startY - 35} stroke="#4D4B44" strokeWidth="0.8" />
                        <line x1={startX} y1={startY - 35} x2={startX} y2={startY - 10} stroke="#4D4B44" strokeWidth="0.5" strokeDasharray="2,2" />
                        <line x1={startX + drawW} y1={startY - 35} x2={startX + drawW} y2={startY - 10} stroke="#4D4B44" strokeWidth="0.5" strokeDasharray="2,2" />
                        {/* 45 degree Architectural Ticks */}
                        <line x1={startX - 4} y1={startY - 31} x2={startX + 4} y2={startY - 39} stroke="#1D1B18" strokeWidth="1.2" />
                        <line x1={startX + drawW - 4} y1={startY - 31} x2={startX + drawW + 4} y2={startY - 39} stroke="#1D1B18" strokeWidth="1.2" />
                        {/* Dimension text banner (millimeters) */}
                        <rect x={startX + drawW/2 - 24} y={startY - 41} width="48" height="12" fill="#FCFCFA" />
                        <text x={startX + drawW/2} y={startY - 32} textAnchor="middle" className="font-mono font-bold text-[8.5px] fill-[#1D1B18] tracking-wider">
                          {(layout.lotWidth * 1000).toFixed(0)}
                        </text>
                      </g>

                      {/* LEFT VERTICAL PERIMETER DIMENSION LINE */}
                      <g className="font-mono text-[9px] fill-[#4D4B44] stroke-[#4D4B44]">
                        <line x1={startX - 35} y1={startY} x2={startX - 35} y2={startY + drawH} stroke="#4D4B44" strokeWidth="0.8" />
                        <line x1={startX - 35} y1={startY} x2={startX - 10} y2={startY} stroke="#4D4B44" strokeWidth="0.5" strokeDasharray="2,2" />
                        <line x1={startX - 35} y1={startY + drawH} x2={startX - 10} y2={startY + drawH} stroke="#4D4B44" strokeWidth="0.5" strokeDasharray="2,2" />
                        {/* Ticks */}
                        <line x1={startX - 31} y1={startY + 4} x2={startX - 39} y2={startY - 4} stroke="#1D1B18" strokeWidth="1.2" />
                        <line x1={startX - 31} y1={startY + drawH + 4} x2={startX - 39} y2={startY + drawH - 4} stroke="#1D1B18" strokeWidth="1.2" />
                        {/* Dimension text label (millimeters, rotated) */}
                        <rect x={startX - 41} y={startY + drawH/2 - 20} width="12" height="40" fill="#FCFCFA" />
                        <text
                          x={startX - 32}
                          y={startY + drawH/2 + 3}
                          textAnchor="middle"
                          transform={`rotate(-90, ${startX - 32}, ${startY + drawH/2})`}
                          className="font-mono font-bold text-[8.5px] fill-[#1D1B18] tracking-wider"
                        >
                          {(layout.lotLength * 1000).toFixed(0)}
                        </text>
                      </g>

                      {/* North Arrow Symbol */}
                      <g transform={`translate(${startX + drawW + 15}, ${startY + 20}) scale(0.8)`} opacity="0.75" className="select-none">
                        <circle cx="15" cy="15" r="11" fill="none" stroke="#1D1B18" strokeWidth="0.8" />
                        <path d="M 15,4 L 11,18 L 15,15 L 19,18 Z" fill="#1D1B18" stroke="#1D1B18" strokeWidth="0.8" />
                        <text x="15" y="-1" textAnchor="middle" fontSize="7.5" fontWeight="bold" className="font-sans fill-[#1D1B18]">U</text>
                      </g>

                      {/* CAD SCALE MARKER BLOCK (DENAH LANTAI KOORDINASI) */}
                      <g transform={`translate(${startX}, ${startY + drawH + 35})`} className="select-none">
                        {/* Targets circle */}
                        <circle cx="14" cy="14" r="11" fill="none" stroke="#1D1B18" strokeWidth="0.8" />
                        <circle cx="14" cy="14" r="2.5" fill="#1D1B18" />
                        <line x1="2" y1="14" x2="26" y2="14" stroke="#1D1B18" strokeWidth="0.8" />
                        <line x1="14" y1="2" x2="14" y2="26" stroke="#1D1B18" strokeWidth="0.8" />
                        
                        <text x="32" y="11" className="font-sans font-extrabold text-[10.5px] uppercase tracking-wider fill-[#1D1B18]">
                          DENAH LANTAI {currentFloorTab}
                        </text>
                        <line x1="32" y1="16" x2="190" y2="16" stroke="#1D1B18" strokeWidth="1.2" />
                        <text x="32" y="25" className="font-mono text-[7px] uppercase font-bold text-[#8D8678] tracking-widest text-[#E05C38]">
                          SKALA 1:100 (REKONSILIASI MILIMETER)
                        </text>
                      </g>

                      {/* PACKED SPACES ROOM DRAW GROUP */}
                      {layout.layoutResult
                        .filter(room => room.floor === currentFloorTab)
                        .map((room) => {
                          const rx = startX + room.x * scaleVal;
                          const ry = startY + room.y * scaleVal;
                          const rw = room.width * scaleVal;
                          const rh = room.height * scaleVal;
                          const cadLabelAndElev = getRoomCADLabelAndElev(room.id, room.name);

                          return (
                            <g key={room.id} className="group/room">
                              {/* DOUBLE WALL (Brickwork Representation) */}
                              {/* Outer structural wall block (thick dark) */}
                              <rect
                                x={rx}
                                y={ry}
                                width={rw}
                                height={rh}
                                className="fill-[#FDFDFB] stroke-[#1D1B18] stroke-[2.2] pointer-events-auto"
                                rx="0"
                              />
                              {/* Inner plaster double boundary (thin grey) */}
                              <rect
                                x={rx + 2.5}
                                y={ry + 2.5}
                                width={rw - 5}
                                height={rh - 5}
                                className="fill-[#F8F7F4]/40 stroke-[#AEA99B] stroke-[0.5]"
                                rx="0"
                              />

                              {/* Concrete Column pillars at the 4 corner ends */}
                              <rect x={rx - 2.5} y={ry - 2.5} width="5" height="5" fill="#1D1B18" stroke="#1D1B18" strokeWidth="0.2" />
                              <rect x={rx + rw - 2.5} y={ry - 2.5} width="5" height="5" fill="#1D1B18" stroke="#1D1B18" strokeWidth="0.2" />
                              <rect x={rx - 2.5} y={ry + rh - 2.5} width="5" height="5" fill="#1D1B18" stroke="#1D1B18" strokeWidth="0.2" />
                              <rect x={rx + rw - 2.5} y={ry + rh - 2.5} width="5" height="5" fill="#1D1B18" stroke="#1D1B18" strokeWidth="0.2" />

                              {/* Minimalist Vector Furniture Overlay (CAD style) */}
                              {room.id.startsWith('bedroom') && (
                                <g opacity="0.08" transform={`translate(${rx + rw/2 - 20}, ${ry + rh/2 - 22}) scale(1.0)`}>
                                  <rect x="2" y="2" width="36" height="36" fill="none" stroke="#1D1B18" strokeWidth="1.8" />
                                  <rect x="5" y="5" width="12" height="8" rx="1" fill="none" stroke="#1D1B18" strokeWidth="1" />
                                  <rect x="23" y="5" width="12" height="8" rx="1" fill="none" stroke="#1D1B18" strokeWidth="1" />
                                  <line x1="2" y1="20" x2="38" y2="20" stroke="#1D1B18" strokeWidth="1" />
                                </g>
                              )}
                              {room.id.startsWith('kid_room') && (
                                <g opacity="0.08" transform={`translate(${rx + rw/2 - 15}, ${ry + rh/2 - 20}) scale(0.85)`}>
                                  <rect x="2" y="2" width="28" height="36" fill="none" stroke="#1D1B18" strokeWidth="1.8" />
                                  <rect x="5" y="5" width="18" height="8" rx="1" fill="none" stroke="#1D1B18" strokeWidth="1" />
                                  <line x1="2" y1="22" x2="30" y2="22" stroke="#1D1B18" strokeWidth="1" />
                                </g>
                              )}
                              {room.id.startsWith('bathroom') && (
                                <g opacity="0.08" transform={`translate(${rx + rw/2 - 15}, ${ry + rh/2 - 15}) scale(0.8)`}>
                                  <rect x="5" y="2" width="20" height="7" rx="1.5" fill="none" stroke="#1D1B18" strokeWidth="1.5" />
                                  <ellipse cx="15" cy="18" rx="7" ry="9" fill="none" stroke="#1D1B18" strokeWidth="1.5" />
                                  <circle cx="15" cy="18" r="2.5" fill="none" stroke="#1D1B18" strokeWidth="1" />
                                  <rect x="2" y="2" width="5" height="5" fill="none" stroke="#1D1B18" strokeWidth="1" />
                                </g>
                              )}
                              {room.id.startsWith('carport') && (
                                <g opacity="0.07" transform={`translate(${rx + rw/2 - 17}, ${ry + rh/2 - 35}) scale(0.7)`}>
                                  <rect x="5" y="5" width="34" height="80" rx="10" fill="none" stroke="#1D1B18" strokeWidth="1.8" />
                                  <path d="M 5,23 Q 22,20 39,23" fill="none" stroke="#1D1B18" strokeWidth="1.5" />
                                  <rect x="9" y="28" width="26" height="20" rx="3" fill="none" stroke="#1D1B18" strokeWidth="1.2" />
                                  <rect x="11" y="56" width="22" height="18" rx="1.5" fill="none" stroke="#1D1B18" strokeWidth="1.2" />
                                  <circle cx="12" cy="14" r="2.5" fill="#1D1B18" />
                                  <circle cx="30" cy="14" r="2.5" fill="#1D1B18" />
                                </g>
                              )}
                              {room.id.startsWith('kitchen') && (
                                <g opacity="0.08" transform={`translate(${rx + rw/2 - 18}, ${ry + rh/2 - 15}) scale(0.8)`}>
                                  <path d="M 2,2 H 34 V 12 H 12 V 34 H 2 Z" fill="none" stroke="#1D1B18" strokeWidth="1.5" />
                                  <circle cx="8" cy="7" r="3.5" fill="none" stroke="#1D1B18" strokeWidth="1" />
                                  <circle cx="20" cy="7" r="3.5" fill="none" stroke="#1D1B18" strokeWidth="1" />
                                  <rect x="4" y="18" width="6" height="6" fill="none" stroke="#1D1B18" strokeWidth="1" />
                                </g>
                              )}
                              {room.id.startsWith('living_room') && (
                                <g opacity="0.08" transform={`translate(${rx + rw/2 - 20}, ${ry + rh/2 - 15}) scale(0.8)`}>
                                  <path d="M 2,2 h 36 v 10 M 34,2 v 10 M 6,2 v 10 M 2,12 h 36" fill="none" stroke="#1D1B18" strokeWidth="1.5" />
                                  <ellipse cx="20" cy="22" rx="10" ry="5" fill="none" stroke="#1D1B18" strokeWidth="1" />
                                </g>
                              )}
                              {room.id.startsWith('family_room') && (
                                <g opacity="0.08" transform={`translate(${rx + rw/2 - 25}, ${ry + rh/2 - 18}) scale(0.8)`}>
                                  <rect x="2" y="2" width="46" height="32" rx="2" fill="none" stroke="#1D1B18" strokeWidth="1.5" />
                                  <path d="M 6,6 h 34 v 10 M 34,6 v 10 M 12,6 v 10" fill="none" stroke="#1D1B18" strokeWidth="1.2" />
                                  <rect x="15" y="22" width="16" height="6" fill="none" stroke="#1D1B18" strokeWidth="1" />
                                </g>
                              )}
                              {room.id.startsWith('garden') && (
                                <g opacity="0.14" transform={`translate(${rx + 8}, ${ry + 8}) scale(0.6)`}>
                                  <path d="M 0,10 Q 5,2 10,10 Q 15,-2 20,10 M 8,10 Q 12,4 16,10" fill="none" stroke="#2E511E" strokeWidth="1.2" />
                                </g>
                              )}

                              {/* ANNOTATIONS (Room Name, Elevation details, and dimensions in mm) */}
                              {/* Background blur pill behind text for extreme professional readability */}
                              <rect
                                x={rx + rw/2 - 34}
                                y={ry + rh/2 - 18}
                                width="68"
                                height="34"
                                fill="#FCFCFA"
                                fillOpacity="0.8"
                                rx="2"
                                className="pointer-events-none select-none"
                              />

                              {/* Room Name label */}
                              <text
                                x={rx + rw/2}
                                y={ry + rh/2 - 8}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="fill-[#1A1A18] font-bold text-[8px] sm:text-[8.5px] uppercase tracking-wider"
                              >
                                {cadLabelAndElev.label}
                              </text>
                              
                              {/* Elevation Details */}
                              <text
                                x={rx + rw/2}
                                y={ry + rh/2 + 2}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="fill-[#7B7669] font-mono text-[7px] font-medium"
                              >
                                ({cadLabelAndElev.elev})
                              </text>

                              {/* Dimension text in millimeters */}
                              <text
                                x={rx + rw/2}
                                y={ry + rh/2 + 10}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="fill-[#E05C38] font-mono font-bold text-[7.5px]"
                              >
                                {(room.width * 1000).toFixed(0)} x {(room.height * 1000).toFixed(0)}
                              </text>

                              {/* Hover tooltip */}
                              <title>
                                {room.name}: {(room.width * room.height).toFixed(1)} m²
                              </title>
                            </g>
                          );
                        })}
                    </g>
                  )}

                  {/* KOP GAMBAR (RIGHT-HAND TITLE BLOCK PANEL) */}
                  <g transform="translate(630, 0)">
                    {/* Separating major border line */}
                    <line x1="0" y1="10" x2="0" y2="570" stroke="#1D1B18" strokeWidth="1.5" />
                    
                    {/* Logo & Firm Name Box */}
                    <g transform="translate(10, 20)">
                      <text x="70" y="20" textAnchor="middle" className="font-sans font-black text-[10.5px] tracking-[0.22em] fill-[#1D1B18]">
                        OH ARCHITECTURE
                      </text>
                      <text x="70" y="32" textAnchor="middle" className="font-sans text-[7px] tracking-[0.1em] fill-[#6D6B64] font-medium lowercase italic">
                        (studio rancang utama)
                      </text>
                      <line x1="10" y1="42" x2="130" y2="42" stroke="#1D1B18" strokeWidth="1.2" />
                    </g>

                    {/* Proyek Phase Stamp */}
                    <g transform="translate(10, 75)">
                      <rect x="15" y="0" width="110" height="20" fill="#1D1B18" />
                      <text x="70" y="13" textAnchor="middle" className="font-sans font-black text-[8px] tracking-[0.15em] fill-[#FCFCFA]">
                        GAMBAR KERJA
                      </text>
                    </g>

                    {/* Metadata Specs Rows */}
                    <g transform="translate(10, 115)" className="font-sans text-[8px]">
                      {/* NAMA PROYEK */}
                      <text x="10" y="10" className="font-bold fill-[#8D8B84] uppercase tracking-wider">PROYEK / LOKASI:</text>
                      <text x="10" y="22" className="font-semibold fill-[#1D1B18] text-[9.5px]">RESIDENSI TROPIS MINIMALIS</text>
                      <text x="10" y="32" className="fill-brand-grey text-[7px] tracking-wide font-medium">Lahan {layout ? layout.totalLotArea : landArea} m² · {floors} Lantai</text>
                      <line x1="10" y1="40" x2="130" y2="40" stroke="#E3E1D9" strokeWidth="0.8" />

                      {/* NAMA GAMBAR */}
                      <text x="10" y="55" className="font-bold fill-[#8D8B84] uppercase tracking-wider">NAMA GAMBAR:</text>
                      <text x="10" y="67" className="font-black fill-[#E05C38] text-[9.5px]">DENAH LANTAI {currentFloorTab}</text>
                      <line x1="10" y1="75" x2="130" y2="75" stroke="#E3E1D9" strokeWidth="0.8" />

                      {/* ARSITEK PENELITI */}
                      <text x="10" y="90" className="font-bold fill-[#8D8B84] uppercase tracking-wider">ARSITEK PENELITI:</text>
                      <text x="10" y="102" className="font-semibold fill-[#1D1B18] text-[9.5px]">OH DESIGN SYSTEM</text>
                      <line x1="10" y1="110" x2="130" y2="110" stroke="#E3E1D9" strokeWidth="0.8" />

                      {/* SHEET DETAILS */}
                      <text x="10" y="125" className="font-bold fill-[#8D8B84] uppercase tracking-wider">SKALA:</text>
                      <text x="10" y="137" className="font-mono font-bold fill-[#1D1B18] text-[9.5px]">1 : 100</text>
                      
                      <text x="10" y="152" className="font-bold fill-[#8D8B84] uppercase tracking-wider">NO. LEMBAR:</text>
                      <text x="10" y="167" className="font-mono font-black fill-[#E05C38] text-[13px]">AR-0{currentFloorTab}</text>
                      <line x1="10" y1="180" x2="130" y2="180" stroke="#1D1B18" strokeWidth="1" />
                    </g>

                    {/* Notes & Standard Guidelines */}
                    <g transform="translate(10, 310)" className="font-sans text-[7.2px] fill-[#7D7B74] leading-relaxed">
                      <text x="10" y="10" className="font-bold fill-[#1D1B18] uppercase tracking-widest text-[8px]">CATATAN UTAMA:</text>
                      <text x="10" y="25">1. Catatan dimensi adalah milimeter.</text>
                      <text x="10" y="37">2. Jangan ukur langsung skala gambar,</text>
                      <text x="10" y="47">   selalu acu pada nilai numerik tertulis.</text>
                      <text x="10" y="57">3. Seluruh detail perancangan mematuhi</text>
                      <text x="10" y="67">   perda koefisien dasar bangunan (KDB).</text>
                      
                      {/* Stamp Area */}
                      <rect x="10" y="85" width="120" height="50" rx="3" fill="none" stroke="#E05C38" strokeWidth="0.8" strokeDasharray="3,3" />
                      <text x="70" y="105" textAnchor="middle" className="font-serif font-black text-[9.5px] fill-[#E05C38] tracking-widest">APPROVED</text>
                      <text x="70" y="118" textAnchor="middle" className="font-mono text-[5.8px] fill-[#E05C38] tracking-wider">OH PARTNERS COMMITTEE</text>
                    </g>
                  </g>
                </svg>

                {/* SVG SCALE CAPTION */}
                <span className="absolute bottom-6 left-6 font-mono text-[9px] text-brand-grey tracking-wider uppercase bg-brand-white/90 border border-brand-black/5 px-2 py-0.5 whitespace-nowrap">
                  Paper Size: A3 (CAD Scaled) · Dimensi: Milimeter (mm)
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
