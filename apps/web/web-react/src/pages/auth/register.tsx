import InputError from '@web-react/components/input-error';
import TextLink from '@web-react/components/text-link';
import { Button } from '@web-react/components/ui/button';
import { Input } from '@web-react/components/ui/input';
import { Label } from '@web-react/components/ui/label';
import AuthLayout from '@web-react/layouts/auth-layout';
import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserRegistrationSchema, UserRegistration } from '@shared-types';
import axios, { AxiosError } from 'axios';
import { useLocation, useNavigate } from 'react-router';
import { authClient } from '@web-react/lib/auth-client';
import { setSession } from '@web-react/features/auth/authSlice';
import { useSelector, useDispatch } from 'react-redux'

export default function Register() {
  const authState = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UserRegistration>({
    resolver: zodResolver(UserRegistrationSchema),
  });

  const from = location.state?.from?.pathname || '/dashboard';

  const onSubmit = async (data: UserRegistration) => {
    try {
      const { data: session, error } = await authClient.signUp.email(data);
      if (session) {
        dispatch(setSession(session));
        navigate(from, { replace: true });
      }
      if (error) {
        // error code get username_taken or email_taken
        if (error.code === 'USERNAME_IS_ALREADY_TAKEN_PLEASE_TRY_ANOTHER') {
          setError('username', { type: 'manual', message: 'Username is already taken' });
        }
        if (error.code === 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL') {
          setError('email', { type: 'manual', message: 'Email is already taken' });
        }
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response?.data?.fieldErrors) {
        Object.entries(error.response.data.fieldErrors).forEach(
          ([key, value]) => {
            // @ts-expect-error
            setError(key, { type: 'manual', message: value[0] });
          }
        );
      }
    }
  };

  return (
    <AuthLayout
      title="Create an account"
      description="Enter your details below to create your account"
    >
      <title>Register</title>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              required
              autoFocus
              tabIndex={1}
              autoComplete="name"
              {...register('name')}
              placeholder="Full name"
            />
            <InputError message={errors.name && errors.name.message} className="mt-2" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              required
              autoFocus
              tabIndex={2}
              autoComplete="username"
              {...register('username')}
              placeholder="Username"
            />
            <InputError message={errors.username && errors.username.message} className="mt-2" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              required
              tabIndex={3}
              autoComplete="email"
              {...register('email')}
              placeholder="email@example.com"
            />
            <InputError message={errors.email && errors.email.message} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              tabIndex={4}
              autoComplete="new-password"
              {...register('password')}
              placeholder="Password"
            />
            <InputError message={errors.password && errors.password.message} />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password_confirmation">Confirm password</Label>
            <Input
              id="password_confirmation"
              type="password"
              required
              tabIndex={5}
              autoComplete="new-password"
              {...register('password_confirmation')}
              placeholder="Confirm password"
            />
            <InputError message={errors.password_confirmation && errors.password_confirmation.message} />
          </div>

          <Button
            type="submit"
            className="mt-2 w-full"
            tabIndex={6}
            disabled={isSubmitting}
          >
            {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
            Create account
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <TextLink to="/login" tabIndex={7}>
            Log in
          </TextLink>
        </div>
      </form>
    </AuthLayout>
  );
}
