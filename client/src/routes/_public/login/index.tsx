import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import { loginFormSchema, LoginFormValues } from '@/schemas/auth.schema';
import { useAuth } from '@/contexts/auth-context';
import { useState } from 'react';

interface LoginSearch {
  from?: string;
}

export const Route = createFileRoute('/_public/login/')({
  validateSearch: (search: Record<string, unknown>): LoginSearch => {
    return {
      from: search.from as string | undefined,
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { from = '/' } = Route.useSearch();
  const { login } = useAuth();
  const [isPending, setIsPending] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: LoginFormValues) {
    try {
      setIsPending(true);
      await login(values.email, values.password);
      toast.success('Login successful!');
      form.reset();
      navigate({ to: from });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || 'Invalid email or password');
      } else {
        toast.error('Invalid email or password');
      }
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className='px-auto flex min-h-full w-full items-center justify-center'>
      <Card className='w-[350px]'>
        <CardHeader>
          <h2 className='text-center text-2xl font-bold'>Login</h2>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4' noValidate>
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter your email'
                        type='email'
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='password'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter your password'
                        type='password'
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full' disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader className='mr-2 h-4 w-4 animate-spin' />
                    Logging in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className='flex justify-center'>
          <p className='text-sm text-gray-500'>
            Don&apos;t have an account?{' '}
            <Link to='/register' className='text-primary hover:underline'>
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
