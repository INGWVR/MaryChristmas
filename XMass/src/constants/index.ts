// Константы для рождественской сцены

export const CANVAS_HEIGHT = 180;
export const TREE_BASE_Y = 140;
export const TREE_X = 80;

export const COLORS = {
  snow: {
    back: [
      "rgba(200, 220, 230, 0.6)",
      "rgba(210, 230, 240, 0.7)",
      "rgba(220, 235, 245, 0.8)",
    ],
    middle: ["#D8E8F0", "#E0ECF4", "#EDF5F9"],
    front: ["#E8F4F8", "#F0F6FA", "#FFFFFF"],
    highlight: "rgba(255, 255, 255, 0.5)",
    sparkle: "rgba(255, 255, 255, 0.8)",
  },
  tree: {
    trunk: "#5C4033",
    layers: ["#1E6B45", "#227A4D", "#268854", "#2D9F5C"],
  },
  ornament: {
    gazprom: {
      blue: "#0078D2",
      flame: "#FF6B00",
      highlight: "rgba(255, 255, 255, 0.4)",
    },
    traditional: "#FFFFFF",
    hanger: "#C0C0C0",
  },
  star: {
    main: "#FFD700",
    center: "#FFEB3B",
    glow: "#FFD700",
  },
  rabbit: {
    fur: "#FFFFFF",
    pink: "#FFB6C1",
    eyes: "#000000",
    whiskers: "#666666",
    shading: "rgba(230, 230, 230, 0.3)",
    blush: "rgba(255, 182, 193, 0.4)",
  },
};

export const RABBIT = {
  scale: 2.5,
  animationDuration: 3000, // мс
  peekDistance: 60,
  yPosition: 120,
  tiltAngle: 0.25,
};

export const GIFTS = [
  {
    x: 50,
    y: 135,
    width: 20,
    height: 18,
    color: "#E74C3C",
    ribbonColor: "#F1C40F",
  },
  {
    x: 90,
    y: 140,
    width: 16,
    height: 14,
    color: "#3498DB",
    ribbonColor: "#ECF0F1",
  },
  {
    x: 70,
    y: 142,
    width: 14,
    height: 12,
    color: "#2ECC71",
    ribbonColor: "#E74C3C",
  },
];

export const STAR_PULSE = {
  minScale: 0.9,
  maxScale: 1.1,
  speed: 0.002,
};

export const TREE_SWAY = {
  amplitude: 2, // Амплитуда покачивания в пикселях
  speed: 0.001, // Скорость покачивания
};
