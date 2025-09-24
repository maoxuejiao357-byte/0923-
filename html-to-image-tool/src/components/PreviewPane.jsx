import React, { forwardRef } from 'react';

const PreviewPane = forwardRef(({ htmlCode }, ref) => {
  return (
    <div className="flex-1 border border-gray-300 rounded-lg overflow-auto bg-white shadow-sm">
      <div 
        ref={ref}
        dangerouslySetInnerHTML={{ __html: htmlCode }}
        className="preview-container p-4 min-h-full"
        style={{
          // 确保预览区域有基本的样式重置
          boxSizing: 'border-box',
          wordWrap: 'break-word',
          overflowWrap: 'break-word'
        }}
      />
    </div>
  );
});

PreviewPane.displayName = 'PreviewPane';

export default PreviewPane;