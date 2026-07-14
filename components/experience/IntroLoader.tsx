"use client";

import { useEffect, useState } from "react";

interface IntroLoaderProps {
  onComplete: () => void;
}

export default function IntroLoader({
  onComplete,
}: IntroLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const startTime = performance.now();
    const duration = 2600;

    let animationFrameId = 0;

    const updateProgress = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const percentage = Math.min(
        Math.round((elapsed / duration) * 100),
        100,
      );

      setProgress(percentage);

      if (percentage < 100) {
        animationFrameId = requestAnimationFrame(updateProgress);
        return;
      }

      const leaveTimer = window.setTimeout(() => {
        setIsLeaving(true);
      }, 250);

      const completeTimer = window.setTimeout(() => {
        onComplete();
      }, 1100);

      return () => {
        window.clearTimeout(leaveTimer);
        window.clearTimeout(completeTimer);
      };
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [onComplete]);

  return (
    <div
      className={`intro-loader ${
        isLeaving ? "intro-loader--leaving" : ""
      }`}
      aria-label="Loading Revuelto experience"
    >
      <div className="intro-loader__glow" />

      <div className="intro-loader__top">
        <span>Automobili</span>
        <span>2026</span>
      </div>

      <div className="intro-loader__content">
        <div className="intro-loader__eyebrow">
          <span className="intro-loader__eyebrow-line" />
          <span>Initializing experience</span>
          <span className="intro-loader__eyebrow-line" />
        </div>

        <h1 className="intro-loader__title">
          <span>RE</span>
          <span>VUEL</span>
          <span>TO</span>
        </h1>

        <p className="intro-loader__subtitle">
          Engineering emotion
        </p>
      </div>

      <div className="intro-loader__footer">
        <div className="intro-loader__progress-copy">
          <span>Loading digital machine</span>
          <span>{progress.toString().padStart(3, "0")}</span>
        </div>

        <div className="intro-loader__track">
          <div
            className="intro-loader__bar"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>
      </div>
    </div>
  );
}