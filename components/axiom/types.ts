import type { MutableRefObject } from "react";

export interface MotionState {
  dragRotation: number;
  dragVelocity: number;
  isDragging: boolean;
  pointerX: number;
  pointerY: number;
}

export type MotionRef =
  MutableRefObject<MotionState>;

export interface CarColour {
  id: string;
  label: string;
  hex: string;
}

/*
 * This special value means:
 * Keep the exact original material and colour from the GLB.
 */
export const ORIGINAL_CAR_COLOUR =
  "__ORIGINAL_GLB_COLOUR__";

export const CAR_COLOURS: CarColour[] = [
  {
    id: "arancio",
    label: "Arancio",
    hex: "#f05a1a",
  },
  {
    id: "giallo",
    label: "Giallo",
    hex: "#e8b51a",
  },
  {
    id: "verde",
    label: "Verde",
    hex: "#72aa21",
  },
  {
    id: "rosso",
    label: "Rosso",
    hex: "#b3131b",
  },
  {
    id: "nero",
    label: "Nero",
    hex: "#101113",
  },
  {
    id: "viola",
    label: "Viola",
    hex: "#6124a8",
  },
];