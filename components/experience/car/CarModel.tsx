"use client";

import SpringValue from "@/lib/SpringValue";
import {
  CAR_SCENES,
  CarSceneKeyframe,
} from "@/lib/sceneKeyframes";
import { useExperienceStore } from "@/store/experienceStore";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  useEffect,
  useMemo,
  useRef,
} from "react";
import {
  Box3,
  Color,
  Group,
  Material,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  Vector3,
} from "three";
import { SkeletonUtils } from "three/examples/jsm/Addons.js";

const MODEL_PATH =
  "/models/revuelto.glb";

const TARGET_LENGTH = 6.2;

type BodyMaterial =
  | MeshStandardMaterial
  | MeshPhysicalMaterial;

interface InterpolatedCarFrame {
  position: {
    x: number;
    y: number;
    z: number;
  };

  rotation: {
    x: number;
    y: number;
    z: number;
  };

  scale: number;
}

function smoothstep(value: number) {
  const safe = MathUtils.clamp(
    value,
    0,
    1,
  );

  return (
    safe *
    safe *
    (3 - 2 * safe)
  );
}

function interpolateCarFrame(
  progress: number,
): InterpolatedCarFrame {
  let start: CarSceneKeyframe =
    CAR_SCENES[0];

  let end: CarSceneKeyframe =
    CAR_SCENES[
      CAR_SCENES.length - 1
    ];

  for (
    let index = 0;
    index <
    CAR_SCENES.length - 1;
    index += 1
  ) {
    const current =
      CAR_SCENES[index];

    const next =
      CAR_SCENES[index + 1];

    if (
      progress >= current.progress &&
      progress <= next.progress
    ) {
      start = current;
      end = next;
      break;
    }
  }

  const range =
    end.progress - start.progress;

  const localProgress =
    range === 0
      ? 0
      : (progress -
          start.progress) /
        range;

  const eased =
    smoothstep(localProgress);

  return {
    position: {
      x: MathUtils.lerp(
        start.position.x,
        end.position.x,
        eased,
      ),

      y: MathUtils.lerp(
        start.position.y,
        end.position.y,
        eased,
      ),

      z: MathUtils.lerp(
        start.position.z,
        end.position.z,
        eased,
      ),
    },

    rotation: {
      x: MathUtils.lerp(
        start.rotation.x,
        end.rotation.x,
        eased,
      ),

      y: MathUtils.lerp(
        start.rotation.y,
        end.rotation.y,
        eased,
      ),

      z: MathUtils.lerp(
        start.rotation.z,
        end.rotation.z,
        eased,
      ),
    },

    scale: MathUtils.lerp(
      start.scale,
      end.scale,
      eased,
    ),
  };
}

function looksLikeBodyMaterial(
  material: BodyMaterial,
  objectName: string,
) {
  const combinedName =
    `${material.name} ${objectName}`.toLowerCase();

  if (
    combinedName.includes("body") ||
    combinedName.includes("paint") ||
    combinedName.includes("exterior") ||
    combinedName.includes("carpaint") ||
    combinedName.includes("bodywork") ||
    combinedName.includes("orange")
  ) {
    return true;
  }

  const { r, g, b } =
    material.color;

  return (
    r > 0.25 &&
    r > g * 1.15 &&
    g > b * 1.15
  );
}

function prepareModel(
  root: Object3D,
) {
  const bodyMaterials:
    BodyMaterial[] = [];

  root.traverse((object) => {
    if (!(object instanceof Mesh)) {
      return;
    }

    object.castShadow = true;
    object.receiveShadow = true;

    const originalMaterials =
      Array.isArray(object.material)
        ? object.material
        : [object.material];

    const clonedMaterials =
      originalMaterials.map(
        (material) =>
          material.clone(),
      );

    object.material =
      Array.isArray(object.material)
        ? clonedMaterials
        : clonedMaterials[0];

    clonedMaterials.forEach(
      (material: Material) => {
        material.needsUpdate = true;

        if (
          !(
            material instanceof
              MeshStandardMaterial ||
            material instanceof
              MeshPhysicalMaterial
          )
        ) {
          return;
        }

        const combinedName =
          `${material.name} ${object.name}`.toLowerCase();

        const glass =
          combinedName.includes(
            "glass",
          ) ||
          combinedName.includes(
            "window",
          ) ||
          combinedName.includes(
            "windshield",
          );

        const tyre =
          combinedName.includes(
            "tire",
          ) ||
          combinedName.includes(
            "tyre",
          ) ||
          combinedName.includes(
            "rubber",
          );

        const wheel =
          combinedName.includes(
            "wheel",
          ) ||
          combinedName.includes(
            "rim",
          ) ||
          combinedName.includes(
            "chrome",
          );

        if (glass) {
          material.transparent = true;
          material.opacity = Math.min(
            material.opacity,
            0.75,
          );
          material.roughness = 0.08;
        }

        if (tyre) {
          material.metalness = 0;
          material.roughness = 0.84;
        }

        if (wheel) {
          material.metalness = 0.92;
          material.roughness = 0.2;
        }

        if (
          looksLikeBodyMaterial(
            material,
            object.name,
          )
        ) {
          material.metalness = 0.78;
          material.roughness = 0.2;

          if (
            material instanceof
            MeshPhysicalMaterial
          ) {
            material.clearcoat = 1;
            material.clearcoatRoughness =
              0.08;
          }

          bodyMaterials.push(
            material,
          );
        }
      },
    );
  });

  return bodyMaterials;
}

function normalizeModel(
  root: Object3D,
) {
  root.updateMatrixWorld(true);

  const bounds =
    new Box3().setFromObject(root);

  const size = new Vector3();
  const center = new Vector3();

  bounds.getSize(size);
  bounds.getCenter(center);

  const horizontalLength =
    Math.max(size.x, size.z);

  if (
    !Number.isFinite(
      horizontalLength,
    ) ||
    horizontalLength <= 0
  ) {
    return;
  }

  const normalizedScale =
    TARGET_LENGTH /
    horizontalLength;

  root.scale.setScalar(
    normalizedScale,
  );

  root.position.set(
    -center.x * normalizedScale,
    -center.y * normalizedScale,
    -center.z * normalizedScale,
  );

  root.updateMatrixWorld(true);

  const normalizedBounds =
    new Box3().setFromObject(root);

  root.position.y -=
    normalizedBounds.min.y;
}

export default function CarModel() {
  const movementGroup =
    useRef<Group>(null);

  const dragGroup =
    useRef<Group>(null);

  const scrollProgress =
    useExperienceStore(
      (state) =>
        state.scrollProgress,
    );

  const scrollVelocity =
    useExperienceStore(
      (state) =>
        state.scrollVelocity,
    );

  const selectedColor =
    useExperienceStore(
      (state) =>
        state.selectedColor,
    );

  const dragRotation =
    useExperienceStore(
      (state) =>
        state.dragRotation,
    );

  const dragVelocity =
    useExperienceStore(
      (state) =>
        state.dragVelocity,
    );

  const isDragging =
    useExperienceStore(
      (state) => state.isDragging,
    );

  const setDragMotion =
    useExperienceStore(
      (state) =>
        state.setDragMotion,
    );

  const { scene } =
    useGLTF(MODEL_PATH);

  const preparedModel =
    useMemo(() => {
      const clone =
        SkeletonUtils.clone(scene);

      const bodyMaterials =
        prepareModel(clone);

      normalizeModel(clone);

      return {
        scene: clone,
        bodyMaterials,
      };
    }, [scene]);

  const targetColor =
    useRef(
      new Color(selectedColor),
    );

  useEffect(() => {
    targetColor.current.set(
      selectedColor,
    );
  }, [selectedColor]);

  const springs = useRef({
    x: new SpringValue(
      CAR_SCENES[0].position.x,
      90,
      16,
    ),

    y: new SpringValue(
      CAR_SCENES[0].position.y,
      95,
      17,
    ),

    z: new SpringValue(
      CAR_SCENES[0].position.z,
      90,
      16,
    ),

    rotationX: new SpringValue(
      CAR_SCENES[0].rotation.x,
      82,
      15,
    ),

    rotationY: new SpringValue(
      CAR_SCENES[0].rotation.y,
      72,
      14,
    ),

    rotationZ: new SpringValue(
      CAR_SCENES[0].rotation.z,
      82,
      15,
    ),

    scale: new SpringValue(
      CAR_SCENES[0].scale,
      90,
      16,
    ),
  });

  useFrame((state, delta) => {
    const movement =
      movementGroup.current;

    const drag =
      dragGroup.current;

    if (!movement || !drag) {
      return;
    }

    const target =
      interpolateCarFrame(
        scrollProgress,
      );

    /*
     * Add speed-dependent bank and pitch.
     * This makes the car feel reactive while
     * passing between sections.
     */
    const bank = MathUtils.clamp(
      -scrollVelocity * 0.16,
      -0.18,
      0.18,
    );

    const pitch = MathUtils.clamp(
      scrollVelocity * 0.11,
      -0.12,
      0.12,
    );

    springs.current.x.setTarget(
      target.position.x,
    );

    springs.current.y.setTarget(
      target.position.y,
    );

    springs.current.z.setTarget(
      target.position.z,
    );

    springs.current.rotationX.setTarget(
      target.rotation.x + pitch,
    );

    springs.current.rotationY.setTarget(
      target.rotation.y,
    );

    springs.current.rotationZ.setTarget(
      target.rotation.z + bank,
    );

    springs.current.scale.setTarget(
      target.scale,
    );

    movement.position.set(
      springs.current.x.update(
        delta,
      ),
      springs.current.y.update(
        delta,
      ),
      springs.current.z.update(
        delta,
      ),
    );

    movement.rotation.set(
      springs.current.rotationX.update(
        delta,
      ),
      springs.current.rotationY.update(
        delta,
      ),
      springs.current.rotationZ.update(
        delta,
      ),
    );

    const scale =
      springs.current.scale.update(
        delta,
      );

    movement.scale.setScalar(scale);

    /*
     * Mouse-drag inertia.
     */
    let nextDragRotation =
      dragRotation;

    let nextDragVelocity =
      dragVelocity;

    if (!isDragging) {
      nextDragRotation +=
        nextDragVelocity * delta;

      nextDragVelocity *=
        Math.pow(0.025, delta);

      if (
        Math.abs(nextDragVelocity) <
        0.0005
      ) {
        nextDragVelocity = 0;
      }

      if (
        nextDragVelocity !==
          dragVelocity ||
        nextDragRotation !==
          dragRotation
      ) {
        setDragMotion(
          nextDragRotation,
          nextDragVelocity,
        );
      }
    }

    drag.rotation.y =
      nextDragRotation;

    /*
     * Very subtle idle movement.
     */
    drag.position.y =
      Math.sin(
        state.clock.elapsedTime *
          0.65,
      ) * 0.006;

    /*
     * Smooth body-paint transition.
     */
    preparedModel.bodyMaterials.forEach(
      (material) => {
        material.color.lerp(
          targetColor.current,
          Math.min(delta * 5, 1),
        );
      },
    );
  });

  return (
    <group
      ref={movementGroup}
      position={[
        CAR_SCENES[0].position.x,
        CAR_SCENES[0].position.y,
        CAR_SCENES[0].position.z,
      ]}
      rotation={[
        CAR_SCENES[0].rotation.x,
        CAR_SCENES[0].rotation.y,
        CAR_SCENES[0].rotation.z,
      ]}
    >
      <group ref={dragGroup}>
        <primitive
          object={preparedModel.scene}
          dispose={null}
        />
      </group>
    </group>
  );
}

useGLTF.preload(MODEL_PATH);