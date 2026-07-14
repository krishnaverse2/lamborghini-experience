"use client";

import CameraRig from "@/components/experience/camera/CameraRig";
import CarModel from "@/components/experience/car/CarModel";
import DragController from "@/components/experience/controls/DragController";
import StudioFloor from "@/components/experience/environment/StudioFloor";
import StudioParticles from "@/components/experience/environment/StudioParticles";
import ExperienceLoader from "@/components/experience/ExperienceLoader";
import LightingRig from "@/components/experience/lighting/LightingRig";
import {
  Environment,
  Lightformer,
} from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import {
  ACESFilmicToneMapping,
  PCFSoftShadowMap,
  SRGBColorSpace,
} from "three";

export default function ExperienceCanvas() {
  return (
    <DragController>
      <div className="experience-canvas">
        <Canvas
          shadows={{
            type: PCFSoftShadowMap,
          }}
          dpr={[1, 1.6]}
          camera={{
            position: [
              7.2,
              1.85,
              8.2,
            ],
            fov: 31,
            near: 0.1,
            far: 100,
          }}
          gl={{
            antialias: true,
            alpha: false,
            powerPreference:
              "high-performance",
          }}
          onCreated={({ gl }) => {
            gl.toneMapping =
              ACESFilmicToneMapping;

            gl.toneMappingExposure =
              1.05;

            gl.outputColorSpace =
              SRGBColorSpace;
          }}
        >
          <color
            attach="background"
            args={["#050505"]}
          />

          <fog
            attach="fog"
            args={[
              "#050505",
              13,
              30,
            ]}
          />

          <Suspense
            fallback={
              <ExperienceLoader />
            }
          >
            <CameraRig />

            <LightingRig />

            <StudioFloor />

            <StudioParticles />

            <CarModel />

            <Environment
              resolution={256}
            >
              <Lightformer
                form="rect"
                position={[
                  1.5,
                  6,
                  1,
                ]}
                rotation-x={
                  Math.PI / 2
                }
                scale={[
                  7,
                  0.5,
                  1,
                ]}
                intensity={4}
                color="#ffffff"
              />

              <Lightformer
                form="rect"
                position={[
                  -5,
                  2,
                  1,
                ]}
                rotation-y={
                  Math.PI / 2
                }
                scale={[
                  4,
                  0.4,
                  1,
                ]}
                intensity={3}
                color="#d2a44b"
              />

              <Lightformer
                form="rect"
                position={[
                  7,
                  2.2,
                  -2,
                ]}
                rotation-y={
                  -Math.PI / 2
                }
                scale={[
                  4.5,
                  0.35,
                  1,
                ]}
                intensity={2.5}
                color="#a8bdd2"
              />
            </Environment>
          </Suspense>
        </Canvas>

        <div className="experience-canvas__vignette" />

        <div className="experience-canvas__grain" />
      </div>
    </DragController>
  );
}