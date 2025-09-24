const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// 数据存储路径
const DATA_DIR = path.join(__dirname, '../data');
const NOTES_FILE = path.join(DATA_DIR, 'notes.json');

// 确保数据目录存在
fs.ensureDirSync(DATA_DIR);

// 读取笔记数据
const readNotes = async () => {
  try {
    if (await fs.pathExists(NOTES_FILE)) {
      const data = await fs.readJson(NOTES_FILE);
      return Array.isArray(data) ? data : [];
    }
    return [];
  } catch (error) {
    console.error('读取笔记文件失败:', error);
    return [];
  }
};

// 写入笔记数据
const writeNotes = async (notes) => {
  try {
    await fs.writeJson(NOTES_FILE, notes, { spaces: 2 });
    return true;
  } catch (error) {
    console.error('写入笔记文件失败:', error);
    throw new Error('保存笔记失败');
  }
};

// 验证笔记数据
const validateNote = (note) => {
  const errors = [];
  
  if (!note.title || typeof note.title !== 'string') {
    errors.push('标题不能为空');
  }
  
  if (note.title && note.title.length > 200) {
    errors.push('标题长度不能超过200字符');
  }
  
  if (note.content && typeof note.content !== 'string') {
    errors.push('内容格式不正确');
  }
  
  if (note.content && note.content.length > 100000) {
    errors.push('内容长度不能超过100000字符');
  }
  
  if (note.tags && !Array.isArray(note.tags)) {
    errors.push('标签格式不正确');
  }
  
  if (note.tags && note.tags.some(tag => typeof tag !== 'string' || tag.length > 50)) {
    errors.push('标签格式不正确或长度超过50字符');
  }
  
  return errors;
};

// 获取所有笔记
router.get('/', async (req, res) => {
  try {
    const notes = await readNotes();
    
    // 按更新时间倒序排列
    const sortedNotes = notes.sort((a, b) => 
      new Date(b.updatedAt) - new Date(a.updatedAt)
    );
    
    res.json({
      success: true,
      data: sortedNotes,
      total: sortedNotes.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取笔记失败',
      message: error.message
    });
  }
});

// 根据ID获取单个笔记
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const notes = await readNotes();
    const note = notes.find(n => n.id === id);
    
    if (!note) {
      return res.status(404).json({
        success: false,
        error: '笔记不存在'
      });
    }
    
    res.json({
      success: true,
      data: note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取笔记失败',
      message: error.message
    });
  }
});

// 创建新笔记
router.post('/', async (req, res) => {
  try {
    const { title, content = '', tags = [] } = req.body;
    
    // 验证数据
    const validationErrors = validateNote({ title, content, tags });
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: '数据验证失败',
        details: validationErrors
      });
    }
    
    const notes = await readNotes();
    const now = new Date().toISOString();
    
    const newNote = {
      id: uuidv4(),
      title: title.trim(),
      content: content.trim(),
      tags: tags.filter(tag => tag && tag.trim()).map(tag => tag.trim()),
      createdAt: now,
      updatedAt: now
    };
    
    notes.push(newNote);
    await writeNotes(notes);
    
    res.status(201).json({
      success: true,
      data: newNote,
      message: '笔记创建成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '创建笔记失败',
      message: error.message
    });
  }
});

// 更新笔记
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, tags } = req.body;
    
    // 验证数据
    const validationErrors = validateNote({ title, content, tags });
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        error: '数据验证失败',
        details: validationErrors
      });
    }
    
    const notes = await readNotes();
    const noteIndex = notes.findIndex(n => n.id === id);
    
    if (noteIndex === -1) {
      return res.status(404).json({
        success: false,
        error: '笔记不存在'
      });
    }
    
    // 更新笔记
    const updatedNote = {
      ...notes[noteIndex],
      title: title.trim(),
      content: content.trim(),
      tags: tags.filter(tag => tag && tag.trim()).map(tag => tag.trim()),
      updatedAt: new Date().toISOString()
    };
    
    notes[noteIndex] = updatedNote;
    await writeNotes(notes);
    
    res.json({
      success: true,
      data: updatedNote,
      message: '笔记更新成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '更新笔记失败',
      message: error.message
    });
  }
});

// 删除笔记
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const notes = await readNotes();
    const noteIndex = notes.findIndex(n => n.id === id);
    
    if (noteIndex === -1) {
      return res.status(404).json({
        success: false,
        error: '笔记不存在'
      });
    }
    
    const deletedNote = notes[noteIndex];
    notes.splice(noteIndex, 1);
    await writeNotes(notes);
    
    res.json({
      success: true,
      data: deletedNote,
      message: '笔记删除成功'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '删除笔记失败',
      message: error.message
    });
  }
});

// 搜索笔记
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const notes = await readNotes();
    
    if (!query || query.trim().length === 0) {
      return res.json({
        success: true,
        data: [],
        total: 0
      });
    }
    
    const searchTerm = query.toLowerCase().trim();
    const filteredNotes = notes.filter(note => {
      return (
        note.title.toLowerCase().includes(searchTerm) ||
        note.content.toLowerCase().includes(searchTerm) ||
        note.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    });
    
    // 按相关性排序（标题匹配优先）
    const sortedNotes = filteredNotes.sort((a, b) => {
      const aTitle = a.title.toLowerCase().includes(searchTerm);
      const bTitle = b.title.toLowerCase().includes(searchTerm);
      
      if (aTitle && !bTitle) return -1;
      if (!aTitle && bTitle) return 1;
      
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
    
    res.json({
      success: true,
      data: sortedNotes,
      total: sortedNotes.length,
      query: searchTerm
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '搜索失败',
      message: error.message
    });
  }
});

// 获取所有标签
router.get('/tags/all', async (req, res) => {
  try {
    const notes = await readNotes();
    const tagCounts = {};
    
    notes.forEach(note => {
      note.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    const tags = Object.entries(tagCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
    
    res.json({
      success: true,
      data: tags,
      total: tags.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: '获取标签失败',
      message: error.message
    });
  }
});

module.exports = router;