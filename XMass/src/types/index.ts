// Типы и интерфейсы для рождественской сцены

export interface Rabbit {
  side: "left" | "right";
  visible: boolean;
  progress: number; // От 0 до 1 для анимации
}

export interface ChristmasSceneProps {
  rabbitInterval?: number; // Интервал в секундах (по умолчанию: 30)
}

export interface MousePosition {
  x: number;
  y: number;
}

export interface OrnamentPosition {
  x: number;
  y: number;
  radius: number;
  isGazprom: boolean;
}
