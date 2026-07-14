"use client";

import AxiomExperience from "@/components/axiom/AxiomExperience";
import PremiumLoader from "@/components/axiom/PremiumLoader";
import { useCallback, useState } from "react";

export default function AxiomStylePage() {
  const [loadingComplete, setLoadingComplete] =
    useState(false);

  const handleLoadingComplete =
    useCallback(() => {
      setLoadingComplete(true);
    }, []);

  return (
    <>
      {!loadingComplete && (
        <PremiumLoader
          onComplete={handleLoadingComplete}
        />
      )}

      <div
        style={{
          opacity: loadingComplete ? 1 : 0,
          visibility: loadingComplete
            ? "visible"
            : "hidden",
          transition:
            "opacity 900ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <AxiomExperience />
      </div>
    </>
  );
}