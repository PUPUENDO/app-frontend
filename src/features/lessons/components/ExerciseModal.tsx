import React from 'react';
import { Modal } from '@/components/ui/modal';
import { ExerciseView } from '@/features/exercises/components/ExerciseView';

interface ExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonId: string;
  lessonTitle: string;
}

export const ExerciseModal: React.FC<ExerciseModalProps> = ({
  isOpen,
  onClose,
  lessonId,
  lessonTitle,
}) => {
  const handleComplete = (score: number) => {
    console.log(`Ejercicio completado con puntuación: ${score}`);
    // Aquí podrías agregar lógica adicional como actualizar estadísticas
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Ejercicio: ${lessonTitle}`}
      size="xl"
    >
      <div className="py-4">
        <ExerciseView lessonId={lessonId} onComplete={handleComplete} />
      </div>
    </Modal>
  );
};
