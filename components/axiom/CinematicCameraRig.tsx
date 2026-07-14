"use client";

import { SpringValue } from "@/components/axiom/spring";
import type { MotionRef } from "@/components/axiom/types";
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

interface CinematicCameraRigProps {
  motionRef: MotionRef;
}

interface CameraFrame {
  progress: number;

  position: {
    x: number;
    y: number;
    z: number;
  };

  target: {
    x: number;
    y: number;
    z: number;
  };

  fov: number;
  roll: number;
}

const CAMERA_FRAMES: CameraFrame[] = [
  {
    progress: 0,
    position: {
      x: 7,
      y: 1.75,
      z: 8,
    },
    target: {
      x: 0.55,
      y: -0.18,
      z: 0,
    },
    fov: 31,
    roll: 0,
  },
  {
    progress: 0.23,
    position: {
      x: 6.3,
      y: 1.05,
      z: 6.5,
    },
    target: {
      x: 0.12,
      y: -0.25,
      z: 0,
    },
    fov: 30,
    roll: -0.008,
  },
  {
    progress: 0.46,
    position: {
      x: 5.8,
      y: 1.35,
      z: 6.8,
    },
    target: {
      x: 0.35,
      y: -0.18,
      z: 0,
    },
    fov: 32,
    roll: 0.006,
  },
  {
    progress: 0.69,
    position: {
      x: -5.6,
      y: 1.15,
      z: 5.8,
    },
    target: {
      x: -0.65,
      y: -0.2,
      z: 0,
    },
    fov: 29,
    roll: -0.015,
  },
  {
    progress: 0.87,
    position: {
      x: -6.4,
      y: 1.75,
      z: 5.3,
    },
    target: {
      x: 0.05,
      y: -0.18,
      z: 0,
    },
    fov: 29.5,
    roll: 0.01,
  },
  {
    progress: 1,
    position: {
      x: 7.2,
      y: 1.65,
      z: 7.5,
    },
    target: {
      x: 0.7,
      y: -0.16,
      z: 0,
    },
    fov: 30.5,
    roll: 0,
  },
];

function smoothstep(value: number) {
  const safeValue = MathUtils.clamp(
    value,
    0,
    1,
  );

  return safeValue * safeValue * (3 - 2 * safeValue);
}

function interpolateCameraFrame(
  progress: number,
) {
  let start = CAMERA_FRAMES[0];

  let end =
    CAMERA_FRAMES[
      CAMERA_FRAMES.length - 1
    ];

  for (
    let index = 0;
    index < CAMERA_FRAMES.length - 1;
    index += 1
  ) {
    const current = CAMERA_FRAMES[index];
    const next = CAMERA_FRAMES[index + 1];

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
      : MathUtils.clamp(
          (progress - start.progress) /
            range,
          0,
          1,
        );

  const eased = smoothstep(localProgress);

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

    roll: MathUtils.lerp(
      start.roll,
      end.roll,
      eased,
    ),
  };
}

export default function CinematicCameraRig({
  motionRef,
}: CinematicCameraRigProps) {
  const { camera, size } = useThree();

  const isMobile = size.width <= 768;

  const previousProgressRef = useRef(0);

  const lookTargetRef = useRef(
    new Vector3(0.55, -0.18, 0),
  );

  const springsRef = useRef({
    positionX: new SpringValue(
      CAMERA_FRAMES[0].position.x,
      62,
      14,
    ),

    positionY: new SpringValue(
      CAMERA_FRAMES[0].position.y,
      65,
      15,
    ),

    positionZ: new SpringValue(
      CAMERA_FRAMES[0].position.z,
      62,
      14,
    ),

    targetX: new SpringValue(
      CAMERA_FRAMES[0].target.x,
      72,
      16,
    ),

    targetY: new SpringValue(
      CAMERA_FRAMES[0].target.y,
      72,
      16,
    ),

    targetZ: new SpringValue(
      CAMERA_FRAMES[0].target.z,
      72,
      16,
    ),

    fov: new SpringValue(
      CAMERA_FRAMES[0].fov,
      54,
      14,
    ),

    roll: new SpringValue(
      CAMERA_FRAMES[0].roll,
      62,
      15,
    ),
  });

  useFrame((state, delta) => {
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

    const scrollVelocity =
      (progress - previousProgressRef.current) /
      Math.max(delta, 0.001);

    previousProgressRef.current = progress;

    const frame =
      interpolateCameraFrame(progress);

    const interactionStrength =
      motionRef.current.isDragging
        ? 0.12
        : 1;

    const pointerX =
      motionRef.current.pointerX *
      interactionStrength;

    const pointerY =
      motionRef.current.pointerY *
      interactionStrength;

    const parallaxX = pointerX * 0.09;
    const parallaxY = pointerY * 0.045;

    const velocityRoll = MathUtils.clamp(
      -scrollVelocity * 0.014,
      -0.017,
      0.017,
    );

    const breathingStrength =
      motionRef.current.isDragging
        ? 0.004
        : 0.025;

    const breathing =
      Math.sin(
        state.clock.elapsedTime * 0.45,
      ) * breathingStrength;

    /*
     * Mobile camera is centred and moved farther back.
     * Desktop values remain unchanged.
     */
    const mobileDistance =
      isMobile ? 1.42 : 1;

    const mobileCameraX =
      isMobile ? 0.15 : frame.position.x;

    const mobileCameraY =
      isMobile ? 1.35 : frame.position.y;

    const mobileTargetX =
      isMobile ? 0 : frame.target.x;

    const mobileTargetY =
      isMobile ? -1.45 : frame.target.y;

    const mobileFovOffset =
      isMobile ? 8 : 0;

    springsRef.current.positionX.setTarget(
      isMobile
        ? mobileCameraX + parallaxX * 0.25
        : frame.position.x + parallaxX,
    );

    springsRef.current.positionY.setTarget(
      isMobile
        ? mobileCameraY + parallaxY * 0.2
        : frame.position.y + parallaxY,
    );

    springsRef.current.positionZ.setTarget(
      frame.position.z *
        mobileDistance +
        breathing,
    );

    springsRef.current.targetX.setTarget(
      mobileTargetX +
        pointerX *
          (isMobile ? 0.005 : 0.025),
    );

    springsRef.current.targetY.setTarget(
      mobileTargetY +
        pointerY *
          (isMobile ? 0.004 : 0.014),
    );

    springsRef.current.targetZ.setTarget(
      frame.target.z,
    );

    const lensBreathing =
      Math.sin(
        state.clock.elapsedTime * 0.38,
      ) *
      (motionRef.current.isDragging
        ? 0.01
        : 0.08);

    springsRef.current.fov.setTarget(
      frame.fov +
        mobileFovOffset +
        lensBreathing,
    );

    springsRef.current.roll.setTarget(
      isMobile
        ? 0
        : frame.roll + velocityRoll,
    );

    camera.position.set(
      springsRef.current.positionX.update(
        delta,
      ),
      springsRef.current.positionY.update(
        delta,
      ),
      springsRef.current.positionZ.update(
        delta,
      ),
    );

    lookTargetRef.current.set(
      springsRef.current.targetX.update(
        delta,
      ),
      springsRef.current.targetY.update(
        delta,
      ),
      springsRef.current.targetZ.update(
        delta,
      ),
    );

    camera.lookAt(lookTargetRef.current);

    camera.rotateZ(
      springsRef.current.roll.update(delta),
    );

    if (
      camera instanceof PerspectiveCamera
    ) {
      camera.fov =
        springsRef.current.fov.update(
          delta,
        );

      camera.updateProjectionMatrix();
    }
  });

  return null;
}