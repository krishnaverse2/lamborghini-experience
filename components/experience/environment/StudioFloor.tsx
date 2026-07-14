"use client";

import {
  ContactShadows,
  MeshReflectorMaterial,
} from "@react-three/drei";

export default function StudioFloor() {
  return (
    <group position={[1.3, -0.92, 0]}>
      <mesh
        receiveShadow
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.015, 0]}
      >
        <planeGeometry args={[28, 22]} />

        <MeshReflectorMaterial
          color="#070706"
          metalness={0.62}
          roughness={0.42}
          blur={[420, 110]}
          mixBlur={1}
          mixStrength={18}
          mirror={0.28}
          resolution={512}
          depthScale={0.7}
          minDepthThreshold={0.35}
          maxDepthThreshold={1.5}
          reflectorOffset={0.018}
        />
      </mesh>

      <ContactShadows
        position={[0, 0.015, 0]}
        scale={9}
        opacity={0.75}
        blur={2.8}
        far={5}
        resolution={1024}
        color="#000000"
      />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.005, 0]}
      >
        <ringGeometry args={[4.6, 4.64, 128]} />

        <meshBasicMaterial
          color="#9a7632"
          transparent
          opacity={0.16}
        />
      </mesh>
    </group>
  );
}