import React, { Suspense } from 'react'
import LoginForm from '../components/login/LoginForm'
import ErrorBoundary from '../components/error-boundaries/ErrorBoundary'
import Loading from '../components/loading/Loading'


const Login = () => {

  return (
    <ErrorBoundary fallback={<div>Something went wrong..., plese try again</div>}>
      <Suspense fallback={<Loading />}>
        <LoginForm />
      </Suspense>
    </ErrorBoundary>
  )
}

export default Login