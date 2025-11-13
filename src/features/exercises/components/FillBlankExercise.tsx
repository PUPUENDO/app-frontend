import React from 'react';
import { FillBlankContent } from '../types';
import { Input } from '@/components/ui/input';

interface FillBlankExerciseProps {
  content: FillBlankContent;
  userAnswer: { [key: number]: string };
  onAnswerChange: (blankId: number, value: string) => void;
  disabled?: boolean;
}

export const FillBlankExercise: React.FC<FillBlankExerciseProps> = ({
  content,
  userAnswer,
  onAnswerChange,
  disabled = false,
}) => {
  // Dividir el texto por los marcadores de espacios en blanco ___
  const renderTextWithBlanks = () => {
    const parts = content.text.split('___');
    const elements: React.ReactNode[] = [];

    parts.forEach((part, index) => {
      // Agregar el texto
      if (part) {
        elements.push(
          <span key={`text-${index}`} className="text-gray-800">
            {part}
          </span>
        );
      }

      // Agregar input para el espacio en blanco (excepto después del último fragmento)
      if (index < parts.length - 1) {
        const blankId = index;
        elements.push(
          <Input
            key={`blank-${blankId}`}
            type="text"
            value={userAnswer[blankId] || ''}
            onChange={(e) => onAnswerChange(blankId, e.target.value)}
            disabled={disabled}
            placeholder={`Respuesta ${blankId + 1}`}
            className="inline-block w-40 mx-2 h-8 text-center font-medium"
          />
        );
      }
    });

    return elements;
  };

  return (
    <div className="space-y-6">
      {/* Instrucción */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800 font-medium">
          💡 Completa los espacios en blanco con las palabras correctas
        </p>
      </div>

      {/* Texto con espacios en blanco */}
      <div className="bg-white border border-gray-300 rounded-lg p-6 text-lg leading-relaxed">
        {renderTextWithBlanks()}
      </div>

      {/* Ayuda */}
      <div className="text-sm text-gray-500">
        <p>📝 Completa todos los espacios en blanco para enviar tu respuesta</p>
      </div>
    </div>
  );
};
