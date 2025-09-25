import React, { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Switch,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  Divider,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  Textarea
} from '@chakra-ui/react'
import { useSettings } from '../context/SettingsContext'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSetting, resetSettings, exportSettings, importSettings } = useSettings()
  const toast = useToast()
  const [importData, setImportData] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)

  // 处理API密钥变化
  const handleApiKeyChange = (value: string) => {
    updateSetting('openrouterApiKey', value)
  }

  // 处理重置设置
  const handleReset = () => {
    resetSettings()
    toast({
      title: '设置已重置',
      description: '所有设置已恢复为默认值',
      status: 'success',
      duration: 3000,
      isClosable: true
    })
  }

  // 处理导出设置
  const handleExport = () => {
    const settingsJson = exportSettings()
    navigator.clipboard.writeText(settingsJson).then(() => {
      toast({
        title: '设置已复制',
        description: '设置数据已复制到剪贴板',
        status: 'success',
        duration: 3000,
        isClosable: true
      })
    })
  }

  // 处理导入设置
  const handleImport = () => {
    if (importSettings(importData)) {
      setImportData('')
      toast({
        title: '设置已导入',
        description: '设置已成功导入并应用',
        status: 'success',
        duration: 3000,
        isClosable: true
      })
    } else {
      toast({
        title: '导入失败',
        description: '设置数据格式无效',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>设置</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* AI设置 */}
            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={4}>
                AI功能设置
              </Text>
              
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>OpenRouter API密钥</FormLabel>
                  <HStack>
                    <Input
                      type={showApiKey ? 'text' : 'password'}
                      value={settings.openrouterApiKey}
                      onChange={(e) => handleApiKeyChange(e.target.value)}
                      placeholder="sk-or-v1-..."
                    />
                    <Button
                      size="sm"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? '隐藏' : '显示'}
                    </Button>
                  </HStack>
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    用于AI功能，如润色、改写和标签生成
                  </Text>
                </FormControl>
                
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="enable-ai" mb="0">
                    启用AI功能
                  </FormLabel>
                  <Switch
                    id="enable-ai"
                    isChecked={settings.enableAI}
                    onChange={(e) => updateSetting('enableAI', e.target.checked)}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>AI模型选择</FormLabel>
                  <Select
                    value={settings.aiModel}
                    onChange={(e) => updateSetting('aiModel', e.target.value as any)}
                    isDisabled={!settings.enableAI}
                  >
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo 🚀</option>
                    <option value="gpt-4">GPT-4 🧠</option>
                    <option value="gpt-4-turbo">GPT-4 Turbo ⚡</option>
                    <option value="claude-3-haiku">Claude 3 Haiku 🎋</option>
                    <option value="claude-3-sonnet">Claude 3 Sonnet 🎼</option>
                    <option value="claude-3-opus">Claude 3 Opus 🎭</option>
                  </Select>
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    选择用于AI功能的模型，不同模型有不同的特点和性能
                  </Text>
                </FormControl>
                
                {!settings.openrouterApiKey && (
                  <Alert status="warning" size="sm">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>需要API密钥</AlertTitle>
                      <AlertDescription>
                        请配置OpenRouter API密钥以使用AI功能
                      </AlertDescription>
                    </Box>
                  </Alert>
                )}
              </VStack>
            </Box>
            
            <Divider />
            
            {/* 外观设置 */}
            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={4}>
                外观设置
              </Text>
              
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>主题风格</FormLabel>
                  <Select
                    value={settings.themeStyle}
                    onChange={(e) => updateSetting('themeStyle', e.target.value as any)}
                  >
                    <option value="oceanBreeze">海洋微风 🌊</option>
                    <option value="freshBlue">清新蓝调 💙</option>
                    <option value="sunsetGlow">夕阳暖光 🌅</option>
                    <option value="mintGreen">薄荷清香 🌿</option>
                    <option value="lavender">薰衣草紫 💜</option>
                    <option value="warmOrange">温暖橙色 🧡</option>
                    <option value="default">经典灰调 ⚪</option>
                  </Select>
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    选择您喜欢的视觉风格，让记事本更加个性化
                  </Text>
                </FormControl>
                
                <FormControl>
                  <FormLabel>字体大小</FormLabel>
                  <Select
                    value={settings.fontSize}
                    onChange={(e) => updateSetting('fontSize', e.target.value as 'small' | 'medium' | 'large')}
                  >
                    <option value="small">小</option>
                    <option value="medium">中</option>
                    <option value="large">大</option>
                  </Select>
                </FormControl>
                
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="auto-save" mb="0">
                    自动保存
                  </FormLabel>
                  <Switch
                    id="auto-save"
                    isChecked={settings.autoSave}
                    onChange={(e) => updateSetting('autoSave', e.target.checked)}
                  />
                </FormControl>
                
                {settings.autoSave && (
                  <FormControl>
                    <FormLabel>自动保存间隔（秒）</FormLabel>
                    <NumberInput
                      value={settings.autoSaveInterval}
                      onChange={(_, value) => updateSetting('autoSaveInterval', value)}
                      min={5}
                      max={300}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                )}
                
                <FormControl display="flex" alignItems="center">
                  <FormLabel htmlFor="show-word-count" mb="0">
                    显示字数统计
                  </FormLabel>
                  <Switch
                    id="show-word-count"
                    isChecked={settings.showWordCount}
                    onChange={(e) => updateSetting('showWordCount', e.target.checked)}
                  />
                </FormControl>
              </VStack>
            </Box>
            
            <Divider />
            
            {/* 笔记设置 */}
            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={4}>
                笔记设置
              </Text>
              
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>默认分类</FormLabel>
                  <Input
                    value={settings.defaultCategory}
                    onChange={(e) => updateSetting('defaultCategory', e.target.value)}
                    placeholder="默认"
                  />
                </FormControl>
              </VStack>
            </Box>
            
            <Divider />
            
            {/* 数据管理 */}
            <Box>
              <Text fontSize="lg" fontWeight="semibold" mb={4}>
                数据管理
              </Text>
              
              <VStack spacing={4} align="stretch">
                <HStack>
                  <Button onClick={handleExport} variant="outline">
                    导出设置
                  </Button>
                  <Button onClick={handleReset} colorScheme="red" variant="outline">
                    重置设置
                  </Button>
                </HStack>
                
                <FormControl>
                  <FormLabel>导入设置</FormLabel>
                  <Textarea
                    value={importData}
                    onChange={(e) => setImportData(e.target.value)}
                    placeholder="粘贴设置JSON数据..."
                    rows={4}
                  />
                  <Button
                    mt={2}
                    onClick={handleImport}
                    isDisabled={!importData.trim()}
                    size="sm"
                  >
                    导入
                  </Button>
                </FormControl>
              </VStack>
            </Box>
          </VStack>
        </ModalBody>
        
        <ModalFooter>
          <Button onClick={onClose}>
            关闭
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default SettingsModal