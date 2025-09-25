# AI智能记事本 - 纯前端版本

一个功能完整的AI增强记事本Web应用，纯前端实现，支持本地存储和AI功能。

## 🚀 功能特性

### 核心功能
- ✅ **笔记管理**: 创建、编辑、删除笔记
- ✅ **本地存储**: 使用localStorage持久化存储
- ✅ **搜索功能**: 实时搜索笔记标题、内容和标签
- ✅ **标签系统**: 支持多标签分类
- ✅ **导入导出**: JSON格式数据备份和恢复

### AI功能（模拟实现）
- ✅ **智能标签**: 基于内容自动生成标签
- ✅ **文本润色**: 优化文本格式和表达
- ✅ **内容摘要**: 生成内容摘要
- ✅ **文本改写**: 支持多种风格改写
- ✅ **翻译功能**: 多语言翻译（模拟）

### 用户体验
- ✅ **自动保存**: 30秒自动保存机制
- ✅ **快捷键支持**: Ctrl+S保存，Ctrl+Enter新建
- ✅ **响应式设计**: 适配移动端和桌面端
- ✅ **现代UI**: 毛玻璃效果和渐变设计
- ✅ **暗色主题**: 自动适配系统主题

## 🛠️ 技术特点

- **纯前端实现**: 无需后端服务器
- **模块化设计**: 清晰的代码结构
- **本地存储**: 使用localStorage和IndexedDB
- **现代CSS**: Flexbox布局和CSS Grid
- **ES6+特性**: 使用现代JavaScript语法
- **无障碍设计**: 良好的可访问性

## 📁 文件结构

```
ai-notepad-simple/
├── index.html          # 主页面
├── styles.css          # 样式文件
├── app.js             # 核心JavaScript逻辑
├── vercel.json        # Vercel部署配置
└── README.md          # 项目说明
```

## 🚀 快速部署

### 方法1：Vercel一键部署
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/ai-notepad-simple)

### 方法2：手动部署到Vercel
1. 访问 [Vercel](https://vercel.com)
2. 导入此GitHub仓库
3. 配置：
   - 框架：静态网站
   - 输出目录：当前目录
4. 点击部署

### 方法3：本地运行
```bash
# 克隆或直接下载文件
# 在浏览器中打开 index.html
# 或使用本地服务器
python -m http.server 8000
```

## 🎯 使用说明

### 基本操作
1. **新建笔记**: 点击"➕ 新建笔记"按钮
2. **编辑内容**: 在右侧编辑器中输入标题和内容
3. **添加标签**: 在标签输入框中输入标签名称，按回车或点击"添加"
4. **保存笔记**: 点击"💾 保存"按钮或使用 Ctrl+S
5. **搜索笔记**: 在顶部搜索框中输入关键词

### AI功能使用
1. **生成标签**: 输入内容后点击"🏷️ 生成标签"
2. **文本润色**: 选择文本后点击"✨ 润色文本"
3. **生成摘要**: 点击"📋 生成摘要"获取内容摘要
4. **AI助手**: 使用右侧面板选择AI功能

### 快捷键
- `Ctrl + S`: 保存当前笔记
- `Ctrl + Enter`: 创建新笔记
- `Enter`: 在标签输入框中添加标签

## 🔧 开发说明

### 核心类和方法
```javascript
class NotepadApp {
    createNewNote()      // 创建新笔记
    saveNote()           // 保存笔记
    selectNote(id)       // 选择笔记
    searchNotes(query)   // 搜索笔记
    generateTags()       // AI生成标签
    polishContent()      // 文本润色
    summarizeContent()   // 生成摘要
}
```

### 数据存储结构
```javascript
{
    id: 1234567890,
    title: "笔记标题",
    content: "笔记内容",
    tags: ["标签1", "标签2"],
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z"
}
```

## 🎨 设计特色

- **毛玻璃效果**: 使用backdrop-filter实现现代化界面
- **渐变背景**: 美观的渐变色设计
- **动画效果**: 平滑的过渡和微交互
- **响应式布局**: 完美适配各种设备尺寸
- **主题适配**: 自动支持暗色主题

## 📱 兼容性

- **现代浏览器**: Chrome, Firefox, Safari, Edge
- **移动设备**: iOS Safari, Android Chrome
- **桌面端**: Windows, macOS, Linux

## 🔒 隐私说明

- **本地存储**: 所有数据存储在浏览器本地
- **无网络请求**: 纯前端实现，无需服务器
- **数据安全**: 数据完全由用户控制

## 🐛 已知问题

- 大量数据时可能影响性能
- 浏览器本地存储有大小限制（约5-10MB）
- 不支持多设备同步

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 📄 许可证

MIT License - 详见LICENSE文件

---

**享受您的AI智能记事本！🚀**