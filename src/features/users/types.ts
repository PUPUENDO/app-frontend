import { z } from 'zod';

// Schemas matching backend requests
export const createUserSchema = z.object({
  email: z.string().email('Email inválido'),
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  profilePicture: z.string().url('URL de imagen inválida').optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  currentCourseId: z.string().optional(),
  profilePicture: z.string().url('Debe ser una URL válida').optional().or(z.literal('')),
  role: z.enum(['student', 'admin']).optional()
});

export type CreateUserForm = z.infer<typeof createUserSchema>;
export type UpdateUserForm = z.infer<typeof updateUserSchema>;

// Auxiliary Types matching backend Value Objects
export type UserAchievement = {
  achievementId: string;
  quantity: number;
};

export type StreakDataPrimitives = {
  currentStreak: number;
  bestStreak: number;
  lastStudyDate: string | null;
};

export type UserStatsPrimitives = {
  totalLessonsCompleted: number;
  totalExercisesCompleted: number;
  totalCoursesCompleted: number;
};

export type CurrentAttemptPrimitives = {
  lessonId: string;
  attemptId: string;
  courseId: string;
  status: 'evaluating' | 'approvedExcellent' | 'approvedImprove' | 'rejected';
  userAnswer: string | object;
  createdAt: Date | string;
  aiFeedback?: {
    score: number;
    feedback: string;
    suggestions?: string;
  };
};

export type ProgressPrimitives = Record<string, any>;

// Main User Interface matching UserPrimitives
export interface User {
  __id: string; // Backend uses __id
  name: string;
  email: string;
  role: 'student' | 'admin';
  xp?: number;
  progress?: ProgressPrimitives;
  achievements?: UserAchievement[];
  streakData?: StreakDataPrimitives;
  stats?: UserStatsPrimitives;
  currentCourseId?: string;
  profilePicture?: string;
  currentAttempt?: CurrentAttemptPrimitives;
  enrolledCourses?: string[];
  createdAt: string; // Backend returns ISO string
}
