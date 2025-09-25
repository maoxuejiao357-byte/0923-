import React, { useEffect, useRef, useState } from 'react';

interface TrailPoint {
  x: number;
  y: number;
  timestamp: number;
}

interface MouseTrailEffectProps {
  isActive?: boolean;
  trailLength?: number;
  colors?: string[];
}

const MouseTrailEffect: React.FC<MouseTrailEffectProps> = ({
  isActive = false,
  trailLength = 20,
  colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c']
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef = useRef<TrailPoint[]>([]);
  const animationRef = useRef<number>();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const newPoint: TrailPoint = {
        x: e.clientX,
        y: e.clientY,
        timestamp: Date.now()
      };
      
      trailRef.current.push(newPoint);
      setMousePos({ x: e.clientX, y: e.clientY });
      
      // 限制轨迹长度
      if (trailRef.current.length > trailLength) {
        trailRef.current.shift();
      }
    };

    const drawTrail = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (!isActive || trailRef.current.length < 2) return;

      const now = Date.now();
      
      // 过滤过期的点
      trailRef.current = trailRef.current.filter(point => now - point.timestamp < 1000);
      
      // 绘制轨迹
      trailRef.current.forEach((point, index) => {
        const age = now - point.timestamp;
        const opacity = Math.max(0, 1 - age / 1000);
        const size = Math.max(1, 8 - (age / 1000) * 6);
        
        ctx.save();
        ctx.globalAlpha = opacity;
        
        // 创建径向渐变
        const gradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, size * 2
        );
        
        const colorIndex = index % colors.length;
        gradient.addColorStop(0, colors[colorIndex]);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.shadowBlur = 15;
        ctx.shadowColor = colors[colorIndex];
        
        ctx.beginPath();
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 绘制连接线
      if (trailRef.current.length > 1) {
        ctx.save();
        ctx.strokeStyle = colors[0];
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = colors[0];
        
        ctx.beginPath();
        trailRef.current.forEach((point, index) => {
          const age = now - point.timestamp;
          const opacity = Math.max(0, 0.5 - age / 1000);
          ctx.globalAlpha = opacity;
          
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
        ctx.restore();
      }
    };

    const animate = () => {
      drawTrail();
      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    animate();

    if (isActive) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isActive, trailLength, colors]);

  // 鼠标位置指示器
  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-50"
        style={{ background: 'transparent' }}
      />
      {isActive && (
        <div
          className="fixed pointer-events-none z-50 transition-all duration-100"
          style={{
            left: mousePos.x - 10,
            top: mousePos.y - 10,
            width: 20,
            height: 20,
            background: `radial-gradient(circle, ${colors[0]}, transparent)`,
            borderRadius: '50%',
            boxShadow: `0 0 20px ${colors[0]}`,
            transform: 'scale(1.5)',
          }}
        />
      )}
    </>
  );
};

export default MouseTrailEffect;