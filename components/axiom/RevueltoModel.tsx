"use client";

import { SpringValue } from "@/components/axiom/spring";
import {
  ORIGINAL_CAR_COLOUR,
  type MotionRef,
} from "@/components/axiom/types";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  Box3,
  Color,
  EdgesGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Material,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  Texture,
  Vector3,
} from "three";
import { SkeletonUtils } from "three/examples/jsm/Addons.js";

interface RevueltoModelProps {
  motionRef: MotionRef;
  selectedColour: string;
  activeChapter: number;
}

interface SceneFrame {
  progress: number;
  x: number;
  y: number;
  z: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  scale: number;
}

type SupportedMaterial =
  | MeshStandardMaterial
  | MeshPhysicalMaterial;

interface ConfigurablePaintRecord {
  material: SupportedMaterial;
  originalColor: Color;
  originalMap: Texture | null;
  originalMetalness: number;
  originalRoughness: number;
  originalTransparent: boolean;
  originalOpacity: number;
  originalDepthWrite: boolean;
}

const MODEL_PATH = "/models/revuelto.glb";
const TARGET_LENGTH = 6.4;
const BLUEPRINT_COLOUR = "#37b7df";

const BODY_PAINT_MATERIAL_NAMES = new Set([
  "Material.012",
]);

const FRAMES: SceneFrame[] = [
  {
    progress: 0,
    x: 0.9,
    y: -0.88,
    z: 0,
    rotationX: 0.02,
    rotationY: -0.55,
    rotationZ: 0,
    scale: 0.98,
  },
  {
    progress: 0.23,
    x: 0.15,
    y: -0.52,
    z: 0.05,
    rotationX: -0.05,
    rotationY: Math.PI * 2 + 0.15,
    rotationZ: -0.04,
    scale: 1.06,
  },
  {
    progress: 0.46,
    x: 0.85,
    y: -0.66,
    z: 0.18,
    rotationX: 0.07,
    rotationY: Math.PI * 4 + 0.75,
    rotationZ: 0.07,
    scale: 1.18,
  },
  {
    progress: 0.69,
    x: -0.9,
    y: -0.42,
    z: -0.1,
    rotationX: -0.06,
    rotationY: Math.PI * 6 + 1.35,
    rotationZ: -0.09,
    scale: 1.08,
  },
  {
    progress: 0.87,
    x: 0.05,
    y: -0.58,
    z: 0.12,
    rotationX: 0.05,
    rotationY: Math.PI * 8 + 2.15,
    rotationZ: 0.05,
    scale: 1.22,
  },
  {
    progress: 1,
    x: 0.75,
    y: -0.88,
    z: 0,
    rotationX: 0,
    rotationY: Math.PI * 10 + 2.65,
    rotationZ: 0,
    scale: 1,
  },
];

function smoothstep(value: number) {
  const safeValue = MathUtils.clamp(value, 0, 1);

  return safeValue * safeValue * (3 - 2 * safeValue);
}

function getFrame(progress: number) {
  let start = FRAMES[0];
  let end = FRAMES[FRAMES.length - 1];

  for (
    let index = 0;
    index < FRAMES.length - 1;
    index += 1
  ) {
    const current = FRAMES[index];
    const next = FRAMES[index + 1];

    if (
      progress >= current.progress &&
      progress <= next.progress
    ) {
      start = current;
      end = next;
      break;
    }
  }

  const range = end.progress - start.progress;

  const localProgress =
    range === 0
      ? 0
      : MathUtils.clamp(
          (progress - start.progress) / range,
          0,
          1,
        );

  const eased = smoothstep(localProgress);

  return {
    x: MathUtils.lerp(start.x, end.x, eased),
    y: MathUtils.lerp(start.y, end.y, eased),
    z: MathUtils.lerp(start.z, end.z, eased),

    rotationX: MathUtils.lerp(
      start.rotationX,
      end.rotationX,
      eased,
    ),

    rotationY: MathUtils.lerp(
      start.rotationY,
      end.rotationY,
      eased,
    ),

    rotationZ: MathUtils.lerp(
      start.rotationZ,
      end.rotationZ,
      eased,
    ),

    scale: MathUtils.lerp(
      start.scale,
      end.scale,
      eased,
    ),
  };
}

function prepareNormalModel(root: Object3D) {
  const configurablePaint: ConfigurablePaintRecord[] = [];
  const allMaterials: SupportedMaterial[] = [];

  root.traverse((object) => {
    if (!(object instanceof Mesh)) {
      return;
    }

    object.castShadow = true;
    object.receiveShadow = true;

    const sourceMaterials = Array.isArray(object.material)
      ? object.material
      : [object.material];

    const preparedMaterials = sourceMaterials.map(
      (sourceMaterial): Material => {
        if (
          !(
            sourceMaterial instanceof MeshStandardMaterial ||
            sourceMaterial instanceof MeshPhysicalMaterial
          )
        ) {
          return sourceMaterial.clone();
        }

        const material = sourceMaterial.clone();

        const combinedName =
          `${material.name} ${object.name}`.toLowerCase();

        const isGlass =
          combinedName.includes("glass") ||
          combinedName.includes("window") ||
          combinedName.includes("windshield");

        const isTyre =
          combinedName.includes("tire") ||
          combinedName.includes("tyre") ||
          combinedName.includes("rubber");

        const isWheel =
          combinedName.includes("wheel") ||
          combinedName.includes("rim") ||
          combinedName.includes("chrome");

        if (isGlass) {
          material.transparent = true;
          material.opacity = Math.min(
            material.opacity,
            0.74,
          );
          material.roughness = 0.08;
        }

        if (isTyre) {
          material.metalness = 0;
          material.roughness = 0.82;
        }

        if (isWheel) {
          material.metalness = 0.92;
          material.roughness = 0.2;
        }

        if (
          BODY_PAINT_MATERIAL_NAMES.has(material.name)
        ) {
          configurablePaint.push({
            material,
            originalColor: material.color.clone(),
            originalMap: material.map ?? null,
            originalMetalness: material.metalness,
            originalRoughness: material.roughness,
            originalTransparent: material.transparent,
            originalOpacity: material.opacity,
            originalDepthWrite: material.depthWrite,
          });
        }

        material.needsUpdate = true;
        allMaterials.push(material);

        return material;
      },
    );

    object.material = Array.isArray(object.material)
      ? preparedMaterials
      : preparedMaterials[0];
  });

  return {
    configurablePaint,
    allMaterials,
  };
}

function normalizeModel(root: Object3D) {
  root.updateMatrixWorld(true);

  const bounds = new Box3().setFromObject(root);
  const size = new Vector3();
  const center = new Vector3();

  bounds.getSize(size);
  bounds.getCenter(center);

  const horizontalLength = Math.max(size.x, size.z);

  if (
    !Number.isFinite(horizontalLength) ||
    horizontalLength <= 0
  ) {
    return;
  }

  const normalizedScale =
    TARGET_LENGTH / horizontalLength;

  root.scale.setScalar(normalizedScale);

  root.position.set(
    -center.x * normalizedScale,
    -center.y * normalizedScale,
    -center.z * normalizedScale,
  );

  root.updateMatrixWorld(true);

  const normalizedBounds =
    new Box3().setFromObject(root);

  root.position.y -= normalizedBounds.min.y;
}

function createEdgeModel(source: Object3D) {
  const edgeRoot = new Group();
  const edgeMaterials: LineBasicMaterial[] = [];

  source.updateMatrixWorld(true);

  source.traverse((object) => {
    if (!(object instanceof Mesh) || !object.geometry) {
      return;
    }

    const edgeGeometry = new EdgesGeometry(
      object.geometry,
      28,
    );

    const edgeMaterial = new LineBasicMaterial({
      color: BLUEPRINT_COLOUR,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      depthTest: true,
      toneMapped: true,
    });

    const edgeLines = new LineSegments(
      edgeGeometry,
      edgeMaterial,
    );

    object.updateWorldMatrix(true, false);

    edgeLines.matrix.copy(object.matrixWorld);
    edgeLines.matrixAutoUpdate = false;
    edgeLines.renderOrder = 20;
    edgeLines.frustumCulled = true;

    edgeRoot.add(edgeLines);
    edgeMaterials.push(edgeMaterial);
  });

  return {
    scene: edgeRoot,
    materials: edgeMaterials,
  };
}

export default function RevueltoModel({
  motionRef,
  selectedColour,
  activeChapter,
}: RevueltoModelProps) {
  const { size } = useThree();
  const isMobile = size.width <= 768;

  const movementGroupRef = useRef<Group>(null);
  const dragGroupRef = useRef<Group>(null);

  const previousProgressRef = useRef(0);
  const blueprintBlendRef = useRef(0);

  const selectedColourRef = useRef(selectedColour);
  const targetColourRef = useRef(new Color("#ffffff"));

  const { scene } = useGLTF(MODEL_PATH);

  const preparedModels = useMemo(() => {
    const normalScene = SkeletonUtils.clone(scene);

    const {
      configurablePaint,
      allMaterials,
    } = prepareNormalModel(normalScene);

    normalizeModel(normalScene);

    const edgeModel = createEdgeModel(normalScene);

    return {
      normalScene,
      configurablePaint,
      allMaterials,
      edgeScene: edgeModel.scene,
      edgeMaterials: edgeModel.materials,
    };
  }, [scene]);

  useEffect(() => {
    selectedColourRef.current = selectedColour;

    if (selectedColour !== ORIGINAL_CAR_COLOUR) {
      targetColourRef.current.set(selectedColour);
    }

    preparedModels.configurablePaint.forEach(
      (record) => {
        const useOriginal =
          selectedColour === ORIGINAL_CAR_COLOUR;

        if (useOriginal) {
          record.material.map = record.originalMap;
          record.material.metalness =
            record.originalMetalness;
          record.material.roughness =
            record.originalRoughness;
          record.material.transparent =
            record.originalTransparent;
          record.material.opacity =
            record.originalOpacity;
          record.material.depthWrite =
            record.originalDepthWrite;
        } else {
          record.material.map = null;
          record.material.metalness = 0.78;
          record.material.roughness = 0.2;

          if (
            record.material instanceof
            MeshPhysicalMaterial
          ) {
            record.material.clearcoat = 1;
            record.material.clearcoatRoughness =
              0.06;
          }
        }

        record.material.needsUpdate = true;
      },
    );
  }, [
    preparedModels.configurablePaint,
    selectedColour,
  ]);

  const springsRef = useRef({
    x: new SpringValue(FRAMES[0].x, 88, 16),
    y: new SpringValue(FRAMES[0].y, 95, 17),
    z: new SpringValue(FRAMES[0].z, 88, 16),

    rotationX: new SpringValue(
      FRAMES[0].rotationX,
      80,
      15,
    ),

    rotationY: new SpringValue(
      FRAMES[0].rotationY,
      70,
      14,
    ),

    rotationZ: new SpringValue(
      FRAMES[0].rotationZ,
      80,
      15,
    ),

    scale: new SpringValue(
      FRAMES[0].scale,
      90,
      16,
    ),
  });

  useFrame((state, delta) => {
    const movementGroup = movementGroupRef.current;
    const dragGroup = dragGroupRef.current;

    if (!movementGroup || !dragGroup) {
      return;
    }

    const maximumScroll = Math.max(
      document.documentElement.scrollHeight -
        window.innerHeight,
      1,
    );

    const progress = MathUtils.clamp(
      window.scrollY / maximumScroll,
      0,
      1,
    );

    const progressVelocity =
      (progress - previousProgressRef.current) /
      Math.max(delta, 0.001);

    previousProgressRef.current = progress;

    const frame = getFrame(progress);

    const bank = MathUtils.clamp(
      -progressVelocity * 0.1,
      -0.2,
      0.2,
    );

    const pitch = MathUtils.clamp(
      progressVelocity * 0.07,
      -0.13,
      0.13,
    );

   /*
 * Responsive vehicle placement.
 *
 * Desktop:
 * - Original position and scale remain unchanged.
 *
 * Mobile:
 * - Car is centred horizontally.
 * - Car appears below the chapter text.
 * - Car stays large enough to be clearly visible.
 */
const mobileXMultiplier = isMobile ? 0.03 : 1;

/*
 * Mobile placement tuned for a fixed full-screen canvas.
 * Chapter 1 is centered; later chapters stay slightly lower
 * so the vehicle does not cover the chapter copy.
 */
const mobileYOffset = isMobile
  ? activeChapter === 0
    ? 0.72
    : activeChapter === 1
      ? 0.56
      : activeChapter === 2
        ? 0.58
        : activeChapter === 3
          ? 0.52
          : 0.56
  : 0;

springsRef.current.x.setTarget(
  frame.x * mobileXMultiplier,
);

springsRef.current.y.setTarget(
  frame.y + mobileYOffset,
);

springsRef.current.z.setTarget(frame.z);

springsRef.current.rotationX.setTarget(
  frame.rotationX + pitch,
);

springsRef.current.rotationY.setTarget(
  frame.rotationY,
);

springsRef.current.rotationZ.setTarget(
  frame.rotationZ + bank,
);

springsRef.current.scale.setTarget(
  frame.scale,
);

movementGroup.position.set(
  springsRef.current.x.update(delta),
  springsRef.current.y.update(delta),
  springsRef.current.z.update(delta),
);

movementGroup.rotation.set(
  springsRef.current.rotationX.update(delta),
  springsRef.current.rotationY.update(delta),
  springsRef.current.rotationZ.update(delta),
);

const modelScale =
  springsRef.current.scale.update(delta);

/*
 * 74% scale gives a clearly visible full car on mobile.
 * Desktop remains 100% unchanged.
 */
const responsiveScale = isMobile
  ? modelScale * 0.58
  : modelScale;

movementGroup.scale.setScalar(
  responsiveScale,
);

    if (!motionRef.current.isDragging) {
      motionRef.current.dragRotation +=
        motionRef.current.dragVelocity * delta;

      motionRef.current.dragVelocity *=
        Math.pow(0.018, delta);

      if (
        Math.abs(
          motionRef.current.dragVelocity,
        ) < 0.0005
      ) {
        motionRef.current.dragVelocity = 0;
      }
    }

    dragGroup.rotation.y =
      motionRef.current.dragRotation;

    dragGroup.rotation.x = MathUtils.damp(
      dragGroup.rotation.x,
      motionRef.current.pointerY * 0.035,
      4,
      delta,
    );

    dragGroup.position.y =
      Math.sin(
        state.clock.elapsedTime * 0.7,
      ) * 0.006;

    const useOriginalColour =
      selectedColourRef.current ===
      ORIGINAL_CAR_COLOUR;

    const colourBlend =
      1 - Math.exp(-9 * delta);

    preparedModels.configurablePaint.forEach(
      (record) => {
        if (useOriginalColour) {
          record.material.color.lerp(
            record.originalColor,
            colourBlend,
          );
        } else {
          record.material.color.lerp(
            targetColourRef.current,
            colourBlend,
          );
        }
      },
    );

    const blueprintFadeIn =
      MathUtils.smoothstep(
        progress,
        0.13,
        0.23,
      );

    const blueprintFadeOut =
      1 -
      MathUtils.smoothstep(
        progress,
        0.37,
        0.47,
      );

    const insideBlueprintRange =
      activeChapter === 1 ||
      (progress >= 0.13 && progress <= 0.47);

    const blueprintTarget =
      insideBlueprintRange
        ? blueprintFadeIn * blueprintFadeOut
        : 0;

    blueprintBlendRef.current =
      MathUtils.damp(
        blueprintBlendRef.current,
        blueprintTarget,
        4.8,
        delta,
      );

    const blueprintBlend =
      blueprintBlendRef.current;

    preparedModels.allMaterials.forEach(
      (material) => {
        material.transparent =
          blueprintBlend > 0.005;

        material.opacity = MathUtils.lerp(
          1,
          0.42,
          blueprintBlend,
        );

        material.depthWrite =
          blueprintBlend < 0.75;

        material.needsUpdate = true;
      },
    );

    preparedModels.edgeMaterials.forEach(
      (material) => {
        material.opacity =
          blueprintBlend * 0.38;

        material.color.set(
          BLUEPRINT_COLOUR,
        );

        material.needsUpdate = true;
      },
    );
  });

  return (
    <group
      ref={movementGroupRef}
      position={[
        FRAMES[0].x,
        FRAMES[0].y,
        FRAMES[0].z,
      ]}
      rotation={[
        FRAMES[0].rotationX,
        FRAMES[0].rotationY,
        FRAMES[0].rotationZ,
      ]}
    >
      <group ref={dragGroupRef}>
        <primitive
          object={preparedModels.normalScene}
          dispose={null}
        />

        <primitive
          object={preparedModels.edgeScene}
          dispose={null}
        />
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_PATH);