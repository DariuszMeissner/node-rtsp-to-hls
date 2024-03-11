import React, { useEffect } from 'react'
import Button from 'react-bootstrap/esm/Button'
import useStore from '../../api/useStore'
import useLoginData from '../../hooks/useLoginData'
import { useNavigate } from 'react-router-dom'
import useStreamData from '../../hooks/useStreamData'
import VideoPlayer from '../video-player/VideoPlayer'
import './AdminPanelView.css'

const AdminPanelView = () => {
  const dataLogin = useLoginData()
  const dataStream = useStreamData()
  const logoutUser = useStore(store => store.logoutUser)
  const startStream = useStore(store => store.startStream)
  const navigate = useNavigate();

  async function handleLogoutUser(e) {
    e.preventDefault()
    await logoutUser()
    if (!dataLogin.status) navigate('/login')
  }

  function handleStartStream(e) {
    e.preventDefault()
    startStream()
  }

  function handleEndStream(e) {
    e.preventDefault()
  }

  useEffect(() => {
    if (!dataLogin.status) navigate('/login')

  }, [dataLogin.status, navigate, dataLogin.isStreamLoading])

  if (dataLogin.isLoginOut) return <div>logout...</div>

  if (dataStream.isStreamLoading) return <div>loading stream...</div>

  return (
    <section>
      <Button
        variant='light'
        onClick={handleLogoutUser}>Wyloguj</Button>

      <section className="mb-4">
        <h2 id="stream-status" className="mt-3">
          <div>{dataStream.streaming ? 'Stream Online' : 'Stream Offline'}</div>
          <span>{dataStream.recording ? 'Recording ON' : 'Recording OFF'}</span>
          <span className={`${dataStream.recording ? 'recording-light-on' : 'recording-light-off'}`}></span>
        </h2>

        <div className="d-flex">
          {dataStream.streaming
            ?
            <Button
              variant='danger'
              onClick={handleEndStream}>
              Zakończ transmisje</Button>
            :
            <Button
              variant='dark'
              onClick={handleStartStream}>
              Rozpocznij transmisje</Button>
          }
        </div>
      </section>

      <VideoPlayer streamStarted={dataStream.streaming} />
    </section>
  )
}

export default AdminPanelView