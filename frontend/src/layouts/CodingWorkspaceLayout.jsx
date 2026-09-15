import React from 'react';
import { Logo } from '../components/common/Logo';

export function CodingWorkspaceLayout({ children }) {
  return <div className="coding-workspace-shell"><header className="coding-workspace-header"><a className="coding-back-link" href="/practice/dsa" aria-label="Back to DSA Sheet"><span>←</span><Logo /><b>Back to DSA Sheet</b></a><span className="coding-header-label">Focused problem workspace</span></header><main className="coding-workspace-content">{children}</main></div>;
}
