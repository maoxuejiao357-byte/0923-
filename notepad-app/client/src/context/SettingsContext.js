import React, { createContext, useContext, useReducer, useEffect } from 'react';

const SettingsContext = createContext();

const initialState = {
  apiKey: '',
  theme: 'light',
  editorSettings: {
    fontSize: 14,
    lineHeight: 1.5,
    wordWrap: true
  },
  aiSettings: {
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 1000
  }
};

function settingsReducer(state, action) {
  switch (action.type) {
    case 'SET_API_KEY':
      return { ...state, apiKey: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'UPDATE_EDITOR_SETTINGS':
      return {
        ...state,
        editorSettings: { ...state.editorSettings, ...action.payload }
      };
    case 'UPDATE_AI_SETTINGS':
      return {
        ...state,
        aiSettings: { ...state.aiSettings, ...action.payload }
      };
    case 'LOAD_SETTINGS':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

export function SettingsProvider({ children }) {
  const [state, dispatch] = useReducer(settingsReducer, initialState);

  // 从localStorage加载设置
  const loadSettings = () => {
    try {
      const savedSettings = localStorage.getItem('notepad-settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        dispatch({ type: 'LOAD_SETTINGS', payload: settings });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  // 保存设置到localStorage
  const saveSettings = (newSettings) => {
    try {
      const settingsToSave = { ...state, ...newSettings };
      localStorage.setItem('notepad-settings', JSON.stringify(settingsToSave));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  // 设置API密钥
  const setApiKey = (apiKey) => {
    dispatch({ type: 'SET_API_KEY', payload: apiKey });
    saveSettings({ apiKey });
  };

  // 设置主题
  const setTheme = (theme) => {
    dispatch({ type: 'SET_THEME', payload: theme });
    saveSettings({ theme });
  };

  // 更新编辑器设置
  const updateEditorSettings = (settings) => {
    dispatch({ type: 'UPDATE_EDITOR_SETTINGS', payload: settings });
    saveSettings({ editorSettings: { ...state.editorSettings, ...settings } });
  };

  // 更新AI设置
  const updateAISettings = (settings) => {
    dispatch({ type: 'UPDATE_AI_SETTINGS', payload: settings });
    saveSettings({ aiSettings: { ...state.aiSettings, ...settings } });
  };

  // 检查API密钥是否已设置
  const isApiKeySet = () => {
    return state.apiKey && state.apiKey.trim().length > 0;
  };

  // 初始化时加载设置
  useEffect(() => {
    loadSettings();
  }, []);

  // 当设置变化时自动保存
  useEffect(() => {
    if (state !== initialState) {
      saveSettings(state);
    }
  }, [state]);

  const value = {
    ...state,
    setApiKey,
    setTheme,
    updateEditorSettings,
    updateAISettings,
    isApiKeySet,
    loadSettings
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}