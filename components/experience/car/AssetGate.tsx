"use client";

import {
  Suspense,
  useEffect,
  useState,
} from "react";
import CarModel from "./CarModel";
import PlaceholderCar from "./PlaceholderCar";

type AssetStatus = "checking" | "available" | "missing";

export default function AssetGate() {
  const [status, setStatus] =
    useState<AssetStatus>("checking");

  useEffect(() => {
    let active = true;

    async function checkModel() {
      try {
        const response = await fetch(
          "/models/revuelto.glb",
          {
            method: "HEAD",
            cache: "no-store",
          },
        );

        if (!active) {
          return;
        }

        setStatus(response.ok ? "available" : "missing");
      } catch {
        if (active) {
          setStatus("missing");
        }
      }
    }

    void checkModel();

    return () => {
      active = false;
    };
  }, []);

  if (status === "checking") {
    return null;
  }

  if (status === "missing") {
    return <PlaceholderCar />;
  }

  return (
    <Suspense fallback={null}>
      <CarModel />
    </Suspense>
  );
}