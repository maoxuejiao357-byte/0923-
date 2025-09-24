import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Badge,
  Wrap,
  WrapItem,
  useColorModeValue,
  useToast,
// 删除未使用的 Tooltip 导入
  Textarea,
  useBreakpointValue
} from '@chakra-ui/react'
import { useNotes } from '../context/NotesContext'
import { useSettings } from '../context/SettingsContext'
import { BackgroundGradientAnimation } from './ui/BackgroundGradientAnimation'
import ParticleEffect from './ParticleEffect'
import MouseTrailEffect from './MouseTrailEffect'
import { NeonBorder, HologramEffect, PulseEffect, DigitalRain, GlitchText } from './SciFiElements'
import { QuantumLoader, DataStream, NeuralNetwork, HologramScanner, QuantumText } from './LoadingAnimations'
import { FloatingElement, MagneticButton, RippleEffect, HologramCard, QuantumButton } from './InteractiveElements'
// 删除未使用的导入，因为Note类型已在NotesContext中被引用

const NoteEditor: React.FC = () => {
  const { notes, selectedNoteId, updateNote, selectNote } = useNotes()
  const { settings } = useSettings()
  const toast = useToast()
  
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
// 删除未使用的isEditing状态，因为它的值从未被读取
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isMouseTrailActive, setIsMouseTrailActive] = useState(false)
  const [showParticles, setShowParticles] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [showHologramScanner, setShowHologramScanner] = useState(false)
  const [neuralNetworkActive, setNeuralNetworkActive] = useState(false)
  
  const isMobile = useBreakpointValue({ base: true, md: false })
  const bg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)')
  const borderColor = useColorModeValue('rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)')
  const headerBg = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(45, 55, 72, 0.9)')
  const cardBg = useColorModeValue('rgba(248, 250, 252, 0.7)', 'rgba(45, 55, 72, 0.7)')
  
  // 获取当前选中的笔记
  const currentNote = notes.find(note => note.id === selectedNoteId)
  
  // 加载笔记数据
  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title)
      setContent(currentNote.content)
      setTags(currentNote.tags)
// 删除这行，因为isEditing状态变量已被移除且未使用
      setHasUnsavedChanges(false)
      setLastSaved(new Date(currentNote.updatedAt))
    } else {
      setTitle('')
      setContent('')
      setTags([])
      setHasUnsavedChanges(false)
      setLastSaved(null)
    }
  }, [currentNote])
  
  // 保存笔记
  const saveNote = useCallback(async () => {
    if (!currentNote || !hasUnsavedChanges) return
    
    try {
      setIsLoading(true)
      setShowHologramScanner(true)
      setNeuralNetworkActive(true)
      
      await updateNote(currentNote.id, {
        title: title.trim() || '无标题',
        content,
        tags
      })
      
      setHasUnsavedChanges(false)
      setLastSaved(new Date())
      
      toast({
        title: '保存成功',
        status: 'success',
        duration: 2000,
        isClosable: true
      })
    } catch (error) {
      toast({
        title: '保存失败',
        description: '请稍后重试',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    } finally {
      setIsLoading(false)
      setTimeout(() => {
        setShowHologramScanner(false)
        setNeuralNetworkActive(false)
      }, 1000)
    }
  }, [currentNote, title, content, tags, hasUnsavedChanges, updateNote, toast])
  
  // 自动保存
  useEffect(() => {
    if (!settings.autoSave || !hasUnsavedChanges) return
    
    const timer = setTimeout(() => {
      saveNote()
    }, settings.autoSaveInterval * 1000)
    
    return () => clearTimeout(timer)
  }, [hasUnsavedChanges, settings.autoSave, settings.autoSaveInterval, saveNote])
  
  // 处理标题变化
  const handleTitleChange = (value: string) => {
    setTitle(value)
    setHasUnsavedChanges(true)
    // 激活鼠标跟随动画
    if (!isMouseTrailActive) {
      setIsMouseTrailActive(true)
      setTimeout(() => setIsMouseTrailActive(false), 3000)
    }
  }
  
  // 处理内容变化
  const handleContentChange = (value: string) => {
    setContent(value)
    setHasUnsavedChanges(true)
    // 激活鼠标跟随动画
    if (!isMouseTrailActive) {
      setIsMouseTrailActive(true)
      setTimeout(() => setIsMouseTrailActive(false), 2000)
    }
  }
  
  // 添加标签
  const addTag = () => {
    const tag = newTag.trim()
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag])
      setNewTag('')
      setHasUnsavedChanges(true)
      // 激活鼠标跟随动画
      setIsMouseTrailActive(true)
      setTimeout(() => setIsMouseTrailActive(false), 1500)
    }
  }
  
  // 删除标签
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
    setHasUnsavedChanges(true)
  }
  
  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      addTag()
    }
  }
  
  // 字数统计
  const wordCount = content.replace(/<[^>]*>/g, '').length
  
  // 格式化最后保存时间
  const formatLastSaved = (date: Date) => {
    const now = new Date()
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffMinutes < 1) {
      return '刚刚保存'
    } else if (diffMinutes < 60) {
      return `${diffMinutes}分钟前保存`
    } else {
      return date.toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit'
      }) + ' 保存'
    }
  }
  
  if (!currentNote) {
    return (
      <Box
        h="100%"
        bg={bg}
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={8}
        borderRadius="xl"
        backdropFilter="blur(10px)"
        border="1px solid"
        borderColor={borderColor}
      >
        <VStack spacing={4}>
          <Text fontSize="6xl">✍️</Text>
          <Text
            fontSize="lg"
            color={useColorModeValue('gray.600', 'gray.400')}
            textAlign="center"
          >
            选择一个笔记开始编辑
            <br />
            或创建新笔记
          </Text>
        </VStack>
      </Box>
    )
  }
  
  return (
    <>
    <HStack 
      h="100%" 
      spacing={0}
      align="stretch"
    >
      {/* 左侧笔记编辑器 */}
      <Box 
        flex={3}
        h="100%" 
        position="relative"
        display="flex" 
        flexDirection="column"
        borderRadius="xl"
        overflow="hidden"
        mr={2}
      >
        {/* 背景渐变动画 */}
        <BackgroundGradientAnimation
          gradientBackgroundStart="rgb(108, 0, 162)"
          gradientBackgroundEnd="rgb(0, 17, 82)"
          firstColor="18, 113, 255"
          secondColor="221, 74, 255"
          thirdColor="100, 220, 255"
          fourthColor="200, 50, 50"
          fifthColor="180, 180, 50"
        />
        
        {/* 全息扫描器 */}
        {showHologramScanner && (
          <Box position="absolute" top={4} right={4} zIndex={10}>
            <HologramScanner width={150} height={80} speed="2s" />
          </Box>
        )}
        
        {/* 神经网络动画 */}
        {neuralNetworkActive && (
          <Box position="absolute" bottom={4} left={4} zIndex={10}>
            <NeuralNetwork size={80} nodeCount={8} />
          </Box>
        )}
        
        {/* 数据流动画 */}
        <Box position="absolute" top={0} left={0} width="100%" zIndex={5}>
          <DataStream width={300} height={2} speed="3s" />
        </Box>
        <Box position="absolute" bottom={0} right={0} width="100%" zIndex={5}>
          <DataStream width={250} height={2} speed="4s" color="#f093fb" />
        </Box>
        
        {/* 笔记编辑内容 */}
         <Box 
           position="relative" 
           zIndex={1} 
           bg="rgba(255, 255, 255, 0.1)"
           backdropFilter="blur(20px)"
           border="1px solid rgba(255, 255, 255, 0.2)"
           borderRadius="3xl"
           h="100%"
           display="flex"
           flexDirection="column"
           boxShadow="0 8px 32px rgba(0, 0, 0, 0.1)"
           _dark={{
             bg: "rgba(26, 32, 44, 0.3)",
             border: "1px solid rgba(255, 255, 255, 0.1)"
           }}
         >
      {/* 移动端返回按钮 */}
      {isMobile && (
        <HStack
          p={4}
          borderBottom="1px solid"
          borderBottomColor={borderColor}
          bg={headerBg}
          backdropFilter="blur(10px)"
        >
          <Button
            size="sm"
            variant="ghost"
            onClick={() => selectNote(null)}
          >
            ← 返回
          </Button>
        </HStack>
      )}
      
      {/* 编辑器头部 */}
      <VStack 
        spacing={6} 
        p={8} 
        borderBottom="1px solid rgba(255, 255, 255, 0.1)" 
        bg="rgba(255, 255, 255, 0.05)"
        backdropFilter="blur(20px)"
        borderTopRadius="3xl"
      >
        {/* 标题输入 */}
        <NeonBorder color="#667eea" glowIntensity="low">
          <GlitchText intensity="low">
            <Input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="✨ 输入笔记标题..."
              fontSize="2xl"
              fontWeight="700"
              letterSpacing="-0.02em"
              border="none"
              _focus={{ boxShadow: 'none' }}
              bg="transparent"
              _placeholder={{ 
                color: "rgba(255, 255, 255, 0.4)",
                fontWeight: "500"
              }}
              color="rgba(0, 0, 0, 0.9)"
              _dark={{ color: "rgba(255, 255, 255, 0.95)" }}
            />
          </GlitchText>
        </NeonBorder>
        
        {/* 标签管理 */}
        <VStack spacing={4} align="stretch" w="100%">
          <HStack>
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="🏷️ 添加标签..."
              size="md"
              maxW="240px"
              borderRadius="xl"
              bg="rgba(255, 255, 255, 0.1)"
              backdropFilter="blur(10px)"
              border="1px solid rgba(255, 255, 255, 0.2)"
              _placeholder={{ color: "rgba(255, 255, 255, 0.5)" }}
              _focus={{
                borderColor: "rgba(102, 126, 234, 0.6)",
                boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)"
              }}
              _dark={{
                bg: "rgba(26, 32, 44, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.1)"
              }}
            />
            <QuantumButton 
              size="md" 
              onClick={addTag} 
              variant="primary"
              isLoading={!newTag.trim()}
            >
              添加
            </QuantumButton>
          </HStack>
          
          {tags.length > 0 && (
            <Wrap spacing={2}>
              {tags.map((tag, index) => (
                <WrapItem key={index}>
                  <Badge
                    bg="rgba(102, 126, 234, 0.1)"
                    color="rgba(102, 126, 234, 0.9)"
                    backdropFilter="blur(10px)"
                    border="1px solid rgba(102, 126, 234, 0.2)"
                    borderRadius="xl"
                    px={3}
                    py={1}
                    fontSize="xs"
                    fontWeight="600"
                    cursor="pointer"
                    onClick={() => removeTag(tag)}
                    _hover={{ 
                      bg: "rgba(239, 68, 68, 0.1)",
                      color: "rgba(239, 68, 68, 0.9)",
                      borderColor: "rgba(239, 68, 68, 0.3)",
                      transform: "scale(0.95)"
                    }}
                    _dark={{
                      bg: "rgba(102, 126, 234, 0.2)",
                      color: "rgba(167, 182, 255, 0.9)",
                      border: "1px solid rgba(102, 126, 234, 0.3)"
                    }}
                    transition="all 0.2s"
                  >
                    {tag} ×
                  </Badge>
                </WrapItem>
              ))}
            </Wrap>
          )}
        </VStack>
        
        {/* 操作栏 */}
        <HStack justify="space-between" w="100%">
          <HStack spacing={3}>
            {hasUnsavedChanges ? (
              <FloatingElement intensity={8} speed="2s">
                <RippleEffect color="#10b981">
                  <QuantumButton
                    size="md"
                    onClick={saveNote}
                    variant="secondary"
                    isLoading={isLoading}
                  >
                    💾 保存
                  </QuantumButton>
                </RippleEffect>
              </FloatingElement>
            ) : (
              <FloatingElement intensity={5} speed="3s">
                <QuantumText colors={['#10b981', '#059669']}>
                  ✅ 已保存
                </QuantumText>
              </FloatingElement>
            )}
            
            {settings.enableAI && (
              <>
                <Button 
                  size="md" 
                  borderRadius="xl"
                  bg="rgba(255, 255, 255, 0.1)"
                  backdropFilter="blur(10px)"
                  border="1px solid rgba(255, 255, 255, 0.2)"
                  color="rgba(0, 0, 0, 0.8)"
                  fontWeight="600"
                  px={6}
                  _hover={{
                    bg: "rgba(255, 255, 255, 0.2)",
                    transform: "translateY(-1px)"
                  }}
                  _dark={{
                    bg: "rgba(26, 32, 44, 0.4)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    color: "rgba(255, 255, 255, 0.8)"
                  }}
                  transition="all 0.2s"
                >
                  ✨ AI润色
                </Button>
                <Button size="sm" variant="outline">
                  AI改写
                </Button>
                <Button size="sm" variant="outline">
                  生成标签
                </Button>
              </>
            )}
          </HStack>
          
          <HStack spacing={4} fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
            {settings.showWordCount && (
              <Text>{wordCount} 字</Text>
            )}
            {lastSaved && (
              <Text>{formatLastSaved(lastSaved)}</Text>
            )}
          </HStack>
        </HStack>
      </VStack>
      
      {/* 内容编辑区 */}
      <Box 
        flex={1} 
        p={6}
        bg={cardBg}
        backdropFilter="blur(5px)"
      >
        <Textarea
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          placeholder="开始写作..."
          border="none"
          resize="none"
          h="100%"
          fontSize={settings.fontSize === 'small' ? 'sm' : settings.fontSize === 'large' ? 'lg' : 'md'}
          lineHeight="1.6"
          _focus={{ boxShadow: 'none' }}
          bg="transparent"
        />
      </Box>
        </Box>
    </Box>
    
    {/* 右侧聊天界面 */}
    <HologramCard 
      width="100%"
      height="100%"
      glitchIntensity={0.05}
    >
      <Box 
        flex={1}
        h="100%" 
        display="flex"
        flexDirection="column"
        overflow="hidden"
      >
      {/* 聊天头部 */}
      <HologramEffect>
        <Box
          p={6}
          borderBottom="1px solid rgba(255, 255, 255, 0.1)"
          bg="rgba(255, 255, 255, 0.05)"
          backdropFilter="blur(20px)"
          borderTopRadius="3xl"
        >
          <HStack spacing={3}>
            <PulseEffect color="#667eea" duration="1.5s">
              <NeonBorder color="#667eea" glowIntensity="medium">
                <Box
                  w={10}
                  h={10}
                  borderRadius="full"
                  bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  boxShadow="0 4px 12px rgba(102, 126, 234, 0.4)"
                >
                  <GlitchText intensity="low">
                    <Text fontSize="lg" color="white" fontWeight="bold">AI</Text>
                  </GlitchText>
                </Box>
              </NeonBorder>
            </PulseEffect>
            <VStack align="start" spacing={0}>
              <GlitchText intensity="low">
                <Text fontSize="lg" fontWeight="700" letterSpacing="-0.02em">AI 助手</Text>
              </GlitchText>
              <Text fontSize="sm" color="rgba(255, 255, 255, 0.6)" _dark={{ color: "rgba(255, 255, 255, 0.5)" }}>随时为您提供智能帮助</Text>
            </VStack>
          </HStack>
        </Box>
      </HologramEffect>
      
      {/* 聊天消息区域 */}
      <VStack 
        flex={1}
        p={4}
        spacing={3}
        align="stretch"
        overflowY="auto"
      >
        {/* 欢迎消息 */}
        <HStack align="start" spacing={3}>
          <Box
            w={8}
            h={8}
            borderRadius="full"
            bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
            mt={1}
          >
            <Text fontSize="xs" color="white" fontWeight="bold">AI</Text>
          </Box>
          <Box
            bg="rgba(255, 255, 255, 0.1)"
            backdropFilter="blur(10px)"
            p={4}
            borderRadius="2xl"
            maxW="85%"
            border="1px solid rgba(255, 255, 255, 0.1)"
            boxShadow="0 4px 16px rgba(0, 0, 0, 0.1)"
            _dark={{
              bg: "rgba(26, 32, 44, 0.4)",
              border: "1px solid rgba(255, 255, 255, 0.05)"
            }}
          >
            <Text fontSize="sm" lineHeight="1.6" color="rgba(0, 0, 0, 0.8)" _dark={{ color: "rgba(255, 255, 255, 0.9)" }}>
              您好！我是您的AI助手 ✨ 可以帮助您整理笔记、回答问题或提供写作建议。有什么我可以帮助您的吗？
            </Text>
          </Box>
        </HStack>
      </VStack>
      
      {/* 聊天输入区域 */}
      <Box 
        p={6}
        borderTop="1px solid rgba(255, 255, 255, 0.1)"
        bg="rgba(255, 255, 255, 0.05)"
        backdropFilter="blur(20px)"
        borderBottomRadius="3xl"
      >
        <HStack spacing={3}>
          <Input
            placeholder="输入消息..."
            size="md"
            borderRadius="2xl"
            bg="rgba(255, 255, 255, 0.1)"
            backdropFilter="blur(10px)"
            border="1px solid rgba(255, 255, 255, 0.2)"
            _placeholder={{ color: "rgba(255, 255, 255, 0.5)" }}
            _focus={{
              borderColor: "rgba(102, 126, 234, 0.6)",
              boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)"
            }}
            _dark={{
              bg: "rgba(26, 32, 44, 0.4)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              _placeholder: { color: "rgba(255, 255, 255, 0.4)" }
            }}
          />
          <MagneticButton
            size="md"
            colorScheme="blue"
            magneticStrength={15}
            onClick={() => {
              // 激活鼠标跟随动画
              setIsMouseTrailActive(true)
              setTimeout(() => setIsMouseTrailActive(false), 2000)
            }}
          >
            发送
          </MagneticButton>
        </HStack>
      </Box>
        </Box>
      </HologramCard>
    </HStack>
    
    {/* 炫酷效果组件 */}
    {showParticles && <ParticleEffect particleCount={30} />}
    <MouseTrailEffect 
      isActive={isMouseTrailActive} 
      trailLength={25}
      colors={['#667eea', '#764ba2', '#f093fb', '#f5576c']}
    />
    <DigitalRain intensity={15} color="#00ff41" />
    </>
  )
}

export default NoteEditor