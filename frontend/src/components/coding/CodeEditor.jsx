import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { MONACO_LANGUAGE_MAP } from '../../constants/editor';

export function CodeEditor({ code, onChange, language }) {
  const [editorError, setEditorError] = useState(false);
  return <div className="editor-shell">
    <div className="editor-label"><span>●</span> {language} editor <small>Monaco · PlacePro Coding</small></div>
    <div className="monaco-editor-container" aria-label={`${language} code editor`}>
      {editorError ? <div className="editor-error"><p>Unable to load the code editor.</p><button className="outline-button" onClick={() => setEditorError(false)}>Retry</button></div> : <Editor
        height="100%"
        theme="vs-dark"
        language={MONACO_LANGUAGE_MAP[language] || 'plaintext'}
        value={code}
        onChange={value => onChange(value ?? '')}
        loading={<div className="editor-loading">Loading editor...</div>}
        onMount={editor => editor.focus()}
        onValidate={() => {}}
        onError={() => setEditorError(true)}
        options={{
          automaticLayout: true,
          lineNumbers: 'on',
          minimap: { enabled: false },
          fontSize: 14,
          tabSize: 4,
          insertSpaces: true,
          wordWrap: 'off',
          bracketPairColorization: { enabled: true },
          guides: { indentation: true, bracketPairs: true },
          renderWhitespace: 'selection',
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: 'smooth',
          padding: { top: 16, bottom: 16 },
          autoIndent: 'full',
          formatOnPaste: false,
          folding: true,
        }}
      />}
    </div>
  </div>;
}
