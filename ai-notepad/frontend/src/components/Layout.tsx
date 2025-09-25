import React, { useState, createContext, useContext } from 'react'
import {
  Box,
  Flex,
  IconButton,
  useColorModeValue,
  useBreakpointValue,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  HStack,
  VStack,
  Button,
  Text,
  Divider
} from '@chakra-ui/react'
import { HamburgerIcon, TimeIcon, ViewIcon, EditIcon, CheckCircleIcon, SettingsIcon, ChatIcon } from '@chakra-ui/icons'
import Sidebar from './Sidebar'
import NotesList from './NotesList'
import NoteEditor from './NoteEditor'
import TodoList from './TodoList'
import Dashboard from './Dashboard'
import PomodoroTimer from './PomodoroTimer'
import AIChat from './AIChat'
import { usePomodoro } from '../context/PomodoroContext'
import { useNotes } from '../context/NotesContext'

// 创建导航上下文
interface NavigationContextType {
  currentView: 'notes' | 'todo' | 'dashboard' | 'ai-chat'
  setCurrentView: (view: 'notes' | 'todo' | 'dashboard' | 'ai-chat') => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export const useNavigation = () => {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider')
  }
  return context
}

const Layout: React.FC = () => {
  const { selectedNoteId } = useNotes()
  const { switchModule } = usePomodoro()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [currentView, setCurrentView] = useState<'notes' | 'todo' | 'dashboard' | 'ai-chat'>('notes')
  const bg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)')
  const borderColor = useColorModeValue('rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)')
  const listBg = useColorModeValue('rgba(248, 250, 252, 0.8)', 'rgba(45, 55, 72, 0.8)')
  const isMobile = useBreakpointValue({ base: true, md: false })
  const buttonBg = useColorModeValue('blue.500', 'blue.400')
  const buttonHoverBg = useColorModeValue('blue.600', 'blue.300')
  const buttonColor = useColorModeValue('white', 'white')
  const pomodoroButtonBg = useColorModeValue('green.500', 'green.400')
  const pomodoroButtonHoverBg = useColorModeValue('green.600', 'green.300')
  
  // 当视图切换时，同步更新番茄钟的当前模块
  React.useEffect(() => {
    if (currentView !== 'ai-chat') {
      switchModule(currentView)
    }
  }, [currentView, switchModule])

  if (isMobile) {
    // 移动端布局：单栏显示
    return (
      <NavigationContext.Provider value={{ currentView, setCurrentView }}>
        <Box minH="100vh" p={4}>
          {currentView === 'todo' ? (
            <Box h="calc(100vh - 2rem)" borderRadius="2xl" overflow="hidden" boxShadow="2xl">
              <TodoList />
            </Box>
          ) : currentView === 'dashboard' ? (
            <Box h="calc(100vh - 2rem)" borderRadius="2xl" overflow="hidden" boxShadow="2xl">
              <Dashboard />
            </Box>
          ) : currentView === 'ai-chat' ? (
            <Box h="calc(100vh - 2rem)" borderRadius="2xl" overflow="hidden" boxShadow="2xl">
              <AIChat />
            </Box>
          ) : !selectedNoteId ? (
            <Flex h="calc(100vh - 2rem)" borderRadius="2xl" overflow="hidden" boxShadow="2xl">
              <Sidebar />
              <NotesList />
            </Flex>
          ) : (
            <Box h="calc(100vh - 2rem)" borderRadius="2xl" overflow="hidden" boxShadow="2xl">
              <NoteEditor />
            </Box>
          )}
        </Box>
      </NavigationContext.Provider>
    )
  }

  // 桌面端布局：三栏布局
  return (
    <NavigationContext.Provider value={{ currentView, setCurrentView }}>
      <Box minH="100vh" p={6} position="relative">
        <Flex 
          h="calc(100vh - 3rem)" 
          borderRadius="3xl" 
          overflow="hidden" 
          boxShadow="2xl"
          backdropFilter="blur(20px)"
          border="1px solid"
          borderColor={borderColor}
        >
          {/* 左侧边栏 */}
          {!isSidebarCollapsed && (
            <Box
              w="240px"
              borderRight="1px"
              borderColor={borderColor}
              bg={bg}
              backdropFilter="blur(10px)"
              flexShrink={0}
              transition="all 0.3s ease"
            >
              <Sidebar />
            </Box>
          )}

          {currentView === 'todo' ? (
            /* TodoList 全屏显示 */
            <Box
              flex={1}
              bg={bg}
              backdropFilter="blur(10px)"
              overflow="hidden"
            >
              <TodoList />
            </Box>
          ) : currentView === 'dashboard' ? (
            /* Dashboard 全屏显示 */
            <Box
              flex={1}
              bg={bg}
              backdropFilter="blur(10px)"
              overflow="hidden"
            >
              <Dashboard />
            </Box>
          ) : currentView === 'ai-chat' ? (
            /* AI聊天 全屏显示 */
            <Box
              flex={1}
              bg={bg}
              backdropFilter="blur(10px)"
              overflow="hidden"
              p={4}
            >
              <AIChat />
            </Box>
          ) : (
            <>
              {/* 中间笔记列表 */}
              <Box
                w={isSidebarCollapsed ? "360px" : "320px"}
                borderRight="1px"
                borderColor={borderColor}
                bg={listBg}
                backdropFilter="blur(10px)"
                flexShrink={0}
                transition="all 0.3s ease"
              >
                <NotesList />
              </Box>

              {/* 右侧编辑器 */}
              <Box
                flex={1}
                bg={bg}
                backdropFilter="blur(10px)"
                overflow="hidden"
              >
                <NoteEditor />
              </Box>
            </>
          )}
        </Flex>
      
      {/* 右上角按钮组 */}
      <HStack
        position="absolute"
        top={8}
        right={8}
        spacing={2}
        zIndex={1000}
      >
        {/* 应用管理按钮 */}
        <Popover placement="bottom-end">
          <PopoverTrigger>
            <IconButton
              aria-label="应用管理"
              icon={<SettingsIcon />}
              size="md"
              bg={useColorModeValue('purple.500', 'purple.400')}
              color={buttonColor}
              borderRadius="xl"
              boxShadow="lg"
              _hover={{
                bg: useColorModeValue('purple.600', 'purple.300'),
                transform: "translateY(-1px)",
                boxShadow: "xl"
              }}
              _active={{
                transform: "translateY(0px)"
              }}
              transition="all 0.2s ease"
            />
          </PopoverTrigger>
          <PopoverContent
            border="none"
            boxShadow="2xl"
            bg={useColorModeValue('rgba(255, 255, 255, 0.95)', 'rgba(26, 32, 44, 0.95)')}
            backdropFilter="blur(10px)"
            borderRadius="xl"
            _focus={{ boxShadow: "2xl" }}
            minW="200px"
          >
            <PopoverBody p={4}>
              <VStack spacing={3} align="stretch">
                <Text fontSize="sm" fontWeight="semibold" color={useColorModeValue('gray.700', 'gray.300')} mb={1}>
                  选择应用模块
                </Text>
                
                <Button
                  leftIcon={<EditIcon />}
                  variant={currentView === 'notes' ? 'solid' : 'ghost'}
                  colorScheme="blue"
                  size="sm"
                  justifyContent="flex-start"
                  onClick={() => setCurrentView('notes')}
                  borderRadius="lg"
                >
                  记事本
                </Button>
                
                <Button
                  leftIcon={<CheckCircleIcon />}
                  variant={currentView === 'todo' ? 'solid' : 'ghost'}
                  colorScheme="green"
                  size="sm"
                  justifyContent="flex-start"
                  onClick={() => setCurrentView('todo')}
                  borderRadius="lg"
                >
                  待办清单
                </Button>
                
                <Button
                  leftIcon={<ViewIcon />}
                  variant={currentView === 'dashboard' ? 'solid' : 'ghost'}
                  colorScheme="purple"
                  size="sm"
                  justifyContent="flex-start"
                  onClick={() => setCurrentView('dashboard')}
                  borderRadius="lg"
                >
                  仪表板
                </Button>
                
                <Button
                  leftIcon={<ChatIcon />}
                  variant={currentView === 'ai-chat' ? 'solid' : 'ghost'}
                  colorScheme="orange"
                  size="sm"
                  justifyContent="flex-start"
                  onClick={() => setCurrentView('ai-chat')}
                  borderRadius="lg"
                >
                  AI问答
                </Button>
                
                <Divider />
                
                <Text fontSize="xs" color={useColorModeValue('gray.500', 'gray.400')} textAlign="center">
                  当前: {currentView === 'notes' ? '记事本' : currentView === 'todo' ? '待办清单' : currentView === 'dashboard' ? '仪表板' : 'AI问答'}
                </Text>
              </VStack>
            </PopoverBody>
          </PopoverContent>
        </Popover>
        
        {/* 番茄钟按钮 */}
        <Popover placement="bottom-end">
          <PopoverTrigger>
            <IconButton
              aria-label="番茄钟"
              icon={<TimeIcon />}
              size="md"
              bg={pomodoroButtonBg}
              color={buttonColor}
              borderRadius="xl"
              boxShadow="lg"
              _hover={{
                bg: pomodoroButtonHoverBg,
                transform: "translateY(-1px)",
                boxShadow: "xl"
              }}
              _active={{
                transform: "translateY(0px)"
              }}
              transition="all 0.2s ease"
            />
          </PopoverTrigger>
          <PopoverContent
            border="none"
            boxShadow="2xl"
            bg="transparent"
            _focus={{ boxShadow: "2xl" }}
          >
            <PopoverBody p={0}>
              <PomodoroTimer />
            </PopoverBody>
          </PopoverContent>
        </Popover>
        
        {/* 折叠侧边栏按钮 */}
        <IconButton
          aria-label={isSidebarCollapsed ? "展开侧边栏" : "折叠侧边栏"}
          icon={<HamburgerIcon />}
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          size="md"
          bg={buttonBg}
          color={buttonColor}
          borderRadius="xl"
          boxShadow="lg"
          _hover={{
            bg: buttonHoverBg,
            transform: "translateY(-1px)",
            boxShadow: "xl"
          }}
          _active={{
            transform: "translateY(0px)"
          }}
          transition="all 0.2s ease"
        />
      </HStack>
     </Box>
     </NavigationContext.Provider>
   )
 }

export default Layout