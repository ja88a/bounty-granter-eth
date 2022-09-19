import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import React from 'react';

export default function Copyright() {
    return (
      <Typography variant="body2" color="text.secondary" align="center">
        {'Copyleft © '}
        <Link color="inherit" href="https://github.com/ja88a/bounty-granter-eth/wiki">
          Jabba 01
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }