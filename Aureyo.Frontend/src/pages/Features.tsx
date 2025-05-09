import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import PsychologyIcon from '@mui/icons-material/Psychology';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RedditIcon from '@mui/icons-material/Reddit';
import TwitterIcon from '@mui/icons-material/Twitter';
import VideocamIcon from '@mui/icons-material/Videocam';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CampaignIcon from '@mui/icons-material/Campaign';

const PageHeader = styled(Box)(({ theme }) => ({
  background: theme.palette.background.paper,
  padding: theme.spacing(10, 0, 8),
  marginBottom: theme.spacing(4),
  textAlign: 'center',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[4],
  },
}));

const FeatureIcon = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.spacing(1),
  width: 48,
  height: 48,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
}));

const Features: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const features = [
    {
      title: 'Projects Dashboard',
      icon: <DashboardIcon />,
      description: 'Project Management',
      items: [
        'Create, track, and manage marketing projects',
        'Assign goals, deadlines, and team members',
        'Reporting Tools',
        'Generate reports per project (performance, audience impact, engagement metrics)',
        'Visual dashboards (KPIs, ROI)',
      ],
    },
    {
      title: 'Audience Intelligence',
      icon: <PeopleIcon />,
      description: 'AI-Powered Audience Research',
      items: [
        'Behavior-based segmentation (via browsing, interests, keywords)',
        'Audience persona generation',
        'Psychological Profiling',
        'Individual-level profiling',
        'Group-level/network psychology synthesis',
        'Correlation engine (shared traits, behavior models)',
      ],
    },
    {
      title: 'AI Agents',
      icon: <PsychologyIcon />,
      description: 'Autonomous Tools',
      items: [
        'Marketing Strategist Agent',
        'Suggest campaigns, messages, and target segments',
        'Data Analyst Agent',
        'Interprets audience data, social trends, and funnel performance',
      ],
    },
    {
      title: 'Audience Generation',
      icon: <AutoAwesomeIcon />,
      description: 'Automation Tools',
      items: [
        'Reddit Agent',
        'Scrapes subreddits for personality insights',
        'Clusters posts/comments into audience profiles',
        'Twitter Agent',
        'Tracks hashtags and sentiment',
        'Identifies micro-influencers and communities',
      ],
    },
    {
      title: 'Video Session Analyzer',
      icon: <VideocamIcon />,
      description: 'Video Analysis Tool',
      items: [
        'Auto-tag emotional states, engagement peaks',
        'Extract highlights, segment viewer feedback',
        'Integration with open-source AI video analyzers',
      ],
    },
    {
      title: 'Customer Analytics',
      icon: <AnalyticsIcon />,
      description: 'Analytics Suite',
      items: [
        'Behavior Tracking',
        'Integrate tools like Hotjar for session data',
        'Funnel behavior, bounce points, and UX issues',
        'Segment Integration',
        'Sync user profiles from Segment.com',
        'Track across devices and platforms',
      ],
    },
    {
      title: 'Early Adopters Program',
      icon: <RocketLaunchIcon />,
      description: 'Toolkit',
      items: [
        'Landing Page Builder',
        'Quick deployment for MVP/test interest',
        'Outreach Assistant',
        'Generate personalized outreach DMs',
        'Suggest value-offers (e.g., free trial, mentorship)',
        'User Onboarding & Feedback',
        'Welcome emails + guided tour',
        'In-app surveys, NPS tracking',
        'Perks: credits, early access, social recognition',
      ],
    },
    {
      title: 'Marketing Strategy Hub',
      icon: <CampaignIcon />,
      description: 'Strategy Tools',
      items: [
        'AI-Generated Strategies',
        'Campaign blueprints based on audience data',
        'Multichannel recommendations (email, social, community)',
        'Competitive Analysis',
        'Benchmark features vs. Exolyt, Aha!, HumanBehavior.co',
        'Integration Center',
        'APIs for HotJar, Segment, Notion, custom CRM',
      ],
    },
  ];

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <PageHeader>
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: 'primary.main',
            }}
          >
            Features
          </Typography>
          <Typography
            variant="h5"
            sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}
          >
            Discover our comprehensive suite of marketing and audience intelligence tools
          </Typography>
        </Container>
      </PageHeader>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <FeatureCard>
                <CardContent>
                  <FeatureIcon>
                    {feature.icon}
                  </FeatureIcon>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="primary"
                    gutterBottom
                    sx={{ mb: 2 }}
                  >
                    {feature.description}
                  </Typography>
                  <List dense>
                    {feature.items.map((item, itemIndex) => (
                      <ListItem key={itemIndex}>
                        <ListItemText primary={item} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </FeatureCard>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Features; 