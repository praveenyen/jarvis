import { useCallback, useMemo, useState } from 'react';
import {
  Stepper,
  Button,
  Group,
  Flex,
  StepperProps,
  Box,
  useMantineTheme,
  Transition,
} from '@mantine/core';
import { appFormRawData } from '@/store/atoms';
import { useAtomValue } from 'jotai';
import { TAppformData } from '@/lib/queries/shield/queryResponseTypes';
import { useEffect } from 'react';
import CustomIcon from '../icons/CustomIcons';

export default function AppFormStepper() {
  const [active, setActive] = useState(0);
  const [transitionOpened, setTransitionOpened] = useState(false);
  const appFormData = useAtomValue(appFormRawData);
  const theme = useMantineTheme();

  const [stageListDefault, setStageListDefault] = useState<Record<string, any>>(
    {
      creditstage: 'Credit',
      CUSTOMER_CONFIRMED: 'Customer Confirmation',
      qcstage: 'QC',
      bookingstage: 'Booked',
      disbursalstage: 'Disbursal',
    },
  );

  const StyledStepper = (props: StepperProps) => {
    return (
      <Stepper
        styles={{
          root: {
            minWidth: '60%',
            maxWidth: '100%',
          },
          step: {
            paddingTop:'5px',
            display: 'flex',
            flexDirection: 'column-reverse',
            gap: '12px',
          },

          // stepIcon: {
          //   borderWidth: 0,
          // },

          separator: {
            marginLeft: -10,
            marginRight: -10,
            marginTop: 30,
          },
          stepLabel: {
            paddingRight: '10px',
            color: '#a3a5b8',
            fontSize: '12px',
            textWrap: 'wrap',
          },
        }}
        allowNextStepsSelect={false}
        {...props}
      />
    );
  };

  const getAppFormStatusStage = useMemo(() => {
    let formattedStatus = '';
    if (appFormData) {
      const { stage, status, appFormStatus } = appFormData;
      if (appFormStatus === '-20') {
        formattedStatus = 'rejected';
      } else if (/IN_PROGRESS/i.test(status)) {
        formattedStatus = 'inprogress';
      } else if (/COMPLETE/i.test(status)) {
        formattedStatus = 'complete';
      } else if (/CONFIRMED/i.test(status)) {
        formattedStatus = 'complete';
      }
      return { stage: stage, status: formattedStatus };
    } else
      return {
        stage: '',
        status: '',
      };
  }, [appFormData]);

  const getStatus = useCallback(
    (stage: string, status: string) => {
      const appFormstage = getAppFormStatusStage.stage;
      const customerConfirmation = appFormData?.loan.customerConfirmationStatus;
      let stagesList = Object.keys(appFormStatuses);

      if (appFormData?.flowType !== 'EAGG') {
        let tempStageList: Record<string, any> = stageListDefault;
        delete tempStageList.CUSTOMER_CONFIRMED;
        setStageListDefault(tempStageList);
      }

      if (stage === appFormstage) {
        return getAppFormStatusStage.status;
      } else if (stagesList.indexOf(stage) < stagesList.indexOf(appFormstage)) {
        return 'complete';
      } else if (
        customerConfirmation === 'accept' &&
        status === 'Customer Confirmation'
      ) {
        return getAppFormStatusStage.status;
      }
      return '';
    },
    [appFormData, getAppFormStatusStage],
  );

  const appFormStatuses = useMemo<Record<string, any>>(() => {
    if (
      appFormData?.stage === 'mcu' ||
      appFormData?.stage === 'fcu' ||
      appFormData?.loan.mcuStatus !== 0
    ) {
      if (
        appFormData?.loan &&
        appFormData.loan?.negotiationStatus > 5 &&
        appFormData?.status !== 'CREDIT_COMPLETE'
      ) {
        const stageList = {
          mcu: 'MCU',
          fcu: 'FCU',
          creditstages: 'Credit',
          creditstage: 'Negotiation',
          CUSTOMER_CONFIRMED: 'Customer Confirmation',
          qcstage: 'QC',
          bookingstage: 'Booked',
          disbursalstage: 'Disbursal',
        };
        return stageList;
      }
      const temp = stageListDefault;
      return { mcu: 'MCU', fcu: 'FCU', ...temp };
    } else if (
      appFormData?.loan.negotiationStatus > 5 &&
      appFormData?.status !== 'CREDIT_COMPLETE'
    ) {
      const stageList = {
        creditstages: 'Credit',
        creditstage: 'Negotiation',
        CUSTOMER_CONFIRMED: 'Customer Confirmation',
        qcstage: 'QC',
        bookingstage: 'Booked',
        disbursalstage: 'Disbursal',
      };
      return stageList;
    }
    return stageListDefault;
  }, [appFormData]);

  const getActiveStage = () => {
    let activeStatusCount = 0;
    for (const [key, value] of Object.entries(appFormStatuses)) {
      if (['complete', 'rejected'].includes(getStatus(key, value)))
        ++activeStatusCount;
    }
    setActive(activeStatusCount);
  };

  useEffect(() => {
    getActiveStage();
  }, [appFormData, appFormStatuses]);

  useEffect(() => {
    getActiveStage();
    let stepperTransTimeOut = setTimeout(() => {
      setTransitionOpened(true);
    }, 0);
    return () => clearTimeout(stepperTransTimeOut);
  }, []);

  return (
    <Flex justify="center" align="center" px={50} py={16}>
      <Transition
        mounted={transitionOpened}
        transition="fade-right"
        enterDelay={100}
        timingFunction="ease"
      >
        {(styles) => (
          <StyledStepper
            active={active}
            style={{ ...styles }}
            autoContrast={true}
            iconSize={22}
            color={
              appFormData?.appFormStatus === '-20' ? 'error' : 'brandGreen.5'
            }
            size="sm"
          >
            {Object.entries(appFormStatuses).map(([key, value], index) => (
              <Stepper.Step
                styles={{
                  stepLabel: {
                    fontWeight: 600,
                    color:
                      appFormData?.appFormStatus === '-20'
                        ? index < active
                          ? theme.colors['error'][5]
                          : theme.colors['neutral'][5]
                        : index < active
                          ? theme.colors['brandGreen'][5]
                          : theme.colors['neutral'][5],
                  },
                  ...styles,
                }}
                allowStepClick={false}
                allowStepSelect={false}
                key={value}
                label={value}
                color={
                  appFormData?.appFormStatus === '-20'
                    ? 'error'
                    : 'brandGreen.5'
                }
                completedIcon={
                  appFormData?.appFormStatus === '-20' ? (
                    <CustomIcon
                      name="MdOutlineClear"
                      src="MaterialIcon"
                      size="10px"
                    />
                  ) : undefined
                }
                icon={
                  <Box
                    bg="#d7d8e0"
                    w={14}
                    h={14}
                    style={{ borderRadius: '50%' }}
                  >
                    {' '}
                  </Box>
                }
              />
            ))}
          </StyledStepper>
        )}
      </Transition>
    </Flex>
  );
}
