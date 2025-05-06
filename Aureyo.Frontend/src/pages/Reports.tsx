import React, { useState, useEffect } from 'react';
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
  Button,
  Chip,
  Tooltip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ReportForm from '../components/ReportForm';
import { ReportType } from '../types/reports';
import * as reportService from '../services/reportService';
import { collection, addDoc, Timestamp, doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db, auth } from '../firebase';
import { Link as RouterLink } from 'react-router-dom';
import HistoryIcon from '@mui/icons-material/History';
import StarsIcon from '@mui/icons-material/Stars';
import { addUserActivity } from '../services/userActivityService';
import { getUserPointsFromSubscription, removePointsFromSubscription } from 'services/subscriptionService';

const PageHeader = styled(Box)(({ theme }) => ({
  background: theme.palette.background.paper,
  padding: theme.spacing(10, 0, 8),
  marginBottom: theme.spacing(4),
  textAlign: 'center',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const PointCostChip = styled(Chip)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  backgroundColor: 'rgba(255, 215, 0, 0.1)',
  color: '#B8860B',
  fontWeight: 600,
  '& .MuiChip-icon': {
    color: '#FFD700',
  },
}));

// Define point costs for each report type
const REPORT_COSTS = {
  'marketing-strategy': 3,
  'early-adapters': 2,
  'go-to-market': 2
};

const Reports: React.FC = () => {

  const userEmail = auth.currentUser?.email;
  const [activeTab, setActiveTab] = useState<ReportType>('marketing-strategy');
  const [loading, setLoading] = useState(false);
  const [userPoints, setUserPoints] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    fetchPoints();
  }, []);

  const fetchPoints = () => {

    getUserPointsFromSubscription(userEmail ?? "").then((points) => {
      setUserPoints(points);
      setIsLoading(false); // Set loading to false after fetching points
    }).catch((error) => {
      console.error('Error fetching points:', error);
      return 0; // Default to 0 points on error
    });
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: ReportType) => {
    setActiveTab(newValue);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getReportTitle = (type: ReportType, data: any) => {
    switch (type) {
      case 'marketing-strategy':
        return `Marketing Strategy for ${data.targetAudience || 'Target Audience'}`;
      case 'go-to-market':
        return `Go-to-Market Plan for ${data.productName || 'Product'}`;
      case 'early-adapters':
        return `Early Adopters Analysis for ${data.targetMarket || 'Target Market'}`;
      default:
        return 'Report';
    }
  };

  const hasEnoughPoints = () => {
    return userPoints >= REPORT_COSTS[activeTab];
  };

  const handleSubmit = async (data: any) => {
    if (!hasEnoughPoints()) {
      setSnackbar({
        open: true,
        message: `Not enough points. You need ${REPORT_COSTS[activeTab]} points to generate this report.`,
        severity: 'warning',
      });
      return;
    }

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

      // Save report to Firebase
      await addDoc(collection(db, "reports"), {
        tab: activeTab,
        inputData: data,
        reportText: response.text_content || "",
        createdAt: Timestamp.now(),
        status: 'completed'
      });


      // Add user activity
      const user = auth.currentUser;
      if (user) {
        await addUserActivity({
          userId: user.uid,
          type: activeTab,
          title: getReportTitle(activeTab, data),
          status: 'completed'
        });

        // Deduct points from user's account

        removePointsFromSubscription(userEmail ?? "", REPORT_COSTS[activeTab]).then(() => {
          console.log('Points deducted successfully.');
        }).catch((error) => {
          console.error('Error deducting points:', error);
        });


        // Update local state with new points balance
        setUserPoints(prevPoints => prevPoints - REPORT_COSTS[activeTab]);
      }

      setSnackbar({
        open: true,
        message: 'Report generated successfully!',
        severity: 'success',
      });

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
                sx={{ color: 'text.secondary' }}
              >
                Create detailed reports for your marketing strategy, early adapters analysis, and go-to-market planning.
              </Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
            <Typography variant="h6" sx={{ mr: 2 }}>Your Points:</Typography>
            <Chip
              icon={<StarsIcon />}
              label={isLoading ? "Loading..." : userPoints}
              sx={{
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                color: '#B8860B',
                fontWeight: 600,
                '& .MuiChip-icon': {
                  color: '#FFD700',
                },
                fontSize: '1.2rem',
                px: 1
              }}
            />
            <Button
              component={RouterLink}
              to="/pricing"
              variant="outlined"
              sx={{ ml: 2 }}
              size="small"
            >
              Get More Points
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
              label={
                <Box display="flex" alignItems="center">
                  Marketing Strategy
                  <PointCostChip
                    size="small"
                    icon={<StarsIcon />}
                    label={REPORT_COSTS['marketing-strategy']}
                  />
                </Box>
              }
              value="marketing-strategy"
              sx={{ py: 2 }}
            />
            <Tab
              label={
                <Box display="flex" alignItems="center">
                  Early Adapters
                  <PointCostChip
                    size="small"
                    icon={<StarsIcon />}
                    label={REPORT_COSTS['early-adapters']}
                  />
                </Box>
              }
              value="early-adapters"
              sx={{ py: 2 }}
            />
            <Tab
              label={
                <Box display="flex" alignItems="center">
                  Go to Market
                  <PointCostChip
                    size="small"
                    icon={<StarsIcon />}
                    label={REPORT_COSTS['go-to-market']}
                  />
                </Box>
              }
              value="go-to-market"
              sx={{ py: 2 }}
            />
          </Tabs>
        </Paper>

        {!hasEnoughPoints() && (
          <Alert
            severity="warning"
            sx={{ mb: 3 }}
            action={
              <Button
                color="inherit"
                size="small"
                component={RouterLink}
                to="/pricing"
              >
                Get Points
              </Button>
            }
          >
            You need {REPORT_COSTS[activeTab]} points to generate this report. Your current balance: {userPoints} points.
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <ReportForm
            type={activeTab}
            onSubmit={handleSubmit}
            disabled={!hasEnoughPoints()}
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