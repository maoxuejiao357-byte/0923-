import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';

// 量子加载动画
const quantumSpin = keyframes`
  0% {
    transform: rotate(0deg) scale(1);
    opacity: 1;
  }
  25% {
    transform: rotate(90deg) scale(1.2);
    opacity: 0.8;
  }
  50% {
    transform: rotate(180deg) scale(0.8);
    opacity: 0.6;
  }
  75% {
    transform: rotate(270deg) scale(1.1);
    opacity: 0.9;
  }
  100% {
    transform: rotate(360deg) scale(1);
    opacity: 1;
  }
`;

// 数据流动画
const dataFlow = keyframes`
  0% {
    transform: translateX(-100%) scaleX(0);
    opacity: 0;
  }
  50% {
    transform: translateX(0%) scaleX(1);
    opacity: 1;
  }
  100% {
    transform: translateX(100%) scaleX(0);
    opacity: 0;
  }
`;

// 神经网络脉冲
const neuralPulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.5);
    opacity: 1;
  }
`;

// 全息扫描
const hologramScan = keyframes`
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(100%);
    opacity: 0;
  }
`;

// 量子点动画
const quantumDots = keyframes`
  0%, 20% {
    color: #667eea;
    transform: scale(1);
  }
  40% {
    color: #764ba2;
    transform: scale(1.2);
  }
  60% {
    color: #f093fb;
    transform: scale(0.8);
  }
  80% {
    color: #f5576c;
    transform: scale(1.1);
  }
  100% {
    color: #667eea;
    transform: scale(1);
  }
`;

interface QuantumLoaderProps {
  size?: number;
  color?: string;
}

export const QuantumLoader: React.FC<QuantumLoaderProps> = ({ 
  size = 40, 
  color = '#667eea' 
}) => {
  return (
    <Box
      position="relative"
      width={`${size}px`}
      height={`${size}px`}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {/* 外圈 */}
      <Box
        position="absolute"
        width="100%"
        height="100%"
        border={`2px solid ${color}`}
        borderRadius="50%"
        borderTop="2px solid transparent"
        animation={`${quantumSpin} 1s linear infinite`}
      />
      
      {/* 中圈 */}
      <Box
        position="absolute"
        width="70%"
        height="70%"
        border={`2px solid ${color}`}
        borderRadius="50%"
        borderRight="2px solid transparent"
        animation={`${quantumSpin} 1.5s linear infinite reverse`}
        opacity={0.7}
      />
      
      {/* 内圈 */}
      <Box
        position="absolute"
        width="40%"
        height="40%"
        border={`2px solid ${color}`}
        borderRadius="50%"
        borderBottom="2px solid transparent"
        animation={`${quantumSpin} 0.8s linear infinite`}
        opacity={0.5}
      />
      
      {/* 中心点 */}
      <Box
        width="6px"
        height="6px"
        bg={color}
        borderRadius="50%"
        animation={`${neuralPulse} 1.2s ease-in-out infinite`}
      />
    </Box>
  );
};

interface DataStreamProps {
  width?: number;
  height?: number;
  color?: string;
  speed?: string;
}

export const DataStream: React.FC<DataStreamProps> = ({ 
  width = 200, 
  height = 4, 
  color = '#00ff41',
  speed = '2s'
}) => {
  return (
    <Box
      position="relative"
      width={`${width}px`}
      height={`${height}px`}
      bg="rgba(0, 255, 65, 0.1)"
      borderRadius="full"
      overflow="hidden"
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        bg={`linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`}
        animation={`${dataFlow} ${speed} ease-in-out infinite`}
        borderRadius="full"
      />
    </Box>
  );
};

interface NeuralNetworkProps {
  size?: number;
  nodeCount?: number;
  color?: string;
}

export const NeuralNetwork: React.FC<NeuralNetworkProps> = ({ 
  size = 100, 
  nodeCount = 6,
  color = '#667eea'
}) => {
  const nodes = Array.from({ length: nodeCount }, (_, i) => {
    const angle = (i * 360) / nodeCount;
    const radius = size * 0.35;
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;
    
    return { x, y, delay: i * 0.2 };
  });

  return (
    <Box
      position="relative"
      width={`${size}px`}
      height={`${size}px`}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {/* 连接线 */}
      {nodes.map((node, i) => 
        nodes.slice(i + 1).map((otherNode, j) => {
          const length = Math.sqrt(
            Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
          );
          const angle = Math.atan2(otherNode.y - node.y, otherNode.x - node.x) * 180 / Math.PI;
          
          return (
            <Box
              key={`${i}-${j}`}
              position="absolute"
              width={`${length}px`}
              height="1px"
              bg={color}
              opacity={0.3}
              transformOrigin="left center"
              transform={`translate(${node.x}px, ${node.y}px) rotate(${angle}deg)`}
              left="50%"
              top="50%"
            />
          );
        })
      )}
      
      {/* 节点 */}
      {nodes.map((node, i) => (
        <Box
          key={i}
          position="absolute"
          width="8px"
          height="8px"
          bg={color}
          borderRadius="50%"
          left="50%"
          top="50%"
          transform={`translate(${node.x - 4}px, ${node.y - 4}px)`}
          animation={`${neuralPulse} 2s ease-in-out infinite`}
          sx={{
            animationDelay: `${node.delay}s`,
          }}
        />
      ))}
      
      {/* 中心节点 */}
      <Box
        width="12px"
        height="12px"
        bg={color}
        borderRadius="50%"
        animation={`${neuralPulse} 1s ease-in-out infinite`}
      />
    </Box>
  );
};

interface HologramScannerProps {
  width?: number;
  height?: number;
  color?: string;
  speed?: string;
}

export const HologramScanner: React.FC<HologramScannerProps> = ({ 
  width = 200, 
  height = 100, 
  color = '#00ffff',
  speed = '3s'
}) => {
  return (
    <Box
      position="relative"
      width={`${width}px`}
      height={`${height}px`}
      border={`1px solid ${color}`}
      borderRadius="md"
      overflow="hidden"
      bg="rgba(0, 255, 255, 0.05)"
    >
      {/* 扫描线 */}
      <Box
        position="absolute"
        width="100%"
        height="2px"
        bg={`linear-gradient(90deg, transparent 0%, ${color} 50%, transparent 100%)`}
        animation={`${hologramScan} ${speed} ease-in-out infinite`}
        boxShadow={`0 0 10px ${color}`}
      />
      
      {/* 网格线 */}
      <Box
        position="absolute"
        width="100%"
        height="100%"
        opacity={0.3}
        sx={{
          backgroundImage: `
            linear-gradient(${color} 1px, transparent 1px),
            linear-gradient(90deg, ${color} 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      />
    </Box>
  );
};

interface QuantumTextProps {
  children: React.ReactNode;
  colors?: string[];
  speed?: string;
}

export const QuantumText: React.FC<QuantumTextProps> = ({ 
  children, 
  colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c'],
  speed = '3s'
}) => {
  return (
    <Text
      display="inline-block"
      animation={`${quantumDots} ${speed} ease-in-out infinite`}
      sx={{
        textShadow: '0 0 10px currentColor',
        fontWeight: 'bold',
      }}
    >
      {children}
    </Text>
  );
};

export default {
  QuantumLoader,
  DataStream,
  NeuralNetwork,
  HologramScanner,
  QuantumText,
};