"use client";

import IntroLoader from "@/components/experience/IntroLoader";
import ScrollDirector from "@/components/experience/ScrollDirector";
import StorySections from "@/components/sections/StorySections";
import CarConfigurator from "@/components/ui/CarConfigurator";
import InteractionGuide from "@/components/ui/InteractionGuide";
import Navigation from "@/components/ui/Navigation";
import dynamic from "next/dynamic";
import {
  useCallback,
  useState,
} from "react";

const ExperienceCanvas =
  dynamic(
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

export default function Home() {
  const [
    introComplete,
    setIntroComplete,
  ] = useState(false);

  const handleIntroComplete =
    useCallback(() => {
      setIntroComplete(true);
    }, []);

  return (
    <main className="scroll-experience">
      {!introComplete && (
        <IntroLoader
          onComplete={
            handleIntroComplete
          }
        />
      )}

      <div
        className={
          introComplete
            ? "experience experience--visible"
            : "experience"
        }
      >
        <ScrollDirector />

        <div className="scroll-experience__canvas">
          <ExperienceCanvas />
        </div>

        <div className="scroll-experience__navigation">
          <Navigation />
        </div>

        <StorySections />

        <InteractionGuide />

        <CarConfigurator />

        <div className="scroll-experience__progress">
          <span>01</span>

          <div>
            <i />
          </div>

          <span>05</span>
        </div>
      </div>
    </main>
  );
}