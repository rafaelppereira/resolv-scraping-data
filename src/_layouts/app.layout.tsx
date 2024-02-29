import { Outlet } from 'react-router-dom'

import { Header } from '@/components/default/header'

export function AppLayout() {
  return (
    <div>
      <Header />

      <div className="mx-auto mt-16 max-w-6xl px-6 py-10">
        <Outlet />
      </div>
    </div>
  )
}
