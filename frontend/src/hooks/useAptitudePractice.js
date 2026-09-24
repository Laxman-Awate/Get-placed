import { useEffect, useState } from 'react';
import { aptitudeService } from '../services/aptitudeService';

// Grading is server-side: the question list no longer carries the answer
// key, so submit() posts the attempt and uses the returned result.
export function useAptitudePractice(topicId) {
  const [questions, setQuestions] = useState([]),
    [index, setIndex] = useState(0),
    [selected, setSelected] = useState(null),
    [submitted, setSubmitted] = useState(false),
    [results, setResults] = useState([]);
  useEffect(() => {
    aptitudeService.getQuestions(topicId).then(setQuestions).catch(() => setQuestions([]));
  }, [topicId]);
  const question = questions[index];
  const submit = async () => {
    if (selected === null || !question) return;
    setSubmitted(true);
    try {
      const result = await aptitudeService.submitAttempt(topicId, {
        questionId: question.id,
        selectedAnswer: selected,
      });
      setResults((current) => [
        ...current.filter((item) => item.id !== question.id),
        {
          id: question.id,
          selected,
          correct: result.correct,
          correctAnswer: result.correctAnswer,
          explanation: result.explanation,
        },
      ]);
    } catch {
      // Offline: record the attempt locally; grade it when the key is present.
      setResults((current) => [
        ...current.filter((item) => item.id !== question.id),
        {
          id: question.id,
          selected,
          correct: question.correctAnswer === undefined ? null : selected === question.correctAnswer,
        },
      ]);
    }
  };
  const next = () => {
    setIndex((current) => Math.min(current + 1, questions.length - 1));
    setSelected(null);
    setSubmitted(false);
  };
  return { question, index, selected, setSelected, submitted, submit, next, results, total: questions.length };
}
