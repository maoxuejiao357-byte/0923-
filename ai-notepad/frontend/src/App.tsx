import { Box } from '@chakra-ui/react'
import { useState } from 'react'
import LovableLandingPage from './components/LovableLandingPage.tsx'
import Layout from './components/Layout.tsx'
import { NotesProvider } from './context/NotesContext.tsx'
import { SettingsProvider } from './context/SettingsContext.tsx'
import { PomodoroProvider } from './context/PomodoroContext.tsx'
import { useSettings } from './context/SettingsContext.tsx'
import { gradients } from './theme'

type ViewType = 'landing' | 'notes' | 'todo' | 'dashboard' | 'ai-chat'

function AppContent() {
  const [currentView, setCurrentView] = useState<ViewType>('landing')
  const { settings } = useSettings()
  
  const getBackgroundStyle = () => {
    switch (settings.themeStyle) {
      case 'oceanBreeze':
        return { background: gradients.oceanBreeze }
      case 'freshBlue':
        return { background: gradients.freshBlue }
      case 'sunsetGlow':
        return { background: gradients.sunsetGlow }
      case 'mintGreen':
        return { background: gradients.mintFresh }
      case 'lavender':
        return { background: gradients.lavenderMist }
      case 'warmOrange':
        return { background: gradients.peachDream }
      default:
        return { background: gradients.cloudyDay }
    }
  }

  if (currentView === 'landing') {
    return (
      <Box minHeight="100vh">
        <LovableLandingPage onNavigate={(view) => setCurrentView(view)} />
      </Box>
    )
  }

  return (
    <Box 
      minH="100vh" 
      {...getBackgroundStyle()}
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        zIndex: 0,
      }}
    >
      <Box position="relative" zIndex={1}>
        <Layout />
      </Box>
    </Box>
  )
}

function App() {
  return (
    <SettingsProvider>
      <NotesProvider>
        <PomodoroProvider>
          <AppContent />
        </PomodoroProvider>
      </NotesProvider>
    </SettingsProvider>
  )
}

export default App