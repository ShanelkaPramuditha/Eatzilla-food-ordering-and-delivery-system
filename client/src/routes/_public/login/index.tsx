import { createFileRoute, Link } from '@tanstack/react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
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
import { loginFormSchema } from '@/schemas/auth.schema';

export const Route = createFileRoute('/_public/login/')({
  component: RouteComponent,
});

function RouteComponent() {
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof loginFormSchema>) {
    console.log(values);
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
                      <Input placeholder='Enter your email' type='email' {...field} />
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
                      <Input placeholder='Enter your password' type='password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type='submit' className='w-full'>
                Sign in
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
