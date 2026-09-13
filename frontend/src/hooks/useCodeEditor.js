import { useState } from 'react';
export function useCodeEditor(problem){
  const languages=['Java','C++','Python','JavaScript'];
  const [language,setLanguage]=useState('Python');
  const [codeByLanguage,setCodeByLanguage]=useState(()=>({ ...(problem?.starterCode||{}) }));
  const code=codeByLanguage[language]||'';
  const setCode=value=>setCodeByLanguage(current=>({...current,[language]:value}));
  const changeLanguage=next=>setLanguage(next);
  const reset=()=>setCode(problem?.starterCode?.[language]||'');
  return {languages,language,code,setCode,changeLanguage,reset,codeByLanguage};
}
