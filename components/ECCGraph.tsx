import React, { useRef, useState, useEffect } from 'react';
import { calculateY, Point } from '../utils/crypto-math';

export interface Line { 
    x1: number; 
    y1: number; 
    x2: number; 
    y2: number; 
    color?: string; 
    dashed?: boolean; 
}

export interface BallPos { 
    start: {x: number, y: number}; 
    end: {x: number, y: number}; 
    progress: number; 
}

interface ECCGraphProps {
    a: number; 
    b: number; 
    points?: Point[]; 
    lines?: Line[]; 
    interactive?: boolean; 
    onDragStart?: () => void; 
    onDrag?: (x: number) => void; 
    onDragEnd?: () => void;
    animatingBall?: BallPos | null; 
    scale?: number;
}

const ECCGraph: React.FC<ECCGraphProps> = ({
  a,
  b,
  points = [], 
  lines = [],  
  interactive = false,
  onDragStart = () => {},
  onDrag = (_: number) => {},
  onDragEnd = () => {},
  animatingBall = null,
  scale: customScale = 40,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 }); 
  const containerRef = useRef<HTMLDivElement>(null);
  
  const scale = customScale;

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        canvasRef.current.width = width;
        canvasRef.current.height = Math.min(width * 0.85, 450);
        setOffset({ x: width / 2, y: Math.min(width * 0.85, 450) / 2 });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#f8fafc'; // slate-50
    ctx.fillRect(0, 0, width, height);

    const toScreen = (x: number, y: number) => ({
      x: offset.x + x * scale,
      y: offset.y - y * scale,
    });

    // Grid
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    const gridRange = Math.ceil(Math.max(width, height) / scale / 2) + 5; 
    
    for (let x = -gridRange; x <= gridRange; x++) {
      const p1 = toScreen(x, -gridRange);
      ctx.beginPath(); ctx.moveTo(p1.x, 0); ctx.lineTo(p1.x, height); ctx.stroke();
    }
    for (let y = -gridRange; y <= gridRange; y++) {
      const p1 = toScreen(-gridRange, y);
      ctx.beginPath(); ctx.moveTo(0, p1.y); ctx.lineTo(width, p1.y); ctx.stroke();
    }

    // Axes
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, offset.y); ctx.lineTo(width, offset.y);
    ctx.moveTo(offset.x, 0); ctx.lineTo(offset.x, height);
    ctx.stroke();

    // Curve
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 3;
    ctx.beginPath();
    let started = false;
    for (let px = 0; px < width; px++) {
      const mathX = (px - offset.x) / scale;
      const mathY = calculateY(mathX, a, b);
      if (!isNaN(mathY)) {
        const pyTop = offset.y - mathY * scale;
        if (!started) { ctx.moveTo(px, pyTop); started = true; } else { ctx.lineTo(px, pyTop); }
      } else { started = false; }
    }
    ctx.stroke();
    ctx.beginPath();
    started = false;
    for (let px = 0; px < width; px++) {
        const mathX = (px - offset.x) / scale;
        const mathY = calculateY(mathX, a, b);
        if (!isNaN(mathY)) {
          const pyBottom = offset.y + mathY * scale;
          if (!started) { ctx.moveTo(px, pyBottom); started = true; } else { ctx.lineTo(px, pyBottom); }
        } else { started = false; }
    }
    ctx.stroke();

    // Lines
    lines.forEach(line => {
      const start = toScreen(line.x1, line.y1);
      const end = toScreen(line.x2, line.y2);
      ctx.strokeStyle = line.color || '#64748b';
      ctx.lineWidth = 2;
      if (line.dashed) ctx.setLineDash([5, 5]); else ctx.setLineDash([]);
      
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Points
    points.forEach(p => {
      const pos = toScreen(p.x, p.y);
      ctx.fillStyle = p.color || '#ea580c';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, p.size || 6, 0, Math.PI * 2);
      ctx.fill();
      if (p.label) {
        ctx.fillStyle = '#1e293b';
        ctx.font = 'bold 14px sans-serif';
        const dx = p.labelDx || 10;
        const dy = p.labelDy || -10;
        ctx.fillText(p.label, pos.x + dx, pos.y + dy);
      }
    });

    // Animating Ball
    if (animatingBall) {
        const start = toScreen(animatingBall.start.x, animatingBall.start.y);
        const end = toScreen(animatingBall.end.x, animatingBall.end.y);
        const curX = start.x + (end.x - start.x) * animatingBall.progress;
        const curY = start.y + (end.y - start.y) * animatingBall.progress;

        ctx.fillStyle = '#db2777'; 
        ctx.beginPath();
        ctx.arc(curX, curY, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

  }, [a, b, points, lines, scale, offset, animatingBall]);

  const handleInteraction = (e: any) => {
    if (!interactive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const x = ((clientX - rect.left) - offset.x) / scale;
    const ySq = x * x * x + a * x + b;
    if (ySq >= 0 && onDrag) onDrag(x);
  };

  return (
    <div ref={containerRef} className="w-full relative bg-slate-50 border border-slate-200 rounded-lg overflow-hidden cursor-crosshair touch-none">
      <canvas
        ref={canvasRef}
        onMouseDown={(e) => { onDragStart(); handleInteraction(e); }}
        onMouseMove={(e) => { if(e.buttons === 1) handleInteraction(e); }}
        onMouseUp={() => onDragEnd()}
        onTouchStart={(e) => { onDragStart(); handleInteraction(e); }}
        onTouchMove={handleInteraction}
        onTouchEnd={(e) => onDragEnd()}
        className="w-full block"
      />
      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1.5 rounded text-xs sm:text-sm text-slate-600 pointer-events-none font-mono shadow-sm">
        y² = x³ + {a !== 0 ? `${a}x +` : ''} {b}
      </div>
      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1.5 rounded text-xs text-slate-500 pointer-events-none font-mono flex items-center gap-1 shadow-sm">
        <span className="hidden sm:inline">缩放: </span>{scale.toFixed(1)}x
      </div>
    </div>
  );
};

export default ECCGraph;