import { Loader } from 'lucide-react';

export const FullScreenLoader = () => {
  return (
    <div className='bg-background/80 fixed inset-0 flex items-center justify-center backdrop-blur-sm'>
      <Loader className='text-primary h-8 w-8 animate-spin' />
    </div>
  );
};
