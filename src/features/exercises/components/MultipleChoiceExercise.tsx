import React from 'react';
import { MultipleChoiceContent } from '../types';

interface MultipleChoiceExerciseProps {
  content: MultipleChoiceContent;
  userAnswer: string | null;
  onAnswerChange: (optionId: string) => void;
  disabled?: boolean;
}

export const MultipleChoiceExercise: React.FC<MultipleChoiceExerciseProps> = ({
  content,
  userAnswer,
  onAnswerChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-6">
      {/* Pregunta */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-lg text-gray-800 font-medium">{content.question}</p>
      </div>

      {/* Opciones */}
      <div className="space-y-3">
        {content.options.map((option, index) => {
          const isSelected = userAnswer === option.id;
          const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
          
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onAnswerChange(option.id)}
              disabled={disabled}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-blue-600 bg-blue-50 shadow-md'
                  : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50'
              } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {letters[index]}
                </span>
                <span className="flex-1 text-gray-800">{option.text}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
