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

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserRegistration>({
    resolver: zodResolver(UserRegistrationSchema),
  });

  const onSubmit = async (data: UserRegistration) => {};

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
            <InputError message={errors.name} className="mt-2" />
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
            <InputError message={errors.username} className="mt-2" />
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
            <InputError message={errors.email} />
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
            <InputError message={errors.password} />
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
            <InputError message={errors.password_confirmation} />
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
