import { useEffect, useRef } from "react";

export default function WaterBoatScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const timeRef = useRef(0);
  const scrollRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function onScroll() {
      scrollRef.current = window.scrollY;
    }
    window.addEventListener("scroll", onScroll, { passive: true });

    function drawWater(t: number, scrollY: number) {
      const W = canvas!.width;
      const H = canvas!.height;

      // Sky-to-water gradient — warm dusk tones
      const sky = ctx.createLinearGradient(0, 0, 0, H * 0.55);
      sky.addColorStop(0, "#1a3a4a");
      sky.addColorStop(0.45, "#1e4d5e");
      sky.addColorStop(1, "#1b6b72");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // Horizon glow
      const glow = ctx.createRadialGradient(W * 0.5, H * 0.48, 0, W * 0.5, H * 0.48, W * 0.45);
      glow.addColorStop(0, "rgba(243,199,107,0.22)");
      glow.addColorStop(0.5, "rgba(243,160,60,0.08)");
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      // Sun disk
      const sunY = H * 0.42 - scrollY * 0.08;
      const sunGrad = ctx.createRadialGradient(W * 0.5, sunY, 0, W * 0.5, sunY, 80);
      sunGrad.addColorStop(0, "rgba(255,220,100,0.95)");
      sunGrad.addColorStop(0.4, "rgba(243,160,60,0.6)");
      sunGrad.addColorStop(1, "transparent");
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(W * 0.5, sunY, 80, 0, Math.PI * 2);
      ctx.fill();

      // Sun reflection pillar on water
      const reflectGrad = ctx.createLinearGradient(0, H * 0.52, 0, H);
      reflectGrad.addColorStop(0, "rgba(243,199,107,0.35)");
      reflectGrad.addColorStop(1, "rgba(243,199,107,0.04)");
      ctx.fillStyle = reflectGrad;
      ctx.fillRect(W * 0.44, H * 0.52, W * 0.12, H * 0.5);

      // Water surface base
      const waterGrad = ctx.createLinearGradient(0, H * 0.5, 0, H);
      waterGrad.addColorStop(0, "#1b6b72");
      waterGrad.addColorStop(0.3, "#124f57");
      waterGrad.addColorStop(1, "#0a3540");
      ctx.fillStyle = waterGrad;
      ctx.fillRect(0, H * 0.5, W, H * 0.5);

      // Horizon line
      ctx.save();
      ctx.globalAlpha = 0.6;
      const horizonGrad = ctx.createLinearGradient(0, 0, W, 0);
      horizonGrad.addColorStop(0, "transparent");
      horizonGrad.addColorStop(0.3, "rgba(243,199,107,0.5)");
      horizonGrad.addColorStop(0.5, "rgba(255,230,120,0.9)");
      horizonGrad.addColorStop(0.7, "rgba(243,199,107,0.5)");
      horizonGrad.addColorStop(1, "transparent");
      ctx.strokeStyle = horizonGrad;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, H * 0.502);
      ctx.lineTo(W, H * 0.502);
      ctx.stroke();
      ctx.restore();

      // Water waves — layered
      drawWaves(ctx, W, H, t, 1, 0.018, 28, "rgba(255,255,255,0.07)", scrollY);
      drawWaves(ctx, W, H, t * 0.7, 0.8, 0.025, 22, "rgba(100,200,210,0.06)", scrollY);
      drawWaves(ctx, W, H, t * 1.3, 0.5, 0.04, 14, "rgba(255,255,255,0.04)", scrollY);

      // Subtle distant trees / mountains silhouette
      drawSilhouette(ctx, W, H);
    }

    function drawWaves(
      ctx: CanvasRenderingContext2D,
      W: number,
      H: number,
      t: number,
      amp: number,
      freq: number,
      count: number,
      color: string,
      scrollY: number
    ) {
      const spacing = (H * 0.48) / count;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      for (let i = 0; i < count; i++) {
        const y = H * 0.52 + i * spacing + scrollY * 0.04;
        const phase = t + i * 0.4;
        const waveAmp = amp * (1 + i * 0.06);
        ctx.beginPath();
        for (let x = 0; x <= W; x += 4) {
          const dy = Math.sin(x * freq + phase) * waveAmp * 8 +
                     Math.sin(x * freq * 1.7 + phase * 1.3) * waveAmp * 3;
          if (x === 0) ctx.moveTo(x, y + dy);
          else ctx.lineTo(x, y + dy);
        }
        ctx.stroke();
      }
    }

    function drawSilhouette(ctx: CanvasRenderingContext2D, W: number, H: number) {
      ctx.save();
      ctx.fillStyle = "rgba(10,30,35,0.7)";

      // Left treeline
      ctx.beginPath();
      ctx.moveTo(0, H * 0.502);
      for (let x = 0; x < W * 0.3; x += 8) {
        const treeH = 18 + Math.sin(x * 0.08) * 12 + Math.sin(x * 0.2) * 8;
        ctx.lineTo(x, H * 0.502 - treeH);
      }
      ctx.lineTo(W * 0.3, H * 0.502);
      ctx.closePath();
      ctx.fill();

      // Right treeline
      ctx.beginPath();
      ctx.moveTo(W * 0.7, H * 0.502);
      for (let x = W * 0.7; x <= W; x += 8) {
        const treeH = 15 + Math.sin(x * 0.07 + 1) * 14 + Math.sin(x * 0.18 + 2) * 6;
        ctx.lineTo(x, H * 0.502 - treeH);
      }
      ctx.lineTo(W, H * 0.502);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }

    function drawBoat(ctx: CanvasRenderingContext2D, W: number, H: number, t: number, scrollY: number) {
      const progress = Math.min(scrollY / 600, 1);
      // boat moves from center-left toward center as user scrolls
      const bx = W * (0.38 + progress * 0.12);
      const bobY = Math.sin(t * 0.8) * 3.5 + Math.sin(t * 1.4) * 1.5;
      const tiltRad = Math.sin(t * 0.5) * 0.025;
      const by = H * 0.52 + bobY;

      ctx.save();
      ctx.translate(bx, by);
      ctx.rotate(tiltRad);

      // === BOAT HULL ===
      const hullW = 110;
      const hullH = 22;

      // Hull shadow
      ctx.save();
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.ellipse(4, hullH + 5, hullW * 0.55, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Hull body — wooden dark tone
      const hullGrad = ctx.createLinearGradient(-hullW * 0.5, -hullH, hullW * 0.5, hullH);
      hullGrad.addColorStop(0, "#7c4a1e");
      hullGrad.addColorStop(0.5, "#5c3310");
      hullGrad.addColorStop(1, "#3d1f08");
      ctx.fillStyle = hullGrad;
      ctx.beginPath();
      ctx.moveTo(-hullW * 0.5, 0);
      ctx.bezierCurveTo(-hullW * 0.48, -hullH * 0.7, -hullW * 0.15, -hullH, hullW * 0.1, -hullH);
      ctx.lineTo(hullW * 0.5, -hullH * 0.2);
      ctx.bezierCurveTo(hullW * 0.58, 0, hullW * 0.42, hullH * 0.9, 0, hullH);
      ctx.bezierCurveTo(-hullW * 0.3, hullH, -hullW * 0.52, hullH * 0.5, -hullW * 0.5, 0);
      ctx.fill();

      // Hull rim highlight
      ctx.strokeStyle = "rgba(180,100,40,0.6)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-hullW * 0.5, 0);
      ctx.bezierCurveTo(-hullW * 0.48, -hullH * 0.7, -hullW * 0.15, -hullH, hullW * 0.1, -hullH);
      ctx.lineTo(hullW * 0.5, -hullH * 0.2);
      ctx.stroke();

      // Hull planks texture
      ctx.strokeStyle = "rgba(0,0,0,0.2)";
      ctx.lineWidth = 0.8;
      for (let i = 1; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(-hullW * 0.45 + i * 18, -hullH * 0.6);
        ctx.lineTo(-hullW * 0.35 + i * 18, hullH * 0.6);
        ctx.stroke();
      }

      // === CABIN / CANOPY ===
      const cabinGrad = ctx.createLinearGradient(-30, -hullH - 28, 30, -hullH);
      cabinGrad.addColorStop(0, "#d4a855");
      cabinGrad.addColorStop(1, "#b8892e");
      ctx.fillStyle = cabinGrad;
      ctx.beginPath();
      ctx.moveTo(-28, -hullH);
      ctx.lineTo(-32, -hullH - 28);
      ctx.lineTo(30, -hullH - 28);
      ctx.lineTo(32, -hullH);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.15)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Canopy top beam
      ctx.fillStyle = "#8b6020";
      ctx.fillRect(-34, -hullH - 32, 68, 5);

      // Canopy shadow underside
      ctx.save();
      ctx.globalAlpha = 0.3;
      ctx.fillStyle = "#3d1f08";
      ctx.fillRect(-28, -hullH - 3, 60, 5);
      ctx.restore();

      // === MAST ===
      ctx.strokeStyle = "#4a2c10";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-10, -hullH);
      ctx.lineTo(-8, -hullH - 85);
      ctx.stroke();

      // === SAIL ===
      const sailBreath = Math.sin(t * 0.6) * 4;
      const sailGrad = ctx.createLinearGradient(-8, -hullH - 80, 55, -hullH - 20);
      sailGrad.addColorStop(0, "rgba(245,235,210,0.95)");
      sailGrad.addColorStop(0.6, "rgba(230,215,180,0.88)");
      sailGrad.addColorStop(1, "rgba(200,180,140,0.7)");
      ctx.fillStyle = sailGrad;
      ctx.beginPath();
      ctx.moveTo(-8, -hullH - 78);
      ctx.bezierCurveTo(
        20 + sailBreath, -hullH - 55,
        55 + sailBreath, -hullH - 30,
        30, -hullH - 5
      );
      ctx.lineTo(-8, -hullH - 5);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "rgba(160,130,80,0.4)";
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Sail rigging line
      ctx.strokeStyle = "rgba(100,70,30,0.5)";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(-8, -hullH - 78);
      ctx.lineTo(30, -hullH - 5);
      ctx.stroke();

      // === PERSON (rower) ===
      const personX = 15;
      const personY = -hullH - 2;

      // Body
      ctx.fillStyle = "#2c4a3e";
      ctx.beginPath();
      ctx.ellipse(personX, personY - 14, 7, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Head
      const headGrad = ctx.createRadialGradient(personX, personY - 28, 0, personX, personY - 28, 8);
      headGrad.addColorStop(0, "#c68642");
      headGrad.addColorStop(1, "#a0522d");
      ctx.fillStyle = headGrad;
      ctx.beginPath();
      ctx.arc(personX, personY - 28, 7, 0, Math.PI * 2);
      ctx.fill();

      // Hat
      ctx.fillStyle = "#d4a855";
      ctx.beginPath();
      ctx.ellipse(personX, personY - 33, 10, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(personX - 6, personY - 40, 12, 9);
      ctx.beginPath();
      ctx.ellipse(personX, personY - 40, 7, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Oar
      const oarAngle = Math.sin(t * 0.8) * 0.2;
      ctx.save();
      ctx.translate(personX + 10, personY - 8);
      ctx.rotate(0.3 + oarAngle);
      ctx.strokeStyle = "#7c4a1e";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(45, 15);
      ctx.stroke();
      ctx.fillStyle = "rgba(80,40,10,0.85)";
      ctx.beginPath();
      ctx.ellipse(46, 16, 10, 4, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Water ripple around hull
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.strokeStyle = "#80c8cc";
      ctx.lineWidth = 1.5;
      for (let r = 0; r < 3; r++) {
        ctx.beginPath();
        ctx.ellipse(0, hullH, (hullW * 0.6 + r * 18) * (1 + Math.sin(t + r) * 0.05), 6 + r * 2, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      ctx.restore();
    }

    function animate() {
      timeRef.current += 0.016;
      const t = timeRef.current;
      const scrollY = scrollRef.current;

      drawWater(t, scrollY);
      drawBoat(ctx, canvas!.width, canvas!.height, t, scrollY);

      frameRef.current = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
    />
  );
}
