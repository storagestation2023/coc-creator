import { useAdminStore } from '@/stores/adminStore'
import { AdminLogin } from '@/components/admin/AdminLogin'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

export function AdminPage() {
  const { isAuthenticated } = useAdminStore()

  return isAuthenticated ? <AdminDashboard /> : <AdminLogin />
}
