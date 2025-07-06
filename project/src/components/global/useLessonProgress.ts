import { useState } from 'react';

export interface UseLessonProgressOptions {
  sectionLabels: string[];
  totalQuestions: number;
  totalActivities: number;
}

export function useLessonProgress({ sectionLabels, totalQuestions, totalActivities }: UseLessonProgressOptions) {
  const [section, setSection] = useState(0);
  const [warmupIndex, setWarmupIndex] = useState(0);
  const [questionsCompleted, setQuestionsCompleted] = useState(0);
  const [activityIndex, setActivityIndex] = useState(0);
  const [activitiesCompleted, setActivitiesCompleted] = useState(0);

  // Navigation helpers
  const nextSection = () => {
    if (section === 3) { // Activities
      if (activityIndex < totalActivities - 1) {
        setActivityIndex(activityIndex + 1);
      } else {
        setSection(section + 1);
        setActivityIndex(0);
      }
    } else {
      setSection((s) => Math.min(s + 1, sectionLabels.length - 1));
    }
  };
  const prevSection = () => {
    if (section === 3 && activityIndex > 0) {
      setActivityIndex(activityIndex - 1);
    } else if (section === 3 && activityIndex === 0) {
      setSection(section - 1);
      setActivityIndex(totalActivities - 1);
    } else {
      setSection((s) => Math.max(s - 1, 0));
    }
  };

  // Quiz progress helpers
  const markQuestionCorrect = () => {
    setQuestionsCompleted((prev) => Math.min(prev + 1, totalQuestions));
  };
  const resetQuiz = () => {
    setWarmupIndex(0);
    setQuestionsCompleted(0);
  };

  // Activity progress helpers
  const markActivityComplete = () => {
    setActivitiesCompleted((prev) => Math.min(prev + 1, totalActivities));
  };
  const resetActivities = () => {
    setActivityIndex(0);
    setActivitiesCompleted(0);
  };

  return {
    section,
    setSection,
    sectionLabels,
    warmupIndex,
    setWarmupIndex,
    questionsCompleted,
    setQuestionsCompleted,
    activityIndex,
    setActivityIndex,
    activitiesCompleted,
    setActivitiesCompleted,
    nextSection,
    prevSection,
    markQuestionCorrect,
    resetQuiz,
    markActivityComplete,
    resetActivities,
    totalQuestions,
    totalActivities,
  };
} 