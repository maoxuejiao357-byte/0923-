export interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: string
  updatedAt: string
  isPinned: boolean
  isArchived: boolean
  category?: string
  aiSummary?: string
}

export interface CreateNoteData {
  title: string
  content?: string
  tags?: string[]
  category?: string
  isPinned?: boolean
}

export interface UpdateNoteData {
  title?: string
  content?: string
  tags?: string[]
  category?: string
  isPinned?: boolean
  isArchived?: boolean
  aiSummary?: string
}

export interface NoteFilter {
  category?: string
  tags?: string[]
  isPinned?: boolean
  isArchived?: boolean
  dateRange?: {
    start: string
    end: string
  }
}

export interface SearchResult {
  note: Note
  score: number
  highlights: string[]
}