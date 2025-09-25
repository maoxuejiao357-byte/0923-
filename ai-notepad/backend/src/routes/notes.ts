import { Router } from 'express';
import { Op } from 'sequelize';
// import { Note } from '../models/Note';
// import { validateNote } from '../middleware/validation';

const router = Router();

// 获取所有笔记
router.get('/', async (req, res) => {
  try {
    // TODO: 实现数据库模型后启用
    // const notes = await Note.findAll({
    //   order: [['updatedAt', 'DESC']]
    // });
    res.json([]);
  } catch (error) {
    console.error('获取笔记失败:', error);
    res.status(500).json({ error: '获取笔记失败' });
  }
});

// 根据ID获取笔记
router.get('/:id', async (req, res) => {
  try {
    // TODO: 实现数据库模型后启用
    // const note = await Note.findByPk(req.params.id);
    // if (!note) {
    //   return res.status(404).json({ error: '笔记不存在' });
    // }
    // res.json(note);
    res.status(404).json({ error: '笔记不存在' });
  } catch (error) {
    console.error('获取笔记失败:', error);
    res.status(500).json({ error: '获取笔记失败' });
  }
});

// 创建新笔记
router.post('/', async (req, res) => {
  try {
    // TODO: 实现数据库模型后启用
    // const note = await Note.create(req.body);
    // res.status(201).json(note);
    res.status(501).json({ error: '功能暂未实现' });
  } catch (error) {
    console.error('创建笔记失败:', error);
    res.status(500).json({ error: '创建笔记失败' });
  }
});

// 更新笔记
router.put('/:id', async (req, res) => {
  try {
    // TODO: 实现数据库模型后启用
    // const note = await Note.findByPk(req.params.id);
    // if (!note) {
    //   return res.status(404).json({ error: '笔记不存在' });
    // }
    // await note.update(req.body);
    // res.json(note);
    res.status(501).json({ error: '功能暂未实现' });
  } catch (error) {
    console.error('更新笔记失败:', error);
    res.status(500).json({ error: '更新笔记失败' });
  }
});

// 删除笔记
router.delete('/:id', async (req, res) => {
  try {
    // TODO: 实现数据库模型后启用
    // const note = await Note.findByPk(req.params.id);
    // if (!note) {
    //   return res.status(404).json({ error: '笔记不存在' });
    // }
    // await note.destroy();
    // res.status(204).send();
    res.status(501).json({ error: '功能暂未实现' });
  } catch (error) {
    console.error('删除笔记失败:', error);
    res.status(500).json({ error: '删除笔记失败' });
  }
});

// 搜索笔记
router.get('/search/:query', async (req, res) => {
  try {
    // TODO: 实现数据库模型后启用
    // const { query } = req.params;
    // const notes = await Note.findAll({
    //   where: {
    //     [Op.or]: [
    //       { title: { [Op.like]: `%${query}%` } },
    //       { content: { [Op.like]: `%${query}%` } },
    //       { tags: { [Op.like]: `%${query}%` } }
    //     ]
    //   },
    //   order: [['updatedAt', 'DESC']]
    // });
    res.json([]);
  } catch (error) {
    console.error('搜索笔记失败:', error);
    res.status(500).json({ error: '搜索笔记失败' });
  }
});

export default router;