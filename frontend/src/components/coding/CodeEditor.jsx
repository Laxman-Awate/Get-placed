import React from 'react';
export function CodeEditor({code,onChange,language}){return <div className="editor-shell"><div className="editor-label"><span>●</span> {language} editor <small>Frontend editor preview</small></div><textarea className="code-editor" value={code} onChange={e=>onChange(e.target.value)} spellCheck="false" aria-label={`${language} code editor`} /></div>}
