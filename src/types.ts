/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'ongoing';
  statusLabel: string; // "Selesai" or "Sedang Dikerjakan"
  location: string;
  coverImageUrl: string;
  galleryUrls: string[];
  year: number;
  displayOrder: number;
}

export type BuildingType = 'new' | 'renovation';

export interface RabEstimateInput {
  buildingType: BuildingType;
  areaSqm: number;
  floors: number;
  specification: 'standard' | 'medium' | 'premium';
  addons: string[];
}

export interface RabEstimateBreakdownItem {
  category: string;
  percentage: number;
  estimatedCost: number;
}

export interface RabEstimateResult {
  estimatedMin: number;
  estimatedMax: number;
  breakdown: RabEstimateBreakdownItem[];
  disclaimer: string;
}

export interface RoomConfig {
  id: string;
  name: string;
  count: number;
  minAreaSqm: number;
  label: string;
}

export interface RoomLayoutResult {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  floor: number;
}

export interface FloorPlanResult {
  id: string;
  landAreaSqm: number;
  floors: number;
  roomsConfig: Record<string, number>;
  layoutResult: RoomLayoutResult[];
  warningMessage?: string;
}

export interface AiRenderResult {
  id: string;
  floorPlanId?: string;
  styleTags: string[];
  notes?: string;
  promptUsed: string;
  imageUrl: string;
  status: 'success' | 'failed' | 'timeout';
}

export interface LeadInput {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  rabEstimateId?: string;
  floorPlanId?: string;
  aiRenderId?: string;
}

export type ViewPath = 'home' | 'works' | 'studio' | 'process' | 'kalkulator-rab' | 'generator-denah' | 'konsultasi' | 'cms';
