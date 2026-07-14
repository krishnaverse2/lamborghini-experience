"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type {
  Group,
  SpotLight as ThreeSpotLight,
} from "three";

export default function LightingRig() {
  const lightingGroupRef = useRef<Group>(null);
  const keyLightRef = useRef<ThreeSpotLight>(null);
  const rearLightRef = useRef<ThreeSpotLight>(null);

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;

    if (lightingGroupRef.current) {
      lightingGroupRef.current.rotation.y =
        Math.sin(elapsed * 0.12) * 0.018;
    }

    if (keyLightRef.current) {
      keyLightRef.current.intensity =
        72 + Math.sin(elapsed * 0.45) * 2;
    }

    if (rearLightRef.current) {
      rearLightRef.current.intensity =
        45 + Math.sin(elapsed * 0.35) * 1.5;
    }
  });

  return (
    <group ref={lightingGroupRef}>
      <ambientLight intensity={0.24} />

      <hemisphereLight
        args={["#efe6d5", "#090806", 0.42]}
      />

      <spotLight
        ref={keyLightRef}
        position={[4.5, 7.2, 6]}
        angle={0.46}
        penumbra={0.94}
        intensity={72}
        color="#fff5dc"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.00015}
      />

      <spotLight
        position={[-5.5, 4.2, 4]}
        angle={0.52}
        penumbra={1}
        intensity={46}
        color="#c99d45"
      />

      <spotLight
        ref={rearLightRef}
        position={[3, 3.6, -6]}
        angle={0.55}
        penumbra={1}
        intensity={45}
        color="#8da3bc"
      />

      <pointLight
        position={[2, 0.1, 4]}
        intensity={10}
        distance={12}
        decay={2}
        color="#d5b167"
      />

      <rectAreaLight
        position={[1.6, 5.5, 1]}
        rotation={[-Math.PI / 2, 0, 0]}
        width={8}
        height={0.5}
        intensity={18}
        color="#ffffff"
      />

      <rectAreaLight
        position={[-3.7, 2.4, 0]}
        rotation={[0, Math.PI / 2.5, 0]}
        width={5}
        height={0.35}
        intensity={14}
        color="#d0a751"
      />

      <rectAreaLight
        position={[6, 2.1, -1.7]}
        rotation={[0, -Math.PI / 2.6, 0]}
        width={4}
        height={0.3}
        intensity={12}
        color="#a0b6cc"
      />
    </group>
  );
}