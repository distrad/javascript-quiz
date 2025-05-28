import { create } from "zustand";
import { type Question } from "../types";
import confetti from "canvas-confetti";
import { persist, devtools } from "zustand/middleware";

interface State {
  questions: Question[];
  currentQuestion: number;
  fetchQuestions: (limit: number) => Promise<void>;
  selectAnswer: (questionId: number, answerIndex: number) => void;
  goNextQuestion: () => void;
  goPreviousQuestion: () => void;
  reset: () => void;
}

export const useQuestionsStore = create<State>()(
  devtools(
    persist(
      (set, get) => {
        return {
          questions: [],
          currentQuestion: 0, //posición de la pregunta actual

          fetchQuestions: async (limit: number) => {
            const res = await fetch("http://localhost:5173/data.json");
            const json = await res.json();

            const questions = json
              .sort(() => Math.random() - 0.5)
              .slice(0, limit);
            set({ questions });
          },
          selectAnswer: (questionId: number, answerIndex: number) => {
            const { questions } = get();
            //StructureClone
            const newQuestions = structuredClone(questions);

            //QuestionIndex
            const questionIndex = newQuestions.findIndex(
              (q) => q.id === questionId
            );
            const quiestionInfo = newQuestions[questionIndex];
            const isCorrectUserAnswer =
              quiestionInfo.correctAnswer === answerIndex;

            if (isCorrectUserAnswer) confetti();

            //Actualizar estado
            newQuestions[questionIndex] = {
              ...quiestionInfo,
              isCorrectUserAnswer,
              userSelectedAnswer: answerIndex,
            };

            set({ questions: newQuestions });
          },
          goNextQuestion: () => {
            const { currentQuestion, questions } = get();
            const nextQuestion = currentQuestion + 1;

            if (nextQuestion < questions.length) {
              set({ currentQuestion: nextQuestion });
            }
          },
          goPreviousQuestion: () => {
            const { currentQuestion } = get();
            const previousQuestion = currentQuestion - 1;

            if (previousQuestion >= 0) {
              set({ currentQuestion: previousQuestion });
            }
          },
          reset: () => {
            set({ currentQuestion: 0, questions: [] });
          },
        };
      },
      {
        name: "questions",
      }
    )
  )
);
