import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证token等
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || '请求失败';
    return Promise.reject(new Error(message));
  }
);

// AI服务API
export const aiAPI = {
  // 内容润色
  polish: async (content, apiKey) => {
    try {
      const response = await api.post('/ai/polish', {
        content,
        apiKey
      });
      return response;
    } catch (error) {
      throw new Error(`内容润色失败: ${error.message}`);
    }
  },

  // 内容改写
  rewrite: async (content, style, apiKey) => {
    try {
      const response = await api.post('/ai/rewrite', {
        content,
        style,
        apiKey
      });
      return response;
    } catch (error) {
      throw new Error(`内容改写失败: ${error.message}`);
    }
  },

  // 生成标签
  generateTags: async (content, apiKey) => {
    try {
      const response = await api.post('/ai/tags', {
        content,
        apiKey
      });
      return response;
    } catch (error) {
      throw new Error(`标签生成失败: ${error.message}`);
    }
  },

  // 语义搜索
  semanticSearch: async (query, notes, apiKey) => {
    try {
      const response = await api.post('/ai/search', {
        query,
        notes,
        apiKey
      });
      return response;
    } catch (error) {
      throw new Error(`语义搜索失败: ${error.message}`);
    }
  },

  // 智能摘要
  summarize: async (content, apiKey) => {
    try {
      const response = await api.post('/ai/summarize', {
        content,
        apiKey
      });
      return response;
    } catch (error) {
      throw new Error(`内容摘要失败: ${error.message}`);
    }
  },

  // 翻译
  translate: async (content, targetLanguage, apiKey) => {
    try {
      const response = await api.post('/ai/translate', {
        content,
        targetLanguage,
        apiKey
      });
      return response;
    } catch (error) {
      throw new Error(`翻译失败: ${error.message}`);
    }
  }
};

// 笔记API（如果需要同步到服务器）
export const notesAPI = {
  // 获取所有笔记
  getAllNotes: async () => {
    try {
      const response = await api.get('/notes');
      return response;
    } catch (error) {
      throw new Error(`获取笔记失败: ${error.message}`);
    }
  },

  // 获取单个笔记
  getNote: async (id) => {
    try {
      const response = await api.get(`/notes/${id}`);
      return response;
    } catch (error) {
      throw new Error(`获取笔记失败: ${error.message}`);
    }
  },

  // 创建笔记
  createNote: async (note) => {
    try {
      const response = await api.post('/notes', note);
      return response;
    } catch (error) {
      throw new Error(`创建笔记失败: ${error.message}`);
    }
  },

  // 更新笔记
  updateNote: async (id, updates) => {
    try {
      const response = await api.put(`/notes/${id}`, updates);
      return response;
    } catch (error) {
      throw new Error(`更新笔记失败: ${error.message}`);
    }
  },

  // 删除笔记
  deleteNote: async (id) => {
    try {
      const response = await api.delete(`/notes/${id}`);
      return response;
    } catch (error) {
      throw new Error(`删除笔记失败: ${error.message}`);
    }
  }
};

// 设置API
export const settingsAPI = {
  // 获取设置
  getSettings: async () => {
    try {
      const response = await api.get('/settings');
      return response;
    } catch (error) {
      throw new Error(`获取设置失败: ${error.message}`);
    }
  },

  // 更新设置
  updateSettings: async (settings) => {
    try {
      const response = await api.put('/settings', settings);
      return response;
    } catch (error) {
      throw new Error(`更新设置失败: ${error.message}`);
    }
  },

  // 测试API密钥
  testApiKey: async (apiKey) => {
    try {
      const response = await api.post('/settings/test-api-key', { apiKey });
      return response;
    } catch (error) {
      throw new Error(`API密钥测试失败: ${error.message}`);
    }
  }
};

export default api;