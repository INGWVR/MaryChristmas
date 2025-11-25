import { COLORS, RABBIT } from "../constants";

/**
 * Рисует кролика, выглядывающего из-за края экрана
 */
export const drawRabbit = (
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
