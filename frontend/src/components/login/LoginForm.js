import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import useLoginData from '../../hooks/useLoginData';
import useStore from '../../api/useStore';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [form, setForm] = useState({ username: '', password: '' })
  const login = useLoginData()
  const loginUser = useStore(store => store.loginUser)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    await loginUser(form.username, form.password)

    if (login.status) navigate('/panel')
  }

  function handleFormChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  useEffect(() => {
    if (login.status) navigate('/panel')
  }, [login.status, navigate])


  return (
    <section>
      {(!login.status && !login.isLoading) && <div>{login.message}</div>}

      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Login</Form.Label>
          <Form.Control
            type="text"
            name="username"
            placeholder="Wpisz login"
            value={form.username}
            onChange={handleFormChange} /></Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Hasło</Form.Label>
          <Form.Control
            type="password"
            name='password'
            placeholder="Password"
            value={form.password}
            onChange={handleFormChange} /></Form.Group>

        <Button
          variant="primary"
          type="submit"
          onClick={handleSubmit}
          disabled={login.isLoading}>
          {login.isLoading ? <div>sending...</div> : 'Submit'}</Button>
      </Form>

    </section>
  )
}

export default LoginForm