import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

function ProfilePage() {
  const profile = useSelector((state: RootState) => state.profile);
  const baseURL = 'images/profile-pics/';

  return (
    <Box p={3} sx={{ backgroundColor: '#f5f5f5' }}>
      <Paper elevation={3} sx={{ padding: 3, backgroundColor: 'white' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Avatar
              alt="Profile Picture"
              src={`${baseURL}${profile.profilePicture}`}
              sx={{ width: 150, height: 150 }}
            />
          </Grid>
          <Grid item xs={12} sm={8}>
            <Typography variant="h4" gutterBottom>
              {profile.firstName} {profile.lastName}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              {profile.userType}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Email: {profile.email}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default ProfilePage;
