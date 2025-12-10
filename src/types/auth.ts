import { z } from 'zod'

export const LoginRequestSchema = z.object({
  email: z.string().email('Email is not valid'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
})
export type LoginRequest = z.infer<typeof LoginRequestSchema>

export const RegisterRequestSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters long'),
    email: z.string().email('Email is not valid'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z.string().min(6, 'Confirm Password must be at least 6 characters long'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
  })
export type RegisterRequest = z.infer<typeof RegisterRequestSchema>

export const LoginResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
  tokens: z.object({
    access: z.object({
      token: z.string(),
      expires: z.string(),
    }),
    refresh: z.object({
      token: z.string(),
      expires: z.string(),
    }),
  }),
})
export type LoginResponse = z.infer<typeof LoginResponseSchema>

export const RegisterResponseSchema = LoginResponseSchema
export type RegisterResponse = z.infer<typeof RegisterResponseSchema>

export const LogoutResponseSchema = z.object({
  message: z.string(),
})
export type LogoutResponse = z.infer<typeof LogoutResponseSchema>
