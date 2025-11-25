import { z } from 'zod';

export const UserRegistrationSchema = z.object({
  name: z.string(),
  username: z.string(),
  email: z.email(),
  password: z.string().min(8),
  password_confirmation: z.string().min(8),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords must match",
  path: ["password"],
});

export const UserLoginSchema = z.object({
  username: z.string(),
  password: z.string().min(8),
  remember: z.boolean().default(false),
});
export type UserRegistration = z.infer<typeof UserRegistrationSchema>;
export type UserLogin = z.infer<typeof UserLoginSchema>;
