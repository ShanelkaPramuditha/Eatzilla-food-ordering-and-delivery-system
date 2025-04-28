import { createFileRoute } from '@tanstack/react-router';
import { Clock, Package, ShoppingBag } from 'lucide-react';
import { OrdersList } from './-order-list';
import { useState } from 'react';

export const Route = createFileRoute('/_auth/_customer/my-orders/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [totalOrders, setTotalOrders] = useState(0);
  const [inProgress, setInProgress] = useState(0);
  return (
    <div className='min-h-screen w-full bg-slate-50 dark:bg-slate-900'>
      <div className='relative overflow-hidden pt-16 pb-20'>
        {/* Background gradient */}
        <div className='absolute inset-0 bg-gradient-to-br from-violet-600 via-indigo-600 to-indigo-700 dark:from-indigo-950 dark:via-slate-900 dark:to-slate-950'></div>

        {/* Decorative shapes */}
        <div className='absolute inset-0'>
          {/* Circles */}
          <div className='absolute top-12 right-1/4 h-64 w-64 rounded-full bg-white/10 blur-xl'></div>
          <div className='absolute right-1/3 bottom-0 h-80 w-80 rounded-full bg-indigo-500/10 blur-xl dark:bg-indigo-500/5'></div>
          <div className='absolute -top-20 -left-16 h-64 w-64 rounded-full bg-violet-500/20 blur-lg dark:bg-violet-500/10'></div>

          {/* Wave pattern */}
          <svg
            className='absolute right-0 bottom-0 left-0 text-indigo-500/20 dark:text-indigo-900/30'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 1440 320'
          >
            <path
              fill='currentColor'
              fillOpacity='1'
              d='M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'
            ></path>
          </svg>

          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIgMS44LTQgNC00czQgMS44IDQgNC0xLjggNC00IDQtNC0xLjgtNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
        </div>

        <div className='relative container mx-auto px-4'>
          {/* Floating shapes */}
          <div className='absolute top-10 right-10 hidden h-20 w-20 rotate-12 rounded-lg bg-gradient-to-br from-violet-400/30 to-fuchsia-400/30 backdrop-blur-md lg:block dark:from-violet-400/10 dark:to-fuchsia-400/10'></div>
          <div className='absolute bottom-10 left-10 hidden h-16 w-16 rounded-full bg-gradient-to-br from-indigo-400/30 to-sky-400/30 backdrop-blur-md lg:block dark:from-indigo-400/10 dark:to-sky-400/10'></div>

          <div className='relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between'>
            <div className='max-w-2xl space-y-5'>
              <div className='inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-sm text-white backdrop-blur-sm dark:bg-white/10'>
                <Clock className='h-4 w-4' />
                <span>Track your orders in real-time</span>
              </div>

              <h1 className='text-4xl font-bold text-white md:text-5xl'>
                Your Orders
                <span className='ml-2 inline-block'>
                  <svg
                    width='36'
                    height='36'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    className='text-indigo-300 dark:text-indigo-400'
                  >
                    <path
                      d='M8.5 14.25L5 10.75L8.5 7.25'
                      stroke='currentColor'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M15.5 7.25L19 10.75L15.5 14.25'
                      stroke='currentColor'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M13 5L11 16.5'
                      stroke='currentColor'
                      strokeWidth='1.5'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </span>
              </h1>

              <p className='max-w-xl text-lg text-indigo-100 dark:text-slate-300'>
                View and manage all your food deliveries in one place. Track status, check details,
                and get updates.
              </p>

              <div className='flex flex-wrap gap-3 pt-2'>
                <div className='flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-sm text-white backdrop-blur-sm dark:bg-white/10'>
                  <span className='h-2 w-2 rounded-full bg-emerald-400'></span>
                  <span>Real-time Updates</span>
                </div>
                <div className='flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-sm text-white backdrop-blur-sm dark:bg-white/10'>
                  <span className='h-2 w-2 rounded-full bg-amber-400'></span>
                  <span>Status Tracking</span>
                </div>
                <div className='flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 text-sm text-white backdrop-blur-sm dark:bg-white/10'>
                  <span className='h-2 w-2 rounded-full bg-sky-400'></span>
                  <span>Delivery Notifications</span>
                </div>
              </div>
            </div>

            <div className='z-10 flex flex-row items-center justify-center gap-4 md:justify-end'>
              <div className='min-w-[150px] rounded-2xl border border-white/20 bg-white/10 p-5 text-center text-white shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-white/5'>
                <div className='mb-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 p-3 dark:from-indigo-500/10 dark:to-violet-500/10'>
                  <ShoppingBag className='mx-auto h-8 w-8' />
                </div>
                <div className='text-2xl font-bold'>{totalOrders}</div>
                <div className='mt-1 text-xs text-indigo-100 dark:text-slate-300'>Total Orders</div>
              </div>

              <div className='min-w-[150px] rounded-2xl border border-white/20 bg-white/10 p-5 text-center text-white shadow-xl backdrop-blur-md dark:border-white/10 dark:bg-white/5'>
                <div className='mb-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 p-3 dark:from-amber-500/10 dark:to-orange-500/10'>
                  <Package className='mx-auto h-8 w-8' />
                </div>
                <div className='text-2xl font-bold'>{inProgress}</div>
                <div className='mt-1 text-xs text-indigo-100 dark:text-slate-300'>In Progress</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='relative z-20 container mx-auto -mt-16 px-4 py-8'>
        <OrdersList setTotal={setTotalOrders} setInProgress={setInProgress} />
      </div>
    </div>
  );
}
