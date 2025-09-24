import React, { useState } from 'react';
import html2canvas from 'html2canvas';

function DownloadOptions({ previewRef }) {
  const [format, setFormat] = useState('png');
  const [isConverting, setIsConverting] = useState(false);
  const [quality, setQuality] = useState(0.9);

  const handleDownload = async () => {
    if (!previewRef.current) {
      alert('预览内容为空，请先输入HTML代码');
      return;
    }

    setIsConverting(true);

    try {
      // 配置html2canvas选项
      const options = {
        backgroundColor: '#ffffff',
        scale: 2, // 提高图片质量
        useCORS: true, // 允许跨域图片
        allowTaint: true,
        foreignObjectRendering: true,
        logging: false, // 关闭日志
        width: previewRef.current.scrollWidth,
        height: previewRef.current.scrollHeight,
      };

      const canvas = await html2canvas(previewRef.current, options);
      
      // 根据格式设置不同的导出参数
      const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
      const fileExtension = format;
      const imageQuality = format === 'jpg' ? quality : 1;
      
      const url = canvas.toDataURL(mimeType, imageQuality);
      
      // 创建下载链接
      const link = document.createElement('a');
      link.download = `html-export-${new Date().getTime()}.${fileExtension}`;
      link.href = url;
      
      // 触发下载
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // 显示成功消息
      alert('图片导出成功！');
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出图片失败，请检查HTML代码或者尝试更简单的内容。\n\n可能的原因：\n1. HTML中包含无法加载的外部资源\n2. CSS样式过于复杂\n3. 浏览器安全限制');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-6">
        {/* 格式选择 */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">导出格式:</label>
          <select 
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="png">PNG (无损)</option>
            <option value="jpg">JPG (有损)</option>
          </select>
        </div>

        {/* JPG质量设置 */}
        {format === 'jpg' && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">质量:</label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-20"
            />
            <span className="text-sm text-gray-600 w-8">{Math.round(quality * 100)}%</span>
          </div>
        )}
      </div>

      {/* 下载按钮 */}
      <button
        onClick={handleDownload}
        disabled={isConverting}
        className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
          isConverting 
            ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
            : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg active:transform active:scale-95'
        }`}
      >
        {isConverting ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            导出中...
          </div>
        ) : (
          '导出图片'
        )}
      </button>
    </div>
  );
}

export default DownloadOptions;