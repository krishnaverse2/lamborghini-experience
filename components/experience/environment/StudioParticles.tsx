"use client";

import { Points, PointMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Points as ThreePoints } from "three";

export default function StudioParticles() {
  const pointsRef = useRef<ThreePoints>(null);

  const positions = useMemo(() => {
    const count = 160;
    const values = new Float32Array(count * 3);

    for (let index = 0; index < count; index += 1) {
      const offset = index * 3;

      values[offset] = (Math.random() - 0.5) * 14;
      values[offset + 1] = Math.random() * 5 - 0.7;
      values[offset + 2] = (Math.random() - 0.5) * 9;
    }

    return values;
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) {
      return;
    }

    pointsRef.current.rotation.y += delta * 0.008;
    pointsRef.current.position.y =
      Math.sin(state.clock.elapsedTime * 0.15) * 0.04;
  });

  return (
    <Points
      ref={pointsRef}
      positions={positions}
      stride={3}
      frustumCulled={false}
    >
      <PointMaterial
        transparent
        color="#c5a45b"
        size={0.012}
        sizeAttenuation
        depthWrite={false}
        opacity={0.22}
      />
    </Points>
  );
}