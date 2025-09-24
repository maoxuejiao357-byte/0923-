const express = require('express');
const OpenAI = require('openai');

const router = express.Router();

// 创建OpenAI客户端实例
const createOpenAIClient = (apiKey) => {
  if (!apiKey) {
    throw new Error('API密钥不能为空');
  }
  
  return new OpenAI({
    apiKey: apiKey
  });
};

// 验证API密钥中间件
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.body.apiKey;
  
  if (!apiKey) {
    return res.status(400).json({
      success: false,
      error: '缺少API密钥',
      message: '请在请求头中提供x-api-key或在请求体中提供apiKey'
    });
  }
  
  req.apiKey = apiKey;
  next();
};

// 通用AI请求处理函数
const handleAIRequest = async (req, res, prompt, options = {}) => {
  try {
    const openai = createOpenAIClient(req.apiKey);
    
    const completion = await openai.chat.completions.create({
      model: options.model || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: options.systemPrompt || '你是一个专业的文本处理助手。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    });
    
    const result = completion.choices[0]?.message?.content?.trim();
    
    if (!result) {
      throw new Error('AI服务返回空结果');
    }
    
    res.json({
      success: true,
      data: {
        result,
        usage: completion.usage,
        model: completion.model
      }
    });
  } catch (error) {
    console.error('AI请求失败:', error);
    
    let errorMessage = 'AI服务请求失败';
    let statusCode = 500;
    
    if (error.code === 'invalid_api_key') {
      errorMessage = 'API密钥无效';
      statusCode = 401;
    } else if (error.code === 'insufficient_quota') {
      errorMessage = 'API配额不足';
      statusCode = 402;
    } else if (error.code === 'rate_limit_exceeded') {
      errorMessage = 'API请求频率超限';
      statusCode = 429;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      code: error.code,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// 测试API密钥
router.post('/test', validateApiKey, async (req, res) => {
  try {
    const openai = createOpenAIClient(req.apiKey);
    
    // 发送一个简单的测试请求
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'user',
        content: '请回复"测试成功"'
      }],
      max_tokens: 10
    });
    
    res.json({
      success: true,
      message: 'API密钥验证成功',
      data: {
        model: completion.model,
        usage: completion.usage
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
    } else if (error.message) {
      errorMessage = error.message;
      statusCode = 500;
    }
    
    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      code: error.code
    });
  }
});

// 文本润色
router.post('/polish', validateApiKey, async (req, res) => {
  const { text, model, temperature, maxTokens } = req.body;
  
  if (!text || text.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: '文本内容不能为空'
    });
  }
  
  const prompt = `请对以下文本进行润色，使其更加流畅、准确和优雅，保持原意不变：\n\n${text}`;
  
  await handleAIRequest(req, res, prompt, {
    model,
    temperature,
    maxTokens,
    systemPrompt: '你是一个专业的文本润色助手，擅长改善文本的表达方式，使其更加流畅和优雅。'
  });
});

// 文本改写
router.post('/rewrite', validateApiKey, async (req, res) => {
  const { text, style, model, temperature, maxTokens } = req.body;
  
  if (!text || text.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: '文本内容不能为空'
    });
  }
  
  let stylePrompt = '';
  switch (style) {
    case 'formal':
      stylePrompt = '，使用正式、专业的语言风格';
      break;
    case 'casual':
      stylePrompt = '，使用轻松、随意的语言风格';
      break;
    case 'academic':
      stylePrompt = '，使用学术、严谨的语言风格';
      break;
    case 'creative':
      stylePrompt = '，使用创意、生动的语言风格';
      break;
    default:
      stylePrompt = '';
  }
  
  const prompt = `请重新改写以下文本${stylePrompt}，保持核心意思不变但表达方式要有所不同：\n\n${text}`;
  
  await handleAIRequest(req, res, prompt, {
    model,
    temperature,
    maxTokens,
    systemPrompt: '你是一个专业的文本改写助手，能够根据不同的风格要求重新表达文本内容。'
  });
});

// 生成标签
router.post('/generate-tags', validateApiKey, async (req, res) => {
  const { text, maxTags = 5, model, temperature, maxTokens } = req.body;
  
  if (!text || text.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: '文本内容不能为空'
    });
  }
  
  const prompt = `请为以下文本生成${maxTags}个相关的标签，标签应该简洁明了，能够概括文本的主要内容和主题。请只返回标签，用逗号分隔：\n\n${text}`;
  
  try {
    const openai = createOpenAIClient(req.apiKey);
    
    const completion = await openai.chat.completions.create({
      model: model || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的内容标签生成助手，能够准确识别文本的关键主题并生成相关标签。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: temperature || 0.3,
      max_tokens: maxTokens || 100
    });
    
    const result = completion.choices[0]?.message?.content?.trim();
    
    if (!result) {
      throw new Error('AI服务返回空结果');
    }
    
    // 解析标签
    const tags = result
      .split(/[,，、]/) // 支持中英文逗号和顿号
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0 && tag.length <= 20) // 过滤空标签和过长标签
      .slice(0, maxTags); // 限制标签数量
    
    res.json({
      success: true,
      data: {
        tags,
        usage: completion.usage,
        model: completion.model
      }
    });
  } catch (error) {
    console.error('生成标签失败:', error);
    
    let errorMessage = '生成标签失败';
    let statusCode = 500;
    
    if (error.code === 'invalid_api_key') {
      errorMessage = 'API密钥无效';
      statusCode = 401;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      code: error.code
    });
  }
});

// 语义搜索（简化版，基于关键词扩展）
router.post('/semantic-search', validateApiKey, async (req, res) => {
  const { query, model, temperature, maxTokens } = req.body;
  
  if (!query || query.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: '搜索查询不能为空'
    });
  }
  
  const prompt = `请为搜索查询"${query}"生成相关的关键词和同义词，用于扩展搜索范围。请只返回关键词，用逗号分隔，不要包含原查询词：`;
  
  try {
    const openai = createOpenAIClient(req.apiKey);
    
    const completion = await openai.chat.completions.create({
      model: model || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: '你是一个专业的搜索助手，能够为用户的搜索查询生成相关的关键词和同义词。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: temperature || 0.3,
      max_tokens: maxTokens || 200
    });
    
    const result = completion.choices[0]?.message?.content?.trim();
    
    if (!result) {
      throw new Error('AI服务返回空结果');
    }
    
    // 解析关键词
    const keywords = result
      .split(/[,，、]/) // 支持中英文逗号和顿号
      .map(keyword => keyword.trim())
      .filter(keyword => keyword.length > 0 && keyword.length <= 50)
      .slice(0, 10); // 限制关键词数量
    
    res.json({
      success: true,
      data: {
        originalQuery: query,
        expandedKeywords: keywords,
        usage: completion.usage,
        model: completion.model
      }
    });
  } catch (error) {
    console.error('语义搜索失败:', error);
    
    let errorMessage = '语义搜索失败';
    let statusCode = 500;
    
    if (error.code === 'invalid_api_key') {
      errorMessage = 'API密钥无效';
      statusCode = 401;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      code: error.code
    });
  }
});

// 文本摘要
router.post('/summarize', validateApiKey, async (req, res) => {
  const { text, length = 'medium', model, temperature, maxTokens } = req.body;
  
  if (!text || text.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: '文本内容不能为空'
    });
  }
  
  let lengthPrompt = '';
  switch (length) {
    case 'short':
      lengthPrompt = '简短的';
      break;
    case 'medium':
      lengthPrompt = '中等长度的';
      break;
    case 'long':
      lengthPrompt = '详细的';
      break;
    default:
      lengthPrompt = '中等长度的';
  }
  
  const prompt = `请为以下文本生成一个${lengthPrompt}摘要，突出主要观点和关键信息：\n\n${text}`;
  
  await handleAIRequest(req, res, prompt, {
    model,
    temperature: temperature || 0.3,
    maxTokens,
    systemPrompt: '你是一个专业的文本摘要助手，能够准确提取文本的核心内容并生成简洁明了的摘要。'
  });
});

// 文本翻译
router.post('/translate', validateApiKey, async (req, res) => {
  const { text, targetLanguage = 'English', model, temperature, maxTokens } = req.body;
  
  if (!text || text.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: '文本内容不能为空'
    });
  }
  
  const prompt = `请将以下文本翻译成${targetLanguage}：\n\n${text}`;
  
  await handleAIRequest(req, res, prompt, {
    model,
    temperature: temperature || 0.3,
    maxTokens,
    systemPrompt: '你是一个专业的翻译助手，能够准确地在不同语言之间进行翻译，保持原文的意思和语调。'
  });
});

module.exports = router;