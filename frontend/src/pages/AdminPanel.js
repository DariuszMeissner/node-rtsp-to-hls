import React, { Suspense } from 'react'
import AdminPanelView from '../components/admin-panel/AdminPanelView'
import ErrorBoundary from '../components/error-boundaries/ErrorBoundary'
import Loading from '../components/loading/Loading';

const AdminPanel = () => {
  return (
    <ErrorBoundary fallback={<div>Something went wrong..., plese try again</div>}>
      <Suspense fallback={<Loading />}>
        <AdminPanelView />
      </Suspense>
    </ErrorBoundary>
  )
}

export default AdminPanel