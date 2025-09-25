import { Sequelize } from 'sequelize'
import path from 'path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 数据库文件路径
const dbPath = path.join(__dirname, '../../data/notepad.db')

// 创建Sequelize实例
export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

// 测试数据库连接
export async function testConnection() {
  try {
    await sequelize.authenticate()
    console.log('数据库连接测试成功')
    return true
  } catch (error) {
    console.error('数据库连接失败:', error)
    return false
  }
}

export default sequelize