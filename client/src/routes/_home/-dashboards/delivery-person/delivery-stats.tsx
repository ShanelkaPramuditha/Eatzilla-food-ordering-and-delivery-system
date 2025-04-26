import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface StatCard {
  title: string;
  value: string;
  description: string;
  trend?: string;
}

const statCards: StatCard[] = [
  {
    title: 'Total Deliveries',
    value: '1,234',
    description: 'Last 30 days',
    trend: '+12% from last month',
  },
  {
    title: 'Average Delivery Time',
    value: '28 mins',
    description: 'Last 30 days',
    trend: '-5% from last month',
  },
  {
    title: 'On-Time Rate',
    value: '94%',
    description: 'Last 30 days',
    trend: '+2% from last month',
  },
  {
    title: 'Customer Rating',
    value: '4.8/5',
    description: 'Based on 1,000 reviews',
    trend: '+0.2 from last month',
  },
];

export default function DeliveryStats() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
              {stat.trend && (
                <p className="text-xs text-green-500 mt-1">{stat.trend}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Delivery Completion Rate</span>
                <span className="text-sm font-medium">98%</span>
              </div>
              <Progress value={98} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Customer Satisfaction</span>
                <span className="text-sm font-medium">96%</span>
              </div>
              <Progress value={96} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Driver Response Time</span>
                <span className="text-sm font-medium">92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 