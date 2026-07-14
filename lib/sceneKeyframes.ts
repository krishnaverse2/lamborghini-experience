export interface CarSceneKeyframe {
  progress: number;

  position: {
    x: number;
    y: number;
    z: number;
  };

  rotation: {
    x: number;
    y: number;
    z: number;
  };

  scale: number;
}

export interface CameraSceneKeyframe {
  progress: number;

  position: {
    x: number;
    y: number;
    z: number;
  };

  target: {
    x: number;
    y: number;
    z: number;
  };

  fov: number;
}

/*
 * Each section adds approximately one complete revolution.
 * This reproduces the strong continuous spin style of the
 * reference without copying its sneaker layout.
 */
export const CAR_SCENES: CarSceneKeyframe[] = [
  {
    progress: 0,
    position: {
      x: 1.45,
      y: -0.9,
      z: 0,
    },
    rotation: {
      x: 0.02,
      y: -0.6,
      z: 0,
    },
    scale: 0.96,
  },

  {
    progress: 0.22,
    position: {
      x: -0.45,
      y: -0.38,
      z: 0.1,
    },
    rotation: {
      x: -0.06,
      y: Math.PI * 2 - 0.1,
      z: -0.04,
    },
    scale: 1.08,
  },

  {
    progress: 0.44,
    position: {
      x: 0.95,
      y: -0.72,
      z: 0.15,
    },
    rotation: {
      x: 0.06,
      y: Math.PI * 4 + 0.55,
      z: 0.06,
    },
    scale: 1.18,
  },

  {
    progress: 0.66,
    position: {
      x: -0.9,
      y: -0.56,
      z: -0.1,
    },
    rotation: {
      x: -0.04,
      y: Math.PI * 6 + 1.1,
      z: -0.07,
    },
    scale: 1.06,
  },

  {
    progress: 0.84,
    position: {
      x: 0.15,
      y: -0.62,
      z: 0.15,
    },
    rotation: {
      x: 0.05,
      y: Math.PI * 8 + 2.2,
      z: 0.04,
    },
    scale: 1.22,
  },

  {
    progress: 1,
    position: {
      x: 0.8,
      y: -0.9,
      z: 0,
    },
    rotation: {
      x: 0,
      y: Math.PI * 10 + 2.7,
      z: 0,
    },
    scale: 1,
  },
];

export const CAMERA_SCENES: CameraSceneKeyframe[] = [
  {
    progress: 0,
    position: {
      x: 7.2,
      y: 1.85,
      z: 8.2,
    },
    target: {
      x: 0.8,
      y: -0.1,
      z: 0,
    },
    fov: 31,
  },

  {
    progress: 0.22,
    position: {
      x: 6.3,
      y: 2.2,
      z: 7.4,
    },
    target: {
      x: -0.1,
      y: 0,
      z: 0,
    },
    fov: 30,
  },

  {
    progress: 0.44,
    position: {
      x: 5.4,
      y: 1.2,
      z: 6,
    },
    target: {
      x: 0.6,
      y: -0.22,
      z: 0,
    },
    fov: 28,
  },

  {
    progress: 0.66,
    position: {
      x: -5.6,
      y: 1.6,
      z: 6.8,
    },
    target: {
      x: -0.4,
      y: -0.16,
      z: 0,
    },
    fov: 30,
  },

  {
    progress: 0.84,
    position: {
      x: -6.2,
      y: 2,
      z: 5.6,
    },
    target: {
      x: 0,
      y: -0.1,
      z: 0,
    },
    fov: 29,
  },

  {
    progress: 1,
    position: {
      x: 7,
      y: 1.8,
      z: 7.8,
    },
    target: {
      x: 0.6,
      y: -0.12,
      z: 0,
    },
    fov: 31,
  },
];