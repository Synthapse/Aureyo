import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Tabs, 
  Tab, 
  Alert, 
  Snackbar,
  CircularProgress,
  Paper,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ReportForm from '../components/ReportForm';
import { ReportType } from '../types/reports';
import * as reportService from '../services/reportService';
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from '../firebase';
import { Link as RouterLink } from 'react-router-dom';
import HistoryIcon from '@mui/icons-material/History';

const PageHeader = styled(Box)(({ theme }) => ({
  background: theme.palette.background.paper,
  padding: theme.spacing(10, 0, 8),
  marginBottom: theme.spacing(4),
  textAlign: 'center',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ReportType>('marketing-strategy');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: ReportType) => {
    setActiveTab(newValue);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      let response;
      switch (activeTab) {
        case 'marketing-strategy':
          response = await reportService.generateMarketingStrategyReport(data);
          break;
        case 'early-adapters':
          response = await reportService.generateEarlyAdaptersReport(data);
          break;
        case 'go-to-market':
          response = await reportService.generateGoToMarketReport(data);
          break;
      }

      //save to firebase
      console.log(response)
      console.log(response.text_content)
      
      await addDoc(collection(db, "reports"), {
        tab: activeTab,
        inputData: data,
        reportText: response.text_content || "",
        createdAt: Timestamp.now(),
      });


      setSnackbar({
        open: true,
        message: 'Report generated successfully!',
        severity: 'success',
      });
      
      // Here you might want to handle the response, such as downloading the report
      console.log('Report generated:', response);
      
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to generate report. Please try again.',
        severity: 'error',
      });
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <PageHeader>
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
            <Box>
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom
                sx={{ 
                  fontWeight: 700,
                  color: 'primary.main'
                }}
              >
                Generate Reports
              </Typography>
              <Typography 
                variant="h5" 
                sx={{ color: 'text.secondary', maxWidth: 600 }}
              >
                Create detailed reports for your marketing strategy, early adapters analysis, and go-to-market planning.
              </Typography>
            </Box>
            <Button
              component={RouterLink}
              to="/reports/history"
              variant="outlined"
              startIcon={<HistoryIcon />}
              sx={{ height: 'fit-content' }}
            >
              View History
            </Button>
          </Box>
        </Container>
      </PageHeader>

      <Container maxWidth="lg">
        <Paper sx={{ mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            aria-label="report types"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab 
              label="Marketing Strategy" 
              value="marketing-strategy"
              sx={{ py: 2 }}
            />
            <Tab 
              label="Early Adapters" 
              value="early-adapters"
              sx={{ py: 2 }}
            />
            <Tab 
              label="Go to Market" 
              value="go-to-market"
              sx={{ py: 2 }}
            />
          </Tabs>
        </Paper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <ReportForm
            type={activeTab}
            onSubmit={handleSubmit}
          />
        )}
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Reports; 