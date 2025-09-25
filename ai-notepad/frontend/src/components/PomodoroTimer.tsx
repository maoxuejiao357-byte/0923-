import React from 'react'
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Progress,
  Badge,
  Tooltip,
  useColorModeValue,
  IconButton,
  Divider,
  Circle
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { TriangleUpIcon, SmallCloseIcon, RepeatIcon } from '@chakra-ui/icons'
import { usePomodoro } from '../context/PomodoroContext'
import { useNavigation } from './Layout'

// 沙漏动画
const sandAnimation = keyframes`
  0% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-2px) rotate(180deg); }
  100% { transform: translateY(0) rotate(360deg); }
`

// 沙漏SVG组件
const HourglassIcon: React.FC<{ isRunning: boolean; progress: number; color: string }> = ({ isRunning, progress, color }) => {
  return (
    <Box
      as="svg"
      width="40px"
      height="40px"
      viewBox="0 0 24 24"
      fill="none"
      animation={isRunning ? `${sandAnimation} 2s ease-in-out infinite` : 'none'}
    >
      {/* 沙漏外框 */}
      <path
        d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h.01L18 16l-4-4 4-3.99-.01-.01H18V2H6z"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
      />
      {/* 上半部分沙子 */}
      <path
        d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h.01L18 16l-4-4 4-3.99-.01-.01H18V2H6z"
        fill={color}
        fillOpacity={0.3}
        clipPath={`polygon(0 0, 100% 0, 100% ${100 - progress}%, 0 ${100 - progress}%)`}
      />
      {/* 下半部分沙子 */}
      <path
        d="M6 16v6h12v-6l-4-4-4 4z"
        fill={color}
        fillOpacity={0.6}
        clipPath={`polygon(0 ${100 - progress}%, 100% ${100 - progress}%, 100% 100%, 0 100%)`}
      />
      {/* 中心流沙效果 */}
      {isRunning && (
        <circle
          cx="12"
          cy="12"
          r="1"
          fill={color}
          opacity="0.8"
        >
          <animate
            attributeName="cy"
            values="8;16;8"
            dur="1s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.8;0.3;0.8"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
      )}
    </Box>
  )
}

const PomodoroTimer: React.FC = () => {
  const {
    isRunning,
    currentTime,
    currentModule,
    sessionType,
    currentSession,
    pomodoroSettings,
    totalTimeToday,
    startTimer,
    pauseTimer,
    resetTimer,
    formatTime,
    getTodayTimeForModule
  } = usePomodoro()
  
  const { currentView } = useNavigation()
  
  const bg = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.9)')
  const borderColor = useColorModeValue('rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)')
  const textColor = useColorModeValue('gray.800', 'white')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const primaryColor = useColorModeValue('blue.500', 'blue.400')
  const successColor = useColorModeValue('green.500', 'green.400')
  const warningColor = useColorModeValue('orange.500', 'orange.400')
  
  // 计算进度百分比
  const getTotalDuration = () => {
    switch (sessionType) {
      case 'work':
        return pomodoroSettings.workDuration * 60
      case 'shortBreak':
        return pomodoroSettings.shortBreak * 60
      case 'longBreak':
        return pomodoroSettings.longBreak * 60
      default:
        return pomodoroSettings.workDuration * 60
    }
  }
  
  const progress = ((getTotalDuration() - currentTime) / getTotalDuration()) * 100
  
  // 获取会话类型的显示文本和颜色
  const getSessionInfo = () => {
    switch (sessionType) {
      case 'work':
        return { text: '工作时间', color: primaryColor }
      case 'shortBreak':
        return { text: '短休息', color: successColor }
      case 'longBreak':
        return { text: '长休息', color: warningColor }
      default:
        return { text: '工作时间', color: primaryColor }
    }
  }
  
  const sessionInfo = getSessionInfo()
  
  const handleStartPause = () => {
    if (isRunning) {
      pauseTimer()
    } else {
      startTimer(currentView)
    }
  }
  
  // 格式化时间显示（小时:分钟）
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }
  
  return (
    <Box
      bg={bg}
      backdropFilter="blur(10px)"
      borderRadius="xl"
      border="1px solid"
      borderColor={borderColor}
      p={4}
      boxShadow="lg"
      minW="280px"
    >
      <VStack spacing={4} align="stretch">
        {/* 会话信息 */}
        <HStack justify="space-between" align="center">
          <Badge
            colorScheme={sessionType === 'work' ? 'blue' : sessionType === 'shortBreak' ? 'green' : 'orange'}
            variant="subtle"
            px={3}
            py={1}
            borderRadius="full"
          >
            {sessionInfo.text}
          </Badge>
          <Text fontSize="sm" color={mutedColor}>
            第 {currentSession} 轮
          </Text>
        </HStack>
        
        {/* 计时器显示 */}
        <VStack spacing={3}>
          {/* 沙漏和时间显示 */}
          <HStack spacing={4} align="center">
            <HourglassIcon 
              isRunning={isRunning} 
              progress={progress} 
              color={sessionInfo.color} 
            />
            <VStack spacing={1}>
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color={sessionInfo.color}
                fontFamily="mono"
                lineHeight="1"
              >
                {formatTime(currentTime)}
              </Text>
              <Text
                fontSize="xs"
                color={mutedColor}
                fontWeight="medium"
              >
                剩余时间
              </Text>
            </VStack>
          </HStack>
          
          {/* 进度条 */}
          <Box w="100%">
            <Progress
              value={progress}
              colorScheme={sessionType === 'work' ? 'blue' : sessionType === 'shortBreak' ? 'green' : 'orange'}
              size="md"
              borderRadius="full"
              bg={useColorModeValue('gray.100', 'gray.700')}
            />
            <HStack justify="space-between" mt={1}>
              <Text fontSize="xs" color={mutedColor}>
                {Math.round(progress)}%
              </Text>
              <Text fontSize="xs" color={mutedColor}>
                {formatTime(getTotalDuration())}
              </Text>
            </HStack>
          </Box>
        </VStack>
        
        {/* 控制按钮 */}
        <HStack justify="center" spacing={2}>
          <Tooltip label={isRunning ? '暂停' : '开始'}>
            <IconButton
              aria-label={isRunning ? '暂停计时器' : '开始计时器'}
              icon={isRunning ? <SmallCloseIcon /> : <TriangleUpIcon />}
              onClick={handleStartPause}
              colorScheme={sessionType === 'work' ? 'blue' : sessionType === 'shortBreak' ? 'green' : 'orange'}
              size="lg"
              borderRadius="full"
            />
          </Tooltip>
          
          <Tooltip label="重置">
            <IconButton
              aria-label="重置计时器"
              icon={<RepeatIcon />}
              onClick={resetTimer}
              variant="outline"
              size="lg"
              borderRadius="full"
            />
          </Tooltip>
        </HStack>
        
        <Divider />
        
        {/* 今日时间统计 */}
        <VStack spacing={2} align="stretch">
          <Text fontSize="sm" fontWeight="semibold" color={textColor}>
            今日时间统计
          </Text>
          
          <VStack spacing={1} align="stretch">
            <HStack justify="space-between">
              <HStack>
                <Box w={2} h={2} bg="blue.400" borderRadius="full" />
                <Text fontSize="sm" color={mutedColor}>笔记</Text>
              </HStack>
              <Text fontSize="sm" fontWeight="medium" color={textColor}>
                {formatDuration(getTodayTimeForModule('notes'))}
              </Text>
            </HStack>
            
            <HStack justify="space-between">
              <HStack>
                <Box w={2} h={2} bg="green.400" borderRadius="full" />
                <Text fontSize="sm" color={mutedColor}>待办</Text>
              </HStack>
              <Text fontSize="sm" fontWeight="medium" color={textColor}>
                {formatDuration(getTodayTimeForModule('todo'))}
              </Text>
            </HStack>
            
            <HStack justify="space-between">
              <HStack>
                <Box w={2} h={2} bg="purple.400" borderRadius="full" />
                <Text fontSize="sm" color={mutedColor}>仪表板</Text>
              </HStack>
              <Text fontSize="sm" fontWeight="medium" color={textColor}>
                {formatDuration(getTodayTimeForModule('dashboard'))}
              </Text>
            </HStack>
            
            <Divider my={1} />
            
            <HStack justify="space-between">
              <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                总计
              </Text>
              <Text fontSize="sm" fontWeight="bold" color={primaryColor}>
                {formatDuration(
                  getTodayTimeForModule('notes') + 
                  getTodayTimeForModule('todo') + 
                  getTodayTimeForModule('dashboard')
                )}
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </VStack>
    </Box>
  )
}

export default PomodoroTimer