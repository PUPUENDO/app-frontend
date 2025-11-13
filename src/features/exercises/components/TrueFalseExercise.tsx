import React from 'react';
import { TrueFalseContent } from '../types';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';

interface TrueFalseExerciseProps {
  content: TrueFalseContent;
  userAnswer: boolean | null;
  onAnswerChange: (answer: boolean) => void;
  disabled?: boolean;
}

export const TrueFalseExercise: React.FC<TrueFalseExerciseProps> = ({
  content,
  userAnswer,
  onAnswerChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-6">
      {/* Enunciado */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-lg text-gray-800">{content.statement}</p>
      </div>

      {/* Opciones */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          type="button"
          variant={userAnswer === true ? 'default' : 'outline'}
          size="lg"
          onClick={() => onAnswerChange(true)}
          disabled={disabled}
          className={`h-20 text-lg ${
            userAnswer === true ? 'bg-green-600 hover:bg-green-700' : ''
          }`}
        >
          <CheckCircle2 className="mr-2 h-6 w-6" />
          Verdadero
        </Button>

        <Button
          type="button"
          variant={userAnswer === false ? 'default' : 'outline'}
          size="lg"
          onClick={() => onAnswerChange(false)}
          disabled={disabled}
          className={`h-20 text-lg ${
            userAnswer === false ? 'bg-red-600 hover:bg-red-700' : ''
          }`}
        >
          <XCircle className="mr-2 h-6 w-6" />
          Falso
        </Button>
      </div>
    </div>
  );
};
