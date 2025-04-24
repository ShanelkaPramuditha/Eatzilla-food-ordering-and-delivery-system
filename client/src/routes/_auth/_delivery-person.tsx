import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/_delivery-person')({
  beforeLoad: async () => {},
  component: () => <Outlet />,
})

