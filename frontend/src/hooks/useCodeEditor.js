import { useEffect, useState } from 'react';
export function useCodeEditor(problem){
  const languages=['Java','C++','Python','JavaScript'];
  const [language,setLanguage]=useState('Python');
  const storageKey=`placepro-code-${problem?.id||'unknown'}`;
  const [codeByLanguage,setCodeByLanguage]=useState(()=>{try{return {...(problem?.starterCode||{}),...JSON.parse(localStorage.getItem(storageKey)||'{}')}}catch{return {...(problem?.starterCode||{})}}});
  useEffect(()=>{if(!problem)return;try{setCodeByLanguage({...problem.starterCode,...JSON.parse(localStorage.getItem(storageKey)||'{}')})}catch{setCodeByLanguage({...problem.starterCode})}},[problem?.id]);
  useEffect(()=>{try{localStorage.setItem(storageKey,JSON.stringify(codeByLanguage))}catch{}},[codeByLanguage,storageKey]);
  const code=codeByLanguage[language]||'';
  const setCode=value=>setCodeByLanguage(current=>({...current,[language]:value}));
  const changeLanguage=next=>setLanguage(next);
  const reset=()=>setCode(problem?.starterCode?.[language]||'');
  return {languages,language,code,setCode,changeLanguage,reset,codeByLanguage};
}
