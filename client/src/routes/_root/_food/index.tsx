import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_root/_food/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello /_root/_food/!</div>;
}
