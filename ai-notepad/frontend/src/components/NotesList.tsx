import React from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  IconButton,
  useColorModeValue,
  Menu,

  MenuList,
  MenuItem,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button
} from '@chakra-ui/react'
import { useNotes } from '../context/NotesContext'
import { Note } from '../types/note'

interface NoteItemProps {
  note: Note
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
}

const NoteItem: React.FC<NoteItemProps> = ({ note, isSelected, onSelect, onDelete }) => {
  const { isOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef<HTMLButtonElement>(null)
  
  const cardBg = useColorModeValue('rgba(255, 255, 255, 0.7)', 'rgba(45, 55, 72, 0.7)')
  const selectedCardBg = useColorModeValue('rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.2)')
  const bg = isSelected ? selectedCardBg : cardBg
  const borderColor = useColorModeValue(
    'rgba(255, 255, 255, 0.3)',
    'rgba(255, 255, 255, 0.1)'
  )
  const hoverBg = useColorModeValue('rgba(247, 250, 252, 0.8)', 'rgba(45, 55, 72, 0.8)')
  
  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) {
      return '今天'
    } else if (diffDays === 2) {
      return '昨天'
    } else if (diffDays <= 7) {
      return `${diffDays - 1}天前`
    } else {
      return date.toLocaleDateString('zh-CN', {
        month: 'short',
        day: 'numeric'
      })
    }
  }
  
  // 截取内容预览
  const getContentPreview = (content: string) => {
    const plainText = content.replace(/<[^>]*>/g, '').replace(/\n/g, ' ')
    return plainText.length > 60 ? plainText.substring(0, 60) + '...' : plainText
  }
  
  return (
    <>
      <Box
        p={4}
        m={2}
        bg={bg}
        borderRadius="xl"
        border="1px solid"
        borderColor={borderColor}
        cursor="pointer"
        onClick={onSelect}
        _hover={{ 
          bg: isSelected ? bg : hoverBg,
          transform: 'translateY(-2px)',
          boxShadow: 'lg'
        }}
        transition="all 0.3s ease"
        backdropFilter="blur(10px)"
        boxShadow={isSelected ? 'md' : 'sm'}
        position="relative"
        _before={isSelected ? {
          content: '""',
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '4px',
          bg: 'blue.400',
          borderRadius: 'full'
        } : {}}
      >
        <VStack align="stretch" spacing={2}>
          {/* 标题和操作按钮 */}
          <HStack justify="space-between" align="flex-start">
            <VStack align="stretch" spacing={1} flex={1}>
              <HStack>
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color={useColorModeValue('gray.800', 'gray.100')}
                  noOfLines={1}
                >
                  {note.title || '无标题'}
                </Text>
                {note.isPinned && (
                  <Badge size="sm" colorScheme="yellow" variant="subtle">
                    📌
                  </Badge>
                )}
              </HStack>
              
              {/* 内容预览 */}
              {note.content && (
                <Text
                  fontSize="xs"
                  color={useColorModeValue('gray.600', 'gray.400')}
                  noOfLines={2}
                  lineHeight="1.3"
                >
                  {getContentPreview(note.content)}
                </Text>
              )}
            </VStack>
            
            {/* 操作菜单 */}
            <Menu>
              <Button
                as={IconButton}
                icon={<Text fontSize="xs">⋯</Text>}
                variant="ghost"
                size="xs"
                aria-label="操作"
                onClick={(e) => e.stopPropagation()}
              />
              <MenuList>
                <MenuItem onClick={onDelete}>
                  删除
                </MenuItem>
                <MenuItem>
                  {note.isPinned ? '取消置顶' : '置顶'}
                </MenuItem>
                <MenuItem>
                  {note.isArchived ? '取消归档' : '归档'}
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
          
          {/* 标签 */}
          {note.tags.length > 0 && (
            <HStack spacing={1} flexWrap="wrap">
              {note.tags.slice(0, 3).map((tag, index) => (
                <Badge
                  key={index}
                  size="sm"
                  colorScheme="blue"
                  variant="subtle"
                  fontSize="xs"
                >
                  {tag}
                </Badge>
              ))}
              {note.tags.length > 3 && (
                <Badge size="sm" variant="subtle" fontSize="xs">
                  +{note.tags.length - 3}
                </Badge>
              )}
            </HStack>
          )}
          
          {/* 日期 */}
          <Text
            fontSize="xs"
            color={useColorModeValue('gray.500', 'gray.500')}
          >
            {formatDate(note.updatedAt)}
          </Text>
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
              <Button
                colorScheme="red"
                onClick={() => {
                  onDelete()
                  onClose()
                }}
                ml={3}
              >
                删除
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

const NotesList: React.FC = () => {
  const { filteredNotes, selectedNoteId, selectNote, deleteNote } = useNotes()
  const bg = useColorModeValue('rgba(248, 250, 252, 0.9)', 'rgba(45, 55, 72, 0.9)')
  const emptyTextColor = useColorModeValue('gray.600', 'gray.400')
  const headerBorderColor = useColorModeValue('rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)')
  const headerBg = useColorModeValue('rgba(255, 255, 255, 0.8)', 'rgba(26, 32, 44, 0.8)')
  const headerTextColor = useColorModeValue('gray.700', 'gray.300')
  
  const handleDeleteNote = async (noteId: string) => {
    await deleteNote(noteId)
  }
  
  if (filteredNotes.length === 0) {
    return (
      <Box
        h="100%"
        bg={bg}
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={8}
        borderRadius="xl"
        backdropFilter="blur(10px)"
        border="1px solid"
        borderColor={headerBorderColor}
      >
        <VStack spacing={4}>
          <Text fontSize="lg" color={emptyTextColor}>
            📝
          </Text>
          <Text
            fontSize="sm"
            color={emptyTextColor}
            textAlign="center"
          >
            暂无笔记
            <br />
            点击"新建笔记"开始记录
          </Text>
        </VStack>
      </Box>
    )
  }
  
  return (
    <Box 
      h="100%" 
      bg={bg} 
      overflowY="auto"
      borderRadius="xl"
      backdropFilter="blur(10px)"
      border="1px solid"
      borderColor={headerBorderColor}
    >
      <VStack spacing={0} align="stretch">
        {/* 列表头部 */}
        <Box
          p={4}
          bg={headerBg}
          borderTopRadius="xl"
          borderBottom="1px solid"
          borderBottomColor={headerBorderColor}
          backdropFilter="blur(10px)"
        >
          <Text fontSize="sm" fontWeight="medium" color={headerTextColor}>
            笔记列表 ({filteredNotes.length})
          </Text>
        </Box>
        
        {/* 笔记列表 */}
        {filteredNotes.map((note) => (
          <NoteItem
            key={note.id}
            note={{
              ...note,
              isPinned: false,
              isArchived: false
            }}
            isSelected={note.id === selectedNoteId}
            onSelect={() => selectNote(note.id)}
            onDelete={() => handleDeleteNote(note.id)}
          />
        ))}
      </VStack>
    </Box>
  )
}

export default NotesList