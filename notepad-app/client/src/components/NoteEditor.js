import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  VStack,
  HStack,
  Input,
  Textarea,
  Text,
  Button,
  IconButton,
  Badge,
  useColorModeValue,
  useToast,
  Tooltip,
  Divider,
  Flex,
  Tag,
  TagLabel,
  TagCloseButton,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react';
import {
  AddIcon,
  TimeIcon,
  EditIcon,
  CheckIcon
} from '@chakra-ui/icons';
import { useNotes } from '../context/NotesContext';
import { useSettings } from '../context/SettingsContext';

function NoteEditor({ selectedNoteId, onSelectNote }) {
  const { notes, updateNote, createNote } = useNotes();
  const { editorSettings } = useSettings();
  const toast = useToast();
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const placeholderColor = useColorModeValue('gray.400', 'gray.500');

  // 获取当前选中的笔记
  const currentNote = notes.find(note => note.id === selectedNoteId);

  // 加载笔记内容
  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title || '');
      setContent(currentNote.content || '');
      setTags(currentNote.tags || []);
      setHasUnsavedChanges(false);
      setLastSaved(currentNote.updatedAt);
    } else {
      setTitle('');
      setContent('');
      setTags([]);
      setHasUnsavedChanges(false);
      setLastSaved(null);
    }
  }, [currentNote]);

  // 自动保存
  const autoSave = useCallback(async () => {
    if (!selectedNoteId || !hasUnsavedChanges) return;
    
    try {
      setIsAutoSaving(true);
      await updateNote(selectedNoteId, {
        title: title || '无标题',
        content,
        tags
      });
      setHasUnsavedChanges(false);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto save failed:', error);
    } finally {
      setIsAutoSaving(false);
    }
  }, [selectedNoteId, title, content, tags, hasUnsavedChanges, updateNote]);

  // 自动保存定时器
  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasUnsavedChanges) {
        autoSave();
      }
    }, 2000); // 2秒后自动保存

    return () => clearTimeout(timer);
  }, [hasUnsavedChanges, autoSave]);

  // 手动保存
  const handleSave = async () => {
    if (!selectedNoteId) {
      // 创建新笔记
      try {
        const newNote = await createNote({
          title: title || '新笔记',
          content,
          tags
        });
        onSelectNote(newNote.id);
        toast({
          title: '笔记已创建',
          status: 'success',
          duration: 2000
        });
      } catch (error) {
        toast({
          title: '创建失败',
          description: error.message,
          status: 'error',
          duration: 3000
        });
      }
    } else {
      // 更新现有笔记
      try {
        await updateNote(selectedNoteId, {
          title: title || '无标题',
          content,
          tags
        });
        setHasUnsavedChanges(false);
        setLastSaved(new Date());
        toast({
          title: '笔记已保存',
          status: 'success',
          duration: 2000
        });
      } catch (error) {
        toast({
          title: '保存失败',
          description: error.message,
          status: 'error',
          duration: 3000
        });
      }
    }
  };

  // 处理标题变化
  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setHasUnsavedChanges(true);
  };

  // 处理内容变化
  const handleContentChange = (e) => {
    setContent(e.target.value);
    setHasUnsavedChanges(true);
  };

  // 添加标签
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      setNewTag('');
      setHasUnsavedChanges(true);
    }
  };

  // 删除标签
  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    setHasUnsavedChanges(true);
  };

  // 处理键盘快捷键
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  };

  // 格式化时间
  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleString('zh-CN');
  };

  // 获取字数统计
  const getWordCount = () => {
    return content.length;
  };

  if (!selectedNoteId && notes.length > 0) {
    return (
      <Flex
        h="100%"
        align="center"
        justify="center"
        direction="column"
        bg={bgColor}
        color={mutedColor}
      >
        <EditIcon boxSize={12} mb={4} />
        <Text fontSize="lg" mb={2}>
          选择一个笔记开始编辑
        </Text>
        <Text fontSize="sm">
          或者创建一个新笔记
        </Text>
      </Flex>
    );
  }

  return (
    <Box h="100%" bg={bgColor} display="flex" flexDirection="column">
      {/* 编辑器头部 */}
      <Box p={4} borderBottom="1px" borderColor={borderColor}>
        <VStack spacing={3} align="stretch">
          {/* 标题输入 */}
          <Input
            placeholder="笔记标题..."
            value={title}
            onChange={handleTitleChange}
            onKeyDown={handleKeyDown}
            fontSize="lg"
            fontWeight="semibold"
            border="none"
            _focus={{ boxShadow: 'none' }}
            bg="transparent"
          />
          
          {/* 标签管理 */}
          <Box>
            <HStack spacing={2} wrap="wrap" mb={2}>
              {tags.map((tag, index) => (
                <Tag key={index} size="sm" colorScheme="blue" variant="subtle">
                  <TagLabel>{tag}</TagLabel>
                  <TagCloseButton onClick={() => handleRemoveTag(tag)} />
                </Tag>
              ))}
            </HStack>
            
            <InputGroup size="sm">
              <Input
                placeholder="添加标签..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTag();
                  }
                }}
              />
              <InputRightElement>
                <IconButton
                  icon={<AddIcon />}
                  size="xs"
                  variant="ghost"
                  onClick={handleAddTag}
                  isDisabled={!newTag.trim()}
                />
              </InputRightElement>
            </InputGroup>
          </Box>
          
          {/* 工具栏 */}
          <HStack justify="space-between">
            <HStack spacing={2}>
              <Button
                leftIcon={<CheckIcon />}
                size="sm"
                colorScheme={hasUnsavedChanges ? 'blue' : 'gray'}
                variant={hasUnsavedChanges ? 'solid' : 'ghost'}
                onClick={handleSave}
                isLoading={isAutoSaving}
                loadingText="保存中"
              >
                {hasUnsavedChanges ? '保存' : '已保存'}
              </Button>
              
              {lastSaved && (
                <Tooltip label={`最后保存: ${formatTime(lastSaved)}`}>
                  <HStack spacing={1}>
                    <TimeIcon boxSize={3} color={mutedColor} />
                    <Text fontSize="xs" color={mutedColor}>
                      {formatTime(lastSaved)}
                    </Text>
                  </HStack>
                </Tooltip>
              )}
            </HStack>
            
            <Text fontSize="xs" color={mutedColor}>
              {getWordCount()} 字符
            </Text>
          </HStack>
        </VStack>
      </Box>

      {/* 内容编辑区 */}
      <Box flex="1" p={4}>
        <Textarea
          placeholder="开始写作..."
          value={content}
          onChange={handleContentChange}
          onKeyDown={handleKeyDown}
          resize="none"
          border="none"
          _focus={{ boxShadow: 'none' }}
          h="100%"
          fontSize={editorSettings.fontSize || 14}
          lineHeight={editorSettings.lineHeight || 1.5}
          bg="transparent"
          _placeholder={{ color: placeholderColor }}
        />
      </Box>
    </Box>
  );
}

export default NoteEditor;