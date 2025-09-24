### 🤖 Assistant



# AI增强型记事本应用需求文档

## 1. 项目/功能概述 (Overview)
开发一个AI增强型个人记事本Web应用，集成OpenAI API实现内容润色、改写、自动标签和语义搜索功能，采用经典三栏布局，支持本地持久化存储。

## 2. 核心功能点 (Core Features)
- 笔记创建、编辑和管理
- AI辅助功能：内容润色、文本改写
- 自动标签生成（基于AI分析笔记内容）
- 语义搜索（基于AI理解查询意图）
- OpenAI API密钥管理（后台设置）
- 本地持久化存储

## 3. 技术规格 (Technical Specifications)

### 前端 (Frontend)

#### 页面/组件 (Pages/Components)
1. **主页面**：三栏布局
   - 左栏：笔记列表/标签列表切换视图
   - 中栏：当前选中笔记的内容编辑区
   - 右栏：AI功能面板（可折叠）
2. **设置面板**：管理API密钥和应用设置（作为弹出层）
3. **核心组件**：
   - 笔记列表组件
   - 标签云/标签列表组件
   - 富文本编辑器组件
   - AI功能操作面板组件
   - 搜索组件（支持普通搜索和语义搜索）

#### 用户流程 (User Flow)
1. 用户打开应用，看到现有笔记列表
2. 用户可以创建新笔记或选择现有笔记
3. 编辑笔记内容
4. 使用AI功能按钮触发润色/改写/标签生成
5. 使用搜索功能查找相关笔记
6. 通过设置按钮管理API密钥

#### 数据交互 (Data Interaction)
- 从本地存储加载笔记数据
- 编辑后自动保存到本地存储
- AI功能触发时，将相关内容发送到后端，后端调用OpenAI API
- 接收并显示AI处理结果

### 后端 (Backend)

#### API 接口 (API Endpoints)
1. **笔记管理**
   - `GET /api/notes` - 获取所有笔记
   - `GET /api/notes/:id` - 获取单个笔记
   - `POST /api/notes` - 创建新笔记
   - `PUT /api/notes/:id` - 更新笔记
   - `DELETE /api/notes/:id` - 删除笔记

2. **AI功能**
   - `POST /api/ai/polish` - 内容润色（发送笔记内容，返回润色后的内容）
   - `POST /api/ai/rewrite` - 内容改写（发送笔记内容，返回改写后的内容）
   - `POST /api/ai/tags` - 生成标签（分析笔记内容，返回推荐标签）
   - `POST /api/ai/search` - 语义搜索（发送搜索查询，返回相关笔记）

3. **设置管理**
   - `GET /api/settings` - 获取应用设置（包括API密钥）
   - `PUT /api/settings` - 更新应用设置

#### 数据模型 (Data Models)
1. **笔记 (Note)**
   ```
   {
     id: String, // 唯一标识符
     title: String, // 笔记标题
     content: String, // 笔记内容
     tags: Array<String>, // 标签列表
     createdAt: Date, // 创建时间
     updatedAt: Date // 最后更新时间
   }
   ```

2. **应用设置 (Settings)**
   ```
   {
     apiKey: String, // OpenAI API密钥
     theme: String, // 应用主题
     editorSettings: Object // 编辑器设置
   }
   ```

## 4. 技术栈建议 (Tech Stack Suggestion)

### 前端
- **框架**: React.js（易学且生态丰富）
- **UI库**: Chakra UI 或 Ant Design（提供现成的组件）
- **状态管理**: React Context API + useReducer（简单应用无需Redux）
- **编辑器**: Slate.js 或 TinyMCE（可定制的富文本编辑器）
- **本地存储**: IndexedDB（通过Dexie.js简化操作，支持大量结构化数据）

### 后端
- **框架**: Express.js（Node.js的轻量级框架）
- **AI集成**: OpenAI Node.js SDK
- **数据存储**: 本地文件系统（JSON文件）或 SQLite（轻量级数据库）

## 5. 开发步骤建议 (Development Steps)

### 阶段1: 基础功能搭建
1. 设置项目结构，安装必要依赖
2. 实现前端基础三栏布局
3. 创建基本的笔记编辑功能
4. 实现本地存储（保存/加载笔记）
5. 开发后端基础API（笔记CRUD操作）

### 阶段2: AI功能集成
1. 实现OpenAI API密钥管理
2. 开发内容润色API端点
3. 开发内容改写API端点
4. 实现自动标签生成功能
5. 实现语义搜索功能

### 阶段3: UI/UX完善
1. 美化用户界面
2. 添加交互动画和反馈
3. 实现右侧AI面板的折叠/展开
4. 优化移动端响应式布局
5. 添加键盘快捷键

### 阶段4: 测试与优化
1. 进行功能测试
2. 优化API调用（添加缓存、限流等）
3. 性能优化（大型笔记的加载和编辑）
4. 错误处理和边缘情况
5. 最终调整和完善

## 额外建议

1. **本地开发环境**：可以使用Electron打包这个Web应用，使其成为桌面应用，更便于本地存储和使用。

2. **API密钥安全**：即使是个人应用，也建议对存储的OpenAI API密钥进行加密保存，避免明文存储。

3. **离线功能**：考虑添加基本的离线编辑功能，只有在使用AI功能时才需要联网。

4. **备份功能**：添加笔记导出/导入功能，便于数据备份。

5. **渐进式功能开发**：先实现基础的笔记功能，确保稳定后再添加AI功能，这样可以更快得到一个可用的产品。

这个设计考虑到了你的需求：经典三栏布局、OpenAI API集成、后台API密钥管理、单用户使用、本地持久化存储，同时提供了清晰的开发路径。

