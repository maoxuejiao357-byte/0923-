import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Input,
  Button,
  Wrap,
  WrapItem,
  useColorModeValue,
  useToast,
  Checkbox,
  Divider
} from '@chakra-ui/react';
import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import { useNotes } from '../context/NotesContext';

function TagItem({ tag, count, isSelected, onToggle }) {
  const bgColor = useColorModeValue(
    isSelected ? 'blue.100' : 'gray.100',
    isSelected ? 'blue.800' : 'gray.700'
  );
  const textColor = useColorModeValue(
    isSelected ? 'blue.800' : 'gray.700',
    isSelected ? 'blue.100' : 'gray.300'
  );
  const hoverBg = useColorModeValue('gray.200', 'gray.600');

  return (
    <Badge
      bg={bgColor}
      color={textColor}
      cursor="pointer"
      px={3}
      py={1}
      borderRadius="full"
      fontSize="xs"
      fontWeight="medium"
      transition="all 0.2s"
      _hover={{ bg: isSelected ? bgColor : hoverBg }}
      onClick={() => onToggle(tag)}
      display="flex"
      alignItems="center"
      gap={1}
    >
      <Checkbox
        isChecked={isSelected}
        size="sm"
        colorScheme="blue"
        onChange={() => onToggle(tag)}
        onClick={(e) => e.stopPropagation()}
      />
      <Text>{tag}</Text>
      <Text fontSize="10px" opacity={0.7}>
        ({count})
      </Text>
    </Badge>
  );
}

function TagsList({ selectedTags, onTagSelect }) {
  const { notes, getAllTags } = useNotes();
  const [searchQuery, setSearchQuery] = useState('');
  const [newTag, setNewTag] = useState('');
  const toast = useToast();
  
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // 获取所有标签及其使用次数
  const getTagsWithCount = () => {
    const tagCounts = {};
    notes.forEach(note => {
      note.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  };

  // 过滤标签
  const getFilteredTags = () => {
    const tagsWithCount = getTagsWithCount();
    if (!searchQuery) return tagsWithCount;
    
    return tagsWithCount.filter(({ tag }) => 
      tag.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // 切换标签选择
  const handleTagToggle = (tag) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    onTagSelect(newSelectedTags);
  };

  // 清除所有选择
  const clearAllSelections = () => {
    onTagSelect([]);
  };

  // 选择所有标签
  const selectAllTags = () => {
    const allTags = getFilteredTags().map(({ tag }) => tag);
    onTagSelect(allTags);
  };

  const filteredTags = getFilteredTags();
  const allTags = getAllTags();

  return (
    <Box h="100%" overflowY="auto">
      <VStack spacing={4} p={4} align="stretch">
        {/* 搜索标签 */}
        <Box>
          <HStack>
            <Input
              placeholder="搜索标签..."
              size="sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchIcon color={mutedColor} />
          </HStack>
        </Box>

        {/* 选择操作 */}
        {filteredTags.length > 0 && (
          <HStack justify="space-between">
            <Button
              size="xs"
              variant="ghost"
              onClick={selectAllTags}
              isDisabled={selectedTags.length === filteredTags.length}
            >
              全选
            </Button>
            <Button
              size="xs"
              variant="ghost"
              onClick={clearAllSelections}
              isDisabled={selectedTags.length === 0}
            >
              清除
            </Button>
          </HStack>
        )}

        <Divider />

        {/* 已选择的标签 */}
        {selectedTags.length > 0 && (
          <Box>
            <Text fontSize="sm" fontWeight="semibold" color={textColor} mb={2}>
              已选择 ({selectedTags.length})
            </Text>
            <Wrap spacing={2}>
              {selectedTags.map(tag => {
                const tagData = filteredTags.find(t => t.tag === tag);
                return (
                  <WrapItem key={tag}>
                    <TagItem
                      tag={tag}
                      count={tagData?.count || 0}
                      isSelected={true}
                      onToggle={handleTagToggle}
                    />
                  </WrapItem>
                );
              })}
            </Wrap>
            <Divider mt={3} />
          </Box>
        )}

        {/* 所有标签 */}
        <Box>
          <Text fontSize="sm" fontWeight="semibold" color={textColor} mb={2}>
            所有标签 ({filteredTags.length})
          </Text>
          
          {filteredTags.length === 0 ? (
            <Text fontSize="sm" color={mutedColor} textAlign="center" py={4}>
              {searchQuery ? '未找到匹配的标签' : '暂无标签'}
            </Text>
          ) : (
            <Wrap spacing={2}>
              {filteredTags.map(({ tag, count }) => (
                <WrapItem key={tag}>
                  <TagItem
                    tag={tag}
                    count={count}
                    isSelected={selectedTags.includes(tag)}
                    onToggle={handleTagToggle}
                  />
                </WrapItem>
              ))}
            </Wrap>
          )}
        </Box>

        {/* 标签统计 */}
        <Box pt={4} borderTop="1px" borderColor={borderColor}>
          <VStack spacing={2} align="stretch">
            <HStack justify="space-between">
              <Text fontSize="xs" color={mutedColor}>
                总标签数
              </Text>
              <Text fontSize="xs" color={mutedColor}>
                {allTags.length}
              </Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize="xs" color={mutedColor}>
                已选择
              </Text>
              <Text fontSize="xs" color={mutedColor}>
                {selectedTags.length}
              </Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize="xs" color={mutedColor}>
                笔记总数
              </Text>
              <Text fontSize="xs" color={mutedColor}>
                {notes.length}
              </Text>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
}

export default TagsList;