import React, { useState, useEffect } from 'react';
import {
  Box,
  Flex,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import Sidebar from './components/Sidebar';
import NoteEditor from './components/NoteEditor';
import AIPanel from './components/AIPanel';
import { NotesProvider } from './context/NotesContext';
import { SettingsProvider } from './context/SettingsContext';

function App() {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const sidebarBorderColor = useColorModeValue('gray.200', 'gray.700');
  const sidebarBg = useColorModeValue('white', 'gray.800');
  const editorBg = useColorModeValue('white', 'gray.800');
  const aiPanelBorderColor = useColorModeValue('gray.200', 'gray.700');
  const aiPanelBg = useColorModeValue('gray.50', 'gray.900');
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(true);

  return (
    <NotesProvider>
      <SettingsProvider>
        <Box bg={bgColor} h="100vh" overflow="hidden">
          <Flex h="100%">
            {/* 左侧边栏 - 笔记列表 */}
            <Box
              w="300px"
              borderRight="1px"
              borderColor={sidebarBorderColor}
              bg={sidebarBg}
            >
              <Sidebar 
                selectedNoteId={selectedNoteId}
                onSelectNote={setSelectedNoteId}
                onToggleAIPanel={() => setIsAIPanelOpen(!isAIPanelOpen)}
              />
            </Box>

            {/* 中间编辑区 */}
            <Box 
              flex="1" 
              bg={editorBg}
              position="relative"
            >
              <NoteEditor 
                selectedNoteId={selectedNoteId}
                onSelectNote={setSelectedNoteId}
              />
            </Box>

            {/* 右侧AI面板 */}
            {isAIPanelOpen && (
              <Box
                w="350px"
                borderLeft="1px"
                borderColor={aiPanelBorderColor}
                bg={aiPanelBg}
              >
                <AIPanel 
                  selectedNoteId={selectedNoteId}
                  onClose={() => setIsAIPanelOpen(false)}
                />
              </Box>
            )}
          </Flex>
        </Box>
      </SettingsProvider>
    </NotesProvider>
  );
}

export default App;