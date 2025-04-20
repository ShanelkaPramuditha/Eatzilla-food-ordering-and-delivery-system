import { createFileRoute } from '@tanstack/react-router';
import { Switch } from '@/components/ui/switch';

export const Route = createFileRoute('/_root/_dashboards/_resturant-owner/menu/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className='rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]'>
      <h3 className='mb-5 text-lg font-semibold text-gray-800 lg:mb-7 dark:text-white/90'>
        Menu Management
      </h3>
      {menuItems.length > 0 ? (
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
          {menuItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className='py-10 text-center text-gray-500'>No menu items found.</div>
      )}
    </div>
  );
}

const menuItems = [
  {
    id: 1,
    name: 'Crispy Calamari',
    description: 'Tender calamari rings, lightly battered and fried, served with a zesty lemon.',
    price: 12.99,
    category: 'Appetizers',
    image:
      'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=600',
    available: true,
  },
  {
    id: 2,
    name: 'Crispy Calamari',
    description: 'Tender calamari rings, lightly battered and fried, served with a zesty lemon.',
    price: 12.99,
    category: 'Appetizers',
    image:
      'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=600',
    available: true,
  },
  {
    id: 3,
    name: 'Crispy Calamari',
    description: 'Tender calamari rings, lightly battered and fried, served with a zesty lemon.',
    price: 12.99,
    category: 'Appetizers',
    image:
      'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=600',
    available: true,
  },
  {
    id: 5,
    name: 'Crispy Calamari',
    description: 'Tender calamari rings, lightly battered and fried, served with a zesty lemon.',
    price: 12.99,
    category: 'Appetizers',
    image:
      'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=600',
    available: true,
  },
  {
    id: 6,
    name: 'Crispy Calamari',
    description: 'Tender calamari rings, lightly battered and fried, served with a zesty lemon.',
    price: 12.99,
    category: 'Appetizers',
    image:
      'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=600',
    available: true,
  },
];

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
};

interface MenuItemCardProps {
  item: MenuItem;
}

const MenuItemCard = ({ item }: MenuItemCardProps) => {
  return (
    <div className='rounded-2xl border border-gray-200 dark:border-gray-800'>
      <div>
        <img src={item.image} alt={item.name} className='h-48 w-full rounded-t-lg object-cover' />
      </div>
      <div className='flex flex-1 flex-col p-4'>
        <div className='mb-2 flex items-center justify-between'>
          <h3 className='text-lg font-semibold'>{item.name}</h3>
          <div className='flex gap-2 text-xs font-semibold'>
            {item.available ? 'Available' : 'Unavailable'}
            <Switch onCheckedChange={() => {}} />
          </div>
        </div>
        <p className='text-sm font-medium text-gray-500'>{item.description}</p>
        <div className='mb-2 flex items-center justify-between'>
          <p className='text-lg font-semibold'>${item.price.toFixed(2)}</p>
          <div className='text-xs font-semibold'>{item.category}</div>
        </div>
        <div className='flex justify-between border-t border-gray-100 pt-4 text-xs font-medium'>
          <button className='flex px-3 py-2'>
            <span className='mr-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                stroke-width='2'
                stroke-linecap='round'
                stroke-linejoin='round'
                className='lucide lucide-square-pen'
              >
                <path d='M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7'></path>
                <path d='M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z'></path>
              </svg>
            </span>
            <span>Edit</span>
          </button>
          <button className='flex px-3 py-2'>
            <span className='mr-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                stroke-width='2'
                stroke-linecap='round'
                stroke-linejoin='round'
                className='lucide lucide-eye'
              >
                <path d='M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z'></path>
                <circle cx='12' cy='12' r='3'></circle>
              </svg>
            </span>
            <span>View</span>
          </button>
          <button className='flex px-3 py-2'>
            <span className='mr-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='red'
                stroke-width='2'
                stroke-linecap='round'
                stroke-linejoin='round'
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
        </div>
      </div>
    </div>
  );
};
