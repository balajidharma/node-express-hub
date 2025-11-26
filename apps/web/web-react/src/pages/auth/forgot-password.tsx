import { LoaderCircle } from 'lucide-react';
import InputError from '@web-react/components/input-error';
import TextLink from '@web-react/components/text-link';
import { Button } from '@web-react/components/ui/button';
import { Input } from '@web-react/components/ui/input';
import { Label } from '@web-react/components/ui/label';
import AuthLayout from '@web-react/layouts/auth-layout';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserForgotPasswordSchema, UserForgotPassword } from '@shared-types';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { authClient } from '@web-react/lib/auth-client';

export default function ForgotPassword() {
  const authState = useSelector((state: any) => state.auth);
  const navigate = useNavigate();
  const [status, setStatus] = useState<string | null>(null);

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
  } = useForm<UserForgotPassword>({
    resolver: zodResolver(UserForgotPasswordSchema),
  });

  const onSubmit = async (data: UserForgotPassword) => {
    try {
      const { data: response, error } = await authClient.requestPasswordReset({
        email: data.email,
      });
      if (error) {
        setError('email', { message: error.message });
      }
      if (response) {
        setStatus(response.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthLayout
      title="Forgot password"
      description="Enter your email to receive a password reset link"
    >
      {status && (
        <div className="mb-4 text-center text-sm font-medium text-green-600">
          {status}
        </div>
      )}

      <div className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <>
            <div className="grid gap-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                required
                tabIndex={1}
                autoFocus
                autoComplete="email"
                placeholder="email@example.com"
                {...register('email')}
              />

              <InputError message={errors.email && errors.email.message} />
            </div>

            <div className="my-6 flex items-center justify-start">
              <Button
                className="w-full"
                disabled={isSubmitting}
                data-test="email-password-reset-link-button"
              >
                {isSubmitting && (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                )}
                Email password reset link
              </Button>
            </div>
          </>
        </form>

        <div className="space-x-1 text-center text-sm text-muted-foreground">
          <span>Or, return to</span>
          <TextLink to="/login">log in</TextLink>
        </div>
      </div>
    </AuthLayout>
  );
}
