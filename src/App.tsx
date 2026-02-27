import { Routes, Route, Navigate } from 'react-router-dom'
import { AppLayout } from '@/layouts/AppLayout'
import { CreatePage } from '@/pages/CreatePage'
import { AdminPage } from '@/pages/AdminPage'
import { SuccessPage } from '@/pages/SuccessPage'
import { NotFoundPage } from '@/pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/create" replace />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
