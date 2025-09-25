import React, { useState } from 'react';
import { Box, VStack, HStack, Text, IconButton, Input, Tag, useToast } from '@chakra-ui/react';
import { DeleteIcon, EditIcon, SearchIcon } from '@chakra-ui/icons';
import { useNotes } from '../../context/NotesContext';

const SimpleNotesList: React.FC = () => {
  const { notes, deleteNote, loading, searchQuery, setSearchQuery } = useNotes();
  const toast = useToast();
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    setSearchQuery(value);
  };

  const handleDeleteNote = async (noteId: string) => {
    if (window.confirm('确定要删除这个笔记吗？')) {
      try {
        await deleteNote(noteId);
        toast({
          title: '笔记已删除',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: '删除失败',
          description: error instanceof Error ? error.message : '未知错误',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const filteredNotes = notes.filter(note => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query) ||
      (note.tags && note.tags.some(tag => tag.toLowerCase().includes(query)))
    );
  });

  if (loading) {
    return (
      <Box p={4} textAlign="center">
        <Text>加载中...</Text>
      </Box>
    );
  }

  return (
    <Box h="100%" display="flex" flexDirection="column">
      {/* 搜索栏 */}
      <Box p={4} borderBottom="1px" borderColor="gray.200">
        <HStack>
          <Input
            placeholder="搜索笔记..."
            value={localSearch}
            onChange={handleSearchChange}
            size="sm"
          />
          <SearchIcon color="gray.500" />
        </HStack>
      </Box>

      {/* 笔记列表 */}
      <Box flex={1} overflowY="auto" p={4}>
        {filteredNotes.length === 0 ? (
          <Box textAlign="center" py={8}>
            <Text color="gray.500">
              {searchQuery ? '没有找到匹配的笔记' : '暂无笔记，开始创建第一个笔记吧！'}
            </Text>
          </Box>
        ) : (
          <VStack spacing={3} align="stretch">
            {filteredNotes.map((note) => (
              <Box
                key={note.id}
                p={3}
                border="1px"
                borderColor="gray.200"
                borderRadius="md"
                _hover={{ bg: 'gray.50' }}
                cursor="pointer"
                onClick={() => {
                  // 这里可以添加选择笔记的逻辑
                  console.log('Selected note:', note.id);
                }}
              >
                <HStack justify="space-between" align="start">
                  <Box flex={1}>
                    <Text fontWeight="bold" noOfLines={1}>
                      {note.title || '无标题'}
                    </Text>
                    <Text fontSize="sm" color="gray.600" noOfLines={2}>
                      {note.content || '无内容'}
                    </Text>
                    <HStack spacing={1} mt={2} flexWrap="wrap">
                      {note.tags?.map((tag) => (
                        <Tag key={tag} size="sm" colorScheme="teal">
                          {tag}
                        </Tag>
                      ))}
                    </HStack>
                    <Text fontSize="xs" color="gray.500" mt={1}>
                      {new Date(note.updatedAt).toLocaleString()}
                    </Text>
                  </Box>
                  <HStack spacing={1}>
                    <IconButton
                      aria-label="编辑笔记"
                      icon={<EditIcon />}
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('Edit note:', note.id);
                      }}
                    />
                    <IconButton
                      aria-label="删除笔记"
                      icon={<DeleteIcon />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNote(note.id);
                      }}
                    />
                  </HStack>
                </HStack>
              </Box>
            ))}
          </VStack>
        )}
      </Box>
    </Box>
  );
};

export default SimpleNotesList;