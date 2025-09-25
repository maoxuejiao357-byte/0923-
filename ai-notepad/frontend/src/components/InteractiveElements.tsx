import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, IconButton } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

// 悬浮动画
const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

// 磁场效果
const magneticPull = keyframes`
  0% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(1.05) rotate(2deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
`;

// 能量波纹
const energyRipple = keyframes`
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
`;

// 全息闪烁
const hologramFlicker = keyframes`
  0%, 100% {
    opacity: 1;
    filter: brightness(1);
  }
  50% {
    opacity: 0.8;
    filter: brightness(1.2);
  }
`;

// 量子扭曲
const quantumWarp = keyframes`
  0% {
    transform: perspective(1000px) rotateX(0deg) rotateY(0deg);
  }
  25% {
    transform: perspective(1000px) rotateX(5deg) rotateY(5deg);
  }
  50% {
    transform: perspective(1000px) rotateX(0deg) rotateY(10deg);
  }
  75% {
    transform: perspective(1000px) rotateX(-5deg) rotateY(5deg);
  }
  100% {
    transform: perspective(1000px) rotateX(0deg) rotateY(0deg);
  }
`;

interface FloatingElementProps {
  children: React.ReactNode;
  intensity?: number;
  speed?: string;
  delay?: string;
}

export const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  intensity = 10,
  speed = '3s',
  delay = '0s'
}) => {
  return (
    <Box
      animation={`${floatAnimation} ${speed} ease-in-out infinite`}
      sx={{
        animationDelay: delay,
        '--float-intensity': `${intensity}px`,
      }}
    >
      {children}
    </Box>
  );
};

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: string;
  colorScheme?: string;
  size?: string;
  magneticStrength?: number;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  onClick,
  variant = 'solid',
  colorScheme = 'blue',
  size = 'md',
  magneticStrength = 20
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovered) return;
      
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) / magneticStrength;
      const deltaY = (e.clientY - centerY) / magneticStrength;
      
      setMousePosition({ x: deltaX, y: deltaY });
      
      button.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      setMousePosition({ x: 0, y: 0 });
      button.style.transform = 'translate(0px, 0px)';
    };

    document.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isHovered, magneticStrength]);

  return (
    <Button
      ref={buttonRef}
      variant={variant}
      colorScheme={colorScheme}
      size={size}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      transition="all 0.3s cubic-bezier(0.23, 1, 0.320, 1)"
      sx={{
        cursor: 'pointer',
        '&:hover': {
          animation: `${magneticPull} 0.6s ease-in-out infinite`,
          boxShadow: '0 0 20px rgba(102, 126, 234, 0.6)',
        },
      }}
    >
      {children}
    </Button>
  );
};

interface RippleEffectProps {
  children: React.ReactNode;
  color?: string;
  size?: number;
}

export const RippleEffect: React.FC<RippleEffectProps> = ({
  children,
  color = '#667eea',
  size = 100
}) => {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const createRipple = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = {
      id: Date.now(),
      x,
      y
    };
    
    setRipples(prev => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  };

  return (
    <Box
      ref={containerRef}
      position="relative"
      overflow="hidden"
      onClick={createRipple}
      cursor="pointer"
    >
      {children}
      {ripples.map(ripple => (
        <Box
          key={ripple.id}
          position="absolute"
          width={`${size}px`}
          height={`${size}px`}
          borderRadius="50%"
          bg={color}
          opacity={0.6}
          pointerEvents="none"
          left={`${ripple.x - size / 2}px`}
          top={`${ripple.y - size / 2}px`}
          animation={`${energyRipple} 0.6s ease-out`}
        />
      ))}
    </Box>
  );
};

interface HologramCardProps {
  children: React.ReactNode;
  width?: string;
  height?: string;
  glitchIntensity?: number;
}

export const HologramCard: React.FC<HologramCardProps> = ({
  children,
  width = '300px',
  height = '200px',
  glitchIntensity = 0.1
}) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < glitchIntensity) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 100);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [glitchIntensity]);

  return (
    <Box
      width={width}
      height={height}
      position="relative"
      bg="rgba(0, 255, 255, 0.05)"
      border="1px solid rgba(0, 255, 255, 0.3)"
      borderRadius="md"
      overflow="hidden"
      sx={{
        backdropFilter: 'blur(10px)',
        '&:hover': {
          animation: `${hologramFlicker} 2s ease-in-out infinite`,
          borderColor: 'rgba(0, 255, 255, 0.8)',
          boxShadow: '0 0 30px rgba(0, 255, 255, 0.3)',
        },
      }}
    >
      {/* 全息扫描线 */}
      <Box
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="2px"
        bg="linear-gradient(90deg, transparent 0%, #00ffff 50%, transparent 100%)"
        animation={`${hologramFlicker} 3s ease-in-out infinite`}
      />
      
      {/* 内容 */}
      <Box
        p={4}
        height="100%"
        sx={{
          filter: isGlitching ? 'hue-rotate(180deg) saturate(2)' : 'none',
          transition: 'filter 0.1s ease',
        }}
      >
        {children}
      </Box>
      
      {/* 故障效果 */}
      {isGlitching && (
        <Box
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          bg="rgba(255, 0, 255, 0.1)"
          pointerEvents="none"
        />
      )}
    </Box>
  );
};

interface QuantumButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const QuantumButton: React.FC<QuantumButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  isLoading = false
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  
  const variantStyles = {
    primary: {
      bg: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      shadow: '0 0 20px rgba(102, 126, 234, 0.5)',
    },
    secondary: {
      bg: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
      color: 'white',
      shadow: '0 0 20px rgba(240, 147, 251, 0.5)',
    },
    danger: {
      bg: 'linear-gradient(45deg, #ff6b6b 0%, #ee5a24 100%)',
      color: 'white',
      shadow: '0 0 20px rgba(255, 107, 107, 0.5)',
    },
  };

  const sizeStyles = {
    sm: { px: 3, py: 2, fontSize: 'sm' },
    md: { px: 6, py: 3, fontSize: 'md' },
    lg: { px: 8, py: 4, fontSize: 'lg' },
  };

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) onClick();
    
    // 创建粒子效果
    const rect = e.currentTarget.getBoundingClientRect();
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }));
    
    setParticles(prev => [...prev, ...newParticles]);
    
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1000);
  };

  return (
    <Box position="relative" display="inline-block">
      <Button
        onClick={handleClick}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        onMouseLeave={() => setIsPressed(false)}
        isLoading={isLoading}
        sx={{
          ...sizeStyles[size],
          background: variantStyles[variant].bg,
          color: variantStyles[variant].color,
          border: 'none',
          borderRadius: 'md',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.23, 1, 0.320, 1)',
          transform: isPressed ? 'scale(0.95)' : 'scale(1)',
          boxShadow: isPressed ? 'none' : variantStyles[variant].shadow,
          '&:hover': {
            animation: `${quantumWarp} 2s ease-in-out infinite`,
            boxShadow: variantStyles[variant].shadow,
          },
          '&:before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            transition: 'left 0.5s',
          },
          '&:hover:before': {
            left: '100%',
          },
        }}
      >
        {children}
      </Button>
      
      {/* 粒子效果 */}
      {particles.map((particle, index) => (
        <Box
          key={particle.id}
          position="absolute"
          width="4px"
          height="4px"
          bg={variantStyles[variant].color}
          borderRadius="50%"
          left={`${particle.x}px`}
          top={`${particle.y}px`}
          pointerEvents="none"
          sx={{
            animation: `${energyRipple} 1s ease-out forwards`,
            animationDelay: `${index * 0.1}s`,
          }}
        />
      ))}
    </Box>
  );
};

export default {
  FloatingElement,
  MagneticButton,
  RippleEffect,
  HologramCard,
  QuantumButton,
};