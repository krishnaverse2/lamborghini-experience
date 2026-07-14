"use client";

import styles from "@/app/axiom-style/premium-loader.module.css";
import { useProgress } from "@react-three/drei";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface PremiumLoaderProps {
  onComplete: () => void;
}

type LoaderState = "loading" | "ready" | "leaving";

const MINIMUM_LOADING_TIME = 5000;
const SEGMENT_COUNT = 42;

const systemStages = [
  {
    max: 14,
    label: "CONNECTING_ECU",
    secondary: "Establishing vehicle communication",
  },
  {
    max: 30,
    label: "DOWNLOADING_GEOMETRY",
    secondary: "Loading Revuelto body architecture",
  },
  {
    max: 46,
    label: "INITIALIZING_MATERIALS",
    secondary: "Preparing carbon and paint surfaces",
  },
  {
    max: 62,
    label: "CALIBRATING_LIGHTING",
    secondary: "Synchronizing studio reflections",
  },
  {
    max: 78,
    label: "CONFIGURING_CAMERA",
    secondary: "Loading cinematic camera system",
  },
  {
    max: 92,
    label: "ACTIVATING_HPEV",
    secondary: "Initializing V12 hybrid experience",
  },
  {
    max: 100,
    label: "SYSTEM_READY",
    secondary: "Revuelto digital machine online",
  },
];

function createAudioEngine() {
  const AudioContextClass =
    window.AudioContext ||
    (
      window as typeof window & {
        webkitAudioContext?: typeof AudioContext;
      }
    ).webkitAudioContext;

  if (!AudioContextClass) {
    return null;
  }

  const context = new AudioContextClass();
  const masterGain = context.createGain();

  masterGain.gain.value = 0.08;
  masterGain.connect(context.destination);

  return {
    context,
    masterGain,
  };
}

export default function PremiumLoader({
  onComplete,
}: PremiumLoaderProps) {
  const { progress: assetProgress, active } = useProgress();

  const [displayProgress, setDisplayProgress] = useState(0);
  const [loaderState, setLoaderState] =
    useState<LoaderState>("loading");
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [glitching, setGlitching] = useState(false);

  const startTimeRef = useRef(0);
  const animationFrameRef = useRef(0);
  const completedRef = useRef(false);

  const audioEngineRef = useRef<ReturnType<
    typeof createAudioEngine
  > | null>(null);

  const soundTimerRef = useRef<number | null>(null);
  const previousSoundProgressRef = useRef(0);

  const currentStage = useMemo(() => {
    return (
      systemStages.find(
        (stage) => displayProgress <= stage.max,
      ) ?? systemStages[systemStages.length - 1]
    );
  }, [displayProgress]);

  const activeSegments = Math.round(
    (displayProgress / 100) * SEGMENT_COUNT,
  );

  const playTone = useCallback(
    (
      frequency: number,
      duration: number,
      volume = 0.1,
      type: OscillatorType = "square",
    ) => {
      const engine = audioEngineRef.current;

      if (!engine) {
        return;
      }

      const { context, masterGain } = engine;

      const oscillator = context.createOscillator();
      const gain = context.createGain();

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(
        frequency,
        context.currentTime,
      );

      gain.gain.setValueAtTime(0, context.currentTime);
      gain.gain.linearRampToValueAtTime(
        volume,
        context.currentTime + 0.01,
      );

      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        context.currentTime + duration,
      );

      oscillator.connect(gain);
      gain.connect(masterGain);

      oscillator.start();
      oscillator.stop(context.currentTime + duration);
    },
    [],
  );

  const playLoadingTick = useCallback(() => {
    const randomFrequency =
      480 + Math.floor(Math.random() * 220);

    playTone(
      randomFrequency,
      0.055,
      0.08,
      "square",
    );
  }, [playTone]);

  const playCompletionSound = useCallback(() => {
    playTone(420, 0.12, 0.1, "sine");

    window.setTimeout(() => {
      playTone(640, 0.15, 0.12, "sine");
    }, 110);

    window.setTimeout(() => {
      playTone(920, 0.25, 0.11, "sine");
    }, 230);
  }, [playTone]);

  const enableSound = useCallback(async () => {
    if (!audioEngineRef.current) {
      audioEngineRef.current = createAudioEngine();
    }

    const engine = audioEngineRef.current;

    if (!engine) {
      return;
    }

    if (engine.context.state === "suspended") {
      await engine.context.resume();
    }

    setSoundEnabled(true);
    playTone(520, 0.08, 0.1, "square");
  }, [playTone]);

  useEffect(() => {
    startTimeRef.current = performance.now();

    const updateLoader = (currentTime: number) => {
      const elapsed =
        currentTime - startTimeRef.current;

      const timeProgress = Math.min(
        (elapsed / MINIMUM_LOADING_TIME) * 100,
        100,
      );

      /*
       * Keep the loading animation smooth while still
       * respecting actual Three.js asset progress.
       */
      const realProgress =
        active || assetProgress > 0
          ? assetProgress
          : timeProgress;

      const targetProgress = Math.min(
        Math.max(
          Math.min(timeProgress, 96),
          Math.min(realProgress, 96),
        ),
        96,
      );

      const assetsReady =
        !active && assetProgress >= 99;

      const minimumTimeFinished =
        elapsed >= MINIMUM_LOADING_TIME;

      const finalTarget =
        assetsReady && minimumTimeFinished
          ? 100
          : targetProgress;

      setDisplayProgress((current) => {
        const difference = finalTarget - current;

        if (Math.abs(difference) < 0.1) {
          return finalTarget;
        }

        return Math.min(
          current + Math.max(difference * 0.08, 0.08),
          100,
        );
      });

      if (!completedRef.current) {
        animationFrameRef.current =
          requestAnimationFrame(updateLoader);
      }
    };

    animationFrameRef.current =
      requestAnimationFrame(updateLoader);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [active, assetProgress]);

  useEffect(() => {
    if (!soundEnabled || loaderState !== "loading") {
      return;
    }

    const scheduleTick = () => {
      playLoadingTick();

      const delay =
        120 + Math.floor(Math.random() * 170);

      soundTimerRef.current = window.setTimeout(
        scheduleTick,
        delay,
      );
    };

    scheduleTick();

    return () => {
      if (soundTimerRef.current !== null) {
        window.clearTimeout(soundTimerRef.current);
      }
    };
  }, [loaderState, playLoadingTick, soundEnabled]);

  useEffect(() => {
    const progressDifference =
      displayProgress -
      previousSoundProgressRef.current;

    if (
      soundEnabled &&
      progressDifference >= 4 &&
      displayProgress < 100
    ) {
      playTone(
        360 + displayProgress * 3,
        0.045,
        0.045,
        "square",
      );

      previousSoundProgressRef.current =
        displayProgress;
    }
  }, [displayProgress, playTone, soundEnabled]);

  useEffect(() => {
    if (
      displayProgress < 99.8 ||
      completedRef.current
    ) {
      return;
    }

    completedRef.current = true;
    setDisplayProgress(100);
    setLoaderState("ready");
    setGlitching(true);

    if (soundEnabled) {
      playCompletionSound();
    }

    window.setTimeout(() => {
      setGlitching(false);
    }, 500);

    window.setTimeout(() => {
      setLoaderState("leaving");
    }, 900);

    window.setTimeout(() => {
      onComplete();
    }, 1900);
  }, [
    displayProgress,
    onComplete,
    playCompletionSound,
    soundEnabled,
  ]);

  useEffect(() => {
    return () => {
      if (soundTimerRef.current !== null) {
        window.clearTimeout(soundTimerRef.current);
      }

      const engine = audioEngineRef.current;

      if (engine) {
        void engine.context.close();
      }
    };
  }, []);

  const loaderClassName = [
    styles.loader,
    loaderState === "ready" ? styles.ready : "",
    loaderState === "leaving"
      ? styles.leaving
      : "",
    glitching ? styles.glitching : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={loaderClassName}>
      <div className={styles.noise} />
      <div className={styles.radialGlow} />
      <div className={styles.scanner} />

      <div className={styles.corner}>
        <span>RVL / SYSTEM_01</span>
        <span>V12_HPEV</span>
      </div>

      <section className={styles.content}>
        <p className={styles.microTitle}>
          REVUELTO DIGITAL EXPERIENCE
        </p>

        <h1 className={styles.heading}>
          <span>STAY</span>
          <strong>TUNED</strong>
        </h1>

        <p className={styles.subtitle}>
          THE MACHINE IS INITIALIZING
        </p>

        <div className={styles.loadingPanel}>
          <div className={styles.bracket}>[</div>

          <div
            className={styles.segmentBar}
            aria-label={`Loading ${Math.round(
              displayProgress,
            )}%`}
          >
            {Array.from({
              length: SEGMENT_COUNT,
            }).map((_, index) => (
              <span
                key={index}
                className={
                  index < activeSegments
                    ? styles.segmentActive
                    : ""
                }
              />
            ))}

            <i className={styles.barScanner} />
          </div>

          <div className={styles.bracket}>]</div>
        </div>

        <div className={styles.statusRow}>
          <div>
            <span className={styles.statusLight} />

            <p key={currentStage.label}>
              {currentStage.label}
            </p>
          </div>

          <strong>
            {Math.round(displayProgress)
              .toString()
              .padStart(2, "0")}
            %
          </strong>
        </div>

        <p
          key={currentStage.secondary}
          className={styles.secondaryStatus}
        >
          {currentStage.secondary}
        </p>

        {!soundEnabled && loaderState === "loading" && (
          <button
            type="button"
            className={styles.soundButton}
            onClick={enableSound}
          >
            <span />
            CLICK TO ENABLE LOADING SOUND
          </button>
        )}

        {soundEnabled && loaderState === "loading" && (
          <div className={styles.soundEnabled}>
            <span />
            AUDIO SYSTEM ACTIVE
          </div>
        )}

        {loaderState === "ready" && (
          <div className={styles.readyText}>
            SYSTEM READY
          </div>
        )}
      </section>

      <footer className={styles.footer}>
        <span>
          BUILD // REVUELTO_01
        </span>

        <span>
          {currentStage.label}
        </span>

        <span>
          STATUS //{" "}
          {loaderState === "ready"
            ? "ONLINE"
            : "BOOTING"}
        </span>
      </footer>

      <div className={styles.exitFlash} />
    </div>
  );
}