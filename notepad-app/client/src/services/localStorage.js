// 本地存储服务 - 用于Vercel部署（无需后端）

// 模拟AI功能（本地实现）
const mockAI = {
  // 简单的文本润色
  polish: (content) => {
    // 基本的文本优化规则
    let polished = content
      .replace(/\s+/g, ' ')
      .replace(/[，。！？；：]/g, match => match + ' ')
      .trim();
    
    return {
      success: true,
      data: {
        content: polished,
        message: '文本已优化'
      }
    };
  },

  // 文本改写
  rewrite: (content, style) => {
    const styles = {
      formal: '正式',
      casual: '随意',
      academic: '学术',
      creative: '创意'
    };
    
    return {
      success: true,
      data: {
        content: `${content}（${styles[style] || '改写'}风格）`,
        message: '文本已改写'
      }
    };
  },

  // 生成标签
  generateTags: (content) => {
    // 简单的关键词提取
    const keywords = content.match(/[\u4e00-\u9fa5]{2,}/g) || [];
    const uniqueKeywords = [...new Set(keywords)].slice(0, 5);
    const tags = uniqueKeywords.length > 0 ? uniqueKeywords : ['笔记', '重要'];
    
    return {
      success: true,
      data: {
        tags: tags,
        message: '标签已生成'
      }
    };
  },

  // 智能摘要
  summarize: (content) => {
    const sentences = content.split(/[。！？]/g);
    const summary = sentences.slice(0, 2).join('。') + (sentences.length > 2 ? '...' : '');
    
    return {
      success: true,
      data: {
        summary: summary || content.substring(0, 100) + '...',
        message: '摘要已生成'
      }
    };
  },

  // 语义搜索（简化版）
  semanticSearch: (query, notes) => {
    const results = notes.filter(note => 
      note.content.includes(query) || 
      note.title.includes(query) ||
      (note.tags && note.tags.some(tag => tag.includes(query)))
    );
    
    return {
      success: true,
      data: {
        results: results,
        message: `找到 ${results.length} 个相关笔记`
      }
    };
  },

  // 翻译（模拟）
  translate: (content, targetLanguage) => {
    const languages = {
      'en': '英文',
      'ja': '日文',
      'ko': '韩文'
    };
    
    return {
      success: true,
      data: {
        content: `${content}（${languages[targetLanguage] || targetLanguage}翻译）`,
        message: '翻译完成'
      }
    };
  }
};

// AI服务API（本地版本）
export const aiAPI = {
  // 内容润色
  polish: async (content) => {
    try {
      // 模拟异步操作
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockAI.polish(content);
    } catch (error) {
      throw new Error(`内容润色失败: ${error.message}`);
    }
  },

  // 内容改写
  rewrite: async (content, style) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return mockAI.rewrite(content, style);
    } catch (error) {
      throw new Error(`内容改写失败: ${error.message}`);
    }
  },

  // 生成标签
  generateTags: async (content) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockAI.generateTags(content);
    } catch (error) {
      throw new Error(`标签生成失败: ${error.message}`);
    }
  },

  // 智能摘要
  summarize: async (content) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockAI.summarize(content);
    } catch (error) {
      throw new Error(`内容摘要失败: ${error.message}`);
    }
  },

  // 语义搜索
  semanticSearch: async (query, notes) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockAI.semanticSearch(query, notes);
    } catch (error) {
      throw new Error(`语义搜索失败: ${error.message}`);
    }
  },

  // 翻译
  translate: async (content, targetLanguage) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      return mockAI.translate(content, targetLanguage);
    } catch (error) {
      throw new Error(`翻译失败: ${error.message}`);
    }
  }
};

// 笔记API（使用IndexedDB）
class NotesDatabase {
  constructor() {
    this.dbName = 'NotepadDB';
    this.storeName = 'notes';
    this.init();
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'id', autoIncrement: true });
          store.createIndex('title', 'title', { unique: false });
          store.createIndex('tags', 'tags', { unique: false, multiEntry: true });
          store.createIndex('createdAt', 'createdAt', { unique: false });
        }
      };
    });
  }

  async getAllNotes() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getNote(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(id);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async createNote(note) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const noteWithTimestamps = {
        ...note,
        id: note.id || Date.now(),
        createdAt: note.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      const request = store.add(noteWithTimestamps);
      
      request.onsuccess = () => resolve(noteWithTimestamps);
      request.onerror = () => reject(request.error);
    });
  }

  async updateNote(id, updates) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      
      const getRequest = store.get(id);
      getRequest.onsuccess = () => {
        const note = getRequest.result;
        if (note) {
          const updatedNote = {
            ...note,
            ...updates,
            id: id,
            updatedAt: new Date().toISOString()
          };
          const updateRequest = store.put(updatedNote);
          updateRequest.onsuccess = () => resolve(updatedNote);
          updateRequest.onerror = () => reject(updateRequest.error);
        } else {
          reject(new Error('笔记不存在'));
        }
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async deleteNote(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(id);
      
      request.onsuccess = () => resolve({ success: true });
      request.onerror = () => reject(request.error);
    });
  }
}

// 初始化数据库
let notesDB;
const initDB = async () => {
  if (!notesDB) {
    notesDB = new NotesDatabase();
    await notesDB.init();
  }
  return notesDB;
};

// 笔记API（本地存储版本）
export const notesAPI = {
  // 获取所有笔记
  getAllNotes: async () => {
    try {
      const db = await initDB();
      const notes = await db.getAllNotes();
      return {
        success: true,
        data: notes
      };
    } catch (error) {
      throw new Error(`获取笔记失败: ${error.message}`);
    }
  },

  // 获取单个笔记
  getNote: async (id) => {
    try {
      const db = await initDB();
      const note = await db.getNote(id);
      return {
        success: true,
        data: note
      };
    } catch (error) {
      throw new Error(`获取笔记失败: ${error.message}`);
    }
  },

  // 创建笔记
  createNote: async (note) => {
    try {
      const db = await initDB();
      const newNote = await db.createNote(note);
      return {
        success: true,
        data: newNote
      };
    } catch (error) {
      throw new Error(`创建笔记失败: ${error.message}`);
    }
  },

  // 更新笔记
  updateNote: async (id, updates) => {
    try {
      const db = await initDB();
      const updatedNote = await db.updateNote(id, updates);
      return {
        success: true,
        data: updatedNote
      };
    } catch (error) {
      throw new Error(`更新笔记失败: ${error.message}`);
    }
  },

  // 删除笔记
  deleteNote: async (id) => {
    try {
      const db = await initDB();
      await db.deleteNote(id);
      return {
        success: true,
        message: '笔记已删除'
      };
    } catch (error) {
      throw new Error(`删除笔记失败: ${error.message}`);
    }
  }
};

// 设置API（本地存储版本）
const SETTINGS_KEY = 'notepad_settings';

export const settingsAPI = {
  // 获取设置
  getSettings: async () => {
    try {
      const settings = localStorage.getItem(SETTINGS_KEY);
      return {
        success: true,
        data: settings ? JSON.parse(settings) : {
          theme: 'light',
          fontSize: 14,
          autoSave: true,
          apiKey: '',
          defaultLanguage: 'zh-CN'
        }
      };
    } catch (error) {
      throw new Error(`获取设置失败: ${error.message}`);
    }
  },

  // 更新设置
  updateSettings: async (settings) => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      return {
        success: true,
        data: settings,
        message: '设置已更新'
      };
    } catch (error) {
      throw new Error(`更新设置失败: ${error.message}`);
    }
  },

  // 测试API密钥（模拟）
  testApiKey: async (apiKey) => {
    try {
      // 模拟API密钥验证
      await new Promise(resolve => setTimeout(resolve, 500));
      const isValid = apiKey && apiKey.length > 10;
      
      return {
        success: isValid,
        message: isValid ? 'API密钥有效' : 'API密钥无效',
        data: { valid: isValid }
      };
    } catch (error) {
      throw new Error(`API密钥测试失败: ${error.message}`);
    }
  }
};

export default {
  aiAPI,
  notesAPI,
  settingsAPI
};