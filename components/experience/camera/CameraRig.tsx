"use client";

import SpringValue from "@/lib/SpringValue";
import {
  CAMERA_SCENES,
  CameraSceneKeyframe,
} from "@/lib/sceneKeyframes";
import { useExperienceStore } from "@/store/experienceStore";
import {
  useFrame,
  useThree,
} from "@react-three/fiber";
import { useRef } from "react";
import {
  MathUtils,
  PerspectiveCamera,
  Vector3,
} from "three";

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

function getCameraFrame(
  progress: number,
) {
  let start: CameraSceneKeyframe =
    CAMERA_SCENES[0];

  let end: CameraSceneKeyframe =
    CAMERA_SCENES[
      CAMERA_SCENES.length - 1
    ];

  for (
    let index = 0;
    index <
    CAMERA_SCENES.length - 1;
    index += 1
  ) {
    const current =
      CAMERA_SCENES[index];

    const next =
      CAMERA_SCENES[index + 1];

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

  const local =
    range === 0
      ? 0
      : (progress -
          start.progress) /
        range;

  const eased = smoothstep(local);

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

    target: {
      x: MathUtils.lerp(
        start.target.x,
        end.target.x,
        eased,
      ),

      y: MathUtils.lerp(
        start.target.y,
        end.target.y,
        eased,
      ),

      z: MathUtils.lerp(
        start.target.z,
        end.target.z,
        eased,
      ),
    },

    fov: MathUtils.lerp(
      start.fov,
      end.fov,
      eased,
    ),
  };
}

export default function CameraRig() {
  const { camera, pointer } =
    useThree();

  const scrollProgress =
    useExperienceStore(
      (state) =>
        state.scrollProgress,
    );

  const positionSprings =
    useRef({
      x: new SpringValue(
        CAMERA_SCENES[0]
          .position.x,
        72,
        15,
      ),

      y: new SpringValue(
        CAMERA_SCENES[0]
          .position.y,
        72,
        15,
      ),

      z: new SpringValue(
        CAMERA_SCENES[0]
          .position.z,
        72,
        15,
      ),

      targetX: new SpringValue(
        CAMERA_SCENES[0]
          .target.x,
        80,
        16,
      ),

      targetY: new SpringValue(
        CAMERA_SCENES[0]
          .target.y,
        80,
        16,
      ),

      targetZ: new SpringValue(
        CAMERA_SCENES[0]
          .target.z,
        80,
        16,
      ),

      fov: new SpringValue(
        CAMERA_SCENES[0].fov,
        75,
        16,
      ),
    });

  const lookTarget =
    useRef(new Vector3());

  useFrame((_, delta) => {
    const frame =
      getCameraFrame(
        scrollProgress,
      );

    positionSprings.current.x.setTarget(
      frame.position.x +
        pointer.x * 0.12,
    );

    positionSprings.current.y.setTarget(
      frame.position.y +
        pointer.y * 0.06,
    );

    positionSprings.current.z.setTarget(
      frame.position.z,
    );

    positionSprings.current.targetX.setTarget(
      frame.target.x,
    );

    positionSprings.current.targetY.setTarget(
      frame.target.y,
    );

    positionSprings.current.targetZ.setTarget(
      frame.target.z,
    );

    positionSprings.current.fov.setTarget(
      frame.fov,
    );

    camera.position.set(
      positionSprings.current.x.update(
        delta,
      ),

      positionSprings.current.y.update(
        delta,
      ),

      positionSprings.current.z.update(
        delta,
      ),
    );

    lookTarget.current.set(
      positionSprings.current.targetX.update(
        delta,
      ),

      positionSprings.current.targetY.update(
        delta,
      ),

      positionSprings.current.targetZ.update(
        delta,
      ),
    );

    camera.lookAt(
      lookTarget.current,
    );

    if (
      camera instanceof
      PerspectiveCamera
    ) {
      camera.fov =
        positionSprings.current.fov.update(
          delta,
        );

      camera.updateProjectionMatrix();
    }
  });

  return null;
}