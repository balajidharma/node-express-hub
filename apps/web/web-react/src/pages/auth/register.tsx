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
import { useContext } from 'react';
import authContext, { AuthContextType } from '@web-react/context/auth-context';
import { useLocation, useNavigate } from 'react-router';

export default function Register() {
  const auth: AuthContextType = useContext(authContext);
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
    const API_AUTH_BASE_URL =
      import.meta.env.API_AUTH_BASE_URL || 'http://localhost:3333';
    try {
      const response = await axios.post('/auth/register', data, {
        baseURL: API_AUTH_BASE_URL,
      });
      if (response.status === 201) {
        console.log('Success:', response.data);
        auth?.login(response.data.token, response.data.expiresAt);
        navigate(from, { replace: true });
      } else {
        console.log('Error else:', response.data);
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
