import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { html } from '@codemirror/lang-html';
import { oneDark } from '@codemirror/theme-one-dark';

function CodeEditor({ value, onChange }) {
  return (
    <div className="flex-1 border border-gray-300 rounded-lg overflow-hidden shadow-sm">
      <CodeMirror
        value={value}
        height="100%"
        extensions={[html()]}
        onChange={onChange}
        theme={oneDark}
        className="h-full text-sm"
        basicSetup={{
          lineNumbers: true,
          foldGutter: true,
          dropCursor: false,
          allowMultipleSelections: false,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          highlightSelectionMatches: false,
        }}
      />
    </div>
  );
}

export default CodeEditor;