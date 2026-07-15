"use client";

import {
  Billboard,
  Text,
} from "@react-three/drei";
import {
  useFrame,
  useThree,
} from "@react-three/fiber";
import { useRef } from "react";
import {
  Group,
  Vector3,
} from "three";

interface ChapterBackdropProps {
  activeChapter: number;
}

const CHAPTER_NUMBERS = [
  "01",
  "02",
  "03",
  "04",
  "05",
];

export default function ChapterBackdrop({
  activeChapter,
}: ChapterBackdropProps) {
  const groupRef = useRef<Group>(null);

  const { camera, size } = useThree();

  const cameraDirectionRef = useRef(
    new Vector3(),
  );

  const isMobile =
    size.width <= 768;

  const chapterNumber =
    CHAPTER_NUMBERS[
      Math.min(
        Math.max(activeChapter, 0),
        CHAPTER_NUMBERS.length - 1,
      )
    ];

  const blueprintActive =
    activeChapter === 1;

  useFrame(() => {
    const group = groupRef.current;

    if (!group) {
      return;
    }

    /*
     * Get the direction in which the camera
     * is looking.
     */
    camera.getWorldDirection(
      cameraDirectionRef.current,
    );

    /*
     * Place the number behind the car,
     * relative to the current camera angle.
     */
   const distanceBehindCar =
  isMobile ? 2.8 : 2.8;

    group.position
      .copy(cameraDirectionRef.current)
      .multiplyScalar(distanceBehindCar);

    /*
     * Adjust the vertical placement.
     */
   group.position.y +=
  isMobile ? -0.15 : 0.1;
  });

  return (
    <group ref={groupRef}>
      <Billboard
        follow
        lockX={false}
        lockY={false}
        lockZ={false}
      >
        <group
          rotation={[
            0,
            0,
            isMobile ? -0.2 : -0.16,
          ]}
        >
          <Text
            fontSize={
  isMobile ? 3.4 : 7.8
}
            letterSpacing={-0.09}
            lineHeight={0.72}
            anchorX="center"
            anchorY="middle"
            color={
              blueprintActive
                ? "#37b7df"
                : "#f3f1eb"
            }
            fillOpacity={0.01}
            outlineWidth={
              isMobile ? 0.012 : 0.016
            }
            outlineColor={
              blueprintActive
                ? "#37b7df"
                : "#f3f1eb"
            }
            outlineOpacity={
              blueprintActive
                ? 0.27
                : 0.15
            }
            material-transparent
            material-depthTest
            material-depthWrite={false}
            renderOrder={0}
          >
            {chapterNumber}
          </Text>

          <Text
            position={[
              isMobile ? 0.12 : 0.18,
              isMobile ? -0.08 : -0.12,
              -0.03,
            ]}
            fontSize={
              isMobile ? 4.4 : 7.8
            }
            letterSpacing={-0.09}
            lineHeight={0.72}
            anchorX="center"
            anchorY="middle"
            color={
              blueprintActive
                ? "#37b7df"
                : "#d4aa52"
            }
            fillOpacity={0}
            outlineWidth={
              isMobile ? 0.004 : 0.006
            }
            outlineColor={
              blueprintActive
                ? "#37b7df"
                : "#d4aa52"
            }
            outlineOpacity={
              blueprintActive
                ? 0.12
                : 0.055
            }
            material-transparent
            material-depthTest
            material-depthWrite={false}
            renderOrder={0}
          >
            {chapterNumber}
          </Text>
        </group>
      </Billboard>
    </group>
  );
}