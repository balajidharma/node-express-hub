import { z } from 'zod';

export const UserRegistrationSchema = z.object({
  name: z.string(),
  username: z.string(),
  email: z.email(),
  password: z.string().min(8),
});

export const UserLoginSchema = z.object({
  username: z.string(),
  password: z.string().min(8),
});

export const UserLoginSchema1 = z.object({
  username: z.string(),
  password: z.string().min(8),
});

export type UserRegistration = z.infer<typeof UserRegistrationSchema>;
export type UserLogin = z.infer<typeof UserLoginSchema>;
export type UserLogin1 = z.infer<typeof UserLoginSchema1>;
