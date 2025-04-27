import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { DeliveryMetrics } from '@/types/delivery';
import { CalendarCheck, Clock, DollarSign, Star, Truck } from 'lucide-react';

interface DeliveryStatsProps {
  metrics: DeliveryMetrics | null;
}

export default function DeliveryStats({ metrics }: DeliveryStatsProps) {
  if (!metrics) {
    return (
      <div className='flex h-64 items-center justify-center'>
        <p className='text-muted-foreground'>Loading statistics...</p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const statCards = [
    {
      title: 'Total Deliveries',
      value: metrics.totalDeliveries.toString(),
      description: 'All time',
      icon: <Truck className='h-5 w-5 text-blue-500' />,
      trend:
        metrics.completedDeliveries > 0
          ? `${Math.round((metrics.completedDeliveries / metrics.totalDeliveries) * 100)}% completion rate`
          : 'No completed deliveries',
    },
    {
      title: 'Average Delivery Time',
      value: `${metrics.averageDeliveryTime} mins`,
      description: 'Per delivery',
      icon: <Clock className='h-5 w-5 text-purple-500' />,
      trend: metrics.averageDeliveryTime < 30 ? 'On target time' : 'Above target time',
    },
    {
      title: 'On-Time Rate',
      value: `${metrics.onTimeRate}%`,
      description: 'All deliveries',
      icon: <CalendarCheck className='h-5 w-5 text-green-500' />,
      trend: metrics.onTimeRate > 90 ? '+2% from last month' : '-3% from last month',
    },
    {
      title: 'Total Earnings',
      value: formatCurrency(metrics.totalEarnings),
      description: 'From delivery fees',
      icon: <DollarSign className='h-5 w-5 text-amber-500' />,
      trend: metrics.totalEarnings > 50 ? '+15% from last month' : '-5% from last month',
    },
  ];

  return (
    <div className='space-y-6'>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{stat.value}</div>
              <p className='text-muted-foreground text-xs'>{stat.description}</p>
              {stat.trend && <p className='mt-1 text-xs text-green-500'>{stat.trend}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div>
              <div className='mb-2 flex justify-between'>
                <span className='text-sm'>Delivery Completion Rate</span>
                <span className='text-sm font-medium'>
                  {metrics.completedDeliveries > 0
                    ? `${Math.round((metrics.completedDeliveries / metrics.totalDeliveries) * 100)}%`
                    : '0%'}
                </span>
              </div>
              <Progress
                value={
                  metrics.completedDeliveries > 0
                    ? Math.round((metrics.completedDeliveries / metrics.totalDeliveries) * 100)
                    : 0
                }
                className='h-2'
              />
            </div>
            <div>
              <div className='mb-2 flex justify-between'>
                <span className='text-sm'>Customer Satisfaction</span>
                <span className='text-sm font-medium'>
                  {Math.round(metrics.averageRating * 20)}%
                </span>
              </div>
              <Progress value={Math.round(metrics.averageRating * 20)} className='h-2' />
            </div>
            <div>
              <div className='mb-2 flex justify-between'>
                <span className='text-sm'>On-Time Delivery Rate</span>
                <span className='text-sm font-medium'>{metrics.onTimeRate}%</span>
              </div>
              <Progress value={metrics.onTimeRate} className='h-2' />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ratings Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center space-x-4'>
            <div className='flex h-16 w-16 items-center justify-center rounded-full bg-yellow-50'>
              <Star className='h-8 w-8 fill-yellow-500 text-yellow-500' />
            </div>
            <div className='space-y-0.5'>
              <div className='text-3xl font-bold'>{metrics.averageRating.toFixed(1)}</div>
              <div className='flex'>
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(metrics.averageRating)
                          ? 'fill-yellow-500 text-yellow-500'
                          : i < metrics.averageRating
                            ? 'fill-yellow-500 text-yellow-500 opacity-50'
                            : 'text-gray-300'
                      }`}
                    />
                  ))}
              </div>
              <div className='text-muted-foreground text-sm'>Based on customer reviews</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
