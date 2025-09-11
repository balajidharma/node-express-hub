import InputError from '@web-react/components/input-error';
import TextLink from '@web-react/components/text-link';
import { Button } from '@web-react/components/ui/button';
import { Checkbox } from '@web-react/components/ui/checkbox';
import { Input } from '@web-react/components/ui/input';
import { Label } from '@web-react/components/ui/label';
import AuthLayout from '@web-react/layouts/auth-layout';
import { LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserLoginSchema, UserLogin } from '@shared-types';
import axios, { AxiosError } from 'axios';
import authContext, { AuthContextType } from '@web-react/context/auth-context';
import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router';

interface LoginProps {
  status?: string;
  canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
  const auth: AuthContextType = useContext(authContext);
  const location = useLocation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UserLogin>({
    resolver: zodResolver(UserLoginSchema),
  });

  const from = location.state?.from?.pathname || '/dashboard';

  const onSubmit = async (data: UserLogin) => {
    const API_AUTH_BASE_URL =
      import.meta.env.API_AUTH_BASE_URL || 'http://localhost:3333';
    try {
      const response = await axios.post('/auth/login', data, {
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
      title="Log in to your account"
      description="Enter your email and password below to log in"
    >
      <title>Log in</title>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              {...register('username')}
              required
              autoFocus
              tabIndex={1}
              autoComplete="username"
              placeholder="Your username"
            />
            <InputError message={errors.username && errors.username.message} />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              {canResetPassword && (
                <TextLink
                  to="/forgot-password"
                  className="ml-auto text-sm"
                  tabIndex={5}
                >
                  Forgot password?
                </TextLink>
              )}
            </div>
            <Input
              id="password"
              type="password"
              {...register('password')}
              required
              tabIndex={2}
              autoComplete="current-password"
              placeholder="Password"
            />
            <InputError message={errors.password && errors.password.message} />
          </div>

          <div className="flex items-center space-x-3">
            <Checkbox id="remember" name="remember" tabIndex={3} />
            <Label htmlFor="remember">Remember me</Label>
          </div>

          <Button
            type="submit"
            className="mt-4 w-full"
            tabIndex={4}
            disabled={isSubmitting}
          >
            {isSubmitting && <LoaderCircle className="h-4 w-4 animate-spin" />}
            Log in
          </Button>
        </div>

        <div className="text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <TextLink to="/register" tabIndex={5}>
            Sign up
          </TextLink>
        </div>
      </form>
    </AuthLayout>
  );
}
