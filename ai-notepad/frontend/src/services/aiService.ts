import axios from 'axios'
import { Note } from '../types/note'

// API基础URL
const API_BASE_URL = 'http://localhost:5001/api'

// AI服务类
class AIService {
  // 语义搜索
  async semanticSearch(query: string, notes: Note[]): Promise<Note[]> {
    try {
      const response = await axios.post(`${API_BASE_URL}/ai/semantic-search`, {
        query,
        notes
      })
      return response.data.notes
    } catch (error) {
      console.error('语义搜索失败:', error)
      // 如果AI搜索失败，回退到基础文本搜索
      return this.fallbackTextSearch(query, notes)
    }
  }

  // 回退的文本搜索
  private fallbackTextSearch(query: string, notes: Note[]): Note[] {
    if (!query.trim()) {
      return notes
    }

    const searchTerm = query.toLowerCase()
    return notes.filter(note => 
      note.title.toLowerCase().includes(searchTerm) ||
      note.content.toLowerCase().includes(searchTerm) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }

  // 内容润色
  async polishContent(content: string): Promise<string> {
    try {
      const response = await axios.post(`${API_BASE_URL}/ai/polish`, {
        content
      })
      return response.data.polishedContent
    } catch (error) {
      console.error('内容润色失败:', error)
      throw new Error('内容润色失败，请稍后重试')
    }
  }

  // 内容改写
  async rewriteContent(content: string, style?: string): Promise<string> {
    try {
      const response = await axios.post(`${API_BASE_URL}/ai/rewrite`, {
        content,
        style
      })
      return response.data.rewrittenContent
    } catch (error) {
      console.error('内容改写失败:', error)
      throw new Error('内容改写失败，请稍后重试')
    }
  }

  // 生成标签
  async generateTags(content: string): Promise<string[]> {
    try {
      const response = await axios.post(`${API_BASE_URL}/ai/generate-tags`, {
        content
      })
      return response.data.tags
    } catch (error) {
      console.error('生成标签失败:', error)
      throw new Error('生成标签失败，请稍后重试')
    }
  }

  // 生成摘要
  async generateSummary(content: string): Promise<string> {
    try {
      const response = await axios.post(`${API_BASE_URL}/ai/summarize`, {
        content
      })
      return response.data.summary
    } catch (error) {
      console.error('生成摘要失败:', error)
      throw new Error('生成摘要失败，请稍后重试')
    }
  }
}

export const aiService = new AIService()
export default aiService