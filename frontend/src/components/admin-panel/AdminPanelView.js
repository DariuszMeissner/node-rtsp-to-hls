import React, { useEffect } from 'react'
import Button from 'react-bootstrap/esm/Button'
import useStore from '../../api/useStore'
import useLoginData from '../../hooks/useLoginData'
import { useNavigate } from 'react-router-dom'

const AdminPanelView = () => {
  const data = useLoginData()
  const logoutUser = useStore(store => store.logoutUser)
  const navigate = useNavigate();

  async function handleLogoutUser(e) {
    e.preventDefault()
    await logoutUser()
    if (!data.status) navigate('/login')
  }

  useEffect(() => {
    if (!data.status) navigate('/login')
  }, [data.status, navigate])

  return (
    <section>
      <Button
        variant='dark'
        onClick={handleLogoutUser}>Wyloguj</Button>

      {data.isLoading && <div>logout...</div>}
    </section>
  )
}

export default AdminPanelView