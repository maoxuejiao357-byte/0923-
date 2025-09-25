import { Note, CreateNoteData, UpdateNoteData } from '../types/note'
import { v4 as uuidv4 } from 'uuid'

// 模拟API延迟
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 本地存储键名
const NOTES_STORAGE_KEY = 'ai-notepad-notes'

// 从本地存储获取笔记
function getNotesFromStorage(): Note[] {
  try {
    const stored = localStorage.getItem(NOTES_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('读取本地笔记失败:', error)
    return []
  }
}

// 保存笔记到本地存储
function saveNotesToStorage(notes: Note[]): void {
  try {
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes))
  } catch (error) {
    console.error('保存笔记到本地存储失败:', error)
  }
}

// 创建默认笔记
function createDefaultNote(): Note {
  const now = new Date().toISOString()
  return {
    id: uuidv4(),
    title: '欢迎使用AI记事本',
    content: '这是您的第一条笔记。您可以：\n\n• 编写和编辑笔记\n• 使用AI功能润色和改写内容\n• 自动生成标签\n• 搜索笔记内容\n• 组织和管理您的想法\n\n开始记录您的想法吧！',
    tags: ['欢迎', '指南'],
    createdAt: now,
    updatedAt: now,
    isPinned: true,
    isArchived: false,
    category: '默认'
  }
}

// 笔记服务类
class NotesService {
  // 获取所有笔记
  async getAllNotes(): Promise<Note[]> {
    await delay(300) // 模拟网络延迟
    
    let notes = getNotesFromStorage()
    
    // 如果没有笔记，创建默认笔记
    if (notes.length === 0) {
      const defaultNote = createDefaultNote()
      notes = [defaultNote]
      saveNotesToStorage(notes)
    }
    
    // 按更新时间倒序排列
    return notes.sort((a, b) => {
      // 置顶笔记优先
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      
      // 按更新时间排序
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    })
  }

  // 根据ID获取笔记
  async getNoteById(id: string): Promise<Note | null> {
    await delay(100)
    
    const notes = getNotesFromStorage()
    return notes.find(note => note.id === id) || null
  }

  // 创建笔记
  async createNote(data: CreateNoteData): Promise<Note> {
    await delay(200)
    
    const now = new Date().toISOString()
    const newNote: Note = {
      id: uuidv4(),
      title: data.title || '无标题',
      content: data.content || '',
      tags: data.tags || [],
      createdAt: now,
      updatedAt: now,
      isPinned: data.isPinned || false,
      isArchived: false,
      category: data.category
    }
    
    const notes = getNotesFromStorage()
    notes.unshift(newNote) // 添加到开头
    saveNotesToStorage(notes)
    
    return newNote
  }

  // 更新笔记
  async updateNote(id: string, data: UpdateNoteData): Promise<Note> {
    await delay(200)
    
    const notes = getNotesFromStorage()
    const noteIndex = notes.findIndex(note => note.id === id)
    
    if (noteIndex === -1) {
      throw new Error('笔记不存在')
    }
    
    const updatedNote: Note = {
      ...notes[noteIndex],
      ...data,
      updatedAt: new Date().toISOString()
    }
    
    notes[noteIndex] = updatedNote
    saveNotesToStorage(notes)
    
    return updatedNote
  }

  // 删除笔记
  async deleteNote(id: string): Promise<void> {
    await delay(200)
    
    const notes = getNotesFromStorage()
    const filteredNotes = notes.filter(note => note.id !== id)
    
    if (filteredNotes.length === notes.length) {
      throw new Error('笔记不存在')
    }
    
    saveNotesToStorage(filteredNotes)
  }

  // 搜索笔记
  async searchNotes(query: string): Promise<Note[]> {
    await delay(300)
    
    if (!query.trim()) {
      return this.getAllNotes()
    }
    
    const notes = getNotesFromStorage()
    const searchTerm = query.toLowerCase()
    
    return notes.filter(note => 
      note.title.toLowerCase().includes(searchTerm) ||
      note.content.toLowerCase().includes(searchTerm) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      (note.category && note.category.toLowerCase().includes(searchTerm))
    )
  }

  // 获取所有标签
  async getAllTags(): Promise<string[]> {
    await delay(100)
    
    const notes = getNotesFromStorage()
    const allTags = notes.flatMap(note => note.tags)
    
    // 去重并排序
    return Array.from(new Set(allTags)).sort()
  }

  // 获取所有分类
  async getAllCategories(): Promise<string[]> {
    await delay(100)
    
    const notes = getNotesFromStorage()
    const categories = notes
      .map(note => note.category)
      .filter(Boolean) as string[]
    
    // 去重并排序
    return Array.from(new Set(categories)).sort()
  }
}

// 导出单例实例
export const notesService = new NotesService()
export default notesService