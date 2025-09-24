import React from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  IconButton,
  useColorModeValue,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useDisclosure
} from '@chakra-ui/react';
import { DeleteIcon, TimeIcon } from '@chakra-ui/icons';
import { useNotes } from '../context/NotesContext';

function NoteItem({ note, isSelected, onSelect, onDelete }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef();
  
  const bgColor = useColorModeValue(
    isSelected ? 'blue.50' : 'white',
    isSelected ? 'blue.900' : 'gray.800'
  );
  const borderColor = useColorModeValue(
    isSelected ? 'blue.200' : 'gray.200',
    isSelected ? 'blue.600' : 'gray.700'
  );
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  // 格式化日期
  const formatDate = (date) => {
    const now = new Date();
    const noteDate = new Date(date);
    const diffTime = Math.abs(now - noteDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      return '今天';
    } else if (diffDays === 2) {
      return '昨天';
    } else if (diffDays <= 7) {
      return `${diffDays - 1}天前`;
    } else {
      return noteDate.toLocaleDateString('zh-CN');
    }
  };

  // 获取内容预览
  const getContentPreview = (content) => {
    if (!content) return '无内容';
    const plainText = content.replace(/[#*`_~]/g, '').trim();
    return plainText.length > 50 ? plainText.substring(0, 50) + '...' : plainText;
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onOpen();
  };

  const confirmDelete = () => {
    onDelete(note.id);
    onClose();
  };

  return (
    <>
      <Box
        p={3}
        bg={bgColor}
        border="1px"
        borderColor={borderColor}
        borderRadius="md"
        cursor="pointer"
        transition="all 0.2s"
        _hover={{ bg: isSelected ? bgColor : hoverBg }}
        onClick={() => onSelect(note.id)}
        position="relative"
      >
        <VStack align="stretch" spacing={2}>
          {/* 标题和删除按钮 */}
          <HStack justify="space-between" align="flex-start">
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color={textColor}
              noOfLines={1}
              flex="1"
            >
              {note.title || '无标题'}
            </Text>
            <IconButton
              icon={<DeleteIcon />}
              size="xs"
              variant="ghost"
              colorScheme="red"
              onClick={handleDelete}
              opacity={0.7}
              _hover={{ opacity: 1 }}
            />
          </HStack>

          {/* 内容预览 */}
          <Text
            fontSize="xs"
            color={mutedColor}
            noOfLines={2}
            lineHeight="1.3"
          >
            {getContentPreview(note.content)}
          </Text>

          {/* 标签 */}
          {note.tags && note.tags.length > 0 && (
            <HStack spacing={1} wrap="wrap">
              {note.tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  size="sm"
                  colorScheme="blue"
                  variant="subtle"
                  fontSize="10px"
                >
                  {tag}
                </Badge>
              ))}
              {note.tags.length > 3 && (
                <Badge
                  size="sm"
                  colorScheme="gray"
                  variant="subtle"
                  fontSize="10px"
                >
                  +{note.tags.length - 3}
                </Badge>
              )}
            </HStack>
          )}

          {/* 时间 */}
          <HStack spacing={1} justify="flex-end">
            <TimeIcon boxSize={3} color={mutedColor} />
            <Text fontSize="10px" color={mutedColor}>
              {formatDate(note.updatedAt)}
            </Text>
          </HStack>
        </VStack>
      </Box>

      {/* 删除确认对话框 */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              删除笔记
            </AlertDialogHeader>

            <AlertDialogBody>
              确定要删除笔记 "{note.title || '无标题'}" 吗？此操作无法撤销。
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                取消
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                删除
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

function NotesList({ selectedNoteId, onSelectNote }) {
  const { getFilteredNotes, deleteNote, loading } = useNotes();
  const toast = useToast();
  
  const notes = getFilteredNotes();
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(noteId);
      if (selectedNoteId === noteId) {
        onSelectNote(null);
      }
      toast({
        title: '笔记已删除',
        status: 'success',
        duration: 2000
      });
    } catch (error) {
      toast({
        title: '删除失败',
        description: error.message,
        status: 'error',
        duration: 3000
      });
    }
  };

  if (loading) {
    return (
      <Box p={4} textAlign="center">
        <Text color={mutedColor}>加载中...</Text>
      </Box>
    );
  }

  if (notes.length === 0) {
    return (
      <Box p={4} textAlign="center">
        <Text color={mutedColor} fontSize="sm">
          暂无笔记
        </Text>
        <Text color={mutedColor} fontSize="xs" mt={1}>
          点击上方按钮创建第一个笔记
        </Text>
      </Box>
    );
  }

  return (
    <Box h="100%" overflowY="auto">
      <VStack spacing={2} p={3} align="stretch">
        {notes.map((note) => (
          <NoteItem
            key={note.id}
            note={note}
            isSelected={selectedNoteId === note.id}
            onSelect={onSelectNote}
            onDelete={handleDeleteNote}
          />
        ))}
      </VStack>
      
      {/* 底部统计 */}
      <Box p={3} textAlign="center" borderTop="1px" borderColor="gray.200">
        <Text fontSize="xs" color={mutedColor}>
          共 {notes.length} 个笔记
        </Text>
      </Box>
    </Box>
  );
}

export default NotesList;