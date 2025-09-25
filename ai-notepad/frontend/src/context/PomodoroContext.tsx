import React, { createContext, useContext, useReducer, useEffect, useRef } from 'react'

interface TimeRecord {
  module: 'notes' | 'todo' | 'dashboard'
  startTime: number
  endTime?: number
  duration: number // 秒
  date: string // YYYY-MM-DD
}

interface PomodoroState {
  isRunning: boolean
  currentTime: number // 当前计时器时间（秒）
  currentModule: 'notes' | 'todo' | 'dashboard'
  sessionStartTime: number | null
  todayRecords: TimeRecord[]
  totalTimeToday: { [key in 'notes' | 'todo' | 'dashboard']: number }
  pomodoroSettings: {
    workDuration: number // 工作时长（分钟）
    shortBreak: number // 短休息（分钟）
    longBreak: number // 长休息（分钟）
    sessionsUntilLongBreak: number
  }
  currentSession: number
  sessionType: 'work' | 'shortBreak' | 'longBreak'
}

type PomodoroAction =
  | { type: 'START_TIMER'; payload: { module: 'notes' | 'todo' | 'dashboard' } }
  | { type: 'PAUSE_TIMER' }
  | { type: 'RESET_TIMER' }
  | { type: 'TICK' }
  | { type: 'SWITCH_MODULE'; payload: 'notes' | 'todo' | 'dashboard' }
  | { type: 'ADD_TIME_RECORD'; payload: TimeRecord }
  | { type: 'LOAD_TODAY_RECORDS'; payload: TimeRecord[] }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<PomodoroState['pomodoroSettings']> }
  | { type: 'NEXT_SESSION' }

interface PomodoroContextType extends PomodoroState {
  startTimer: (module: 'notes' | 'todo' | 'dashboard') => void
  pauseTimer: () => void
  resetTimer: () => void
  switchModule: (module: 'notes' | 'todo' | 'dashboard') => void
  updateSettings: (settings: Partial<PomodoroState['pomodoroSettings']>) => void
  getTodayTimeForModule: (module: 'notes' | 'todo' | 'dashboard') => number
  formatTime: (seconds: number) => string
}

const STORAGE_KEY = 'ai-notepad-pomodoro-records'
const SETTINGS_KEY = 'ai-notepad-pomodoro-settings'

const defaultSettings = {
  workDuration: 25,
  shortBreak: 5,
  longBreak: 15,
  sessionsUntilLongBreak: 4
}

const initialState: PomodoroState = {
  isRunning: false,
  currentTime: 0,
  currentModule: 'notes',
  sessionStartTime: null,
  todayRecords: [],
  totalTimeToday: {
    notes: 0,
    todo: 0,
    dashboard: 0
  },
  pomodoroSettings: defaultSettings,
  currentSession: 1,
  sessionType: 'work'
}

function pomodoroReducer(state: PomodoroState, action: PomodoroAction): PomodoroState {
  switch (action.type) {
    case 'START_TIMER':
      return {
        ...state,
        isRunning: true,
        currentModule: action.payload.module,
        sessionStartTime: Date.now(),
        currentTime: state.sessionType === 'work' 
          ? state.pomodoroSettings.workDuration * 60
          : state.sessionType === 'shortBreak'
          ? state.pomodoroSettings.shortBreak * 60
          : state.pomodoroSettings.longBreak * 60
      }

    case 'PAUSE_TIMER':
      if (state.isRunning && state.sessionStartTime) {
        const duration = Math.floor((Date.now() - state.sessionStartTime) / 1000)
        const today = new Date().toISOString().split('T')[0]
        const record: TimeRecord = {
          module: state.currentModule,
          startTime: state.sessionStartTime,
          endTime: Date.now(),
          duration,
          date: today
        }
        
        return {
          ...state,
          isRunning: false,
          sessionStartTime: null,
          todayRecords: [...state.todayRecords, record],
          totalTimeToday: {
            ...state.totalTimeToday,
            [state.currentModule]: state.totalTimeToday[state.currentModule] + duration
          }
        }
      }
      return { ...state, isRunning: false }

    case 'RESET_TIMER':
      return {
        ...state,
        isRunning: false,
        currentTime: state.sessionType === 'work' 
          ? state.pomodoroSettings.workDuration * 60
          : state.sessionType === 'shortBreak'
          ? state.pomodoroSettings.shortBreak * 60
          : state.pomodoroSettings.longBreak * 60,
        sessionStartTime: null
      }

    case 'TICK':
      if (state.currentTime <= 1) {
        // 时间到了，自动切换到下一个会话
        return pomodoroReducer(state, { type: 'NEXT_SESSION' })
      }
      return {
        ...state,
        currentTime: state.currentTime - 1
      }

    case 'SWITCH_MODULE':
      // 如果正在计时，先暂停并记录时间
      if (state.isRunning && state.sessionStartTime) {
        const pausedState = pomodoroReducer(state, { type: 'PAUSE_TIMER' })
        return {
          ...pausedState,
          currentModule: action.payload
        }
      }
      return {
        ...state,
        currentModule: action.payload
      }

    case 'ADD_TIME_RECORD':
      return {
        ...state,
        todayRecords: [...state.todayRecords, action.payload],
        totalTimeToday: {
          ...state.totalTimeToday,
          [action.payload.module]: state.totalTimeToday[action.payload.module] + action.payload.duration
        }
      }

    case 'LOAD_TODAY_RECORDS':
      const totalTime = { notes: 0, todo: 0, dashboard: 0 }
      action.payload.forEach(record => {
        totalTime[record.module] += record.duration
      })
      return {
        ...state,
        todayRecords: action.payload,
        totalTimeToday: totalTime
      }

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        pomodoroSettings: { ...state.pomodoroSettings, ...action.payload }
      }

    case 'NEXT_SESSION':
      const isWorkSession = state.sessionType === 'work'
      let nextSessionType: 'work' | 'shortBreak' | 'longBreak'
      let nextSession = state.currentSession
      
      if (isWorkSession) {
        // 工作结束，进入休息
        if (state.currentSession >= state.pomodoroSettings.sessionsUntilLongBreak) {
          nextSessionType = 'longBreak'
          nextSession = 1
        } else {
          nextSessionType = 'shortBreak'
        }
      } else {
        // 休息结束，进入工作
        nextSessionType = 'work'
        if (state.sessionType === 'shortBreak') {
          nextSession = state.currentSession + 1
        }
      }

      return {
        ...state,
        sessionType: nextSessionType,
        currentSession: nextSession,
        currentTime: nextSessionType === 'work' 
          ? state.pomodoroSettings.workDuration * 60
          : nextSessionType === 'shortBreak'
          ? state.pomodoroSettings.shortBreak * 60
          : state.pomodoroSettings.longBreak * 60,
        isRunning: false
      }

    default:
      return state
  }
}

// 加载今日记录
function loadTodayRecords(): TimeRecord[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    
    const allRecords: TimeRecord[] = JSON.parse(stored)
    const today = new Date().toISOString().split('T')[0]
    return allRecords.filter(record => record.date === today)
  } catch {
    return []
  }
}

// 保存记录到本地存储
function saveRecord(record: TimeRecord) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const allRecords: TimeRecord[] = stored ? JSON.parse(stored) : []
    allRecords.push(record)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allRecords))
  } catch (error) {
    console.error('Failed to save time record:', error)
  }
}

// 加载设置
function loadSettings() {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY)
    return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings
  } catch {
    return defaultSettings
  }
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined)

export const PomodoroProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(pomodoroReducer, {
    ...initialState,
    pomodoroSettings: loadSettings()
  })
  const intervalRef = useRef<number | null>(null)

  // 加载今日记录
  useEffect(() => {
    const todayRecords = loadTodayRecords()
    dispatch({ type: 'LOAD_TODAY_RECORDS', payload: todayRecords })
  }, [])

  // 计时器
  useEffect(() => {
    if (state.isRunning) {
      intervalRef.current = setInterval(() => {
        dispatch({ type: 'TICK' })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [state.isRunning])

  // 保存记录到本地存储
  useEffect(() => {
    if (state.todayRecords.length > 0) {
      const lastRecord = state.todayRecords[state.todayRecords.length - 1]
      if (lastRecord.endTime) {
        saveRecord(lastRecord)
      }
    }
  }, [state.todayRecords])

  // 保存设置
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(state.pomodoroSettings))
  }, [state.pomodoroSettings])

  const startTimer = (module: 'notes' | 'todo' | 'dashboard') => {
    dispatch({ type: 'START_TIMER', payload: { module } })
  }

  const pauseTimer = () => {
    dispatch({ type: 'PAUSE_TIMER' })
  }

  const resetTimer = () => {
    dispatch({ type: 'RESET_TIMER' })
  }

  const switchModule = (module: 'notes' | 'todo' | 'dashboard') => {
    dispatch({ type: 'SWITCH_MODULE', payload: module })
  }

  const updateSettings = (settings: Partial<PomodoroState['pomodoroSettings']>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings })
  }

  const getTodayTimeForModule = (module: 'notes' | 'todo' | 'dashboard') => {
    return state.totalTimeToday[module]
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const value: PomodoroContextType = {
    ...state,
    startTimer,
    pauseTimer,
    resetTimer,
    switchModule,
    updateSettings,
    getTodayTimeForModule,
    formatTime
  }

  return (
    <PomodoroContext.Provider value={value}>
      {children}
    </PomodoroContext.Provider>
  )
}

export const usePomodoro = (): PomodoroContextType => {
  const context = useContext(PomodoroContext)
  if (!context) {
    throw new Error('usePomodoro must be used within PomodoroProvider')
  }
  return context
}