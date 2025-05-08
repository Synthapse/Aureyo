import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Avatar,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import StarsIcon from '@mui/icons-material/Stars';
import HistoryIcon from '@mui/icons-material/History';
import SettingsIcon from '@mui/icons-material/Settings';
import { Link as RouterLink } from 'react-router-dom';
import { auth, googleProvider } from '../firebase';
import { getUserActivities } from 'services/userActivityService';
import { getUserPoints } from 'services/subscriptionService';

const PageHeader = styled(Box)(({ theme }) => ({
  background: theme.palette.background.paper,
  padding: theme.spacing(10, 0, 8),
  marginBottom: theme.spacing(4),
  textAlign: 'center',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const ProfileCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[2],
}));

const PointsDisplay = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 215, 0, 0.1)',
  borderRadius: theme.spacing(2),
  padding: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

const PointsIcon = styled(StarsIcon)(({ theme }) => ({
  color: '#FFD700',
  marginRight: theme.spacing(1),
  fontSize: 28,
}));

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const Profile: React.FC = () => {

  const userId = auth.currentUser?.uid;
  const userName = auth.currentUser?.displayName;
  const userEmail = auth.currentUser?.email;
  const createdAt = auth.currentUser?.metadata.creationTime;
  const avatar = auth.currentUser?.photoURL;

  const [userActivity, setUserActivity] = useState<any[]>([]);
  const [userPoints, setUserPoints] = useState<number>(0);


  // Mock user data - replace with actual user data from your auth system
  const user = {
    name: userName,
    email: userEmail,
    points: 25,
    avatar: avatar,
    joinDate: createdAt,
  };

  useEffect(() => {
    const fetchUserActivity = async () => {
      const userActivity = await getUserActivities(userId);
      setUserActivity(userActivity);
    };
    fetchUserActivity();
    fetchPoints();
  }, []);


  const fetchPoints = () => {

    getUserPoints(userEmail ?? "").then((points) => {
      setUserPoints(points);
    }).catch((error) => {
      console.error('Error fetching points:', error);
      return 0; // Default to 0 points on error
    });
  }

  return (
    <Box sx={{ bgcolor: 'background.default' }}>

      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <ProfileCard>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                {avatar &&
                  <Avatar
                    src={avatar}
                    sx={{
                      width: 120,
                      height: 120,
                      margin: '0 auto',
                      mb: 2,
                    }}
                  />
                }
                <Typography variant="h5" gutterBottom>
                  {user.name}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                  {user.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Member since {user.joinDate}
                </Typography>
              </Box>

              <PointsDisplay>
                <PointsIcon />
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    color: '#B8860B',
                  }}
                >
                  {userPoints} Points
                </Typography>
              </PointsDisplay>

              {/* <Button
                variant="contained"
                color="primary"
                fullWidth
                startIcon={<SettingsIcon />}
                sx={{ mb: 2 }}
              >
                Edit Profile
              </Button> */}
            </ProfileCard>
          </Grid>

          <Grid item xs={12} md={8}>
            <ProfileCard>
              <Typography variant="h6" gutterBottom>
                Recent Activity
              </Typography>
              <List>
                {userActivity.map((activity) => (
                  <a href ={`#/reports/${activity.reportId}`} key={activity.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <ListItem key={activity.id}>
                    <ListItemIcon>
                      <HistoryIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.title}
                      secondary={formatDate(activity.createdAt)}
                    />
                  </ListItem>
                  </a>
                ))}
              </List>
            </ProfileCard>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Profile; 