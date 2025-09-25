import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { Note, CreateNoteData, UpdateNoteData } from '../types/note'
import { notesService } from '../services/notesService'
import { aiService } from '../services/aiService'

interface NotesState {
  notes: Note[]
  selectedNoteId: string | null
  isLoading: boolean
  error: string | null
  searchQuery: string
  filteredNotes: Note[]
  searchMode: 'text' | 'semantic'
  isSearching: boolean
}

type NotesAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_NOTES'; payload: Note[] }
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: Note }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'SELECT_NOTE'; payload: string | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_FILTERED_NOTES'; payload: Note[] }
  | { type: 'SET_SEARCH_MODE'; payload: 'text' | 'semantic' }
  | { type: 'SET_SEARCHING'; payload: boolean }

interface NotesContextType extends NotesState {
  createNote: (data: CreateNoteData) => Promise<void>
  updateNote: (id: string, data: UpdateNoteData) => Promise<void>
  deleteNote: (id: string) => Promise<void>
  selectNote: (id: string | null) => void
  searchNotes: (query: string, mode?: 'text' | 'semantic') => Promise<void>
  setSearchMode: (mode: 'text' | 'semantic') => void
  refreshNotes: () => Promise<void>
}

const initialState: NotesState = {
  notes: [],
  selectedNoteId: null,
  isLoading: false,
  error: null,
  searchQuery: '',
  filteredNotes: [],
  searchMode: 'text',
  isSearching: false
}

function notesReducer(state: NotesState, action: NotesAction): NotesState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false }
    case 'SET_NOTES':
      return { 
        ...state, 
        notes: action.payload, 
        filteredNotes: action.payload,
        isLoading: false 
      }
    case 'ADD_NOTE':
      const newNotes = [action.payload, ...state.notes]
      return { 
        ...state, 
        notes: newNotes,
        filteredNotes: state.searchQuery ? 
          newNotes.filter(note => 
            note.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
            note.content.toLowerCase().includes(state.searchQuery.toLowerCase())
          ) : newNotes
      }
    case 'UPDATE_NOTE':
      const updatedNotes = state.notes.map(note => 
        note.id === action.payload.id ? action.payload : note
      )
      return { 
        ...state, 
        notes: updatedNotes,
        filteredNotes: state.searchQuery ? 
          updatedNotes.filter(note => 
            note.title.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
            note.content.toLowerCase().includes(state.searchQuery.toLowerCase())
          ) : updatedNotes
      }
    case 'DELETE_NOTE':
      const remainingNotes = state.notes.filter(note => note.id !== action.payload)
      return { 
        ...state, 
        notes: remainingNotes,
        filteredNotes: remainingNotes,
        selectedNoteId: state.selectedNoteId === action.payload ? null : state.selectedNoteId
      }
    case 'SELECT_NOTE':
      return { ...state, selectedNoteId: action.payload }
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload }
    case 'SET_FILTERED_NOTES':
      return { ...state, filteredNotes: action.payload }
    case 'SET_SEARCH_MODE':
      return { ...state, searchMode: action.payload }
    case 'SET_SEARCHING':
      return { ...state, isSearching: action.payload }
    default:
      return state
  }
}

const NotesContext = createContext<NotesContextType | undefined>(undefined)

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notesReducer, initialState)

  // 加载笔记
  const refreshNotes = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const notes = await notesService.getAllNotes()
      dispatch({ type: 'SET_NOTES', payload: notes })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '加载笔记失败' })
    }
  }

  // 创建笔记
  const createNote = async (data: CreateNoteData) => {
    try {
      const newNote = await notesService.createNote(data)
      dispatch({ type: 'ADD_NOTE', payload: newNote })
      dispatch({ type: 'SELECT_NOTE', payload: newNote.id })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '创建笔记失败' })
    }
  }

  // 更新笔记
  const updateNote = async (id: string, data: UpdateNoteData) => {
    try {
      const updatedNote = await notesService.updateNote(id, data)
      dispatch({ type: 'UPDATE_NOTE', payload: updatedNote })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '更新笔记失败' })
    }
  }

  // 删除笔记
  const deleteNote = async (id: string) => {
    try {
      await notesService.deleteNote(id)
      dispatch({ type: 'DELETE_NOTE', payload: id })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '删除笔记失败' })
    }
  }

  // 选择笔记
  const selectNote = (id: string | null) => {
    dispatch({ type: 'SELECT_NOTE', payload: id })
  }

  // 搜索笔记
  const searchNotes = async (query: string, mode?: 'text' | 'semantic') => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query })
    
    if (!query.trim()) {
      dispatch({ type: 'SET_FILTERED_NOTES', payload: state.notes })
      return
    }

    const searchMode = mode || state.searchMode
    dispatch({ type: 'SET_SEARCHING', payload: true })
    
    try {
      let filtered: Note[]
      
      if (searchMode === 'semantic') {
        // 使用AI语义搜索
        filtered = await aiService.semanticSearch(query, state.notes)
      } else {
        // 使用基础文本搜索
        filtered = state.notes.filter(note => 
          note.title.toLowerCase().includes(query.toLowerCase()) ||
          note.content.toLowerCase().includes(query.toLowerCase()) ||
          note.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        )
      }
      
      dispatch({ type: 'SET_FILTERED_NOTES', payload: filtered })
    } catch (error) {
      console.error('搜索失败:', error)
      dispatch({ type: 'SET_ERROR', payload: '搜索失败，请稍后重试' })
    } finally {
      dispatch({ type: 'SET_SEARCHING', payload: false })
    }
  }

  // 设置搜索模式
  const setSearchMode = (mode: 'text' | 'semantic') => {
    dispatch({ type: 'SET_SEARCH_MODE', payload: mode })
  }

  // 初始化加载
  useEffect(() => {
    refreshNotes()
  }, [])

  const value: NotesContextType = {
    ...state,
    createNote,
      updateNote,
      deleteNote,
      selectNote,
      searchNotes,
      setSearchMode,
      refreshNotes
  }

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  )
}

export const useNotes = (): NotesContextType => {
  const context = useContext(NotesContext)
  if (context === undefined) {
    throw new Error('useNotes must be used within a NotesProvider')
  }
  return context
}