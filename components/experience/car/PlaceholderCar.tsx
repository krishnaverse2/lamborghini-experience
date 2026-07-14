"use client";

import { RoundedBox } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

const wheelPositions: [number, number, number][] = [
  [-1.28, -0.62, 0.92],
  [1.28, -0.62, 0.92],
  [-1.28, -0.62, -0.92],
  [1.28, -0.62, -0.92],
];

export default function PlaceholderCar() {
  const groupRef = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) {
      return;
    }

    groupRef.current.rotation.y += delta * 0.045;
    groupRef.current.position.y =
      -0.05 + Math.sin(state.clock.elapsedTime * 0.7) * 0.012;
  });

  return (
    <group
      ref={groupRef}
      rotation={[0, -0.62, 0]}
      scale={1.18}
    >
      <RoundedBox
        args={[3.8, 0.62, 1.72]}
        radius={0.18}
        smoothness={8}
        position={[0, -0.18, 0]}
        castShadow
      >
        <meshPhysicalMaterial
          color="#b99542"
          metalness={0.92}
          roughness={0.18}
          clearcoat={1}
          clearcoatRoughness={0.12}
        />
      </RoundedBox>

      <mesh
        position={[0.28, 0.36, 0]}
        rotation={[0, 0, -0.04]}
        castShadow
      >
        <boxGeometry args={[1.75, 0.58, 1.42]} />

        <meshPhysicalMaterial
          color="#070707"
          metalness={0.75}
          roughness={0.14}
          transmission={0.18}
          transparent
          opacity={0.92}
        />
      </mesh>

      <mesh position={[-1.72, -0.14, 0]}>
        <boxGeometry args={[0.42, 0.2, 1.48]} />

        <meshStandardMaterial
          color="#8f702e"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      <mesh position={[1.72, -0.14, 0]}>
        <boxGeometry args={[0.42, 0.18, 1.5]} />

        <meshStandardMaterial
          color="#8f702e"
          metalness={0.9}
          roughness={0.2}
        />
      </mesh>

      {wheelPositions.map((position, index) => (
        <group key={index} position={position}>
          <mesh
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.47, 0.47, 0.28, 48]} />

            <meshStandardMaterial
              color="#040404"
              metalness={0.4}
              roughness={0.58}
            />
          </mesh>

          <mesh
            position={[0, 0, position[2] > 0 ? 0.15 : -0.15]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.25, 0.25, 0.3, 32]} />

            <meshStandardMaterial
              color="#2e2e2e"
              metalness={0.95}
              roughness={0.18}
            />
          </mesh>
        </group>
      ))}

      <mesh position={[-1.78, -0.1, 0.49]}>
        <boxGeometry args={[0.02, 0.04, 0.45]} />

        <meshBasicMaterial
          color="#fff3d0"
          toneMapped={false}
        />
      </mesh>

      <mesh position={[-1.78, -0.1, -0.49]}>
        <boxGeometry args={[0.02, 0.04, 0.45]} />

        <meshBasicMaterial
          color="#fff3d0"
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}