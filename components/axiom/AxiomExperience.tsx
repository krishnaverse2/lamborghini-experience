"use client";

import AxiomCanvas from "@/components/axiom/AxiomCanvas";
import {
  CAR_COLOURS,
  ORIGINAL_CAR_COLOUR,
  type MotionState,
} from "@/components/axiom/types";
import styles from "@/app/axiom-style/axiom.module.css";
import dynamic from "next/dynamic";
import {
  PointerEvent,
  useEffect,
  useRef,
  useState,
} from "react";

const DynamicCanvas = dynamic(
  () => Promise.resolve(AxiomCanvas),
  {
    ssr: false,
    loading: () => (
      <div className={styles.canvasLoading}>
        <span />
      </div>
    ),
  },
);

const chapters = [
  {
    number: "01",
    eyebrow: "Revuelto",
    title: "Born beyond convention.",
    description:
      "Scroll to ignite it. Click, hold and drag to spin the machine.",
    side: "left",
  },
  {
    number: "02",
    eyebrow: "Motion engineering",
    title: "Driven by equations.",
    description:
      "Six-axis spring movement creates momentum, overshoot and cinematic weight.",
    side: "right",
  },
  {
    number: "03",
    eyebrow: "Exterior finishes",
    title: "Pick your identity.",
    description:
      "Choose a body finish. Your selection stays active throughout the experience.",
    side: "left",
  },
  {
    number: "04",
    eyebrow: "Kinetics",
    title: "Built to move.",
    description:
      "V12 emotion and electrified performance combine in one unmistakable machine.",
    side: "right",
  },
  {
    number: "05",
    eyebrow: "The machine",
    title: "Make it yours.",
    description:
      "A digital interpretation of the Lamborghini Revuelto.",
    side: "left",
  },
];

export default function AxiomExperience() {
 const [selectedColour, setSelectedColour] =
  useState(ORIGINAL_CAR_COLOUR);

  const [activeChapter, setActiveChapter] = useState(0);
  const [dragUsed, setDragUsed] = useState(false);

  const activePointerIdRef = useRef<number | null>(null);
  const previousXRef = useRef(0);
  const previousTimeRef = useRef(0);

  const motionRef = useRef<MotionState>({
    dragRotation: 0,
    dragVelocity: 0,
    isDragging: false,
    pointerX: 0,
    pointerY: 0,
  });

  useEffect(() => {
    let animationFrame = 0;

    const updateChapter = () => {
      const maximumScroll = Math.max(
        document.documentElement.scrollHeight -
          window.innerHeight,
        1,
      );

      const progress = Math.min(
        Math.max(window.scrollY / maximumScroll, 0),
        1,
      );

      const chapter = Math.min(
        Math.floor(progress * chapters.length),
        chapters.length - 1,
      );

      setActiveChapter(chapter);
    };

    const handleScroll = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(updateChapter);
    };

    updateChapter();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handlePointerDown = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (event.button !== 0) {
      return;
    }

    activePointerIdRef.current = event.pointerId;
    previousXRef.current = event.clientX;
    previousTimeRef.current = performance.now();

    motionRef.current.isDragging = true;
    motionRef.current.dragVelocity = 0;

    setDragUsed(true);

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    const rect =
      event.currentTarget.getBoundingClientRect();

    motionRef.current.pointerX =
      ((event.clientX - rect.left) / rect.width) * 2 - 1;

    motionRef.current.pointerY =
      -(((event.clientY - rect.top) / rect.height) * 2 - 1);

    if (
      activePointerIdRef.current !== event.pointerId ||
      !motionRef.current.isDragging
    ) {
      return;
    }

    const currentTime = performance.now();
    const elapsedSeconds = Math.max(
      (currentTime - previousTimeRef.current) / 1000,
      0.001,
    );

    const deltaX = event.clientX - previousXRef.current;
    const rotationDelta = deltaX * 0.009;

    motionRef.current.dragRotation += rotationDelta;

    motionRef.current.dragVelocity = Math.min(
      Math.max(rotationDelta / elapsedSeconds, -8),
      8,
    );

    previousXRef.current = event.clientX;
    previousTimeRef.current = currentTime;
  };

  const endDragging = (
    event: PointerEvent<HTMLDivElement>,
  ) => {
    if (activePointerIdRef.current !== event.pointerId) {
      return;
    }

    if (
      event.currentTarget.hasPointerCapture(event.pointerId)
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      );
    }

    activePointerIdRef.current = null;
    motionRef.current.isDragging = false;
  };

  return (
    <main className={styles.page}>
      <div
        className={styles.canvasLayer}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDragging}
        onPointerCancel={endDragging}
      >
        <DynamicCanvas
  motionRef={motionRef}
  selectedColour={selectedColour}
  activeChapter={activeChapter}
/>

        <div className={styles.vignette} />
        <div className={styles.grain} />
        <div
  className={`${styles.blueprintGrid} ${
    activeChapter === 1
      ? styles.blueprintGridVisible
      : ""
  }`}
/>
      </div>

      <header className={styles.header}>
        <a href="#chapter-1" className={styles.logo}>
          <strong>REVUELTO</strong>
          <span>DIGITAL MACHINE</span>
        </a>

        <div className={styles.headerCenter}>
          V12 HPEV / 1015 CV
        </div>

        <div className={styles.headerRight}>
          EXPERIENCE 01
        </div>
      </header>

      <div
        className={`${styles.dragHint} ${
          dragUsed ? styles.dragHintHidden : ""
        }`}
      >
        <span className={styles.mouseIcon}>
          <i />
        </span>

        <p>
          HOLD + DRAG
          <strong>SPIN 360°</strong>
        </p>
      </div>

      <div className={styles.progress}>
        <span>
          {(activeChapter + 1)
            .toString()
            .padStart(2, "0")}
        </span>

        <div>
          <i
            style={{
              transform: `scaleY(${
                (activeChapter + 1) / chapters.length
              })`,
            }}
          />
        </div>

        <span>05</span>
      </div>

      <div className={styles.chapters}>
        {chapters.map((chapter, index) => (
          <section
            id={`chapter-${index + 1}`}
            key={chapter.number}
            className={`${styles.chapter} ${
              chapter.side === "right"
                ? styles.chapterRight
                : styles.chapterLeft
            }`}
          >
            <div
              className={`${styles.chapterCopy} ${
                activeChapter === index
                  ? styles.chapterCopyActive
                  : ""
              }`}
            >
              <div className={styles.eyebrow}>
                <span>{chapter.number}</span>
                <i />
                <p>// {chapter.eyebrow}</p>
              </div>

              <h1>{chapter.title}</h1>

              <p className={styles.description}>
                {chapter.description}
              </p>

              {index === 0 && (
                <div className={styles.scrollPrompt}>
                  <span>SCROLL TO IGNITE</span>
                  <strong>↓</strong>
                </div>
              )}

              {index === 1 && (
                <div className={styles.motionDetails}>
                  <code>
                    ẍ = −2ζω·ẋ − ω²(x − target)
                  </code>

                  <ul>
                    <li>6 damped springs</li>
                    <li>360°+ spin per chapter</li>
                    <li>velocity-driven banking</li>
                    <li>PBR WebGL shading</li>
                  </ul>
                </div>
              )}

              {index === 2 && (
                <div className={styles.colours}>
                  {CAR_COLOURS.map((colour) => {
                    const active =
                      colour.hex === selectedColour;

                    return (
                      <button
                        key={colour.id}
                        type="button"
                        aria-label={`Select ${colour.label}`}
                        aria-pressed={active}
                        className={
                          active ? styles.colourActive : ""
                        }
                        onClick={() =>
                          setSelectedColour(colour.hex)
                        }
                      >
                        <span
                          style={{
                            backgroundColor: colour.hex,
                          }}
                        />
                        {colour.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {index === 3 && (
                <div className={styles.metrics}>
                  <div>
                    <strong>1015</strong>
                    <span>CV</span>
                  </div>

                  <div>
                    <strong>2.5</strong>
                    <span>SEC 0–100</span>
                  </div>

                  <div>
                    <strong>350</strong>
                    <span>KM/H</span>
                  </div>
                </div>
              )}

              {index === 4 && (
                <button
                  type="button"
                  className={styles.configureButton}
                >
                  CONFIGURE REVUELTO
                  <span>→</span>
                </button>
              )}
            </div>
          </section>
        ))}
      </div>

      <div className={styles.marquee}>
        <div>
          REVUELTO — V12 HYBRID — ENGINEERED EMOTION —
          REVUELTO — V12 HYBRID — ENGINEERED EMOTION —
        </div>
      </div>
    </main>
  );
}