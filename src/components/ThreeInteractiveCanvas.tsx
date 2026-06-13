import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';

interface ThreeInteractiveCanvasProps {
  activeIdx: number;
}

// Resilient WebGL availability detection
function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

export default function ThreeInteractiveCanvas({ activeIdx }: ThreeInteractiveCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  // Keep references for interaction and animation
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const scaffoldingGroupRef = useRef<THREE.Group | null>(null);
  
  // Scaffolding meshes for raycasting
  const scaffoldingMeshesRef = useRef<THREE.Mesh[]>([]);
  // Store original materials and glow materials for hover interactions
  const scaffoldingMaterialsRef = useRef<Map<string, { std: THREE.Material; glow: THREE.Material }>>(new Map());

  // Ground elevation base
  const Y_GROUND = -1.2;

  useEffect(() => {
    if (!isWebGLAvailable()) {
      setWebglSupported(false);
      return;
    }

    if (!containerRef.current || !canvasRef.current) return;

    // 1. Initial Scene, Camera, & Renderer setup set to pure minimalist white
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(5.5, 4.5, 8.5); // Warm, architectural isometric angle
    cameraRef.current = camera;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      });
    } catch (err) {
      console.warn("Failed to create WebGL context. Falling back to clean 2D vectors.", err);
      setWebglSupported(false);
      return;
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.localClippingEnabled = true; // Enable the sharp wireframe/solid clipping split!
    rendererRef.current = renderer;

    // 2. Add OrbitControls for interactive navigation
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Prevent camera from passing below ground plane
    controls.minDistance = 3;
    controls.maxDistance = 20;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // 3. Define local clipping planes to split left (wireframe) and right (solid)
    // Positive normal keeps region where P.N >= 0
    // solid keeps x >= 0 (Right half)
    const solidClipPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);
    // wireframe keeps x <= 0 (Left half)
    const wireClipPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0);

    // 4. Lighting & Shadows (Designed for high contrast modern aesthetics)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.1);
    dirLight.position.set(6, 12, 5);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 25;
    const d = 5;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    dirLight.shadow.bias = -0.0005;
    scene.add(dirLight);

    // Subtle fill light on the left is useful to offset shadows
    const leftFillLight = new THREE.DirectionalLight(0xecfeff, 0.35);
    leftFillLight.position.set(-8, 4, -4);
    scene.add(leftFillLight);

    // 5. Parent group representing the entire assembly
    const assemblyGroup = new THREE.Group();
    scene.add(assemblyGroup);

    // Create container groups
    const solidGroup = new THREE.Group();
    const wireGroup = new THREE.Group();
    const scaffoldingGroup = new THREE.Group();

    assemblyGroup.add(solidGroup);
    assemblyGroup.add(wireGroup);
    assemblyGroup.add(scaffoldingGroup);
    scaffoldingGroupRef.current = scaffoldingGroup;

    // Clear caches
    scaffoldingMeshesRef.current = [];
    scaffoldingMaterialsRef.current.clear();

    // 6. Define Materials
    // Solid textured materials configured with the solid clip plane
    const floorSlabMaterial = new THREE.MeshStandardMaterial({
      color: 0xe5e7eb, // Concrete light grey
      roughness: 0.8,
      metalness: 0.1,
      clippingPlanes: [solidClipPlane],
      side: THREE.DoubleSide
    });

    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0x9ca3af, // Textured dense concrete
      roughness: 0.9,
      metalness: 0.05,
      clippingPlanes: [solidClipPlane],
      side: THREE.DoubleSide
    });

    const brickMaterial = new THREE.MeshStandardMaterial({
      color: 0xd97706, // Roster/terracotta brick orange tone
      roughness: 0.85,
      metalness: 0.1,
      clippingPlanes: [solidClipPlane],
    });

    const woodMaterial = new THREE.MeshStandardMaterial({
      color: 0xa16207, // Rich cedar warm wood
      roughness: 0.6,
      metalness: 0.1,
      clippingPlanes: [solidClipPlane],
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xbae6fd, // Soft light blue architectural glass
      transparent: true,
      opacity: 0.35,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.9,
      ior: 1.5,
      thickness: 0.5,
      clippingPlanes: [solidClipPlane],
      side: THREE.DoubleSide
    });

    const metalFrameMaterial = new THREE.MeshStandardMaterial({
      color: 0x1f2937, // Obsidian black powder coat
      roughness: 0.45,
      metalness: 0.85,
      clippingPlanes: [solidClipPlane]
    });

    const scaffoldMetalMaterial = new THREE.MeshStandardMaterial({
      color: 0xbdc3c7, // Reflective silver cylinders
      roughness: 0.15,
      metalness: 0.95,
      clippingPlanes: [solidClipPlane]
    });

    // Wireframe Materials (Glowing architects white lines configured with wire clip plane)
    const glowWireMaterial = new THREE.LineBasicMaterial({
      color: 0x737373, // Clean dark grey grid lines for underlying architecture
      transparent: true,
      opacity: 0.8,
      clippingPlanes: [wireClipPlane],
    });

    const boldWireMaterial = new THREE.LineBasicMaterial({
      color: 0x3b82f6, // Accent neon blue structural core highlight lines
      transparent: true,
      opacity: 0.9,
      clippingPlanes: [wireClipPlane],
    });

    const wireframeMeshMaterial = new THREE.MeshBasicMaterial({
      color: 0xb91c1c, // Crimson reference lines
      wireframe: true,
      transparent: true,
      opacity: 0.15,
      clippingPlanes: [wireClipPlane]
    });

    // Vertical transition divider line at custom position x = 0
    const transitionLineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, Y_GROUND - 0.2, -2.5),
      new THREE.Vector3(0, Y_GROUND + 3.2, -2.5),
      new THREE.Vector3(0, Y_GROUND + 3.2, 2.5),
      new THREE.Vector3(0, Y_GROUND - 0.2, 2.5),
      new THREE.Vector3(0, Y_GROUND - 0.2, -2.5),
    ]);
    const transitionLineMat = new THREE.LineDashedMaterial({
      color: 0xd97706, // High contrast terracotta orange dashed boundary
      dashSize: 0.15,
      gapSize: 0.08,
    });
    const transitionDivider = new THREE.Line(transitionLineGeo, transitionLineMat);
    transitionDivider.computeLineDistances();
    scene.add(transitionDivider);

    // 7. Architectural Geometries Generation Helper
    const registerRenderMesh = (
      geo: THREE.BufferGeometry,
      solidMat: THREE.Material,
      wireLineColor: number = 0x60a5fa,
      opacity: number = 0.85
    ) => {
      // 7a. Make Solid Mesh
      const solidMesh = new THREE.Mesh(geo, solidMat);
      solidMesh.castShadow = true;
      solidMesh.receiveShadow = true;
      solidGroup.add(solidMesh);

      // 7b. Make Corresponding Wireframe Edges
      const edges = new THREE.EdgesGeometry(geo);
      const wireLineMat = new THREE.LineBasicMaterial({
        color: wireLineColor,
        transparent: true,
        opacity: opacity,
        clippingPlanes: [wireClipPlane]
      });
      const wireLine = new THREE.LineSegments(edges, wireLineMat);
      wireGroup.add(wireLine);

      return { solidMesh, wireLine };
    };

    // 8. Constructing the 2-Story Modern House Model
    // 8a. Slabs
    const groundSlabGeo = new THREE.BoxGeometry(4.2, 0.12, 3.4);
    groundSlabGeo.translate(0, Y_GROUND + 0.06, 0);
    const groundSlab = registerRenderMesh(groundSlabGeo, floorSlabMaterial, 0xa3a3a3, 0.7);

    const firstFloorSlabGeo = new THREE.BoxGeometry(4.4, 0.12, 3.4);
    firstFloorSlabGeo.translate(0.1, Y_GROUND + 1.25 + 0.06, 0); // slightly offsets for architectural layering
    const firstFloorSlab = registerRenderMesh(firstFloorSlabGeo, floorSlabMaterial, 0xe05c38, 0.9);

    // Balcony / Patio Extension
    const balconySlabGeo = new THREE.BoxGeometry(1.5, 0.06, 1.2);
    balconySlabGeo.translate(-1.45, Y_GROUND + 1.25 + 0.03, 1.1);
    const balconySlab = registerRenderMesh(balconySlabGeo, floorSlabMaterial, 0xa3a3a3, 0.75);

    // 8b. Heavy Concrete Structural Columns
    const colCoords = [
      [-1.9, -1.5], [-1.9, 1.5],
      [1.9, -1.5], [1.9, 1.5],
      [0.0, -1.5], [0.0, 1.5]
    ];

    colCoords.forEach(([cx, cz]) => {
      // Ground to 1st slab column
      const colGeo1 = new THREE.BoxGeometry(0.14, 1.25, 0.14);
      colGeo1.translate(cx, Y_GROUND + 1.25 / 2, cz);
      registerRenderMesh(colGeo1, metalFrameMaterial, 0x10b981, 0.82);

      // 1st to Roof column
      const colGeo2 = new THREE.BoxGeometry(0.12, 1.25, 0.12);
      colGeo2.translate(cx, Y_GROUND + 1.25 + 1.25 / 2, cz);
      registerRenderMesh(colGeo2, metalFrameMaterial, 0x10b981, 0.82);
    });

    // 8c. Incomplete/Mid-Construction Concrete Walls
    // Back Ground level Wall (Solid)
    const gWallBackGeo = new THREE.BoxGeometry(4.0, 1.25, 0.15);
    gWallBackGeo.translate(0, Y_GROUND + 1.25 / 2, -1.5);
    registerRenderMesh(gWallBackGeo, wallMaterial, 0x737373, 0.6);

    // Ground Side Wall (With a panoramic glass cutout framework)
    const gWallRightGeo = new THREE.BoxGeometry(0.15, 1.25, 1.8);
    gWallRightGeo.translate(1.95, Y_GROUND + 1.25 / 2, 0.6);
    registerRenderMesh(gWallRightGeo, wallMaterial, 0x737373, 0.6);

    // First Floor Left Cantilever Wall (Exposed masonry block aesthetic)
    const fWallLeftGeo = new THREE.BoxGeometry(0.15, 1.15, 2.6);
    fWallLeftGeo.translate(-1.95, Y_GROUND + 1.25 + 1.15 / 2, -0.2);
    registerRenderMesh(fWallLeftGeo, brickMaterial, 0xf59e0b, 0.9);

    // First Floor Rear Bedroom wall partition
    const fWallBackGeo = new THREE.BoxGeometry(3.0, 1.15, 0.12);
    fWallBackGeo.translate(0.5, Y_GROUND + 1.25 + 1.15 / 2, -1.4);
    registerRenderMesh(fWallBackGeo, wallMaterial, 0x737373, 0.6);

    // 8d. Glass Elements (For clear light bounces and reflection depth)
    const windowGlassGeo = new THREE.BoxGeometry(1.6, 1.15, 0.05);
    windowGlassGeo.translate(0.8, Y_GROUND + 1.25 + 1.15 / 2, 1.5);
    const glassPane = registerRenderMesh(windowGlassGeo, glassMaterial, 0xffffff, 0.4);

    const windowMetalBorderGeo = new THREE.BoxGeometry(1.64, 1.19, 0.08);
    windowMetalBorderGeo.translate(0.8, Y_GROUND + 1.25 + 1.15 / 2, 1.52);
    registerRenderMesh(windowMetalBorderGeo, metalFrameMaterial, 0x3b82f6, 0.7);

    // 8e. Beautiful Exposed wooden roof trusses (Roof structure in building mid-stage)
    // Truss A chord - back, middle, front rafters
    const trussYLoc = Y_GROUND + 2.5;
    const generateTrussSet = (zOffset: number) => {
      const g = new THREE.Group();

      // Lower chord beam (horizontal timber)
      const bottomChordGeo = new THREE.BoxGeometry(4.4, 0.08, 0.08);
      bottomChordGeo.translate(0, trussYLoc, zOffset);
      const bottomCh = registerRenderMesh(bottomChordGeo, woodMaterial, 0xf59e0b, 0.95);

      // Left rafter diagonal (teak wood)
      const leftRafterGeo = new THREE.BoxGeometry(2.4, 0.08, 0.08);
      const angle = 0.46; // rad about 26 deg
      leftRafterGeo.rotateZ(angle);
      leftRafterGeo.translate(-1.1, trussYLoc + 0.5, zOffset);
      const leftRf = registerRenderMesh(leftRafterGeo, woodMaterial, 0xf59e0b, 0.95);

      // Right rafter diagonal
      const rightRafterGeo = new THREE.BoxGeometry(2.4, 0.08, 0.08);
      rightRafterGeo.rotateZ(-angle);
      rightRafterGeo.translate(1.1, trussYLoc + 0.5, zOffset);
      const rightRf = registerRenderMesh(rightRafterGeo, woodMaterial, 0xf59e0b, 0.95);

      // Vertical Kingpost strut center
      const kingpostGeo = new THREE.BoxGeometry(0.08, 1.0, 0.08);
      kingpostGeo.translate(0, trussYLoc + 0.5, zOffset);
      const kingp = registerRenderMesh(kingpostGeo, woodMaterial, 0xf59e0b, 0.95);

      // Sub-diagonal structural braces inside the truss frame (V shape)
      const braceLGeo = new THREE.BoxGeometry(1.2, 0.06, 0.06);
      braceLGeo.rotateZ(-0.6);
      braceLGeo.translate(-0.8, trussYLoc + 0.3, zOffset);
      registerRenderMesh(braceLGeo, woodMaterial, 0xd97706, 0.85);

      const braceRGeo = new THREE.BoxGeometry(1.2, 0.06, 0.06);
      braceRGeo.rotateZ(0.6);
      braceRGeo.translate(0.8, trussYLoc + 0.3, zOffset);
      registerRenderMesh(braceRGeo, woodMaterial, 0xd97706, 0.85);
    };

    // Make 3 structural trusses across depth of house
    generateTrussSet(-1.4);
    generateTrussSet(0);
    generateTrussSet(1.4);

    // Parallel wooden roof purlins running perpendicular to trusses
    const generatePurlin = (xOffset: number, yOffset: number) => {
      const purlinGeo = new THREE.BoxGeometry(0.06, 0.06, 3.2);
      purlinGeo.translate(xOffset, trussYLoc + yOffset, 0);
      registerRenderMesh(purlinGeo, woodMaterial, 0xf59e0b, 0.9);
    };

    generatePurlin(-2.0, 0.1);
    generatePurlin(-1.0, 0.55);
    generatePurlin(0.0, 1.04);
    generatePurlin(1.0, 0.55);
    generatePurlin(2.0, 0.1);

    // 9. Generate Detailed Metallic Steel Scaffolding Cage
    // Build towers flanking the building coordinates:
    // Towers locations at X: [-2.6, 2.6], Z: [-2.2, 2.2]
    // Intermediate connectors along walls to enclose the visual frame.

    const scaffoldingPoles: THREE.Mesh[] = [];
    const heightLevels = [Y_GROUND, Y_GROUND + 1.25, Y_GROUND + 2.50];
    const towerGridX = [-2.6, -1.3, 1.3, 2.6];
    const towerGridZ = [-2.2, 0, 2.2];

    // Helper to add cylindrical scaffolding pole with shadow, metalness, and unique ID
    const addScaffoldPole = (
      start: THREE.Vector3,
      end: THREE.Vector3,
      isVertical: boolean = false
    ) => {
      const distance = start.distanceTo(end);
      const cylinderGeo = new THREE.CylinderGeometry(0.02, 0.02, distance, 5);
      
      // Orient cylinder towards path
      const direction = new THREE.Vector3().subVectors(end, start);
      direction.normalize();
      
      const alignAxis = new THREE.Vector3(0, 1, 0); // Default cylinder points up (Y)
      const q = new THREE.Quaternion().setFromUnitVectors(alignAxis, direction);
      cylinderGeo.applyQuaternion(q);
      
      // Position midpoint
      const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      cylinderGeo.translate(midPoint.x, midPoint.y, midPoint.z);

      // Create distinctive standard metallic silver cylinder with solid clipping plane
      const poleSolidMat = new THREE.MeshStandardMaterial({
        color: 0xe2e8f0, // bright construction steel
        metalness: 0.95,
        roughness: 0.1,
        clippingPlanes: [solidClipPlane]
      });

      // Create glowing blue emissive material for interactive hovers
      const poleGlowMat = new THREE.MeshStandardMaterial({
        color: 0x3b82f6,
        emissive: 0x60a5fa,
        emissiveIntensity: 2.8,
        metalness: 0.2,
        roughness: 0.1,
        clippingPlanes: [solidClipPlane]
      });

      const solidMesh = new THREE.Mesh(cylinderGeo, poleSolidMat);
      solidMesh.castShadow = true;
      solidMesh.receiveShadow = true;
      
      // Generate unique identifier
      const uuidString = `scaffold-${Math.random().toString(36).substr(2, 9)}`;
      solidMesh.name = uuidString;
      
      scaffoldingGroup.add(solidMesh);
      scaffoldingPoles.push(solidMesh);
      scaffoldingMeshesRef.current.push(solidMesh);
      scaffoldingMaterialsRef.current.set(uuidString, { std: poleSolidMat, glow: poleGlowMat });

      // Create corresponding wireframe glowing line matching the requested wireframe half
      const edgeGeo = new THREE.EdgesGeometry(cylinderGeo);
      const wireMat = new THREE.LineBasicMaterial({
        color: 0xffffff, // pure white glow wire
        transparent: true,
        opacity: 0.82,
        clippingPlanes: [wireClipPlane]
      });
      const wireSegments = new THREE.LineSegments(edgeGeo, wireMat);
      wireGroup.add(wireSegments);

      // Store start position relative meta data for the dynamic grow animation on initial load
      solidMesh.userData = {
        isVertical,
        originalY: midPoint.y,
        originalHeight: distance,
        baseY: Math.min(start.y, end.y),
        startVec: start.clone(),
        endVec: end.clone()
      };
    };

    // 9a. Standardize base poles (Vertical pipes) rising to 3.2m height
    const totalScaffoldHeight = 3.6;
    towerGridX.forEach(tx => {
      towerGridZ.forEach(tz => {
        // Exclude inside interior blockages for safety
        if (Math.abs(tx) === 1.3 && tz === 0) return;

        const bottom = new THREE.Vector3(tx, Y_GROUND, tz);
        const top = new THREE.Vector3(tx, Y_GROUND + totalScaffoldHeight, tz);
        addScaffoldPole(bottom, top, true);
      });
    });

    // 9b. Horizontal pipe ledger levels & Cross-Bracings
    heightLevels.forEach((hY, lvlIdx) => {
      // Draw perimeter horizontal ledger guidelines connecting columns
      towerGridX.forEach((tx1, xIdx) => {
        towerGridX.forEach((tx2, xIdx2) => {
          // Join adjacent items horizontally in X grid direction
          if (Math.abs(xIdx - xIdx2) === 1) {
            towerGridZ.forEach(tz => {
              const start = new THREE.Vector3(tx1, hY, tz);
              const end = new THREE.Vector3(tx2, hY, tz);
              addScaffoldPole(start, end, false);
            });
          }
        });
      });

      towerGridZ.forEach((tz1, zIdx) => {
        towerGridZ.forEach((tz2, zIdx2) => {
          // Join adjacent items horizontally in Z grid direction
          if (Math.abs(zIdx - zIdx2) === 1) {
            towerGridX.forEach(tx => {
              const start = new THREE.Vector3(tx, hY, tz1);
              const end = new THREE.Vector3(tx, hY, tz2);
              addScaffoldPole(start, end, false);
            });
          }
        });
      });

      // 9c. Engineering Diagonal sway cross bracing loops
      for (let xIdx = 0; xIdx < towerGridX.length - 1; xIdx++) {
        const tx1 = towerGridX[xIdx];
        const tx2 = towerGridX[xIdx + 1];
        towerGridZ.forEach(tz => {
          // Front or rear outer panels diagonal braces
          if (tz !== 0 && lvlIdx < heightLevels.length - 1) {
            const nextHY = heightLevels[lvlIdx + 1];
            // Alternates direction of structural diagonal bars
            if ((xIdx + lvlIdx) % 2 === 0) {
              addScaffoldPole(
                new THREE.Vector3(tx1, hY, tz),
                new THREE.Vector3(tx2, nextHY, tz),
                false
              );
            } else {
              addScaffoldPole(
                new THREE.Vector3(tx2, hY, tz),
                new THREE.Vector3(tx1, nextHY, tz),
                false
              );
            }
          }
        });
      }
    });

    // 9d. Wooden Scaffold deck planks on 2nd level for builder walk boards
    const plankGeo1 = new THREE.BoxGeometry(2.4, 0.04, 0.35);
    plankGeo1.translate(-1.3, Y_GROUND + 1.25 + 0.02, 2.2);
    registerRenderMesh(plankGeo1, woodMaterial, 0xf59e0b, 0.85);

    const plankGeo2 = new THREE.BoxGeometry(2.4, 0.04, 0.35);
    plankGeo2.translate(1.3, Y_GROUND + 1.25 + 0.02, -2.2);
    registerRenderMesh(plankGeo2, woodMaterial, 0xf59e0b, 0.85);

    // 10. Dynamic Ground Blueprint Grid Layout (Very faint subtle grey references under white theme)
    const architecturalGrid = new THREE.GridHelper(10, 20, 0x9ca3af, 0xe5e7eb);
    if (architecturalGrid.material instanceof THREE.Material) {
      architecturalGrid.material.transparent = true;
      architecturalGrid.material.opacity = 0.3;
    }
    architecturalGrid.position.y = Y_GROUND;
    scene.add(architecturalGrid);

    // 11. Mouse Coordinate Trackers for Pointerhover interactions
    const mouse = new THREE.Vector2();
    let currentHoveredPole: THREE.Mesh | null = null;
    const raycaster = new THREE.Raycaster();

    const handlePointerMove = (event: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Normalize coordinates
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    window.addEventListener('mousemove', handlePointerMove);

    // 12. RUN DYNAMIC ITERATIVE ASSEMBLY ANIMATION ON MOUNT (Stunning sequential construct flow)
    // First, temporarily hide groups or set standard start positions for animated items
    solidGroup.position.y = 1.5;
    solidGroup.scale.set(0.92, 0.92, 0.92);
    const materialsInGroup: THREE.Material[] = [];
    solidGroup.traverse(object => {
      if (object instanceof THREE.Mesh) {
        if (Array.isArray(object.material)) {
          object.material.forEach(m => {
            m.transparent = true;
            m.opacity = 0;
            materialsInGroup.push(m);
          });
        } else if (object.material) {
          object.material.transparent = true;
          object.material.opacity = 0;
          materialsInGroup.push(object.material);
        }
      }
    });

    wireGroup.traverse(object => {
      if (object instanceof THREE.LineSegments || object instanceof THREE.Line) {
        if (object.material instanceof THREE.Material) {
          object.material.transparent = true;
          object.material.opacity = 0;
        }
      }
    });

    // Make scaffolding grow from ground
    scaffoldingPoles.forEach(pole => {
      pole.scale.set(1, 0.0001, 1);
      // anchor positions at base
      const bY = pole.userData.baseY;
      pole.position.y = bY - pole.userData.originalY;
    });

    const timeline = gsap.timeline();

    // Sequence step 1: Scaffolding poles rise and lock first!
    scaffoldingPoles.forEach((pole, i) => {
      // Stagger vertical poles slightly first, then horizontals
      const delay = pole.userData.isVertical ? (i % 6) * 0.05 + 0.1 : (i % 12) * 0.04 + 0.5;
      
      timeline.to(pole.scale, {
        y: 1,
        duration: 0.95,
        ease: 'back.out(1.15)',
      }, delay);

      timeline.to(pole.position, {
        y: 0,
        duration: 0.95,
        ease: 'back.out(1.15)',
      }, delay);
    });

    // Sequence step 2: solid walls drop, scale and lock in
    timeline.to(solidGroup.position, {
      y: 0,
      duration: 1.6,
      ease: 'bounce.out',
    }, 1.2);

    timeline.to(solidGroup.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 1.4,
      ease: 'power3.out',
    }, 1.2);

    // Restore opacities gently
    materialsInGroup.forEach(mat => {
      // Fade in solid physical materials
      timeline.to(mat, {
        opacity: mat === glassMaterial ? 0.35 : 1,
        duration: 1.2,
        ease: 'power2.inOut',
      }, 1.3);
    });

    // Sequence step 3: Wireframe copy slides and fades in synchronously
    wireGroup.traverse(object => {
      if (object instanceof THREE.LineSegments || object instanceof THREE.Line) {
        if (object.material instanceof THREE.Material) {
          const targetOp = object.material === boldWireMaterial ? 0.9 : 0.72;
          timeline.to(object.material, {
            opacity: targetOp,
            duration: 1.4,
            ease: 'power2.out',
          }, 1.6);
        }
      }
    });

    // 13. Rendering Frame Clock Loop
    let clock = new THREE.Clock();
    let animationFrameId: number;

    const tick = () => {
      const elapsed = clock.getElapsedTime();

      // Slow orbital rotate transition to keep it feeling living and three-dimensional
      assemblyGroup.rotation.y = Math.sin(elapsed * 0.1) * 0.22;

      // Update control interactions
      controls.update();

      // Dynamic pointer raycast for interactive blue glow scaffold highlighting
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scaffoldingMeshesRef.current);

      if (intersects.length > 0) {
        const intersectedMesh = intersects[0].object as THREE.Mesh;
        if (currentHoveredPole !== intersectedMesh) {
          // Reset previous hovered pole material
          if (currentHoveredPole) {
            const mats = scaffoldingMaterialsRef.current.get(currentHoveredPole.name);
            if (mats) currentHoveredPole.material = mats.std;
          }
          // Set glow blue material
          currentHoveredPole = intersectedMesh;
          const mats = scaffoldingMaterialsRef.current.get(currentHoveredPole.name);
          if (mats) {
            currentHoveredPole.material = mats.glow;
          }
        }
      } else {
        if (currentHoveredPole) {
          const mats = scaffoldingMaterialsRef.current.get(currentHoveredPole.name);
          if (mats) {
            currentHoveredPole.material = mats.std;
          }
          currentHoveredPole = null;
        }
      }

      // Render updated buffer
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    // 14. Responsive boundaries listener
    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(containerRef.current);

    // 15. Garbage cleaning cycle on leave
    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.dispose();
      scene.clear();
    };
  }, []);

  // Hot dynamic state triggers - reset camera on changing portfolio indexes
  useEffect(() => {
    if (!cameraRef.current || !controlsRef.current) return;
    
    // Smooth architectural camera pivot on selecting alternative designs
    const targetTheta = (activeIdx * (Math.PI / 3)) % (Math.PI * 2);
    const radius = 9.5;
    const destX = radius * Math.cos(targetTheta) * 0.6;
    const destZ = radius * Math.sin(targetTheta) * 0.6;
    
    gsap.to(cameraRef.current.position, {
      x: destX + 4.5,
      y: 4.0 + (activeIdx % 2) * 0.5,
      z: destZ + 6.0,
      duration: 1.5,
      ease: 'power3.out',
    });
  }, [activeIdx]);

  if (!webglSupported) {
    return (
      <div className="absolute inset-0 w-full h-full bg-white flex flex-col items-center justify-center p-6 text-center select-none">
        <span className="text-[#E05C38] font-mono text-xs uppercase tracking-widest block font-bold mb-2">
          WebGL Diperlukan
        </span>
        <span className="text-zinc-400 font-sans text-[10px] max-w-xs leading-relaxed">
          Aktifkan akselerasi perangkat keras pada penelusur web Anda untuk melihat representasi rancang grafis 3D digital interaktif.
        </span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden"
      id="three-blueprint-root"
    >
      <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />
    </div>
  );
}
