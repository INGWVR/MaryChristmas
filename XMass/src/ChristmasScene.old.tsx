import { useEffect, useRef } from "react";
import "./ChristmasScene.css";

interface Rabbit {
  side: "left" | "right"; // Which side of screen
  visible: boolean;
  progress: number; // 0 to 1 for animation
}

interface ChristmasSceneProps {
  rabbitInterval?: number; // Interval in seconds between rabbit appearances (default: 30)
}

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

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = 180; // Extra height for star, but elements stay at same position
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Draw snow layer with snowdrifts
    const drawSnowLayer = () => {
      // Back layer (darker, further away)
      const backGradient = ctx.createLinearGradient(0, 92, 0, canvas.height);
      backGradient.addColorStop(0, "rgba(200, 220, 230, 0.6)");
      backGradient.addColorStop(0.5, "rgba(210, 230, 240, 0.7)");
      backGradient.addColorStop(1, "rgba(220, 235, 245, 0.8)");

      ctx.fillStyle = backGradient;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);

      for (let x = 0; x <= canvas.width; x += 10) {
        const y =
          100 +
          Math.sin(x * 0.008) * 20 +
          Math.sin(x * 0.025) * 10 +
          Math.sin(x * 0.04) * 6;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();

      // Middle layer
      const middleGradient = ctx.createLinearGradient(0, 108, 0, canvas.height);
      middleGradient.addColorStop(0, "#D8E8F0");
      middleGradient.addColorStop(0.5, "#E0ECF4");
      middleGradient.addColorStop(1, "#EDF5F9");

      ctx.fillStyle = middleGradient;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);

      for (let x = 0; x <= canvas.width; x += 10) {
        const y =
          116 +
          Math.sin(x * 0.012 + 1) * 18 +
          Math.sin(x * 0.035 + 2) * 9 +
          Math.sin(x * 0.055 + 1.5) * 5;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();

      // Front layer (brightest, closest)
      const frontGradient = ctx.createLinearGradient(0, 124, 0, canvas.height);
      frontGradient.addColorStop(0, "#E8F4F8");
      frontGradient.addColorStop(0.5, "#F0F6FA");
      frontGradient.addColorStop(1, "#FFFFFF");

      ctx.fillStyle = frontGradient;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);

      for (let x = 0; x <= canvas.width; x += 10) {
        const y =
          132 +
          Math.sin(x * 0.01) * 15 +
          Math.sin(x * 0.03) * 8 +
          Math.sin(x * 0.05) * 5;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();

      // Add snow highlights on front layer
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      for (let x = 0; x <= canvas.width; x += 10) {
        const y =
          136 +
          Math.sin(x * 0.01) * 15 +
          Math.sin(x * 0.03) * 8 +
          Math.sin(x * 0.05) * 5;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();

      // Add some sparkles on snow
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * canvas.width;
        const y = 132 + Math.random() * 30;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // Draw Christmas tree
    const drawChristmasTree = () => {
      const treeX = 80;
      const treeBaseY = 140; // Fixed position from top instead of bottom

      // Tree trunk
      ctx.fillStyle = "#5C4033";
      ctx.fillRect(treeX - 8, treeBaseY - 12, 16, 16);

      // Draw tree as overlapping triangular sections (classic Christmas tree shape)
      // Bottom section
      ctx.fillStyle = "#1E6B45";
      ctx.beginPath();
      ctx.moveTo(treeX, treeBaseY - 32);
      ctx.lineTo(treeX - 40, treeBaseY);
      ctx.lineTo(treeX + 40, treeBaseY);
      ctx.closePath();
      ctx.fill();

      // Middle section
      ctx.fillStyle = "#227A4D";
      ctx.beginPath();
      ctx.moveTo(treeX, treeBaseY - 56);
      ctx.lineTo(treeX - 34, treeBaseY - 24);
      ctx.lineTo(treeX + 34, treeBaseY - 24);
      ctx.closePath();
      ctx.fill();

      // Top section
      ctx.fillStyle = "#268854";
      ctx.beginPath();
      ctx.moveTo(treeX, treeBaseY - 80);
      ctx.lineTo(treeX - 27, treeBaseY - 48);
      ctx.lineTo(treeX + 27, treeBaseY - 48);
      ctx.closePath();
      ctx.fill();

      // Very top section
      ctx.fillStyle = "#2D9F5C";
      ctx.beginPath();
      ctx.moveTo(treeX, treeBaseY - 96);
      ctx.lineTo(treeX - 18, treeBaseY - 72);
      ctx.lineTo(treeX + 18, treeBaseY - 72);
      ctx.closePath();
      ctx.fill();

      // Gazprom-neft logo ornaments - better placement
      drawGazpromOrnament(ctx, treeX - 0, treeBaseY - 85, 5);
      drawGazpromOrnament(ctx, treeX - 0, treeBaseY - 34, 5);
      drawGazpromOrnament(ctx, treeX - 14, treeBaseY - 65, 5);
      drawGazpromOrnament(ctx, treeX + 14, treeBaseY - 65, 5);
      drawGazpromOrnament(ctx, treeX - 22, treeBaseY - 40, 5);
      drawGazpromOrnament(ctx, treeX + 22, treeBaseY - 40, 5);
      drawGazpromOrnament(ctx, treeX - 30, treeBaseY - 16, 5);
      drawGazpromOrnament(ctx, treeX + 28, treeBaseY - 16, 5);

      // Traditional ornaments - white
      drawOrnament(ctx, treeX + 8, treeBaseY - 74, 4, "#FFFFFF");
      drawOrnament(ctx, treeX - 8, treeBaseY - 74, 4, "#FFFFFF");
      drawOrnament(ctx, treeX + 8, treeBaseY - 50, 4, "#FFFFFF");
      drawOrnament(ctx, treeX - 8, treeBaseY - 50, 4, "#FFFFFF");
      drawOrnament(ctx, treeX + 14, treeBaseY - 28, 4, "#FFFFFF");
      drawOrnament(ctx, treeX - 14, treeBaseY - 28, 4, "#FFFFFF");
      drawOrnament(ctx, treeX, treeBaseY - 17, 4, "#FFFFFF");

      // Star on top - draw LAST so it's on top of everything
      drawStar(ctx, treeX, treeBaseY - 104, 10, 5, "#FFD700");
    };

    // Draw star
    const drawStar = (
      ctx: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      outerRadius: number,
      innerRadius: number,
      color: string
    ) => {
      // Add glow effect first
      ctx.save();
      ctx.shadowColor = "#FFD700";
      ctx.shadowBlur = 20;

      ctx.fillStyle = color;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const outerAngle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
        const innerAngle = outerAngle + Math.PI / 5;

        if (i === 0) {
          ctx.moveTo(
            cx + Math.cos(outerAngle) * outerRadius,
            cy + Math.sin(outerAngle) * outerRadius
          );
        } else {
          ctx.lineTo(
            cx + Math.cos(outerAngle) * outerRadius,
            cy + Math.sin(outerAngle) * outerRadius
          );
        }

        ctx.lineTo(
          cx + Math.cos(innerAngle) * innerRadius,
          cy + Math.sin(innerAngle) * innerRadius
        );
      }
      ctx.closePath();
      ctx.fill();

      // Draw bright center
      ctx.fillStyle = "#FFEB3B";
      ctx.beginPath();
      ctx.arc(cx, cy, innerRadius / 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // Draw Gazprom-neft style ornament (circle with flame)
    const drawGazpromOrnament = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      radius: number
    ) => {
      // Main circle (blue like Gazprom-neft brand)
      ctx.fillStyle = "#0078D2";
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Highlight
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.beginPath();
      ctx.arc(x - radius / 3, y - radius / 3, radius / 3, 0, Math.PI * 2);
      ctx.fill();

      // Stylized flame in the center
      ctx.fillStyle = "#FF6B00";
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

      // Ornament hanger
      ctx.strokeStyle = "#C0C0C0";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y - radius);
      ctx.lineTo(x, y - radius - 3);
      ctx.stroke();
    };

    // Draw traditional ornament
    const drawOrnament = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      radius: number,
      color: string
    ) => {
      // Main ball
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

      // Ornament hanger
      ctx.strokeStyle = "#C0C0C0";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y - radius);
      ctx.lineTo(x, y - radius - 3);
      ctx.stroke();
    };

    // Draw rabbit peeking from side of screen
    const drawRabbit = (side: "left" | "right", progress: number) => {
      const rabbitY = 120; // Vertical position
      const peekDistance = 60 * progress; // How far the rabbit peeks in

      // Calculate X position based on side
      const rabbitX =
        side === "left" ? -40 + peekDistance : canvas.width + 40 - peekDistance;

      // Flip rabbit if coming from right side
      const flipScale = side === "right" ? -1 : 1;

      // Head tilt angle (leans in when peeking)
      const tiltAngle = (side === "left" ? 1 : -1) * 0.25 * progress;

      ctx.save();

      // Translate, rotate (tilt), and flip if needed
      ctx.translate(rabbitX, rabbitY);
      ctx.rotate(tiltAngle);
      ctx.scale(flipScale, 1);

      const x = 0; // Local coordinate after transform
      const headY = 0;

      // Scale factor for bigger head
      const scale = 2.5;

      // Rabbit head (bigger and closer)
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(x, headY, 10 * scale, 0, Math.PI * 2);
      ctx.fill();

      // Head shading
      ctx.fillStyle = "rgba(230, 230, 230, 0.3)";
      ctx.beginPath();
      ctx.arc(x + 2 * scale, headY + 2 * scale, 6 * scale, 0, Math.PI * 2);
      ctx.fill();

      // Left ear
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.ellipse(
        x - 5 * scale,
        headY - 10 * scale,
        3 * scale,
        8 * scale,
        -0.3,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Right ear
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.ellipse(
        x + 5 * scale,
        headY - 10 * scale,
        3 * scale,
        8 * scale,
        0.3,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Inner ear (pink)
      ctx.fillStyle = "#FFB6C1";
      ctx.beginPath();
      ctx.ellipse(
        x - 5 * scale,
        headY - 10 * scale,
        1.5 * scale,
        5 * scale,
        -0.3,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(
        x + 5 * scale,
        headY - 10 * scale,
        1.5 * scale,
        5 * scale,
        0.3,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Eyes (black with white highlight) - bigger and more expressive
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(x - 3 * scale, headY - 2 * scale, 2.5 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(x + 3 * scale, headY - 2 * scale, 2.5 * scale, 0, Math.PI * 2);
      ctx.fill();

      // Eye highlights (larger)
      ctx.fillStyle = "#FFFFFF";
      ctx.beginPath();
      ctx.arc(
        x - 2.5 * scale,
        headY - 2.5 * scale,
        1.2 * scale,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.beginPath();
      ctx.arc(
        x + 3.5 * scale,
        headY - 2.5 * scale,
        1.2 * scale,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Nose (pink, triangle shape)
      ctx.fillStyle = "#FFB6C1";
      ctx.beginPath();
      ctx.moveTo(x, headY + 2 * scale);
      ctx.lineTo(x - 2 * scale, headY - 0.5 * scale);
      ctx.lineTo(x + 2 * scale, headY - 0.5 * scale);
      ctx.closePath();
      ctx.fill();

      // Mouth (small smile)
      ctx.strokeStyle = "#888888";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, headY + 2 * scale, 3 * scale, 0.2, Math.PI - 0.2);
      ctx.stroke();

      // Whiskers (longer and thicker)
      ctx.strokeStyle = "#666666";
      ctx.lineWidth = 1.5;
      // Left whiskers
      ctx.beginPath();
      ctx.moveTo(x - 2 * scale, headY + 1 * scale);
      ctx.lineTo(x - 15 * scale, headY - 2 * scale);
      ctx.moveTo(x - 2 * scale, headY + 2 * scale);
      ctx.lineTo(x - 15 * scale, headY + 2 * scale);
      ctx.moveTo(x - 2 * scale, headY + 3 * scale);
      ctx.lineTo(x - 15 * scale, headY + 5 * scale);
      ctx.stroke();
      // Right whiskers
      ctx.beginPath();
      ctx.moveTo(x + 2 * scale, headY + 1 * scale);
      ctx.lineTo(x + 15 * scale, headY - 2 * scale);
      ctx.moveTo(x + 2 * scale, headY + 2 * scale);
      ctx.lineTo(x + 15 * scale, headY + 2 * scale);
      ctx.moveTo(x + 2 * scale, headY + 3 * scale);
      ctx.lineTo(x + 15 * scale, headY + 5 * scale);
      ctx.stroke();

      // Add cute cheek blush
      ctx.fillStyle = "rgba(255, 182, 193, 0.4)";
      ctx.beginPath();
      ctx.ellipse(
        x - 8 * scale,
        headY + 4 * scale,
        3 * scale,
        2 * scale,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(
        x + 8 * scale,
        headY + 4 * scale,
        3 * scale,
        2 * scale,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();

      ctx.restore();
    };

    // Update rabbit animation
    const updateRabbit = (currentTime: number) => {
      const rabbit = rabbitRef.current;

      // Check if the specified interval has passed
      const intervalMs = rabbitInterval * 1000;
      if (currentTime - lastRabbitTimeRef.current > intervalMs) {
        if (!rabbit.visible) {
          // Start new rabbit appearance
          rabbit.visible = true;
          rabbit.progress = 0;
          rabbit.side = Math.random() > 0.5 ? "right" : "left"; // Random side
          lastRabbitTimeRef.current = currentTime;
        }
      }

      if (rabbit.visible) {
        // Animate rabbit peeking out and going back
        const animationDuration = 3000; // 3 seconds total animation
        const timeSinceStart = currentTime - lastRabbitTimeRef.current;

        if (timeSinceStart < animationDuration / 2) {
          // Peeking out (0 to 1)
          rabbit.progress = timeSinceStart / (animationDuration / 2);
        } else if (timeSinceStart < animationDuration) {
          // Going back (1 to 0)
          rabbit.progress =
            1 -
            (timeSinceStart - animationDuration / 2) / (animationDuration / 2);
        } else {
          // Animation finished
          rabbit.visible = false;
          rabbit.progress = 0;
        }

        if (rabbit.progress > 0) {
          drawRabbit(rabbit.side, rabbit.progress);
        }
      }
    };

    // Animation loop
    let animationId: number;
    const animate = (currentTime: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawSnowLayer();
      drawChristmasTree();
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
