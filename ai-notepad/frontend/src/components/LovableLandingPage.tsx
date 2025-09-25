import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
  Flex,
  Container,
  SimpleGrid,
  Card,
  CardBody,
  Badge,
  Avatar,
  useColorModeValue
} from '@chakra-ui/react';
import { SearchIcon, AttachmentIcon, ViewIcon } from '@chakra-ui/icons';

interface LovableLandingPageProps {
  onNavigate?: (view: 'notes' | 'todo' | 'dashboard' | 'ai-chat') => void
}

const LovableLandingPage: React.FC<LovableLandingPageProps> = ({ onNavigate }) => {
  const [inputValue, setInputValue] = useState('');
  
  const gradientBg = 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)';
  const cardBg = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.9)');
  const textColor = useColorModeValue('gray.800', 'white');
  const subtitleColor = useColorModeValue('gray.600', 'gray.300');

  const featureCards = [
    {
      title: 'AI智能笔记',
      description: '使用AI助手帮助整理和优化您的笔记内容',
      icon: '🤖',
      color: 'blue',
      action: () => onNavigate?.('notes')
    },
    {
      title: 'AI助手对话',
      description: '与AI助手交流，获得写作灵感和建议',
      icon: '💬',
      color: 'green',
      action: () => onNavigate?.('ai-chat')
    },
    {
      title: '番茄钟专注',
      description: '番茄工作法，提高专注力和效率',
      icon: '🍅',
      color: 'purple',
      action: () => onNavigate?.('dashboard')
    },
    {
      title: '待办事项',
      description: '任务管理，进度跟踪，提醒功能',
      icon: '📋',
      color: 'orange',
      action: () => onNavigate?.('todo')
    }
  ];

  return (
    <Box
      minH="100vh"
      background={gradientBg}
      position="relative"
      overflow="hidden"
    >
      {/* 顶部导航栏 */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={1000}
        backdropFilter="blur(20px)"
        bg="rgba(255, 255, 255, 0.1)"
        borderBottom="1px solid rgba(255, 255, 255, 0.2)"
      >
        <Container maxW="7xl">
          <Flex h={16} alignItems="center" justifyContent="space-between">
            <HStack spacing={3}>
              <Box
                w={8}
                h={8}
                borderRadius="lg"
                bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="lg" fontWeight="bold" color="white">
                  📝
                </Text>
              </Box>
              <Text fontSize="xl" fontWeight="bold" color="white">
                AI Notepad
              </Text>
            </HStack>
            
            <HStack spacing={4}>
              <Button
                variant="ghost"
                color="white"
                _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
              >
                登录
              </Button>
              <Button
                bg="rgba(255, 255, 255, 0.2)"
                color="white"
                _hover={{ bg: 'rgba(255, 255, 255, 0.3)' }}
                backdropFilter="blur(10px)"
                border="1px solid rgba(255, 255, 255, 0.3)"
              >
                注册
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* 主要内容区域 */}
      <Container maxW="6xl" pt={32} pb={20}>
        <VStack spacing={12} align="center">
          {/* Hero 区域 */}
          <VStack spacing={6} textAlign="center" maxW="4xl">
            <Text
              fontSize={{ base: '4xl', md: '6xl' }}
              fontWeight="bold"
              color="white"
              lineHeight="1.2"
            >
              Alice 的{' '}
              <Box as="span" position="relative">
                <Text
                  as="span"
                  bgGradient="linear(to-r, #f093fb, #f5576c)"
                  bgClip="text"
                  fontWeight="bold"
                >
                  AI助手
                </Text>
              </Box>
            </Text>
            
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              color="rgba(255, 255, 255, 0.8)"
              maxW="2xl"
            >
              使用AI助手快速创建、整理和管理您的笔记，让思维更加清晰高效
            </Text>

            {/* 输入框区域 */}
            <Box w="full" maxW="2xl">
              <InputGroup size="lg">
                <Input
                  placeholder="告诉AI助手您想要创建什么样的笔记..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  bg="rgba(255, 255, 255, 0.9)"
                  border="none"
                  borderRadius="2xl"
                  fontSize="md"
                  h={14}
                  _placeholder={{ color: 'gray.500' }}
                  _focus={{
                    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.3)',
                    bg: 'white'
                  }}
                />
                <InputRightElement h={14} pr={2}>
                  <HStack spacing={2}>
                    <IconButton
                      aria-label="附件"
                      icon={<AttachmentIcon />}
                      size="sm"
                      variant="ghost"
                      color="gray.500"
                    />
                    <IconButton
                      aria-label="导入Figma"
                      icon={<ViewIcon />}
                      size="sm"
                      variant="ghost"
                      color="gray.500"
                    />
                    <Badge
                      colorScheme="blue"
                      variant="subtle"
                      borderRadius="full"
                      px={2}
                      py={1}
                      fontSize="xs"
                    >
                      公开
                    </Badge>
                    <IconButton
                      aria-label="搜索"
                      icon={<SearchIcon />}
                      size="sm"
                      bg="gray.100"
                      borderRadius="full"
                      _hover={{ bg: 'gray.200' }}
                    />
                  </HStack>
                </InputRightElement>
              </InputGroup>
            </Box>

            {/* 快捷功能按钮 */}
            <HStack spacing={4} flexWrap="wrap" justify="center">
              <Button
                leftIcon={<Text>📊</Text>}
                bg="rgba(255, 255, 255, 0.15)"
                color="white"
                border="1px solid rgba(255, 255, 255, 0.2)"
                borderRadius="full"
                _hover={{ bg: 'rgba(255, 255, 255, 0.25)' }}
                backdropFilter="blur(10px)"
                size="sm"
              >
                数据分析面板
              </Button>
              <Button
                leftIcon={<Text>✏️</Text>}
                bg="rgba(255, 255, 255, 0.15)"
                color="white"
                border="1px solid rgba(255, 255, 255, 0.2)"
                borderRadius="full"
                _hover={{ bg: 'rgba(255, 255, 255, 0.25)' }}
                backdropFilter="blur(10px)"
                size="sm"
              >
                Markdown编辑器
              </Button>
              <Button
                leftIcon={<Text>📱</Text>}
                bg="rgba(255, 255, 255, 0.15)"
                color="white"
                border="1px solid rgba(255, 255, 255, 0.2)"
                borderRadius="full"
                _hover={{ bg: 'rgba(255, 255, 255, 0.25)' }}
                backdropFilter="blur(10px)"
                size="sm"
              >
                移动应用
              </Button>
              <Button
                leftIcon={<Text>📄</Text>}
                bg="rgba(255, 255, 255, 0.15)"
                color="white"
                border="1px solid rgba(255, 255, 255, 0.2)"
                borderRadius="full"
                _hover={{ bg: 'rgba(255, 255, 255, 0.25)' }}
                backdropFilter="blur(10px)"
                size="sm"
              >
                PDF导出
              </Button>
            </HStack>
          </VStack>
        </VStack>
      </Container>

      {/* 社区展示区域 */}
      <Box
        bg="rgba(255, 255, 255, 0.1)"
        backdropFilter="blur(20px)"
        borderTop="1px solid rgba(255, 255, 255, 0.2)"
        py={16}
      >
        <Container maxW="7xl">
          <VStack spacing={8}>
            <HStack w="full" justify="space-between" align="center">
              <Text fontSize="2xl" fontWeight="bold" color="white">
                来自社区的精选
              </Text>
              <Button
                variant="ghost"
                color="white"
                _hover={{ bg: 'rgba(255, 255, 255, 0.1)' }}
              >
                查看全部
              </Button>
            </HStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} w="full">
              {featureCards.map((card, index) => (
                <Card
                  key={index}
                  bg={cardBg}
                  backdropFilter="blur(20px)"
                  border="1px solid rgba(255, 255, 255, 0.2)"
                  borderRadius="2xl"
                  overflow="hidden"
                  _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)'
                  }}
                  transition="all 0.3s ease"
                  cursor="pointer"
                  onClick={card.action}
                >
                  <CardBody p={6}>
                    <VStack align="start" spacing={4}>
                      <Box
                        w={12}
                        h={12}
                        borderRadius="xl"
                        bg={`${card.color}.100`}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        fontSize="2xl"
                      >
                        {card.icon}
                      </Box>
                      <VStack align="start" spacing={2}>
                        <Text
                          fontSize="lg"
                          fontWeight="bold"
                          color={textColor}
                        >
                          {card.title}
                        </Text>
                        <Text
                          fontSize="sm"
                          color={subtitleColor}
                          lineHeight="1.5"
                        >
                          {card.description}
                        </Text>
                      </VStack>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
};

export default LovableLandingPage;