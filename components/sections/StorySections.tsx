"use client";

import { useExperienceStore } from "@/store/experienceStore";

const scenes = [
  {
    number: "01",
    eyebrow: "Revuelto",
    title: "Beyond every expectation.",
    description:
      "Scroll to launch the machine. Click, hold and drag to inspect every angle.",
    alignment: "left",
  },

  {
    number: "02",
    eyebrow: "Motion engineering",
    title: "Driven by performance.",
    description:
      "The Revuelto moves through a spring-driven digital environment with cinematic weight and momentum.",
    alignment: "right",
  },

  {
    number: "03",
    eyebrow: "Colorways",
    title: "Choose your frequency.",
    description:
      "Select an exterior finish. Your colour remains active throughout the full experience.",
    alignment: "left",
  },

  {
    number: "04",
    eyebrow: "Kinetics",
    title: "Built to move.",
    description:
      "A V12 hybrid architecture combines naturally aspirated emotion with electrified performance.",
    alignment: "right",
  },

  {
    number: "05",
    eyebrow: "The machine",
    title: "Make it yours.",
    description:
      "Explore the Lamborghini Revuelto through an interactive digital presentation.",
    alignment: "left",
  },
];

export default function StorySections() {
  const activeScene =
    useExperienceStore(
      (state) =>
        state.activeScene,
    );

  return (
    <div className="story-sections">
      {scenes.map(
        (scene, index) => {
          const active =
            activeScene === index;

          return (
            <section
              key={scene.number}
              id={
                index === 0
                  ? "top"
                  : `scene-${index + 1}`
              }
              className={`story-scene story-scene--${scene.alignment}`}
            >
              <div
                className={`story-scene__copy ${
                  active
                    ? "story-scene__copy--active"
                    : ""
                }`}
              >
                <div className="story-scene__meta">
                  <span>
                    {scene.number}
                  </span>

                  <i />

                  <p>
                    {scene.eyebrow}
                  </p>
                </div>

                <h1>
                  {scene.title}
                </h1>

                <p className="story-scene__description">
                  {
                    scene.description
                  }
                </p>

                {index === 0 && (
                  <div className="story-scene__action">
                    <span>
                      Scroll to launch
                    </span>

                    <strong>
                      ↓
                    </strong>
                  </div>
                )}

                {index === 3 && (
                  <div className="performance-metrics">
                    <div>
                      <strong>
                        1015
                      </strong>
                      <span>
                        CV
                      </span>
                    </div>

                    <div>
                      <strong>
                        2.5
                      </strong>
                      <span>
                        SEC 0–100
                      </span>
                    </div>

                    <div>
                      <strong>
                        350
                      </strong>
                      <span>
                        KM/H
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </section>
          );
        },
      )}
    </div>
  );
}