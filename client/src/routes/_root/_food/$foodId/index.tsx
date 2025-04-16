import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_root/_food/$foodId/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello /_foods/$foodId/!</div>;
}
