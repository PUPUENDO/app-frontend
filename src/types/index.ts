export interface User {
  id: string;
  email: string;
  displayName: string | null;
  role: 'student' | 'admin';
  xp: number;
  level: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Topic {
  id: string;
  courseId: string;
  name: string;
  description: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subtopic {
  id: string;
  topicId: string;
  name: string;
  description: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  topicId: string;
  subtopicId?: string | null;
  name: string;
  content: string;
  videoUrl?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Exercise {
  id: string;
  lessonId: string;
  question: string;
  correctAnswer: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
}

export interface ExerciseAttempt {
  id: string;
  userId: string;
  lessonId: string;
  userAnswer: string;
  isCorrect: boolean;
  feedback: string;
  xpEarned: number;
  status: 'pending' | 'evaluated';
  createdAt: Date;
  evaluatedAt?: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xpRequired: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserAchievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
