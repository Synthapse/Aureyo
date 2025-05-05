import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import MainLayout from 'layouts/MainLayout';
import Home from 'pages/Home';
import HowItWorks from 'pages/HowItWorks';
import Reports from 'pages/Reports';
import ReportsHistory from 'pages/ReportsHistory';
import ReportDetails from 'pages/ReportDetails';
import { HashRouter, Routes, Route } from 'react-router-dom';
import theme from 'styles/theme';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HashRouter>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/reports/history" element={<ReportsHistory />} />
            <Route path="/reports/:id" element={<ReportDetails />} />
          </Routes>
        </MainLayout>
      </HashRouter>
    </ThemeProvider>
  </React.StrictMode>
); 