import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Star, MoreVertical, MessageSquare, Flag, TrendingUp, CalendarClock } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const Route = createFileRoute('/_auth/_restaurant-owner/reviews/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className='grow rounded-2xl border border-gray-200 bg-white p-5 lg:p-6 dark:border-gray-800 dark:bg-white/[0.03]'>
      <div className='flex flex-col items-start justify-between sm:flex-row'>
        <h3 className='mb-4 text-lg font-semibold text-gray-800 dark:text-white/90'>Reviews</h3>
      </div>
      <div>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          {/* Average Rating */}
          <div className='rounded-lg border border-neutral-200 bg-white p-4 shadow-sm'>
            <div className='flex items-start justify-between'>
              <div>
                <h3 className='text-sm font-medium text-neutral-500'>Average Rating</h3>
                <div className='mt-1 flex items-center gap-2'>
                  <span className='text-3xl font-bold text-neutral-900'>4.5</span>
                  <Star size={20} className='fill-amber-500 text-amber-500' />
                </div>
                <p className='mt-2 text-sm text-neutral-500'>All Reviews</p>
              </div>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-500'>
                <Star size={20} />
              </div>
            </div>
          </div>
          {/* Total Reviews */}
          <div className='rounded-lg border border-neutral-200 bg-white p-4 shadow-sm'>
            <div className='flex items-start justify-between'>
              <div>
                <h3 className='text-sm font-medium text-neutral-500'>Total Reviews</h3>
                <p className='mt-1 text-3xl font-bold text-neutral-900'>2</p>
                <p className='mt-2 text-sm text-neutral-500'>From all time</p>
              </div>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 text-purple-500'>
                <MessageSquare size={20} />
              </div>
            </div>
          </div>

          {/* Recent Reviews */}
          <div className='rounded-lg border border-neutral-200 bg-white p-4 shadow-sm'>
            <div className='flex items-start justify-between'>
              <div>
                <h3 className='text-sm font-medium text-neutral-500'>Recent Reviews</h3>
                <p className='mt-1 text-3xl font-bold text-neutral-900'>2</p>
                <p className='mt-2 text-sm text-neutral-500'>Last 30 days</p>
              </div>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-500'>
                <CalendarClock size={20} />
              </div>
            </div>
          </div>

          {/* Trending Dishes */}
          <div className='rounded-lg border border-neutral-200 bg-white p-4 shadow-sm'>
            <div className='flex items-start justify-between'>
              <div>
                <h3 className='text-sm font-medium text-neutral-500'>Trending Dishes</h3>
                <p className='mt-1 text-3xl font-bold text-neutral-900'>1</p>
                <p className='mt-2 text-sm text-neutral-500'>With 5-star ratings</p>
              </div>
              <div className='flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-500'>
                <TrendingUp size={20} />
              </div>
            </div>
          </div>
        </div>

        <div className='mt-4 mb-6 flex justify-between'>
          <div>
            <div className='flex items-center'>
              <label className='mr-2 font-semibold' htmlFor='sort'>
                Sort by:
              </label>
              <Select>
                <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Most Recent' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='recent'>Most Recent</SelectItem>
                  <SelectItem value='highest-rated'>Highest Rated</SelectItem>
                  <SelectItem value='lowest-rated'>Lowest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <p className='text-sm font-semibold'>
              Showing <span>2</span> of <span>2</span> reviews
            </p>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className='grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface ReviewType {
  id: string;
  dishName: string;
  dishImage: string;
  rating: number;
  comment: string;
  userName: string;
  userAvatar: string;
  date: string;
  tags: string[];
}

interface ReviewCardProps {
  review: ReviewType;
}

const ReviewCard = ({ review }: ReviewCardProps) => {
  const [showActions, setShowActions] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < rating ? 'fill-amber-500 text-amber-500' : 'text-neutral-300'}
        />
      ));
  };

  return (
    <div className='overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:shadow-md'>
      {/* Header with dish image */}
      <div className='relative h-36 bg-neutral-100'>
        <img src={review.dishImage} alt={review.dishName} className='h-full w-full object-cover' />
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent'></div>
        <div className='absolute bottom-0 left-0 p-4 text-white'>
          <h3 className='text-lg font-bold'>{review.dishName}</h3>
          <div className='mt-1 flex items-center gap-1'>{renderStars(review.rating)}</div>
        </div>
      </div>

      {/* Review content */}
      <div className='p-4'>
        <div className='mb-3 flex items-start justify-between'>
          <div className='flex items-center gap-2'>
            <div className='h-8 w-8 overflow-hidden rounded-full bg-neutral-200'>
              <img
                src={review.userAvatar}
                alt={review.userName}
                className='h-full w-full object-cover'
              />
            </div>
            <div>
              <div className='font-medium text-neutral-900'>{review.userName}</div>
              <div className='text-xs text-neutral-500'>{formatDate(review.date)}</div>
            </div>
          </div>
          <div className='relative'>
            <button
              onClick={() => setShowActions(!showActions)}
              className='p-1 text-neutral-500 hover:text-neutral-900'
            >
              <MoreVertical size={18} />
            </button>
            {showActions && (
              <div className='absolute right-0 z-10 w-48 rounded-md border border-neutral-200 bg-white shadow-lg'>
                <ul className='py-1'>
                  <li>
                    <button className='flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50'>
                      <MessageSquare size={16} />
                      <span>Reply to review</span>
                    </button>
                  </li>
                  <li>
                    <button className='flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50'>
                      <Flag size={16} />
                      <span>Flag as inappropriate</span>
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <p className='text-neutral-700'>{review.comment}</p>

        {/* Tags */}
        <div className='mt-4 flex flex-wrap gap-2'>
          {review.tags.map((tag, index) => (
            <span
              key={index}
              className='rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700'
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const reviews: ReviewType[] = [
  {
    id: '1',
    dishName: 'Grilled Chicken Alfredo',
    dishImage:
      'https://i0.wp.com/spoonfulofsi.com/wp-content/uploads/2022/09/grilled-chicken-alfredo-pasta-p4.png?w=1200&ssl=1',
    rating: 5,
    comment:
      'The truffle risotto was absolutely divine! The rice was perfectly cooked, creamy and luxurious. The truffle flavor was prominent without being overwhelming.',
    userName: 'Isabella Martinez',
    userAvatar:
      'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
    date: '2025-04-28T14:30:00Z',
    tags: ['Signature Dish', 'Vegetarian'],
  },
  {
    id: '2',
    dishName: 'Chicken Kottu Roti',
    dishImage: 'https://upload.wikimedia.org/wikipedia/commons/a/a3/Chicken_Kottu.jpg',
    rating: 4,
    comment:
      'The scallops were cooked to perfection with a beautiful golden crust. The citrus sauce complemented them wonderfully, though I found the portion a bit small for the price.',
    userName: 'Michael Chen',
    userAvatar:
      'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
    date: '2025-04-29T19:45:00Z',
    tags: ['Seafood', 'Appetizer'],
  },
];
