import React, { createContext, useContext, useReducer, useEffect } from 'react'

interface Settings {
  openrouterApiKey: string
  theme: 'light' | 'dark' | 'system'
  themeStyle: 'default' | 'freshBlue' | 'warmOrange' | 'mintGreen' | 'lavender' | 'oceanBreeze' | 'sunsetGlow' | 'deepOcean' | 'skyBlue' | 'warmSunset' | 'goldenHour' | 'springGreen' | 'emeraldDream' | 'mysticPurple' | 'royalPurple' | 'rosePetal' | 'cherryBlossom' | 'sweetPink' | 'moonlight' | 'softGray'
  fontSize: 'small' | 'medium' | 'large'
  autoSave: boolean
  autoSaveInterval: number // 秒
  showWordCount: boolean
  enableAI: boolean
  defaultCategory: string
  aiModel: 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4-turbo' | 'claude-3-haiku' | 'claude-3-sonnet' | 'claude-3-opus'
}

interface SettingsState {
  settings: Settings
  isLoading: boolean
  error: string | null
}

type SettingsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SETTINGS'; payload: Settings }
  | { type: 'UPDATE_SETTING'; payload: { key: keyof Settings; value: any } }

interface SettingsContextType extends SettingsState {
  updateSetting: <K extends keyof Settings>(key: K, value: Settings[K]) => void
  resetSettings: () => void
  exportSettings: () => string
  importSettings: (settingsJson: string) => boolean
}

const SETTINGS_STORAGE_KEY = 'ai-notepad-settings'

const defaultSettings: Settings = {
  openrouterApiKey: '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',
  theme: 'system',
  themeStyle: 'oceanBreeze',
  fontSize: 'medium',
  autoSave: true,
  autoSaveInterval: 30,
  showWordCount: true,
  enableAI: true,
  defaultCategory: '默认',
  aiModel: 'gpt-3.5-turbo'
}

const initialState: SettingsState = {
  settings: defaultSettings,
  isLoading: false,
  error: null
}

function settingsReducer(state: SettingsState, action: SettingsAction): SettingsState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload, isLoading: false }
    case 'UPDATE_SETTING':
      const updatedSettings = {
        ...state.settings,
        [action.payload.key]: action.payload.value
      }
      // 保存到本地存储
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings))
      } catch (error) {
        console.error('保存设置失败:', error)
      }
      return { ...state, settings: updatedSettings }
    default:
      return state
  }
}

// 从本地存储加载设置
function loadSettingsFromStorage(): Settings {
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // 合并默认设置，确保新增的设置项有默认值
      return { ...defaultSettings, ...parsed }
    }
  } catch (error) {
    console.error('加载设置失败:', error)
  }
  return defaultSettings
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(settingsReducer, initialState)

  // 更新单个设置
  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    dispatch({ type: 'UPDATE_SETTING', payload: { key, value } })
    
    // 特殊处理：如果更新了API密钥，自动启用AI功能
    if (key === 'openrouterApiKey' && value) {
      dispatch({ type: 'UPDATE_SETTING', payload: { key: 'enableAI', value: true } })
    }
  }

  // 重置设置
  const resetSettings = () => {
    try {
      localStorage.removeItem(SETTINGS_STORAGE_KEY)
      dispatch({ type: 'SET_SETTINGS', payload: defaultSettings })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '重置设置失败' })
    }
  }

  // 导出设置
  const exportSettings = (): string => {
    return JSON.stringify(state.settings, null, 2)
  }

  // 导入设置
  const importSettings = (settingsJson: string): boolean => {
    try {
      const imported = JSON.parse(settingsJson)
      const validatedSettings = { ...defaultSettings, ...imported }
      dispatch({ type: 'SET_SETTINGS', payload: validatedSettings })
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(validatedSettings))
      return true
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '导入设置失败：格式无效' })
      return false
    }
  }

  // 初始化加载设置
  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: true })
    const settings = loadSettingsFromStorage()
    dispatch({ type: 'SET_SETTINGS', payload: settings })
  }, [])

  const value: SettingsContextType = {
    ...state,
    updateSetting,
    resetSettings,
    exportSettings,
    importSettings
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}