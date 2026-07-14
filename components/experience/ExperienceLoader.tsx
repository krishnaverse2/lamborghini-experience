"use client";

import { Html, useProgress } from "@react-three/drei";

export default function ExperienceLoader() {
  const { active, progress } = useProgress();

  if (!active) {
    return null;
  }

  return (
    <Html center>
      <div className="model-loader">
        <div className="model-loader__number">
          {Math.round(progress).toString().padStart(3, "0")}
        </div>

        <div className="model-loader__track">
          <span
            style={{
              transform: `scaleX(${Math.max(progress, 1) / 100})`,
            }}
          />
        </div>

        <p>Preparing machine</p>
      </div>
    </Html>
  );
}