import React from 'react'
import { Outlet } from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import Header from '../Layouts/Header'
import Main from '../Layouts/Main'

const Layout = () => {
  return (
    <>
      <Container className='vh-100'>
        <Header />

        <Main>
          <Outlet />
        </Main>
      </Container>
    </>
  )
}

export default Layout