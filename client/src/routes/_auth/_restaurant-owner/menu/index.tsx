import { createFileRoute } from '@tanstack/react-router';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { IoMdAdd } from 'react-icons/io';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import RestaurantService from '@/services/restaurnat.service';
import { useAuth } from '@/contexts/auth-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

export const Route = createFileRoute('/_auth/_restaurant-owner/menu/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const menu = await RestaurantService.getMenuItems(user?.id);
      setMenuItems(menu);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='grow rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]'>
      <div className='flex flex-col items-start justify-between sm:flex-row'>
        <h3 className='mb-4 text-lg font-semibold text-gray-800 dark:text-white/90'>
          Menu Management
        </h3>
        <MenuItemForm
          trigger={
            <button className='mb-4 flex w-full items-center justify-center gap-1 rounded-sm bg-indigo-500 px-3 py-2 text-sm font-semibold text-white transition-all hover:bg-indigo-700 sm:w-auto'>
              <span>
                <IoMdAdd color='white' />
              </span>
              <span>Add Item</span>
            </button>
          }
          refetch={fetchMenuItems}
        />
      </div>
      <div className='mb-4 flex items-center justify-between gap-2'>
        <div className='gap-2'>
          <button className='mx-1 mb-2 rounded-full bg-indigo-200 px-3 py-1 text-sm font-medium text-indigo-500 sm:mb-0'>
            All Items
          </button>
          <button className='mx-1 mb-2 rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-500 sm:mb-0'>
            Main Course
          </button>
          <button className='mx-1 mb-2 rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-500 sm:mb-0'>
            Appetizers
          </button>
          <button className='mx-1 mb-2 rounded-full bg-gray-200 px-3 py-1 text-sm font-medium text-gray-500 sm:mb-0'>
            Desserts
          </button>
        </div>

        <div className='flex'>
          <div>
            <Select>
              <SelectTrigger className='mx-2 w-[180px] focus-visible:ring-0'>
                <SelectValue className='font-semibold' placeholder='All Items' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem className='font-semibold' value='all'>
                  All Items
                </SelectItem>
                <SelectItem className='font-semibold' value='available'>
                  Available Items
                </SelectItem>
                <SelectItem className='font-semibold' value='unavailable'>
                  Unavailable Items
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <form>
            <div className='relative'>
              <span className='pointer-events-none absolute top-1/2 left-4 -translate-y-1/2'>
                <svg
                  className='fill-gray-500 dark:fill-gray-400'
                  width='20'
                  height='20'
                  viewBox='0 0 20 20'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    fillRule='evenodd'
                    clipRule='evenodd'
                    d='M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z'
                    fill=''
                  />
                </svg>
              </span>
              <input
                type='text'
                placeholder='Search'
                className='dark:bg-dark-900 shadow-theme-xs h-9 max-w-[300px] rounded-lg border border-gray-200 bg-transparent py-2.5 pr-14 pl-12 text-sm text-gray-800 placeholder:text-gray-400 focus:border-indigo-300 focus:ring-indigo-500/10 focus:outline-hidden xl:w-[430px] dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-indigo-800'
              />
            </div>
          </form>
        </div>
      </div>

      {menuItems?.length > 0 ? (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
          {menuItems.map((item) => (
            <MenuItemCard key={item._id} item={item} refetch={fetchMenuItems} />
          ))}
        </div>
      ) : (
        <div className='py-10 text-center text-gray-500'>No menu items found.</div>
      )}
    </div>
  );
}

type MenuItem = {
  _id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
};

interface MenuItemCardProps {
  item: MenuItem;
  refetch: () => void;
}

const MenuItemCard = ({ item, refetch }: MenuItemCardProps) => {
  const { user } = useAuth();
  const [availablity, setAvailability] = useState(item.available);

  const handleUpdate = async () => {
    try {
      await RestaurantService.putMenuItem(
        { ...item, restaurantName: 'Pizza Palace', available: !availablity },
        user?.id,
        item._id,
      );
      setAvailability(!availablity);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      await RestaurantService.deleteMenuItem(item._id);
      refetch();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className='rounded-2xl border border-gray-200 dark:border-gray-800'>
      <div>
        <img src={item.image} alt={item.name} className='h-48 w-full rounded-t-lg object-cover' />
      </div>
      <div className='flex flex-1 flex-col p-4'>
        <div className='mb-2 flex items-center justify-between'>
          <h3 className='text-lg font-semibold'>{item.name}</h3>
          <div className='flex gap-2 text-xs font-semibold'>
            {availablity ? 'Available' : 'Unavailable'}
            <Switch
              className='data-[state=checked]:bg-indigo-500'
              checked={availablity}
              onCheckedChange={handleUpdate}
            />
          </div>
        </div>
        <p className='text-sm font-medium text-gray-500'>{item.description}</p>
        <div className='mb-2 flex items-center justify-between'>
          <p className='text-lg font-semibold'>Rs {item.price.toFixed(2)}</p>
          <div className='text-xs font-semibold'>{item.category}</div>
        </div>
        <div className='flex justify-between border-t border-gray-100 pt-4 text-xs font-medium'>
          <MenuItemForm
            trigger={
              <button className='flex px-3 py-2'>
                <span className='mr-2'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='lucide lucide-square-pen'
                  >
                    <path d='M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7'></path>
                    <path d='M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z'></path>
                  </svg>
                </span>
                <span>Edit</span>
              </button>
            }
            item={item}
            isEdit={true}
            refetch={refetch}
          />
          <Dialog>
            <DialogTrigger asChild>
              <button className='flex px-3 py-2'>
                <span className='mr-2'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='lucide lucide-eye'
                  >
                    <path d='M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z'></path>
                    <circle cx='12' cy='12' r='3'></circle>
                  </svg>
                </span>
                <span>View</span>
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{item.name}</DialogTitle>
              </DialogHeader>
              <div>
                <div>
                  <img
                    src={item.image}
                    alt={item.name}
                    className='h-60 w-full rounded-t-lg object-cover'
                  />
                </div>
                <div>
                  <div className='mt-2 flex justify-between text-sm font-semibold'>
                    <p>{item.category}</p>
                    <p>{item.available ? 'Available' : 'Unavailable'}</p>
                  </div>
                  <div className='mt-2'>
                    <h4 className='font-semibold'>Description</h4>
                    <p className='text-sm text-gray-500'>{item.description}</p>
                  </div>
                  <div className='mt-2'>
                    <h4 className='font-semibold'>Price</h4>
                    <p className='text-lg font-semibold text-indigo-500'>
                      Rs {item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className='flex px-3 py-2'>
                <span className='mr-2'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='16'
                    height='16'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke='red'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    className='lucide lucide-trash2 text-error-500'
                  >
                    <path d='M3 6h18'></path>
                    <path d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6'></path>
                    <path d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2'></path>
                    <line x1='10' x2='10' y1='11' y2='17'></line>
                    <line x1='14' x2='14' y1='11' y2='17'></line>
                  </svg>
                </span>
                <span>Delete</span>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the menu item and
                  remove the data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className='bg-indigo-500 hover:bg-indigo-700'
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  category: z.string().min(2, {
    message: 'Category must be at least 2 characters.',
  }),
  price: z.coerce.number().positive({
    message: 'Price must be a positive number.',
  }),
  description: z.string().min(5, {
    message: 'Description must be at least 5 characters.',
  }),
  image: z.any(),
});

interface MenuItemFormProps {
  trigger: React.ReactNode;
  item?: MenuItem;
  isEdit?: boolean;
  refetch: () => void;
}

const MenuItemForm = ({ trigger, item, isEdit = false, refetch }: MenuItemFormProps) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: item?.name || '',
      category: item?.category || '',
      price: item?.price || 0,
      description: item?.description || '',
      image: item?.image || '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (isEdit) {
        await RestaurantService.putMenuItem(
          { ...values, restaurantName: user?.id },
          user?.id,
          item?._id,
        );
      } else {
        await RestaurantService.postMenuItem({ ...values, restaurantName: user?.id }, user?.id);
      }
      console.log({ ...values, restaurantName: user?.id });
      setIsOpen(false);
      form.reset();
      refetch();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle> {isEdit ? 'Edit Menu Item' : 'Add Menu Item'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Edit the details below to update item on your menu.'
              : 'Fill in the details below to add a new item to your menu.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input className='focus-visible:ring-0' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input className='focus-visible:ring-0' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input className='focus-visible:ring-0' type='number' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea className='focus-visible:ring-0' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='image'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input className='focus-visible:ring-0' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex'>
              <Button className='ml-auto bg-indigo-500 hover:bg-indigo-700' type='submit'>
                {isEdit ? 'Save' : 'Add Menu Item'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
