import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('Email inválido'),
  displayName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  role: z.enum(['student', 'admin']),
});

export const updateUserSchema = z.object({
  displayName: z.string().min(3, 'El nombre debe tener al menos 3 caracteres').optional(),
  role: z.enum(['student', 'admin']).optional(),
  xp: z.number().min(0).optional(),
  level: z.number().min(1).optional(),
});

export type CreateUserForm = z.infer<typeof createUserSchema>;
export type UpdateUserForm = z.infer<typeof updateUserSchema>;

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
