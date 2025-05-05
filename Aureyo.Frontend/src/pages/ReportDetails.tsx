import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import { Report, getReportById } from '../services/reportFirebaseService';

const PageContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
  padding: theme.spacing(3),
}));

const DetailsPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(3),
}));

const ReportDetails: React.FC = () => {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    fetchReportDetails();
  }, [id]);

  const fetchReportDetails = async () => {
    if (!id) {
      setError('Report ID is missing');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const reportData = await getReportById(id);
      
      if (!reportData) {
        setError('Report not found');
      } else {
        setReport(reportData);
      }
    } catch (error) {
      setError('Error loading report details');
      console.error('Error fetching report details:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderBackButton = () => (
    <Button
      startIcon={<ArrowBackIcon />}
      onClick={() => navigate('/reports')}
      variant="outlined"
      sx={{ mb: 2 }}
    >
      Back to Reports
    </Button>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !report) {
    return (
      <PageContainer>
        {renderBackButton()}
        <Alert severity="error" sx={{ mt: 2 }}>
          {error || 'Report not found'}
        </Alert>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {renderBackButton()}

      <DetailsPaper>
        <Typography variant="h4" gutterBottom color="primary">
          {report.data.title}
        </Typography>

        <Box sx={{ mt: 4 }}>
          {Object.entries(report.data).filter(([key]) => key !== 'title').map(([key, value]) => (
            <Box key={key} sx={{ mb: 4 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                {key.split('_').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {value as string}
              </Typography>
            </Box>
          ))}

          <Box sx={{ mt: 6 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Report Type
            </Typography>
            <Typography variant="body1" gutterBottom>
              {report?.type?.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join(' ')}
            </Typography>

            <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mt: 3 }}>
              Created At
            </Typography>
            <Typography variant="body1">
              {new Intl.DateTimeFormat('en-US', {
                dateStyle: 'full',
                timeStyle: 'long',
              }).format(report?.createdAt)}
            </Typography>

            <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mt: 3 }}>
              Status
            </Typography>
            <Typography variant="body1" sx={{ textTransform: 'capitalize' }}>
              {report.status}
            </Typography>
          </Box>
        </Box>
      </DetailsPaper>
    </PageContainer>
  );
};

export default ReportDetails; 