import { cn } from '@/lib/utils';

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn('bg-background ${className} h-12 w-full border-t', className)}>
      <div className='container mx-auto flex h-full items-center justify-center px-4'>
        <p className='text-muted-foreground text-sm'>
          &copy; {new Date().getFullYear()} EatZilla. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
