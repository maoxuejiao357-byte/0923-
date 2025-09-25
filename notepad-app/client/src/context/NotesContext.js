import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { notesAPI } from '../services/localStorage';

const NotesContext = createContext();

const initialState = {
  notes: [],
  loading: false,
  error: null,
  searchQuery: '',
  selectedTags: []
};

function notesReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_NOTES':
      return { ...state, notes: action.payload, loading: false };
    case 'ADD_NOTE':
      return { ...state, notes: [action.payload, ...state.notes] };
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map(note => 
          note.id === action.payload.id ? action.payload : note
        )
      };
    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter(note => note.id !== action.payload)
      };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_SELECTED_TAGS':
      return { ...state, selectedTags: action.payload };
    default:
      return state;
  }
}

export function NotesProvider({ children }) {
  const [state, dispatch] = useReducer(notesReducer, initialState);

  // 加载笔记（使用本地存储API）
  const loadNotes = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await notesAPI.getAllNotes();
      
      if (response.success) {
        dispatch({ type: 'SET_NOTES', payload: response.data });
      } else {
        throw new Error('加载笔记失败');
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  // 创建笔记
  const createNote = async (note) => {
    try {
      const response = await notesAPI.createNote(note);
      if (response.success) {
        dispatch({ type: 'ADD_NOTE', payload: response.data });
        return response.data;
      } else {
        throw new Error('创建笔记失败');
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // 更新笔记
  const updateNote = async (id, updates) => {
    try {
      const response = await notesAPI.updateNote(id, updates);
      if (response.success) {
        dispatch({ type: 'UPDATE_NOTE', payload: response.data });
        return response.data;
      } else {
        throw new Error('更新笔记失败');
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // 删除笔记
  const deleteNote = async (id) => {
    try {
      const response = await notesAPI.deleteNote(id);
      if (response.success) {
        dispatch({ type: 'DELETE_NOTE', payload: id });
      } else {
        throw new Error('删除笔记失败');
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // 设置搜索查询
  const setSearchQuery = (query) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  };

  // 设置选中的标签
  const setSelectedTags = (tags) => {
    dispatch({ type: 'SET_SELECTED_TAGS', payload: tags });
  };

  // 获取过滤后的笔记
  const getFilteredNotes = () => {
    return state.notes.filter(note => {
      // 搜索过滤
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        const matchesSearch = 
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query) ||
          (note.tags && note.tags.some(tag => tag.toLowerCase().includes(query)));
        
        if (!matchesSearch) return false;
      }

      // 标签过滤
      if (state.selectedTags.length > 0) {
        const hasSelectedTag = state.selectedTags.some(tag => 
          note.tags && note.tags.includes(tag)
        );
        if (!hasSelectedTag) return false;
      }

      return true;
    });
  };

  // 初始化时加载笔记
  useEffect(() => {
    loadNotes();
  }, []);

  const value = {
    notes: state.notes,
    loading: state.loading,
    error: state.error,
    searchQuery: state.searchQuery,
    selectedTags: state.selectedTags,
    loadNotes,
    createNote,
    updateNote,
    deleteNote,
    setSearchQuery,
    setSelectedTags,
    getFilteredNotes
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes必须在NotesProvider中使用');
  }
  return context;
}