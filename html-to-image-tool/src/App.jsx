import React, { useState, useRef } from 'react';
import CodeEditor from './components/CodeEditor';
import PreviewPane from './components/PreviewPane';
import DownloadOptions from './components/DownloadOptions';

function App() {
  const [htmlCode, setHtmlCode] = useState(`<div style="padding: 20px; font-family: Arial, sans-serif;">
  <h1 style="color: #333; text-align: center;">Hello World</h1>
  <p style="color: #666; text-align: center;">这是一个HTML转图片的示例</p>
  <div style="background: linear-gradient(45deg, #ff6b6b, #4ecdc4); padding: 20px; border-radius: 10px; color: white; text-align: center; margin-top: 20px;">
    <h2>美丽的渐变背景</h2>
    <p>支持各种CSS样式</p>
  </div>
</div>`);
  const previewRef = useRef(null);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 头部标题 */}
      <header className="bg-white shadow-sm border-b px-6 py-4">
        <h1 className="text-3xl font-bold text-gray-800">HTML转图片工具</h1>
        <p className="text-gray-600 mt-1">在左侧编辑HTML代码，右侧实时预览，点击下载按钮保存为图片</p>
      </header>

      {/* 主要内容区域 */}
      <div className="flex flex-1 gap-6 p-6 overflow-hidden">
        {/* 左侧编辑区 */}
        <div className="w-1/2 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold text-gray-700">HTML代码</h2>
            <span className="text-sm text-gray-500">支持完整的HTML和CSS</span>
          </div>
          <CodeEditor 
            value={htmlCode}
            onChange={setHtmlCode}
          />
        </div>

        {/* 右侧预览区 */}
        <div className="w-1/2 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold text-gray-700">实时预览</h2>
            <span className="text-sm text-gray-500">预览效果即为导出图片</span>
          </div>
          <PreviewPane 
            htmlCode={htmlCode}
            ref={previewRef}
          />
        </div>
      </div>

      {/* 底部控制区 */}
      <footer className="bg-white border-t px-6 py-4">
        <DownloadOptions previewRef={previewRef} />
      </footer>
    </div>
  );
}

export default App;