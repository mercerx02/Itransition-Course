import React from 'react';
import { Box, Card, CardContent, Button, Typography } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';

const LoginPage = ({BACKEND_URL, CLIENT_URL}) => {

  const authGoogle = () => {
    window.open(`${BACKEND_URL}/auth/google`, '_self');
  };


  const authGitHub = () => {
    window.open(`${BACKEND_URL}/auth/github`, '_self');
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="background.default"
    >
      <Card sx={{ minWidth: 300, maxWidth: 600 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Choose Authorization Method
          </Typography>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Button
              onClick={authGoogle}
              variant="contained"
              color="error"
              startIcon={<GoogleIcon />}
              sx={{ width: '100%', marginBottom: 2 }}
            >
              Login with Google
            </Button>
            <Button
              variant="contained"
              onClick={authGitHub}
              color="primary"
              startIcon={<GitHubIcon />}
              sx={{ width: '100%' }}
            >
              Login with GitHub
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;
