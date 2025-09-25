import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface Settings {
  theme: 'light' | 'dark';
  fontSize: number;
  autoSave: boolean;
  apiKey: string;
  defaultLanguage: string;
}

interface SettingsState {
  settings: Settings;
  loading: boolean;
}

type SettingsAction =
  | { type: 'SET_SETTINGS'; payload: Settings }
  | { type: 'SET_LOADING'; payload: boolean };

const SettingsContext = createContext<any>(null);

const initialState: SettingsState = {
  settings: {
    theme: 'light',
    fontSize: 14,
    autoSave: true,
    apiKey: '',
    defaultLanguage: 'zh-CN'
  },
  loading: false
};

function settingsReducer(state: SettingsState, action: SettingsAction): SettingsState {
  switch (action.type) {
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(settingsReducer, initialState);

  // 从localStorage加载设置
  const loadSettings = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const savedSettings = localStorage.getItem('notepad-settings');
      
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        dispatch({ type: 'SET_SETTINGS', payload: { ...initialState.settings, ...parsed } });
      }
    } catch (error) {
      console.error('加载设置失败:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // 保存设置
  const saveSettings = async (settings: Settings) => {
    try {
      dispatch({ type: 'SET_SETTINGS', payload: settings });
      localStorage.setItem('notepad-settings', JSON.stringify(settings));
    } catch (error) {
      console.error('保存设置失败:', error);
    }
  };

  // 更新单个设置
  const updateSetting = async (key: keyof Settings, value: any) => {
    const newSettings = { ...state.settings, [key]: value };
    await saveSettings(newSettings);
  };

  // 初始化时加载设置
  useEffect(() => {
    loadSettings();
  }, []);

  const value = {
    settings: state.settings,
    loading: state.loading,
    saveSettings,
    updateSetting
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
    throw new Error('useSettings必须在SettingsProvider中使用');
  }
  return context;
}