import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  useColorModeValue,
  Avatar,
  Flex,
  IconButton,
  Textarea,
  Spinner,
  useToast
} from '@chakra-ui/react'
import { ArrowForwardIcon, RepeatIcon } from '@chakra-ui/icons'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '你好！我是你的AI助手，有什么可以帮助你的吗？',
      role: 'assistant',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const toast = useToast()

  // 颜色主题
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const userBubbleBg = useColorModeValue('blue.500', 'blue.400')
  const assistantBubbleBg = useColorModeValue('gray.100', 'gray.700')
  const inputBg = useColorModeValue('gray.50', 'gray.700')
  const textColor = useColorModeValue('gray.800', 'white')

  // 自动滚动到底部
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 模拟AI回复（实际项目中应该调用真实的AI API）
  const simulateAIResponse = async (userMessage: string): Promise<string> => {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
    
    // 简单的回复逻辑
    const responses = [
      `关于"${userMessage}"，这是一个很有趣的问题。让我来为你详细解答...`,
      `我理解你想了解"${userMessage}"的相关信息。根据我的知识库...`,
      `这是一个关于"${userMessage}"的好问题！我建议你可以从以下几个方面考虑...`,
      `针对"${userMessage}"这个话题，我可以为你提供一些见解和建议...`
    ]
    
    return responses[Math.floor(Math.random() * responses.length)]
  }

  // 发送消息
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const aiResponse = await simulateAIResponse(userMessage.content)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      toast({
        title: '发送失败',
        description: '消息发送失败，请重试',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 清空对话
  const handleClearChat = () => {
    setMessages([
      {
        id: '1',
        content: '你好！我是你的AI助手，有什么可以帮助你的吗？',
        role: 'assistant',
        timestamp: new Date()
      }
    ])
  }

  // 处理键盘事件
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Box
      h="100%"
      bg={bgColor}
      borderRadius="xl"
      border="1px"
      borderColor={borderColor}
      overflow="hidden"
      display="flex"
      flexDirection="column"
    >
      {/* 头部 */}
      <Flex
        p={4}
        borderBottom="1px"
        borderColor={borderColor}
        align="center"
        justify="space-between"
      >
        <HStack>
          <Avatar size="sm" name="AI Assistant" bg="blue.500" />
          <VStack align="start" spacing={0}>
            <Text fontWeight="semibold" fontSize="sm">
              AI助手
            </Text>
            <Text fontSize="xs" color="gray.500">
              {isLoading ? '正在输入...' : '在线'}
            </Text>
          </VStack>
        </HStack>
        
        <IconButton
          aria-label="清空对话"
          icon={<RepeatIcon />}
          size="sm"
          variant="ghost"
          onClick={handleClearChat}
        />
      </Flex>

      {/* 消息区域 */}
      <Box flex={1} overflow="hidden">
        <Box h="100%" p={4} overflowY="auto">
          <VStack spacing={4} align="stretch">
            {messages.map((message) => (
              <Flex
                key={message.id}
                justify={message.role === 'user' ? 'flex-end' : 'flex-start'}
              >
                <Box
                  maxW="70%"
                  bg={message.role === 'user' ? userBubbleBg : assistantBubbleBg}
                  color={message.role === 'user' ? 'white' : textColor}
                  px={4}
                  py={3}
                  borderRadius="lg"
                  borderBottomRightRadius={message.role === 'user' ? 'sm' : 'lg'}
                  borderBottomLeftRadius={message.role === 'assistant' ? 'sm' : 'lg'}
                >
                  <Text fontSize="sm" whiteSpace="pre-wrap">
                    {message.content}
                  </Text>
                  <Text
                    fontSize="xs"
                    opacity={0.7}
                    mt={1}
                    textAlign={message.role === 'user' ? 'right' : 'left'}
                  >
                    {message.timestamp.toLocaleTimeString('zh-CN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </Box>
              </Flex>
            ))}
            
            {/* 加载指示器 */}
            {isLoading && (
              <Flex justify="flex-start">
                <Box
                  bg={assistantBubbleBg}
                  px={4}
                  py={3}
                  borderRadius="lg"
                  borderBottomLeftRadius="sm"
                >
                  <HStack>
                    <Spinner size="sm" />
                    <Text fontSize="sm" color={textColor}>
                      AI正在思考...
                    </Text>
                  </HStack>
                </Box>
              </Flex>
            )}
            
            <div ref={messagesEndRef} />
          </VStack>
        </Box>
      </Box>

      {/* 输入区域 */}
      <Box
        p={4}
        borderTop="1px"
        borderColor={borderColor}
        bg={inputBg}
      >
        <HStack spacing={2}>
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入你的问题..."
            resize="none"
            minH="40px"
            maxH="120px"
            bg={bgColor}
            border="1px"
            borderColor={borderColor}
            _focus={{
              borderColor: 'blue.400',
              boxShadow: '0 0 0 1px var(--chakra-colors-blue-400)'
            }}
          />
          <IconButton
            aria-label="发送消息"
            icon={<ArrowForwardIcon />}
            colorScheme="blue"
            onClick={handleSendMessage}
            isLoading={isLoading}
            disabled={!inputValue.trim() || isLoading}
          />
        </HStack>
      </Box>
    </Box>
  )
}

export default AIChat