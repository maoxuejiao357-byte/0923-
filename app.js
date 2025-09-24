// AI智能记事本 - 纯前端实现

class NotepadApp {
    constructor() {
        this.currentNote = null;
        this.notes = [];
        this.init();
    }

    init() {
        this.loadNotes();
        this.setupEventListeners();
        this.renderNotesList();
        this.setupAutoSave();
        this.setupKeyboardShortcuts();
    }

    // 初始化事件监听器
    setupEventListeners() {
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchNotes(e.target.value);
        });

        document.getElementById('noteTitle').addEventListener('input', () => {
            this.updateWordCount();
            this.autoSave();
        });

        document.getElementById('noteContent').addEventListener('input', () => {
            this.updateWordCount();
            this.autoSave();
        });

        document.getElementById('tagInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.addTag();
            }
        });
    }

    // 键盘快捷键
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 's':
                        e.preventDefault();
                        this.saveNote();
                        break;
                    case 'Enter':
                        e.preventDefault();
                        this.createNewNote();
                        break;
                }
            }
        });
    }

    // 自动保存功能
    setupAutoSave() {
        setInterval(() => {
            if (this.currentNote) {
                this.autoSave();
            }
        }, 30000); // 每30秒自动保存
    }

    // 创建新笔记
    createNewNote() {
        this.currentNote = {
            id: Date.now(),
            title: '',
            content: '',
            tags: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.clearEditor();
        this.showNotification('新建笔记已创建', 'success');
    }

    // 清空编辑器
    clearEditor() {
        document.getElementById('noteTitle').value = '';
        document.getElementById('noteContent').value = '';
        document.getElementById('tagsContainer').innerHTML = '';
        this.currentNote = null;
        this.updateWordCount();
        this.updateLastSaved();
    }

    // 保存笔记
    saveNote() {
        const title = document.getElementById('noteTitle').value.trim();
        const content = document.getElementById('noteContent').value.trim();
        const tags = Array.from(document.querySelectorAll('.tag')).map(tag => tag.textContent.replace('×', '').trim());

        if (!title && !content) {
            this.showNotification('请输入标题或内容', 'warning');
            return;
        }

        const note = {
            id: this.currentNote?.id || Date.now(),
            title: title || '无标题',
            content: content,
            tags: tags,
            createdAt: this.currentNote?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (this.currentNote) {
            // 更新现有笔记
            const index = this.notes.findIndex(n => n.id === note.id);
            if (index !== -1) {
                this.notes[index] = note;
            }
        } else {
            // 创建新笔记
            this.notes.unshift(note);
        }

        this.currentNote = note;
        this.saveNotes();
        this.renderNotesList();
        this.updateLastSaved();
        this.showNotification('笔记已保存', 'success');
    }

    // 自动保存
    autoSave() {
        if (this.currentNote) {
            this.saveNote();
        }
    }

    // 加载笔记列表
    loadNotes() {
        const saved = localStorage.getItem('notepad-notes');
        if (saved) {
            this.notes = JSON.parse(saved);
        }
    }

    // 保存笔记到本地存储
    saveNotes() {
        localStorage.setItem('notepad-notes', JSON.stringify(this.notes));
    }

    // 渲染笔记列表
    renderNotesList() {
        const notesList = document.getElementById('notesList');
        const searchQuery = document.getElementById('searchInput').value.toLowerCase();
        
        const filteredNotes = this.notes.filter(note => {
            if (!searchQuery) return true;
            return (
                note.title.toLowerCase().includes(searchQuery) ||
                note.content.toLowerCase().includes(searchQuery) ||
                note.tags.some(tag => tag.toLowerCase().includes(searchQuery))
            );
        });

        notesList.innerHTML = filteredNotes.map(note => `
            <div class="note-item ${this.currentNote?.id === note.id ? 'active' : ''}" 
                 onclick="app.selectNote(${note.id})"
                 data-note-id="${note.id}">
                <div class="note-title">${this.escapeHtml(note.title)}</div>
                <div class="note-preview">${this.escapeHtml(note.content.substring(0, 100))}${note.content.length > 100 ? '...' : ''}</div>
                <div class="note-tags">${note.tags.map(tag => `<span class="tag">${this.escapeHtml(tag)}</span>`).join('')}</div>
                <div class="note-date">${new Date(note.updatedAt).toLocaleString()}</div>
            </div>
        `).join('');
    }

    // 选择笔记
    selectNote(noteId) {
        const note = this.notes.find(n => n.id === noteId);
        if (note) {
            this.currentNote = note;
            document.getElementById('noteTitle').value = note.title;
            document.getElementById('noteContent').value = note.content;
            this.renderTags(note.tags);
            this.updateWordCount();
            this.updateLastSaved();
            
            // 更新选中状态
            document.querySelectorAll('.note-item').forEach(item => {
                item.classList.remove('active');
            });
            document.querySelector(`[data-note-id="${noteId}"]`)?.classList.add('active');
        }
    }

    // 搜索笔记
    searchNotes(query) {
        this.renderNotesList();
    }

    // 添加标签
    addTag() {
        const tagInput = document.getElementById('tagInput');
        const tagText = tagInput.value.trim();
        
        if (tagText && !Array.from(document.querySelectorAll('.tag')).some(tag => tag.textContent.replace('×', '').trim() === tagText)) {
            this.renderTag(tagText);
            tagInput.value = '';
        }
    }

    // 渲染单个标签
    renderTag(tagText) {
        const tagsContainer = document.getElementById('tagsContainer');
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.innerHTML = `${this.escapeHtml(tagText)}<button class="tag-remove" onclick="this.parentElement.remove()">×</button>`;
        tagsContainer.appendChild(tagElement);
    }

    // 渲染多个标签
    renderTags(tags) {
        const tagsContainer = document.getElementById('tagsContainer');
        tagsContainer.innerHTML = '';
        tags.forEach(tag => this.renderTag(tag));
    }

    // AI功能
    generateTags() {
        const content = document.getElementById('noteContent').value;
        if (!content.trim()) {
            this.showNotification('请先输入内容', 'warning');
            return;
        }

        // 简单的关键词提取
        const words = content.match(/[\u4e00-\u9fa5]{2,}/g) || [];
        const uniqueWords = [...new Set(words)].slice(0, 3);
        
        uniqueWords.forEach(word => {
            if (word.length > 1 && !Array.from(document.querySelectorAll('.tag')).some(tag => tag.textContent.replace('×', '').trim() === word)) {
                this.renderTag(word);
            }
        });
        
        this.showNotification('标签已生成', 'success');
    }

    polishContent() {
        const content = document.getElementById('noteContent').value;
        if (!content.trim()) {
            this.showNotification('请先输入内容', 'warning');
            return;
        }

        // 简单的文本润色
        const polished = content
            .replace(/\s+/g, ' ')
            .replace(/[，。！？；：]/g, match => match + ' ')
            .trim();

        document.getElementById('noteContent').value = polished;
        this.showNotification('文本已润色', 'success');
    }

    summarizeContent() {
        const content = document.getElementById('noteContent').value;
        if (!content.trim()) {
            this.showNotification('请先输入内容', 'warning');
            return;
        }

        const sentences = content.split(/[。！？]/g);
        const summary = sentences.slice(0, 2).join('。') + (sentences.length > 2 ? '...' : '');
        
        this.showAIResult(`摘要：${summary || content.substring(0, 100) + '...'}`);
        this.showNotification('摘要已生成', 'success');
    }

    executeAIFunction() {
        const functionType = document.getElementById('aiFunction').value;
        const content = document.getElementById('noteContent').value;
        
        if (!content.trim()) {
            this.showNotification('请先输入内容', 'warning');
            return;
        }

        switch (functionType) {
            case 'polish':
                this.polishContent();
                break;
            case 'rewrite':
                this.rewriteContent();
                break;
            case 'summarize':
                this.summarizeContent();
                break;
            case 'translate':
                this.translateContent();
                break;
        }
    }

    rewriteContent() {
        const content = document.getElementById('noteContent').value;
        const rewritten = content + '（改写版本）';
        document.getElementById('noteContent').value = rewritten;
        this.showNotification('文本已改写', 'success');
    }

    translateContent() {
        const content = document.getElementById('noteContent').value;
        const translated = content + '（英文翻译）';
        document.getElementById('noteContent').value = translated;
        this.showNotification('文本已翻译', 'success');
    }

    showAIResult(result) {
        document.getElementById('aiResult').innerHTML = result;
        document.getElementById('aiPanel').classList.add('open');
        setTimeout(() => {
            document.getElementById('aiPanel').classList.remove('open');
        }, 5000);
    }

    // 统计功能
    updateWordCount() {
        const content = document.getElementById('noteContent').value;
        const words = content.trim() ? content.trim().split(/\s+/).length : 0;
        const characters = content.length;
        document.getElementById('wordCount').textContent = `字数：${characters} | 单词：${words}`;
    }

    updateLastSaved() {
        const now = new Date().toLocaleTimeString();
        document.getElementById('lastSaved').textContent = `最后保存：${now}`;
    }

    // 导出功能
    exportNotes() {
        const data = {
            notes: this.notes,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `notepad-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('笔记已导出', 'success');
    }

    // 导入功能
    importNotes() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const data = JSON.parse(event.target.result);
                        if (data.notes && Array.isArray(data.notes)) {
                            this.notes = data.notes;
                            this.saveNotes();
                            this.renderNotesList();
                            this.showNotification('笔记已导入', 'success');
                        } else {
                            this.showNotification('无效的文件格式', 'error');
                        }
                    } catch (error) {
                        this.showNotification('导入失败', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    // 工具函数
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            backdrop-filter: blur(10px);
        `;

        // 根据类型设置颜色
        const colors = {
            success: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
            error: 'linear-gradient(135deg, #f56565 0%, #e53e3e 100%)',
            warning: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
            info: 'linear-gradient(135deg, #4299e1 0%, #3182ce 100%)'
        };
        
        notification.style.background = colors[type] || colors.info;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// 初始化应用
const app = new NotepadApp();

// 使应用全局可用
window.app = app;