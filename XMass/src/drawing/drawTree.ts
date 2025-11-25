import { COLORS, TREE_BASE_Y, TREE_X } from "../constants";
import { isMouseOverOrnament } from "../utils/helpers";
import type { MousePosition, OrnamentPosition } from "../types";

/**
 * Рисует звезду на вершине елки с эффектом пульсации
 */
export const drawStar = (
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

/**
 * Рисует игрушку с логотипом Газпром-нефть
 */
export const drawGazpromOrnament = (
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

/**
 * Рисует традиционную белую игрушку
 */
export const drawTraditionalOrnament = (
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

/**
 * Рисует рождественскую елку с игрушками и покачиванием
 */
export const drawChristmasTree = (
  ctx: CanvasRenderingContext2D,
  mousePos: MousePosition | null,
  ornamentPositions: OrnamentPosition[],
  swayOffset: number = 0
) => {
  const treeX = TREE_X;
  const treeBaseY = TREE_BASE_Y;

  // Ствол (не покачивается)
  ctx.fillStyle = COLORS.tree.trunk;
  ctx.fillRect(treeX - 8, treeBaseY - 12, 16, 16);

  // Слои дерева с покачиванием
  const layers = [
    {
      yOffset: -32,
      width: 40,
      color: COLORS.tree.layers[0],
      swayMultiplier: 0.3,
    },
    {
      yOffset: -52,
      width: 34,
      color: COLORS.tree.layers[1],
      swayMultiplier: 0.5,
    },
    {
      yOffset: -74,
      width: 27,
      color: COLORS.tree.layers[2],
      swayMultiplier: 0.7,
    },
    {
      yOffset: -96,
      width: 18,
      color: COLORS.tree.layers[3],
      swayMultiplier: 1.0,
    },
  ];

  layers.forEach(({ yOffset, width, color, swayMultiplier }) => {
    const layerSwayOffset = swayOffset * swayMultiplier;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(treeX + layerSwayOffset, treeBaseY + yOffset);
    ctx.lineTo(treeX - width + layerSwayOffset, treeBaseY + yOffset + 24);
    ctx.lineTo(treeX + width + layerSwayOffset, treeBaseY + yOffset + 24);
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
  gazpromPositions.forEach(([dx, dy]) => {
    // Вычисляем покачивание для каждой игрушки в зависимости от высоты
    const layerIndex = dy < -80 ? 3 : dy < -60 ? 2 : dy < -40 ? 1 : 0;
    const swayMultiplier = [0.3, 0.5, 0.7, 1.0][layerIndex];
    const ornamentSwayOffset = swayOffset * swayMultiplier;

    const isHovered = mousePos
      ? isMouseOverOrnament(
          mousePos.x,
          mousePos.y,
          treeX + dx + ornamentSwayOffset,
          treeBaseY + dy,
          5
        )
      : false;
    drawGazpromOrnament(
      ctx,
      treeX + dx + ornamentSwayOffset,
      treeBaseY + dy,
      5,
      isHovered
    );
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
    // Вычисляем покачивание для каждой игрушки в зависимости от высоты
    const layerIndex = dy < -60 ? 2 : dy < -40 ? 1 : 0;
    const swayMultiplier = [0.3, 0.5, 0.7][layerIndex];
    const ornamentSwayOffset = swayOffset * swayMultiplier;

    const isHovered = mousePos
      ? isMouseOverOrnament(
          mousePos.x,
          mousePos.y,
          treeX + dx + ornamentSwayOffset,
          treeBaseY + dy,
          4
        )
      : false;
    drawTraditionalOrnament(
      ctx,
      treeX + dx + ornamentSwayOffset,
      treeBaseY + dy,
      4,
      COLORS.ornament.traditional,
      isHovered
    );
  });
};
