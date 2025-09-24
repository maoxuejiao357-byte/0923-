import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Textarea,
  Select,
  IconButton,
  Divider,
  Badge,
  useColorModeValue,
  useToast,
  Collapse,
  Spinner,
  Alert,
  AlertIcon,
  Tooltip
} from '@chakra-ui/react';
import {
  CloseIcon,
  EditIcon,
  RepeatIcon,
  StarIcon,
  SearchIcon,
  CopyIcon,
  CheckIcon
} from '@chakra-ui/icons';
import { useNotes } from '../context/NotesContext';
import { useSettings } from '../context/SettingsContext';
import { aiAPI } from '../services/api';

function AIPanel({ selectedNoteId, onClose }) {
  const { notes, updateNote } = useNotes();
  const { apiKey, isApiKeySet } = useSettings();
  const toast = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [aiResult, setAiResult] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const [rewriteStyle, setRewriteStyle] = useState('formal');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeFunction, setActiveFunction] = useState(null);
  const [copied, setCopied] = useState(false);
  
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const searchResultBg = useColorModeValue('gray.50', 'gray.700');
  const searchResultHoverBg = useColorModeValue('gray.100', 'gray.600');

  // 获取当前笔记
  const currentNote = notes.find(note => note.id === selectedNoteId);

  // 检查API密钥
  const checkApiKey = () => {
    if (!isApiKeySet()) {
      toast({
        title: '请先设置API密钥',
        description: '在设置中配置OpenAI API密钥后再使用AI功能',
        status: 'warning',
        duration: 3000
      });
      return false;
    }
    return true;
  };

  // 内容润色
  const handlePolish = async () => {
    if (!checkApiKey() || !currentNote?.content) return;
    
    try {
      setIsLoading(true);
      setActiveFunction('polish');
      const result = await aiAPI.polish(currentNote.content, apiKey);
      setAiResult(result.polishedContent);
      toast({
        title: '内容润色完成',
        status: 'success',
        duration: 2000
      });
    } catch (error) {
      toast({
        title: '润色失败',
        description: error.message,
        status: 'error',
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 内容改写
  const handleRewrite = async () => {
    if (!checkApiKey() || !currentNote?.content) return;
    
    try {
      setIsLoading(true);
      setActiveFunction('rewrite');
      const result = await aiAPI.rewrite(currentNote.content, rewriteStyle, apiKey);
      setAiResult(result.rewrittenContent);
      toast({
        title: '内容改写完成',
        status: 'success',
        duration: 2000
      });
    } catch (error) {
      toast({
        title: '改写失败',
        description: error.message,
        status: 'error',
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 生成标签
  const handleGenerateTags = async () => {
    if (!checkApiKey() || !currentNote?.content) return;
    
    try {
      setIsLoading(true);
      setActiveFunction('tags');
      const result = await aiAPI.generateTags(currentNote.content, apiKey);
      
      // 更新笔记标签
      const newTags = [...new Set([...(currentNote.tags || []), ...result.tags])];
      await updateNote(selectedNoteId, {
        ...currentNote,
        tags: newTags
      });
      
      setAiResult(`生成的标签: ${result.tags.join(', ')}`);
      toast({
        title: '标签生成完成',
        description: `添加了 ${result.tags.length} 个新标签`,
        status: 'success',
        duration: 2000
      });
    } catch (error) {
      toast({
        title: '标签生成失败',
        description: error.message,
        status: 'error',
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 语义搜索
  const handleSemanticSearch = async () => {
    if (!checkApiKey() || !searchQuery.trim()) return;
    
    try {
      setIsLoading(true);
      setActiveFunction('search');
      const result = await aiAPI.semanticSearch(searchQuery, notes, apiKey);
      setSearchResults(result.results);
      setAiResult(`找到 ${result.results.length} 个相关笔记`);
      toast({
        title: '语义搜索完成',
        status: 'success',
        duration: 2000
      });
    } catch (error) {
      toast({
        title: '搜索失败',
        description: error.message,
        status: 'error',
        duration: 3000
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 应用AI结果到笔记
  const applyResult = async () => {
    if (!aiResult || !currentNote) return;
    
    try {
      await updateNote(selectedNoteId, {
        ...currentNote,
        content: aiResult,
        updatedAt: new Date().toISOString()
      });
      toast({
        title: 'AI结果已应用',
        status: 'success',
        duration: 2000
      });
      setAiResult('');
    } catch (error) {
      toast({
        title: '应用失败',
        description: error.message,
        status: 'error',
        duration: 3000
      });
    }
  };

  // 复制结果
  const copyResult = () => {
    navigator.clipboard.writeText(aiResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: '已复制到剪贴板',
      status: 'success',
      duration: 1000
    });
  };

  return (
    <Box h="100%" bg={bgColor} display="flex" flexDirection="column">
      {/* 头部 */}
      <Box p={4} borderBottom="1px" borderColor={borderColor}>
        <HStack justify="space-between">
          <Text fontSize="lg" fontWeight="bold" color={textColor}>
            AI助手
          </Text>
          <IconButton
            icon={<CloseIcon />}
            size="sm"
            variant="ghost"
            onClick={onClose}
          />
        </HStack>
      </Box>

      {/* API密钥检查 */}
      {!isApiKeySet() && (
        <Box p={4}>
          <Alert status="warning" size="sm">
            <AlertIcon />
            <Text fontSize="sm">请先在设置中配置OpenAI API密钥</Text>
          </Alert>
        </Box>
      )}

      {/* 功能区 */}
      <Box flex="1" overflowY="auto" p={4}>
        <VStack spacing={4} align="stretch">
          {/* 内容优化 */}
          <Box bg={cardBg} p={4} borderRadius="md" border="1px" borderColor={borderColor}>
            <Text fontWeight="semibold" mb={3} color={textColor}>
              内容优化
            </Text>
            <VStack spacing={2}>
              <Button
                leftIcon={<StarIcon />}
                size="sm"
                width="100%"
                onClick={handlePolish}
                isLoading={isLoading && activeFunction === 'polish'}
                isDisabled={!currentNote?.content || !isApiKeySet()}
              >
                内容润色
              </Button>
              
              <HStack width="100%">
                <Select
                  size="sm"
                  value={rewriteStyle}
                  onChange={(e) => setRewriteStyle(e.target.value)}
                  flex="1"
                >
                  <option value="formal">正式</option>
                  <option value="casual">随意</option>
                  <option value="academic">学术</option>
                  <option value="creative">创意</option>
                </Select>
                <Button
                  leftIcon={<RepeatIcon />}
                  size="sm"
                  onClick={handleRewrite}
                  isLoading={isLoading && activeFunction === 'rewrite'}
                  isDisabled={!currentNote?.content || !isApiKeySet()}
                >
                  改写
                </Button>
              </HStack>
            </VStack>
          </Box>

          {/* 标签生成 */}
          <Box bg={cardBg} p={4} borderRadius="md" border="1px" borderColor={borderColor}>
            <Text fontWeight="semibold" mb={3} color={textColor}>
              智能标签
            </Text>
            <Button
              leftIcon={<EditIcon />}
              size="sm"
              width="100%"
              onClick={handleGenerateTags}
              isLoading={isLoading && activeFunction === 'tags'}
              isDisabled={!currentNote?.content || !isApiKeySet()}
            >
              生成标签
            </Button>
          </Box>

          {/* 语义搜索 */}
          <Box bg={cardBg} p={4} borderRadius="md" border="1px" borderColor={borderColor}>
            <Text fontWeight="semibold" mb={3} color={textColor}>
              语义搜索
            </Text>
            <VStack spacing={2}>
              <Textarea
                placeholder="输入搜索查询..."
                size="sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                rows={2}
              />
              <Button
                leftIcon={<SearchIcon />}
                size="sm"
                width="100%"
                onClick={handleSemanticSearch}
                isLoading={isLoading && activeFunction === 'search'}
                isDisabled={!searchQuery.trim() || !isApiKeySet()}
              >
                智能搜索
              </Button>
            </VStack>
            
            {/* 搜索结果 */}
            {searchResults.length > 0 && (
              <Box mt={3}>
                <Text fontSize="sm" fontWeight="medium" mb={2} color={textColor}>
                  搜索结果:
                </Text>
                <VStack spacing={1} align="stretch">
                  {searchResults.slice(0, 5).map((result, index) => (
                    <Box
                      key={index}
                      p={2}
                      bg={searchResultBg}
                      borderRadius="sm"
                      cursor="pointer"
                      _hover={{ bg: searchResultHoverBg }}
                    >
                      <Text fontSize="xs" fontWeight="medium" noOfLines={1}>
                        {result.title}
                      </Text>
                      <Text fontSize="10px" color={mutedColor} noOfLines={2}>
                        {result.content.substring(0, 100)}...
                      </Text>
                      <Badge size="sm" colorScheme="blue">
                        相似度: {Math.round(result.similarity * 100)}%
                      </Badge>
                    </Box>
                  ))}
                </VStack>
              </Box>
            )}
          </Box>

          {/* AI结果显示 */}
          <Collapse in={!!aiResult}>
            <Box bg={cardBg} p={4} borderRadius="md" border="1px" borderColor={borderColor}>
              <HStack justify="space-between" mb={3}>
                <Text fontWeight="semibold" color={textColor}>
                  AI结果
                </Text>
                <HStack>
                  <Tooltip label={copied ? '已复制' : '复制'}>
                    <IconButton
                      icon={copied ? <CheckIcon /> : <CopyIcon />}
                      size="xs"
                      variant="ghost"
                      onClick={copyResult}
                      colorScheme={copied ? 'green' : 'gray'}
                    />
                  </Tooltip>
                </HStack>
              </HStack>
              
              <Textarea
                value={aiResult}
                onChange={(e) => setAiResult(e.target.value)}
                size="sm"
                rows={6}
                resize="vertical"
              />
              
              <HStack mt={3} spacing={2}>
                <Button
                  size="sm"
                  colorScheme="blue"
                  onClick={applyResult}
                  flex="1"
                >
                  应用到笔记
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setAiResult('')}
                >
                  清除
                </Button>
              </HStack>
            </Box>
          </Collapse>
        </VStack>
      </Box>

      {/* 加载状态 */}
      {isLoading && (
        <Box p={4} borderTop="1px" borderColor={borderColor}>
          <HStack>
            <Spinner size="sm" />
            <Text fontSize="sm" color={mutedColor}>
              AI正在处理中...
            </Text>
          </HStack>
        </Box>
      )}
    </Box>
  );
}

export default AIPanel;