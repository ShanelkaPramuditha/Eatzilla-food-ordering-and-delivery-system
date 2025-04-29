import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth/_restaurant-owner/transactions/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_auth/_restaurant-owner/transactions/"!</div>;
}
