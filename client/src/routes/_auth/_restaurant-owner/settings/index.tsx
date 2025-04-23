import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';

import { Coffee, Moon, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export const Route = createFileRoute('/_auth/_restaurant-owner/settings/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [isOpen, setIsOpen] = useState(true);
  const [date, setDate] = useState<Date>();
  return (
    <div className='grow rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]'>
      <div className='flex flex-col items-start justify-between sm:flex-row'>
        <h3 className='mb-4 text-lg font-semibold text-gray-800 dark:text-white/90'>Settings</h3>
      </div>
      <div className='flex-row-reverse gap-4 xl:flex'>
        <div className='mb-4 rounded-2xl border border-gray-200 p-5 lg:p-6 xl:mb-0 dark:border-gray-800'>
          <div>
            <div>
              <h4 className='text-lg font-semibold text-gray-800 dark:text-white/90'>
                Restaurant Status
              </h4>
              <p className='text-sm font-semibold text-gray-500'>
                Quickly toggle your restaurant's open/closed status.
              </p>
            </div>
            <div className='flex items-center justify-between'>
              <div>
                <p className='mb-4 text-lg font-medium'>
                  Your restaurant is currently
                  <span className={isOpen ? 'ml-1 text-green-600' : 'ml-1 text-red-600'}>
                    {isOpen ? 'OPEN' : 'CLOSED'}
                  </span>
                </p>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className={`rounded-sm px-6 py-1.5 font-semibold ${
                    isOpen
                      ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                      : 'bg-indigo-500 text-white hover:bg-indigo-600'
                  }`}
                >
                  {isOpen ? 'Close Restaurant' : 'Open Restaurant'}
                </button>

                <p className='mt-4 max-w-[300px] text-sm text-gray-500'>
                  {isOpen
                    ? "Closing will prevent new orders from coming in, but won't affect existing orders."
                    : 'Opening will allow customers to place new orders.'}
                </p>
              </div>
              <div
                className={`my-2 mb-6 flex h-32 w-32 items-center justify-center rounded-full transition-colors ${
                  isOpen ? 'bg-indigo-100' : 'bg-indigo-100'
                }`}
              >
                {isOpen ? (
                  <Coffee className='h-16 w-16 text-green-600' />
                ) : (
                  <Moon className='h-16 w-16 text-red-600' />
                )}
              </div>
            </div>
          </div>
        </div>
        <div className='grow rounded-2xl border border-gray-200 p-5 lg:p-6 dark:border-gray-800'>
          <div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between'>
            <div>
              <h4 className='text-lg font-semibold text-gray-800 lg:mb-6 dark:text-white/90'>
                Restaurant Information
              </h4>

              <div className='grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32'>
                <div>
                  <p className='mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400'>
                    Restaurant Name
                  </p>
                  <p className='text-sm font-medium text-gray-800 dark:text-white/90'>Musharof</p>
                </div>

                <div>
                  <p className='mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400'>
                    Address
                  </p>
                  <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
                    123 Main Street, Foodtown, FT 12345
                  </p>
                </div>

                <div>
                  <p className='mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400'>
                    Email address
                  </p>
                  <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
                    randomuser@pimjo.com
                  </p>
                </div>

                <div>
                  <p className='mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400'>
                    Phone
                  </p>
                  <p className='text-sm font-medium text-gray-800 dark:text-white/90'>
                    +09 363 398 46
                  </p>
                </div>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <button className='shadow-theme-xs flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 lg:inline-flex lg:w-auto dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200'>
                  <svg
                    className='fill-current'
                    width='18'
                    height='18'
                    viewBox='0 0 18 18'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z'
                      fill=''
                    />
                  </svg>
                  Edit
                </button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[500px]'>
                <DialogHeader>
                  <DialogTitle>Edit Restaurant Information</DialogTitle>
                  <DialogDescription>
                    Make changes to your restaurant information here. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                  <div className='grid grid-cols-3 items-center gap-2'>
                    <Label htmlFor='restaurant-name' className='text-right'>
                      Restaurant Name
                    </Label>
                    <Input id='restaurant-name' className='col-span-3 focus-visible:ring-0' />
                  </div>
                  <div className='grid grid-cols-3 items-center gap-4'>
                    <Label htmlFor='address' className='text-right'>
                      Address
                    </Label>
                    <Input id='address' className='col-span-3 focus-visible:ring-0' />
                  </div>
                  <div className='grid grid-cols-3 items-center gap-4'>
                    <Label htmlFor='email' className='text-right'>
                      Email
                    </Label>
                    <Input id='email' className='col-span-3 focus-visible:ring-0' />
                  </div>
                  <div className='grid grid-cols-3 items-center gap-4'>
                    <Label htmlFor='phone' className='text-right'>
                      Phone
                    </Label>
                    <Input id='phone' className='col-span-3 focus-visible:ring-0' />
                  </div>
                </div>
                <DialogFooter>
                  <Button type='submit' className='bg-indigo-500 hover:bg-indigo-600'>
                    Save changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      <div className='mt-4 gap-4 xl:flex'>
        <div className='mb-4 flex-1 rounded-2xl border border-gray-200 p-5 lg:p-6 xl:mb-0 dark:border-gray-800'>
          <div className='mb-4 flex items-center justify-between'>
            <h4 className='text-lg font-semibold text-gray-800 dark:text-white/90'>
              Bussiness Hours
            </h4>
            <Dialog>
              <DialogTrigger asChild>
                <button className='shadow-theme-xs flex h-10 items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-800 lg:inline-flex lg:w-auto dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200'>
                  <svg
                    className='fill-current'
                    width='18'
                    height='18'
                    viewBox='0 0 18 18'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      fillRule='evenodd'
                      clipRule='evenodd'
                      d='M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z'
                      fill=''
                    />
                  </svg>
                  Edit
                </button>
              </DialogTrigger>
              <DialogContent className='sm:max-w-[600px]'>
                <DialogHeader>
                  <DialogTitle>Edit Bussiness Hours</DialogTitle>
                  <DialogDescription>
                    Update the days and times your business is open. These hours will be visible to
                    customers.
                  </DialogDescription>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                  <div className='grid grid-cols-12 items-center gap-2'>
                    <Label htmlFor='monday' className='col-span-2 text-right'>
                      Monday
                    </Label>
                    <div className='col-span-3 mx-2'>
                      <Select>
                        <SelectTrigger className='mx-2 w-full focus-visible:ring-0'>
                          <SelectValue className='font-semibold' placeholder='Select an item' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem className='font-semibold' value='open'>
                            Open
                          </SelectItem>
                          <SelectItem className='font-semibold' value='close'>
                            Close
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Input id='monday' className='col-span-3 focus-visible:ring-0' />
                    <span className='col-span-1 text-center font-semibold'>-</span>
                    <Input id='monday' className='col-span-3 focus-visible:ring-0' />
                  </div>
                </div>
                <DialogFooter>
                  <Button type='submit' className='bg-indigo-500 hover:bg-indigo-600'>
                    Save changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className='text-gray-500'>
            <div className='mb-2 flex justify-between border-b py-2 font-semibold'>
              <p>Monday</p>
              <p>10:00 AM - 07:00 PM</p>
            </div>
            <div className='mb-2 flex justify-between border-b py-2 font-semibold'>
              <p>Tuesday</p>
              <p>10:00 AM - 07:00 PM</p>
            </div>
            <div className='mb-2 flex justify-between border-b py-2 font-semibold'>
              <p>Wednesday</p>
              <p>10:00 AM - 07:00 PM</p>
            </div>
            <div className='mb-2 flex justify-between border-b py-2 font-semibold'>
              <p>Thursday</p>
              <p>10:00 AM - 07:00 PM</p>
            </div>
            <div className='mb-2 flex justify-between border-b py-2 font-semibold'>
              <p>Friday</p>
              <p>10:00 AM - 07:00 PM</p>
            </div>
            <div className='mb-2 flex justify-between border-b py-2 font-semibold'>
              <p>Saturday</p>
              <p>10:00 AM - 07:00 PM</p>
            </div>
            <div className='mb-2 flex justify-between py-2 font-semibold'>
              <p>Sunday</p>
              <p>10:00 AM - 07:00 PM</p>
            </div>
          </div>
        </div>
        <div className='mb-4 flex-1 rounded-2xl border border-gray-200 p-5 lg:p-6 xl:mb-0 dark:border-gray-800'>
          <div>
            <h4 className='mb-4 text-lg font-semibold text-gray-800 dark:text-white/90'>
              Special Closures
            </h4>
            <div>
              <p className='mb-2 text-sm font-semibold text-gray-700'>Add a new closure</p>
              <div className='mb-4'>
                <Popover>
                  <Label className='mb-1'>Date</Label>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !date && 'text-muted-foreground',
                      )}
                    >
                      <CalendarIcon />
                      {date ? format(date, 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar mode='single' selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label className='mb-1'>Reason</Label>
                <Input placeholder='e.g. Holiday, Maintenance' className='focus-visible:ring-0' />
              </div>

              <Button className='mt-4 w-full bg-indigo-500 hover:bg-indigo-700'>Add Closure</Button>
            </div>
            <div>
              <p className='mt-2 mb-2 text-sm font-semibold text-gray-700'>Upcoming closures</p>
              <div className='max-h-[130px] overflow-x-hidden rounded-md bg-gray-50'>
                <ul className='divide-y divide-gray-200'>
                  <li className='flex items-center justify-between px-4 py-3 hover:bg-gray-100'>
                    <div>
                      <p className='text-sm font-medium text-gray-900'>May 6, 2025</p>
                      <p className='text-sm text-gray-500'>Staff Training</p>
                    </div>
                    <button className='text-error-600 hover:text-error-900 text-sm font-medium'>
                      Remove
                    </button>
                  </li>
                  <li className='flex items-center justify-between px-4 py-3 hover:bg-gray-100'>
                    <div>
                      <p className='text-sm font-medium text-gray-900'>May 6, 2025</p>
                      <p className='text-sm text-gray-500'>Staff Training</p>
                    </div>
                    <button className='text-error-600 hover:text-error-900 text-sm font-medium'>
                      Remove
                    </button>
                  </li>
                  <li className='flex items-center justify-between px-4 py-3 hover:bg-gray-100'>
                    <div>
                      <p className='text-sm font-medium text-gray-900'>May 6, 2025</p>
                      <p className='text-sm text-gray-500'>Staff Training</p>
                    </div>
                    <button className='text-error-600 hover:text-error-900 text-sm font-medium'>
                      Remove
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
