import React from 'react';

export function CodeOutputPanel({ state, output }) {
  return <div className="code-output"><h3>Test result</h3>
    {state === 'idle' && <p>Run or submit your code to see results.</p>}
    {state === 'unavailable' && <><strong className="error-copy">Execution unavailable</strong><p>{output}</p></>}
    {state === 'error' && <p className="error-copy">Unable to process request.</p>}
  </div>;
}
