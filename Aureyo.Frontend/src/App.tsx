import React from 'react';
import { Routes, Route, HashRouter } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './styles/theme';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';

const App: React.FC = () => {
  return (
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
  );
};

export default App; 