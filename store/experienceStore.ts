import { create } from "zustand";

export interface CarColorOption {
  id: string;
  label: string;
  hex: string;
}

export const CAR_COLORS: CarColorOption[] = [
  {
    id: "arancio",
    label: "Arancio",
    hex: "#e95a16",
  },
  {
    id: "verde",
    label: "Verde",
    hex: "#69a823",
  },
  {
    id: "giallo",
    label: "Giallo",
    hex: "#e9b719",
  },
  {
    id: "rosso",
    label: "Rosso",
    hex: "#a71117",
  },
  {
    id: "nero",
    label: "Nero",
    hex: "#111214",
  },
  {
    id: "bianco",
    label: "Bianco",
    hex: "#d8d6ce",
  },
];

interface ExperienceState {
  scrollProgress: number;
  scrollVelocity: number;
  activeScene: number;

  selectedColor: string;

  dragRotation: number;
  dragVelocity: number;
  isDragging: boolean;
  dragUsed: boolean;

  setScrollState: (
    progress: number,
    velocity: number,
    scene: number,
  ) => void;

  setSelectedColor: (color: string) => void;

  startDragging: () => void;
  stopDragging: () => void;
  addDragRotation: (
    rotationDelta: number,
    velocity: number,
  ) => void;

  setDragMotion: (
    rotation: number,
    velocity: number,
  ) => void;
}

export const useExperienceStore =
  create<ExperienceState>((set) => ({
    scrollProgress: 0,
    scrollVelocity: 0,
    activeScene: 0,

    selectedColor: CAR_COLORS[0].hex,

    dragRotation: 0,
    dragVelocity: 0,
    isDragging: false,
    dragUsed: false,

    setScrollState: (
      scrollProgress,
      scrollVelocity,
      activeScene,
    ) =>
      set({
        scrollProgress,
        scrollVelocity,
        activeScene,
      }),

    setSelectedColor: (selectedColor) =>
      set({ selectedColor }),

    startDragging: () =>
      set({
        isDragging: true,
        dragUsed: true,
        dragVelocity: 0,
      }),

    stopDragging: () =>
      set({
        isDragging: false,
      }),

    addDragRotation: (
      rotationDelta,
      dragVelocity,
    ) =>
      set((state) => ({
        dragRotation:
          state.dragRotation + rotationDelta,
        dragVelocity,
      })),

    setDragMotion: (
      dragRotation,
      dragVelocity,
    ) =>
      set({
        dragRotation,
        dragVelocity,
      }),
  }));