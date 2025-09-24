import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Badge,
  useColorModeValue,
  useToast,
  Tooltip,
  Divider
} from '@chakra-ui/react';
import {
  AddIcon,
  SearchIcon,
  SettingsIcon,
  ViewIcon,
  ViewOffIcon
} from '@chakra-ui/icons';
import { useNotes } from '../context/NotesContext';
import NotesList from './NotesList';
import TagsList from './TagsList';
import SettingsModal from './SettingsModal';

function Sidebar({ selectedNoteId, onSelectNote, onToggleAIPanel }) {
  const {
    createNote,
    searchNotes,
    filterByTags,
    searchQuery,
    selectedTags,
    loading
  } = useNotes();
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const toast = useToast();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');

  // 创建新笔记
  const handleCreateNote = async () => {
    try {
      const newNote = await createNote({
        title: '新笔记',
        content: ''
      });
      onSelectNote(newNote.id);
      toast({
        title: '笔记创建成功',
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
  };

  // 处理搜索
  const handleSearch = (value) => {
    setSearchInput(value);
    searchNotes(value);
  };

  // 清除搜索
  const clearSearch = () => {
    setSearchInput('');
    searchNotes('');
  };

  // 清除标签筛选
  const clearTagFilter = () => {
    filterByTags([]);
  };

  return (
    <Box h="100%" bg={bgColor} display="flex" flexDirection="column">
      {/* 顶部工具栏 */}
      <Box p={4} borderBottom="1px" borderColor={borderColor}>
        <HStack justify="space-between" mb={3}>
          <Text fontSize="lg" fontWeight="bold" color={textColor}>
            AI记事本
          </Text>
          <HStack spacing={1}>
            <Tooltip label="切换AI面板">
              <IconButton
                icon={<ViewIcon />}
                size="sm"
                variant="ghost"
                onClick={onToggleAIPanel}
              />
            </Tooltip>
            <Tooltip label="设置">
              <IconButton
                icon={<SettingsIcon />}
                size="sm"
                variant="ghost"
                onClick={() => setIsSettingsOpen(true)}
              />
            </Tooltip>
          </HStack>
        </HStack>
        
        {/* 新建笔记按钮 */}
        <Button
          leftIcon={<AddIcon />}
          colorScheme="blue"
          size="sm"
          width="100%"
          onClick={handleCreateNote}
          isLoading={loading}
        >
          新建笔记
        </Button>
      </Box>

      {/* 搜索栏 */}
      <Box p={4} borderBottom="1px" borderColor={borderColor}>
        <HStack>
          <Input
            placeholder="搜索笔记..."
            size="sm"
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <IconButton
            icon={<SearchIcon />}
            size="sm"
            variant="ghost"
          />
        </HStack>
        
        {/* 活动筛选器显示 */}
        {(searchQuery || selectedTags.length > 0) && (
          <Box mt={2}>
            <HStack wrap="wrap" spacing={1}>
              {searchQuery && (
                <Badge
                  colorScheme="blue"
                  variant="subtle"
                  cursor="pointer"
                  onClick={clearSearch}
                >
                  搜索: {searchQuery} ×
                </Badge>
              )}
              {selectedTags.map(tag => (
                <Badge
                  key={tag}
                  colorScheme="green"
                  variant="subtle"
                  cursor="pointer"
                  onClick={clearTagFilter}
                >
                  {tag} ×
                </Badge>
              ))}
            </HStack>
          </Box>
        )}
      </Box>

      {/* 标签页 */}
      <Box flex="1" overflow="hidden">
        <Tabs size="sm" variant="enclosed" h="100%">
          <TabList px={4} pt={2}>
            <Tab>笔记</Tab>
            <Tab>标签</Tab>
          </TabList>
          
          <TabPanels h="calc(100% - 40px)">
            <TabPanel p={0} h="100%">
              <NotesList
                selectedNoteId={selectedNoteId}
                onSelectNote={onSelectNote}
              />
            </TabPanel>
            <TabPanel p={0} h="100%">
              <TagsList
                selectedTags={selectedTags}
                onTagSelect={filterByTags}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>

      {/* 底部状态栏 */}
      <Box p={3} borderTop="1px" borderColor={borderColor}>
        <Text fontSize="xs" color={mutedColor} textAlign="center">
          {loading ? '加载中...' : '就绪'}
        </Text>
      </Box>

      {/* 设置模态框 */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </Box>
  );
}

export default Sidebar;