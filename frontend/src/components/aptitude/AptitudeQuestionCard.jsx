import React from 'react';
export function AptitudeQuestionCard({ practice }) {
  const { question, selected, setSelected, submitted, submit, next, index, total, results } = practice;
  if (!question) return <div className="empty-companies"><h2>No practice questions available</h2><p>No questions are available for this topic yet.</p></div>;
  // The question list no longer carries the answer key; grading comes from
  // the server result recorded by useAptitudePractice.
  const graded = (results || []).find((item) => item.id === question.id);
  const correctAnswer = graded?.correctAnswer ?? question.correctAnswer;
  const explanation = graded?.explanation ?? question.explanation;
  const isCorrect = graded ? graded.correct === true : selected === correctAnswer;
  return <article className="aptitude-question dashboard-panel"><div className="question-top"><span>Question {index + 1} of {total}</span><span className="difficulty easy">{question.difficulty}</span></div><h2>{question.question}</h2><div className="answer-options">{question.options.map((option, i) => <label className={submitted ? (i === correctAnswer ? 'correct' : i === selected ? 'incorrect' : '') : selected === i ? 'selected' : ''} key={option}><input type="radio" name="answer" checked={selected === i} onChange={() => !submitted && setSelected(i)} /><span>{String.fromCharCode(65 + i)}</span>{option}</label>)}</div>{submitted && <div className={isCorrect ? 'answer-feedback correct-feedback' : 'answer-feedback incorrect-feedback'}><strong>{isCorrect ? '✓ Correct' : graded?.correct === null ? 'Saved — will grade when online' : '✕ Not quite'}</strong><p>{explanation}</p></div>}{!submitted ? <button className="button" onClick={submit} disabled={selected === null}>Submit answer <span>↗</span></button> : <button className="button" onClick={next} disabled={index >= total - 1}>Next question <span>→</span></button>}</article>;
}
