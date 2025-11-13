import React, { useState, useEffect } from 'react';
import { Exercise, UserAnswer, ValidationResult, ExerciseType } from '../types';
import { ExerciseApiService } from '../ExerciseApiService';
import { TrueFalseExercise } from './TrueFalseExercise';
import { MultipleChoiceExercise } from './MultipleChoiceExercise';
import { FillBlankExercise } from './FillBlankExercise';
import { CodeCompletionExercise } from './CodeCompletionExercise';
import { OpenEndedExercise } from './OpenEndedExercise';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ExerciseViewProps {
  lessonId: string;
  onComplete?: (score: number) => void;
}

export const ExerciseView: React.FC<ExerciseViewProps> = ({ lessonId, onComplete }) => {
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState(false);
  const [userAnswer, setUserAnswer] = useState<UserAnswer | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Cargar ejercicio al montar
  useEffect(() => {
    loadExercise();
  }, [lessonId]);

  const loadExercise = async () => {
    try {
      setLoading(true);
      const exerciseData = await ExerciseApiService.generateExercise(lessonId);
      setExercise(exerciseData);
      
      // Inicializar respuesta según el tipo
      initializeAnswer(exerciseData.type);
    } catch (error: any) {
      toast.error(error.message || 'Error al cargar el ejercicio');
    } finally {
      setLoading(false);
    }
  };

  const initializeAnswer = (type: ExerciseType) => {
    switch (type) {
      case 'true_false':
        setUserAnswer(null);
        break;
      case 'multiple_choice':
        setUserAnswer(null);
        break;
      case 'fill_blank':
        setUserAnswer({});
        break;
      case 'code_completion':
      case 'open_ended':
        setUserAnswer('');
        break;
      case 'matching':
        setUserAnswer({});
        break;
    }
  };

  const handleSubmit = async () => {
    // Validar que hay una respuesta
    if (!exercise) {
      toast.error('No hay ejercicio cargado');
      return;
    }

    if (userAnswer === null || userAnswer === undefined) {
      toast.error('Por favor selecciona o escribe una respuesta');
      return;
    }

    // Validación específica por tipo
    if (typeof userAnswer === 'string' && userAnswer.trim() === '') {
      toast.error('Por favor escribe una respuesta');
      return;
    }

    if (typeof userAnswer === 'object' && !Array.isArray(userAnswer)) {
      const keys = Object.keys(userAnswer);
      if (keys.length === 0) {
        toast.error('Por favor completa todos los campos');
        return;
      }
      // Verificar que todos los valores estén completos
      const hasEmptyValues = keys.some(key => {
        const value = (userAnswer as any)[key];
        return value === '' || value === null || value === undefined;
      });
      if (hasEmptyValues) {
        toast.error('Por favor completa todos los espacios');
        return;
      }
    }

    try {
      setValidating(true);
      console.log('🚀 Enviando respuesta:', { type: exercise.type, userAnswer });
      
      const result = await ExerciseApiService.validateAnswer(lessonId, userAnswer);
      setValidation(result);
      setShowResult(true);

      // Notificar al padre si se completó con éxito
      if (result.isCorrect && onComplete) {
        onComplete(result.score);
      }
    } catch (error: any) {
      console.error('💥 Error en handleSubmit:', error);
      toast.error(error.message || 'Error al validar la respuesta');
    } finally {
      setValidating(false);
    }
  };

  const handleTryAgain = () => {
    setShowResult(false);
    setValidation(null);
    if (exercise) {
      initializeAnswer(exercise.type);
    }
  };

  // Renderizar ejercicio según el tipo
  const renderExercise = () => {
    if (!exercise) return null;

    const disabled = validating || showResult;

    switch (exercise.content.type) {
      case 'true_false':
        return (
          <TrueFalseExercise
            content={exercise.content.data}
            userAnswer={userAnswer as boolean | null}
            onAnswerChange={(answer) => setUserAnswer(answer)}
            disabled={disabled}
          />
        );

      case 'multiple_choice':
        return (
          <MultipleChoiceExercise
            content={exercise.content.data}
            userAnswer={userAnswer as string | null}
            onAnswerChange={(answer) => setUserAnswer(answer)}
            disabled={disabled}
          />
        );

      case 'fill_blank':
        return (
          <FillBlankExercise
            content={exercise.content.data}
            userAnswer={userAnswer as { [key: number]: string }}
            onAnswerChange={(blankId, value) => {
              setUserAnswer({ ...(userAnswer as object), [blankId]: value });
            }}
            disabled={disabled}
          />
        );

      case 'code_completion':
        return (
          <CodeCompletionExercise
            content={exercise.content.data}
            userAnswer={userAnswer as string}
            onAnswerChange={(code) => setUserAnswer(code)}
            disabled={disabled}
          />
        );

      case 'open_ended':
        return (
          <OpenEndedExercise
            content={exercise.content.data}
            userAnswer={userAnswer as string}
            onAnswerChange={(answer) => setUserAnswer(answer)}
            disabled={disabled}
          />
        );

      default:
        return (
          <div className="text-center text-gray-500 py-8">
            <AlertCircle className="mx-auto h-12 w-12 mb-2" />
            <p>Tipo de ejercicio no soportado: {exercise.type}</p>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="py-12">
          <div className="flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600">Generando ejercicio...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!exercise) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="py-12">
          <div className="text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <p className="text-gray-600 mb-4">No se pudo cargar el ejercicio</p>
            <Button onClick={loadExercise}>Intentar de nuevo</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-2xl mb-2">Ejercicio</CardTitle>
            <CardDescription className="text-base">{exercise.instructions}</CardDescription>
          </div>
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
            {exercise.maxPoints} pts
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Renderizar ejercicio */}
        {renderExercise()}

        {/* Resultado de validación */}
        {showResult && validation && (
          <div
            className={`rounded-lg p-6 border-2 ${
              validation.status === 'approved_excellent'
                ? 'bg-green-50 border-green-500'
                : validation.status === 'approved_improve'
                ? 'bg-yellow-50 border-yellow-500'
                : 'bg-red-50 border-red-500'
            }`}
          >
            <div className="flex items-start gap-3">
              {validation.isCorrect ? (
                <CheckCircle2 className={`h-8 w-8 flex-shrink-0 ${
                  validation.status === 'approved_excellent' ? 'text-green-600' : 'text-yellow-600'
                }`} />
              ) : (
                <XCircle className="h-8 w-8 text-red-600 flex-shrink-0" />
              )}
              <div className="flex-1">
                <h3
                  className={`text-xl font-bold mb-2 ${
                    validation.status === 'approved_excellent'
                      ? 'text-green-900'
                      : validation.status === 'approved_improve'
                      ? 'text-yellow-900'
                      : 'text-red-900'
                  }`}
                >
                  {validation.status === 'approved_excellent' && '¡Excelente! 🎉'}
                  {validation.status === 'approved_improve' && '¡Bien! Puede mejorar 👍'}
                  {validation.status === 'rejected' && 'Incorrecto ❌'}
                </h3>
                <p className={
                  validation.status === 'approved_excellent'
                    ? 'text-green-800'
                    : validation.status === 'approved_improve'
                    ? 'text-yellow-800'
                    : 'text-red-800'
                }>
                  {validation.feedback}
                </p>
                
                {/* Sugerencias (si existen) */}
                {validation.suggestions && (
                  <div className="mt-3 p-3 bg-white rounded border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-1">💡 Sugerencias:</p>
                    <p className="text-sm text-gray-600">{validation.suggestions}</p>
                  </div>
                )}

                <div className="mt-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      validation.status === 'approved_excellent'
                        ? 'bg-green-200 text-green-900'
                        : validation.status === 'approved_improve'
                        ? 'bg-yellow-200 text-yellow-900'
                        : 'bg-red-200 text-red-900'
                    }`}
                  >
                    Puntuación: {validation.score} / 100 pts
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex gap-3 pt-4 border-t">
          {!showResult ? (
            <Button
              onClick={handleSubmit}
              disabled={validating}
              className="flex-1 bg-green-600 hover:bg-green-700"
              size="lg"
            >
              {validating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Validando...
                </>
              ) : (
                'Enviar Respuesta'
              )}
            </Button>
          ) : (
            <>
              {!validation?.isCorrect && (
                <Button onClick={handleTryAgain} variant="outline" size="lg" className="flex-1">
                  Intentar de nuevo
                </Button>
              )}
              <Button
                onClick={() => window.history.back()}
                variant="default"
                size="lg"
                className="flex-1"
              >
                {validation?.isCorrect ? 'Continuar' : 'Volver a lecciones'}
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
