import React from 'react';
import { Box, AppBar, Toolbar, Typography, Container, Button, useMediaQuery, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link as RouterLink } from 'react-router-dom';

const Main = styled('main')(({ theme }) => ({
  flexGrow: 1,
  paddingTop: theme.spacing(8),
  minHeight: '100vh',
}));

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="fixed" color="inherit">
        <Container maxWidth="lg">
          <Toolbar sx={{ py: 1 }}>
            <Typography 
              variant="h6" 
              component={RouterLink}
              to="/"
              sx={{ 
                flexGrow: 1,
                color: 'primary.main',
                fontWeight: 700,
                letterSpacing: '-0.5px',
                textDecoration: 'none',
              }}
            >
              Aureyo
            </Typography>
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              <Button 
                color="inherit" 
                sx={{ 
                  color: 'text.secondary',
                  fontWeight: 500,
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: 'transparent',
                  }
                }}
                component={RouterLink}
                to="/how-it-works"
              >
                How it Works
              </Button>
              <Button 
                color="inherit" 
                sx={{ 
                  color: 'text.secondary',
                  fontWeight: 500,
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: 'transparent',
                  }
                }}
                component={RouterLink}
                to="/reports"
              >
                Reports
              </Button>
              <Button 
                color="inherit" 
                sx={{ 
                  color: 'text.secondary',
                  fontWeight: 500,
                  '&:hover': {
                    color: 'primary.main',
                    bgcolor: 'transparent',
                  }
                }}
                component={RouterLink}
                to="/reports/history"
              >
                View History
              </Button>
              {/* <Button 
                variant="outlined" 
                color="primary"
                component={RouterLink}
                to="/sign-in"
                sx={{ 
                  ml: 2,
                }}
              >
                Sign In
              </Button> */}
              <Button 
                variant="contained" 
                color="primary"
                component="a"
                href="https://form.typeform.com/to/EnZNgIf1"
                target="_blank"
                rel="noopener noreferrer"
                sx={{ ml: 1 }}
                endIcon={<ArrowForwardIcon />}
              >
                Get Started
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Main>
        {children}
      </Main>
    </Box>
  );
};

export default MainLayout; 