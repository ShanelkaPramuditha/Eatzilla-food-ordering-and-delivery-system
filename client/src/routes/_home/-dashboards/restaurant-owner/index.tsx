import { Clock, DollarSign, ShoppingBag, Users } from 'lucide-react';
import { ReactNode } from 'react';

export function RestaurantOwnerHome() {
  return (
    <div className='flex grow justify-between'>
      <StatCard
        title='Total Orders'
        value={12}
        icon={<ShoppingBag className='h-5 w-5 text-indigo-600' />}
        change='12.5%'
        isPositive={true}
      />

      <StatCard
        title='Pending Orders'
        value={12}
        icon={<Clock className='h-5 w-5 text-indigo-600' />}
      />

      <StatCard
        title='Total Revenue'
        value={12}
        icon={<DollarSign className='h-5 w-5 text-indigo-600' />}
        change='8.2%'
        isPositive={true}
      />

      <StatCard
        title='Order Completion Rate'
        value={`${Math.round((16 / 24) * 100)}%`}
        icon={<Users className='text-primary-600 h-5 w-5' />}
        change='3.1%'
        isPositive={true}
      />
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: string;
  isPositive?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change, isPositive = true }) => {
  return (
    <div className='m-5 h-[132px] grow overflow-hidden rounded-lg bg-white shadow transition-all duration-200 hover:shadow-lg'>
      <div className='p-5'>
        <div className='flex items-center'>
          <div className='flex-shrink-0 rounded-md bg-indigo-100 p-3'>{icon}</div>
          <div className='ml-5 w-0 flex-1'>
            <dl>
              <dt className='truncate text-sm font-medium text-gray-500'>{title}</dt>
              <dd>
                <div className='text-lg font-semibold text-gray-900'>{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      {change && (
        <div className='bg-indigo-50 px-5 py-3'>
          <div className='text-sm'>
            <div className='flex items-center'>
              <span className={`mr-1 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {isPositive ? '↑' : '↓'}
              </span>
              <span className={isPositive ? 'text-success-600' : 'text-error-600'}>{change}</span>
              <span className='ml-1 text-gray-500'>from last period</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
