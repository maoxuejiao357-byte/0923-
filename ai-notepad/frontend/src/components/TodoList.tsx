import React, { useState } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  IconButton,
  Input,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  useColorModeValue,
  Badge,
  Select,
  Grid,
  GridItem,
  Flex,
  Divider,
  Menu,

  MenuList,
  MenuItem,
  useToast
} from '@chakra-ui/react'
import {
  AddIcon,
  EditIcon,
  DeleteIcon,
  ChevronDownIcon
} from '@chakra-ui/icons'

interface TodoItem {
  id: string
  title: string
  description: string
  priority: 'urgent-important' | 'urgent-not-important' | 'not-urgent-important' | 'not-urgent-not-important'
  category: 'business' | 'operation' | 'ai'
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'business' | 'operation' | 'ai'>('all')
  const [editingTodo, setEditingTodo] = useState<TodoItem | null>(null)
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    priority: 'not-urgent-not-important' as TodoItem['priority'],
    category: 'business' as TodoItem['category']
  })
  
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  
  const bg = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(26, 32, 44, 0.9)')
  const cardBg = useColorModeValue('white', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const textColor = useColorModeValue('gray.700', 'gray.200')
  const hoverBg = useColorModeValue('gray.50', 'gray.600')
  
  // 四象限配置
  const quadrants = [
    {
      id: 'urgent-important',
      title: '紧急且重要',
      subtitle: '立即处理',
      color: 'red',
      icon: '🔥',
      bgGradient: useColorModeValue('linear(to-br, red.50, red.100)', 'linear(to-br, red.900, red.800)')
    },
    {
      id: 'urgent-not-important',
      title: '紧急但不重要',
      subtitle: '委派处理',
      color: 'orange',
      icon: '⚡',
      bgGradient: useColorModeValue('linear(to-br, orange.50, orange.100)', 'linear(to-br, orange.900, orange.800)')
    },
    {
      id: 'not-urgent-important',
      title: '不紧急但重要',
      subtitle: '计划处理',
      color: 'blue',
      icon: '📋',
      bgGradient: useColorModeValue('linear(to-br, blue.50, blue.100)', 'linear(to-br, blue.900, blue.800)')
    },
    {
      id: 'not-urgent-not-important',
      title: '不紧急不重要',
      subtitle: '有空再做',
      color: 'gray',
      icon: '📝',
      bgGradient: useColorModeValue('linear(to-br, gray.50, gray.100)', 'linear(to-br, gray.700, gray.600)')
    }
  ]
  
  // 分类配置
  const categories = {
    business: { name: '业务端', color: 'blue', icon: '💼' },
    operation: { name: '运营内部', color: 'green', icon: '⚙️' },
    ai: { name: 'AI', color: 'purple', icon: '🤖' }
  }
  
  // 创建或更新待办事项
  const handleSaveTodo = () => {
    if (!newTodo.title.trim()) {
      toast({
        title: '请输入标题',
        status: 'warning',
        duration: 2000,
        isClosable: true
      })
      return
    }
    
    if (editingTodo) {
      // 更新现有待办事项
      setTodos(prev => prev.map(todo => 
        todo.id === editingTodo.id 
          ? { ...todo, ...newTodo, updatedAt: new Date() }
          : todo
      ))
      toast({
        title: '待办事项已更新',
        status: 'success',
        duration: 2000,
        isClosable: true
      })
    } else {
      // 创建新待办事项
      const todo: TodoItem = {
        id: Date.now().toString(),
        ...newTodo,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      setTodos(prev => [...prev, todo])
      toast({
        title: '待办事项已创建',
        status: 'success',
        duration: 2000,
        isClosable: true
      })
    }
    
    // 重置表单
    setNewTodo({
      title: '',
      description: '',
      priority: 'not-urgent-not-important',
      category: 'business'
    })
    setEditingTodo(null)
    onClose()
  }
  
  // 删除待办事项
  const handleDeleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
    toast({
      title: '待办事项已删除',
      status: 'info',
      duration: 2000,
      isClosable: true
    })
  }
  
  // 切换完成状态
  const toggleTodoComplete = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
        : todo
    ))
  }
  
  // 编辑待办事项
  const handleEditTodo = (todo: TodoItem) => {
    setEditingTodo(todo)
    setNewTodo({
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      category: todo.category
    })
    onOpen()
  }
  
  // 打开新建对话框
  const handleOpenNew = () => {
    setEditingTodo(null)
    setNewTodo({
      title: '',
      description: '',
      priority: 'not-urgent-not-important',
      category: 'business'
    })
    onOpen()
  }
  
  // 过滤待办事项
  const getFilteredTodos = (priority: TodoItem['priority']) => {
    return todos.filter(todo => {
      const matchesPriority = todo.priority === priority
      const matchesCategory = selectedCategory === 'all' || todo.category === selectedCategory
      return matchesPriority && matchesCategory
    })
  }
  
  // 获取分类统计
  const getCategoryStats = () => {
    const stats = {
      all: todos.length,
      business: todos.filter(t => t.category === 'business').length,
      operation: todos.filter(t => t.category === 'operation').length,
      ai: todos.filter(t => t.category === 'ai').length
    }
    return stats
  }
  
  const stats = getCategoryStats()
  
  return (
    <Box h="100%" bg={bg} p={6} backdropFilter="blur(10px)">
      <VStack spacing={6} align="stretch" h="100%">
        {/* 头部 */}
        <Flex justify="space-between" align="center">
          <VStack align="start" spacing={1}>
            <Text fontSize="2xl" fontWeight="bold" color={textColor}>
              📋 Todo List
            </Text>
            <Text fontSize="sm" color="gray.500">
              基于艾森豪威尔矩阵的任务管理
            </Text>
          </VStack>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={handleOpenNew}
            size="md"
          >
            新建任务
          </Button>
        </Flex>
        
        {/* 分类筛选 */}
        <HStack spacing={4} wrap="wrap">
          <Button
            size="sm"
            variant={selectedCategory === 'all' ? 'solid' : 'outline'}
            colorScheme="gray"
            onClick={() => setSelectedCategory('all')}
          >
            全部 ({stats.all})
          </Button>
          {Object.entries(categories).map(([key, cat]) => (
            <Button
              key={key}
              size="sm"
              variant={selectedCategory === key ? 'solid' : 'outline'}
              colorScheme={cat.color}
              leftIcon={<Text fontSize="xs">{cat.icon}</Text>}
              onClick={() => setSelectedCategory(key as any)}
            >
              {cat.name} ({stats[key as keyof typeof stats]})
            </Button>
          ))}
        </HStack>
        
        {/* 四象限网格 */}
        <Grid templateColumns="repeat(2, 1fr)" gap={4} flex={1}>
          {quadrants.map((quadrant) => {
            const quadrantTodos = getFilteredTodos(quadrant.id as TodoItem['priority'])
            
            return (
              <GridItem key={quadrant.id}>
                <Box
                  h="100%"
                  bg={cardBg}
                  border="1px solid"
                  borderColor={borderColor}
                  borderRadius="xl"
                  p={4}
                  bgGradient={quadrant.bgGradient}
                  _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
                  transition="all 0.2s"
                >
                  <VStack align="stretch" spacing={3} h="100%">
                    {/* 象限标题 */}
                    <HStack justify="space-between">
                      <VStack align="start" spacing={0}>
                        <HStack>
                          <Text fontSize="lg">{quadrant.icon}</Text>
                          <Text fontSize="md" fontWeight="bold" color={textColor}>
                            {quadrant.title}
                          </Text>
                        </HStack>
                        <Text fontSize="xs" color="gray.500">
                          {quadrant.subtitle}
                        </Text>
                      </VStack>
                      <Badge colorScheme={quadrant.color} variant="subtle">
                        {quadrantTodos.length}
                      </Badge>
                    </HStack>
                    
                    <Divider />
                    
                    {/* 待办事项列表 */}
                    <VStack align="stretch" spacing={2} flex={1} overflowY="auto" maxH="300px">
                      {quadrantTodos.length === 0 ? (
                        <Text fontSize="sm" color="gray.500" textAlign="center" py={4}>
                          暂无任务
                        </Text>
                      ) : (
                        quadrantTodos.map((todo) => {
                          const categoryInfo = categories[todo.category]
                          
                          return (
                            <Box
                              key={todo.id}
                              p={3}
                              bg={useColorModeValue('white', 'gray.600')}
                              border="1px solid"
                              borderColor={borderColor}
                              borderRadius="lg"
                              _hover={{ bg: hoverBg }}
                              transition="all 0.2s"
                              opacity={todo.completed ? 0.6 : 1}
                            >
                              <VStack align="stretch" spacing={2}>
                                <HStack justify="space-between">
                                  <HStack>
                                    <input
                                      type="checkbox"
                                      checked={todo.completed}
                                      onChange={() => toggleTodoComplete(todo.id)}
                                    />
                                    <Text
                                      fontSize="sm"
                                      fontWeight="medium"
                                      textDecoration={todo.completed ? 'line-through' : 'none'}
                                      color={textColor}
                                    >
                                      {todo.title}
                                    </Text>
                                  </HStack>
                                  <Menu>
                                    <Button
                                      as={IconButton}
                                      icon={<ChevronDownIcon />}
                                      size="xs"
                                      variant="ghost"
                                    />
                                    <MenuList>
                                      <MenuItem
                                        icon={<EditIcon />}
                                        onClick={() => handleEditTodo(todo)}
                                      >
                                        编辑
                                      </MenuItem>
                                      <MenuItem
                                        icon={<DeleteIcon />}
                                        onClick={() => handleDeleteTodo(todo.id)}
                                        color="red.500"
                                      >
                                        删除
                                      </MenuItem>
                                    </MenuList>
                                  </Menu>
                                </HStack>
                                
                                {todo.description && (
                                  <Text fontSize="xs" color="gray.500">
                                    {todo.description}
                                  </Text>
                                )}
                                
                                <HStack justify="space-between">
                                  <Badge
                                    size="sm"
                                    colorScheme={categoryInfo.color}
                                    variant="subtle"
                                  >
                                    {categoryInfo.icon} {categoryInfo.name}
                                  </Badge>
                                  <Text fontSize="xs" color="gray.400">
                                    {todo.createdAt.toLocaleDateString()}
                                  </Text>
                                </HStack>
                              </VStack>
                            </Box>
                          )
                        })
                      )}
                    </VStack>
                  </VStack>
                </Box>
              </GridItem>
            )
          })}
        </Grid>
      </VStack>
      
      {/* 新建/编辑对话框 */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {editingTodo ? '编辑任务' : '新建任务'}
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={2}>
                  任务标题 *
                </Text>
                <Input
                  value={newTodo.title}
                  onChange={(e) => setNewTodo(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="输入任务标题"
                />
              </Box>
              
              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={2}>
                  任务描述
                </Text>
                <Textarea
                  value={newTodo.description}
                  onChange={(e) => setNewTodo(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="输入任务描述（可选）"
                  rows={3}
                />
              </Box>
              
              <HStack spacing={4}>
                <Box flex={1}>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    优先级象限
                  </Text>
                  <Select
                    value={newTodo.priority}
                    onChange={(e) => setNewTodo(prev => ({ ...prev, priority: e.target.value as TodoItem['priority'] }))}
                  >
                    <option value="urgent-important">🔥 紧急且重要</option>
                    <option value="urgent-not-important">⚡ 紧急但不重要</option>
                    <option value="not-urgent-important">📋 不紧急但重要</option>
                    <option value="not-urgent-not-important">📝 不紧急不重要</option>
                  </Select>
                </Box>
                
                <Box flex={1}>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>
                    分类方向
                  </Text>
                  <Select
                    value={newTodo.category}
                    onChange={(e) => setNewTodo(prev => ({ ...prev, category: e.target.value as TodoItem['category'] }))}
                  >
                    <option value="business">💼 业务端</option>
                    <option value="operation">⚙️ 运营内部</option>
                    <option value="ai">🤖 AI</option>
                  </Select>
                </Box>
              </HStack>
            </VStack>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              取消
            </Button>
            <Button colorScheme="blue" onClick={handleSaveTodo}>
              {editingTodo ? '更新' : '创建'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default TodoList