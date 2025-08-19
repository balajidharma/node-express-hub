import { z } from 'zod';

export const userRegistrationSchema = z.object({
  name: z.string(),
  username: z.string(),
  email: z.email(),
  password: z.string().min(8),
});

export const userLoginSchema = z.object({
  username: z.string(),
  password: z.string().min(8),
});

type UserRegistration = z.infer<typeof userRegistrationSchema>;
type UserLogin = z.infer<typeof userLoginSchema>;

export { UserRegistration, UserLogin };