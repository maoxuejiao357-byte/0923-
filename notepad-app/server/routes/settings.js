const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const OpenAI = require('openai');

const router = express.Router();

// 数据存储路径
const DATA_DIR = path.join(__dirname, '../data');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// 确保数据目录存在
fs.ensureDirSync(DATA_DIR);

// 默认设置
const DEFAULT_SETTINGS = {
  theme: 'light',
  editorSettings: {
    fontSize: 14,
    lineHeight: 1.5,
    wordWrap: true
  },
  aiSettings: {
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 1000
  },
  autoSave: true,
  autoSaveInterval: 30000, // 30秒
  backupEnabled: true,
  maxBackups: 10
};

// 读取设置
const readSettings = async () => {
  try {
    if (await fs.pathExists(SETTINGS_FILE)) {
      const settings = await fs.readJson(SETTINGS_FILE);
      // 合并默认设置，确保所有字段都存在
      return {
        ...DEFAULT_SETTINGS,
        ...settings,
        editorSettings: {
          ...DEFAULT_SETTINGS.editorSettings,
          ...settings.editorSettings
        },
        aiSettings: {
          ...DEFAULT_SETTINGS.aiSettings,
          ...settings.aiSettings
        }
      };
    }
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error('读取设置文件失败:', error);
    return DEFAULT_SETTINGS;
  }
};

// 写入设置
const writeSettings = async (settings) => {
  try {
    await fs.writeJson(SETTINGS_FILE, settings, { spaces: 2 });
    return true;
  } catch (error) {
    console.error('写入设置文件失败:', error);
    throw new Error('保存设置失败');
  }
};

// 验证设置数据
const validateSettings = (settings) => {
  const errors = [];
  
  // 验证主题
  if (settings.theme && !['light', 'dark', 'system'].includes(settings.theme)) {
    errors.push('主题设置无效');
  }
  
  // 验证编辑器设置
  if (settings.editorSettings) {
    const { fontSize, lineHeight, wordWrap } = settings.editorSettings;
    
    if (fontSize && (typeof fontSize !== 'number' || fontSize < 10 || fontSize > 30)) {
      errors.push('字体大小必须在10-30之间');
    }
    
    if (lineHeight && (typeof lineHeight !== 'number' || lineHeight < 1.0 || lineHeight > 3.0)) {
      errors.push('行高必须在1.0-3.0之间');
    }
    
    if (wordWrap !== undefined && typeof wordWrap !== 'boolean') {
      errors.push('自动换行设置必须是布尔值');
    }
  }
  
  // 验证AI设置
  if (settings.aiSettings) {
    const { model, temperature, maxTokens } = settings.aiSettings;
    
    if (model && !['gpt-3.5-turbo', 'gpt-4', 'gpt-4-turbo'].includes(model)) {
      errors.push('AI模型设置无效');
    }
    
    if (temperature !== undefined && (typeof temperature !== 'number' || temperature < 0 || temperature > 1)) {
      errors.push('温度参数必须在0-1之间');
    }
    
    if (maxTokens && (typeof maxTokens !== 'number' || maxTokens < 100 || maxTokens > 8000)) {
      errors.push('最大令牌数必须在100-8000之间');
    }
  }
  
  // 验证自动保存设置
  if (settings.autoSaveInterval && (typeof settings.autoSaveInterval !== 'number' || settings.autoSaveInterval < 5000)) {
    errors.push('自动保存间隔不能少于5秒');
  }
  
  return errors;
};

// 获取设置
router.get('/', async (req, res) => {
  try {
    const settings = await readSettings();
    
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取设置失败',
      message: error.message
    });
  }
});

// 更新设置
router.put('/', async (req, res) => {
  try {
    const newSettings = req.body;
    
    // 验证设置
    const validationErrors = validateSettings(newSettings);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: '设置验证失败',
        details: validationErrors
      });
    }
    
    // 读取当前设置
    const currentSettings = await readSettings();
    
    // 合并设置
    const updatedSettings = {
      ...currentSettings,
      ...newSettings,
      editorSettings: {
        ...currentSettings.editorSettings,
        ...newSettings.editorSettings
      },
      aiSettings: {
        ...currentSettings.aiSettings,
        ...newSettings.aiSettings
      },
      updatedAt: new Date().toISOString()
    };
    
    await writeSettings(updatedSettings);
    
    res.json({
      success: true,
      data: updatedSettings,
      message: '设置更新成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '更新设置失败',
      message: error.message
    });
  }
});

// 重置设置
router.post('/reset', async (req, res) => {
  try {
    const resetSettings = {
      ...DEFAULT_SETTINGS,
      updatedAt: new Date().toISOString()
    };
    
    await writeSettings(resetSettings);
    
    res.json({
      success: true,
      data: resetSettings,
      message: '设置已重置为默认值'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '重置设置失败',
      message: error.message
    });
  }
});

// 测试API密钥
router.post('/test-api-key', async (req, res) => {
  try {
    const { apiKey } = req.body;
    
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'API密钥不能为空'
      });
    }
    
    // 验证API密钥格式
    if (!apiKey.startsWith('sk-')) {
      return res.status(400).json({
        success: false,
        error: 'API密钥格式不正确，应以"sk-"开头'
      });
    }
    
    // 创建OpenAI客户端并测试
    const openai = new OpenAI({
      apiKey: apiKey.trim()
    });
    
    // 发送测试请求
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'user',
        content: '请回复"API密钥测试成功"'
      }],
      max_tokens: 20,
      temperature: 0
    });
    
    const response = completion.choices[0]?.message?.content;
    
    res.json({
      success: true,
      message: 'API密钥验证成功',
      data: {
        model: completion.model,
        usage: completion.usage,
        response: response
      }
    });
  } catch (error) {
    console.error('API密钥测试失败:', error);
    
    let errorMessage = 'API密钥验证失败';
    let statusCode = 401;
    
    if (error.code === 'invalid_api_key') {
      errorMessage = 'API密钥无效，请检查密钥是否正确';
    } else if (error.code === 'insufficient_quota') {
      errorMessage = 'API配额不足，请检查账户余额';
      statusCode = 402;
    } else if (error.code === 'rate_limit_exceeded') {
      errorMessage = 'API请求频率超限，请稍后再试';
      statusCode = 429;
    } else if (error.message && error.message.includes('network')) {
      errorMessage = '网络连接失败，请检查网络设置';
      statusCode = 503;
    } else if (error.message) {
      errorMessage = error.message;
      statusCode = 500;
    }
    
    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      code: error.code,
      details: process.env.NODE_ENV === 'development' ? {
        stack: error.stack,
        response: error.response?.data
      } : undefined
    });
  }
});

// 获取系统信息
router.get('/system-info', (req, res) => {
  try {
    const systemInfo = {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      env: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: systemInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取系统信息失败',
      message: error.message
    });
  }
});

// 导出设置
router.get('/export', async (req, res) => {
  try {
    const settings = await readSettings();
    
    // 移除敏感信息（如果有的话）
    const exportSettings = {
      ...settings,
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    };
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="notepad-settings.json"');
    res.json(exportSettings);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '导出设置失败',
      message: error.message
    });
  }
});

// 导入设置
router.post('/import', async (req, res) => {
  try {
    const importedSettings = req.body;
    
    if (!importedSettings || typeof importedSettings !== 'object') {
      return res.status(400).json({
        success: false,
        error: '导入数据格式不正确'
      });
    }
    
    // 验证导入的设置
    const validationErrors = validateSettings(importedSettings);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: '导入设置验证失败',
        details: validationErrors
      });
    }
    
    // 合并当前设置和导入设置
    const currentSettings = await readSettings();
    const mergedSettings = {
      ...currentSettings,
      ...importedSettings,
      editorSettings: {
        ...currentSettings.editorSettings,
        ...importedSettings.editorSettings
      },
      aiSettings: {
        ...currentSettings.aiSettings,
        ...importedSettings.aiSettings
      },
      importedAt: new Date().toISOString()
    };
    
    await writeSettings(mergedSettings);
    
    res.json({
      success: true,
      data: mergedSettings,
      message: '设置导入成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '导入设置失败',
      message: error.message
    });
  }
});

module.exports = router;