export function Footer() {
  return (
    <footer className='bg-background w-full border-t py-4'>
      <div className='container mx-auto flex h-full items-center justify-center'>
        <p className='text-muted-foreground text-sm'>
          &copy; {new Date().getFullYear()} EatZilla. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
