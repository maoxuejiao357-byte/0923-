import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import { sequelize } from './config/database'
import notesRouter from './routes/notes'
import aiRouter from './routes/ai'
import settingsRouter from './routes/settings'
// 导入错误处理中间件
import { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

export default errorHandler;
import { requestLogger } from './middleware/requestLogger'

// 加载环境变量
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5001

// 中间件
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(morgan('combined'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(requestLogger)

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// API路由
app.use('/api/notes', notesRouter)
app.use('/api/ai', aiRouter)
app.use('/api/settings', settingsRouter)

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' })
})

// 错误处理中间件
app.use(errorHandler)

// 启动服务器
async function startServer() {
  try {
    // 同步数据库
    await sequelize.sync({ force: false })
    console.log('数据库连接成功')
    
    app.listen(PORT, () => {
      console.log(`服务器运行在端口 ${PORT}`)
      console.log(`健康检查: http://localhost:${PORT}/health`)
    })
  } catch (error) {
    console.error('服务器启动失败:', error)
    process.exit(1)
  }
}

startServer()

export { app }
