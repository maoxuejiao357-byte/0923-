const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const notesRoutes = require('./routes/notes');
const aiRoutes = require('./routes/ai');
const settingsRoutes = require('./routes/settings');

const app = express();
const PORT = process.env.PORT || 3004;

// 中间件
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 路由
app.use('/api/notes', notesRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/settings', settingsRoutes);

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // OpenAI API错误
  if (err.response && err.response.data) {
    return res.status(err.response.status || 500).json({
      error: 'AI服务错误',
      message: err.response.data.error?.message || err.message,
      details: process.env.NODE_ENV === 'development' ? err.response.data : undefined
    });
  }
  
  // 通用错误
  res.status(err.status || 500).json({
    error: err.message || '服务器内部错误',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    error: '接口不存在',
    path: req.originalUrl
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`\n🚀 服务器启动成功!`);
  console.log(`📍 端口: ${PORT}`);
  console.log(`🌐 本地访问: http://localhost:${PORT}`);
  console.log(`📊 健康检查: http://localhost:${PORT}/api/health`);
  console.log(`⏰ 启动时间: ${new Date().toLocaleString()}\n`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('\n🛑 收到SIGTERM信号，正在关闭服务器...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n🛑 收到SIGINT信号，正在关闭服务器...');
  process.exit(0);
});

module.exports = app;