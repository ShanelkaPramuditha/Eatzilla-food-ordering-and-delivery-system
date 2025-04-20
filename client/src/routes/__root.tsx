import { AlertCircle } from 'lucide-react';
import { createRootRouteWithContext } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { Layout } from '@/routes/-layout';
import type { AuthContext } from '@/contexts/auth-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Toaster } from '@/components/ui/sonner';

interface MyRouterContext {
  auth: AuthContext;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  return (
    <>
      <Layout />
      <Toaster richColors={true} />
      <ReactQueryDevtools initialIsOpen={false} />
      {/* <TanStackRouterDevtools position='bottom-left' initialIsOpen={false} /> */}
    </>
  );
}

function ErrorComponent() {
  return (
    <div className='flex min-h-screen items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <AlertCircle className='text-destructive h-5 w-5' />
            <CardTitle>Something went wrong!</CardTitle>
          </div>
          <CardDescription>An error occurred while loading the application.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='text-muted-foreground text-sm'>
            Please try refreshing the page or contact support if the problem persists.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
