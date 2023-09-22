import React from 'react';
import { Box, Typography, Link, IconButton } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

const Footer = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#333',
        color: '#fff',
        padding: 2,
        textAlign: 'center',
      }}
    >
      <Typography variant="body2">
        &copy; {new Date().getFullYear()} All Rights Reserved.
      </Typography>
      <Box mt={1}>
        <Link
          href="https://www.linkedin.com/in/vladimir-bykov-14a337277/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#fff' }}
        >
          <IconButton>
            <LinkedInIcon />
          </IconButton>
        </Link>
        <Link
          href="https://github.com/mercerx02"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#fff' }}
        >
          <IconButton>
            <GitHubIcon />
          </IconButton>
        </Link>
      </Box>
    </Box>
  );
};

export default Footer;
