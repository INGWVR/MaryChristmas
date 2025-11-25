import { useEffect, useRef } from "react";
import "./ChristmasScene.css";
import type {
  Rabbit,
  ChristmasSceneProps,
  MousePosition,
  OrnamentPosition,
} from "./types";
import {
  CANVAS_HEIGHT,
  TREE_BASE_Y,
  TREE_X,
  RABBIT,
  GIFTS,
  STAR_PULSE,
  TREE_SWAY,
} from "./constants";
import { isMouseOverOrnament } from "./utils/helpers";
import { drawSnowLayer } from "./drawing/drawSnow";
import { drawStar, drawChristmasTree } from "./drawing/drawTree";
import { drawGift } from "./drawing/drawGifts";
import { drawRabbit } from "./drawing/drawRabbit";

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
  const treeSwayRef = useRef<number>(0);

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

      // Анимация покачивания веток
      treeSwayRef.current += TREE_SWAY.speed;
      const swayOffset =
        Math.sin(treeSwayRef.current * Math.PI * 2) * TREE_SWAY.amplitude;

      // Рисуем елку с hover эффектами и покачиванием
      drawChristmasTree(
        ctx,
        mousePositionRef.current,
        ornamentPositionsRef.current,
        swayOffset
      );

      // Анимация пульсации звезды (с учетом покачивания)
      starPulseRef.current += STAR_PULSE.speed;
      const pulseScale =
        STAR_PULSE.minScale +
        ((STAR_PULSE.maxScale - STAR_PULSE.minScale) *
          (Math.sin(starPulseRef.current * Math.PI * 2) + 1)) /
          2;

      drawStar(ctx, TREE_X + swayOffset, TREE_BASE_Y - 104, 10, 5, pulseScale);

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
