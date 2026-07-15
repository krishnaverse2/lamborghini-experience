"use client";

import CinematicCameraRig from "@/components/axiom/CinematicCameraRig";
import RevueltoModel from "@/components/axiom/RevueltoModel";
import type { MotionRef } from "@/components/axiom/types";
import {
  ContactShadows,
  Environment,
  Lightformer,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import {
  Bloom,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Suspense } from "react";
import {
  ACESFilmicToneMapping,
  PCFSoftShadowMap,
  SRGBColorSpace,
} from "three";

interface AxiomCanvasProps {
  motionRef: MotionRef;
  selectedColour: string;
  activeChapter: number;
}

export default function AxiomCanvas({
  motionRef,
  selectedColour,
  activeChapter,
}: AxiomCanvasProps) {
  const blueprintActive = activeChapter === 1;
  const colourChapterActive = activeChapter === 2;
  const performanceChapterActive = activeChapter === 3;
  const finalChapterActive = activeChapter === 4;

  return (
    <Canvas
      shadows={{
        type: PCFSoftShadowMap,
      }}
      dpr={[1, 1.55]}
      camera={{
        position: [7, 1.75, 8],
        fov: 31,
        near: 0.1,
        far: 100,
      }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      }}
      onCreated={({ gl, camera }) => {
        gl.toneMapping = ACESFilmicToneMapping;
        gl.toneMappingExposure = 1;
        gl.outputColorSpace = SRGBColorSpace;
        gl.setClearColor(0x000000, 0);

        camera.lookAt(0.7, -0.15, 0);
      }}
    >
      <fog
        attach="fog"
        args={[
          blueprintActive
            ? "#020609"
            : performanceChapterActive
              ? "#090304"
              : finalChapterActive
                ? "#080704"
                : "#070707",
          14,
          29,
        ]}
      />

      <CinematicCameraRig motionRef={motionRef} />

      <ambientLight
        intensity={
          blueprintActive
            ? 0.04
            : 0.26
        }
      />

      {/* Main cinematic key light */}
      <spotLight
        position={[4, 7, 6]}
        intensity={
          blueprintActive
            ? 1.8
            : colourChapterActive
              ? 56
              : performanceChapterActive
                ? 48
                : finalChapterActive
                  ? 62
                  : 68
        }
        angle={0.48}
        penumbra={0.95}
        color={
          blueprintActive
            ? "#5ac7e7"
            : colourChapterActive
              ? "#fffaf0"
              : performanceChapterActive
                ? "#ffcbc4"
                : finalChapterActive
                  ? "#ffe9b0"
                  : "#fff4dc"
        }
        castShadow={!blueprintActive}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.00015}
      />

      {/* Left fill light */}
      <spotLight
        position={[-5, 3, 3]}
        intensity={
          blueprintActive
            ? 1.1
            : colourChapterActive
              ? 25
              : performanceChapterActive
                ? 30
                : finalChapterActive
                  ? 35
                  : 40
        }
        angle={0.52}
        penumbra={1}
        color={
          blueprintActive
            ? "#287e9d"
            : colourChapterActive
              ? "#d9d9d9"
              : performanceChapterActive
                ? "#d32632"
                : "#d1a453"
        }
      />

      {/* Rear separation light */}
      <spotLight
        position={[4, 3, -6]}
        intensity={
          blueprintActive
            ? 1.5
            : performanceChapterActive
              ? 58
              : finalChapterActive
                ? 48
                : 42
        }
        angle={0.55}
        penumbra={1}
        color={
          blueprintActive
            ? "#62cce9"
            : performanceChapterActive
              ? "#ff2338"
              : finalChapterActive
                ? "#cf9f40"
                : "#8fa8c3"
        }
      />

      <Suspense fallback={null}>
        <RevueltoModel
          motionRef={motionRef}
          selectedColour={selectedColour}
          activeChapter={activeChapter}
        />

        {!blueprintActive && (
          <ContactShadows
            position={[0, -0.9, 0]}
            opacity={0.32}
            scale={8}
            blur={3.5}
            far={4}
            resolution={1024}
            color="#000000"
          />
        )}

        <Environment resolution={256}>
          <Lightformer
            form="rect"
            position={[0, 6, 1]}
            rotation-x={Math.PI / 2}
            scale={[7, 0.5, 1]}
            intensity={
              blueprintActive
                ? 0.06
                : colourChapterActive
                  ? 3.2
                  : performanceChapterActive
                    ? 2.8
                    : finalChapterActive
                      ? 4.5
                      : 4
            }
            color={
              blueprintActive
                ? "#37b7df"
                : performanceChapterActive
                  ? "#ffdad4"
                  : finalChapterActive
                    ? "#ffe4a0"
                    : "#ffffff"
            }
          />

          <Lightformer
            form="rect"
            position={[-5, 2, 1]}
            rotation-y={Math.PI / 2}
            scale={[4, 0.4, 1]}
            intensity={
              blueprintActive
                ? 0.05
                : performanceChapterActive
                  ? 2.8
                  : 3
            }
            color={
              blueprintActive
                ? "#246e88"
                : performanceChapterActive
                  ? "#c51d2b"
                  : "#d1a34e"
            }
          />

          <Lightformer
            form="rect"
            position={[7, 2, -2]}
            rotation-y={-Math.PI / 2}
            scale={[4, 0.35, 1]}
            intensity={
              blueprintActive
                ? 0.07
                : performanceChapterActive
                  ? 3
                  : 2.5
            }
            color={
              blueprintActive
                ? "#4db8d7"
                : performanceChapterActive
                  ? "#ff3547"
                  : "#9eb5cc"
            }
          />
        </Environment>

        <EffectComposer multisampling={0}>
          <Bloom
            intensity={
              blueprintActive
                ? 0.08
                : performanceChapterActive
                  ? 0.28
                  : finalChapterActive
                    ? 0.24
                    : 0.16
            }
            luminanceThreshold={
              blueprintActive
                ? 0.95
                : performanceChapterActive
                  ? 0.82
                  : 0.9
            }
            luminanceSmoothing={0.08}
            mipmapBlur
          />

          <Noise
            opacity={0.018}
            blendFunction={
              BlendFunction.SOFT_LIGHT
            }
          />

          <Vignette
            eskil={false}
            offset={0.2}
            darkness={
              performanceChapterActive
                ? 0.76
                : 0.68
            }
          />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}