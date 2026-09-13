import { useState } from 'react';
export function useCodeExecution(){
  const [state,setState]=useState('idle');
  const [output,setOutput]=useState('');
  const run=()=>{setState('unavailable');setOutput('Code execution is not available yet. Connect the execution API to run this solution against test cases.');};
  const submit=()=>{setState('unavailable');setOutput('Submission is not available yet because no execution service is configured. Your code has been saved locally.');};
  return {state,output,run,submit};
}
