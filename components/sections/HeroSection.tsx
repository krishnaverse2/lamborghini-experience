"use client";

import Navigation from "@/components/ui/Navigation";
import dynamic from "next/dynamic";

const ExperienceCanvas = dynamic(
  () =>
    import(
      "@/components/experience/canvas/ExperienceCanvas"
    ),
  {
    ssr: false,
    loading: () => (
      <div className="canvas-fallback">
        <div className="canvas-fallback__line" />
      </div>
    ),
  },
);

export default function HeroSection() {
  return (
    <section id="top" className="hero">
      <Navigation />

      <div className="hero__canvas-layer">
        <ExperienceCanvas />
      </div>

      <div className="hero__watermark" aria-hidden="true">
        REVUELTO
      </div>

      <div className="hero__content">
        <div className="hero__copy">
          <p className="hero__eyebrow">
            <span />
            Lamborghini Revuelto
          </p>

          <h1 className="hero__heading">
            <span className="hero__heading-solid">
              From now on,
            </span>

            <span className="hero__heading-outline">
              something different.
            </span>
          </h1>

          <p className="hero__description">
            A cinematic digital experience inspired by the
            uncompromising design, precision and performance
            of the Lamborghini Revuelto.
          </p>

          <a href="#design" className="hero__explore">
            <span className="hero__explore-number">
              01
            </span>

            <span className="hero__explore-label">
              Begin experience
            </span>

            <span className="hero__explore-arrow">
              ↘
            </span>
          </a>
        </div>
      </div>

      <div className="hero__specification">
        <div>
          <span>Powertrain</span>
          <strong>V12 Hybrid</strong>
        </div>

        <div>
          <span>Total power</span>
          <strong>1015 CV</strong>
        </div>

        <div>
          <span>0–100 km/h</span>
          <strong>2.5 SEC</strong>
        </div>
      </div>

      <div className="hero__interaction-note">
        <span className="hero__interaction-dot" />

        Move pointer to explore
      </div>

      <div className="hero__scroll-indicator">
        <span>Scroll to discover</span>

        <div className="hero__scroll-line">
          <i />
        </div>
      </div>

      <div className="hero__corner-index">
        <span>R</span>
        <small>01 / 07</small>
      </div>
    </section>
  );
}