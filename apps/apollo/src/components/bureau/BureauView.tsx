'use client';
import {
  Flex,
  List,
  Stack,
  ThemeIcon,
  Text,
  useMantineTheme,
  Affix,
  Transition,
  Paper,
  Button,
  ActionIcon,
  Title,
  Box,
  Center,
  Loader,
} from '@mantine/core';
import React, {
  CSSProperties,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AppAvatar } from '../common/AppAvatar';
import iconColors from '../icons/iconColors';
import { getAppFormApplicantList } from '@/store/modules/appform/selectors';
import { useAtomValue } from 'jotai';
import {
  BureauSelectDropdown,
  TBureauOptionsItem,
} from './BureauSelectDropdown';
import { appFormRawData } from '@/store/atoms';
import {
  formattedDate,
  formattedDateTime,
  getAddressLines,
  getAddressLinesBureau,
  getAddressLinesBureauData,
} from '../appFormLayout/appFormHelpers';
import { genderMap } from '../appForm/AppFormView';
import { useQuery } from '@tanstack/react-query';
import { getCreditReportQkey } from '@/lib/queries/queryKeys';
import { TCibilAddress } from '@/lib/queries/cerebro/queryResponseTypes';
import { PIDataRows, TRowtype } from './PIDataRows';
import CustomIcon from '../icons/CustomIcons';
import { useCreditReportFile } from '@/lib/queries/bureauEngine/queries';
import { getCreditReport } from '@/lib/queries/bureauEngine/services';
import {
  formatDateForBureauDates,
  formatDateForBureauDatesDDMMYYYY,
  parseDDMMYYYYCompactDateString,
} from './bureauHelpers';
import { CreditReportExperian } from './CreditReportExperian';
import CustomSkeletonLayout from './common/CustomSkeletonLayout';
import {
  addressTypeMap,
  idTypeMap,
  idTypeReverseMap,
  loanTypeMapCibil,
  occupationMap,
  stateMappings,
  telephoneTypeMap,
  genderCodeMapCibil,
  genderCodeMapExperian
} from './common/codeMappings';
import { CreditReportCibil } from './CreditReportCibil';
import { useClickOutside } from '@mantine/hooks';
import UploadBureauDoc from './UploadBureauDoc';
import { cibilLoanProducts, isSmeDirect } from '@/lib/rules/commonRules';

type BureauView = {
  appFormId: string;
  lpc: string;
};
type TIdType = { type: string; value: string };
export type CreditReportView = {
  appFormId: string;
  lpc: string;
  bureauData: Record<string, any> | undefined;
  styles?: CSSProperties;
};
const bureauOptions: TBureauOptionsItem[] = [
  { description: 'EXPERIAN', value: 'ConsumerExperian', pullType: 'HardPull' },
  { description: 'CIBIL', value: 'ConsumerCibil', pullType: 'HardPull' },
  // { description: 'CRIF', value: 'ConsumerCrif', pullType: 'HardPull' },
  // { description: 'Experian D2C', value: 'ConsumerExperian', pullType: 'D2CFP' },
];
const views = [
  { label: 'Personal Identification', key: 'personal' },
  { label: 'Credit Report', key: 'credit' },
];



const BureauView: React.FC<BureauView> = ({ appFormId, lpc }) => {
  const applicantList = useAtomValue(getAppFormApplicantList);
  const [currentSelectedApplicant, setCurrentSelectedApplicant] =
    useState<number>(0);
  const appFormData = useAtomValue(appFormRawData);
  const defaultBureau = cibilLoanProducts.includes(
    appFormData?.loanProduct || '',
  )
    ? 'CIBIL'
    : 'EXPERIAN';
  const [bureauName, setBureauName] = useState<string>(defaultBureau);
  const [opened, setOpened] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useClickOutside(() => setOpened(false));
  const [currentView, setCurrentView] = useState<string>(
    'Personal Identification',
  );

  const theme = useMantineTheme();

  const {
    data: bureauReportFiles,
    isFetching: isBureauReportFileFetching,
    isSuccess: isBureauReportFileSuccess,
    isError: isBureauReportFileError,
  } = useCreditReportFile(
    appFormId,
    applicantList.length > 0
      ? applicantList[currentSelectedApplicant].id.toString()
      : '',
  );

  const [bureauType, pullType] = useMemo(
    () =>
      ((
        selectedOption = bureauOptions.find(
          (option) => option.description === bureauName,
        ),
      ) => [selectedOption?.value, selectedOption?.pullType])(),
    [bureauName],
  );

  const bureauPullId =
    bureauReportFiles?.reports?.find(
      (report) =>
        report.bureauName === bureauType &&
        report.creditReports.length > 0 &&
        report.pullType === pullType,
    )?.bureauPullId || '';

  const {
    isFetching: bureauDataIsfetching,
    fetchStatus,
    data: bureauData,
  } = useQuery<Record<string, any>>({
    queryKey: getCreditReportQkey(bureauPullId, bureauName, appFormId),
    queryFn: () =>
      getCreditReport(bureauPullId, bureauName, undefined, {
        revalidateSec: 3600 * 10,
      }),
    retry: false,
    enabled:
      Boolean(bureauPullId) && !isSmeDirect(appFormData?.loanProduct || ''),
  });

  const bureauUploadShowCondition = useMemo(() => {
    if(bureauReportFiles?.reports && bureauReportFiles.reports.length > 0)
      {
        let bureauFiles = bureauReportFiles.reports.find((report) => report.bureauName === bureauType);
        if(bureauFiles?.creditReports && bureauFiles?.creditReports?.length === 0)
          return false
        else if(bureauFiles?.creditReports.some((file) => file.format === 'parsedXml'))
          return false
        else 
          return true
      }
      else return false  
  },[bureauReportFiles,bureauType])

  const personalIdentificationDataTransformerForExperian = useMemo(() => {
    let personalData: TRowtype[] = [];
    if (!bureauData || bureauType !== 'ConsumerExperian') return personalData;

    let linkedIndividual = appFormData?.linkedIndividuals?.find(
      (individual) =>
        individual.id === applicantList[currentSelectedApplicant].id,
    );
    let panCardDetails = linkedIndividual?.kyc?.find(
        (kycItem) => kycItem.kycType === 'panCard',
      ),
      bureauPan = bureauData?.kyc?.pan;
    let contact = linkedIndividual?.contacts?.find((c) => c.type === 'phone');

    let address = linkedIndividual?.addresses?.find(
      (a) => a.type.toLowerCase() === 'curres',
    );

    personalData.push({
      label: 'NAME',
      data: {
        appForm: applicantList[currentSelectedApplicant].name,
        bureau: [
          (bureauData?.customer?.firstName ||
            '') + (" " + bureauData?.customer?.lastName ||
            ''),
        ],
      },
    });
    personalData.push({
      label: 'DOB',
      data: {
        appForm: formattedDate(linkedIndividual?.individual?.dob?.toString()),
        bureau: [formatDateForBureauDates(bureauData?.customer?.dob)],
      },
    });
    personalData.push({
      label: 'GENDER',
      data: {
        appForm:
          linkedIndividual?.individual?.gender &&
          genderMap[linkedIndividual.individual.gender as 'M' | 'F' | 'T'],
        bureau: [
          bureauData?.customer?.genderCode
            ? genderCodeMapExperian[bureauData?.customer?.genderCode as '1' | '2' | '3']
            : '',
        ],
      },
    });
    personalData.push({
      label: 'PAN',
      data: {
        appForm: (
          <Stack gap={3}>
            <Text size="sm" fs={'italic'}>
              {panCardDetails?.kycValue}
            </Text>
            <Text size="xs">
              Valid from {formattedDate(panCardDetails?.issueDate)} to{' '}
              {formattedDate(panCardDetails?.expiryDate)}
            </Text>
          </Stack>
        ),
        bureau: [bureauPan],
      },
    });
    personalData.push({
      label: 'PHONE',
      data: {
        appForm: contact?.value,
        bureau: [
          bureauData?.contact?.mobilePhone,
          bureauData?.contact?.telephone,
        ],
      },
    });
    personalData.push({
      label: 'ADDRESS',
      data: {
        appForm: getAddressLines(address),
        bureau: Object.entries(
          bureauData?.address as Record<string, Record<string, string>>,
        ).map(([key, value]) => {
          const stateCode = value?.State ? parseInt(value?.State) : 0;
          return getAddressLinesBureau({
            line1: value?.FlatNoPlotNoHouseNo,
            line2: value?.BldgNoSocietyName,
            line3: value?.RoadNoNameAreaLocality,
            line4: value?.Landmark,
            city: value?.City,
            state: isNaN(stateCode) ? value?.state : stateMappings[stateCode],
            pinCode: value?.PINCode,
          });
        }),
      },
    });
    personalData.push({
      label: 'EMAIL',
      data: {
        appForm: linkedIndividual?.contacts?.find((c) => c.type === 'email')
          ?.value,
        bureau: [bureauData?.emailId],
      },
    });
    personalData.push({
      label: 'EMPLOYMENT TYPE',
      data: {
        appForm: linkedIndividual?.individual?.employmentType || '-',
        bureau: [],
      },
    });
    personalData.push({
      label: 'ID TYPE',
      data: {
        appForm: '-',
        bureau: Object.keys(bureauData?.kyc || {})
          .filter((kycItem) => kycItem.toLowerCase() !== 'pan')
          .map((item) => {
            return (
              <Stack>
                <Text size="sm">{item}</Text>
                <Text>{bureauData?.kyc[item].id || '-'}</Text>
              </Stack>
            );
          }),
      },
    });

    return personalData;
  }, [bureauData, currentSelectedApplicant, appFormData, bureauName]);

  const ReportPullPendingComp = useMemo(() => {
    return (
      <Stack
        className="h-full w-4/5 rounded-lg"
        px={15}
        py={5}
        mt={20}
        ml={20}
        bg={'white'}
        justify={'center'}
        align={'center'}
        style={{
          minHeight: '400px',
          float: 'left',
          // marginTop: '-200px',
          // marginLeft: '220px',
          // position: 'relative',
        }}
      >
        <CustomIcon
          src="MaterialIcon"
          name="MdOutlinePendingActions"
          size={'50px'}
        />
        <Text size="lg">
          {bureauName} Report pull pending for{' '}
          {applicantList[currentSelectedApplicant].type} applicant{' '}
          {applicantList[currentSelectedApplicant].name}
        </Text>
      </Stack>
    );
  }, [bureauName, applicantList, currentSelectedApplicant]);

  const personalIdentificationDataTransformerForCibil = useMemo(() => {
    let personalData: TRowtype[] = [];

    if (!bureauData || bureauType !== 'ConsumerCibil') return personalData;
    let linkedIndividual = appFormData?.linkedIndividuals?.find(
      (individual) =>
        individual.id === applicantList[currentSelectedApplicant].id,
    );
    let panCardDetails = linkedIndividual?.kyc?.find(
        (kycItem) => kycItem.kycType === 'panCard',
      ),
      bureauPan = bureauData?.kyc?.find(
        (kycItem: TIdType) => kycItem.type == idTypeReverseMap.pan,
      );
    let contact = linkedIndividual?.contacts?.find((c) => c.type === 'phone'),
      bureauContact = bureauData?.contact;

    let address = linkedIndividual?.addresses?.find(
      (a) => a.type.toLowerCase() === 'curres',
    );

    const getAllNameProperties = (customerObj: Record<string, string>) =>
      Object.keys(customerObj).reduce((acc, key) => {
        if (key.toLowerCase().includes('name')) {
          return acc + ' ' + customerObj[key];
        } else return acc + '';
      }, '');

    const secondaryPanMatches =
      bureauData?.secondaryReport?.kyc
        ?.filter(
          (kycItem: Record<string, string>) =>
            kycItem.type == idTypeReverseMap.pan,
        )
        .map((panItem: TIdType, index: number) => (
          <Stack gap={0}>
            <Text c="primary" size="sm">
              Match {index + 1}
            </Text>
            <Text size="sm">{panItem.value}</Text>
          </Stack>
        )) || [];

    const secondaryContactMatches =
      bureauData?.secondaryReport?.contact?.map(
        (contactItem: TIdType, index: number) => (
          <Stack gap={0}>
            <Text c="primary" size="sm">
              Match {index + 1}
            </Text>
            <Text size="sm">
              {telephoneTypeMap[parseInt(contactItem?.type)]}
            </Text>
          </Stack>
        ),
      ) || [];

    const secondaryAddressMatches =
      bureauData?.secondaryReport?.address?.map(
        (addressItem: Record<string, string>, index: number) => (
          <Stack gap={4}>
            <Text c="primary" size="sm">
              Match {index + 1}
            </Text>
            <Text size="sm" style={{wordBreak:"break-word"}}>{getAddressLinesBureauData(addressItem)}</Text>
            <Text size="xs">
              {' '}
              {addressTypeMap[parseInt(addressItem?.category)]}
            </Text>
            <Text size="xs">
              {' '}
              Reported on{' '}
              <strong>
                {formatDateForBureauDatesDDMMYYYY(
                  (addressItem as TCibilAddress)?.dateReported,
                )}
              </strong>
            </Text>
          </Stack>
        ),
      ) || [];

    const secondaryEmailMatches =
      bureauData?.secondaryReport?.email?.map(
        (emailItem: string, index: number) => (
          <Stack gap={0}>
            <Text c="primary" size="sm">
              Match {index + 1}
            </Text>
            <Text size="sm">{emailItem}</Text>
          </Stack>
        ),
      ) || [];

    personalData.push({
      label: 'NAME',
      data: {
        appForm: applicantList[currentSelectedApplicant].name,
        bureau: [
          <Text size="sm">
            {bureauData?.customer
              ? getAllNameProperties(bureauData.customer)
              : ''}
          </Text>,
          bureauData?.secondaryReport && (
            <Stack>
              <Text size="sm" c="primary">
                Match 1
              </Text>
              <Text size="sm">
                {bureauData?.customer
                  ? getAllNameProperties(bureauData?.secondaryReport?.customer)
                  : ''}
              </Text>
            </Stack>
          ),
        ],
      },
    });
    personalData.push({
      label: 'DOB',
      data: {
        appForm: formattedDate(linkedIndividual?.individual?.dob?.toString()),
        bureau: [
          <Text size="sm">
            {formatDateForBureauDatesDDMMYYYY(bureauData?.customer?.dob)}
          </Text>,
          bureauData?.secondaryReport && (
            <Stack>
              <Text size="sm" c="primary">
                Match 1
              </Text>
              <Text size="sm">
                {formatDateForBureauDatesDDMMYYYY(
                  bureauData?.secondaryReport?.customer?.dob,
                )}
              </Text>
            </Stack>
          ),
        ],
      },
    });
    personalData.push({
      label: 'GENDER',
      data: {
        appForm:
          linkedIndividual?.individual?.gender &&
          genderMap[linkedIndividual.individual.gender as 'M' | 'F' | 'T'],
        bureau: [
          <Text>
            {genderCodeMapCibil[bureauData?.customer?.gender as '1' | '2' | '3'] ||
              genderMap[bureauData?.customer?.gender as 'M' | 'F' | 'T']}
          </Text>,
          bureauData?.customer?.gender && (
            <Stack gap={0}>
              <Text c="primary" size="sm">
                Match 1
              </Text>
              <Text size="sm">
                {genderCodeMapCibil[
                  bureauData?.secondaryReport?.customer?.gender as
                    | '1'
                    | '2'
                    | '3'
                ] ||
                  genderMap[
                    bureauData?.secondaryReport?.customer?.gender as
                      | 'M'
                      | 'F'
                      | 'T'
                  ]}
              </Text>
            </Stack>
          ),
        ],
      },
    });
    personalData.push({
      label: 'PAN',
      data: {
        appForm: (
          <Stack gap={3}>
            <Text size="sm" fs={'italic'}>
              {panCardDetails?.kycValue}
            </Text>
            <Text size="xs">
              Valid from {formattedDate(panCardDetails?.issueDate) || 'NA'} to{' '}
              {formattedDate(panCardDetails?.expiryDate) || 'NA'}
            </Text>
          </Stack>
        ),
        bureau: [<Text>{bureauPan?.value}</Text>, ...secondaryPanMatches],
      },
    });
    personalData.push({
      label: 'PHONE',
      data: {
        appForm: contact?.value,
        bureau: bureauContact
          ? [
              ...bureauContact?.map((item: TIdType) => (
                <Stack>
                  <Text size="sm">{item?.value}</Text>
                  <Text size="xs">
                    {telephoneTypeMap[parseInt(item?.type)]}
                  </Text>
                </Stack>
              )),
              ...secondaryContactMatches,
            ]
          : [],
      },
    });
    personalData.push({
      label: 'ADDRESS',
      data: {
        appForm: getAddressLines(address),
        bureau: bureauData?.address
          ? [
              ...bureauData?.address.map(
                (a: Record<string, string>, index: number) => (
                  <Stack>
                    <Text size="sm" style={{wordBreak:"break-word"}}>{getAddressLinesBureauData(a)}</Text>
                    <Text size="xs">
                      {' '}
                      {addressTypeMap[parseInt(a?.category)]}
                    </Text>
                    <Text size="xs">
                      {' '}
                      Reported on{' '}
                      <strong>
                        {formatDateForBureauDatesDDMMYYYY(
                          (a as TCibilAddress)?.dateReported,
                        )}
                      </strong>
                    </Text>
                  </Stack>
                ),
              ),
              ...secondaryAddressMatches,
            ]
          : [],
      },
    });
    personalData.push({
      label: 'EMAIL',
      data: {
        appForm: linkedIndividual?.contacts?.find((c) => c.type === 'email')
          ?.value,
        bureau: [
          ...(bureauData?.email
            ? bureauData?.email?.map((email: string) => (
                <Text size="sm" style={{wordBreak:"break-word"}}>{email}</Text>
              ))
            : []),
          ...secondaryEmailMatches,
        ],
      },
    });
    personalData.push({
      label: 'EMPLOYMENT TYPE',
      data: {
        appForm: linkedIndividual?.individual?.employmentType || '-',
        bureau: [
          <Stack>
            <Text size="xs">
              Occupation Type:{' '}
              {(bureauData?.employment &&
                occupationMap[parseInt(bureauData?.employment?.occupation)]) ||
                '-'}
            </Text>
            <Text size="xs">
              Account Type :{' '}
              {(bureauData?.employment &&
                loanTypeMapCibil[parseInt(bureauData?.employment.accountType)]) ||
                '-'}
            </Text>
            {/* <Text size="xs">
              INCOME -{' '}
              {(bureauData?.bureau['employment'] &&
                (bureauData?.bureau['employment']['income'] as string)) ||
                '-'}
            </Text> */}
            {/* <Text size="xs">
              NET/GROSS INCOME INDICATOR -{' '}
              {(grossIndicatorMap.hasOwnProperty(
                bureauData?.employment &&
                  (bureauData['employment'][
                    'netGrossIndicator'
                  ] as string),
              ) &&
                grossIndicatorMap[
                  bureauData?.bureau['employment'] &&
                    (bureauData?.bureau['employment']['netGrossIndicator'] as
                      | 'G'
                      | 'N')
                ]) ||
                '-'}
            </Text>
            <Text size="xs">
              MONTHLY/ANNUAL INCOME INDICATOR -{' '}
              {(monthlyAnualIndicatorMap.hasOwnProperty(
                bureauData?.bureau['employment'] &&
                  (bureauData?.bureau['employment'][
                    'monthlyAnnualIndicator'
                  ] as string),
              ) &&
                monthlyAnualIndicatorMap[
                  bureauData?.bureau['employment'] &&
                    (bureauData?.bureau['employment'][
                      'monthlyAnnualIndicator'
                    ] as 'A' | 'M')
                ]) ||
                '-'}
            </Text> */}
            <Text size="xs">
              REPORTED ON{' '}
              <strong>
                {(bureauData?.['employment'] &&
                  formatDateForBureauDatesDDMMYYYY(
                    bureauData?.['employment']['date'] as string,
                  )) ||
                  '-'}
              </strong>
            </Text>
          </Stack>,
        ],
      },
    });
    personalData.push({
      label: 'ID TYPE',
      data: {
        appForm: '-',
        bureau: bureauData?.kyc
          ?.filter((item: TIdType) => item.type !== idTypeReverseMap.pan)
          .map((item: TIdType) => (
            <Stack gap="sm">
              <Text size="sm">{item.value}</Text>
              <Text size="xs">{idTypeMap[parseInt(item.type)]}</Text>
            </Stack>
          )),
      },
    });
    return personalData;
  }, [bureauData, currentSelectedApplicant, appFormData]);

  // experian report -> https://jarvis.int.creditsaison.corp/application/afdd21d0-a44f-4817-9061-d206f2589589/bureau
  // experian report ->  https://jarvis.uat.creditsaison.corp/application/ca99dce5-3d61-4d45-a394-0655d65eefc1/bureau

  // experian report with secondary matches -> 8983f0bd-e430-4383-b32f-4f69b2759e48 (INT)
  //prod report mock -> f189bbcd-9d31-490e-8a29-aceec04eb88d/bureau
  ///application/3a61d274-76bc-4331-a29c-0106cb9e39ea/bureau (INT)

  const PulledDate = useMemo(() => {
    return (
      <Flex direction={'row'} px={12} pb={6}>
        {bureauType === 'ConsumerCibil'
          ? bureauData?.header.dateProcessed &&
            bureauData?.header.timeProcessed && (
              <Text size="xs" c="dimmed">
                Pulled on <br></br>
                <strong>
                  {' '}
                  {(bureauData?.header.dateProcessed &&
                    parseDDMMYYYYCompactDateString(
                      bureauData?.header?.dateProcessed as string,
                    )) ||
                    '-'}
                  ,{' '}
                  {(bureauData?.header.timeProcessed &&
                    `${bureauData?.header?.timeProcessed.substring(0, 2)}:
                ${bureauData?.header?.timeProcessed.substring(2, 4)}:
                ${bureauData?.header?.timeProcessed.substring(4)}`) ||
                    ''}
                </strong>
              </Text>
            )
          : bureauData?.header?.ReportDate &&
            bureauData?.header?.ReportTime && (
              <Text size="xs" c="dimmed">
                Pulled on <br></br>
                <strong>
                  {' '}
                  {(bureauData?.header.ReportDate &&
                    formatDateForBureauDates(
                      bureauData?.header?.ReportDate as string,
                    )) ||
                    '-'}
                  ,{' '}
                  {(bureauData?.header?.ReportTime &&
                    `${bureauData?.header?.ReportTime.substring(0, 2)}:
                ${bureauData?.header?.ReportTime.substring(2, 4)}:
                ${bureauData?.header?.ReportTime.substring(4)}`) ||
                    ''}
                </strong>
              </Text>
            )}
      </Flex>
    );
  }, [bureauData, bureauType]);

  const PiRows = useCallback(() => {
    let dataTobeMapped =
      bureauName.toLowerCase() === 'experian'
        ? personalIdentificationDataTransformerForExperian
        : personalIdentificationDataTransformerForCibil;
    return (
      <>
        {dataTobeMapped?.length > 0 && (
          <Stack
            className="w-4/5 rounded-lg"
            ml={20}
            mt={20}
            style={{
              float: 'left',
              display: 'inline-flex',
            }}
          >
            <Title order={4}>{currentView}</Title>
            <Stack
              bg={'white'}
              justify={'flex-start'}
              pl={15}
              py={15}
              align={'flex-start'}
              className="rounded-md"
            >
              {dataTobeMapped?.map((row, index) => (
                <PIDataRows row={row} key={'pidatarow' + bureauName + index} />
              ))}
            </Stack>
          </Stack>
        )}
      </>
    );
  }, [
    bureauName,
    personalIdentificationDataTransformerForExperian,
    personalIdentificationDataTransformerForCibil,
    currentSelectedApplicant,
  ]);

  return (
    <React.Fragment>
      <Stack
        className="w-1/6"
        ml={8}
        h={'50vh'}
        py={8}
        px={4}
        bg={'white'}
        p={15}
        gap={0}
        style={{
          position: 'sticky',
          top: '7rem',
          float: 'left',
          // overflowY:'overlay',
          height: 'fit-content',
          marginTop: '1rem',
          zIndex: 100,
          borderRadius: '8px',
        }}
      >
        <BureauSelectDropdown
          bureauOptions={bureauOptions}
          bureauName={bureauName}
          setBureauName={setBureauName}
        />
        {PulledDate}
        <List spacing="xs" size="sm" center px={10}>
          {applicantList?.map((applicant, index) => (
            <List.Item
              p={6}
              key={`${applicant}${index}`}
              styles={{
                item: {
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor:
                    index === currentSelectedApplicant
                      ? theme.colors.primary[0]
                      : 'white',
                },
              }}
              icon={
                <ThemeIcon color="teal" size={24} radius="xl">
                  <AppAvatar
                    size={'sm'}
                    radius={'sm'}
                    name={''}
                    color={iconColors[0]}
                  >
                    {applicant.iconText}
                  </AppAvatar>
                </ThemeIcon>
              }
              onClick={() => setCurrentSelectedApplicant(index)}
            >
              <Flex>
                <Stack gap={0}>
                  <Text size="xs">{applicant.name}</Text>
                  <Text size="xs" fs="italic" c="neutral.4">
                    {' '}
                    {applicant.type}
                  </Text>
                </Stack>
              </Flex>
            </List.Item>
          ))}
        </List>
      </Stack>

      {bureauDataIsfetching ? (
        !isSmeDirect(appFormData?.loanProduct || '') ? (
          <Stack
            className="h-4/5 rounded-lg"
            w={"75%"}
            px={15}
            py={10}
            mt={20}
            mr={35}
            bg={'white'}
            justify={'start'}
            align={'center'}
            style={{
              float: 'right',
            }}
          >
            <CustomSkeletonLayout />
          </Stack>
        ) : (
          <Center mt={100}>
            <Loader color="primary" />
          </Center>
        )
      ) : (isSmeDirect(appFormData?.loanProduct || lpc || '') || bureauUploadShowCondition ) ? (
        <UploadBureauDoc
          appFormId={appFormId}
          applicantId={applicantList[currentSelectedApplicant].id.toString()}
          bureau={bureauType}
          bureauFiles={bureauReportFiles}
          appFormStage={appFormData?.stage}
          appStatus={appFormData?.status}
        />
      ) : bureauData ? (
        currentView === 'Personal Identification' ? (
          PiRows()
        ) : bureauName.toLowerCase().includes('experian') ? (
          <CreditReportExperian
            // styles={styles}
            appFormId={appFormId}
            lpc={appFormData?.loanProduct || ''}
            bureauData={bureauData}
          />
        ) : (
          <CreditReportCibil
            // styles={styles}
            appFormId={appFormId}
            lpc={appFormData?.loanProduct || ''}
            bureauData={bureauData}
          />
        )
      ) : (
        ReportPullPendingComp
      )}

      {bureauData && (
        <Affix position={{ bottom: 50, right: 50 }}>
          <div ref={wrapperRef} style={{ position: 'relative' }}>
            <Transition
              mounted={opened}
              transition="pop"
              duration={150}
              timingFunction="ease"
            >
              {(styles) => (
                <Paper
                  style={{
                    ...styles,
                    position: 'absolute',
                    bottom: 60,
                    right: 0,
                    zIndex: 10,
                  }}
                  shadow="md"
                  p="sm"
                  withBorder
                >
                  <Stack gap="xs" className="w=96">
                    {views.map((view) => (
                      <Button
                        key={view.key}
                        variant={
                          currentView.toLowerCase().includes(view.key)
                            ? 'light'
                            : 'transparent'
                        }
                        color="primary"
                        size="xs"
                        w="100%"
                        onClick={() => setCurrentView(view.label)}
                      >
                        {view.label}
                      </Button>
                    ))}
                  </Stack>
                </Paper>
              )}
            </Transition>

            <ActionIcon
              color="primary"
              ref={buttonRef}
              size="60px"
              radius="xl"
              variant="filled"
              onClick={() => setOpened((o) => !o)}
              mt={10}
            >
              {opened ? (
                <CustomIcon
                  src="MaterialIcon"
                  name="MdOutlineClear"
                  size="25px"
                />
              ) : (
                <CustomIcon
                  src="MaterialIcon"
                  name="MdOutlineVisibility"
                  size="25px"
                />
              )}
            </ActionIcon>
          </div>
        </Affix>
      )}
    </React.Fragment>
  );
};

export default BureauView;
