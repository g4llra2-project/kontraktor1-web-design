/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ViewPath, RabEstimateInput, RabEstimateResult, BuildingType, RoomLayoutResult, RoomConfig } from '../../types';
import { PRICE_PER_SQM, FLOOR_MULTIPLIERS, RENOVATION_MULTIPLIER, ADDON_COSTS, ESTIMATE_BREAKDOWN_PERCENTAGES, DEFAULT_ROOM_TEMPLATES, STYLE_TAGS } from '../../constants';
import { generateFloorPlanLayout } from '../../lib/floor-plan-algorithm';
import { ArrowLeft, ArrowRight, Check, AlertTriangle, Calculator, ChevronRight, RefreshCw, Layers, Plus, Minus, Info, ClipboardCheck, Sparkles, Image, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import NextImage from '../NextImage';

interface KalkulatorRabViewProps {
  onCompleteEstimate: (input: RabEstimateInput, result: RabEstimateResult) => void;
  onCompleteFloorPlan: (data: {
    landAreaSqm: number;
    floors: number;
    roomsConfig: Record<string, number>;
    layoutResult: RoomLayoutResult[];
  }, aiRender?: { imageUrl: string; styleName: string; promptUsed: string } | null) => void;
  onNavigate: (view: ViewPath) => void;
  initialInput?: RabEstimateInput | null;
}

export default function KalkulatorRabView({
  onCompleteEstimate,
  onCompleteFloorPlan,
  onNavigate,
  initialInput,
}: KalkulatorRabViewProps) {
  const [step, setStep] = useState(1);

  // Core configuration states
  const [buildingType, setBuildingType] = useState<BuildingType>(initialInput?.buildingType || 'new');
  const [areaSqm, setAreaSqm] = useState<string>(initialInput?.areaSqm?.toString() || '');
  const [lotWidth, setLotWidth] = useState<number>(8); // Default front width in meters
  const [floors, setFloors] = useState<number>(initialInput?.floors || 1);
  const [specification, setSpecification] = useState<'standard' | 'medium' | 'premium'>(initialInput?.specification || 'medium');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(initialInput?.addons || []);
  const [executionMethod, setExecutionMethod] = useState<'contractor' | 'swakelola'>('contractor');

  // Room config counter list (Derived from default templates)
  const [roomQuantities, setRoomQuantities] = useState<Record<string, number>>(() => {
    const initialCounts: Record<string, number> = {};
    DEFAULT_ROOM_TEMPLATES.forEach(r => {
      initialCounts[r.id] = r.count;
    });
    return initialCounts;
  });

  // CAD Blueprint drawing and shuffling seed
  const [seed, setSeed] = useState<number>(42);
  const [currentFloorTab, setCurrentFloorTab] = useState<number>(1);
  const [layout, setLayout] = useState<ReturnType<typeof generateFloorPlanLayout> | null>(null);

  // KIE.AI LAYOUT ENGINE STATES
  const [blueprintEngine, setBlueprintEngine] = useState<'procedural' | 'kie-ai'>('procedural');
  const [configKieUrl, setConfigKieUrl] = useState<string>(() => {
    const envUrl = (import.meta as any).env.VITE_KIE_API_URL;
    if (envUrl && envUrl !== 'https://api.kie.ai/v1') {
      return envUrl;
    }
    return '/api/v1';
  });
  const [configKieKey, setConfigKieKey] = useState<string>((import.meta as any).env.VITE_KIE_API_KEY || '');
  const [configKieModel, setConfigKieModel] = useState<string>('z-image');
  const [useKieSimulation, setUseKieSimulation] = useState<boolean>(true);
  const [kieLoading, setKieLoading] = useState<boolean>(false);
  const [kieProgress, setKieProgress] = useState<number>(0);
  const [kieStatusMsg, setKieStatusMsg] = useState<string>('');
  const [kieError, setKieError] = useState<string>('');
  const [aiGeneratedLayout, setAiGeneratedLayout] = useState<(ReturnType<typeof generateFloorPlanLayout> & { imageUrl?: string; }) | null>(null);
  const [apiLogs, setApiLogs] = useState<string[]>([]);
  const [kieRawRequest, setKieRawRequest] = useState<string>('');
  const [kieRawResponse, setKieRawResponse] = useState<string>('');

  // AI Facade Render configurations
  const [selectedStyle, setSelectedStyle] = useState<string>('minimalist');
  const [notes, setNotes] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiProgress, setAiProgress] = useState<number>(0);
  const [aiStatusMessage, setAiStatusMessage] = useState<string>('');
  const [aiResult, setAiResult] = useState<{ imageUrl: string; styleName: string; promptUsed: string } | null>(null);

  // Validation state
  const [validationError, setValidationError] = useState('');

  // Cost estimation result state
  const [calculatedResult, setCalculatedResult] = useState<RabEstimateResult | null>(null);

  // Format currency helper
  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  // Adjust room quantity counters
  const handleRoomCountChange = (id: string, delta: number) => {
    setRoomQuantities(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const hasRoomsSelected = Object.values(roomQuantities).some((count) => (count as number) > 0);

  // Auto layout blueprint recalculation when parameters are in-sync
  useEffect(() => {
    const selectedRooms = Object.entries(roomQuantities).map(([templateId, count]) => ({
      templateId,
      count: count as number,
    }));

    const result = generateFloorPlanLayout({
      landAreaSqm: parseFloat(areaSqm) || 120,
      floors,
      selectedRooms,
      allTemplates: DEFAULT_ROOM_TEMPLATES,
      widthMeters: lotWidth,
      seed,
    });

    setLayout(result);

    // Keep active floor tab within active floor bounds
    if (currentFloorTab > floors) {
      setCurrentFloorTab(floors);
    }
  }, [areaSqm, lotWidth, floors, roomQuantities, seed, currentFloorTab]);

  const handleNextStep = () => {
    setValidationError('');

    if (step === 2) {
      const area = parseFloat(areaSqm);
      if (isNaN(area) || area <= 0) {
        setValidationError('Luas bangunan wajib diisi dengan angka minimal 1 m².');
        return;
      }
      if (area > 10000) {
        setValidationError('Maksimal estimasi luas bangunan adalah 10.000 m².');
        return;
      }
    }

    if (step === 3) {
      if (!hasRoomsSelected) {
        setValidationError('Silakan pilih minimal 1 jenis ruangan untuk perencanaan struktur denah.');
        return;
      }
    }

    if (step < 4) {
      setStep(prev => prev + 1);
    } else {
      // Step 4 final click: run both calculation and blueprint generation
      calculateRABAndDenah();
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

  // Perform full calculations and register to callback
  const calculateRABAndDenah = (methodOverride?: 'contractor' | 'swakelola') => {
    const activeMethod = methodOverride || executionMethod;
    const area = parseFloat(areaSqm) || 120;
    const baseRate = PRICE_PER_SQM[specification];
    const floorFactor = FLOOR_MULTIPLIERS[floors] ?? 1.35;

    // Base cost formula
    let baseCost = area * baseRate * floorFactor;

    // Apply discount for renovation model
    if (buildingType === 'renovation') {
      baseCost = baseCost * RENOVATION_MULTIPLIER;
    }

    // Apply Swakelola savings (~18%)
    if (activeMethod === 'swakelola') {
      baseCost = baseCost * 0.82;
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

    // Breakdown formatted based on default percentages
    const breakdown = ESTIMATE_BREAKDOWN_PERCENTAGES.map(item => ({
      category: item.category,
      percentage: item.percentage,
      estimatedCost: (totalCost * item.percentage) / 100,
    }));

    const result: RabEstimateResult = {
      estimatedMin,
      estimatedMax,
      breakdown,
      disclaimer: activeMethod === 'swakelola'
        ? 'Estimasi RAB di atas diset menggunakan tarif Swakelola Mandiri (lebih hemat ~18% karena Anda mengoordinasikan pengadaan material dan tukang sipil harian secara mandiri tanpa pihak Kontraktor Utama). Tanggung jawab koordinasi K3, keamanan struktur, dan garansi material sepenuhnya dipikul sendiri oleh pemilik lahan.'
        : 'Estimasi RAB di atas dihitung dengan standar pengawasan sipil penuh dari Kontraktor Mitra Bergaransi. Harga mencakup personil pengawas profesional lapangan harian, standar sanitasi K3, jaminan kepatuhan cetak biru Arsitektur, serta garansi kebocoran gubahan ruang penuh selama 12 bulan.',
    };

    setCalculatedResult(result);

    // Call individual state callbacks inside App level to persist calculations
    onCompleteEstimate(
      { buildingType, areaSqm: area, floors, specification, addons: selectedAddons },
      result
    );

    if (layout) {
      onCompleteFloorPlan(
        {
          landAreaSqm: area,
          floors,
          roomsConfig: roomQuantities,
          layoutResult: layout.layoutResult,
        },
        aiResult
      );
    }

    setStep(5); // Transition to unified visual results view
  };

  const handleExecutionMethodChange = (method: 'contractor' | 'swakelola') => {
    setExecutionMethod(method);
    calculateRABAndDenah(method);
  };

  const handleShuffleLayout = () => {
    setSeed(prev => prev + Math.floor(Math.random() * 100) + 1);
  };

  const handleGenerateAiLayout = async () => {
    setKieLoading(true);
    setKieProgress(0);
    setKieError('');
    setAiGeneratedLayout(null);
    setKieStatusMsg('Memproses kerangka AI...');
    
    const logs: string[] = [];
    const addLog = (msg: string) => {
      logs.push(`[${new Date().toLocaleTimeString('id-ID')}] ${msg}`);
      setApiLogs([...logs]);
    };

    addLog('Menginisialisasi modul generator kie.ai...');
    addLog(`URL Target: ${configKieUrl}/chat/completions`);
    addLog(`Model Target: ${configKieModel}`);

    // Generate room config payload
    const selectedRooms = Object.entries(roomQuantities)
      .filter(([_, count]) => (count as number) > 0)
      .map(([id, count]) => {
        const temp = DEFAULT_ROOM_TEMPLATES.find(t => t.id === id);
        return {
          id,
          name: temp?.name || id,
          count: count as number,
          minAreaSqm: temp?.minAreaSqm || 6,
        };
      });

    const parsedArea = parseFloat(areaSqm) || 120;
    const derivedWidth = lotWidth > 0 ? lotWidth : 8;
    const derivedLength = Math.max(8, Math.round(parsedArea / derivedWidth));

    // Construct rich dynamic parameters matching the user's detailed architectural template prompt
    const floorWord = floors === 1 ? 'single-story' : floors === 2 ? 'two-story' : `${floors}-story`;
    const styleObj = STYLE_TAGS.find(s => s.id === selectedStyle);
    const styleLabelDisplay = styleObj ? styleObj.label.toLowerCase() : 'minimalist modern';
    const stylePromptDetails = styleObj ? styleObj.prompt : 'clean geometric lines, warm natural light, functional layout';

    const mainBedrooms = roomQuantities['bedroom'] || 0;
    const kidsBedrooms = roomQuantities['kid_room'] || 0;
    const totalBedrooms = mainBedrooms + kidsBedrooms;
    const totalBathrooms = roomQuantities['bathroom'] || 0;

    // Compile layout list requirements
    const layoutReqs: string[] = [];
    if (totalBedrooms > 0) {
      layoutReqs.push(`- ${totalBedrooms} bedrooms (${mainBedrooms} master bedroom with ensuite bathroom, ${kidsBedrooms} standard kid bedrooms)`);
    }
    if (totalBathrooms > 0) {
      layoutReqs.push(`- ${totalBathrooms} bathrooms total`);
    }
    if ((roomQuantities['living_room'] || 0) > 0) {
      layoutReqs.push('- Open-plan living room and dining area');
    }
    if ((roomQuantities['kitchen'] || 0) > 0) {
      layoutReqs.push('- Modern kitchen with island counter space');
    }
    if ((roomQuantities['carport'] || 0) > 0) {
      layoutReqs.push('- Carport designed for car parking');
    }
    if ((roomQuantities['garden'] || 0) > 0) {
      layoutReqs.push('- Small backyard/garden green space');
    }
    if ((roomQuantities['family_room'] || 0) > 0) {
      layoutReqs.push('- Family room lounge area');
    }
    if ((roomQuantities['laundry'] || 0) > 0) {
      layoutReqs.push('- Dedicated laundry and washing area');
    }

    const architecturalPrompt = `Create a detailed architectural floor plan for a ${floorWord} ${styleLabelDisplay} house on a ${derivedWidth}x${derivedLength} meter lot (${parsedArea} sqm).

Layout requirements:
${layoutReqs.join('\n')}

Style specifications:
- Style Theme: ${styleLabelDisplay} (${stylePromptDetails})
- Clean lines with no unnecessary walls to preserve open pathways
- Proper orientation for standard entry zones
- Natural light optimization with open layouts and windows consideration
- Master bedroom positioned appropriately for privacy (generally at the back)

Drawing styles:
- Top-down architectural floor plan layout representation
- Thin precise line boundaries suitable for CAD rendering
- Room labels mapped logically
- Dimension measurements represented in meters
- Professional architectural grid distribution across ${floors} floor(s)

CRITICAL: You are acting as a CAD backend system. Your response must be EXACTLY a valid JSON representation of the rooms layout matching this TypeScript interface:
{
  "layoutResult": Array<{
    "id": string, // template id matching: bedroom, kid_room, bathroom, living_room, family_room, kitchen, carport, laundry, garden
    "name": string, // Friendly Indonesian/English name of the room
    "x": number, // start coordinate x in meters within [0, ${derivedWidth}]
    "y": number, // start coordinate y in meters within [0, ${derivedLength}]
    "width": number, // room width in meters
    "height": number, // room height in meters
    "floor": number // floor number (from 1 to ${floors})
  }>
}

Requirements context:
- Do NOT overlap rooms excessively
- Ensure total boundaries are withing lot size width of ${derivedWidth} m and length of ${derivedLength} m.
- Ensure rooms align logically like an architect drew it (e.g., bedrooms, bathrooms, living rooms adjacent or grouped).
- Output ONLY the raw JSON block. No backticks (\`\`\`json), no custom preamble, no commentary.`;

    const promptPayload = {
      model: configKieModel,
      messages: [
        {
          role: "system",
          content: "You are an expert Indonesian-English CAD generative architect specializing in residential floor plan zoning. You must output ONLY a valid raw JSON object, without backticks, without formatting blocks."
        },
        {
          role: "user",
          content: architecturalPrompt
        }
      ],
      temperature: 0.35,
    };

    const reqStr = JSON.stringify(promptPayload, null, 2);
    setKieRawRequest(reqStr);
    addLog('Payload JSON Permintaan disusun.');

    // Loading stages simulation
    const stages = [
      { progress: 20, status: 'Menyusun koordinat grid pembatas lahan...' },
      { progress: 40, status: `Mengirim permintaan ke model ${configKieModel}...` },
      { progress: 60, status: 'Menunggu respon streaming & parsing parameter fungsional...' },
      { progress: 80, status: 'Menyinkronkan penataan ruangan & elevations CAD...' },
    ];

    let currentStageIndex = 0;
    const progressInterval = setInterval(() => {
      if (currentStageIndex < stages.length) {
        const stage = stages[currentStageIndex];
        setKieProgress(stage.progress);
        setKieStatusMsg(stage.status);
        addLog(stage.status);
        currentStageIndex++;
      } else {
        clearInterval(progressInterval);
      }
    }, 450);

    // Wait a brief moment to show logs and step through loading elegantly
    await new Promise(resolve => setTimeout(resolve, 1800));

    // True Fetch API or Simulation handler trigger
    if (useKieSimulation || !configKieKey) {
      clearInterval(progressInterval);
      addLog('--- KIE.AI LAYOUT GENERATION SIMULATED ---');
      addLog('Menggunakan simulasi internal nano-banana karena mode simulasi aktif atau KIE API Key belum dikonfigurasi.');
      
      const simulatedImageUrl = 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=800';

      const finalLayout = {
        lotWidth: derivedWidth,
        lotLength: derivedLength,
        totalLotArea: derivedWidth * derivedLength,
        warningMessage: 'Gambar denah simulasi model nano-banana-pro berhasil ditampilkan otomatis.',
        imageUrl: simulatedImageUrl,
        layoutResult: [],
      };

      const resObj = {
        id: "task-nanobanana-sim-" + Math.random().toString(36).substr(2, 9),
        status: "success",
        taskResult: {
          images: [
            {
              url: simulatedImageUrl
            }
          ]
        }
      };

      setKieRawResponse(JSON.stringify(resObj, null, 2));
      setAiGeneratedLayout(finalLayout);

      // Persist generated layout back to main state callbacks
      onCompleteFloorPlan({
        landAreaSqm: parsedArea,
        floors,
        roomsConfig: roomQuantities,
        layoutResult: [],
      }, {
        imageUrl: simulatedImageUrl,
        styleName: styleLabelDisplay,
        promptUsed: architecturalPrompt
      });

      setKieProgress(100);
      setKieStatusMsg('Generasi AI Selesai Sukses (Simulasi)!');
      addLog('Gambar Denah AI (Simulasi) berhasil dimuat dan disinkronkan ke kanvas CAD!');
      setKieLoading(false);
    } else {
      clearInterval(progressInterval);
      // All three models on kie.ai (z-image, gpt-image-1.5, nano-banana-2) are visual generation task models
      const isTaskModel = configKieModel.toLowerCase().includes('banana') || 
                          configKieModel.toLowerCase().includes('z-image') || 
                          configKieModel.toLowerCase().includes('gpt-image') || 
                          configKieUrl.toLowerCase().includes('jobs') || 
                          configKieUrl.toLowerCase().includes('task');

      if (isTaskModel) {
        try {
          addLog(`Mendeteksi model asinkron untuk gambar/denah (${configKieModel}). Membuka kanal Tugas...`);
          
          // Clean & format URLs
          let createUrl = configKieUrl.trim();
          if (!createUrl.endsWith('/jobs/createTask') && !createUrl.endsWith('/jobs/createTask/')) {
            createUrl = createUrl.replace(/\/+$/, '') + '/jobs/createTask';
          }
          
          addLog(`Mengirim request pekerjaan baru (createTask) ke URL: ${createUrl}`);
          
          const roomListText = selectedRooms.map(r => `${r.count}x ${r.name}`).join(', ');
          
          // Tailor prompts to fit optimal style for each model to get best results (Z image vs GPT 1.5 vs Nano Banana)
          let imageGenerationPrompt = '';
          if (configKieModel === 'z-image') {
            imageGenerationPrompt = `A high-precision, premium quality 2D CAD civil engineering blueprint architectural floor plan draft. Denah Rumah Tinggal for a ${floorWord} house of style "${styleLabelDisplay}" on a ${derivedWidth}x${derivedLength} meter lot (${parsedArea} sqm), with room requirements: ${roomListText}. 
Technical drawing specifications: clean thin black lines on solid white paper background (gambar kerja sipil), top-down orthographic blueprint projection, 100% flat 2D layout, professional grid axes lines, coordinate designator circles, wall thickness hatchings, door swings, window alignments, and Indonesian architectural labels (Kamar Utama, R. Keluarga, Dapur, Teras, Carport, Taman). Photorealistic drawing clarity, high contrast, clean vectors, zero perspective, zero 3D rendering elements, no colors, no shading gradients, pristine architectural print.`;
          } else if (configKieModel === 'gpt-image-1.5') {
            imageGenerationPrompt = `Please generate a formal, highly detailed 2D professional architectural blueprint floor plan representing a "Denah Rumah Tinggal" for a ${floorWord} home. 
The house is designed in a ${styleLabelDisplay} style and is situated on a land lot of ${derivedWidth} meters wide by ${derivedLength} meters long, equaling a total of ${parsedArea} square meters.
The designated rooms and counts are: ${roomListText}.
Requirements for drawing: Present this exclusively as a 2D top-down flat floor plan draft. Draw with clean, solid thin black outline lines on a plain solid white background. It must feature proper room zoning layout with standard door swings, window alignments, and clear room labels. Use standard Indonesian architectural terms: Kamar Utama, R. Keluarga, Dapur, Teras, Carport, Taman. Do not include any 3D perspectives, custom colors, gradients, or shadows.`;
          } else {
            imageGenerationPrompt = `2D CAD engineering coordinate blueprint floor plan of "Denah Rumah Tinggal" for a ${floorWord} ${styleLabelDisplay} house, lot size ${derivedWidth}x${derivedLength}m (${parsedArea} sqm). 
Rooms: ${roomListText}. 
Style: Minimalist black lines on pure white paper (gambar kerja sipil / teknik standar sipil). Top-down flat 2D layout, orthographic projection, grid axes layout, door openings, clear room labels in Indonesian (Kamar Utama, R. Keluarga, Dapur, Teras, Carport, Taman). High contrast, technical drafting, strictly flat, no 3D, no perspective, no color textures, no shadows.`;
          }

          addLog(`Menyusun spesifikasi prompt gambar kerja 2D untuk model ${configKieModel}...`);

          // Request body format matching the createTask specifications for models on kie.ai
          const imagePayload = {
            model: configKieModel,
            input: {
              prompt: imageGenerationPrompt,
              aspect_ratio: "4:3",
              num_outputs: 1
            }
          };
          
          setKieRawRequest(JSON.stringify(imagePayload, null, 2));

          const reqHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
          };
          // Only pass Authorization header if a local API key is typed in the client.
          // Otherwise, omit it so the server proxy falls back to VITE_KIE_API_KEY from env.
          if (configKieKey && configKieKey.trim() !== '') {
            reqHeaders['Authorization'] = `Bearer ${configKieKey.trim()}`;
          }

          const response = await fetch(createUrl, {
            method: 'POST',
            headers: reqHeaders,
            body: JSON.stringify(imagePayload),
          });

          if (!response.ok) {
            throw new Error(`Kie AI createTask mengembalikan status HTTP ${response.status}: ${response.statusText}`);
          }

          const taskData = await response.json();
          setKieRawResponse(JSON.stringify(taskData, null, 2));

          // Handle API-level error returned with 200 HTTP status (e.g. invalid API key / insufficient balance)
          if (taskData.code && taskData.code !== 200) {
            const apiErrorMsg = taskData.msg || taskData.message || 'Terjadi kesalahan pada Kie.ai API';
            addLog(`❌ Kie.ai API mengembalikan error: [${taskData.code}] ${apiErrorMsg}`);
            throw new Error(`Kie.ai API Error [${taskData.code}]: ${apiErrorMsg}`);
          }

          const taskId = taskData.task_id || taskData.id || taskData.taskId || taskData.data?.taskId;
          
          if (!taskId) {
            addLog(`❌ Gagal mengambil Task ID dari response data: ${JSON.stringify(taskData)}`);
            throw new Error('Permintaan terdaftar namun tidak mendapati Task ID pada paket data kembali.');
          }

          addLog(`Pekerjaan terdaftar berhasil! Melokalisasi referensi Task ID: ${taskId}`);

          // Determine accurate polling URL
          let queryUrl = createUrl.replace('/jobs/createTask', '/jobs/queryTask');
          if (!queryUrl.endsWith('/jobs/queryTask')) {
            queryUrl = queryUrl.replace(/\/+$/, '') + '/jobs/queryTask';
          }
          queryUrl = `${queryUrl}?taskId=${taskId}`;

          addLog(`Memulai siklus pelacakan status (polling) berkala pada alamat target: ${queryUrl}`);
          
          let isCompleted = false;
          let attempts = 0;
          const maxAttempts = 30; // Max polling limit ~90 seconds
          let finalImgUrl = '';

          // Helper to search recursively for any image/url inside response JSON as fallback
          const findImageUrlInObject = (obj: any): string | null => {
            if (!obj) return null;
            if (typeof obj === 'string') {
              const isUrl = obj.startsWith('http://') || obj.startsWith('https://');
              if (isUrl) {
                const lower = obj.toLowerCase();
                // Avoid capturing endpoints URLs
                if (lower.includes('/api/v1') || lower.includes('/api/v2') || lower.includes('createtask') || lower.includes('querytask')) {
                  return null;
                }
                // Match image extensions or common media paths or simply valid urls
                if (lower.match(/\.(jpeg|jpg|gif|png|webp|svg)/) || lower.includes('image') || lower.includes('results') || lower.includes('outputs') || lower.includes('storage') || lower.includes('generation') || lower.includes('file')) {
                  return obj;
                }
                return obj;
              }
            }
            if (typeof obj === 'object') {
              for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                  const val = obj[key];
                  const res = findImageUrlInObject(val);
                  if (res) return res;
                }
              }
            }
            return null;
          };

          while (!isCompleted && attempts < maxAttempts) {
            attempts++;
            setKieProgress(Math.min(95, 15 + attempts * 3));
            setKieStatusMsg(`Menunggu hasil denah AI... (Langkah ${attempts}/${maxAttempts})`);
            addLog(`[Polling KIE.AI #${attempts}] Mengambil status aktual tugas...`);

            const queryHeaders: Record<string, string> = {};
            if (configKieKey && configKieKey.trim() !== '') {
              queryHeaders['Authorization'] = `Bearer ${configKieKey.trim()}`;
            }

            const queryRes = await fetch(queryUrl, {
              method: 'GET',
              headers: queryHeaders
            });

            if (queryRes.ok) {
              const queryData = await queryRes.json();
              setKieRawResponse(JSON.stringify(queryData, null, 2));

              if (queryData.code && queryData.code !== 200) {
                const apiErrorMsg = queryData.msg || queryData.message || 'Gagal mengambil status';
                addLog(`❌ Polling KIE.AI mengembalikan error: [${queryData.code}] ${apiErrorMsg}`);
                throw new Error(`Kie.ai Polling Error [${queryData.code}]: ${apiErrorMsg}`);
              }
              
              const currentStatus = (queryData.status || queryData.data?.status || '').toLowerCase();
              addLog(`Status Pekerjaan: [${currentStatus || 'pemrosesan'}]`);

              // Resilient success verification (supporting successful, succeeded, success, completed, done statuses)
              const isSuccessStatus = ['success', 'completed', 'succeeded', 'done', 'finished'].includes(currentStatus);
              const hasTaskResult = !!(queryData.taskResult || queryData.results || queryData.data?.taskResult || queryData.data?.results || queryData.data?.images);

              if (isSuccessStatus || hasTaskResult) {
                isCompleted = true;
                
                // Deep parsing across multiple possible locations in queryData structure
                finalImgUrl = queryData.taskResult?.images?.[0]?.url || 
                              queryData.results?.[0] || 
                              queryData.taskResult?.image || 
                              queryData.data?.images?.[0]?.url ||
                              queryData.data?.results?.[0] ||
                              queryData.data?.taskResult?.images?.[0]?.url ||
                              queryData.data?.taskResult?.image ||
                              queryData.data?.url ||
                              queryData.data?.image;
                
                if (!finalImgUrl) {
                  finalImgUrl = queryData.taskResult?.url || queryData.url;
                }
                
                // If url is still not found in standard paths, run recursive object crawler to find any generated image url link
                if (!finalImgUrl) {
                  const fallbackFound = findImageUrlInObject(queryData);
                  if (fallbackFound) {
                    finalImgUrl = fallbackFound;
                    addLog(`[Sistem] Tautan gambar berhasil diekstraksi via Crawler fallback: ${finalImgUrl}`);
                  }
                }
                
                if (finalImgUrl) {
                  addLog(`Gambar denah arsitektur berhasil didapat! Tautan URL: ${finalImgUrl}`);
                } else {
                  addLog('[Peringatan] Status sukses, namun URL gambar tidak terbaca di jalur standar.');
                }
              } else if (currentStatus === 'fail' || currentStatus === 'failed') {
                throw new Error('Alur pengerjaan tugas dihentikan/gagal oleh server kie.ai.');
              }
            } else {
              addLog(`[Catatan] HTTP Error status ${queryRes.status}. Mencoba kembali pada ketukan berikutnya...`);
            }

            if (!isCompleted) {
              // Wait 3 seconds
              await new Promise(resolve => setTimeout(resolve, 3000));
            }
          }

          if (!finalImgUrl) {
            throw new Error('Batas waktu tunggu habis atau alamat gambar hasil gagal diakses.');
          }

          const generatedPlan = {
            lotWidth: derivedWidth,
            lotLength: derivedLength,
            totalLotArea: derivedWidth * derivedLength,
            warningMessage: 'Gambar denah ruangan berhasil digenerasikan oleh kecerdasan model ' + configKieModel,
            imageUrl: finalImgUrl,
            layoutResult: [],
          };

          setAiGeneratedLayout(generatedPlan);

          onCompleteFloorPlan({
            landAreaSqm: parsedArea,
            floors,
            roomsConfig: roomQuantities,
            layoutResult: [],
          }, {
            imageUrl: finalImgUrl,
            styleName: styleLabelDisplay,
            promptUsed: imageGenerationPrompt
          });

          setKieProgress(100);
          setKieStatusMsg('Generasi AI Selesai Sukses!');
          addLog('Tata letak ruangan berbasis gambar berhasil disinkronkan ke kanvas CAD!');

        } catch (err: any) {
          addLog(`[ERROR] Gagal memanggil API KIE: ${err.message}`);
          setKieError(err.message || 'Gagal tersambung dengan API KIE.AI. Periksa koneksi CORS atau validitas kunci Anda.');
        } finally {
          setKieLoading(false);
        }
      } else {
        // Fallback standard text-based Chat Completion output
        try {
          addLog(`Memulai request HTTP POST ke client API endpoint: ${configKieUrl}/chat/completions`);
          const response = await fetch(`${configKieUrl}/chat/completions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${configKieKey}`,
            },
            body: reqStr,
          });

          if (!response.ok) {
            throw new Error(`API returned HTTP ${response.status}: ${response.statusText}`);
          }

          const data = await response.json();
          setKieRawResponse(JSON.stringify(data, null, 2));
          addLog('Menerima respon JSON dari kie.ai!');

          const aiContent = data.choices?.[0]?.message?.content || '{}';
          addLog('Parsing content string ke JSON blueprint...');

          const cleanedStr = aiContent.replace(/```json/gi, '').replace(/```/g, '').trim();
          const parsedLayoutArray = parseLayoutResult(cleanedStr);

          if (parsedLayoutArray && parsedLayoutArray.length > 0) {
            const generatedPlan = {
              lotWidth: derivedWidth,
              lotLength: derivedLength,
              totalLotArea: derivedWidth * derivedLength,
              warningMessage: 'Tata letak ruangan dihasilkan secara generatif berbasis model ' + configKieModel,
              layoutResult: parsedLayoutArray,
            };

            setAiGeneratedLayout(generatedPlan);
            
            onCompleteFloorPlan({
              landAreaSqm: parsedArea,
              floors,
              roomsConfig: roomQuantities,
              layoutResult: parsedLayoutArray,
            }, aiResult);

            setKieProgress(100);
            setKieStatusMsg('Generasi AI Selesai Sukses!');
            addLog('Tata letak AI berhasil dipetakan ke kanvas CAD!');
          } else {
            throw new Error('Hasil parser JSON kosong atau layoutResult tidak valid.');
          }

        } catch (err: any) {
          addLog(`[ERROR] Gagal memanggil AI: ${err.message}`);
          setKieError(err.message || 'Terjadi kesalahan saat memproses API key atau koneksi CORS.');
        } finally {
          setKieLoading(false);
        }
      }
    }
  };

  const parseLayoutResult = (jsonStr: string) => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && Array.isArray(parsed.layoutResult)) {
        return parsed.layoutResult as RoomLayoutResult[];
      }
      if (parsed && Array.isArray(parsed)) {
        return parsed as RoomLayoutResult[];
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  // Mocking AI perspectives 3D render simulation
  const handleGenerateAiRender = () => {
    setAiResult(null);
    setAiLoading(true);
    setAiProgress(0);
    setAiStatusMessage('Menganalisis koefisien dinding & zoning ruang...');

    const messages = [
      'Menyusun kerangka fasad arsitektur modern tropis...',
      'Merekatkan materialitas bertekstur beton ekspos tebal...',
      'Mengintegrasikan sirkulasi pencahayaan sore (golden hour)...',
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
          
          const styleTemplate = STYLE_TAGS.find(s => s.id === selectedStyle);
          const mockImages: Record<string, string> = {
            minimalist: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
            tropical: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
            industrial: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
            classic: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
          };

          const newRender = {
            imageUrl: mockImages[selectedStyle] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
            styleName: styleTemplate?.label || 'Minimalis Modern',
            promptUsed: `${styleTemplate?.prompt}${notes ? ', dengan catatan: ' + notes : ''}. Architectural rendering, realistic materials, octane render style, photorealistic.`,
          };

          setAiResult(newRender);

          // Force sync to App storage so consultation drawer is pre-populated
          if (layout) {
            onCompleteFloorPlan(
              {
                landAreaSqm: parseFloat(areaSqm) || 120,
                floors,
                roomsConfig: roomQuantities,
                layoutResult: layout.layoutResult,
              },
              newRender
            );
          }
        }
        return next;
      });
    }, 120);
  };

  const handleConsultWithPlan = () => {
    if (!layout || !calculatedResult) return;
    
    onCompleteFloorPlan(
      {
        landAreaSqm: parseFloat(areaSqm) || 120,
        floors,
        roomsConfig: roomQuantities,
        layoutResult: layout.layoutResult,
      },
      aiResult
    );
    onNavigate('konsultasi');
  };

  const resetCalculator = () => {
    setStep(1);
    setBuildingType('new');
    setAreaSqm('');
    setLotWidth(8);
    setFloors(1);
    setSpecification('medium');
    setSelectedAddons([]);
    setExecutionMethod('contractor');
    setCalculatedResult(null);
    setValidationError('');
    setAiResult(null);
    setNotes('');
  };

  // Color mapping per room category for the vector CAD-like blueprint
  const getRoomColorClasses = (roomId: string) => {
    if (roomId.startsWith('bedroom')) {
      return { fill: 'fill-[#e3dbc5]', stroke: 'stroke-[#928157]', text: 'text-[#564828]', bg: 'bg-[#e3dbc5]' };
    }
    if (roomId.startsWith('kid_room')) {
      return { fill: 'fill-[#eedbbb]', stroke: 'stroke-[#9c773b]', text: 'text-[#61451a]', bg: 'bg-[#eedbbb]' };
    }
    if (roomId.startsWith('bathroom')) {
      return { fill: 'fill-[#d7e5e3]', stroke: 'stroke-[#57817b]', text: 'text-[#1e514a]', bg: 'bg-[#d7e5e3]' };
    }
    if (roomId.startsWith('carport')) {
      return { fill: 'fill-[#e3e3df]', stroke: 'stroke-[#7c7c77]', text: 'text-[#383834]', bg: 'bg-[#e3e3df]' };
    }
    if (roomId.startsWith('garden')) {
      return { fill: 'fill-[#dfebd9]', stroke: 'stroke-[#678e56]', text: 'text-[#2e511e]', bg: 'bg-[#dfebd9]' };
    }
    if (roomId.startsWith('kitchen')) {
      return { fill: 'fill-[#ecdacf]', stroke: 'stroke-[#a96645]', text: 'text-[#693417]', bg: 'bg-[#ecdacf]' };
    }
    return { fill: 'fill-[#f2eeea]', stroke: 'stroke-[#9a9590]', text: 'text-[#2e2e2c]', bg: 'bg-[#f2eeea]' };
  };

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

  // Dimensions of the coordinate canvas SVG
  const canvasW = 800;
  const canvasH = 580;
  const kopW = 160;
  const drawAreaW = canvasW - kopW - 20; // 620px
  const drawAreaH = canvasH - 20; // 560px
  const drawBoxW = drawAreaW - 120;
  const drawBoxH = drawAreaH - 120;

  const activeLayout = (blueprintEngine === 'kie-ai' && aiGeneratedLayout) ? aiGeneratedLayout : layout;

  const scaleX = activeLayout ? (drawBoxW / activeLayout.lotWidth) : 40;
  const scaleY = activeLayout ? (drawBoxH / activeLayout.lotLength) : 40;
  const scaleVal = Math.min(scaleX, scaleY, 60);

  const drawW = activeLayout ? (activeLayout.lotWidth * scaleVal) : 300;
  const drawH = activeLayout ? (activeLayout.lotLength * scaleVal) : 400;
  const startX = 10 + 60 + (drawBoxW - drawW) / 2;
  const startY = 10 + 50 + (drawBoxH - drawH) / 2;

  const stepsMeta = [
    { title: 'Jenis Proyek' },
    { title: 'Ukuran & Tinggi' },
    { title: 'Material & Ruang' },
    { title: 'Tambahan Opsional' },
  ];

  return (
    <article className="max-w-7xl mx-auto px-6 py-16 text-brand-black" id="rab-calculator-container">
      {/* HEADER STATEMENT (Descriptive text easily read by CMS editors) */}
      <header className="mb-14 text-center" data-cms-key="rab-header-block">
        <span className="text-[10px] uppercase tracking-[0.25em] text-brand-orange font-bold italic mb-4 block">
          (Akurasi Finansial & Tata Lahan AI)
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal leading-tight">
          Kalkulator RAB & Denah AI Interaktif
        </h1>
        <p className="text-xs text-brand-grey max-w-xl mx-auto mt-2">
          Satu alur mulus untuk merancang anggaran bangun, memetakan distribusi ruang arsitektur secara riil, hingga merender estimasi visual perspektif 3D.
        </p>
      </header>

      {step <= 4 ? (
        <section className="max-w-4xl mx-auto border border-brand-black/15 bg-brand-cream/40 p-6 md:p-10 rounded-xs flex flex-col shadow-xs" id="rab-interactive-stepper">
          {/* STEP INDICATOR HEADER */}
          <header className="flex flex-col gap-4 mb-10 border-b border-brand-black/10 pb-6 w-full" id="step-indicators">
            <div className="flex justify-between items-center w-full">
              {stepsMeta.map((sMeta, idx) => {
                const stepNum = idx + 1;
                const isActive = step === stepNum;
                const isCompleted = step > stepNum;

                return (
                  <div key={idx} className="flex flex-col items-center flex-1 relative last:flex-initial">
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
          </header>

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
                    Pekerjaan renovasi menghemat anggaran konstruksi utama, sedangkan pembangunan baru merancang penuh dari pondasi nol.
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
                      Perbaikan struktur minor-mayor, peninggian lantai, bongkaran, maupun perluasan ruang samping.
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
                    Tentukan dimensi luas tanah &amp; jumlah lantai konstruksi:
                  </h3>
                  <p className="text-xs text-brand-grey">
                    Koefisien pondasi dan tebal struktur kolom dinaikkan secara berjenjang seiring ketinggian bangunan total.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
                  {/* Estimasi Luas */}
                  <div className="sm:col-span-6 flex flex-col gap-2">
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

                  {/* Lebar Lahan */}
                  <div className="sm:col-span-6 flex flex-col gap-2">
                    <label htmlFor="lotWidth" className="text-xs uppercase tracking-wider font-semibold text-brand-dark-grey">
                      Lebar Tanah Depan Lahan (Meter)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        id="lotWidth"
                        value={lotWidth}
                        onChange={(e) => setLotWidth(Math.max(3, parseInt(e.target.value) || 0))}
                        placeholder="Misal: 8"
                        min="3"
                        max="100"
                        className="w-full bg-brand-white border border-brand-black/15 px-4 py-3 text-sm focus:border-brand-orange focus:outline-none rounded-xs pr-16 font-mono"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-brand-grey uppercase">
                        Meter
                      </span>
                    </div>
                  </div>

                  {/* LANTAI SELECT CHIPS */}
                  <div className="sm:col-span-12 flex flex-col gap-2 mt-2">
                    <span className="text-xs uppercase tracking-wider font-semibold text-brand-dark-grey">
                      Ketinggian Jumlah Lantai Konstruksi
                    </span>
                    <div className="grid grid-cols-4 gap-3">
                      {[1, 2, 3, 4].map((fl) => (
                        <button
                          key={fl}
                          type="button"
                          onClick={() => setFloors(fl)}
                          className={`py-3 text-xs font-mono font-bold border transition-all rounded-xs focus:outline-none cursor-pointer ${
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
                className="flex flex-col gap-8"
                id="step-content-3"
              >
                <div>
                  <h3 className="font-serif text-lg font-medium text-brand-black mb-1">
                    Atur Standar Bahan Material &amp; Kebutuhan Kamar Utama:
                  </h3>
                  <p className="text-xs text-brand-grey">
                    Kombinasi material finishing interior dan total sebaran kamar menjadi penentu krusial kalkulasi anggaran serta blueprint zonasi.
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Standar Finishing */}
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-brand-orange">
                      [1] Pilih Grade Tingkatan Material
                    </span>
                    <div className="flex flex-col gap-3">
                      {/* STANDARD */}
                      <button
                        onClick={() => setSpecification('standard')}
                        className={`flex flex-col md:flex-row text-left p-4 border gap-4 transition-all rounded-xs cursor-pointer ${
                          specification === 'standard'
                            ? 'border-brand-orange bg-brand-orange/5 ring-1 ring-brand-orange'
                            : 'border-brand-black/15 bg-brand-white hover:border-brand-black'
                        }`}
                        id="spec-select-standard"
                      >
                        <div className="md:w-1/3">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider block text-brand-grey">
                            Grade C
                          </span>
                          <span className="text-sm font-bold text-brand-black uppercase tracking-wider block mt-0.5">
                            Sederhana / Standar
                          </span>
                          <span className="text-xs text-brand-orange font-bold mt-1 block">
                            {formatIDR(PRICE_PER_SQM.standard)} / m²
                          </span>
                        </div>
                        <div className="md:w-2/3 md:border-l md:border-brand-black/10 md:pl-4 text-[11px] text-brand-dark-grey leading-relaxed">
                          Lantai keramik lokal 40x40, dinding acian cat standar, atap baja ringan &amp; genteng beton lokal, sanitasi umum fungsional.
                        </div>
                      </button>

                      {/* MEDIUM */}
                      <button
                        onClick={() => setSpecification('medium')}
                        className={`flex flex-col md:flex-row text-left p-4 border gap-4 transition-all rounded-xs cursor-pointer ${
                          specification === 'medium'
                            ? 'border-brand-orange bg-brand-orange/5 ring-1 ring-brand-orange'
                            : 'border-brand-black/15 bg-brand-white hover:border-brand-black'
                        }`}
                        id="spec-select-medium"
                      >
                        <div className="md:w-1/3">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider block text-brand-orange">
                            Grade B · Rekomendasi
                          </span>
                          <span className="text-sm font-bold text-brand-black uppercase tracking-wider block mt-0.5">
                            Menengah / Eksekutif
                          </span>
                          <span className="text-xs text-brand-orange font-bold mt-1 block">
                            {formatIDR(PRICE_PER_SQM.medium)} / m²
                          </span>
                        </div>
                        <div className="md:w-2/3 md:border-l md:border-brand-black/10 md:pl-4 text-[11px] text-brand-dark-grey leading-relaxed">
                          Lantai homogenous granite tile 60x60, cat exterior tahan cuaca, kusen alumunium tebal, atap baja ringan bergaransi, saniter Toto.
                        </div>
                      </button>

                      {/* PREMIUM */}
                      <button
                        onClick={() => setSpecification('premium')}
                        className={`flex flex-col md:flex-row text-left p-4 border gap-4 transition-all rounded-xs cursor-pointer ${
                          specification === 'premium'
                            ? 'border-brand-orange bg-brand-orange/5 ring-1 ring-brand-orange'
                            : 'border-brand-black/15 bg-brand-white hover:border-brand-black'
                        }`}
                        id="spec-select-premium"
                      >
                        <div className="md:w-1/3">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider block text-brand-orange font-semibold">
                            Grade A
                          </span>
                          <span className="text-sm font-bold text-brand-black uppercase tracking-wider block mt-0.5">
                            Mewah / Lux Premium
                          </span>
                          <span className="text-xs text-brand-orange font-bold mt-1 block">
                            {formatIDR(PRICE_PER_SQM.premium)} / m²
                          </span>
                        </div>
                        <div className="md:w-2/3 md:border-l md:border-brand-black/10 md:pl-4 text-[11px] text-brand-dark-grey leading-relaxed">
                          Lantai marmer slab besar / parket jati solid, cat Jotun/Dulux premium, kusen jendela uPVC kedap, smart home system, saniter Kohler.
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Kebutuhan Ruang (Interactive Counters inside RAB view) */}
                  <div className="flex flex-col gap-3 pt-4 border-t border-brand-black/10">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-brand-orange">
                      [2] Tentukan Kebutuhan Ruangan &amp; Kamar Tidur
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[280px] overflow-y-auto pr-1">
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
                                fungsional minimal {room.minAreaSqm} m²
                              </span>
                            </div>

                            <div className="flex items-center gap-2.5">
                              <button
                                type="button"
                                onClick={() => handleRoomCountChange(room.id, -1)}
                                className="w-7 h-7 hover:bg-brand-red/10 rounded-full border border-brand-black/10 flex items-center justify-center hover:border-brand-red text-brand-grey hover:text-brand-red transition-all focus:outline-none cursor-pointer"
                                id={`btn-minus-${room.id}`}
                              >
                                <Minus className="w-3" />
                              </button>
                              <span className="w-4 text-center text-xs font-mono font-bold">
                                {count}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRoomCountChange(room.id, 1)}
                                className="w-7 h-7 hover:bg-brand-orange/15 rounded-full border border-brand-black/10 flex items-center justify-center hover:border-brand-orange text-brand-grey hover:text-brand-orange transition-all focus:outline-none cursor-pointer"
                                id={`btn-plus-${room.id}`}
                              >
                                <Plus className="w-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
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
                    Tambahkan fasilitas penunjang khusus (Opsional):
                  </h3>
                  <p className="text-xs text-brand-grey">
                    Beri tanda centang pada item pekerjaan sipil di bawah untuk memasukkan biaya eksternal tambahan ke dalam estimasi.
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
                        className={`flex items-start text-left p-4 border rounded-xs transition-all gap-4 focus:outline-none cursor-pointer ${
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
            <div className="mt-6 flex items-start gap-2 bg-brand-red/10 border border-brand-red/15 text-brand-red text-xs p-3.5 rounded-xs animate-pulse" id="rab-validation-error">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {/* ACTION BUTTON RAILS */}
          <div className="mt-8 pt-6 border-t border-brand-black/10 flex justify-between items-center bg-transparent">
            <button
              type="button"
              onClick={handlePrevStep}
              className={`text-xs uppercase tracking-widest text-brand-grey hover:text-brand-black font-semibold flex items-center gap-2 transition-all focus:outline-none py-2 cursor-pointer ${
                step === 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
              id="rab-prev-button"
            >
              <ArrowLeft className="w-4 h-4" /> Kembali
            </button>

            <button
              type="button"
              onClick={handleNextStep}
              className="bg-brand-orange text-brand-white hover:bg-brand-orange-hover px-10 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] transition-all flex items-center gap-2 select-none cursor-pointer"
              id="rab-next-button"
            >
              {step === 4 ? (
                <>
                  Hitung Estimasi &amp; Gambar Denah <Calculator className="w-4 h-4" />
                </>
              ) : (
                <>
                  Lanjut <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </section>
      ) : (
        /* UNIFIED RESULTS INTERACTION BOARD (step === 5) */
        calculatedResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            id="rab-results-view"
          >
            {/* LEFT-COLUMN: CALCULATIONS, METRICS, AND FORMULAS */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* LARGE ESTIMATED COST BANNER */}
              <div className="bg-[#131110] text-brand-white p-6 md:p-8 text-center border border-brand-white/10 rounded-xs relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 bg-[linear-gradient(45deg,#fff_12.5%,transparent_12.5%,transparent_50%,#fff_50%,#fff_62.5%,transparent_62.5%,transparent_100%)] bg-[size:15px_15px]" />
                
                <span className="text-[9px] uppercase tracking-[0.2em] text-brand-orange font-bold italic mb-3 block">
                  (Rencana Anggaran Biaya Kasar)
                </span>

                <div className="flex flex-col gap-1 justify-center items-center py-2">
                  <span className="font-serif text-2xl sm:text-3xl font-semibold text-brand-white">{formatIDR(calculatedResult.estimatedMin)}</span>
                  <span className="text-brand-grey text-xs font-sans font-light uppercase tracking-widest my-0.5">s.d</span>
                  <span className="font-serif text-2xl sm:text-3xl font-semibold text-[#E15A33]">{formatIDR(calculatedResult.estimatedMax)}</span>
                </div>

                <div className="mt-5 text-brand-white/40 text-[9px] uppercase font-mono tracking-[0.15em] flex flex-wrap justify-center gap-3 border-t border-brand-white/10 pt-5">
                  <span>Sipil: {buildingType === 'new' ? 'Baru' : 'Renovasi'}</span>
                  <span>•</span>
                  <span>Luas: {areaSqm} m²</span>
                  <span>•</span>
                  <span>Tinggi: {floors} Fl.</span>
                  <span>•</span>
                  <span>Grade: {specification.toUpperCase()}</span>
                </div>
              </div>

              {/* CHOOSE EXECUTION METHOD (CONTRAKTOR VS SWAKELOLA) */}
              <div className="border border-brand-black/10 bg-brand-cream/15 p-5 rounded-xs space-y-3">
                <header>
                  <span className="text-[9px] uppercase tracking-[0.18em] text-brand-orange font-bold font-sans block mb-1">
                    // Metode Eksekusi Pembangunan
                  </span>
                  <h4 className="font-serif text-sm text-brand-black font-semibold">
                    Atur pengawasan pelaksana konstruksi harian:
                  </h4>
                </header>

                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => handleExecutionMethodChange('contractor')}
                    className={`flex flex-col text-left p-3.5 border rounded-xs transition-all cursor-pointer ${
                      executionMethod === 'contractor'
                        ? 'border-brand-orange bg-brand-orange/5 ring-1 ring-brand-orange'
                        : 'border-brand-black/10 bg-brand-white hover:border-brand-black'
                    }`}
                  >
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-[11px] font-bold text-brand-black uppercase tracking-wider">
                        Kontraktor Mitra (Saran - Full Garansi)
                      </span>
                      <span className="text-[9px] font-mono text-brand-orange font-bold">(Tarif)</span>
                    </div>
                    <p className="text-[10px] text-brand-dark-grey leading-relaxed">
                      Layanan garansi struktur 12 bulan penuh, personil K3, pengawas lapangan berlisensi, semen mutu uji lab harian.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleExecutionMethodChange('swakelola')}
                    className={`flex flex-col text-left p-3.5 border rounded-xs transition-all cursor-pointer ${
                      executionMethod === 'swakelola'
                        ? 'border-brand-orange bg-brand-orange/5 ring-1 ring-brand-orange'
                        : 'border-brand-black/10 bg-brand-white hover:border-brand-black'
                    }`}
                  >
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-[11px] font-bold text-brand-black uppercase tracking-wider">
                        Swakelola Mandiri (Tukang Lokal / Hemat)
                      </span>
                      <span className="text-[9px] font-mono text-brand-green font-bold">(-18% Lebih Hemat)</span>
                    </div>
                    <p className="text-[10px] text-brand-dark-grey leading-relaxed">
                      Anda mengoordinasikan pengadaan semen harian, material grosir, serta gaji tukang harian secara mandiri.
                    </p>
                  </button>
                </div>
              </div>

              {/* BREAKDOWN SECTION */}
              <div className="border border-brand-black/10 bg-brand-warm-grey p-5 md:p-6 rounded-xs">
                <header className="border-b border-brand-black/10 pb-3 mb-4 flex items-center justify-between">
                  <span className="font-serif text-sm font-semibold text-brand-black">Rincian Estimasi Per Kategori</span>
                  <span className="text-[9px] font-sans uppercase font-bold text-brand-grey tracking-wider">(Cost Breakdown)</span>
                </header>

                <div className="flex flex-col gap-4">
                  {calculatedResult.breakdown.map((item, index) => (
                    <div key={index} className="flex flex-col gap-1.5" id={`breakdown-item-${index}`}>
                      <div className="flex justify-between items-baseline text-[10px]">
                        <span className="font-semibold text-brand-black">{item.category}</span>
                        <span className="font-mono text-brand-grey">
                          {item.percentage}% —{' '}
                          <span className="text-[#E05C38] font-bold">{formatIDR(item.estimatedCost)}</span>
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-brand-white border border-brand-black/5 rounded-full overflow-hidden relative">
                        <motion.div
                          initial={{ width: '0%' }}
                          animate={{ width: `${item.percentage}%` }}
                          transition={{ duration: 0.85, delay: index * 0.1, ease: 'easeOut' }}
                          className="h-full bg-[#E05C38] rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RUMUS PARAMETER */}
              <div className="border border-brand-black/10 bg-brand-white p-4 rounded-xs text-[10px] text-brand-dark-grey space-y-2">
                <div className="flex justify-between pb-1.5 border-b border-brand-black/5">
                  <span className="font-semibold text-brand-black">Tarif Base per m²</span>
                  <span className="font-mono">{formatIDR(PRICE_PER_SQM[specification])}</span>
                </div>
                <div className="flex justify-between pb-1.5 border-b border-brand-black/5">
                  <span className="font-semibold text-brand-black">Indeks Lantai</span>
                  <span className="font-mono">x{FLOOR_MULTIPLIERS[floors] || 1.0}</span>
                </div>
                {buildingType === 'renovation' && (
                  <div className="flex justify-between pb-1.5 border-b border-brand-black/5 text-brand-orange">
                    <span className="font-semibold">Indeks Hemat Renovasi</span>
                    <span className="font-mono">x{RENOVATION_MULTIPLIER}</span>
                  </div>
                )}
                {selectedAddons.length > 0 && (
                  <div className="flex justify-between pb-1.5 border-b border-brand-black/5">
                    <span className="font-semibold text-brand-black">Pekerjaan Ekstra</span>
                    <span className="font-mono">+{formatIDR(selectedAddons.reduce((sum, k) => sum + (ADDON_COSTS[k]?.cost || 0), 0))}</span>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT-COLUMN: DYNAMIC DRAWING COMPASS & AI RENDERING BLOCKS */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* SVG BLUEPRINT CAD DRAWING CANVAS */}
              {activeLayout && hasRoomsSelected ? (
                <div className="border border-brand-black/15 bg-brand-white p-5 md:p-6 rounded-xs shadow-xs">
                  <header className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 border-b border-brand-black/10 pb-4 mb-5">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-brand-grey block">
                        [Blueprint Tata Letak Ruangan]
                      </span>
                      {floors > 1 && (
                        <div className="flex gap-1 bg-brand-warm-grey p-0.5 rounded-sm">
                          {[...Array(floors)].map((_, i) => {
                            const floorNum = i + 1;
                            return (
                              <button
                                key={i}
                                onClick={() => setCurrentFloorTab(floorNum)}
                                className={`px-2 py-0.5 text-[9px] font-bold font-mono transition-all rounded-xs focus:outline-none cursor-pointer ${
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
                      className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-brand-orange border border-brand-orange/20 px-3 py-1.5 hover:bg-brand-orange/5 transition-all focus:outline-none cursor-pointer"
                      id="btn-shuffle-layout"
                    >
                      <RefreshCw className="w-3" /> Acak Tata Letak
                    </button>
                  </header>

                  {/* CHOOSE ENGINE SELECTOR PANEL */}
                  <div className="mb-5 p-3.5 bg-[#FAF9F5] border border-brand-black/10 rounded-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-1.5 font-bold text-brand-black tracking-wide">
                        <Layers className="w-3.5 h-3.5 text-brand-orange" />
                        <span>ARSITEK ENGINE</span>
                      </div>
                      <p className="text-[10px] text-brand-grey">Kompilasikan denah secara matematis atau minta kecerdasan generatif model {configKieModel}.</p>
                    </div>
                    <div className="flex gap-2 self-start md:self-auto">
                      <button
                        type="button"
                        onClick={() => setBlueprintEngine('procedural')}
                        className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                          blueprintEngine === 'procedural'
                            ? 'bg-brand-black text-[#F8F6F0] border-brand-black'
                            : 'bg-white text-brand-grey border-brand-black/15 hover:text-brand-black hover:border-brand-black'
                        }`}
                      >
                        Prosedural (Instan)
                      </button>
                      <button
                        type="button"
                        onClick={() => setBlueprintEngine('kie-ai')}
                        className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-all border flex items-center gap-1 cursor-pointer ${
                          blueprintEngine === 'kie-ai'
                            ? 'bg-[#E05C38] text-white border-[#E05C38] shadow-xs'
                            : 'bg-white text-brand-grey border-brand-black/15 hover:text-brand-black hover:border-brand-black'
                        }`}
                      >
                        <Sparkles className="w-3 h-3 fill-current animate-pulse text-white" /> Gen-AI (kie.ai)
                      </button>
                    </div>
                  </div>

                  {/* KIE.AI MODEL PARAMETERS CONFIG PANEL (If KIE AI is selected) */}
                  {blueprintEngine === 'kie-ai' && (
                    <div className="mb-5 p-4 border border-dashed border-brand-orange/30 bg-[#FDFCFA] rounded-xs space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] tracking-wider uppercase font-mono font-bold text-brand-orange flex items-center gap-1.5">
                          <RefreshCw className="w-3 animate-spin text-brand-orange" /> Kie.ai API Engine: {configKieModel}
                        </span>
                        
                        <label className="flex items-center gap-1.5 text-[10px] font-semibold text-brand-grey cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={useKieSimulation}
                            onChange={(e) => setUseKieSimulation(e.target.checked)}
                            className="rounded-xs border-brand-black/20 text-brand-orange focus:ring-brand-orange mr-1"
                          />
                          Simulasikan Respon AI (Offline Pengembang)
                        </label>
                      </div>

                      {/* Config Fields Toggle Drawer */}
                      <details className="group border-t border-brand-black/10 pt-3">
                        <summary className="text-[10px] font-bold tracking-widest uppercase text-brand-grey cursor-pointer flex items-center gap-1 select-none hover:text-brand-black">
                          [+] LIHAT PARAMETER &amp; CREDENTIALS API
                        </summary>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-mono text-brand-grey">API ENDPOINT URL</label>
                            <input
                              type="text"
                              value={configKieUrl}
                              onChange={(e) => setConfigKieUrl(e.target.value)}
                              className="bg-white border border-brand-black/15 p-2 text-xs font-mono rounded-xs focus:ring-brand-orange focus:border-brand-orange"
                              placeholder="/api/v1"
                              autoComplete="off"
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-mono text-brand-grey">MODEL GENERATIF (KIE.AI)</label>
                            <select
                              value={configKieModel}
                              onChange={(e) => setConfigKieModel(e.target.value)}
                              className="bg-white border border-brand-black/15 p-2 text-xs font-sans rounded-xs focus:ring-brand-orange focus:border-brand-orange cursor-pointer h-[34px]"
                            >
                              <option value="z-image">Z image (qwen)</option>
                              <option value="gpt-image-1.5">gpt 1.5</option>
                              <option value="nano-banana-2">nano banana 2</option>
                              <option value="nano-banana-pro">nano-banana-pro (Premium/Official)</option>
                            </select>
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] font-mono text-brand-grey">BEARER API KEY</label>
                            <input
                              type="password"
                              value={configKieKey}
                              onChange={(e) => setConfigKieKey(e.target.value)}
                              className="bg-white border border-brand-black/15 p-2 text-xs font-mono rounded-xs focus:ring-brand-orange focus:border-brand-orange"
                              placeholder={(import.meta as any).env.VITE_KIE_API_KEY ? "VITE_KIE_API_KEY Terdeteksi (Environtment)" : "Masukkan API key kie.ai..."}
                              autoComplete="new-password"
                            />
                          </div>
                        </div>
                      </details>

                      {/* Generative Controller Button */}
                      {!aiGeneratedLayout && !kieLoading && (
                        <div className="p-6 text-center border border-dashed border-brand-black/10 bg-[#FAF9F5] rounded-xs flex flex-col items-center justify-center gap-3">
                          <Sparkles className="w-8 h-8 text-[#E05C38] opacity-80 animate-pulse" />
                          <div className="max-w-xs">
                            <span className="text-xs font-bold text-brand-black block">Penyusunan Cetak Biru via Generative AI</span>
                            <span className="text-[10px] text-brand-grey block mt-1">Tekan tombol di bawah untuk meminta model {configKieModel} melakukan routing grid zonasi ruangan.</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleGenerateAiLayout}
                            className="bg-[#E05C38] text-white hover:bg-brand-orange-hover px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-xs mt-2"
                          >
                            <Sparkles className="w-4 h-4 fill-current" /> Bangun Layout Fasad AI
                          </button>
                        </div>
                      )}

                      {/* Progress Loading Steps */}
                      {kieLoading && (
                        <div className="p-6 border border-brand-orange/20 bg-brand-white rounded-xs">
                          <div className="flex flex-col items-center justify-center gap-3 text-center">
                            <RefreshCw className="w-6 h-6 text-brand-orange animate-spin" />
                            <div className="w-full max-w-xs bg-brand-warm-grey h-1.5 rounded-full overflow-hidden relative border border-brand-black/5">
                              <div className="bg-brand-orange h-full transition-all duration-300" style={{ width: `${kieProgress}%` }} />
                            </div>
                            <span className="text-xs font-bold text-brand-black animate-pulse">{kieStatusMsg}</span>
                          </div>

                          {/* Live Console Terminal Log */}
                          {apiLogs.length > 0 && (
                            <div className="mt-4 bg-[#1E1C1A] text-brand-cream/95 text-[10px] font-mono p-3 rounded-xs h-32 overflow-y-auto border border-brand-black/10 text-left space-y-1 scrollbar-thin">
                              {apiLogs.map((log, idx) => (
                                <div key={idx} className="break-words">{log}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* API Error Notification */}
                      {kieError && (
                        <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xs text-xs flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                          <div className="space-y-1">
                            <span className="font-bold block">Gagal Melakukan Generasi via API:</span>
                            <p className="text-[10px] text-red-600/90 leading-relaxed">{kieError}</p>
                            <p className="text-[10px] text-[#A8A49C] mt-1 italic">Catatan: Pastikan API Key valid dan model mendukung streaming. Anda bisa mengaktifkan opsi &apos;Simulasikan Respon AI (Offline)&apos; untuk pengujian instan.</p>
                          </div>
                        </div>
                      )}

                      {/* Display debug logs and Request/Response payload after success */}
                      {aiGeneratedLayout && !kieLoading && (
                        <div className="p-3 bg-brand-green/5 border border-brand-green/20 rounded-xs flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-brand-green flex items-center gap-1">
                              <CheckCircle className="w-4 h-4 text-brand-green fill-current" /> Layout berhasil dibuat oleh Model {configKieModel} ({useKieSimulation ? 'Simulasi' : 'KIE.AI Live'})!
                            </span>
                            <button
                              type="button"
                              onClick={() => { setAiGeneratedLayout(null); setKieError(''); }}
                              className="text-[10px] font-semibold text-[#E05C38] hover:underline"
                            >
                              Buat Ulang / Generate Baru
                            </button>
                          </div>
                          
                          <details className="group text-[10px] text-brand-grey font-mono border-t border-brand-green/10 pt-2">
                            <summary className="cursor-pointer select-none font-bold text-brand-grey group-hover:text-brand-black">
                              [+] LIHAT RAW RENDER REQUEST &amp; RESPONSE PACKETS JSON
                            </summary>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 h-44 overflow-y-auto">
                              <div className="space-y-1">
                                <span className="text-[9px] uppercase tracking-wider text-brand-grey block">// PAYLOAD SENT:</span>
                                <pre className="bg-[#1E1C1A] text-brand-cream p-2 text-[8.5px] rounded-xs scroll-auto overflow-x-auto whitespace-pre">{kieRawRequest}</pre>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[9px] uppercase tracking-wider text-brand-grey block">// RESPONSE RECEIVED:</span>
                                <pre className="bg-[#1E1C1A] text-brand-cream p-2 text-[8.5px] rounded-xs scroll-auto overflow-x-auto whitespace-pre">{kieRawResponse}</pre>
                              </div>
                            </div>
                          </details>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Render CAD SVG Canvas if layout computed or procedural */}
                  {(blueprintEngine === 'procedural' || aiGeneratedLayout) && (
                    <div className="relative w-full aspect-[4/3] bg-[#FCFCFA] border border-brand-black/20 flex flex-col items-center justify-center rounded-xs overflow-hidden" id="denah-svg-canvas">
                    <svg viewBox="0 0 800 580" className="w-full h-full font-sans bg-[#FCFCFA]">
                      <defs>
                        <pattern id="blueprint-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ECE9E1" strokeWidth="0.6" />
                        </pattern>
                      </defs>
                      <rect x="5" y="5" width="790" height="570" fill="none" stroke="#1D1B18" strokeWidth="1.2" />
                      <rect x="8" y="8" width="784" height="564" fill="url(#blueprint-grid)" stroke="#1D1B18" strokeWidth="0.5" />

                      <g>
                        {/* Land Boundary or Image Representation */}
                        {activeLayout.imageUrl ? (
                          <g>
                            <image
                              href={activeLayout.imageUrl}
                              x={startX}
                              y={startY}
                              width={drawW}
                              height={drawH}
                              preserveAspectRatio="xMidYMid slice"
                              referrerPolicy="no-referrer"
                            />
                            <rect
                              x={startX}
                              y={startY}
                              width={drawW}
                              height={drawH}
                              className="fill-none stroke-[#1D1B18] stroke-[2]"
                            />
                          </g>
                        ) : (
                          <rect
                            x={startX}
                            y={startY}
                            width={drawW}
                            height={drawH}
                            className="fill-[#FDFCFA]/40 stroke-[#1D1B18]/30 stroke-[1] stroke-dasharray-[4,4] select-none"
                          />
                        )}

                        {/* Section Lines */}
                        <g opacity="0.3" className="select-none">
                          <line x1={startX - 15} y1={startY + drawH/2} x2={startX + drawW + 15} y2={startY + drawH/2} stroke="#8D8B84" strokeWidth="0.8" strokeDasharray="6,4,2,4" />
                          <circle cx={startX - 20} cy={startY + drawH/2} r="6" fill="#FCFCFA" stroke="#1D1B18" strokeWidth="0.8" />
                          <text x={startX - 20} y={startY + drawH/2 + 2} textAnchor="middle" fontSize="6" fontWeight="bold" className="font-mono">A</text>
                        </g>

                        {/* Dimensions Labels */}
                        <g className="font-mono text-[8px] fill-[#4D4B44] stroke-[#4D4B44]">
                          <line x1={startX} y1={startY - 25} x2={startX + drawW} y2={startY - 25} stroke="#4D4B44" strokeWidth="0.8" />
                          <line x1={startX} y1={startY - 25} x2={startX} y2={startY - 10} stroke="#4D4B44" strokeWidth="0.5" strokeDasharray="2,2" />
                          <line x1={startX + drawW} y1={startY - 25} x2={startX + drawW} y2={startY - 10} stroke="#4D4B44" strokeWidth="0.5" strokeDasharray="2,2" />
                          <rect x={startX + drawW/2 - 20} y={startY - 31} width="40" height="10" fill="#FCFCFA" />
                          <text x={startX + drawW/2} y={startY - 23} textAnchor="middle" className="font-mono font-bold text-[8px] fill-[#1D1B18]">
                            {(activeLayout.lotWidth * 1000).toFixed(0)} mm
                          </text>
                        </g>

                        {/* CAD Drawing scale marker annotation */}
                        <g transform={`translate(${startX}, ${startY + drawH + 30})`} className="select-none">
                          <circle cx="10" cy="10" r="8" fill="none" stroke="#1D1B18" strokeWidth="0.8" />
                          <circle cx="10" cy="10" r="2" fill="#1D1B18" />
                          <line x1="2" y1="10" x2="18" y2="10" stroke="#1D1B18" strokeWidth="0.8" />
                          <text x="22" y="8" className="font-sans font-extrabold text-[9px] uppercase tracking-wider fill-[#1D1B18]">
                            DENAH LANTAI {currentFloorTab}
                          </text>
                          <line x1="22" y1="12" x2="130" y2="12" stroke="#1D1B18" strokeWidth="1" />
                          <text x="22" y="19" className="font-mono text-[6px] uppercase font-bold text-[#8D8678] tracking-widest">
                            SKALA 1:100 DIMENSI INTEGRAL
                          </text>
                        </g>

                        {/* Main Rooms Mapping */}
                        {!activeLayout.imageUrl && activeLayout.layoutResult && activeLayout.layoutResult
                          .filter(room => room.floor === currentFloorTab)
                          .map((room) => {
                            const rx = startX + room.x * scaleVal;
                            const ry = startY + room.y * scaleVal;
                            const rw = room.width * scaleVal;
                            const rh = room.height * scaleVal;
                            const roomColor = getRoomColorClasses(room.id);
                            const cadLabelAndElev = getRoomCADLabelAndElev(room.id, room.name);

                            return (
                              <g key={room.id} className="group/room">
                                {/* CAD Wall outlines */}
                                <rect
                                  x={rx}
                                  y={ry}
                                  width={rw}
                                  height={rh}
                                  className="fill-[#FDFDFB] stroke-[#1D1B18] stroke-[2] pointer-events-auto"
                                />
                                <rect
                                  x={rx + 2}
                                  y={ry + 2}
                                  width={rw - 4}
                                  height={rh - 4}
                                  className="fill-[#F8F7F4]/40 stroke-[#AEA99B] stroke-[0.5]"
                                />

                                {/* Columns corners */}
                                <rect x={rx - 1.5} y={ry - 1.5} width="3" height="3" fill="#1D1B18" />
                                <rect x={rx + rw - 1.5} y={ry - 1.5} width="3" height="3" fill="#1D1B18" />
                                <rect x={rx - 1.5} y={ry + rh - 1.5} width="3" height="3" fill="#1D1B18" />
                                <rect x={rx + rw - 1.5} y={ry + rh - 1.5} width="3" height="3" fill="#1D1B18" />

                                {/* Subtle background fill mapping for zoning distinction */}
                                <rect
                                  x={rx + 2.5}
                                  y={ry + 2.5}
                                  width={rw - 5}
                                  height={rh - 5}
                                  className={`${roomColor.fill} opacity-20`}
                                />

                                {/* Decorative CAD stamp outline container inside room centered */}
                                <rect
                                  x={rx + rw/2 - 28}
                                  y={ry + rh/2 - 13}
                                  width="56"
                                  height="26"
                                  fill="#FCFCFA"
                                  fillOpacity="0.8"
                                  rx="1"
                                  className="pointer-events-none select-none"
                                />

                                <text
                                  x={rx + rw/2}
                                  y={ry + rh/2 - 5}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                  className="fill-[#1A1A18] font-bold text-[7.2px] uppercase tracking-wide"
                                >
                                  {cadLabelAndElev.label}
                                </text>

                                <text
                                  x={rx + rw/2}
                                  y={ry + rh/2 + 5}
                                  textAnchor="middle"
                                  dominantBaseline="middle"
                                  className="fill-[#E05C38] font-mono font-bold text-[6.5px]"
                                >
                                  {(room.width * 1000).toFixed(0)} x {(room.height * 1000).toFixed(0)}
                                </text>
                              </g>
                            );
                          })}
                      </g>

                      {/* CAD SHEET INDONESIAN TITLE BLOCK */}
                      <g transform="translate(630, 0)">
                        <line x1="0" y1="10" x2="0" y2="570" stroke="#1D1B18" strokeWidth="1.2" />
                        
                        <g transform="translate(10, 20)">
                          <text x="70" y="15" textAnchor="middle" className="font-sans font-black text-[9.5px] tracking-[0.2em] fill-[#1D1B18]">
                            OH ARCHITECTURE
                          </text>
                          <line x1="10" y1="24" x2="130" y2="24" stroke="#1D1B18" strokeWidth="1" />
                        </g>

                        <g transform="translate(10, 45)">
                          <rect x="15" y="0" width="110" height="16" fill="#1D1B18" />
                          <text x="70" y="11" textAnchor="middle" className="font-sans font-black text-[7px] tracking-[0.1em] fill-[#FCFCFA]">
                            SKETSA CAD AI
                          </text>
                        </g>

                        <g transform="translate(10, 80)" className="font-sans text-[7.5px]">
                          <text x="10" y="10" className="font-bold fill-[#8D8B84] uppercase tracking-widest text-[7px]">PROYEK / LOKASI:</text>
                          <text x="10" y="20" className="font-bold fill-[#1D1B18] text-[8.5px]">RESIDENSI TROPIS</text>
                          <text x="10" y="28" className="fill-brand-grey text-[6.5px]">Lahan {areaSqm} m² · {floors} Lantai</text>
                          <line x1="10" y1="36" x2="130" y2="36" stroke="#E3E1D9" strokeWidth="0.5" />

                          <text x="10" y="48" className="font-bold fill-[#8D8B84] uppercase tracking-widest text-[7px]">NAMA SKETSA:</text>
                          <text x="10" y="58" className="font-extrabold fill-[#E05C38] text-[8.5px]">LAYOUT ZONASI FL. {currentFloorTab}</text>
                          <line x1="10" y1="66" x2="130" y2="66" stroke="#E3E1D9" strokeWidth="0.5" />

                          <text x="10" y="78" className="font-bold fill-[#8D8B84] uppercase tracking-widest text-[7px]">ARSITEK UTAMA:</text>
                          <text x="10" y="88" className="font-semibold fill-[#1D1B18]">OH STUDIO &amp; AI</text>
                          <line x1="10" y1="96" x2="130" y2="96" stroke="#E3E1D9" strokeWidth="0.5" />

                          <text x="10" y="108" className="font-bold fill-[#8D8B84] uppercase tracking-widest text-[7px]">LEMBAR / SKALA:</text>
                          <text x="10" y="118" className="font-mono font-bold text-brand-orange">AR-0{currentFloorTab} / 1:100</text>
                        </g>

                        <g transform="translate(10, 310)" className="font-sans text-[6.8px] fill-[#7D7B74] leading-relaxed">
                          <text x="10" y="10" className="font-bold fill-[#1D1B18] text-[7.2px] tracking-wider">GUIDELINES:</text>
                          <text x="10" y="23">1. Referensi dimensi dalam mm.</text>
                          <text x="10" y="33">2. Jaga koefisien daerah resapan.</text>
                          <text x="10" y="43">3. Layout AI bersifat rancangan kasar.</text>
                        </g>
                      </g>
                    </svg>
                  </div>
                )}
                </div>
              ) : null}

              {/* S-04 AI FACADE RENDER PERSPECTIVE SUB-PANEL */}
              <div className="border border-brand-black/15 bg-[#1C1B19] text-brand-cream p-5 md:p-6 rounded-xs shadow-md">
                <header className="border-b border-brand-white/10 pb-4 mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-orange" />
                    <span className="font-serif text-sm font-semibold text-brand-white">Render Perspektif Fasad AI 3D</span>
                  </div>
                  <span className="text-[9px] font-mono tracking-widest uppercase text-brand-orange font-bold">[S-04 Studio]</span>
                </header>

                {!aiResult && !aiLoading ? (
                  <div className="space-y-4">
                    {/* Choose Visual Concept Tag */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[#A8A49C]">Pilih Konsep Visual / Eksterior</span>
                      <div className="grid grid-cols-2 gap-2">
                        {STYLE_TAGS.map((st) => (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() => setSelectedStyle(st.id)}
                            className={`p-3 text-left border rounded-xs transition-all pointer-events-auto cursor-pointer ${
                              selectedStyle === st.id
                                ? 'border-brand-orange bg-[#E05C38]/10 text-brand-white'
                                : 'border-brand-white/10 bg-neutral-900 text-[#C4B99A] hover:bg-neutral-850'
                            }`}
                          >
                            <span className="text-xs font-semibold block">{st.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Additional Notes Prompts */}
                    <div className="flex flex-col gap-2">
                      <label htmlFor="notes" className="text-[10px] uppercase font-mono tracking-wider text-[#A8A49C]">
                        Tambahan Catatan Khusus Desain (Opsional)
                      </label>
                      <textarea
                        id="notes"
                        rows={2}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Misal: cat dinding terracotta dominan, kisi kayu vertikal lebih tebal, area garasi tertutup..."
                        className="w-full bg-[#131211] border border-brand-white/10 p-3 text-xs text-brand-cream focus:border-brand-orange focus:outline-none rounded-xs placeholder-brand-grey/50"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleGenerateAiRender}
                      className="w-full bg-[#E05C38] text-brand-white hover:bg-brand-orange-hover py-3 text-xs font-bold uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                    >
                      <Sparkles className="w-3.5 h-3.5 fill-current" /> Gores Render Fasad AI
                    </button>
                  </div>
                ) : aiLoading ? (
                  // Progressive Loading Screen
                  <div className="py-8 text-center flex flex-col items-center justify-center gap-4">
                    <RefreshCw className="w-8 h-8 text-brand-orange animate-spin" />
                    <div className="w-full max-w-xs bg-neutral-800 h-1.5 rounded-full overflow-hidden border border-white/5 relative">
                      <div className="bg-brand-orange h-full" style={{ width: `${aiProgress}%`, transition: 'width 0.2s ease-out' }} />
                    </div>
                    <span className="text-xs text-brand-cream/80 font-serif italic mt-1 animate-pulse">{aiStatusMessage}</span>
                  </div>
                ) : (
                  // Success Reveal of NextJS Optimised Custom Render
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-4"
                  >
                    <div className="relative aspect-[16/10] bg-neutral-900 border border-brand-white/10 overflow-hidden rounded-xs group shadow-lg">
                      <NextImage
                        src={aiResult!.imageUrl}
                        alt="Sketsa Render Eksterior Fasad"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="transition-transform duration-[1200ms] group-hover:scale-105 pointer-events-none select-none object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#131110]/95 via-[#131110]/50 to-transparent flex justify-between items-end">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] font-mono text-brand-orange uppercase font-bold tracking-wider">// Gaya: {aiResult!.styleName}</span>
                          <span className="text-[10px] text-brand-cream/70 font-serif italic">Pratinjau Perspektif Gerbang Depan</span>
                        </div>
                        <CheckCircle className="w-4 h-4 text-brand-green" />
                      </div>
                    </div>

                    <div className="p-3 bg-[#131211]/65 border border-brand-white/5 rounded-xs">
                      <p className="text-[10px] text-brand-grey font-mono leading-relaxed break-words">
                        <strong className="text-[#C4B99A]">PROMPT DETIL CAD:</strong> &quot;{aiResult!.promptUsed}&quot;
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => { setAiResult(null); setNotes(''); }}
                        className="flex-1 bg-transparent hover:bg-white/5 border border-brand-white/10 text-brand-cream py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer"
                      >
                        Pilih Gaya Baru
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* ACTION BACK TO RE-PROCESS */}
              <div className="flex flex-col sm:flex-row gap-4 items-stretch bg-transparent pt-3">
                <button
                  type="button"
                  onClick={resetCalculator}
                  className="flex-1 border border-brand-black/15 text-brand-black hover:border-brand-black hover:bg-brand-cream/10 py-4.5 text-xs font-semibold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 bg-white cursor-pointer"
                  id="btn-recalculate-rab"
                >
                  Hitung Ulang RAB
                </button>

                <button
                  type="button"
                  onClick={handleConsultWithPlan}
                  className="flex-1 bg-brand-orange text-brand-white hover:bg-brand-orange-hover py-4.5 text-xs font-semibold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  id="btn-go-to-konsultasi"
                >
                  Konsultasikan Rencana Ini <Check className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )
      )}
    </article>
  );
}
