import React, { useState, useEffect } from 'react';
import { Box, Textarea, Button, VStack, HStack, Input, Tag, TagLabel, TagCloseButton } from '@chakra-ui/react';
import { useNotes } from '../../context/NotesContext';
import { useSettings } from '../../context/SettingsContext';

interface NoteEditorProps {
  selectedNoteId: string | null;
}

const SimpleNoteEditor: React.FC<NoteEditorProps> = ({ selectedNoteId }) => {
  const { notes, updateNote, createNote } = useNotes();
  const { settings } = useSettings();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const selectedNote = notes.find(note => note.id === selectedNoteId);

  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title || '');
      setContent(selectedNote.content || '');
      setTags(selectedNote.tags || []);
    } else {
      setTitle('');
      setContent('');
      setTags([]);
    }
  }, [selectedNote]);

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) return;

    const noteData = {
      title: title.trim(),
      content: content.trim(),
      tags: tags,
      updatedAt: new Date().toISOString()
    };

    try {
      if (selectedNote) {
        await updateNote(selectedNote.id, noteData);
      } else {
        await createNote({
          ...noteData,
          createdAt: new Date().toISOString()
        });
        // 清空编辑器
        setTitle('');
        setContent('');
        setTags([]);
      }
    } catch (error) {
      console.error('保存失败:', error);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSave();
    }
  };

  return (
    <Box p={4} h="100%" display="flex" flexDirection="column">
      <VStack spacing={4} flex={1}>
        {/* 标题输入 */}
        <Input
          placeholder="输入笔记标题..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          size="lg"
          fontWeight="bold"
        />

        {/* 标签输入 */}
        <HStack spacing={2} w="100%">
          <Input
            placeholder="添加标签..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            size="sm"
          />
          <Button onClick={handleAddTag} size="sm" colorScheme="blue">
            添加
          </Button>
        </HStack>

        {/* 标签显示 */}
        <HStack spacing={2} flexWrap="wrap">
          {tags.map((tag) => (
            <Tag key={tag} size="sm" colorScheme="teal">
              <TagLabel>{tag}</TagLabel>
              <TagCloseButton onClick={() => handleRemoveTag(tag)} />
            </Tag>
          ))}
        </HStack>

        {/* 内容编辑器 */}
        <Box flex={1} w="100%">
          <Textarea
            placeholder="开始写作..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyPress={handleKeyPress}
            h="400px"
            resize="vertical"
            fontSize={settings.fontSize || 14}
            lineHeight="1.6"
          />
        </Box>

        {/* 保存按钮 */}
        <HStack spacing={2} w="100%" justify="flex-end">
          <Button onClick={handleSave} colorScheme="blue" size="sm">
            保存笔记
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default SimpleNoteEditor;