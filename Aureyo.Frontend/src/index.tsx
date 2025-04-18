import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import MainLayout from 'layouts/MainLayout';
import Home from 'pages/Home';
import HowItWorks from 'pages/HowItWorks';
import { HashRouter, Routes, Route } from 'react-router-dom';
import theme from 'styles/theme';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MainLayout>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
          </Routes>
        </HashRouter>
      </MainLayout>
    </ThemeProvider>
  </React.StrictMode>
); 