"use client";

import { useExperienceStore } from "@/store/experienceStore";
import { useEffect } from "react";

const SCENE_COUNT = 5;

export default function ScrollDirector() {
  const setScrollState = useExperienceStore(
    (state) => state.setScrollState,
  );

  useEffect(() => {
    let animationFrame = 0;
    let previousProgress = 0;
    let previousTime = performance.now();

    const update = () => {
      const maximumScroll = Math.max(
        document.documentElement.scrollHeight -
          window.innerHeight,
        1,
      );

      const rawProgress =
        window.scrollY / maximumScroll;

      const progress = Math.min(
        Math.max(rawProgress, 0),
        1,
      );

      const currentTime = performance.now();

      const elapsedSeconds = Math.max(
        (currentTime - previousTime) / 1000,
        0.001,
      );

      const rawVelocity =
        (progress - previousProgress) /
        elapsedSeconds;

      const velocity = Math.min(
        Math.max(rawVelocity, -2),
        2,
      );

      const activeScene = Math.min(
        Math.floor(progress * SCENE_COUNT),
        SCENE_COUNT - 1,
      );

      setScrollState(
        progress,
        velocity,
        activeScene,
      );

      previousProgress = progress;
      previousTime = currentTime;
    };

    const handleScroll = () => {
      cancelAnimationFrame(animationFrame);

      animationFrame =
        requestAnimationFrame(update);
    };

    update();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      },
    );

    window.addEventListener(
      "resize",
      handleScroll,
    );

    return () => {
      cancelAnimationFrame(animationFrame);

      window.removeEventListener(
        "scroll",
        handleScroll,
      );

      window.removeEventListener(
        "resize",
        handleScroll,
      );
    };
  }, [setScrollState]);

  return null;
}