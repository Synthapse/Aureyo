import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate, useParams } from 'react-router-dom';
import { Report, getReportById } from '../services/reportFirebaseService';
import { parseStructuredTextWithTables } from 'utils';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

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
  const [isPublic, setIsPublic] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
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
        setIsPublic(reportData.public || false);
        // Check if current user is the author
        const currentUser = auth.currentUser;
        setIsAuthor(currentUser?.email === reportData.authorEmail);
      }
    } catch (error) {
      setError('Error loading report details');
      console.error('Error fetching report details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePublicToggle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!id) return;
    
    const newPublicState = event.target.checked;
    try {
      const reportRef = doc(db, 'reports', id);
      await updateDoc(reportRef, {
        public: newPublicState
      });
      setIsPublic(newPublicState);
    } catch (error) {
      console.error('Error updating report visibility:', error);
      // Revert the switch state if update fails
      setIsPublic(!newPublicState);
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


  console.log(report);

  return (
    <PageContainer>
      {renderBackButton()}

      <DetailsPaper>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" color="primary">
            {report.data.title}
          </Typography>
          {isAuthor && (
            <FormControlLabel
              control={
                <Switch
                  checked={isPublic}
                  onChange={handlePublicToggle}
                  color="primary"
                />
              }
              label="Make Public"
            />
          )}
        </Box>
        {report?.inputData && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              User data:
            </Typography>
            <List dense disablePadding>
              {Object.entries(report.inputData).map(([key, value]) => (
                <ListItem key={key} sx={{ display: 'list-item', pl: 2 }}>
                  <Typography variant="body2">
                    <strong>{key}:</strong> {String(value)}
                  </Typography>
                </ListItem>
              ))}
            </List>
          </Box>
        )}

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
        </Box>
        <hr />



        <Box sx={{ mt: 4 }}>
          {Object.entries(report.data)
            .filter(([key]) => key !== 'title')
            .map(([key, value]) => {
              const parsed = parseStructuredTextWithTables(value as string);

              return (
                <Box key={key} sx={{ mb: 4 }}>
                  <Typography variant="h3" color="text.secondary" gutterBottom>
                    {key
                      .split('_')
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')}
                  </Typography>

                  {/* Render Sections */}
                  {parsed.sections.length > 0 && parsed.sections.map((section, idx) => (
                    <Box key={idx} sx={{ mb: 2 }}>
                      <Typography variant="h5" fontWeight="bold" gutterBottom>
                        {section.header}
                      </Typography>
                      <List dense disablePadding>
                        {section.subpoints.map((sp, i) => (
                          <ListItem key={i} sx={{ display: 'list-item', pl: 2 }}>
                            <Typography variant="body2">
                              <strong>{sp.title}:</strong> {sp.desc}
                            </Typography>
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  ))}

                  {/* Render Tables */}
                  {parsed.tables.length > 0 && parsed.tables.map((table, idx) => (
                    <Box key={`table-${idx}`} sx={{ mb: 2 }}>
                      <Typography variant="h5" fontWeight="bold" gutterBottom>
                        {table.header || 'Table'} {/* Display table header */}
                      </Typography>
                      <Table sx={{ width: '100%' }}>
                        <TableHead>
                          <TableRow>
                            {Object.keys(table.rows[0] || {}).map((header, i) => (
                              <TableCell key={i} sx={{ fontWeight: 'bold' }}>
                                {header}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {table.rows.map((row, rowIndex) => (
                            <TableRow key={rowIndex}>
                              {Object.values(row).map((cell, cellIndex) => (
                                //@ts-ignore
                                <TableCell key={cellIndex}>{cell}</TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  ))}

                  {/* Fallback for raw text */}
                  {!parsed.sections.length && !parsed.tables.length && (
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                      {value as string}
                    </Typography>
                  )}
                </Box>
              );
            })}
        </Box>
      </DetailsPaper>
    </PageContainer>
  );
};

export default ReportDetails; 