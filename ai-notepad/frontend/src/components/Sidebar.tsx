import React, { useState } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Divider,
  Badge,
  useColorModeValue,
  useDisclosure,
  Tooltip,
  Menu,
  MenuList,
  MenuItem,
  MenuDivider,
  useColorMode
} from '@chakra-ui/react'
import {
  AddIcon,
  SearchIcon,
  SettingsIcon,
  MoonIcon,
  SunIcon,
  HamburgerIcon,
  InfoIcon,
  ChatIcon,
  CalendarIcon,
  ChevronDownIcon,
  CheckIcon,
  ViewIcon
} from '@chakra-ui/icons'
import { useNotes } from '../context/NotesContext'
import { useSettings } from '../context/SettingsContext'
import { useNavigation } from './Layout'
// 从正确的相对路径导入SettingsModal组件
import SettingsModal from './SettingsModal'

const Sidebar: React.FC = () => {
  const { notes, createNote, searchNotes, searchQuery, searchMode, setSearchMode, isSearching } = useNotes()
  const { settings, updateSetting } = useSettings()
  const { colorMode, toggleColorMode } = useColorMode()
  const { currentView, setCurrentView } = useNavigation()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)

  const bg = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.9)')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const hoverBg = useColorModeValue('rgba(247, 250, 252, 0.8)', 'rgba(45, 55, 72, 0.8)')

  // 处理创建新笔记
  const handleCreateNote = async () => {
    await createNote({
      title: '新笔记',
      tags: [], // 添加空标签数组以满足CreateNoteData类型要求
      content: '',
      // 如果CreateNoteData类型不包含category字段,则暂时移除该属性
    })
  }

  // 处理搜索
  const handleSearch = async (query: string) => {
    setLocalSearchQuery(query)
    await searchNotes(query)
  }

  // 处理搜索模式切换
  const handleSearchModeChange = (mode: 'text' | 'semantic') => {
    setSearchMode(mode)
    if (localSearchQuery.trim()) {
      searchNotes(localSearchQuery, mode)
    }
  }

  // 获取主题显示名称
  const getThemeDisplayName = (themeStyle: string) => {
    switch (themeStyle) {
      case 'oceanBreeze': return '🌊 海洋微风'
      case 'freshBlue': return '💙 清新蓝调'
      case 'deepOcean': return '🌀 深海蓝调'
      case 'skyBlue': return '☁️ 天空蓝'
      case 'sunsetGlow': return '🌅 夕阳暖光'
      case 'warmSunset': return '🌇 温暖夕阳'
      case 'goldenHour': return '✨ 黄金时刻'
      case 'mintGreen': return '🌿 薄荷清香'
      case 'springGreen': return '🌱 春日绿意'
      case 'emeraldDream': return '💚 翡翠梦境'
      case 'lavender': return '💜 薰衣草紫'
      case 'mysticPurple': return '🔮 神秘紫'
      case 'royalPurple': return '👑 皇家紫'
      case 'warmOrange': return '🧡 温暖橙色'
      case 'rosePetal': return '🌸 玫瑰花瓣'
      case 'cherryBlossom': return '🌺 樱花粉'
      case 'sweetPink': return '💗 甜美粉'
      case 'moonlight': return '🌙 月光银'
      case 'softGray': return '🤍 柔和灰'
      case 'default': return '⚪ 经典灰调'
      default: return '🎨 选择主题'
    }
  }

  // 统计信息
  const totalNotes = notes.length
  const pinnedNotes = notes.filter(note => note.isPinned).length
  const archivedNotes = notes.filter(note => note.isArchived).length

  return (
    <>
      <Box h="100%" bg={bg} p={4} backdropFilter="blur(10px)">
        <VStack spacing={8} align="stretch" h="100%">
          {/* 头部 */}
          <HStack justify="space-between">
            <Text fontSize="lg" fontWeight="bold" color={textColor}>
              AI记事本
            </Text>
            <Menu placement="bottom-end">
              <IconButton
                icon={<HamburgerIcon />}
                variant="ghost"
                size="sm"
                aria-label="菜单"
                _hover={{ bg: hoverBg }}
                _active={{ bg: useColorModeValue('gray.200', 'gray.600') }}
                borderRadius="md"
                transition="all 0.2s"
              />
              <MenuList 
                bg={useColorModeValue('white', 'gray.800')}
                border="1px solid"
                borderColor={useColorModeValue('gray.200', 'gray.600')}
                boxShadow="lg"
                borderRadius="md"
                minW="180px"
                zIndex={1000}
              >
                <MenuItem 
                  icon={<SettingsIcon />} 
                  onClick={onOpen}
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                  _focus={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                  borderRadius="md"
                  mx={1}
                  my={0.5}
                >
                  设置
                </MenuItem>
                <MenuItem 
                  icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                  onClick={toggleColorMode}
                  _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                  _focus={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                  borderRadius="md"
                  mx={1}
                  my={0.5}
                >
                  {colorMode === 'light' ? '深色模式' : '浅色模式'}
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>

          {/* 新建笔记按钮 */}
          <Button
            leftIcon={<AddIcon />}
            colorScheme="brand"
            onClick={handleCreateNote}
            size="md"
            w="100%"
          >
            新建笔记
          </Button>

          {/* 搜索框 */}
          <VStack spacing={3} align="stretch">
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder={searchMode === 'semantic' ? '🧠 AI语义搜索笔记...' : '📝 搜索笔记...'}
                value={localSearchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                bg={useColorModeValue('white', 'gray.700')}
                border="1px solid"
                borderColor={useColorModeValue('gray.200', 'gray.600')}
                borderRadius="lg"
                _focus={{
                  borderColor: useColorModeValue('blue.400', 'blue.300'),
                  boxShadow: '0 0 0 1px ' + useColorModeValue('blue.400', 'blue.300')
                }}
                _hover={{
                  borderColor: useColorModeValue('gray.300', 'gray.500')
                }}
                isDisabled={isSearching}
                size="md"
              />
            </InputGroup>
            
            {/* 快速主题选择器 */}
            <Box w="100%">
              <Menu placement="bottom-start">
                <Button
                  rightIcon={<ChevronDownIcon />}
                  variant="outline"
                  w="100%"
                  size="sm"
                  fontSize="sm"
                  bg={useColorModeValue('white', 'gray.700')}
                  borderColor={useColorModeValue('gray.200', 'gray.600')}
                  _hover={{
                    bg: useColorModeValue('gray.50', 'gray.600'),
                    borderColor: useColorModeValue('gray.300', 'gray.500'),
                    transform: 'translateY(-1px)',
                    shadow: 'sm'
                  }}
                  _active={{
                    bg: useColorModeValue('gray.100', 'gray.600'),
                    transform: 'translateY(0px)'
                  }}
                  borderRadius="lg"
                  transition="all 0.2s"
                >
                  🎨 {getThemeDisplayName(settings.themeStyle)}
                </Button>
                <MenuList
                  bg={useColorModeValue('white', 'gray.800')}
                  border="1px solid"
                  borderColor={useColorModeValue('gray.200', 'gray.600')}
                  shadow="lg"
                  borderRadius="lg"
                  minW="250px"
                  maxH="400px"
                  overflowY="auto"
                  zIndex={1000}
                >
                  <Text px={3} py={2} fontSize="xs" fontWeight="bold" color="gray.500" bg={useColorModeValue('gray.50', 'gray.700')}>🌊 蓝色系</Text>
                  <MenuItem
                    onClick={() => updateSetting('themeStyle', 'oceanBreeze')}
                    bg={settings.themeStyle === 'oceanBreeze' ? useColorModeValue('blue.50', 'blue.900') : 'transparent'}
                    _hover={{ bg: useColorModeValue('blue.50', 'blue.800') }}
                    _focus={{ bg: useColorModeValue('blue.50', 'blue.800') }}
                    borderRadius="md"
                    mx={1}
                    my={0.5}
                  >
                    🌊 海洋微风
                  </MenuItem>
                  <MenuItem
                    onClick={() => updateSetting('themeStyle', 'freshBlue')}
                    bg={settings.themeStyle === 'freshBlue' ? useColorModeValue('blue.50', 'blue.900') : 'transparent'}
                    _hover={{ bg: useColorModeValue('blue.50', 'blue.800') }}
                    _focus={{ bg: useColorModeValue('blue.50', 'blue.800') }}
                    borderRadius="md"
                    mx={1}
                    my={0.5}
                  >
                    💙 清新蓝调
                  </MenuItem>
                  <MenuItem
                    onClick={() => updateSetting('themeStyle', 'deepOcean')}
                    bg={settings.themeStyle === 'deepOcean' ? useColorModeValue('blue.50', 'blue.900') : 'transparent'}
                    _hover={{ bg: useColorModeValue('blue.50', 'blue.800') }}
                    _focus={{ bg: useColorModeValue('blue.50', 'blue.800') }}
                    borderRadius="md"
                    mx={1}
                    my={0.5}
                  >
                    🌀 深海蓝调
                  </MenuItem>
                  <MenuItem
                    onClick={() => updateSetting('themeStyle', 'skyBlue')}
                    bg={settings.themeStyle === 'skyBlue' ? useColorModeValue('blue.50', 'blue.900') : 'transparent'}
                    _hover={{ bg: useColorModeValue('blue.50', 'blue.800') }}
                    _focus={{ bg: useColorModeValue('blue.50', 'blue.800') }}
                    borderRadius="md"
                    mx={1}
                    my={0.5}
                  >
                    ☁️ 天空蓝
                  </MenuItem>
                  
                  <MenuDivider />
                  <Text px={3} py={2} fontSize="xs" fontWeight="bold" color="gray.500" bg={useColorModeValue('gray.50', 'gray.700')}>🔥 暖色系</Text>
                  <MenuItem
                    onClick={() => updateSetting('themeStyle', 'sunsetGlow')}
                    bg={settings.themeStyle === 'sunsetGlow' ? useColorModeValue('orange.50', 'orange.900') : 'transparent'}
                    _hover={{ bg: useColorModeValue('orange.50', 'orange.800') }}
                    _focus={{ bg: useColorModeValue('orange.50', 'orange.800') }}
                    borderRadius="md"
                    mx={1}
                    my={0.5}
                  >
                    🌅 夕阳暖光
                  </MenuItem>
                  
                  <MenuDivider />
                  <Text px={3} py={2} fontSize="xs" fontWeight="bold" color="gray.500" bg={useColorModeValue('gray.50', 'gray.700')}>🌿 绿色系</Text>
                  <MenuItem
                    onClick={() => updateSetting('themeStyle', 'mintGreen')}
                    bg={settings.themeStyle === 'mintGreen' ? useColorModeValue('green.50', 'green.900') : 'transparent'}
                    _hover={{ bg: useColorModeValue('green.50', 'green.800') }}
                    _focus={{ bg: useColorModeValue('green.50', 'green.800') }}
                    borderRadius="md"
                    mx={1}
                    my={0.5}
                  >
                    🌿 薄荷清香
                  </MenuItem>
                  <MenuItem
                    onClick={() => updateSetting('themeStyle', 'springGreen')}
                    bg={settings.themeStyle === 'springGreen' ? useColorModeValue('green.50', 'green.900') : 'transparent'}
                    _hover={{ bg: useColorModeValue('green.50', 'green.800') }}
                    _focus={{ bg: useColorModeValue('green.50', 'green.800') }}
                    borderRadius="md"
                    mx={1}
                    my={0.5}
                  >
                    🌲 春日绿意
                  </MenuItem>
                  
                  <MenuDivider />
                  <Text px={3} py={2} fontSize="xs" fontWeight="bold" color="gray.500" bg={useColorModeValue('gray.50', 'gray.700')}>💜 紫色系</Text>
                  <MenuItem
                    onClick={() => updateSetting('themeStyle', 'lavender')}
                    bg={settings.themeStyle === 'lavender' ? useColorModeValue('purple.50', 'purple.900') : 'transparent'}
                    _hover={{ bg: useColorModeValue('purple.50', 'purple.800') }}
                    _focus={{ bg: useColorModeValue('purple.50', 'purple.800') }}
                    borderRadius="md"
                    mx={1}
                    my={0.5}
                  >
                    💜 薰衣草紫
                  </MenuItem>
                  
                  <MenuDivider />
                  <Text px={3} py={2} fontSize="xs" fontWeight="bold" color="gray.500" bg={useColorModeValue('gray.50', 'gray.700')}>🌸 粉色系</Text>
                  <MenuItem
                    onClick={() => updateSetting('themeStyle', 'rosePetal')}
                    bg={settings.themeStyle === 'rosePetal' ? useColorModeValue('pink.50', 'pink.900') : 'transparent'}
                    _hover={{ bg: useColorModeValue('pink.50', 'pink.800') }}
                    _focus={{ bg: useColorModeValue('pink.50', 'pink.800') }}
                    borderRadius="md"
                    mx={1}
                    my={0.5}
                  >
                    🌸 玫瑰花瓣
                  </MenuItem>
                  <MenuItem
                    onClick={() => updateSetting('themeStyle', 'cherryBlossom')}
                    bg={settings.themeStyle === 'cherryBlossom' ? useColorModeValue('pink.50', 'pink.900') : 'transparent'}
                    _hover={{ bg: useColorModeValue('pink.50', 'pink.800') }}
                    _focus={{ bg: useColorModeValue('pink.50', 'pink.800') }}
                    borderRadius="md"
                    mx={1}
                    my={0.5}
                  >
                    🌺 樱花粉
                  </MenuItem>
                  
                  <MenuDivider />
                  <Text px={3} py={2} fontSize="xs" fontWeight="bold" color="gray.500" bg={useColorModeValue('gray.50', 'gray.700')}>⚪ 中性色</Text>
                  <MenuItem
                    onClick={() => updateSetting('themeStyle', 'moonlight')}
                    bg={settings.themeStyle === 'moonlight' ? useColorModeValue('gray.50', 'gray.700') : 'transparent'}
                    _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
                    _focus={{ bg: useColorModeValue('gray.100', 'gray.600') }}
                    borderRadius="md"
                    mx={1}
                    my={0.5}
                  >
                    🌙 月光银
                  </MenuItem>
                  <MenuItem
                    onClick={() => updateSetting('themeStyle', 'default')}
                    bg={settings.themeStyle === 'default' ? useColorModeValue('gray.50', 'gray.700') : 'transparent'}
                    _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}
                    _focus={{ bg: useColorModeValue('gray.100', 'gray.600') }}
                    borderRadius="md"
                    mx={1}
                    my={0.5}
                  >
                    ⚪ 经典灰调
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
            
            {/* 搜索类型选择按钮组 */}
            <HStack spacing={2} w="100%">
              <Button
                leftIcon={<Text fontSize="sm">📝</Text>}
                variant={searchMode === 'text' ? 'solid' : 'outline'}
                colorScheme={searchMode === 'text' ? 'blue' : 'gray'}
                size="sm"
                flex={1}
                onClick={() => handleSearchModeChange('text')}
                isDisabled={isSearching}
                borderRadius="lg"
                _hover={{
                  bg: searchMode === 'text' 
                    ? useColorModeValue('blue.500', 'blue.400')
                    : useColorModeValue('gray.100', 'gray.600'),
                  transform: 'translateY(-1px)',
                  shadow: 'sm'
                }}
                _active={{
                  transform: 'translateY(0px)'
                }}
                transition="all 0.2s"
                fontSize="xs"
                fontWeight={searchMode === 'text' ? 'semibold' : 'normal'}
              >
                文本搜索
              </Button>
              <Button
                leftIcon={<Text fontSize="sm">🧠</Text>}
                variant={searchMode === 'semantic' ? 'solid' : 'outline'}
                colorScheme={searchMode === 'semantic' ? 'purple' : 'gray'}
                size="sm"
                flex={1}
                onClick={() => handleSearchModeChange('semantic')}
                isDisabled={isSearching}
                borderRadius="lg"
                _hover={{
                  bg: searchMode === 'semantic' 
                    ? useColorModeValue('purple.500', 'purple.400')
                    : useColorModeValue('gray.100', 'gray.600'),
                  transform: 'translateY(-1px)',
                  shadow: 'sm'
                }}
                _active={{
                  transform: 'translateY(0px)'
                }}
                transition="all 0.2s"
                fontSize="xs"
                fontWeight={searchMode === 'semantic' ? 'semibold' : 'normal'}
              >
                AI语义搜索
              </Button>
            </HStack>
            
            {isSearching && (
              <HStack justify="center" spacing={2}>
                <Text fontSize="xs" color="gray.500">
                  {searchMode === 'semantic' ? '🧠 正在进行AI语义搜索...' : '📝 正在搜索...'}
                </Text>
              </HStack>
            )}
          </VStack>

          {/* 导航按钮 */}
          <VStack spacing={4} align="stretch">
            <Button
              leftIcon={<InfoIcon />}
              variant={currentView === 'notes' ? 'solid' : 'ghost'}
              justifyContent="flex-start"
              size="sm"
              _hover={{ bg: currentView === 'notes' ? 'blue.600' : hoverBg }}
              color={currentView === 'notes' ? 'white' : textColor}
              bg={currentView === 'notes' ? 'blue.500' : 'transparent'}
              borderRadius="lg"
              onClick={() => setCurrentView('notes')}
            >
              知识库
            </Button>
            
            <Button
              leftIcon={<ViewIcon />}
              variant={currentView === 'dashboard' ? 'solid' : 'ghost'}
              justifyContent="flex-start"
              size="sm"
              _hover={{ bg: currentView === 'dashboard' ? 'purple.600' : hoverBg }}
              color={currentView === 'dashboard' ? 'white' : textColor}
              bg={currentView === 'dashboard' ? 'purple.500' : 'transparent'}
              borderRadius="lg"
              onClick={() => setCurrentView('dashboard')}
            >
              仪表盘
            </Button>
            
            <Button
              leftIcon={<CheckIcon />}
              variant={currentView === 'todo' ? 'solid' : 'ghost'}
              justifyContent="flex-start"
              size="sm"
              _hover={{ bg: currentView === 'todo' ? 'green.600' : hoverBg }}
              color={currentView === 'todo' ? 'white' : textColor}
              bg={currentView === 'todo' ? 'green.500' : 'transparent'}
              borderRadius="lg"
              onClick={() => setCurrentView('todo')}
            >
              待办事项
            </Button>
            
            <Menu>
              <Button
                leftIcon={<SearchIcon />}
                variant="ghost"
                justifyContent="flex-start"
                size="sm"
                _hover={{ bg: hoverBg }}
                color={textColor}
                rightIcon={<ChevronDownIcon fontSize="xs" />}
                borderRadius="lg"
              >
                知识库广场
              </Button>
              <MenuList>
                <MenuItem
                  onClick={() => window.open('https://www.perplexity.ai/account/api/group', '_blank')}
                >
                  🔍 Perplexity API
                </MenuItem>
                <MenuItem
                  onClick={() => window.open('https://aistudio.google.com/app/u/1/prompts/new_chat', '_blank')}
                >
                  🤖 Google AI Studio
                </MenuItem>
              </MenuList>
            </Menu>
            
            <Button
              leftIcon={<ChatIcon />}
              variant="ghost"
              justifyContent="flex-start"
              size="sm"
              _hover={{ bg: hoverBg }}
              color={textColor}
              borderRadius="lg"
            >
              问答历史
            </Button>
            
            <Button
              leftIcon={<CalendarIcon />}
              variant="ghost"
              justifyContent="flex-start"
              size="sm"
              _hover={{ bg: hoverBg }}
              color={textColor}
              borderRadius="lg"
            >
              日历
            </Button>
          </VStack>

          <Divider />

          {/* 统计信息 */}
          <VStack spacing={3} align="stretch">
            <Text fontSize="sm" fontWeight="medium" color={textColor}>
              统计信息
            </Text>
            
            <HStack justify="space-between">
              <Text fontSize="sm" color={textColor}>总笔记</Text>
              <Badge colorScheme="blue" variant="subtle">
                {totalNotes}
              </Badge>
            </HStack>
            
            {pinnedNotes > 0 && (
              <HStack justify="space-between">
                <Text fontSize="sm" color={textColor}>置顶</Text>
                <Badge colorScheme="yellow" variant="subtle">
                  {pinnedNotes}
                </Badge>
              </HStack>
            )}
            
            {archivedNotes > 0 && (
              <HStack justify="space-between">
                <Text fontSize="sm" color={textColor}>已归档</Text>
                <Badge colorScheme="gray" variant="subtle">
                  {archivedNotes}
                </Badge>
              </HStack>
            )}
          </VStack>

          <Divider />

          {/* AI功能状态 */}
          <VStack spacing={2} align="stretch">
            <Text fontSize="sm" fontWeight="medium" color={textColor}>
              AI功能
            </Text>
            
            <HStack justify="space-between">
              <Text fontSize="sm" color={textColor}>状态</Text>
              <Badge 
                colorScheme={settings.enableAI ? 'green' : 'red'} 
                variant="subtle"
              >
                {settings.enableAI ? '已启用' : '未启用'}
              </Badge>
            </HStack>
            
            {!settings.enableAI && (
              <Text fontSize="xs" color="gray.500">
                在设置中配置OpenRouter API密钥以启用AI功能
              </Text>
            )}
          </VStack>

          {/* 快速主题切换 */}
          <Box mt="auto">
            <VStack spacing={3}>
              <Box w="100%">
                <Text fontSize="sm" fontWeight="medium" color={textColor} mb={2}>
                  🎨 主题风格
                </Text>
                <Menu>
                  <Button
                    variant="ghost"
                    size="sm"
                    w="100%"
                    rightIcon={<ChevronDownIcon />}
                    _hover={{ bg: hoverBg }}
                    color={textColor}
                    borderRadius="lg"
                  >
                    {getThemeDisplayName(settings.themeStyle)}
                  </Button>
                  <MenuList fontSize="sm" maxH="400px" overflowY="auto">
                    <Text px={3} py={1} fontSize="xs" fontWeight="bold" color="gray.500">蓝色系</Text>
                    <MenuItem
                      onClick={() => updateSetting('themeStyle', 'oceanBreeze')}
                      bg={settings.themeStyle === 'oceanBreeze' ? useColorModeValue('blue.50', 'blue.900') : 'transparent'}
                    >
                      🌊 海洋微风
                    </MenuItem>
                    <MenuItem
                      onClick={() => updateSetting('themeStyle', 'freshBlue')}
                      bg={settings.themeStyle === 'freshBlue' ? useColorModeValue('blue.50', 'blue.900') : 'transparent'}
                    >
                      💙 清新蓝调
                    </MenuItem>
                    <MenuItem
                      onClick={() => updateSetting('themeStyle', 'deepOcean')}
                      bg={settings.themeStyle === 'deepOcean' ? useColorModeValue('blue.50', 'blue.900') : 'transparent'}
                    >
                      🌀 深海蓝调
                    </MenuItem>
                    <MenuItem
                      onClick={() => updateSetting('themeStyle', 'skyBlue')}
                      bg={settings.themeStyle === 'skyBlue' ? useColorModeValue('blue.50', 'blue.900') : 'transparent'}
                    >
                      ☁️ 天空蓝
                    </MenuItem>
                    
                    <MenuDivider />
                    <Text px={3} py={1} fontSize="xs" fontWeight="bold" color="gray.500">暖色系</Text>
                    <MenuItem
                      onClick={() => updateSetting('themeStyle', 'sunsetGlow')}
                      bg={settings.themeStyle === 'sunsetGlow' ? useColorModeValue('orange.50', 'orange.900') : 'transparent'}
                    >
                      🌅 夕阳暖光
                    </MenuItem>
                    <MenuItem
                      onClick={() => updateSetting('themeStyle', 'warmSunset')}
                      bg={settings.themeStyle === 'warmSunset' ? useColorModeValue('orange.50', 'orange.900') : 'transparent'}
                    >
                      🌇 温暖夕阳
                    </MenuItem>
                    <MenuItem
                      onClick={() => updateSetting('themeStyle', 'goldenHour')}
                      bg={settings.themeStyle === 'goldenHour' ? useColorModeValue('orange.50', 'orange.900') : 'transparent'}
                    >
                      ✨ 黄金时刻
                    </MenuItem>
                    <MenuItem
                      onClick={() => updateSetting('themeStyle', 'warmOrange')}
                      bg={settings.themeStyle === 'warmOrange' ? useColorModeValue('orange.50', 'orange.900') : 'transparent'}
                    >
                      🧡 温暖橙色
                    </MenuItem>
                    
                    <MenuDivider />
                     <Text px={3} py={1} fontSize="xs" fontWeight="bold" color="gray.500">绿色系</Text>
                    <MenuItem
                      onClick={() => updateSetting('themeStyle', 'mintGreen')}
                      bg={settings.themeStyle === 'mintGreen' ? useColorModeValue('green.50', 'green.900') : 'transparent'}
                    >
                      🌿 薄荷清香
                    </MenuItem>
                    <MenuItem
                      onClick={() => updateSetting('themeStyle', 'springGreen')}
                      bg={settings.themeStyle === 'springGreen' ? useColorModeValue('green.50', 'green.900') : 'transparent'}
                    >
                      🌱 春日绿意
                    </MenuItem>
                    <MenuItem
                      onClick={() => updateSetting('themeStyle', 'emeraldDream')}
                      bg={settings.themeStyle === 'emeraldDream' ? useColorModeValue('green.50', 'green.900') : 'transparent'}
                    >
                      💚 翡翠梦境
                    </MenuItem>
                    
                    <MenuDivider />
                     <Text px={3} py={1} fontSize="xs" fontWeight="bold" color="gray.500">紫色系</Text>
                    <MenuItem
                      onClick={() => updateSetting('themeStyle', 'lavender')}
                      bg={settings.themeStyle === 'lavender' ? useColorModeValue('purple.50', 'purple.900') : 'transparent'}
                    >
                      💜 薰衣草紫
                    </MenuItem>
                    <MenuItem
                      onClick={() => updateSetting('themeStyle', 'mysticPurple')}
                      bg={settings.themeStyle === 'mysticPurple' ? useColorModeValue('purple.50', 'purple.900') : 'transparent'}
                    >
                      🔮 神秘紫
                    </MenuItem>
                    <MenuItem
                      onClick={() => updateSetting('themeStyle', 'royalPurple')}
                      bg={settings.themeStyle === 'royalPurple' ? useColorModeValue('purple.50', 'purple.900') : 'transparent'}
                    >
                      👑 皇家紫
                    </MenuItem>
                    
                    <MenuDivider />
                     <Text px={3} py={1} fontSize="xs" fontWeight="bold" color="gray.500">粉色系</Text>
                    <MenuItem
                      onClick={() => updateSetting('themeStyle', 'rosePetal')}
                      bg={settings.themeStyle === 'rosePetal' ? useColorModeValue('pink.50', 'pink.900') : 'transparent'}
                    >
                      🌸 玫瑰花瓣
                    </MenuItem>
                    <MenuItem
                      onClick={() => updateSetting('themeStyle', 'cherryBlossom')}
                      bg={settings.themeStyle === 'cherryBlossom' ? useColorModeValue('pink.50', 'pink.900') : 'transparent'}
                    >
                      🌺 樱花粉
                    </MenuItem>
                    <MenuItem
                      onClick={() => updateSetting('themeStyle', 'sweetPink')}
                      bg={settings.themeStyle === 'sweetPink' ? useColorModeValue('pink.50', 'pink.900') : 'transparent'}
                    >
                      💗 甜美粉
                    </MenuItem>
                    
                    <MenuDivider />
                     <Text px={3} py={1} fontSize="xs" fontWeight="bold" color="gray.500">中性色</Text>
                    <MenuItem
                      onClick={() => updateSetting('themeStyle', 'moonlight')}
                      bg={settings.themeStyle === 'moonlight' ? useColorModeValue('gray.50', 'gray.700') : 'transparent'}
                    >
                      🌙 月光银
                    </MenuItem>
                    <MenuItem
                      onClick={() => updateSetting('themeStyle', 'softGray')}
                      bg={settings.themeStyle === 'softGray' ? useColorModeValue('gray.50', 'gray.700') : 'transparent'}
                    >
                      🤍 柔和灰
                    </MenuItem>
                    <MenuItem
                      onClick={() => updateSetting('themeStyle', 'default')}
                      bg={settings.themeStyle === 'default' ? useColorModeValue('gray.50', 'gray.700') : 'transparent'}
                    >
                      ⚪ 经典灰调
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Box>
              
              {/* AI模型选择器 */}
              <Box w="100%">
                <Menu placement="bottom-end">
                  <Button
                    rightIcon={<ChevronDownIcon />}
                    variant="ghost"
                    w="100%"
                    size="sm"
                    fontSize="xs"
                    _hover={{
                      bg: hoverBg,
                      transform: 'translateY(-1px)',
                      shadow: 'sm'
                    }}
                    _active={{
                      bg: hoverBg,
                      transform: 'translateY(0px)'
                    }}
                    borderRadius="lg"
                    transition="all 0.2s"
                    isDisabled={!settings.enableAI}
                  >
                    🤖 {settings.aiModel === 'gpt-3.5-turbo' ? 'GPT-3.5' : 
                         settings.aiModel === 'gpt-4' ? 'GPT-4' :
                         settings.aiModel === 'gpt-4-turbo' ? 'GPT-4T' :
                         settings.aiModel === 'claude-3-haiku' ? 'Claude-H' :
                         settings.aiModel === 'claude-3-sonnet' ? 'Claude-S' :
                         settings.aiModel === 'claude-3-opus' ? 'Claude-O' : 'AI模型'}
                  </Button>
                  <MenuList
                    bg={useColorModeValue('white', 'gray.800')}
                    border="1px solid"
                    borderColor={useColorModeValue('gray.200', 'gray.600')}
                    shadow="lg"
                    borderRadius="lg"
                    minW="200px"
                    zIndex={1000}
                  >
                    <Text px={3} py={1} fontSize="xs" fontWeight="bold" color="gray.500">OpenAI 模型</Text>
                    <MenuItem
                      onClick={() => updateSetting('aiModel', 'gpt-3.5-turbo')}
                      bg={settings.aiModel === 'gpt-3.5-turbo' ? useColorModeValue('blue.50', 'blue.900') : 'transparent'}
                      _hover={{ bg: useColorModeValue('blue.50', 'blue.800') }}
                      _focus={{ bg: useColorModeValue('blue.50', 'blue.800') }}
                      borderRadius="md"
                      mx={1}
                      my={0.5}
                    >
                      🚀 GPT-3.5 Turbo
                    </MenuItem>
                    <MenuItem
                      onClick={() => updateSetting('aiModel', 'gpt-4')}
                      bg={settings.aiModel === 'gpt-4' ? useColorModeValue('blue.50', 'blue.900') : 'transparent'}
                      _hover={{ bg: useColorModeValue('blue.50', 'blue.800') }}
                      _focus={{ bg: useColorModeValue('blue.50', 'blue.800') }}
                      borderRadius="md"
                      mx={1}
                      my={0.5}
                    >
                      🧠 GPT-4
                    </MenuItem>
                    <MenuItem
                      onClick={() => updateSetting('aiModel', 'gpt-4-turbo')}
                      bg={settings.aiModel === 'gpt-4-turbo' ? useColorModeValue('blue.50', 'blue.900') : 'transparent'}
                      _hover={{ bg: useColorModeValue('blue.50', 'blue.800') }}
                      _focus={{ bg: useColorModeValue('blue.50', 'blue.800') }}
                      borderRadius="md"
                      mx={1}
                      my={0.5}
                    >
                      ⚡ GPT-4 Turbo
                    </MenuItem>
                    
                    <MenuDivider />
                    <Text px={3} py={1} fontSize="xs" fontWeight="bold" color="gray.500">Anthropic 模型</Text>
                    <MenuItem
                      onClick={() => updateSetting('aiModel', 'claude-3-haiku')}
                      bg={settings.aiModel === 'claude-3-haiku' ? useColorModeValue('purple.50', 'purple.900') : 'transparent'}
                      _hover={{ bg: useColorModeValue('purple.50', 'purple.800') }}
                      _focus={{ bg: useColorModeValue('purple.50', 'purple.800') }}
                      borderRadius="md"
                      mx={1}
                      my={0.5}
                    >
                      🎋 Claude 3 Haiku
                    </MenuItem>
                    <MenuItem
                      onClick={() => updateSetting('aiModel', 'claude-3-sonnet')}
                      bg={settings.aiModel === 'claude-3-sonnet' ? useColorModeValue('purple.50', 'purple.900') : 'transparent'}
                      _hover={{ bg: useColorModeValue('purple.50', 'purple.800') }}
                      _focus={{ bg: useColorModeValue('purple.50', 'purple.800') }}
                      borderRadius="md"
                      mx={1}
                      my={0.5}
                    >
                      🎼 Claude 3 Sonnet
                    </MenuItem>
                    <MenuItem
                      onClick={() => updateSetting('aiModel', 'claude-3-opus')}
                      bg={settings.aiModel === 'claude-3-opus' ? useColorModeValue('purple.50', 'purple.900') : 'transparent'}
                      _hover={{ bg: useColorModeValue('purple.50', 'purple.800') }}
                      _focus={{ bg: useColorModeValue('purple.50', 'purple.800') }}
                      borderRadius="md"
                      mx={1}
                      my={0.5}
                    >
                      🎭 Claude 3 Opus
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Box>
              
              {/* 设置按钮 */}
              <Tooltip label="设置" placement="top">
                <IconButton
                  icon={<SettingsIcon />}
                  variant="ghost"
                  onClick={onOpen}
                  w="100%"
                  aria-label="设置"
                  _hover={{ bg: hoverBg }}
                  borderRadius="lg"
                />
              </Tooltip>
            </VStack>
          </Box>
        </VStack>
      </Box>

      {/* 设置模态框 */}
      <SettingsModal isOpen={isOpen} onClose={onClose} />
    </>
  )
}

export default Sidebar