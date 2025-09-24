# AI增强型记事本应用

一个集成OpenAI API的智能记事本Web应用，支持内容润色、改写、自动标签生成和语义搜索功能。

## 功能特性

- 📝 **笔记管理**: 创建、编辑、删除笔记
- 🤖 **AI辅助**: 内容润色、文本改写
- 🏷️ **智能标签**: 基于AI的自动标签生成
- 🔍 **语义搜索**: AI驱动的智能搜索
- 💾 **本地存储**: 基于IndexedDB的持久化存储
- 🎨 **现代UI**: 基于Chakra UI的美观界面

## 技术栈

### 前端
- React.js
- Chakra UI
- Dexie.js (IndexedDB)
- React MD Editor

### 后端
- Express.js
- OpenAI API
- Node.js

## 快速开始

### 1. 安装依赖
```bash
npm run install-all
```

### 2. 配置环境变量
在 `server` 目录下创建 `.env` 文件：
```
OPENAI_API_KEY=your_openai_api_key_here
PORT=5000
```

### 3. 启动应用
```bash
npm run dev
```

应用将在以下地址运行：
- 前端: http://localhost:3000
- 后端: http://localhost:5000

## 项目结构

```
记事本/
├── client/          # React前端应用
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── utils/
│   └── public/
├── server/          # Express后端API
│   ├── routes/
│   ├── services/
│   └── data/
└── README.md
```

## API接口

### 笔记管理
- `GET /api/notes` - 获取所有笔记
- `POST /api/notes` - 创建新笔记
- `PUT /api/notes/:id` - 更新笔记
- `DELETE /api/notes/:id` - 删除笔记

### AI功能
- `POST /api/ai/polish` - 内容润色
- `POST /api/ai/rewrite` - 内容改写
- `POST /api/ai/tags` - 生成标签
- `POST /api/ai/search` - 语义搜索

## 使用说明

1. 首次使用需要在设置中配置OpenAI API密钥
2. 在左侧面板创建或选择笔记
3. 在中间编辑区编写内容
4. 使用右侧AI面板进行内容优化
5. 通过搜索功能快速找到相关笔记

## 许可证

MIT License