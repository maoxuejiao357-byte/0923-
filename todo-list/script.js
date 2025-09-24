// Todo List 应用主要功能
class TodoApp {
    constructor() {
        this.tasks = this.loadTasks();
        this.currentFilter = {
            category: 'all',
            priority: 'all',
            status: 'all',
            search: ''
        };
        this.editingTaskId = null;
        this.init();
    }

    // 初始化应用
    init() {
        this.bindEvents();
        this.renderTasks();
        this.updateStats();
    }

    // 绑定事件监听器
    bindEvents() {
        // 添加任务
        document.getElementById('addTaskBtn').addEventListener('click', () => this.addTask());
        document.getElementById('taskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // 搜索功能
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.currentFilter.search = e.target.value.toLowerCase();
            this.renderTasks();
        });

        // 筛选按钮
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });

        // 模态框事件
        document.querySelector('.close').addEventListener('click', () => this.closeModal());
        document.getElementById('editForm').addEventListener('submit', (e) => this.saveEdit(e));
        document.querySelector('.cancel-btn').addEventListener('click', () => this.closeModal());
        
        // 点击模态框外部关闭
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('editModal');
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    // 添加新任务
    addTask() {
        const taskInput = document.getElementById('taskInput');
        const categorySelect = document.getElementById('categorySelect');
        const prioritySelect = document.getElementById('prioritySelect');
        const dueDateInput = document.getElementById('dueDateInput');

        const content = taskInput.value.trim();
        if (!content) {
            alert('请输入任务内容');
            return;
        }

        const task = {
            id: Date.now().toString(),
            content: content,
            category: categorySelect.value,
            priority: prioritySelect.value,
            status: 'pending',
            dueDate: dueDateInput.value || null,
            createdAt: new Date().toISOString(),
            completedAt: null
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();

        // 清空输入框
        taskInput.value = '';
        dueDateInput.value = '';
        taskInput.focus();
    }

    // 切换任务完成状态
    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.status = task.status === 'completed' ? 'pending' : 'completed';
            task.completedAt = task.status === 'completed' ? new Date().toISOString() : null;
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
        }
    }

    // 删除任务
    deleteTask(taskId) {
        if (confirm('确定要删除这个任务吗？')) {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
        }
    }

    // 编辑任务
    editTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            this.editingTaskId = taskId;
            document.getElementById('editTaskInput').value = task.content;
            document.getElementById('editCategorySelect').value = task.category;
            document.getElementById('editPrioritySelect').value = task.priority;
            document.getElementById('editDueDateInput').value = task.dueDate || '';
            document.getElementById('editModal').style.display = 'block';
        }
    }

    // 保存编辑
    saveEdit(e) {
        e.preventDefault();
        const task = this.tasks.find(t => t.id === this.editingTaskId);
        if (task) {
            task.content = document.getElementById('editTaskInput').value.trim();
            task.category = document.getElementById('editCategorySelect').value;
            task.priority = document.getElementById('editPrioritySelect').value;
            task.dueDate = document.getElementById('editDueDateInput').value || null;
            
            this.saveTasks();
            this.renderTasks();
            this.closeModal();
        }
    }

    // 关闭模态框
    closeModal() {
        document.getElementById('editModal').style.display = 'none';
        this.editingTaskId = null;
    }

    // 处理筛选
    handleFilter(e) {
        const btn = e.target;
        const filterType = btn.dataset.category ? 'category' : 
                          btn.dataset.priority ? 'priority' : 'status';
        const filterValue = btn.dataset.category || btn.dataset.priority || btn.dataset.status;

        // 更新按钮状态
        btn.parentElement.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // 更新筛选条件
        this.currentFilter[filterType] = filterValue;
        this.renderTasks();
    }

    // 筛选任务
    filterTasks() {
        return this.tasks.filter(task => {
            // 分类筛选
            if (this.currentFilter.category !== 'all' && task.category !== this.currentFilter.category) {
                return false;
            }

            // 优先级筛选
            if (this.currentFilter.priority !== 'all' && task.priority !== this.currentFilter.priority) {
                return false;
            }

            // 状态筛选
            if (this.currentFilter.status !== 'all' && task.status !== this.currentFilter.status) {
                return false;
            }

            // 搜索筛选
            if (this.currentFilter.search && !task.content.toLowerCase().includes(this.currentFilter.search)) {
                return false;
            }

            return true;
        });
    }

    // 排序任务
    sortTasks(tasks) {
        const priorityOrder = { 'P1': 1, 'P2': 2, 'P3': 3, 'P4': 4 };
        return tasks.sort((a, b) => {
            // 首先按完成状态排序（未完成的在前）
            if (a.status !== b.status) {
                return a.status === 'pending' ? -1 : 1;
            }
            // 然后按优先级排序
            if (a.priority !== b.priority) {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            // 最后按创建时间排序（新的在前）
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
    }

    // 渲染任务列表
    renderTasks() {
        const taskList = document.getElementById('taskList');
        const emptyState = document.getElementById('emptyState');
        const filteredTasks = this.filterTasks();
        const sortedTasks = this.sortTasks(filteredTasks);

        if (sortedTasks.length === 0) {
            taskList.style.display = 'none';
            emptyState.style.display = 'block';
            emptyState.innerHTML = this.currentFilter.search || 
                                  this.currentFilter.category !== 'all' || 
                                  this.currentFilter.priority !== 'all' || 
                                  this.currentFilter.status !== 'all' 
                                  ? '<p>没有找到匹配的任务</p>' 
                                  : '<p>暂无任务，点击上方添加新任务吧！</p>';
            return;
        }

        taskList.style.display = 'block';
        emptyState.style.display = 'none';

        taskList.innerHTML = sortedTasks.map(task => this.createTaskHTML(task)).join('');

        // 绑定任务项事件
        taskList.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.toggleTask(e.target.dataset.taskId);
            });
        });

        taskList.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.editTask(e.target.dataset.taskId);
            });
        });

        taskList.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.deleteTask(e.target.dataset.taskId);
            });
        });
    }

    // 创建任务HTML
    createTaskHTML(task) {
        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status === 'pending';
        const dueDateText = task.dueDate ? this.formatDate(task.dueDate) : '';
        
        return `
            <div class="task-item ${task.status} ${isOverdue ? 'overdue' : ''}">
                <div class="task-header">
                    <input type="checkbox" class="task-checkbox" 
                           data-task-id="${task.id}" 
                           ${task.status === 'completed' ? 'checked' : ''}>
                    <div class="task-content">${this.escapeHtml(task.content)}</div>
                    <span class="task-priority ${task.priority}">${task.priority}</span>
                </div>
                <div class="task-meta">
                    <div>
                        <span class="task-category">${task.category}</span>
                        ${dueDateText ? `<span class="task-due-date ${isOverdue ? 'overdue' : ''}">📅 ${dueDateText}</span>` : ''}
                    </div>
                    <div class="task-actions">
                        <button class="edit-btn" data-task-id="${task.id}">编辑</button>
                        <button class="delete-btn" data-task-id="${task.id}">删除</button>
                    </div>
                </div>
            </div>
        `;
    }

    // 更新统计信息
    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.status === 'completed').length;
        const pending = total - completed;

        document.getElementById('totalTasks').textContent = `总任务: ${total}`;
        document.getElementById('completedTasks').textContent = `已完成: ${completed}`;
        document.getElementById('pendingTasks').textContent = `待完成: ${pending}`;
    }

    // 格式化日期
    formatDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const diffTime = date - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return '今天';
        if (diffDays === 1) return '明天';
        if (diffDays === -1) return '昨天';
        if (diffDays > 0) return `${diffDays}天后`;
        return `${Math.abs(diffDays)}天前`;
    }

    // HTML转义
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 保存任务到本地存储
    saveTasks() {
        localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
    }

    // 从本地存储加载任务
    loadTasks() {
        const saved = localStorage.getItem('todoTasks');
        return saved ? JSON.parse(saved) : [];
    }
}

// 记事本功能
class Notepad {
    constructor() {
        this.textarea = document.getElementById('notepadTextarea');
        this.saveBtn = document.getElementById('saveNoteBtn');
        this.clearBtn = document.getElementById('clearNoteBtn');
        this.saveStatus = document.getElementById('saveStatus');
        this.charCount = document.getElementById('charCount');
        this.wordCount = document.getElementById('wordCount');
        this.lastSaved = document.getElementById('lastSaved');
        
        this.autoSaveTimer = null;
        this.init();
    }
    
    init() {
        this.loadNote();
        this.bindEvents();
        this.updateCounts();
    }
    
    bindEvents() {
        // 文本输入事件
        this.textarea.addEventListener('input', () => {
            this.updateCounts();
            this.scheduleAutoSave();
        });
        
        // 保存按钮
        this.saveBtn.addEventListener('click', () => {
            this.saveNote();
        });
        
        // 清空按钮
        this.clearBtn.addEventListener('click', () => {
            if (confirm('确定要清空所有内容吗？此操作不可撤销。')) {
                this.clearNote();
            }
        });
        
        // 键盘快捷键
        this.textarea.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.saveNote();
            }
        });
    }
    
    loadNote() {
        const savedNote = localStorage.getItem('notepad_content');
        if (savedNote) {
            this.textarea.value = savedNote;
            const lastSavedTime = localStorage.getItem('notepad_last_saved');
            if (lastSavedTime) {
                this.updateLastSaved(new Date(lastSavedTime));
            }
        }
    }
    
    saveNote() {
        const content = this.textarea.value;
        const now = new Date();
        
        localStorage.setItem('notepad_content', content);
        localStorage.setItem('notepad_last_saved', now.toISOString());
        
        this.showSaveStatus('已保存', 'success');
        this.updateLastSaved(now);
    }
    
    clearNote() {
        this.textarea.value = '';
        localStorage.removeItem('notepad_content');
        localStorage.removeItem('notepad_last_saved');
        this.updateCounts();
        this.lastSaved.textContent = '未保存';
        this.showSaveStatus('内容已清空', 'info');
    }
    
    scheduleAutoSave() {
        if (this.autoSaveTimer) {
            clearTimeout(this.autoSaveTimer);
        }
        
        this.autoSaveTimer = setTimeout(() => {
            this.saveNote();
        }, 3000); // 3秒后自动保存
    }
    
    updateCounts() {
        const content = this.textarea.value;
        const charCount = content.length;
        const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
        
        this.charCount.textContent = `字符数: ${charCount}`;
        this.wordCount.textContent = `单词数: ${wordCount}`;
    }
    
    showSaveStatus(message, type) {
        this.saveStatus.textContent = message;
        this.saveStatus.className = `save-status ${type}`;
        
        setTimeout(() => {
            this.saveStatus.textContent = '';
            this.saveStatus.className = 'save-status';
        }, 2000);
    }
    
    updateLastSaved(date) {
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) { // 小于1分钟
            this.lastSaved.textContent = '刚刚保存';
        } else if (diff < 3600000) { // 小于1小时
            const minutes = Math.floor(diff / 60000);
            this.lastSaved.textContent = `${minutes}分钟前保存`;
        } else {
            this.lastSaved.textContent = `保存于 ${date.toLocaleString()}`;
        }
    }
}

// 标签切换功能
class TabManager {
    constructor() {
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
        this.init();
    }
    
    init() {
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tabName = btn.dataset.tab;
                this.switchTab(tabName);
            });
        });
    }
    
    switchTab(tabName) {
        // 更新按钮状态
        this.tabBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        // 更新内容显示
        this.tabContents.forEach(content => {
            if (content.id === `${tabName}Content`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
    
    // 初始化记事本和标签管理器
    new Notepad();
    new TabManager();
});

// 添加一些额外的CSS样式用于过期任务
const additionalStyles = `
    .task-item.overdue {
        border-left: 4px solid #dc3545;
    }
    
    .task-due-date {
        font-size: 12px;
        color: #666;
        margin-left: 8px;
    }
    
    .task-due-date.overdue {
        color: #dc3545;
        font-weight: bold;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);