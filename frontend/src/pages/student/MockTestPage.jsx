import React, { useEffect, useState } from 'react';
import { useMockTest } from '../../hooks/useMockTest';
import { MockTestQuestion } from '../../components/mockTests/MockTestQuestion';
import { QuestionPalette } from '../../components/mockTests/QuestionPalette';
import { SubmitTestModal } from '../../components/mockTests/SubmitTestModal';
import { useRoute } from '../../context/RouteContext';

export function MockTestPage() {
  const { path, navigate } = useRoute();
  const id = path.split('?')[0].split('/')[2];
  const { test, question, answers, marked, current, seconds, setSeconds, setCurrent, choose, toggleMark } = useMockTest(id);
  const [modal, setModal] = useState(false);
  useEffect(() => {
    if (seconds === null) return;
    if (seconds <= 0) { navigate(`/mock-tests/${id}/result`); return; }
    const timer = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds, id, setSeconds, navigate]);
  if (!test || !question) return <div className="loading-panel">Loading testΓÇª</div>;
  const submit = () => { setModal(false); navigate(`/mock-tests/${id}/result`); };
  return <div className="test-taking"><header><div><span className="section-kicker">MOCK TEST</span><h1>{test.title}</h1></div><div className="test-timer">{String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}</div></header><div className="test-progress">Question {current + 1} / {test.questions.length}<span>{Object.keys(answers).length} answered</span></div><div className="test-layout"><div><MockTestQuestion question={question} answer={answers[question.id]} onAnswer={choose} /><div className="test-navigation"><button className="outline-button" disabled={current === 0} onClick={() => setCurrent(current - 1)}>Previous</button><button className="outline-button" onClick={toggleMark}>{marked.includes(question.id) ? 'Remove review mark' : 'Mark for review'}</button>{current === test.questions.length - 1 ? <button className="button" onClick={() => setModal(true)}>Submit test</button> : <button className="button" onClick={() => setCurrent(current + 1)}>Next <span>ΓåÆ</span></button>}</div></div><QuestionPalette total={test.questions.length} current={current} answers={Object.fromEntries(Object.entries(answers).map(([key]) => [test.questions.findIndex((q) => q.id === key), true]))} marked={marked.map((id) => test.questions.findIndex((q) => q.id === id))} onSelect={setCurrent} /></div>{modal && <SubmitTestModal answers={answers} marked={marked} total={test.questions.length} onClose={() => setModal(false)} onSubmit={submit} />}</div>;
}
