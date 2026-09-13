import { useState } from 'react';
export function useCodeExecution(){
  const [state,setState]=useState('idle');
  const [output,setOutput]=useState('');
  const run=()=>{setState('running');setOutput('');window.setTimeout(()=>{setOutput('[0, 1]');setState('demo');},700);};
  const submit=()=>{setState('pending');setOutput('Real code execution will be connected when the backend service is available.');};
  return {state,output,run,submit};
}
