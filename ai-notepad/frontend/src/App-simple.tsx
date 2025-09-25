import React, { useState } from 'react';
import { ChakraProvider, Box, Flex, useColorModeValue } from '@chakra-ui/react';
import { NotesProvider } from './context/NotesContext';
import { SettingsProvider } from './context/SettingsContext';
import SimpleNotesList from './components/simple/NotesList';
import SimpleNoteEditor from './components/simple/NoteEditor';

function SimpleApp() {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  return (
    <ChakraProvider>
      <SettingsProvider>
        <NotesProvider>
          <Box bg={bgColor} h="100vh" overflow="hidden">
            <Flex h="100%">
              {/* 左侧笔记列表 */}
              <Box
                w="300px"
                borderRight="1px"
                borderColor={useColorModeValue('gray.200', 'gray.700')}
                bg={useColorModeValue('white', 'gray.800')}
              >
                <SimpleNotesList />
              </Box>

              {/* 右侧编辑器 */}
              <Box flex={1} bg={useColorModeValue('white', 'gray.800')}>
                <SimpleNoteEditor selectedNoteId={selectedNoteId} />
              </Box>
            </Flex>
          </Box>
        </NotesProvider>
      </SettingsProvider>
    </ChakraProvider>
  );
}

export default SimpleApp;