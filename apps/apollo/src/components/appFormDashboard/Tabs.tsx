'use client';
import { Box, Button, Grid, SegmentedControl } from '@mantine/core';
import classes from '@/components/appFormDashboard/Application.module.css';
import { AppFormCategory } from '@/components/appFormDashboard/Dashboard';

type Props = {
  appFormCategory: AppFormCategory;
  processAppFormCategory: (value: AppFormCategory) => void;
};
export default function Tabs(props: Props) {
  const { appFormCategory, processAppFormCategory } = props;

  return (
    <div style={{ width: '300px' }}>
      <SegmentedControl
        fullWidth
        size="sm"
        radius="md"
        value={appFormCategory}
        onChange={(value) => processAppFormCategory(value as AppFormCategory)}
        styles={{
          root: {
            backgroundColor: '#edebeb',
            padding: '2px',
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 5px 5px',
          },
        }}
        data={[
          { label: 'In Progress', value: 'inprogress' },
          { label: 'Rejected', value: 'rejected' },
        ]}
      />
    </div>

    // <Grid.Col span={4} style={{ textAlign: 'center' }}>
    //   <Box style={{ display: 'inline-flex' }}>
    //     <Button
    //       variant={appFormCategory == 'inprogress' ? 'outline' : 'default'}
    //       onClick={() => processAppFormCategory('inprogress')}
    //       className={classes.switchButton}
    //       size="md"
    //     >
    //       In Progress
    //     </Button>
    //     <Button
    //       variant={appFormCategory == 'inprogress' ? 'default' : 'outline'}
    //       onClick={() => processAppFormCategory('rejected')}
    //       className={classes.switchButton}
    //       size="md"
    //     >
    //       Rejected
    //     </Button>
    //   </Box>
    // </Grid.Col>
  );
}
