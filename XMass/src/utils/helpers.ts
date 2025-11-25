// Вспомогательные функции

/**
 * Создает волну снега используя синусоиды с разными частотами
 */
export const createSnowWave = (
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

/**
 * Проверяет, находится ли курсор мыши над игрушкой
 */
export const isMouseOverOrnament = (
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

/**
 * Затемняет цвет на заданную величину
 */
export const darkenColor = (color: string, amount: number): string => {
  const num = parseInt(color.replace("#", ""), 16);
  const r = Math.max(0, (num >> 16) - amount * 255);
  const g = Math.max(0, ((num >> 8) & 0x00ff) - amount * 255);
  const b = Math.max(0, (num & 0x0000ff) - amount * 255);
  return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
};
