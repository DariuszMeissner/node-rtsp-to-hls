import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './pages/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import NoPage from './pages/NoPage';
import { PAGES } from './config/pages.config';

function App() {
  const [currentPath, setCurrentPath] = useState(document.location.pathname)

  function setDocumentTitle(path) {
    switch (path) {
      case '/login':
        document.title = PAGES.title.login;
        break;
      case '/panel':
        document.title = PAGES.title.adminPanel;
        break;
      case '/':
        document.title = PAGES.title.home;
        break;
      default:
        document.title = PAGES.title.noPage;
        break;
    }

  }

  useEffect(() => {
    setCurrentPath(document.location.pathname);
    setDocumentTitle(currentPath);
  }, [currentPath]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='login' element={<Login />} />
          <Route path='panel' element={<AdminPanel />} />
          <Route path='*' element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
