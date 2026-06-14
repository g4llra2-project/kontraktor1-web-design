/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RoomConfig } from '../types';

// Price per square meter in IDR for each specification level
export const PRICE_PER_SQM = {
  standard: 3200000,  // Rp 3.200.000 / m2 (Sederhana/Praktis)
  medium: 4500000,    // Rp 4.500.000 / m2 (Menengah/Modern)
  premium: 6800000,   // Rp 6.800.000 / m2 (Premium/Luxury)
};

// Floor adjustment factor (building onto additional floors has extra costs for structures)
export const FLOOR_MULTIPLIERS: Record<number, number> = {
  1: 1.0,
  2: 1.15, // extra 15% for multi-story scaffolding, column strength
  3: 1.25,
  4: 1.35,
};

// Renovations generally have a different scale depending on type
export const RENOVATION_MULTIPLIER = 0.65; // average cost of structural portion is saved

// Additional luxury / specialized addons costs in IDR
export const ADDON_COSTS: Record<string, { label: string; cost: number; description: string }> = {
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
};

// Breakdown percentages for standard structural portions
export const ESTIMATE_BREAKDOWN_PERCENTAGES = [
  { category: 'Pekerjaan Struktur & Pondasi', percentage: 40 },
  { category: 'Pekerjaan Dinding, Lantai, & Atap (Finishing)', percentage: 35 },
  { category: 'Pekerjaan MEP (Mekanikal, Elektrikal, Plumbing)', percentage: 15 },
  { category: 'Pekerjaan Persiapan & Keamanan (K3)', percentage: 10 },
];

// Default room requirements & dimensions (minimum functional room sizes in meters)
export const DEFAULT_ROOM_TEMPLATES: RoomConfig[] = [
  { id: 'bedroom', name: 'Kamar Tidur Utama', count: 1, minAreaSqm: 12, label: '🛏️ Kamar Utama' },
  { id: 'kid_room', name: 'Kamar Tidur Anak', count: 1, minAreaSqm: 9, label: '🧸 Kamar Anak' },
  { id: 'bathroom', name: 'Kamar Mandi', count: 1, minAreaSqm: 4, label: '🚿 Kamar Mandi' },
  { id: 'living_room', name: 'Ruang Tamu', count: 1, minAreaSqm: 12, label: '🛋️ Ruang Tamu' },
  { id: 'family_room', name: 'Ruang Keluarga', count: 1, minAreaSqm: 15, label: '📺 Ruang Keluarga' },
  { id: 'kitchen', name: 'Dapur & Area Makan', count: 1, minAreaSqm: 10, label: '🍳 Dapur' },
  { id: 'carport', name: 'Garasi / Carport', count: 1, minAreaSqm: 15, label: '🚗 Carport' },
  { id: 'laundry', name: 'Area Cuci Jemur', count: 0, minAreaSqm: 6, label: '🧺 Cuci Jemur' },
  { id: 'garden', name: 'Taman Belakang', count: 0, minAreaSqm: 8, label: '🌿 Taman' },
];

// AI visual concept style tags
export const STYLE_TAGS = [
  { id: 'minimalist', label: 'Minimalis Modern', prompt: 'modern minimalist architecture, white walls, warm timber cladding, large glass openings, sharp lines' },
  { id: 'tropical', label: 'Tropis Modern', prompt: 'modern tropical architecture, lush greenery integrated, high pitched roof, natural stone, open spaces, timber slats' },
  { id: 'industrial', label: 'Industrial Kontemporer', prompt: 'contemporary industrial residential exterior, exposed raw concrete, matte black steel columns, sleek windows, architectural brick accents' },
  { id: 'classic', label: 'Klasik Modern', prompt: 'classic modern elegant architecture, symmetric facades, subtle moldings, tall windows, warm white lighting, luxury feel' },
];

export const MAX_AI_GENERATIONS_PER_SESSION = 3;
export const AI_RATE_LIMIT_MINUTES = 10;
