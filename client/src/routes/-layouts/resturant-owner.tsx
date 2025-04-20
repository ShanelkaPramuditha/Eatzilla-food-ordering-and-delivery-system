import { Link, Outlet, useLocation } from '@tanstack/react-router';
import { useState } from 'react';

// Icons
import { RxDashboard } from 'react-icons/rx';
import { BiFoodMenu } from 'react-icons/bi';
import { IoSettingsOutline } from 'react-icons/io5';
import { MdOutlineReviews, MdDeliveryDining } from 'react-icons/md';

export function ResturantOwnerLayout() {
  const [isExpanded] = useState(true);
  return (
    <>
      <div className='min-h-screen xl:flex'>
        <Sidebar isExpanded={isExpanded} />
        <div
          className={`flex-1 transition-all duration-300 ease-in-out ${
            isExpanded ? 'lg:ml-[290px]' : 'lg:ml-[90px]'
          } `}
        >
          <header className='sticky top-0 z-99999 flex w-full border-gray-200 bg-white lg:border-b dark:border-gray-800 dark:bg-gray-900'></header>
          <main className='p-4'>
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path: string;
};

const navItems: NavItem[] = [
  {
    icon: <RxDashboard size={24} />,
    name: 'Dashboard',
    path: '/',
  },
  {
    icon: <BiFoodMenu size={24} />,
    name: 'Menu',
    path: '/menu',
  },
  {
    icon: <MdDeliveryDining size={24} />,
    name: 'Orders',
    path: '/orders',
  },
  {
    icon: <MdOutlineReviews size={24} />,
    name: 'Reviews',
    path: '/reviews',
  },
  {
    icon: <IoSettingsOutline size={24} />,
    name: 'Settings',
    path: '/settings',
  },
];

interface SidebarProps {
  isExpanded: boolean;
}

const Sidebar = ({ isExpanded }: SidebarProps) => {
  const { pathname } = useLocation();

  return (
    <aside
      className={`fixed top-0 left-0 z-50 mt-16 flex h-screen flex-col border-r border-gray-200 bg-white px-5 text-gray-900 transition-all duration-300 ease-in-out lg:mt-0 dark:border-gray-800 dark:bg-gray-900 ${isExpanded ? 'w-[290px]' : 'w-[90px]'} lg:translate-x-0`}
    >
      <div className={`flex py-8 ${!isExpanded ? 'lg:justify-center' : 'justify-start'}`}>
        <Link to='/'>{isExpanded ? <>{/* LOGO */}</> : <>{/* LOGO MOBILE */}</>}</Link>
      </div>
      <div className='flex flex-col overflow-hidden overflow-y-auto duration-300 ease-linear'>
        <nav className='mb-6'>
          <div className='flex flex-col gap-4'>
            <div>
              <h2
                className={`mb-4 flex text-xs leading-[20px] text-gray-400 uppercase ${
                  !isExpanded ? 'lg:justify-center' : 'justify-start'
                }`}
              ></h2>

              <div>
                <ul className='flex flex-col gap-4'>
                  {navItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.path}
                        className={`group flex items-center gap-3 rounded-md px-3 py-2 ${
                          pathname === item.path || pathname.startsWith(item.path + '/')
                            ? 'bg-indigo-50'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <span
                          className={`text-gray-500 ${
                            pathname === item.path || pathname.startsWith(item.path + '/')
                              ? 'text-indigo-500'
                              : 'group-hover:text-gray-700'
                          }`}
                        >
                          {item.icon}
                        </span>
                        <span
                          className={`text-sm font-medium text-gray-700 ${
                            pathname === item.path || pathname.startsWith(item.path + '/')
                              ? 'text-indigo-500'
                              : ''
                          }`}
                        >
                          {item.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className=''>
              <h2
                className={`mb-4 flex text-xs leading-[20px] text-gray-400 uppercase ${
                  !isExpanded ? 'lg:justify-center' : 'justify-start'
                }`}
              ></h2>
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};
