/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RoomLayoutResult, RoomConfig } from '../../types';

interface GenerateLayoutProps {
  landAreaSqm: number;
  floors: number;
  selectedRooms: { templateId: string; count: number }[];
  allTemplates: RoomConfig[];
  widthMeters?: number; // Optional custom lot width
  seed?: number;        // Seed for layouts variations
}

export function generateFloorPlanLayout({
  landAreaSqm,
  floors,
  selectedRooms,
  allTemplates,
  widthMeters,
  seed = 42,
}: GenerateLayoutProps) {
  // 1. Calculate default dimensions based on land area
  // Standard aspect ratio of typical Indonesian lots is usually around 1:1.5 or 1:2 (e.g. 6x12, 8x15, 10x20)
  const derivedWidth = widthMeters && widthMeters > 0 
    ? widthMeters 
    : Math.max(6, Math.round(Math.sqrt(landAreaSqm / 1.5)));
  const derivedLength = Math.max(8, Math.round(landAreaSqm / derivedWidth));

  const totalLotArea = derivedWidth * derivedLength;

  // 2. Map chosen rooms with count and template details
  const roomsToPlace: { id: string; name: string; targetArea: number }[] = [];
  selectedRooms.forEach(sr => {
    const template = allTemplates.find(t => t.id === sr.templateId);
    if (template && sr.count > 0) {
      for (let i = 0; i < sr.count; i++) {
        roomsToPlace.push({
          id: `${sr.templateId}_${i + 1}`,
          name: sr.count > 1 ? `${template.name} ${i + 1}` : template.name,
          targetArea: template.minAreaSqm,
        });
      }
    }
  });

  // Calculate total requested space
  const totalTargetArea = roomsToPlace.reduce((sum, r) => sum + r.targetArea, 0);

  // Maximum allowed build area per floor (coefficient of building area / Koefisien Dasar Bangunan - KDB, usually ~60-70% in Indonesia)
  const kdbRatio = 0.7; 
  const allowedBuildingAreaPerFloor = totalLotArea * kdbRatio;
  const totalAllowedBuildArea = allowedBuildingAreaPerFloor * floors;

  // 3. Scale down rooms if they exceed the total allowed building area
  let scaleShrink = 1.0;
  let warningMessage = '';
  if (totalTargetArea > totalAllowedBuildArea) {
    scaleShrink = totalAllowedBuildArea / totalTargetArea;
    warningMessage = `Kebutuhan utilitas ruang (${Math.round(totalTargetArea)}m²) melebihi koefisien luas terbangun maksimal lahan (${Math.round(totalAllowedBuildArea)}m²). Ukuran ruangan telah diperkecil secara proporsional.`;
  }

  // Adjust room targets
  const scaledRooms = roomsToPlace.map(room => ({
    ...room,
    actualArea: Math.max(3, Math.round(room.targetArea * scaleShrink * 10) / 10),
  }));

  // 4. Distribute rooms across floors based on zoning principles
  // Floor 1: carport, kitchen, living room, yard, some bedrooms
  // Floor 2+: other bedrooms, laundries, open family balconies
  const distributedRooms: { floor: number; id: string; name: string; area: number; category: string }[] = [];

  scaledRooms.forEach(room => {
    let assignedFloor = 1;
    let category = 'middle'; // front, middle, back zones

    if (room.id.startsWith('carport')) {
      assignedFloor = 1;
      category = 'front';
    } else if (room.id.startsWith('garden')) {
      assignedFloor = 1;
      category = 'back';
    } else if (room.id.startsWith('living_room')) {
      assignedFloor = 1;
      category = 'front';
    } else if (room.id.startsWith('kitchen')) {
      assignedFloor = 1;
      category = 'back';
    } else if (room.id.startsWith('kid_room_3') || room.id.startsWith('kid_room_2')) {
      assignedFloor = floors > 1 ? 2 : 1;
      category = 'middle';
    } else if (room.id.startsWith('laundry')) {
      assignedFloor = floors > 1 ? floors : 1; // Top floor usually laundry
      category = 'back';
    } else if (room.id.startsWith('bedroom')) {
      // spread bedrooms
      const index = parseInt(room.id.split('_')[1], 10) || 1;
      assignedFloor = index > 1 && floors > 1 ? 2 : 1;
      category = 'middle';
    } else if (room.id.startsWith('bathroom')) {
      const index = parseInt(room.id.split('_')[1], 10) || 1;
      assignedFloor = index > 1 && floors > 1 ? 2 : 1;
      category = 'middle';
    }

    // Guard bound in floor count
    if (assignedFloor > floors) {
      assignedFloor = floors;
    }

    distributedRooms.push({
      floor: assignedFloor,
      id: room.id,
      name: room.name,
      area: room.actualArea,
      category,
    });
  });

  // Calculate structural layout grid coordinates per floor
  const layoutResults: RoomLayoutResult[] = [];

  // Deterministic seed variant offsets
  const seedOffset = (seed % 10) * 0.2;

  for (let fl = 1; fl <= floors; fl++) {
    const floorRooms = distributedRooms.filter(r => r.floor === fl);
    if (floorRooms.length === 0) continue;

    // Separate rooms of this floor by layout zones: Front, Middle, Back
    const frontRooms = floorRooms.filter(r => r.category === 'front');
    const middleRooms = floorRooms.filter(r => r.category === 'middle');
    const backRooms = floorRooms.filter(r => r.category === 'back');

    // Define lot dimensions
    const width = derivedWidth;
    const length = derivedLength;

    // Zoning length partitions (Y-axis division)
    // Front zone gets top (0 to 30%), middle gets center (30% to 70%), back gets bottom (70% to 100%)
    const frontYMin = 0;
    const frontYMax = length * 0.28;

    const middleYMin = length * 0.28;
    const middleYMax = length * 0.72;

    const backYMin = length * 0.72;
    const backYMax = length;

    // Function to pack a list of rooms inside a sub-boundary slot
    const packZone = (
      rooms: typeof floorRooms,
      ymin: number,
      ymax: number,
      zoneName: string
    ) => {
      if (rooms.length === 0) return;

      const zoneHeight = ymax - ymin;
      const numRooms = rooms.length;

      // Arrange columns or grids inside zone
      // Replicate seed modifications by swapping columns based on seed offset
      const sortedRooms = [...rooms];
      if (seedOffset > 0.5 && numRooms > 1) {
        // Swap first and last rooms for variance
        const temp = sortedRooms[0];
        sortedRooms[0] = sortedRooms[numRooms - 1];
        sortedRooms[numRooms - 1] = temp;
      }

      // Distribute width across elements
      const stepWidth = width / numRooms;

      sortedRooms.forEach((r, idx) => {
        // Simple rectangular block size derivation
        const roomW = Math.round(stepWidth * 10) / 10;
        const roomH = Math.round(zoneHeight * 10) / 10;
        const rx = Math.round((idx * stepWidth) * 10) / 10;
        const ry = Math.round(ymin * 10) / 10;

        layoutResults.push({
          id: r.id,
          name: r.name,
          x: rx,
          y: ry,
          width: roomW,
          height: roomH,
          floor: fl,
        });
      });
    };

    // Pack each zone cleanly
    packZone(frontRooms, frontYMin, frontYMax, 'front');
    packZone(middleRooms, middleYMin, middleYMax, 'middle');
    packZone(backRooms, backYMin, backYMax, 'back');
  }

  return {
    lotWidth: derivedWidth,
    lotLength: derivedLength,
    totalLotArea,
    warningMessage,
    layoutResult: layoutResults,
  };
}
