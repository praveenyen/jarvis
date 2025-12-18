'use client';

import {
  Grid,
  Button,
  Group,
  Text,
  Loader,
  Table,
  Card,
  Modal,
  Flex,
} from '@mantine/core';
import React, { useState, useEffect, useMemo, Fragment } from 'react';
import CustomChip from '@/components/common/CustomChip';
import { primaryBlue, primaryGreen } from '@/theme/colors';
import { formatCamelCase, createReturnStatusFunction } from '@/lib/utils/utils';
import {
  useDedupeData,
  useGetExposureResult,
} from '@/lib/queries/vision/queries';
import constants from '@/lib/utils/constants';
import { useAtomValue } from 'jotai';
import { appFormRawData } from '@/store/atoms';
import { TPreviousLoan } from '@/lib/queries/shield/queryResponseTypes';
import {
  TExposureInput,
  TInputDedupeData,
} from '@/lib/queries/vision/queryResponseTypes';
import {
  calculateExposure,
  getExposureResult,
} from '@/lib/queries/vision/services';
import { useQueriesWithRefetch } from '@/lib/hooks/customHooks';
import { getPreviousLoanQKey } from '@/lib/queries/queryKeys';
import { getAllLoansForDedupe } from '@/lib/queries/shield/services';
import { useLoader } from '@/lib/context/loaders/useLoader';
import { isUpl } from '@/lib/rules/commonRules';

type TTableRowData = {
  name?: string;
  dpd?: string;
  fraudCheck?: string;
};

const Dedupe = ({ appFormId }: { appFormId: string }) => {
  const [showStatus, setShowStatus] = useState<boolean>(true);
  const [openTable, setOpenTable] = useState<boolean>(false);
  const [tableData, setTableData] = useState<TTableRowData[]>([]);

  const appFormData = useAtomValue(appFormRawData);
  const { stop } = useLoader();
  const {
    data: dedupeData,
    isSuccess: isDedupeFetchSuccess,
    isLoading: isDedupeFetchLoading,
    refetch: refetchDedupeData,
  } = useDedupeData(appFormId);

  const stage =
    constants.completeStageList.indexOf(appFormData?.stage || '') < 9
      ? 'qc'
      : 'disbursal';

  const { data: exposureResult, isSuccess: isSuccessExposureResult } =
    useGetExposureResult(appFormId, stage);

  const { results, queries, refetchAll } = useQueriesWithRefetch(
    dedupeData?.detailedApplicantDedupeList
      ?.filter(
        (applicant) =>
          applicant?.dedupeStatus === '1' || applicant?.dedupeStatus === '2',
      )
      ?.map((applicant) => ({
        queryKey: getPreviousLoanQKey(applicant.id),
        queryFn: () => getAllLoansForDedupe(applicant.id),
      })) || [],
  );

  const repeatCustomerDetails = useMemo(() => {
    let previousLoans = results.map((i) => i.data as TPreviousLoan);
    let applicants = dedupeData?.detailedApplicantDedupeList?.filter(
      (applicant) =>
        applicant?.dedupeStatus === '1' || applicant?.dedupeStatus === '2',
    );

    return applicants?.reduce(
      (acc: Record<string, TPreviousLoan>, currenVal, index) => {
        let key = currenVal.id.toString();
        acc[key] = previousLoans[index];
        return acc;
      },
      {},
    );
  }, [dedupeData, results]);

  // const [repeatCustomerDetails, setRepeatCustomerDetails] = useState<
  //   Record<string, TPreviousLoan> | undefined
  // >();

  useEffect(() => {
    stop();
  }, []);

  const getTagType = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ok':
      case 'resolved':
        return primaryGreen[7];
      case 'check':
        return 'red';
      case 'no dedupe':
        return 'red';
      case 'rejected':
        return primaryBlue[7];
      default:
        return primaryGreen[7];
    }
  };

  const getStatus = (status: string) => {
    return createReturnStatusFunction('dedupe')(status);
  };

  const getEntityType = (type: string) => {
    switch (type.toLowerCase()) {
      case 'linkedindividual':
        return 'Individual';
      case 'linkedbusiness':
        return 'Business';
      case 'coApplicants':
        return 'CoApplicants';
      case 'beneficialOwners':
        return 'BeneficialOwners';
      default:
        return type;
    }
  };

  let panArray: any[] = [];
  let panNamehash: any = {};

  const prepareTableData = (exposureDetails: any) => {
    exposureDetails = exposureDetails.exposure;
    for (let val in exposureDetails) {
      if (panArray.indexOf(val) !== -1) {
        let obj: TTableRowData = {};
        obj.name = panNamehash[val];

        if (
          exposureDetails[val] !== null &&
          exposureDetails[val].policyExecuted.hasOwnProperty(
            'CUSTOMER_OVERDUE_SCORE | All applicant DPD value should be 5 ',
          )
        ) {
          obj.dpd =
            exposureDetails[val].policyExecuted[
              'CUSTOMER_OVERDUE_SCORE | All applicant DPD value should be 5 '
            ];
        } else {
          obj.dpd = 'NA';
        }
        if (
          exposureDetails[val] !== null &&
          exposureDetails[val].policyExecuted.hasOwnProperty(
            'GIVEN_CUSTOMER_IS_NOT_A_FRAUD| Check customer is not a fraud',
          )
        ) {
          obj.fraudCheck =
            exposureDetails[val].policyExecuted[
              'GIVEN_CUSTOMER_IS_NOT_A_FRAUD| Check customer is not a fraud'
            ];
        } else {
          obj.fraudCheck = 'NA';
        }

        setTableData((prev) => [...prev, obj]);
      }
    }
  };

  const getCalculateExposure = () => {
    // this.tableLoader = true
    // this.showExposureApproveTable = true

    let panValues: any[] = [];
    let panString = '';

    if (!isUpl(appFormData?.loanProduct)) {
      appFormData?.linkedBusiness?.kyc.forEach((kycVal) => {
        if (kycVal.kycType === 'panCard') {
          let kycObj: Record<string, string> = {};
          kycObj.kycValue = kycVal.kycValue;
          panArray.push(kycVal.kycValue);
          panString += kycVal.kycValue + ',';
          kycObj.customerId = appFormData?.linkedBusiness.customerId;
          panValues.push(kycObj);
          let panName =
            kycVal.lastName !== null
              ? kycVal.firstName + ' ' + kycVal.lastName
              : kycVal.firstName;
          panNamehash[kycVal.kycValue] = panName;
        }
      });
    }

    if (appFormData?.coApplicants) {
      appFormData.coApplicants.forEach((coApplicant) => {
        coApplicant.kyc.forEach((kycVal) => {
          if (kycVal.kycType === 'panCard') {
            let kycObj: Record<string, string> = {};
            kycObj.kycValue = kycVal.kycValue;
            panArray.push(kycVal.kycValue);
            panString += kycVal.kycValue + ',';
            kycObj.customerId = coApplicant.customerId;
            panValues.push(kycObj);
            let panName =
              kycVal.lastName !== null
                ? kycVal.firstName + ' ' + kycVal.lastName
                : kycVal.firstName;
            panNamehash[kycVal.kycValue] = panName;
          }
        });
      });
    }

    if (appFormData?.linkedIndividuals) {
      appFormData.linkedIndividuals.forEach((individual) => {
        individual.kyc.forEach((kycVal) => {
          if (kycVal.kycType === 'panCard') {
            let kycObj: Record<string, string> = {};
            kycObj.kycValue = kycVal.kycValue;
            panArray.push(kycVal.kycValue);
            panString += kycVal.kycValue + ',';
            kycObj.customerId = individual.customerId;
            panValues.push(kycObj);
            let panName =
              kycVal.lastName !== null
                ? kycVal.firstName + ' ' + kycVal.lastName
                : kycVal.firstName;
            panNamehash[kycVal.kycValue] = panName;
          }
        });
      });
    }

    panArray = panArray.filter(function (item, index, inputArray) {
      return inputArray.indexOf(item) == index;
    });
    let newPansObjects: any[] = [];
    let exposureDetails = {};

    // getExposureResult(appFormId, stage).then((data) =>
    if (exposureResult) {
      exposureDetails = exposureResult?.exposure;
      let pansInAppform = panArray;
      var newPansAdded: any[] = [];

      if (exposureDetails != null) {
        // PANs stored in backend
        let pansStoredInDB = Object.keys(exposureDetails);

        // call POST API for new pans added
        newPansAdded = pansInAppform.filter(function (n) {
          return !pansInAppform.includes(n);
        }, new Set(pansStoredInDB));

        panValues.forEach((pan) => {
          if (newPansAdded.indexOf(pan.kycValue) !== -1) {
            newPansObjects.push(pan);
          }
        });

        panValues = newPansObjects;
      }
      //if there are no new PANs and post API was already hit
      if (
        exposureDetails != null &&
        newPansAdded &&
        newPansAdded.length === 0
      ) {
        // use the response that came from the API previously
        prepareTableData(exposureResult);
      } else {
        let stageName =
          constants.completeStageList.indexOf(appFormData?.stage || '') < 9
            ? 'QC'
            : 'DISBURSAL';

        let postParams: TExposureInput = {
          appFormId: appFormData?.id,
          lpc: appFormData?.loanProduct,
          stage: stageName,
          applicantDetails: panValues,
        };
        calculateExposure(postParams).then((data) => {
          if (newPansObjects.length > 0) {
            let newObj = Object.assign(exposureDetails, data.exposure);
            let newObjExp = { exposure: newObj };
            prepareTableData(newObjExp);
          } else {
            prepareTableData(data);
          }
        });
      }
    }
  };

  const CustomChipEvent = () => {
    setShowStatus(!showStatus);
  };

  return dedupeData ? (
    <Flex p={20} w={'100%'} h={'100%'} direction={'column'} gap={6}>
      <Flex w={'100%'} justify={'flex-end'}>
        <Button
          color="primary"
          size="xs"
          onClick={() => {
            setOpenTable(true);
            getCalculateExposure();
          }}
        >
          Exposure Dedupe
        </Button>
      </Flex>

      <Grid>
        {dedupeData?.detailedApplicantDedupeList?.length > 0 &&
          dedupeData?.detailedApplicantDedupeList.map(
            (applicant, index: number) => (
              <Grid.Col
                span={{ base: 6, md: 6, lg: 3, xl: 6, xs: 12 }}
                key={index}
              >
                <Card shadow="sm" radius="md" key={`card${index}`}>
                  <Card.Section
                    withBorder
                    inheritPadding
                    py="xs"
                    key={`card${index}`}
                  >
                    <Group justify="space-between">
                      <Text fw={700} size="sm">
                        {getEntityType(applicant.type)} : {applicant.name}
                      </Text>
                      <CustomChip
                        customProps={{
                          variant: 'light',
                          color: getTagType(getStatus(applicant.dedupeStatus)),
                          size: 'sm',
                          radius: 'sm',
                          value: applicant.dedupeStatus
                            ? showStatus
                              ? getStatus(applicant.dedupeStatus)
                              : applicant.dedupeStatus
                            : 'NA',
                          CustomChipEvent: CustomChipEvent,
                        }}
                      />
                    </Group>
                  </Card.Section>
                  <Card.Section
                    withBorder
                    inheritPadding
                    mt="xs"
                    pb="xs"
                    key="card header"
                  >
                    <Group justify="space-between">
                      <Text mt="xs" fw={700} c="#5e6066" size="xs">
                        ID : {applicant?.id}
                      </Text>
                      <Text mt="xs" fw={700} c="#5e6066" size="xs">
                        Customer Id : {applicant?.customerId}
                      </Text>
                    </Group>
                  </Card.Section>
                  {applicant?.dedupeReason && (
                    <Card.Section withBorder inheritPadding mt="xs" pb="xs">
                      <Text mt="xs" fw={700} c="#5e6066" size="xs">
                        Dedupe Reason : {applicant?.dedupeReason}
                      </Text>
                    </Card.Section>
                  )}
                  {isDedupeFetchSuccess ? (
                    repeatCustomerDetails &&
                    Object.keys(repeatCustomerDetails).length !== 0 ? (
                      <Card.Section
                        key={index}
                        withBorder
                        inheritPadding
                        mt="xs"
                        pb="xs"
                      >
                        <Text mt="xs" fw={700} c="#5e6066" size="xs">
                          Repeat Customer Details :
                        </Text>
                        <Card shadow="sm" radius="md" withBorder mb="xs">
                          <Group justify="space-between">
                            <Text fw={500} c="#5e6066" size="xs">
                              Allowable Exposure :{' '}
                              {results &&
                              repeatCustomerDetails[applicant.id] &&
                              repeatCustomerDetails[applicant.id]
                                .allowableExposure != null
                                ? repeatCustomerDetails[applicant.id]
                                    .allowableExposure
                                : '-'}
                            </Text>
                            <CustomChip
                              customProps={{
                                variant: 'light',
                                color:
                                  (
                                    results &&
                                    repeatCustomerDetails[applicant.id] &&
                                    repeatCustomerDetails[applicant?.id]
                                  )?.approveRepeatLoan == 'Approve'
                                    ? primaryGreen[7]
                                    : 'red',
                                size: 'sm',
                                radius: 'sm',
                                value: (
                                  results &&
                                  repeatCustomerDetails[applicant?.id]
                                )?.approveRepeatLoan,
                                CustomChipEvent: CustomChipEvent,
                              }}
                            />
                          </Group>
                          {results &&
                            repeatCustomerDetails[applicant?.id]?.loans
                              ?.length > 0 &&
                            repeatCustomerDetails[applicant?.id]?.loans !=
                              null &&
                            repeatCustomerDetails[applicant?.id]?.loans?.map(
                              (loan, ind) => (
                                <Card.Section
                                  withBorder
                                  inheritPadding
                                  mt="sm"
                                  pb="xs"
                                  key={ind}
                                >
                                  <Group justify="space-between">
                                    <Text fw={500} c="#5e6066" size="xs">
                                      App Form Id :<br /> {loan?.appFormId}
                                    </Text>
                                    <Text fw={500} c="#5e6066" size="xs">
                                      Loan Product Code :<br />{' '}
                                      {loan?.loanProductCode}
                                    </Text>
                                    <Text fw={500} c="#5e6066" size="xs">
                                      Loan Amount :<br /> {loan?.loanAmount}
                                    </Text>
                                  </Group>
                                </Card.Section>
                              ),
                            )}
                        </Card>
                      </Card.Section>
                    ) : null
                  ) : (
                    <Flex align={'center'} justify={'center'}>
                      <Loader color="primary" size="md" />
                    </Flex>
                  )}

                  {applicant?.dedupedWith.length > 0 ? (
                    <Card.Section withBorder inheritPadding mt="xs" pb="xs">
                      <Text mt="xs" fw={700} c="#5e6066" size="xs">
                        List of Entities that Applicant {applicant?.id} was
                        Deduped with:
                      </Text>
                      {applicant?.dedupedWith?.length > 0 &&
                        applicant?.dedupedWith?.map(
                          (dedupeApplicant, dedupeWithIndex) => (
                            <>
                              <Card
                                shadow="sm"
                                radius="md"
                                withBorder
                                mt="sm"
                                pb="xs"
                                key={dedupeWithIndex}
                              >
                                <Card.Section
                                  withBorder
                                  inheritPadding
                                  mt="sm"
                                  pb="xs"
                                >
                                  <Group justify="space-between">
                                    <Text fw={700} c="#5e6066" size="xs">
                                      ID : {dedupeApplicant?.id}
                                    </Text>
                                    <Text fw={700} c="#5e6066" size="xs">
                                      Customer Id :{dedupeApplicant?.uid}
                                    </Text>
                                  </Group>
                                  <Text mt="xs" fw={500} c="#5e6066" size="xs">
                                    Pan Card : {dedupeApplicant?.pan}
                                  </Text>
                                  <Text mt="xs" fw={500} c="#5e6066" size="xs">
                                    Name : {dedupeApplicant?.name}
                                  </Text>
                                  {dedupeApplicant?.voterId && (
                                    <Text
                                      mt="xs"
                                      fw={500}
                                      c="#5e6066"
                                      size="xs"
                                    >
                                      Name : {dedupeApplicant?.name}
                                    </Text>
                                  )}
                                  <Group justify="space-between">
                                    <Text
                                      mt="xs"
                                      fw={500}
                                      c="#5e6066"
                                      size="xs"
                                    >
                                      App Form : {dedupeApplicant?.appForm}
                                    </Text>
                                    <div style={{ display: 'inline-flex' }}>
                                      <div style={{ fontSize: '12px' }}>
                                        Outcome :
                                      </div>
                                      <CustomChip
                                        customProps={{
                                          variant: 'light',
                                          color: '',
                                          size: 'sm',
                                          radius: 'sm',
                                          value: dedupeApplicant?.data?.outcome,
                                          CustomChipEvent: CustomChipEvent,
                                        }}
                                      />
                                    </div>
                                  </Group>
                                  <Text mt="xs" fw={500} c="#5e6066" size="xs">
                                    Loan Product Id : {dedupeApplicant?.lpc}
                                  </Text>
                                  <Text mt="xs" fw={500} c="#5e6066" size="xs">
                                    Created At : {dedupeApplicant?.createdAt}
                                  </Text>
                                  <Text mt="xs" fw={500} c="#5e6066" size="xs">
                                    Loan Start Date :{' '}
                                    {dedupeApplicant?.loanStartDate}
                                  </Text>
                                </Card.Section>

                                <Card.Section
                                  inheritPadding
                                  mt="sm"
                                  pb="xs"
                                  mb="sm"
                                >
                                  <Text fw={700} c="#5e6066" size="xs">
                                    Matched Data Points:
                                  </Text>
                                  <Group justify="space-between">
                                    {JSON.parse(
                                      dedupeApplicant?.data?.inputData,
                                    )?.map(
                                      (
                                        input: TInputDedupeData,
                                        dedupeApplicantIndex: number,
                                      ) => (
                                        <div
                                          key={dedupeApplicantIndex}
                                          style={{
                                            display: 'block',
                                            fontSize: '12px',
                                            color: '#5e6066',
                                            marginTop: '2px',
                                          }}
                                        >
                                          <Text
                                            fw={500}
                                            c="#5e6066"
                                            size="xs"
                                            mt="sm"
                                          >
                                            {formatCamelCase(input?.item)} of Id{' '}
                                            {
                                              dedupeApplicant?.data
                                                ?.inputApplicantId
                                            }
                                          </Text>
                                          <Text
                                            fw={500}
                                            c="#5e6066"
                                            size="xs"
                                            mt="sm"
                                          >
                                            {formatCamelCase(input?.value)}
                                          </Text>
                                        </div>
                                      ),
                                    )}
                                    {JSON.parse(
                                      dedupeApplicant?.data?.matchesFoundData,
                                    )?.map(
                                      (
                                        match: TInputDedupeData,
                                        matchesFoundDataIndex: number,
                                      ) => (
                                        <div
                                          key={matchesFoundDataIndex}
                                          style={{
                                            display: 'block',
                                            fontSize: '12px',
                                            color: '#5e6066',
                                            marginTop: '2px',
                                          }}
                                        >
                                          <Text
                                            fw={500}
                                            c="#5e6066"
                                            size="xs"
                                            mt="sm"
                                          >
                                            {formatCamelCase(match?.item)} of Id{' '}
                                            {
                                              dedupeApplicant?.data
                                                ?.matchFoundApplicantId
                                            }
                                          </Text>
                                          <Text
                                            fw={500}
                                            c="#5e6066"
                                            size="xs"
                                            mt="sm"
                                          >
                                            {formatCamelCase(match?.value)}
                                          </Text>
                                        </div>
                                      ),
                                    )}
                                  </Group>
                                </Card.Section>
                                {applicant?.dedupeStatus == '3H' ||
                                  (applicant?.dedupeStatus == '3M' && (
                                    <Button
                                      variant="light"
                                      size="xs"
                                      // onClick={() => {
                                      //   mergeApplicant(
                                      //     dedupeApplicant?.data
                                      //       ?.inputApplicantId,
                                      //     dedupeApplicant?.data?.matchFoundApplicantId?.toString(),
                                      //   );
                                      // }}
                                    >
                                      {' '}
                                      Resolve and Merge{' '}
                                      {
                                        dedupeApplicant?.data?.inputApplicantId
                                      }{' '}
                                      with{' '}
                                      {
                                        dedupeApplicant?.data
                                          ?.matchFoundApplicantId
                                      }
                                    </Button>
                                  ))}
                              </Card>{' '}
                            </>
                          ),
                        )}
                    </Card.Section>
                  ) : (
                    <Card.Section withBorder inheritPadding mt="xs" pb="xs">
                      <Text mt="xs" fw={700} c="#5e6066" size="xs">
                        Applicant {applicant.id} was Not Deduped with Any One
                      </Text>
                    </Card.Section>
                  )}
                  {applicant?.dedupeStatus == '3H' ||
                    (applicant?.dedupeStatus == '3M' && (
                      <Card.Section withBorder inheritPadding mt="xs" pb="xs">
                        <Button
                          variant="light"
                          size="xs"
                          // onClick={() => {
                          //   generateUniqueCust(applicant?.id);
                          // }}
                        >
                          Create unique customer for {applicant?.id}{' '}
                        </Button>
                      </Card.Section>
                    ))}
                </Card>
              </Grid.Col>
            ),
          )}
      </Grid>

      <Modal
        opened={openTable}
        onClose={() => {
          setTableData([]);
          setOpenTable(false);
        }}
        title="Exposure Dedupe"
        size="lg"
      >
        {tableData ? (
          <Table withTableBorder>
            <Table.Thead>
              <Table.Tr style={{ backgroundColor: '#f4f9ff' }}>
                <Table.Th>Name</Table.Th>
                <Table.Th>Parameter</Table.Th>
                <Table.Th>Result</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {tableData.length > 0 &&
                tableData?.map((rowData: TTableRowData) => (
                  <Fragment key={rowData.name}>
                    <Table.Tr key={`row1${rowData.name}`}>
                      <Table.Td rowSpan={2}>{rowData?.name}</Table.Td>
                      <Table.Td>DPD</Table.Td>
                      <Table.Td>{rowData?.dpd}</Table.Td>
                    </Table.Tr>
                    <Table.Tr key={`row2${rowData.name}`}>
                      <Table.Td>Fraud Check</Table.Td>
                      <Table.Td>{rowData?.fraudCheck}</Table.Td>
                    </Table.Tr>
                  </Fragment>
                ))}
            </Table.Tbody>
          </Table>
        ) : (
          <Flex align={'center'} justify={'center'} mt="md">
            <Loader type="oval" size="md" color="primary" />
          </Flex>
        )}
      </Modal>
    </Flex>
  ) : (
    <Flex mih={'100%'} align={'center'} justify={'center'} mt="lg">
      <Loader color="primary" size="md" />
    </Flex>
  );
};

export default Dedupe;
