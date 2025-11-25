import { darkenColor } from "../utils/helpers";

/**
 * Рисует подарок с лентой и бантом
 */
export const drawGift = (
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
