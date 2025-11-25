import { COLORS } from "../constants";
import { createSnowWave } from "../utils/helpers";

/**
 * Рисует многослойный снег с эффектом параллакса
 */
export const drawSnowLayer = (
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
