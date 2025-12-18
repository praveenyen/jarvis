'use client';

import { Box, Grid, Title } from '@mantine/core';
import classes from '@/components/appFormDashboard/Application.module.css';

export default function AppFormDashboardHeader() {
  return (
    <Grid.Col span={4} style={{ textAlign: 'left' }}>
      <Title order={3} c="primary">
        Applications
      </Title>
    </Grid.Col>
  );
}
