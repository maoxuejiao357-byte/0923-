import React, { useMemo } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Flex,
  useColorModeValue,
  Grid,
  GridItem,
  Badge,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  CardHeader,
  Heading,
  SimpleGrid,
  Circle,
  Divider
} from '@chakra-ui/react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

// 模拟任务数据
const mockTasks = [
  { id: 1, title: '完成产品需求文档', priority: 'urgent-important', category: '业务端', completed: false },
  { id: 2, title: '优化AI算法性能', priority: 'important-not-urgent', category: 'AI', completed: false },
  { id: 3, title: '团队周会准备', priority: 'urgent-not-important', category: '运营内部', completed: true },
  { id: 4, title: '客户反馈整理', priority: 'urgent-important', category: '业务端', completed: false },
  { id: 5, title: '代码重构计划', priority: 'important-not-urgent', category: 'AI', completed: false },
  { id: 6, title: '办公用品采购', priority: 'not-urgent-not-important', category: '运营内部', completed: true },
  { id: 7, title: '新功能测试', priority: 'urgent-important', category: 'AI', completed: false },
  { id: 8, title: '市场调研报告', priority: 'important-not-urgent', category: '业务端', completed: false },
  { id: 9, title: '员工培训安排', priority: 'urgent-not-important', category: '运营内部', completed: false },
  { id: 10, title: '数据备份检查', priority: 'not-urgent-not-important', category: 'AI', completed: true }
]

const Dashboard: React.FC = () => {
  const bg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)')
  const cardBg = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(45, 55, 72, 0.9)')
  const textColor = useColorModeValue('gray.800', 'white')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const borderColor = useColorModeValue('rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)')

  // 计算统计数据
  const stats = useMemo(() => {
    const total = mockTasks.length
    const completed = mockTasks.filter(task => task.completed).length
    const pending = total - completed
    
    // 按优先级分类
    const priorityStats = {
      'urgent-important': mockTasks.filter(task => task.priority === 'urgent-important').length,
      'important-not-urgent': mockTasks.filter(task => task.priority === 'important-not-urgent').length,
      'urgent-not-important': mockTasks.filter(task => task.priority === 'urgent-not-important').length,
      'not-urgent-not-important': mockTasks.filter(task => task.priority === 'not-urgent-not-important').length
    }
    
    // 按分类统计
    const categoryStats = {
      '业务端': mockTasks.filter(task => task.category === '业务端').length,
      '运营内部': mockTasks.filter(task => task.category === '运营内部').length,
      'AI': mockTasks.filter(task => task.category === 'AI').length
    }
    
    return { total, completed, pending, priorityStats, categoryStats }
  }, [])

  // 饼图数据 - 按分类
  const categoryPieData = [
    { name: '业务端', value: stats.categoryStats['业务端'], color: '#3182CE' },
    { name: '运营内部', value: stats.categoryStats['运营内部'], color: '#38A169' },
    { name: 'AI', value: stats.categoryStats['AI'], color: '#D69E2E' }
  ]

  // 柱状图数据 - 按优先级
  const priorityBarData = [
    { name: '紧急重要', value: stats.priorityStats['urgent-important'], color: '#E53E3E' },
    { name: '重要不紧急', value: stats.priorityStats['important-not-urgent'], color: '#D69E2E' },
    { name: '紧急不重要', value: stats.priorityStats['urgent-not-important'], color: '#3182CE' },
    { name: '不紧急不重要', value: stats.priorityStats['not-urgent-not-important'], color: '#38A169' }
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          bg={cardBg}
          p={3}
          borderRadius="md"
          boxShadow="lg"
          border="1px solid"
          borderColor={borderColor}
        >
          <Text color={textColor} fontWeight="medium">{label}</Text>
          <Text color={payload[0].color} fontSize="sm">
            任务数量: {payload[0].value}
          </Text>
        </Box>
      )
    }
    return null
  }

  return (
    <Box
      h="100%"
      bg={bg}
      backdropFilter="blur(10px)"
      p={6}
      overflowY="auto"
    >
      <VStack spacing={6} align="stretch">
        {/* 页面标题 */}
        <Box>
          <Heading size="lg" color={textColor} mb={2}>
            📊 任务仪表盘
          </Heading>
          <Text color={mutedColor} fontSize="sm">
            实时查看任务统计和分布情况
          </Text>
        </Box>

        {/* 总览统计卡片 */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
          <Card bg={cardBg} backdropFilter="blur(10px)" border="1px solid" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel color={mutedColor}>总任务数</StatLabel>
                <StatNumber color={textColor} fontSize="2xl">{stats.total}</StatNumber>
                <StatHelpText color={mutedColor}>所有任务</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card bg={cardBg} backdropFilter="blur(10px)" border="1px solid" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel color={mutedColor}>已完成</StatLabel>
                <StatNumber color="green.500" fontSize="2xl">{stats.completed}</StatNumber>
                <StatHelpText color={mutedColor}>
                  完成率 {((stats.completed / stats.total) * 100).toFixed(1)}%
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
          
          <Card bg={cardBg} backdropFilter="blur(10px)" border="1px solid" borderColor={borderColor}>
            <CardBody>
              <Stat>
                <StatLabel color={mutedColor}>待完成</StatLabel>
                <StatNumber color="orange.500" fontSize="2xl">{stats.pending}</StatNumber>
                <StatHelpText color={mutedColor}>进行中的任务</StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* 图表区域 */}
        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
          {/* 分类分布饼图 */}
          <GridItem>
            <Card bg={cardBg} backdropFilter="blur(10px)" border="1px solid" borderColor={borderColor} h="400px">
              <CardHeader>
                <Heading size="md" color={textColor}>任务分类分布</Heading>
                <Text color={mutedColor} fontSize="sm">按业务方向统计</Text>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={categoryPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      verticalAlign="bottom" 
                      height={36}
                      formatter={(value: string, entry: any) => (
                        <span style={{ color: textColor }}>{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          </GridItem>

          {/* 优先级分布柱状图 */}
          <GridItem>
            <Card bg={cardBg} backdropFilter="blur(10px)" border="1px solid" borderColor={borderColor} h="400px">
              <CardHeader>
                <Heading size="md" color={textColor}>优先级分布</Heading>
                <Text color={mutedColor} fontSize="sm">按重要程度统计</Text>
              </CardHeader>
              <CardBody>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={priorityBarData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke={borderColor} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: textColor, fontSize: 12 }}
                      axisLine={{ stroke: borderColor }}
                    />
                    <YAxis 
                      tick={{ fill: textColor, fontSize: 12 }}
                      axisLine={{ stroke: borderColor }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {priorityBarData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        {/* 详细统计 */}
        <Card bg={cardBg} backdropFilter="blur(10px)" border="1px solid" borderColor={borderColor}>
          <CardHeader>
            <Heading size="md" color={textColor}>详细统计</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              {/* 按分类的进度条 */}
              <Box>
                <Text color={textColor} fontWeight="medium" mb={3}>分类完成情况</Text>
                <VStack spacing={3}>
                  {Object.entries(stats.categoryStats).map(([category, total]) => {
                    const completed = mockTasks.filter(task => 
                      task.category === category && task.completed
                    ).length
                    const percentage = total > 0 ? (completed / total) * 100 : 0
                    
                    return (
                      <Box key={category} w="100%">
                        <Flex justify="space-between" mb={1}>
                          <Text color={textColor} fontSize="sm">{category}</Text>
                          <Text color={mutedColor} fontSize="sm">
                            {completed}/{total} ({percentage.toFixed(0)}%)
                          </Text>
                        </Flex>
                        <Progress 
                          value={percentage} 
                          colorScheme={category === '业务端' ? 'blue' : category === 'AI' ? 'yellow' : 'green'}
                          size="sm"
                          borderRadius="full"
                        />
                      </Box>
                    )
                  })}
                </VStack>
              </Box>
              
              <Divider borderColor={borderColor} />
              
              {/* 优先级标签 */}
              <Box>
                <Text color={textColor} fontWeight="medium" mb={3}>优先级分布</Text>
                <Flex wrap="wrap" gap={3}>
                  {Object.entries(stats.priorityStats).map(([priority, count]) => {
                    const labels = {
                      'urgent-important': { text: '紧急重要', color: 'red' },
                      'important-not-urgent': { text: '重要不紧急', color: 'yellow' },
                      'urgent-not-important': { text: '紧急不重要', color: 'blue' },
                      'not-urgent-not-important': { text: '不紧急不重要', color: 'green' }
                    }
                    
                    return (
                      <Badge
                        key={priority}
                        colorScheme={labels[priority as keyof typeof labels].color}
                        variant="subtle"
                        px={3}
                        py={1}
                        borderRadius="full"
                      >
                        {labels[priority as keyof typeof labels].text}: {count}
                      </Badge>
                    )
                  })}
                </Flex>
              </Box>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  )
}

export default Dashboard