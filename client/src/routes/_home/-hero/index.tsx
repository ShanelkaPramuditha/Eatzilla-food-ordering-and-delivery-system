import React from 'react';
import { UtensilsCrossed, Clock } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className='relative overflow-hidden'>
      {/* Background with gradient overlay */}
      <div className='absolute inset-0 z-0'>
        <div className="h-full w-full bg-[url('https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center"></div>
        <div className='absolute inset-0 bg-gradient-to-b from-purple-900/90 via-indigo-800/85 to-indigo-900/80 dark:from-gray-900/95 dark:via-gray-900/90 dark:to-gray-900/85'></div>

        {/* Decorative elements */}
        <div className='absolute top-0 left-0 h-full w-full overflow-hidden'>
          <div className='absolute top-[10%] left-[5%] h-32 w-32 rounded-full bg-purple-400/10 blur-3xl dark:bg-purple-500/10'></div>
          <div className='absolute top-[40%] right-[10%] h-40 w-40 rounded-full bg-indigo-400/20 blur-3xl dark:bg-indigo-500/10'></div>
        </div>
      </div>

      {/* Content */}
      <div className='relative z-10 container mx-auto px-4 py-20 pt-16 md:pt-28'>
        <div className='mx-auto max-w-4xl text-center'>
          <div className='mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md dark:bg-white/5'>
            <span className='mr-2 flex h-2 w-2 rounded-full bg-green-400'></span>
            <span className='text-sm font-medium text-white/90 dark:text-white/80'>
              Open for delivery • 24/7
            </span>
          </div>

          <h1 className='mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-4xl font-bold text-transparent md:text-5xl lg:text-6xl'>
            Delicious Food <br className='hidden sm:block' />
            Delivered To Your Door
          </h1>

          <p className='mx-auto mb-8 max-w-2xl text-lg text-white/80 md:text-xl dark:text-white/70'>
            Explore our diverse menu featuring fresh ingredients and chef-crafted recipes, all
            delivered to your doorstep with just a few clicks.
          </p>

          <div className='mb-12 flex flex-wrap justify-center gap-4'>
            <div className='flex items-center rounded-full border border-white/20 bg-white/10 px-5 py-2 backdrop-blur-md dark:bg-white/5'>
              <UtensilsCrossed className='mr-2 h-5 w-5 text-purple-300' />
              <span className='text-sm font-medium text-white/90 dark:text-white/80'>
                50+ Menu Items
              </span>
            </div>
            <div className='flex items-center rounded-full border border-white/20 bg-white/10 px-5 py-2 backdrop-blur-md dark:bg-white/5'>
              <Clock className='mr-2 h-5 w-5 text-purple-300' />
              <span className='text-sm font-medium text-white/90 dark:text-white/80'>
                20-30 min delivery
              </span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className='absolute bottom-0 left-1/2 flex -translate-x-1/2 transform flex-col items-center'>
          <div className='mb-2 flex h-10 w-6 justify-center rounded-full border-2 border-white/30'>
            <div className='mt-2 h-2 w-1 rounded-full bg-white/50'></div>
          </div>
        </div>
      </div>
    </div>
  );
}
