# Trae Projects Collection

这是一个包含多个Web应用项目的综合仓库，展示了不同类型的前端和后端技术应用。

## 🎯 项目列表

### 1. 四象限Todo List应用 (`todo-list/`)
- **技术栈**: HTML, CSS, JavaScript
- **功能**: 基于四象限法则的任务管理系统
- **特色**: 
  - P1-P4优先级分类
  - 任务搜索和筛选
  - 记事本功能
  - 响应式设计

### 2. AI增强型记事本应用 (`ai-notepad/`)
- **技术栈**: React + TypeScript + Express + OpenAI API
- **功能**: 集成AI功能的智能记事本
- **特色**:
  - OpenAI API集成
  - 内容润色和改写
  - 智能标签生成
  - 语义搜索功能

### 3. HTML转图片工具 (`html-to-image-tool/`)
- **技术栈**: React + Vite + html2canvas
- **功能**: 将HTML代码转换为图片
- **特色**:
  - 实时代码编辑
  - 预览功能
  - 多种导出格式
  - 现代化UI界面

### 4. 记事本应用 (`notepad-app/`)
- **技术栈**: React + Node.js
- **功能**: 功能完整的记事本应用
- **特色**:
  - 本地存储
  - 分类管理
  - 搜索功能

## 🚀 快速开始

每个项目都有独立的目录结构和说明文档，可以单独运行。

### 通用依赖安装
```bash
# 进入具体项目目录
cd [project-name]

# 安装依赖（如果有package.json）
npm install

# 启动开发服务器
npm run dev
```

## 📁 项目结构
```
tra-projects/
├── README.md                    # 项目总览
├── todo-list/                   # 四象限Todo List
│   ├── index.html
│   ├── script.js
│   ├── styles.css
│   └── 你给出的需求和设计思路已经很清晰，有非常丰富的功能点和结构.md
├── ai-notepad/                  # AI增强记事本
│   ├── backend/                 # Express后端
│   ├── frontend/                # React前端
│   └── docs/
├── html-to-image-tool/          # HTML转图片工具
│   ├── index.html
│   ├── src/
│   ├── package.json
│   └── ...
└── notepad-app/                 # 记事本应用
    ├── client/                  # React客户端
    └── server/                  # Node.js服务器
```

## 🛠️ 技术特点

- **现代化前端**: React, TypeScript, Vanilla JS, HTML/CSS
- **后端服务**: Express.js, Node.js
- **AI集成**: OpenAI API
- **数据存储**: SQLite, IndexedDB, LocalStorage
- **UI框架**: Chakra UI, Tailwind CSS
- **构建工具**: Vite, Webpack

## 📋 功能对比

| 项目 | 前端技术 | 后端技术 | AI功能 | 数据存储 | 主要功能 |
|------|----------|----------|--------|----------|----------|
| Todo List | Vanilla JS | - | ❌ | LocalStorage | 任务管理 |
| AI Notepad | React + TS | Express + TS | ✅ | SQLite | 智能记事本 |
| HTML to Image | React | - | ❌ | - | HTML转图片 |
| Notepad App | React | Node.js | ❌ | IndexedDB | 记事本 |

## 🎯 使用建议

1. **学习参考**: 每个项目都展示了不同的技术栈组合
2. **功能对比**: 可以对比不同技术方案的实现差异
3. **代码复用**: 可以在不同项目间复用组件和逻辑
4. **扩展开发**: 基于现有项目进行功能扩展

## 🔧 开发环境要求

- Node.js 16+
- npm 或 yarn
- 现代浏览器
- Git

## 📄 许可证

MIT License - 详见各项目目录

---

*这些项目展示了从前端基础到全栈开发的完整技术链条，适合作为学习和参考的范例。*