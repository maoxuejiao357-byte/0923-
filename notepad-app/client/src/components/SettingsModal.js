import React, { useState, useEffect } from 'react';
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
  Select,
  Switch,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  InputGroup,
  InputRightElement,
  IconButton,
  Tooltip
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon, CheckIcon } from '@chakra-ui/icons';
import { useSettings } from '../context/SettingsContext';
import { settingsAPI } from '../services/api';

function SettingsModal({ isOpen, onClose }) {
  const {
    apiKey,
    theme,
    editorSettings,
    aiSettings,
    setApiKey,
    setTheme,
    updateEditorSettings,
    updateAISettings
  } = useSettings();
  
  const [localApiKey, setLocalApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTestingApiKey, setIsTestingApiKey] = useState(false);
  const [apiKeyValid, setApiKeyValid] = useState(null);
  const [localEditorSettings, setLocalEditorSettings] = useState(editorSettings);
  const [localAISettings, setLocalAISettings] = useState(aiSettings);
  const toast = useToast();

  // 初始化本地状态
  useEffect(() => {
    if (isOpen) {
      setLocalApiKey(apiKey || '');
      setLocalEditorSettings(editorSettings);
      setLocalAISettings(aiSettings);
      setApiKeyValid(null);
    }
  }, [isOpen, apiKey, editorSettings, aiSettings]);

  // 测试API密钥
  const testApiKey = async () => {
    if (!localApiKey.trim()) {
      toast({
        title: '请输入API密钥',
        status: 'warning',
        duration: 2000
      });
      return;
    }

    try {
      setIsTestingApiKey(true);
      await settingsAPI.testApiKey(localApiKey);
      setApiKeyValid(true);
      toast({
        title: 'API密钥验证成功',
        status: 'success',
        duration: 2000
      });
    } catch (error) {
      setApiKeyValid(false);
      toast({
        title: 'API密钥验证失败',
        description: error.message,
        status: 'error',
        duration: 3000
      });
    } finally {
      setIsTestingApiKey(false);
    }
  };

  // 保存设置
  const handleSave = () => {
    // 保存API密钥
    if (localApiKey !== apiKey) {
      setApiKey(localApiKey);
    }

    // 保存编辑器设置
    updateEditorSettings(localEditorSettings);

    // 保存AI设置
    updateAISettings(localAISettings);

    toast({
      title: '设置已保存',
      status: 'success',
      duration: 2000
    });

    onClose();
  };

  // 重置设置
  const handleReset = () => {
    setLocalApiKey(apiKey || '');
    setLocalEditorSettings(editorSettings);
    setLocalAISettings(aiSettings);
    setApiKeyValid(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>应用设置</ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <Tabs>
            <TabList>
              <Tab>API设置</Tab>
              <Tab>编辑器</Tab>
              <Tab>AI配置</Tab>
              <Tab>通用</Tab>
            </TabList>
            
            <TabPanels>
              {/* API设置 */}
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <Alert status="info">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>OpenAI API密钥</AlertTitle>
                      <AlertDescription>
                        需要有效的OpenAI API密钥才能使用AI功能。密钥将安全存储在本地。
                      </AlertDescription>
                    </Box>
                  </Alert>
                  
                  <FormControl>
                    <FormLabel>API密钥</FormLabel>
                    <InputGroup>
                      <Input
                        type={showApiKey ? 'text' : 'password'}
                        placeholder="sk-..."
                        value={localApiKey}
                        onChange={(e) => {
                          setLocalApiKey(e.target.value);
                          setApiKeyValid(null);
                        }}
                      />
                      <InputRightElement>
                        <IconButton
                          icon={showApiKey ? <ViewOffIcon /> : <ViewIcon />}
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowApiKey(!showApiKey)}
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>
                  
                  <HStack>
                    <Button
                      size="sm"
                      onClick={testApiKey}
                      isLoading={isTestingApiKey}
                      loadingText="测试中"
                      isDisabled={!localApiKey.trim()}
                    >
                      测试连接
                    </Button>
                    
                    {apiKeyValid === true && (
                      <HStack color="green.500">
                        <CheckIcon />
                        <Text fontSize="sm">验证成功</Text>
                      </HStack>
                    )}
                    
                    {apiKeyValid === false && (
                      <Text fontSize="sm" color="red.500">
                        验证失败
                      </Text>
                    )}
                  </HStack>
                  
                  <Text fontSize="xs" color="gray.500">
                    获取API密钥：访问 https://platform.openai.com/api-keys
                  </Text>
                </VStack>
              </TabPanel>
              
              {/* 编辑器设置 */}
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel>字体大小: {localEditorSettings.fontSize}px</FormLabel>
                    <Slider
                      value={localEditorSettings.fontSize}
                      onChange={(value) => setLocalEditorSettings({
                        ...localEditorSettings,
                        fontSize: value
                      })}
                      min={12}
                      max={24}
                      step={1}
                    >
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>行高: {localEditorSettings.lineHeight}</FormLabel>
                    <Slider
                      value={localEditorSettings.lineHeight}
                      onChange={(value) => setLocalEditorSettings({
                        ...localEditorSettings,
                        lineHeight: value
                      })}
                      min={1.0}
                      max={2.0}
                      step={0.1}
                    >
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                  </FormControl>
                  
                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb="0">自动换行</FormLabel>
                    <Switch
                      isChecked={localEditorSettings.wordWrap}
                      onChange={(e) => setLocalEditorSettings({
                        ...localEditorSettings,
                        wordWrap: e.target.checked
                      })}
                    />
                  </FormControl>
                </VStack>
              </TabPanel>
              
              {/* AI配置 */}
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel>AI模型</FormLabel>
                    <Select
                      value={localAISettings.model}
                      onChange={(e) => setLocalAISettings({
                        ...localAISettings,
                        model: e.target.value
                      })}
                    >
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                      <option value="gpt-4">GPT-4</option>
                      <option value="gpt-4-turbo">GPT-4 Turbo</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>创造性: {localAISettings.temperature}</FormLabel>
                    <Slider
                      value={localAISettings.temperature}
                      onChange={(value) => setLocalAISettings({
                        ...localAISettings,
                        temperature: value
                      })}
                      min={0}
                      max={1}
                      step={0.1}
                    >
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                    <HStack justify="space-between" mt={1}>
                      <Text fontSize="xs" color="gray.500">保守</Text>
                      <Text fontSize="xs" color="gray.500">创新</Text>
                    </HStack>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>最大令牌数</FormLabel>
                    <Select
                      value={localAISettings.maxTokens}
                      onChange={(e) => setLocalAISettings({
                        ...localAISettings,
                        maxTokens: parseInt(e.target.value)
                      })}
                    >
                      <option value={500}>500</option>
                      <option value={1000}>1000</option>
                      <option value={2000}>2000</option>
                      <option value={4000}>4000</option>
                    </Select>
                  </FormControl>
                </VStack>
              </TabPanel>
              
              {/* 通用设置 */}
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel>主题</FormLabel>
                    <Select
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                    >
                      <option value="light">浅色</option>
                      <option value="dark">深色</option>
                      <option value="system">跟随系统</option>
                    </Select>
                  </FormControl>
                  
                  <Divider />
                  
                  <Alert status="warning">
                    <AlertIcon />
                    <Box>
                      <AlertTitle>数据存储</AlertTitle>
                      <AlertDescription>
                        所有数据都存储在浏览器本地，不会上传到服务器。
                      </AlertDescription>
                    </Box>
                  </Alert>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>
        
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleReset}>
            重置
          </Button>
          <Button colorScheme="blue" onClick={handleSave}>
            保存设置
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default SettingsModal;