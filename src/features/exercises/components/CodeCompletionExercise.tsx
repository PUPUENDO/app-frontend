import React from 'react';
import { CodeCompletionContent } from '../types';
import { Textarea } from '@/components/ui/textarea';

interface CodeCompletionExerciseProps {
  content: CodeCompletionContent;
  userAnswer: string;
  onAnswerChange: (code: string) => void;
  disabled?: boolean;
}

export const CodeCompletionExercise: React.FC<CodeCompletionExerciseProps> = ({
  content,
  userAnswer,
  onAnswerChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-6">
      {/* Instrucción */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-lg text-gray-800 font-medium">{content.instruction}</p>
      </div>

      {/* Código inicial (solo lectura) */}
      {content.starterCode && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Código inicial:
          </label>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
            {content.starterCode}
          </pre>
        </div>
      )}

      {/* Área para escribir código */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tu solución:
        </label>
        <Textarea
          value={userAnswer}
          onChange={(e) => onAnswerChange(e.target.value)}
          disabled={disabled}
          placeholder="Escribe tu código aquí..."
          rows={12}
          className="font-mono text-sm"
        />
      </div>

      {/* Salida esperada (si existe) */}
      {content.expectedOutput && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm font-medium text-green-900 mb-2">Salida esperada:</p>
          <pre className="bg-white p-3 rounded border border-green-300 text-sm font-mono text-gray-800">
            {content.expectedOutput}
          </pre>
        </div>
      )}

      {/* Casos de prueba (si existen) */}
      {content.testCases && content.testCases.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm font-medium text-yellow-900 mb-3">Casos de prueba:</p>
          <div className="space-y-2">
            {content.testCases.map((testCase, index) => (
              <div key={index} className="bg-white p-3 rounded border border-yellow-300">
                <p className="text-xs text-gray-600 mb-1">Caso {index + 1}:</p>
                <p className="text-sm">
                  <span className="font-medium">Entrada:</span>{' '}
                  <code className="bg-gray-100 px-2 py-1 rounded">{testCase.input}</code>
                </p>
                <p className="text-sm">
                  <span className="font-medium">Salida esperada:</span>{' '}
                  <code className="bg-gray-100 px-2 py-1 rounded">{testCase.expectedOutput}</code>
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
