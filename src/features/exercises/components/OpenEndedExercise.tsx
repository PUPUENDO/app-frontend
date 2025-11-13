import React from 'react';
import { OpenEndedContent } from '../types';
import { Textarea } from '@/components/ui/textarea';

interface OpenEndedExerciseProps {
  content: OpenEndedContent;
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
  disabled?: boolean;
}

export const OpenEndedExercise: React.FC<OpenEndedExerciseProps> = ({
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

      {/* Criterios de evaluación */}
      {content.evaluationCriteria && content.evaluationCriteria.length > 0 && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm font-medium text-purple-900 mb-2">
            📋 Criterios de evaluación:
          </p>
          <ul className="list-disc list-inside space-y-1 text-sm text-purple-800">
            {content.evaluationCriteria.map((criterion, index) => (
              <li key={index}>{criterion}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Área de respuesta */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tu respuesta:
        </label>
        <Textarea
          value={userAnswer}
          onChange={(e) => onAnswerChange(e.target.value)}
          disabled={disabled}
          placeholder="Escribe tu respuesta aquí... Desarrolla tu explicación de manera clara y completa."
          rows={10}
          className="text-base"
        />
        <p className="text-xs text-gray-500 mt-2">
          💡 Esta respuesta será evaluada por IA. Asegúrate de ser claro y completo.
        </p>
      </div>
    </div>
  );
};
