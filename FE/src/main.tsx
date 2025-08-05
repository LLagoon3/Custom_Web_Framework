import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './layouts/Login';
import Register from './layouts/Register';
import './stylesheets/index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router basename="/">
      <Routes>
        <Route path="/" element={<Login />} />
        {/* 추후 메인 페이지로 대체 */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  </StrictMode>,
)
