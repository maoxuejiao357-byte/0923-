import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { notesDB } from '../services/database';

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

  // 加载笔记
  const loadNotes = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const notes = await notesDB.getAllNotes();
      dispatch({ type: 'SET_NOTES', payload: notes });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  // 创建笔记
  const createNote = async (noteData) => {
    try {
      const newNote = {
        id: Date.now().toString(),
        title: noteData.title || '新笔记',
        content: noteData.content || '',
        tags: noteData.tags || [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await notesDB.addNote(newNote);
      dispatch({ type: 'ADD_NOTE', payload: newNote });
      return newNote;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // 更新笔记
  const updateNote = async (id, updates) => {
    try {
      const updatedNote = {
        ...updates,
        id,
        updatedAt: new Date()
      };
      
      await notesDB.updateNote(id, updatedNote);
      dispatch({ type: 'UPDATE_NOTE', payload: updatedNote });
      return updatedNote;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // 删除笔记
  const deleteNote = async (id) => {
    try {
      await notesDB.deleteNote(id);
      dispatch({ type: 'DELETE_NOTE', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // 搜索笔记
  const searchNotes = (query) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  };

  // 按标签筛选
  const filterByTags = (tags) => {
    dispatch({ type: 'SET_SELECTED_TAGS', payload: tags });
  };

  // 获取过滤后的笔记
  const getFilteredNotes = () => {
    let filtered = state.notes;

    // 按搜索查询过滤
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(note => 
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // 按标签过滤
    if (state.selectedTags.length > 0) {
      filtered = filtered.filter(note => 
        state.selectedTags.every(tag => note.tags.includes(tag))
      );
    }

    return filtered;
  };

  // 获取所有标签
  const getAllTags = () => {
    const allTags = state.notes.flatMap(note => note.tags);
    return [...new Set(allTags)].sort();
  };

  // 初始化时加载笔记
  useEffect(() => {
    loadNotes();
  }, []);

  const value = {
    ...state,
    createNote,
    updateNote,
    deleteNote,
    searchNotes,
    filterByTags,
    getFilteredNotes,
    getAllTags,
    loadNotes
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
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}