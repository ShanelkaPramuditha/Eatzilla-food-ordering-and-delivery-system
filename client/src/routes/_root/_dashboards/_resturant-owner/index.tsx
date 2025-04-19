import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_root/_dashboards/_resturant-owner/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello /_root/_dashboards/_resturant-owner/!</div>;
}
