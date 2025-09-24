import Dexie from 'dexie';

// 定义数据库
class NotesDatabase extends Dexie {
  constructor() {
    super('NotesDB');
    
    // 定义数据库结构
    this.version(1).stores({
      notes: '++id, title, content, tags, createdAt, updatedAt'
    });
  }
}

// 创建数据库实例
const db = new NotesDatabase();

// 数据库操作类
class NotesDB {
  // 获取所有笔记
  async getAllNotes() {
    try {
      const notes = await db.notes.orderBy('updatedAt').reverse().toArray();
      return notes;
    } catch (error) {
      console.error('Failed to get notes:', error);
      throw new Error('获取笔记失败');
    }
  }

  // 根据ID获取笔记
  async getNoteById(id) {
    try {
      const note = await db.notes.get(id);
      return note;
    } catch (error) {
      console.error('Failed to get note:', error);
      throw new Error('获取笔记失败');
    }
  }

  // 添加新笔记
  async addNote(note) {
    try {
      const id = await db.notes.add(note);
      return { ...note, id };
    } catch (error) {
      console.error('Failed to add note:', error);
      throw new Error('添加笔记失败');
    }
  }

  // 更新笔记
  async updateNote(id, updates) {
    try {
      await db.notes.update(id, updates);
      const updatedNote = await db.notes.get(id);
      return updatedNote;
    } catch (error) {
      console.error('Failed to update note:', error);
      throw new Error('更新笔记失败');
    }
  }

  // 删除笔记
  async deleteNote(id) {
    try {
      await db.notes.delete(id);
      return true;
    } catch (error) {
      console.error('Failed to delete note:', error);
      throw new Error('删除笔记失败');
    }
  }

  // 搜索笔记
  async searchNotes(query) {
    try {
      const notes = await db.notes
        .filter(note => 
          note.title.toLowerCase().includes(query.toLowerCase()) ||
          note.content.toLowerCase().includes(query.toLowerCase()) ||
          note.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        )
        .toArray();
      return notes;
    } catch (error) {
      console.error('Failed to search notes:', error);
      throw new Error('搜索笔记失败');
    }
  }

  // 根据标签获取笔记
  async getNotesByTags(tags) {
    try {
      const notes = await db.notes
        .filter(note => 
          tags.every(tag => note.tags.includes(tag))
        )
        .toArray();
      return notes;
    } catch (error) {
      console.error('Failed to get notes by tags:', error);
      throw new Error('按标签获取笔记失败');
    }
  }

  // 获取所有标签
  async getAllTags() {
    try {
      const notes = await db.notes.toArray();
      const allTags = notes.flatMap(note => note.tags);
      return [...new Set(allTags)].sort();
    } catch (error) {
      console.error('Failed to get tags:', error);
      throw new Error('获取标签失败');
    }
  }

  // 清空所有数据
  async clearAll() {
    try {
      await db.notes.clear();
      return true;
    } catch (error) {
      console.error('Failed to clear data:', error);
      throw new Error('清空数据失败');
    }
  }

  // 导出数据
  async exportData() {
    try {
      const notes = await db.notes.toArray();
      return {
        notes,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };
    } catch (error) {
      console.error('Failed to export data:', error);
      throw new Error('导出数据失败');
    }
  }

  // 导入数据
  async importData(data) {
    try {
      if (data.notes && Array.isArray(data.notes)) {
        await db.notes.clear();
        await db.notes.bulkAdd(data.notes);
        return true;
      }
      throw new Error('无效的数据格式');
    } catch (error) {
      console.error('Failed to import data:', error);
      throw new Error('导入数据失败');
    }
  }
}

// 创建并导出数据库实例
export const notesDB = new NotesDB();
export default db;