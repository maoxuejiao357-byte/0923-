import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { notesDB } from '../services/database';

interface Note {
  id?: number;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface NotesState {
  notes: Note[];
  loading: boolean;
  error: string | null;
}

type NotesAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_NOTES'; payload: Note[] }
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: Note }
  | { type: 'DELETE_NOTE'; payload: number }
  | { type: 'SET_ERROR'; payload: string | null };

const NotesContext = createContext<any>(null);

const initialState: NotesState = {
  notes: [],
  loading: false,
  error: null
};

function notesReducer(state: NotesState, action: NotesAction): NotesState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
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
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
}

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(notesReducer, initialState);

  // 加载笔记
  const loadNotes = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const notes = await notesDB.getAllNotes();
      dispatch({ type: 'SET_NOTES', payload: notes });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '加载笔记失败' });
    }
  };

  // 创建笔记
  const createNote = async (note: Omit<Note, 'id'>) => {
    try {
      const newNote = await notesDB.addNote({
        ...note,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      dispatch({ type: 'ADD_NOTE', payload: newNote });
      return newNote;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '创建笔记失败' });
      throw error;
    }
  };

  // 更新笔记
  const updateNote = async (id: number, updates: Partial<Note>) => {
    try {
      const updatedNote = await notesDB.updateNote(id, {
        ...updates,
        updatedAt: new Date().toISOString()
      });
      dispatch({ type: 'UPDATE_NOTE', payload: updatedNote });
      return updatedNote;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '更新笔记失败' });
      throw error;
    }
  };

  // 删除笔记
  const deleteNote = async (id: number) => {
    try {
      await notesDB.deleteNote(id);
      dispatch({ type: 'DELETE_NOTE', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '删除笔记失败' });
      throw error;
    }
  };

  // 初始化时加载笔记
  useEffect(() => {
    loadNotes();
  }, []);

  const value = {
    notes: state.notes,
    loading: state.loading,
    error: state.error,
    loadNotes,
    createNote,
    updateNote,
    deleteNote
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