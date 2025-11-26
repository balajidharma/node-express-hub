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
import { useLocation, useNavigate } from 'react-router';
import { loginUser } from '@web-react/features/auth/authSlice';
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react';

interface LoginProps {
  canResetPassword: boolean;
}

export default function Login({ canResetPassword }: LoginProps) {
  const authState = useSelector((state: any) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch()

  useEffect(() => {
    if (authState.isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [authState.isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<UserLogin>({
    resolver: zodResolver(UserLoginSchema),
    defaultValues: {
      remember: false,
    },
  });

  const from = location.state?.from?.pathname || '/dashboard';

  const onSubmit = async (data: UserLogin) => {
    try {
      const resultAction = await dispatch(loginUser(data) as any);
      if (loginUser.fulfilled.match(resultAction)) {
        navigate(from, { replace: true });
      } else {
        if (resultAction.payload?.code === 'INVALID_USERNAME_OR_PASSWORD') {
          setError('username', {
            type: 'manual',
            message: resultAction.payload.message,
          });
        }
      }
    } catch (error) {
      console.error(error);
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
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              required
              tabIndex={1}
              autoComplete="email"
              {...register('email')}
              placeholder="email@example.com"
            />
            <InputError message={errors.email && errors.email.message} />
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
            <Checkbox id="remember" tabIndex={3} {...register('remember')} />
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
