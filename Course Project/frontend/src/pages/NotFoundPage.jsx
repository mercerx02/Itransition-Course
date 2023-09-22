import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Container maxWidth="sm">
      <Box mt={8} textAlign="center">
        <Typography variant="h2" color="primary" gutterBottom>
          404 - Page not found ):
        </Typography>
        <Box mt={4}>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/"
          >
            Back to main page
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default NotFoundPage;
