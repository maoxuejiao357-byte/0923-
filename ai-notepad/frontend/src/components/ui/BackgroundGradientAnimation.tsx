import React from 'react';
import { Box } from '@chakra-ui/react';
import '../../styles/gradient-animation.css';

interface BackgroundGradientAnimationProps {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  firstColor?: string;
  secondColor?: string;
  thirdColor?: string;
  fourthColor?: string;
  fifthColor?: string;
  pointerColor?: string;
  size?: string;
  blendingValue?: string;
  interactive?: boolean;
}

const BackgroundGradientAnimation: React.FC<BackgroundGradientAnimationProps> = ({
  children,
  className = '',
  containerClassName = '',
  colors = ['#ffaa40', '#9c40ff', '#ffaa40', '#9c40ff', '#ffaa40'],
  gradientBackgroundStart = 'rgb(108, 0, 162)',
  gradientBackgroundEnd = 'rgb(0, 17, 82)',
  firstColor = '#ffaa40',
  secondColor = '#9c40ff', 
  thirdColor = '#ffaa40',
  fourthColor = '#9c40ff',
  fifthColor = '#ffaa40',
  pointerColor = '#ebd0ff',
  size = '80%',
  blendingValue = 'hard-light',
  interactive = true
}) => {
  return (
    <Box
      className={`gradient-animation-container ${containerClassName}`}
      w="100%"
      h="100%"
    >
      <Box
        className={`gradient-animation-bg ${className}`}
        background={`linear-gradient(40deg, ${gradientBackgroundStart}, ${gradientBackgroundEnd})`}
      >
        {/* 动画渐变球 */}
        <Box
          className="gradient-orb gradient-orb-1"
          w={size}
          h={size}
          background={`radial-gradient(circle, ${firstColor} 0%, transparent 50%)`}
        />
        <Box
          className="gradient-orb gradient-orb-2"
          w={size}
          h={size}
          background={`radial-gradient(circle, ${secondColor} 0%, transparent 50%)`}
        />
        <Box
          className="gradient-orb gradient-orb-3"
          w={size}
          h={size}
          background={`radial-gradient(circle, ${thirdColor} 0%, transparent 50%)`}
        />
        <Box
          className="gradient-orb gradient-orb-4"
          w={size}
          h={size}
          background={`radial-gradient(circle, ${fourthColor} 0%, transparent 50%)`}
        />
        <Box
          className="gradient-orb gradient-orb-5"
          w={size}
          h={size}
          background={`radial-gradient(circle, ${fifthColor} 0%, transparent 50%)`}
        />
      </Box>
      
      {/* 内容层 */}
      <Box
        position="relative"
        zIndex={1}
        w="100%"
        h="100%"
      >
        {children}
      </Box>
      

    </Box>
  );
};

export { BackgroundGradientAnimation };
export default BackgroundGradientAnimation;