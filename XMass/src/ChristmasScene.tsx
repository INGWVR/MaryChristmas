import { useEffect, useRef } from "react";
import "./ChristmasScene.css";

// ===========================
// Types & Interfaces
// ===========================

interface Rabbit {
  side: "left" | "right";
  visible: boolean;
  progress: number; // 0 to 1 for animation
}

interface ChristmasSceneProps {
  rabbitInterval?: number; // Interval in seconds (default: 30)
}

// ===========================
// Constants
// ===========================

const CANVAS_HEIGHT = 180;
const TREE_BASE_Y = 140;
const TREE_X = 80;

const COLORS = {
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

const RABBIT = {
  scale: 2.5,
  animationDuration: 3000, // ms
  peekDistance: 60,
  yPosition: 120,
  tiltAngle: 0.25,
};

// ===========================
// Helper Functions
// ===========================

const createSnowWave = (
  x: number,
  baseY: number,
  frequencies: number[]
): number => {
  return frequencies.reduce((y, freq, i) => {
    const amplitude = [20, 10, 6, 18, 9, 5, 15, 8, 5][i] || 5;
    const phase = [0, 0, 0, 1, 2, 1.5, 0, 0, 0][i] || 0;
    return y + Math.sin(x * freq + phase) * amplitude;
  }, baseY);
};

// ===========================
// Drawing Functions
// ===========================

const drawSnowLayer = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) => {
  // Back layer
  const backGradient = ctx.createLinearGradient(0, 92, 0, height);
  COLORS.snow.back.forEach((color, i) =>
    backGradient.addColorStop([0, 0.5, 1][i], color)
  );

  ctx.fillStyle = backGradient;
  ctx.beginPath();
  ctx.moveTo(0, height);
  for (let x = 0; x <= width; x += 10) {
    ctx.lineTo(x, createSnowWave(x, 110, [0.008, 0.025, 0.04]));
  }
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  // Middle layer
  const middleGradient = ctx.createLinearGradient(0, 108, 0, height);
  COLORS.snow.middle.forEach((color, i) =>
    middleGradient.addColorStop([0, 0.5, 1][i], color)
  );

  ctx.fillStyle = middleGradient;
  ctx.beginPath();
  ctx.moveTo(0, height);
  for (let x = 0; x <= width; x += 10) {
    ctx.lineTo(x, createSnowWave(x, 126, [0.012, 0.035, 0.055]));
  }
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();

  // Front layer
  const frontGradient = ctx.createLinearGradient(0, 124, 0, height);
  COLORS.snow.front.forEach((color, i) =>
    frontGradient.addColorStop([0, 0.5, 1][i], color)
  );

  ctx.fillStyle = frontGradient;
  ctx.beginPath();
  ctx.moveTo(0, height);
  for (let x = 0; x <= width; x += 10) {
    ctx.lineTo(x, createSnowWave(x, 142, [0.01, 0.03, 0.05]));
  }
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();

  // Highlights
  ctx.fillStyle = COLORS.snow.highlight;
  ctx.beginPath();
  ctx.moveTo(0, height);
  for (let x = 0; x <= width; x += 10) {
    ctx.lineTo(x, createSnowWave(x, 146, [0.01, 0.03, 0.05]));
  }
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();

  // Sparkles
  ctx.fillStyle = COLORS.snow.sparkle;
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    ctx.arc(Math.random() * width, 132 + Math.random() * 30, 1, 0, Math.PI * 2);
    ctx.fill();
  }
};

const drawStar = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  outerRadius: number,
  innerRadius: number
) => {
  ctx.save();
  ctx.shadowColor = COLORS.star.glow;
  ctx.shadowBlur = 20;

  ctx.fillStyle = COLORS.star.main;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const outerAngle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    const innerAngle = outerAngle + Math.PI / 5;

    if (i === 0) {
      ctx.moveTo(
        x + Math.cos(outerAngle) * outerRadius,
        y + Math.sin(outerAngle) * outerRadius
      );
    } else {
      ctx.lineTo(
        x + Math.cos(outerAngle) * outerRadius,
        y + Math.sin(outerAngle) * outerRadius
      );
    }
    ctx.lineTo(
      x + Math.cos(innerAngle) * innerRadius,
      y + Math.sin(innerAngle) * innerRadius
    );
  }
  ctx.closePath();
  ctx.fill();

  // Bright center
  ctx.fillStyle = COLORS.star.center;
  ctx.beginPath();
  ctx.arc(x, y, innerRadius / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

const drawGazpromOrnament = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number
) => {
  // Main circle
  ctx.fillStyle = COLORS.ornament.gazprom.blue;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  // Highlight
  ctx.fillStyle = COLORS.ornament.gazprom.highlight;
  ctx.beginPath();
  ctx.arc(x - radius / 3, y - radius / 3, radius / 3, 0, Math.PI * 2);
  ctx.fill();

  // Flame
  ctx.fillStyle = COLORS.ornament.gazprom.flame;
  ctx.beginPath();
  ctx.moveTo(x, y - radius / 2);
  ctx.bezierCurveTo(
    x + radius / 3,
    y - radius / 4,
    x + radius / 3,
    y + radius / 4,
    x,
    y + radius / 2
  );
  ctx.bezierCurveTo(
    x - radius / 3,
    y + radius / 4,
    x - radius / 3,
    y - radius / 4,
    x,
    y - radius / 2
  );
  ctx.fill();

  // Hanger
  ctx.strokeStyle = COLORS.ornament.hanger;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y - radius);
  ctx.lineTo(x, y - radius - 3);
  ctx.stroke();
};

const drawTraditionalOrnament = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string
) => {
  // Main ball with gradient
  const gradient = ctx.createRadialGradient(
    x - radius / 3,
    y - radius / 3,
    0,
    x,
    y,
    radius
  );
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
  gradient.addColorStop(0.3, color);
  gradient.addColorStop(1, color);

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  // Hanger
  ctx.strokeStyle = COLORS.ornament.hanger;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y - radius);
  ctx.lineTo(x, y - radius - 3);
  ctx.stroke();
};

const drawChristmasTree = (ctx: CanvasRenderingContext2D) => {
  const treeX = TREE_X;
  const treeBaseY = TREE_BASE_Y;

  // Trunk
  ctx.fillStyle = COLORS.tree.trunk;
  ctx.fillRect(treeX - 8, treeBaseY - 12, 16, 16);

  // Tree layers
  const layers = [
    { yOffset: -32, width: 40, color: COLORS.tree.layers[0] },
    { yOffset: -52, width: 34, color: COLORS.tree.layers[1] },
    { yOffset: -74, width: 27, color: COLORS.tree.layers[2] },
    { yOffset: -96, width: 18, color: COLORS.tree.layers[3] },
  ];

  layers.forEach(({ yOffset, width, color }) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(treeX, treeBaseY + yOffset);
    ctx.lineTo(treeX - width, treeBaseY + yOffset + 24);
    ctx.lineTo(treeX + width, treeBaseY + yOffset + 24);
    ctx.closePath();
    ctx.fill();
  });

  // Ornaments - Gazprom-neft logos
  const gazpromPositions = [
    [0, -85],
    [0, -34],
    [-14, -64],
    [14, -64],
    [-22, -42],
    [22, -42],
    [-30, -20],
    [28, -20],
  ];
  gazpromPositions.forEach(([dx, dy]) => {
    drawGazpromOrnament(ctx, treeX + dx, treeBaseY + dy, 5);
  });

  // Traditional white ornaments
  const whitePositions = [
    [8, -74],
    [-8, -74],
    [8, -50],
    [-8, -50],
    [14, -28],
    [-14, -28],
    [0, -17],
  ];
  whitePositions.forEach(([dx, dy]) => {
    drawTraditionalOrnament(
      ctx,
      treeX + dx,
      treeBaseY + dy,
      4,
      COLORS.ornament.traditional
    );
  });

  // Star on top
  drawStar(ctx, treeX, treeBaseY - 104, 10, 5);
};

const drawRabbit = (
  ctx: CanvasRenderingContext2D,
  side: "left" | "right",
  progress: number,
  canvasWidth: number
) => {
  const scale = RABBIT.scale;
  const peekDistance = RABBIT.peekDistance * progress;
  const rabbitX =
    side === "left" ? -40 + peekDistance : canvasWidth + 40 - peekDistance;

  const flipScale = side === "right" ? -1 : 1;
  const tiltAngle = (side === "left" ? 1 : -1) * RABBIT.tiltAngle * progress;

  ctx.save();
  ctx.translate(rabbitX, RABBIT.yPosition);
  ctx.rotate(tiltAngle);
  ctx.scale(flipScale, 1);

  const x = 0;
  const y = 0;

  // Head
  ctx.fillStyle = COLORS.rabbit.fur;
  ctx.beginPath();
  ctx.arc(x, y, 10 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Head shading
  ctx.fillStyle = COLORS.rabbit.shading;
  ctx.beginPath();
  ctx.arc(x + 2 * scale, y + 2 * scale, 6 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Ears
  ctx.fillStyle = COLORS.rabbit.fur;
  [
    [-5, -10, -0.3],
    [5, -10, 0.3],
  ].forEach(([ex, ey, angle]) => {
    ctx.beginPath();
    ctx.ellipse(
      x + ex * scale,
      y + ey * scale,
      3 * scale,
      8 * scale,
      angle,
      0,
      Math.PI * 2
    );
    ctx.fill();
  });

  // Inner ears (pink)
  ctx.fillStyle = COLORS.rabbit.pink;
  [
    [-5, -10, -0.3],
    [5, -10, 0.3],
  ].forEach(([ex, ey, angle]) => {
    ctx.beginPath();
    ctx.ellipse(
      x + ex * scale,
      y + ey * scale,
      1.5 * scale,
      5 * scale,
      angle,
      0,
      Math.PI * 2
    );
    ctx.fill();
  });

  // Eyes
  ctx.fillStyle = COLORS.rabbit.eyes;
  [
    [-3, -2],
    [3, -2],
  ].forEach(([ex, ey]) => {
    ctx.beginPath();
    ctx.arc(x + ex * scale, y + ey * scale, 2.5 * scale, 0, Math.PI * 2);
    ctx.fill();
  });

  // Eye highlights
  ctx.fillStyle = COLORS.rabbit.fur;
  [
    [-2.5, -2.5],
    [3.5, -2.5],
  ].forEach(([ex, ey]) => {
    ctx.beginPath();
    ctx.arc(x + ex * scale, y + ey * scale, 1.2 * scale, 0, Math.PI * 2);
    ctx.fill();
  });

  // Nose
  ctx.fillStyle = COLORS.rabbit.pink;
  ctx.beginPath();
  ctx.moveTo(x, y + 2 * scale);
  ctx.lineTo(x - 2 * scale, y - 0.5 * scale);
  ctx.lineTo(x + 2 * scale, y - 0.5 * scale);
  ctx.closePath();
  ctx.fill();

  // Mouth
  ctx.strokeStyle = "#888888";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y + 2 * scale, 3 * scale, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // Whiskers
  ctx.strokeStyle = COLORS.rabbit.whiskers;
  ctx.lineWidth = 1.5;

  const whiskerData = [
    [-2, 1, -15, -2],
    [-2, 2, -15, 2],
    [-2, 3, -15, 5],
    [2, 1, 15, -2],
    [2, 2, 15, 2],
    [2, 3, 15, 5],
  ];

  ctx.beginPath();
  whiskerData.forEach(([startX, startY, endX, endY]) => {
    ctx.moveTo(x + startX * scale, y + startY * scale);
    ctx.lineTo(x + endX * scale, y + endY * scale);
  });
  ctx.stroke();

  // Cheek blush
  ctx.fillStyle = COLORS.rabbit.blush;
  [
    [-8, 4],
    [8, 4],
  ].forEach(([bx, by]) => {
    ctx.beginPath();
    ctx.ellipse(
      x + bx * scale,
      y + by * scale,
      3 * scale,
      2 * scale,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
  });

  ctx.restore();
};

// ===========================
// Main Component
// ===========================

const ChristmasScene: React.FC<ChristmasSceneProps> = ({
  rabbitInterval = 30,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rabbitRef = useRef<Rabbit>({
    side: "left",
    visible: false,
    progress: 0,
  });
  const lastRabbitTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Setup
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = CANVAS_HEIGHT;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Animation logic
    const updateRabbit = (currentTime: number) => {
      const rabbit = rabbitRef.current;
      const intervalMs = rabbitInterval * 1000;

      if (
        currentTime - lastRabbitTimeRef.current > intervalMs &&
        !rabbit.visible
      ) {
        rabbit.visible = true;
        rabbit.progress = 0;
        rabbit.side = Math.random() > 0.5 ? "right" : "left";
        lastRabbitTimeRef.current = currentTime;
      }

      if (rabbit.visible) {
        const timeSinceStart = currentTime - lastRabbitTimeRef.current;
        const halfDuration = RABBIT.animationDuration / 2;

        if (timeSinceStart < halfDuration) {
          rabbit.progress = timeSinceStart / halfDuration;
        } else if (timeSinceStart < RABBIT.animationDuration) {
          rabbit.progress = 1 - (timeSinceStart - halfDuration) / halfDuration;
        } else {
          rabbit.visible = false;
          rabbit.progress = 0;
        }

        if (rabbit.progress > 0) {
          drawRabbit(ctx, rabbit.side, rabbit.progress, canvas.width);
        }
      }
    };

    // Main animation loop
    let animationId: number;
    const animate = (currentTime: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawSnowLayer(ctx, canvas.width, canvas.height);
      drawChristmasTree(ctx);
      updateRabbit(currentTime);

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [rabbitInterval]);

  return (
    <div className="christmas-scene">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default ChristmasScene;
