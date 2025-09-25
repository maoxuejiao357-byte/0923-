import React from 'react';
import { Box } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

// 霓虹发光动画
const neonGlow = keyframes`
  0%, 100% {
    text-shadow: 
      0 0 5px currentColor,
      0 0 10px currentColor,
      0 0 15px currentColor,
      0 0 20px #667eea,
      0 0 35px #667eea,
      0 0 40px #667eea;
    box-shadow:
      0 0 5px currentColor,
      0 0 10px currentColor,
      0 0 15px currentColor,
      0 0 20px #667eea,
      inset 0 0 15px rgba(102, 126, 234, 0.1);
  }
  50% {
    text-shadow: 
      0 0 2px currentColor,
      0 0 5px currentColor,
      0 0 8px currentColor,
      0 0 12px #667eea,
      0 0 18px #667eea,
      0 0 25px #667eea;
    box-shadow:
      0 0 2px currentColor,
      0 0 5px currentColor,
      0 0 8px currentColor,
      0 0 12px #667eea,
      inset 0 0 8px rgba(102, 126, 234, 0.05);
  }
`;

// 脉冲动画
const pulse = keyframes`
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
`;

// 扫描线动画
const scanLine = keyframes`
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh);
    opacity: 0;
  }
`;

// 数字雨效果
const digitalRain = keyframes`
  0% {
    transform: translateY(-100vh);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(100vh);
    opacity: 0;
  }
`;

interface NeonBorderProps {
  children: React.ReactNode;
  color?: string;
  glowIntensity?: 'low' | 'medium' | 'high';
}

export const NeonBorder: React.FC<NeonBorderProps> = ({ 
  children, 
  color = '#667eea',
  glowIntensity = 'medium'
}) => {
  const glowStyles = {
    low: {
      boxShadow: `0 0 5px ${color}, 0 0 10px ${color}, inset 0 0 5px rgba(102, 126, 234, 0.1)`,
      border: `1px solid ${color}`,
    },
    medium: {
      boxShadow: `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}, inset 0 0 10px rgba(102, 126, 234, 0.1)`,
      border: `2px solid ${color}`,
      animation: `${neonGlow} 2s ease-in-out infinite alternate`,
    },
    high: {
      boxShadow: `0 0 15px ${color}, 0 0 30px ${color}, 0 0 45px ${color}, 0 0 60px ${color}, inset 0 0 15px rgba(102, 126, 234, 0.2)`,
      border: `3px solid ${color}`,
      animation: `${neonGlow} 1.5s ease-in-out infinite alternate`,
    }
  };

  return (
    <Box
      position="relative"
      borderRadius="xl"
      overflow="hidden"
      sx={glowStyles[glowIntensity]}
      _hover={{
        transform: 'scale(1.02)',
        transition: 'all 0.3s ease',
      }}
    >
      {children}
    </Box>
  );
};

interface HologramEffectProps {
  children: React.ReactNode;
}

export const HologramEffect: React.FC<HologramEffectProps> = ({ children }) => {
  return (
    <Box
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(
          90deg,
          transparent 0%,
          rgba(102, 126, 234, 0.1) 25%,
          rgba(118, 75, 162, 0.1) 50%,
          rgba(102, 126, 234, 0.1) 75%,
          transparent 100%
        )`,
        animation: `${scanLine} 3s linear infinite`,
        pointerEvents: 'none',
        zIndex: 1,
      }}
      _after={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(102, 126, 234, 0.03) 2px,
          rgba(102, 126, 234, 0.03) 4px
        )`,
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      {children}
    </Box>
  );
};

interface PulseEffectProps {
  children: React.ReactNode;
  color?: string;
  duration?: string;
}

export const PulseEffect: React.FC<PulseEffectProps> = ({ 
  children, 
  color = '#667eea',
  duration = '2s'
}) => {
  return (
    <Box
      animation={`${pulse} ${duration} ease-in-out infinite`}
      sx={{
        filter: `drop-shadow(0 0 10px ${color})`,
      }}
    >
      {children}
    </Box>
  );
};

interface DigitalRainProps {
  intensity?: number;
  color?: string;
}

export const DigitalRain: React.FC<DigitalRainProps> = ({ 
  intensity = 20,
  color = '#00ff41'
}) => {
  const raindrops = Array.from({ length: intensity }, (_, i) => {
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const randomChar = chars[Math.floor(Math.random() * chars.length)];
    const delay = Math.random() * 5;
    const duration = 3 + Math.random() * 2;
    const left = Math.random() * 100;
    
    return {
      id: i,
      char: randomChar,
      delay,
      duration,
      left,
    };
  });

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100%"
      height="100%"
      pointerEvents="none"
      zIndex={-1}
      overflow="hidden"
    >
      {raindrops.map((drop) => (
        <Box
          key={drop.id}
          position="absolute"
          left={`${drop.left}%`}
          color={color}
          fontSize="14px"
          fontFamily="monospace"
          fontWeight="bold"
          sx={{
            textShadow: `0 0 10px ${color}`,
            animation: `${digitalRain} ${drop.duration}s linear infinite`,
            animationDelay: `${drop.delay}s`,
          }}
          opacity={0.7}
        >
          {drop.char}
        </Box>
      ))}
    </Box>
  );
};

interface GlitchTextProps {
  children: React.ReactNode;
  intensity?: 'low' | 'medium' | 'high';
}

const glitchLow = keyframes`
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-1px, 1px); }
  40% { transform: translate(-1px, -1px); }
  60% { transform: translate(1px, 1px); }
  80% { transform: translate(1px, -1px); }
`;

const glitchMedium = keyframes`
  0%, 100% { transform: translate(0); }
  10% { transform: translate(-2px, 2px); }
  20% { transform: translate(-2px, -2px); }
  30% { transform: translate(2px, 2px); }
  40% { transform: translate(2px, -2px); }
  50% { transform: translate(-2px, 2px); }
  60% { transform: translate(-2px, -2px); }
  70% { transform: translate(2px, 2px); }
  80% { transform: translate(-2px, -2px); }
  90% { transform: translate(2px, 2px); }
`;

const glitchHigh = keyframes`
  0%, 100% { transform: translate(0); }
  5% { transform: translate(-3px, 3px); }
  10% { transform: translate(-3px, -3px); }
  15% { transform: translate(3px, 3px); }
  20% { transform: translate(3px, -3px); }
  25% { transform: translate(-3px, 3px); }
  30% { transform: translate(-3px, -3px); }
  35% { transform: translate(3px, 3px); }
  40% { transform: translate(-3px, -3px); }
  45% { transform: translate(3px, 3px); }
  50% { transform: translate(-3px, 3px); }
  55% { transform: translate(-3px, -3px); }
  60% { transform: translate(3px, 3px); }
  65% { transform: translate(3px, -3px); }
  70% { transform: translate(-3px, 3px); }
  75% { transform: translate(-3px, -3px); }
  80% { transform: translate(3px, 3px); }
  85% { transform: translate(-3px, -3px); }
  90% { transform: translate(3px, 3px); }
  95% { transform: translate(-3px, 3px); }
`;

export const GlitchText: React.FC<GlitchTextProps> = ({ 
  children, 
  intensity = 'medium' 
}) => {
  const animations = {
    low: glitchLow,
    medium: glitchMedium,
    high: glitchHigh,
  };

  const durations = {
    low: '0.5s',
    medium: '0.3s',
    high: '0.1s',
  };

  return (
    <Box
      position="relative"
      display="inline-block"
      animation={`${animations[intensity]} ${durations[intensity]} infinite`}
      _hover={{
        animation: `${animations.high} 0.1s infinite`,
      }}
    >
      {children}
    </Box>
  );
};

export default {
  NeonBorder,
  HologramEffect,
  PulseEffect,
  DigitalRain,
  GlitchText,
};