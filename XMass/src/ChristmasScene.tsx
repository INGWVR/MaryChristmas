import { useEffect, useRef } from "react";
import "./ChristmasScene.css";

// ===========================
// Типы и интерфейсы
// ===========================

interface Rabbit {
  side: "left" | "right";
  visible: boolean;
  progress: number; // От 0 до 1 для анимации
}

interface ChristmasSceneProps {
  rabbitInterval?: number; // Интервал в секундах (по умолчанию: 30)
}

interface MousePosition {
  x: number;
  y: number;
}

interface OrnamentPosition {
  x: number;
  y: number;
  radius: number;
  isGazprom: boolean;
}

// ===========================
// Константы
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
  animationDuration: 3000, // мс
  peekDistance: 60,
  yPosition: 120,
  tiltAngle: 0.25,
};

const GIFTS = [
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

const STAR_PULSE = {
  minScale: 0.9,
  maxScale: 1.1,
  speed: 0.002,
};

// ===========================
// Вспомогательные функции
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
// Функции рисования
// ===========================

const isMouseOverOrnament = (
  mouseX: number,
  mouseY: number,
  ornamentX: number,
  ornamentY: number,
  radius: number
): boolean => {
  const distance = Math.sqrt(
    Math.pow(mouseX - ornamentX, 2) + Math.pow(mouseY - ornamentY, 2)
  );
  return distance <= radius + 5;
};

const drawSnowLayer = (
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  width: number,
  height: number
) => {
  // Задний слой
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

  // Средний слой
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

  // Передний слой
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

  // Блики
  ctx.fillStyle = COLORS.snow.highlight;
  ctx.beginPath();
  ctx.moveTo(0, height);
  for (let x = 0; x <= width; x += 10) {
    ctx.lineTo(x, createSnowWave(x, 146, [0.01, 0.03, 0.05]));
  }
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();

  // Блёстки
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
  innerRadius: number,
  pulseScale: number = 1
) => {
  ctx.save();
  ctx.shadowColor = COLORS.star.glow;
  ctx.shadowBlur = 20 * pulseScale;

  const scaledOuter = outerRadius * pulseScale;
  const scaledInner = innerRadius * pulseScale;

  ctx.fillStyle = COLORS.star.main;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const outerAngle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
    const innerAngle = outerAngle + Math.PI / 5;

    if (i === 0) {
      ctx.moveTo(
        x + Math.cos(outerAngle) * scaledOuter,
        y + Math.sin(outerAngle) * scaledOuter
      );
    } else {
      ctx.lineTo(
        x + Math.cos(outerAngle) * scaledOuter,
        y + Math.sin(outerAngle) * scaledOuter
      );
    }
    ctx.lineTo(
      x + Math.cos(innerAngle) * scaledInner,
      y + Math.sin(innerAngle) * scaledInner
    );
  }
  ctx.closePath();
  ctx.fill();

  // Яркий центр
  ctx.fillStyle = COLORS.star.center;
  ctx.beginPath();
  ctx.arc(x, y, scaledInner / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

const drawGazpromOrnament = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  isHovered: boolean = false
) => {
  const effectiveRadius = isHovered ? radius * 1.2 : radius;

  if (isHovered) {
    ctx.save();
    ctx.shadowColor = "#FFD700";
    ctx.shadowBlur = 15;
  }

  // Основной круг
  ctx.fillStyle = COLORS.ornament.gazprom.blue;
  ctx.beginPath();
  ctx.arc(x, y, effectiveRadius, 0, Math.PI * 2);
  ctx.fill();

  // Блик
  ctx.fillStyle = COLORS.ornament.gazprom.highlight;
  ctx.beginPath();
  ctx.arc(
    x - effectiveRadius / 3,
    y - effectiveRadius / 3,
    effectiveRadius / 3,
    0,
    Math.PI * 2
  );
  ctx.fill();

  // Пламя
  ctx.fillStyle = COLORS.ornament.gazprom.flame;
  ctx.beginPath();
  ctx.moveTo(x, y - effectiveRadius / 2);
  ctx.bezierCurveTo(
    x + effectiveRadius / 3,
    y - effectiveRadius / 4,
    x + effectiveRadius / 3,
    y + effectiveRadius / 4,
    x,
    y + effectiveRadius / 2
  );
  ctx.bezierCurveTo(
    x - effectiveRadius / 3,
    y + effectiveRadius / 4,
    x - effectiveRadius / 3,
    y - effectiveRadius / 4,
    x,
    y - effectiveRadius / 2
  );
  ctx.fill();

  if (isHovered) {
    ctx.restore();
  }

  // Подвес
  ctx.strokeStyle = COLORS.ornament.hanger;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y - effectiveRadius);
  ctx.lineTo(x, y - effectiveRadius - 3);
  ctx.stroke();
};

const drawTraditionalOrnament = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  color: string,
  isHovered: boolean = false
) => {
  const effectiveRadius = isHovered ? radius * 1.2 : radius;

  if (isHovered) {
    ctx.save();
    ctx.shadowColor = "#FFD700";
    ctx.shadowBlur = 15;
  }

  // Основной шар с градиентом
  const gradient = ctx.createRadialGradient(
    x - effectiveRadius / 3,
    y - effectiveRadius / 3,
    0,
    x,
    y,
    effectiveRadius
  );
  gradient.addColorStop(0, "rgba(255, 255, 255, 0.8)");
  gradient.addColorStop(0.3, color);
  gradient.addColorStop(1, color);

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, effectiveRadius, 0, Math.PI * 2);
  ctx.fill();

  if (isHovered) {
    ctx.restore();
  }

  // Подвес
  ctx.strokeStyle = COLORS.ornament.hanger;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x, y - effectiveRadius);
  ctx.lineTo(x, y - effectiveRadius - 3);
  ctx.stroke();
};

const drawGift = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  boxColor: string,
  ribbonColor: string
) => {
  // Основная коробка
  const gradient = ctx.createLinearGradient(x, y, x + width, y + height);
  gradient.addColorStop(0, boxColor);
  gradient.addColorStop(1, darkenColor(boxColor, 0.3));

  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, width, height);

  // Тень коробки
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.fillRect(x + 2, y + 2, width, height);
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, width, height);

  // Вертикальная лента
  ctx.fillStyle = ribbonColor;
  ctx.fillRect(x + width / 2 - 2, y, 4, height);

  // Горизонтальная лента
  ctx.fillRect(x, y + height / 2 - 2, width, 4);

  // Бант
  const bowCenterX = x + width / 2;
  const bowCenterY = y + height / 2;

  ctx.fillStyle = ribbonColor;

  // Левая петля банта
  ctx.beginPath();
  ctx.ellipse(bowCenterX - 4, bowCenterY, 5, 3, -0.3, 0, Math.PI * 2);
  ctx.fill();

  // Правая петля банта
  ctx.beginPath();
  ctx.ellipse(bowCenterX + 4, bowCenterY, 5, 3, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Центр банта
  ctx.beginPath();
  ctx.arc(bowCenterX, bowCenterY, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Блик на коробке
  ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
  ctx.fillRect(x + 2, y + 2, width / 3, height / 3);
};

const darkenColor = (color: string, amount: number): string => {
  // Простая функция затемнения цвета
  const num = parseInt(color.replace("#", ""), 16);
  const r = Math.max(0, (num >> 16) - amount * 255);
  const g = Math.max(0, ((num >> 8) & 0x00ff) - amount * 255);
  const b = Math.max(0, (num & 0x0000ff) - amount * 255);
  return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
};

const drawChristmasTree = (
  ctx: CanvasRenderingContext2D,
  mousePos: MousePosition | null,
  ornamentPositions: OrnamentPosition[]
) => {
  const treeX = TREE_X;
  const treeBaseY = TREE_BASE_Y;

  // Ствол
  ctx.fillStyle = COLORS.tree.trunk;
  ctx.fillRect(treeX - 8, treeBaseY - 12, 16, 16);

  // Слои дерева
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

  // Игрушки - логотипы Газпром-нефть
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
  gazpromPositions.forEach(([dx, dy], index) => {
    const ornament = ornamentPositions.find(
      (o) =>
        o.isGazprom &&
        Math.abs(o.x - (treeX + dx)) < 1 &&
        Math.abs(o.y - (treeBaseY + dy)) < 1
    );
    const isHovered = mousePos
      ? isMouseOverOrnament(
          mousePos.x,
          mousePos.y,
          treeX + dx,
          treeBaseY + dy,
          5
        )
      : false;
    drawGazpromOrnament(ctx, treeX + dx, treeBaseY + dy, 5, isHovered);
  });

  // Традиционные белые игрушки
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
    const isHovered = mousePos
      ? isMouseOverOrnament(
          mousePos.x,
          mousePos.y,
          treeX + dx,
          treeBaseY + dy,
          4
        )
      : false;
    drawTraditionalOrnament(
      ctx,
      treeX + dx,
      treeBaseY + dy,
      4,
      COLORS.ornament.traditional,
      isHovered
    );
  });
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

  // Голова
  ctx.fillStyle = COLORS.rabbit.fur;
  ctx.beginPath();
  ctx.arc(x, y, 10 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Затенение головы
  ctx.fillStyle = COLORS.rabbit.shading;
  ctx.beginPath();
  ctx.arc(x + 2 * scale, y + 2 * scale, 6 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Уши
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

  // Внутренняя часть ушей (розовая)
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

  // Глаза
  ctx.fillStyle = COLORS.rabbit.eyes;
  [
    [-3, -2],
    [3, -2],
  ].forEach(([ex, ey]) => {
    ctx.beginPath();
    ctx.arc(x + ex * scale, y + ey * scale, 2.5 * scale, 0, Math.PI * 2);
    ctx.fill();
  });

  // Блики в глазах
  ctx.fillStyle = COLORS.rabbit.fur;
  [
    [-2.5, -2.5],
    [3.5, -2.5],
  ].forEach(([ex, ey]) => {
    ctx.beginPath();
    ctx.arc(x + ex * scale, y + ey * scale, 1.2 * scale, 0, Math.PI * 2);
    ctx.fill();
  });

  // Нос
  ctx.fillStyle = COLORS.rabbit.pink;
  ctx.beginPath();
  ctx.moveTo(x, y + 2 * scale);
  ctx.lineTo(x - 2 * scale, y - 0.5 * scale);
  ctx.lineTo(x + 2 * scale, y - 0.5 * scale);
  ctx.closePath();
  ctx.fill();

  // Рот
  ctx.strokeStyle = "#888888";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y + 2 * scale, 3 * scale, 0.2, Math.PI - 0.2);
  ctx.stroke();

  // Усы
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

  // Румянец на щеках
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
// Основной компонент
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
  const mousePositionRef = useRef<MousePosition | null>(null);
  const offscreenCanvasRef = useRef<OffscreenCanvas | null>(null);
  const ornamentPositionsRef = useRef<OrnamentPosition[]>([]);
  const starPulseRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Инициализация позиций игрушек для hover эффекта
    const initOrnamentPositions = () => {
      const treeX = TREE_X;
      const treeBaseY = TREE_BASE_Y;
      const positions: OrnamentPosition[] = [];

      // Газпром игрушки
      [
        [0, -85],
        [0, -34],
        [-14, -64],
        [14, -64],
        [-22, -42],
        [22, -42],
        [-30, -20],
        [28, -20],
      ].forEach(([dx, dy]) => {
        positions.push({
          x: treeX + dx,
          y: treeBaseY + dy,
          radius: 5,
          isGazprom: true,
        });
      });

      // Белые игрушки
      [
        [8, -74],
        [-8, -74],
        [8, -50],
        [-8, -50],
        [14, -28],
        [-14, -28],
        [0, -17],
      ].forEach(([dx, dy]) => {
        positions.push({
          x: treeX + dx,
          y: treeBaseY + dy,
          radius: 4,
          isGazprom: false,
        });
      });

      ornamentPositionsRef.current = positions;
    };

    initOrnamentPositions();

    // Обработчик движения мыши
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePositionRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      canvas.style.cursor = ornamentPositionsRef.current.some((ornament) =>
        isMouseOverOrnament(
          mousePositionRef.current!.x,
          mousePositionRef.current!.y,
          ornament.x,
          ornament.y,
          ornament.radius
        )
      )
        ? "pointer"
        : "default";
    };

    const handleMouseLeave = () => {
      mousePositionRef.current = null;
      canvas.style.cursor = "default";
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // Создание OffscreenCanvas для статичных элементов (снег)
    let needsRedrawStatic = true;

    // Настройка
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = CANVAS_HEIGHT;

      if (typeof OffscreenCanvas !== "undefined") {
        offscreenCanvasRef.current = new OffscreenCanvas(
          canvas.width,
          canvas.height
        );
        const offscreenCtx = offscreenCanvasRef.current.getContext("2d");
        if (offscreenCtx) {
          drawSnowLayer(offscreenCtx, canvas.width, canvas.height);
        }
      }
      needsRedrawStatic = true;
      initOrnamentPositions();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Логика анимации
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

    // Основной цикл анимации
    let animationId: number;
    const animate = (currentTime: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Рисуем снег из OffscreenCanvas или напрямую
      if (offscreenCanvasRef.current && !needsRedrawStatic) {
        ctx.drawImage(offscreenCanvasRef.current, 0, 0);
      } else {
        drawSnowLayer(ctx, canvas.width, canvas.height);
        needsRedrawStatic = false;
      }

      // Рисуем подарки
      GIFTS.forEach((gift) => {
        drawGift(
          ctx,
          gift.x,
          gift.y,
          gift.width,
          gift.height,
          gift.color,
          gift.ribbonColor
        );
      });

      // Рисуем елку с hover эффектами
      drawChristmasTree(
        ctx,
        mousePositionRef.current,
        ornamentPositionsRef.current
      );

      // Анимация пульсации звезды
      starPulseRef.current += STAR_PULSE.speed;
      const pulseScale =
        STAR_PULSE.minScale +
        ((STAR_PULSE.maxScale - STAR_PULSE.minScale) *
          (Math.sin(starPulseRef.current * Math.PI * 2) + 1)) /
          2;

      drawStar(ctx, TREE_X, TREE_BASE_Y - 104, 10, 5, pulseScale);

      updateRabbit(currentTime);

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
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
