'use client';
import {
  Flex,
  Tabs,
  Title,
  Stack,
  SimpleGrid,
  Text,
  Space,
  useMantineTheme,
  ComboboxItem,
} from '@mantine/core';
import React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TitleCard } from '@/components/common/TitleCard';
import { appFormRawData } from '@/store/modules/appform';
import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { TFields } from '@/components/common/TitleCard';
import {
  currencyValidation,
  dateObjToStr,
  formattedDate,
  getAddressLines,
} from '@/components/appFormLayout/appFormHelpers';
import CustomChip from '../common/CustomChip';
import { AppAvatar } from '../common/AppAvatar';
import iconColors from '../icons/iconColors';
import { getAppFormApplicantList } from '@/store/modules/appform';
import CustomIcon from '@/components/icons/CustomIcons';

import classes from './AppForm.module.css';
import { isSamastaLoan } from '@/lib/rules/commonRules';
import ApplicationDetailHeader from './ApplicationDetailHeader';
import {
  TAppFormChangeSet,
  TAppformData,
  TAppFormEditData,
  TCkycValidationMode,
} from '@/lib/queries/shield/queryResponseTypes';
import { EditModal, TEditModalInput } from './EditModal';
import { useDisclosure } from '@mantine/hooks';
import { useAppFormPatch } from '@/lib/queries';
import { useNotification } from '@/lib/context/notifications/useNotifications';
import { useLoader } from '@/lib/context/loaders/useLoader';
import { user } from '@/store/atoms';
import { useQueryClient } from '@tanstack/react-query';
import {
  getAppFormDataQKey,
  getAppFormHistoryQKey,
} from '@/lib/queries/queryKeys';
import EditHistory from '@/components/appForm/EditHistory';
import { UsersResponse } from '@/lib/queries/heimdall/queryResponseTypes';
import { genderMap, messageRegex } from './AppFormView';
import HttpClientException from '@/lib/exceptions/HttpClientException';

let editRequests: TAppFormEditData[] = [];

const genderSelectOptions: ComboboxItem[] = [
  {
    value: 'M',
    label: 'Male',
  },
  { value: 'F', label: 'Female' },
  { value: 'T', label: 'Transgender' },
];

const maritalStatusesMap = {
  D: 'Divorced',
  M: 'Married',
  O: 'Other',
  S: 'Single',
  W: 'Widowed',
  NA: 'NA'
}

export const AppForm = ({
  appFormId,
  appFormHistory,
}: {
  appFormId: string | undefined;
  appFormHistory: TAppFormChangeSet[] | undefined;
}) => {
  const appFormDataAtom = useAtomValue(appFormRawData);

  const [appFormData, setAppFormData] = useState<TAppformData | null>();
  const [opened, { open, close }] = useDisclosure(false);
  const [
    historyModalOpened,
    { open: openHistoryModal, close: closeHistoryModal },
  ] = useDisclosure(false);

  const { start, stop } = useLoader();

  const applicantList = useAtomValue(getAppFormApplicantList);
  const [currentIndividualIndex, setCurrentIndividualIndex] = useState(0);
  const [editMode, setEditMode] = useState(false);
  const [keyValMap, setKeyValMap] = useState<Record<string, any> | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>('profile');
  const [modalContent, setModalContent] = useState<TEditModalInput[]>();
  const [selectedAddress, setSelectedAddress] = useState<string>();
  const userData = useAtomValue(user);

  const ckycRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const financialsRef = useRef<HTMLDivElement>(null);
  const bankAccsRef = useRef(null);
  const accValidationsRef = useRef(null);
  const theme = useMantineTheme();

  const ckycModeFiler = (mode: string | undefined) => {
    switch (mode) {
      case 'rmn':
        return 'Mobile No.'
        break;
      case 'bankaccount':
        return 'Bank Account'
        break;
      default:
        return '-'
        break;
    }
  }

  const { notify } = useNotification();
  const queryClient = useQueryClient();

  const setkeyValueMap = () => {
    let keyValMap: Record<string, any> = {};

    keyValMap['firstName'] =
      appFormData?.linkedIndividuals[currentIndividualIndex]?.individual
        ?.firstName || '';
    keyValMap['middleName'] =
      appFormData?.linkedIndividuals[currentIndividualIndex]?.individual
        ?.middleName || '';
    keyValMap['lastName'] =
      appFormData?.linkedIndividuals[currentIndividualIndex]?.individual
        ?.lastName || '';

    keyValMap['gender'] =
      appFormData?.linkedIndividuals[
        currentIndividualIndex
      ]?.individual?.gender;

    keyValMap['dob'] =
      appFormData?.linkedIndividuals[currentIndividualIndex]?.individual?.dob;
    keyValMap['fatherName'] =
      appFormData?.linkedIndividuals[
        currentIndividualIndex
      ]?.individual?.fatherName;
    keyValMap['currentAddress'] = appFormData?.linkedIndividuals[
      currentIndividualIndex
    ]?.addresses.find((address) => address.type.toLowerCase() === 'curres');
    keyValMap['permanentAddress'] = appFormData?.linkedIndividuals[
      currentIndividualIndex
    ]?.addresses.find((address) => address.type.toLowerCase() === 'per');

    keyValMap['amount'] = appFormData?.loan?.amount;
    keyValMap['fundingAllocation'] = appFormData?.loan?.fundingAllocation;
    keyValMap['roi'] = appFormData?.loan?.loanIntRate;
    keyValMap['overAllLoanAmount'] = appFormData?.loan?.overAllLoanAmount;
    keyValMap['tenure'] = appFormData?.loan?.tenure;
    keyValMap['loanStartDate'] = appFormData?.loan?.loanStartDate;
    keyValMap['creditLimit'] = appFormData?.creditLine?.creditLimit;

    setKeyValMap(keyValMap);
  };

  const marriedStatus = (status: string | undefined): string => {
    if (status == undefined) return "";
    return maritalStatusesMap[status as keyof typeof maritalStatusesMap] || status;

  }

  useEffect(() => {
    setkeyValueMap();
    if (appFormData?.ckycValidationMode) {
      setActiveSection('ckyc')
    }
  }, [appFormData, currentIndividualIndex]);

  useEffect(() => {
    setAppFormData(JSON.parse(JSON.stringify(appFormDataAtom)));
  }, [appFormDataAtom]);

  const setModalContentAndShow = (field: TFields) => {
    if (['currentAddress', 'permanentAddress'].includes(field.key || '')) {
      setSelectedAddress(field.key);
      if (field?.editData)
        setModalContent(
          Object.entries(field?.editData).map(([key, value]) => ({
            label: key,
            value: value,
            key: key,
            type: ['line1', 'line2'].includes(key) ? 'textarea' : 'text',
            misc: { resourcePath: field?.resourcePath },
          })),
        );
    } else if (field.key === 'fullName') {
      if (field?.editData)
        setModalContent(
          Object.entries(field?.editData).map(([key, value]) => ({
            label: key,
            value: value,
            key: key,
            type: 'text',
            misc: { resourcePath: field?.resourcePath },
          })),
        );
    } else
      setModalContent([
        {
          label: field.label,
          value: field.value,
          key: field?.key || '',
          type: ['dob', 'loanStartDate'].includes(field?.key || '')
            ? 'date'
            : field?.key === 'gender'
              ? 'select'
              : 'text',
          misc: {
            resourcePath: field?.resourcePath,
            options: genderSelectOptions,
          },
        },
      ]);
    open();
  };

  const saveModalData = (modalData: TEditModalInput[] | undefined) => {
    let mapTemp = { ...keyValMap };
    if (modalData) {
      {
        if (modalData.some((item) => item.key === 'pinCode')) {
          modalData.forEach((item) => {
            if (selectedAddress && mapTemp[selectedAddress]) {
              if (mapTemp[selectedAddress][item.key] !== item.value) {
                mapTemp[selectedAddress][item.key] = item.value;
                let existingDataIndex = editRequests.findIndex(
                  (d) => d.resourcePath === item.misc.resourcePath,
                );
                let newData = { [item.key]: item.value };
                if (item.misc.resourcePath) {
                  if (existingDataIndex >= 0)
                    editRequests[existingDataIndex].editData = {
                      ...editRequests[existingDataIndex].editData,
                      ...newData,
                    };
                  else
                    editRequests.push({
                      resourcePath: item.misc?.resourcePath,
                      editData: newData,
                    });
                }
              }
            }
          });
        } else {
          modalData.forEach((item) => {
            if (mapTemp?.hasOwnProperty(item.key)) {
              if (mapTemp[item.key] !== item.value) {
                mapTemp[item.key] = item.value;
                let existingDataIndex = editRequests.findIndex(
                  (d) => d.resourcePath === item.misc.resourcePath,
                );
                let newData = { [item.key]: item.value };
                if (item.type === 'date') {
                  newData = {
                    [item.key]: item.value,
                  };
                }
                if (item.misc.resourcePath) {
                  if (existingDataIndex >= 0)
                    editRequests[existingDataIndex].editData = {
                      ...editRequests[existingDataIndex].editData,
                      ...newData,
                    };
                  else
                    editRequests.push({
                      resourcePath: item.misc?.resourcePath,
                      editData: newData,
                    });
                }
              }
            }
          });
        }
      }
    }
    setKeyValMap(mapTemp);
    close();
  };

  const revertAllChanges = () => {
    setAppFormData(appFormDataAtom);
    editRequests = [];
    setEditMode(false);
  };

  const onAppFormPatchError = (error: HttpClientException) => {
    stop();
    console.log(error.message);
    const errResp: any = error.getErrorResp();
    const match = messageRegex.exec(error.message);
    notify({
      message: match ? (
        <Text>{match[1]}</Text>
      ) : (
        <Stack gap={2}>
          <Text size="xs">{error.message}</Text>
          {errResp?.fieldErrors?.map((err: Record<string, string>) => (
            <Text size="xs" fw="bold">
              {err.message}
            </Text>
          ))}
        </Stack>
      ),
      type: 'error',
      autoClose: 6000,
    });
  };

  const onAppFormPatchSuccess = (data: TAppformData) => {
    queryClient.invalidateQueries({
      queryKey: getAppFormDataQKey(appFormId),
    });
    stop();
    setEditMode(false);
    editRequests = [];
    notify({ message: 'AppForm updated!', type: 'success' });
  };
  const appFormPatch = useAppFormPatch(
    onAppFormPatchError,
    onAppFormPatchSuccess,
    { requestingSub: userData?.sub || '' },
  );
  const saveAppForm = () => {
    // console.log({ editRequest: editRequests });
    if (editRequests.length === 0) {
      notify({ message: 'No changes found!', type: 'error' });
      return;
    }
    start();
    if (appFormData?.id)
      appFormPatch.mutate({
        appFormId: appFormData?.id,
        checkAppFormStatus: true,
        reRunCpcChecks: true,
        validationRequired: true,
        reqData: { editRequests },
      });
  };

  const basicInfoCkyc = useMemo(() => {
    let fields: TFields[] = [];
    let ckycValidationMode =
      appFormData?.ckycValidationMode;

    fields.push({
      label: 'NAME MATCH',
      value: ckycValidationMode?.stmtName,
      isEditable: false,
    });
    fields.push({
      label: 'VALIDATION MODE',
      value: ckycModeFiler(ckycValidationMode?.mode),
      isEditable: false,
    });

    fields.push({
      label: 'DOWNLOAD AUTHENTICATION',
      value: '-',
      isEditable: false,
    });

    return fields;
  }, [appFormData, currentIndividualIndex, keyValMap]);

  const basicInfo = useMemo(() => {
    let fields: TFields[] = [];
    let linkedIndividual =
      appFormData?.linkedIndividuals[currentIndividualIndex];

    fields.push({
      label: 'DOB',
      key: 'dob',
      formattedValue: formattedDate(keyValMap?.dob?.toString()),
      value: formattedDate(keyValMap?.dob?.toString()),
      isEditable: true,
      resourcePath: `linkedIndividuals/[id=${linkedIndividual?.id}]/individual`,
      editData: {
        dob: keyValMap?.dob,
      },
    });
    fields.push({
      label: 'EMPLOYMENT',
      value: linkedIndividual?.individual?.employmentType,
      isEditable: false,
    });
    fields.push({
      label: 'MARITAL STATUS',
      value: marriedStatus(linkedIndividual?.individual?.maritalStatus),
      isEditable: false,
    });
    fields.push({
      label: "FATHER'S NAME",
      key: 'fatherName',
      value: keyValMap?.fatherName,
      isEditable: true,
      resourcePath: `linkedIndividuals/[id=${linkedIndividual?.id}]/individual`,
      editData: {
        fatherName: keyValMap?.fatherName,
      },
    });
    fields.push({
      label: 'PAN NO',
      value: linkedIndividual?.kyc.find(
        (i) => i.kycType.toLowerCase() === 'pancard',
      )?.kycValue,
      isEditable: false,
    });
    fields.push({
      label: 'VOTER ID NO.',
      value: linkedIndividual?.kyc.find(
        (i) => i.kycType.toLowerCase() === 'voterid',
      )?.kycValue,
      isEditable: false,
    });
    fields.push({
      label: 'DL NO.',
      value: linkedIndividual?.kyc.find(
        (i) => i.kycType.toLowerCase() === 'drivinglicense',
      )?.kycValue,
      isEditable: false,
    });
    return fields;
  }, [appFormData, currentIndividualIndex, keyValMap]);

  const communication = useMemo(() => {
    let fields: TFields[] = [];
    let linkedIndividual =
      appFormData?.linkedIndividuals[currentIndividualIndex];
    let currAddress = linkedIndividual?.addresses.find(
      (address) => address.type.toLowerCase() === 'curres',
    );
    let perAddress = linkedIndividual?.addresses.find(
      (address) => address.type.toLowerCase() === 'per',
    );
    fields.push({
      label: 'EMAIL',
      value: linkedIndividual?.contacts.find(
        (contact) => contact.type === 'email',
      )?.value,
      isEditable: false,
    });
    fields.push({
      label: 'CONTACT NO',
      value: linkedIndividual?.contacts?.find(
        (contact) => contact.type === 'phone',
      )?.value,
      isEditable: false,
    });
    if (keyValMap?.currentAddress) {
      fields.push({
        label: 'CURRENT ADDRESS',
        value: keyValMap && getAddressLines(keyValMap['currentAddress']),
        isEditable: true,
        resourcePath: `linkedIndividuals/[id=${linkedIndividual?.id}]/addresses/[id=${currAddress?.id}]`,
        key: 'currentAddress',
        editData: {
          line1: keyValMap?.currentAddress?.line1,
          line2: keyValMap?.currentAddress?.line2,
          city: keyValMap?.currentAddress?.city,
          state: keyValMap?.currentAddress?.state,
          pinCode: keyValMap?.currentAddress?.pinCode,
        },
      });
    } else {
      fields.push({
        label: 'CURRENT ADDRESS',
        key: 'permanentAddress',
        resourcePath: `linkedIndividuals/[id=${linkedIndividual?.id}]/addresses/[id=${perAddress?.id}]`,
        value: keyValMap && getAddressLines(keyValMap['permanentAddress']),
        editData: {
          line1: keyValMap?.permanentAddress?.line1,
          line2: keyValMap?.permanentAddress?.line2,
          city: keyValMap?.permanentAddress?.city,
          state: keyValMap?.permanentAddress?.state,
          pinCode: keyValMap?.permanentAddress?.pinCode,
        },
        isEditable: true,
      });
    }

    fields.push({
      label: 'PERMANENT ADDRESSS',
      key: 'permanentAddress',
      resourcePath: `linkedIndividuals/[id=${linkedIndividual?.id}]/addresses/[id=${perAddress?.id}]`,
      value: keyValMap && getAddressLines(keyValMap['permanentAddress']),
      editData: {
        line1: keyValMap?.permanentAddress?.line1,
        line2: keyValMap?.permanentAddress?.line2,
        city: keyValMap?.permanentAddress?.city,
        state: keyValMap?.permanentAddress?.state,
        pinCode: keyValMap?.permanentAddress?.pinCode,
      },
      isEditable: true,
    });
    return fields;
  }, [appFormData, currentIndividualIndex, keyValMap]);

  const loanRequest = useMemo(() => {
    console.log('keyValMap')
    console.log(keyValMap)
    let fields: TFields[] = [];
    let loan = appFormData?.loan;
    fields.push({
      label: 'LOAN AMT ₹',
      value: keyValMap?.amount || '-',
      isEditable: true,
      key: 'amount',
      resourcePath: 'loan',
      editData: { amount: keyValMap?.amount },
    });
    fields.push({
      label: 'ALLOCATED AMT ₹',
      value:
        keyValMap?.amount && keyValMap?.fundingAllocation
          ? `${currencyValidation(
            (keyValMap.amount * keyValMap.fundingAllocation).toFixed(2)
          )}`
          : '-',
      isEditable: false,
      key: 'fundingAllocation',
      resourcePath: 'loan',
      editData: {
        fundingAllocation: keyValMap?.fundingAllocation,
      },
    },);
    fields.push({
      label: 'TENURE(MONTHS)',
      value: keyValMap?.tenure || '-',
      isEditable: true,
      key: 'tenure',
      resourcePath: 'loan',
      editData: { amount: keyValMap?.tenure },
    });
    fields.push({
      label: 'ROI',
      value: keyValMap?.roi,
      isEditable: true,
      key: 'roi',
      resourcePath: 'loan',
      editData: { amount: keyValMap?.roi },
    });
    fields.push({
      label: 'PROCESSING FEE ₹',
      value: loan?.processingFee,
      isEditable: false,
    });
    fields.push({
      label: 'BPI TREATMENT',
      value: Boolean(loan?.alwBpiTreatment)?.toString(),
      isEditable: false,
    });
    fields.push({
      label: 'OVERALL LOAN AMT ₹',
      value: keyValMap?.overAllLoanAmount,
      isEditable: true,
      key: 'overAllLoanAmount',
      resourcePath: 'loan',
      editData: { amount: keyValMap?.overAllLoanAmount },
    });
    fields.push({
      label: 'LOAN START DATE',
      value: formattedDate(keyValMap?.loanStartDate?.toString()),
      isEditable: true,
      key: 'loanStartDate',
      resourcePath: 'loan',
      editData: { amount: keyValMap?.loanStartDate },
    });
    if (keyValMap?.creditLimit) {
      fields.push({
        label: 'CREDIT LIMIT ₹',
        value: currencyValidation(keyValMap?.creditLimit),
        isEditable: true,
        resourcePath: 'creditLine'
      });
    }
    if (keyValMap?.creditLimit) {
      fields.push({
        label: 'START DATE OF CL',
        value: currencyValidation(keyValMap?.creditLimit),
        isEditable: true,
        resourcePath: 'creditLine'
      });
    }
    if (keyValMap?.creditLimit) {
      fields.push({
        label: 'EXPIRY DATE OF CL',
        value: currencyValidation(keyValMap?.creditLimit),
        isEditable: true,
        resourcePath: 'creditLine'
      });
    }

    return fields;
  }, [appFormData, keyValMap]);

  const obligations = useMemo(() => {
    let fields: TFields[] = [];
    let misc = appFormData?.miscData;
    fields.push({
      label: 'ANNUAL INCOME ₹',
      value: currencyValidation(misc?.income),
      isEditable: false,
    });
    fields.push({
      label: 'LOANS OUTSTANDING',
      value: misc?.activeLoans || '-',
      isEditable: false,
    });
    fields.push({
      label: 'EMI OBLIGATION ₹',
      value: misc?.emi || '-',
      isEditable: false,
    });
    fields.push({
      label: 'TOTAL DEBT ₹',
      value: misc?.debt || '-',
      isEditable: false,
    });
    return fields;
  }, [appFormData]);

  const applicantAccount = useCallback(
    (accountIndex: number) => {
      let fields: TFields[] = [];
      let applicantBankDetails =
        appFormData?.linkedIndividuals[currentIndividualIndex].bankAccounts[
        accountIndex
        ];
      fields.push({
        label: 'BANK NAME',
        value: applicantBankDetails?.bankName,
        isEditable: false,
      });
      fields.push({
        label: 'A/C TYPE',
        value: applicantBankDetails?.type,
        isEditable: false,
      });
      fields.push({
        label: 'A/C NO.',
        value: applicantBankDetails?.accountNumber,
        isEditable: false,
      });
      fields.push({
        label: 'ACCOUNT HOLDER NAME',
        value: applicantBankDetails?.holderName,
        isEditable: false,
      });
      fields.push({
        label: 'IFSC CODE',
        value: applicantBankDetails?.ifscCode,
        isEditable: false,
      });
      return fields;
    },
    [appFormData, currentIndividualIndex],
  );

  const pennyTesting = useMemo(() => {
    const pennyTestingObj = appFormData?.pennyTesting;
    let fields: TFields[] = [];
    fields.push({
      label: 'BANK NAME',
      value: pennyTestingObj?.bankName,
      isEditable: false,
    });
    fields.push({
      label: 'DISB. ACCOUNT NO.',
      value: pennyTestingObj?.accountNumber,
      isEditable: false,
    });
    return fields;
  }, [appFormData]);

  const mandate = useMemo(() => {
    const mandateObj = appFormData?.mandate;
    let fields: TFields[] = [];
    fields.push({
      label: 'BANK NAME',
      value: mandateObj?.bankName,
      isEditable: false,
    });
    fields.push({
      label: 'DISB. ACCOUNT NO.',
      value: mandateObj?.accountNumber,
      isEditable: false,
    });
    return fields;
  }, [appFormData]);

  const getHeaderForBasicInfo = useMemo(() => {
    return (
      <Flex direction={'row'} p={4} justify={'flex-start'}>
        <Stack gap={0}>
          <Flex align={'center'} justify={'flex-start'} gap={5}>
            <Title order={5}>
              {keyValMap && keyValMap['firstName']}{' '}
              {keyValMap && keyValMap['middleName']}{' '}
              {keyValMap && keyValMap['lastName']}
            </Title>
            {editMode && (
              <CustomIcon
                src="MaterialIcon"
                name="MdOutlineModeEdit"
                size={'12px'}
                color={theme.colors.neutral[4]}
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  setModalContentAndShow({
                    label: 'Name',
                    key: 'fullName',
                    value: '',
                    isEditable: true,
                    resourcePath: `linkedIndividuals/[id=${appFormData?.linkedIndividuals[currentIndividualIndex]?.id}]/individual`,
                    editData: {
                      firstName: keyValMap && keyValMap['firstName'],
                      middleName: keyValMap && keyValMap['middleName'],
                      lastName: keyValMap && keyValMap['lastName'],
                    },
                  })
                }
              />
            )}
          </Flex>
          <Flex align={'center'} justify={'flex-start'} gap={5}>
            <Text size="xs">
              {keyValMap?.gender
                ? genderMap[keyValMap?.gender as 'M' | 'F' | 'T']
                : '-'}
            </Text>
            {editMode && (
              <CustomIcon
                src="MaterialIcon"
                name="MdOutlineModeEdit"
                size={'12px'}
                color={theme.colors.neutral[4]}
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  setModalContentAndShow({
                    label: 'Gender',
                    key: 'gender',
                    value: keyValMap?.gender,
                    isEditable: true,
                    resourcePath: `linkedIndividuals/[id=${appFormData?.linkedIndividuals[currentIndividualIndex]?.id}]/individual`,
                  })
                }
              />
            )}
          </Flex>
        </Stack>
      </Flex>
    );
  }, [appFormData, currentIndividualIndex, keyValMap, editMode]);

  const getBadgeColor = useCallback(function (status: string | undefined) {
    if (!status) return 'primary';
    switch (status.toLowerCase()) {
      case 'success':
        return 'brandGreen';
      case 'failed':
        return 'error';
      case 'pending':
        return 'error.6';
      default:
        return 'primary';
    }
  }, []);

  const getPennyTestingHeader = useCallback(() => {
    return (
      <Flex
        direction={'row'}
        p={4}
        justify={'space-between'}
        className="w-full"
      >
        <Stack gap={0}>
          <Title order={5}>
            {(['NON_FLDG', 'COLENDING'].includes(appFormData?.flowType || '') &&
              appFormData?.pennyTesting?.holderName) ||
              ''}
          </Title>
          <Text size="xs">{appFormData?.pennyTesting?.registeredName}</Text>
          <Text size="xs">Payee</Text>
        </Stack>

        <CustomChip
          customProps={{
            variant: 'light',
            color: getBadgeColor(appFormData?.pennyTesting?.status),
            value: appFormData?.pennyTesting?.status,
          }}
        />
      </Flex>
    );
  }, [appFormData]);

  const getMandateHeader = useCallback(() => {
    return (
      <Flex
        direction={'row'}
        p={4}
        justify={'space-between'}
        className="w-full"
      >
        <Stack gap={0}>
          <Title order={5}>
            {(['NON_FLDG', 'COLENDING'].includes(appFormData?.flowType || '') &&
              appFormData?.mandate?.holderName) ||
              ''}
          </Title>
          <Text size="xs">Payee</Text>
        </Stack>

        <CustomChip
          customProps={{
            variant: 'light',
            color: getBadgeColor(appFormData?.mandate?.status),
            value: appFormData?.mandate?.status,
          }}
        />
      </Flex>
    );
  }, [appFormData]);

  const tabChange = (tabValue: string | null) => {
    setActiveSection(tabValue);
    const scrollBehaviour: ScrollIntoViewOptions = {
      behavior: 'smooth',
      block: 'start',
    };
    let refCopy = null;
    switch (tabValue) {
      case 'ckyc':
        refCopy = ckycRef;
        break;
      case 'profile':
        refCopy = profileRef;
        break;
      case 'financials':
        refCopy = financialsRef;
        break;
      case 'bankAccounts':
        refCopy = bankAccsRef;
        break;
      case 'accountValidations':
        refCopy = accValidationsRef;
        break;
    }
    refCopy?.current?.scrollIntoView(scrollBehaviour as ScrollIntoViewOptions);
  };

  const viewHistory = () => {
    queryClient.invalidateQueries({
      queryKey: getAppFormHistoryQKey(appFormId),
    });
    openHistoryModal();
  };

  //TODO: revisit css here for scroll
  return (
    <React.Fragment>
      <Stack
        pl={20}
        style={{
          display: 'inline-flex',
          position: 'sticky',
          top: '7rem',
          overflow: 'hidden',
          height: 'fit-content',
          marginTop: '1rem',
          float: 'left',
          zIndex: 100,
          width: "15%"
        }}
      >
        {applicantList.map((applicant, index) => (
          <React.Fragment key={'applicant' + index}>
            <Flex
              key={'applicant' + index}
              justify={'flex-start'}
              align={'center'}
              className={classes.buttonFlex}
              onClick={() => setCurrentIndividualIndex(index)}
              style={{
                cursor: 'pointer',
                borderRadius: '8px',
              }}
              p={5}
              gap={12}
              styles={{
                root: {
                  backgroundColor:
                    index === currentIndividualIndex
                      ? theme.colors.primary[0]
                      : 'white',
                },
              }}
            >
              <AppAvatar
                size={'md'}
                radius={'sm'}
                name={''}
                color={iconColors[index]}
              >
                {applicant.iconText}
              </AppAvatar>

              <Stack gap={0}>
                <Text size="xs">{applicant.name}</Text>
                <Text size="xs" fs="italic" c="neutral.6">
                  {' '}
                  {applicant.type}
                </Text>
              </Stack>
            </Flex>
            {index === currentIndividualIndex && (
              <Tabs
                orientation="vertical"
                placement="left"
                value={activeSection}
                onChange={(tab) => tabChange(tab)}
              >
                <Tabs.List>
                  {appFormData?.ckycValidationMode && (
                    <Tabs.Tab value="ckyc">CKYC</Tabs.Tab>
                  )}
                  <Tabs.Tab value="profile">Profile</Tabs.Tab>
                  <Tabs.Tab value="financials">Financials</Tabs.Tab>
                  <Tabs.Tab value="bankAccounts">Bank Accounts</Tabs.Tab>
                  {!isSamastaLoan(appFormData?.loanProduct) && (
                    <Tabs.Tab value="accountValidations">
                      Account Validations
                    </Tabs.Tab>
                  )}
                </Tabs.List>
              </Tabs>
            )}
          </React.Fragment>
        ))}
      </Stack>

      <Stack
        className="w-4/5"
        pr={20}
        pl={10}
        pt={20}
        justify={'flex-start'}
        align={'flex-center'}
        style={{ display: 'inline-flex', float: 'left' }}
        ref={ckycRef}
      >
        <ApplicationDetailHeader
          editMode={editMode}
          changeEditMode={(mode) => setEditMode(mode)}
          revertAction={revertAllChanges}
          saveAction={saveAppForm}
          viewHistory={viewHistory}
        />


        {appFormData?.ckycValidationMode && (
          <Flex className="w-full">
            <Title order={5}> CKYC</Title>
          </Flex>
        )}


        {appFormData?.ckycValidationMode && (<Flex className="w-full" gap={20}>
          <TitleCard
            title="Details"
            shadow="xs"
            width="w-1/2"
            cols={2}
            fields={basicInfoCkyc}
            editMode={editMode}
            editBtnAction={setModalContentAndShow}
          />
        </Flex>)}



        <Flex className="w-full" ref={profileRef}>
          <Title order={5}> Profile</Title>
        </Flex>

        <Flex className="w-full" gap={20}>
          <TitleCard
            title="Basic info"
            shadow="xs"
            width="w-1/2"
            cols={3}
            header={getHeaderForBasicInfo}
            fields={basicInfo}
            editMode={editMode}
            editBtnAction={setModalContentAndShow}
          />
          <TitleCard
            title="Communication"
            shadow="xs"
            width="w-1/2"
            cols={2}
            fields={communication}
            editMode={editMode}
            editBtnAction={setModalContentAndShow}
          />
        </Flex>

        <Flex className="w-full" ref={financialsRef}>
          <Title order={5}> Financials</Title>
        </Flex>

        <Flex className="w-full" gap={20}>
          <TitleCard
            title="Loan Request"
            shadow="xs"
            width="w-1/2"
            cols={3}
            fields={loanRequest}
            editMode={editMode}
            editBtnAction={setModalContentAndShow}
          />
          <TitleCard
            title="Income & current obligations"
            shadow="xs"
            width="w-1/2"
            cols={2}
            fields={obligations}
            editMode={editMode}
          />
        </Flex>

        <Flex ref={bankAccsRef}>
          <Title order={5}>Bank Accounts</Title>
        </Flex>
        <SimpleGrid className="w-full" cols={2}>
          {appFormData?.linkedIndividuals[0]?.bankAccounts.map(
            (account, index) => (
              <TitleCard
                key={`Applicant Account ${index + 1}`}
                title={`Applicant Account ${index + 1}`}
                width="w-full"
                shadow="xs"
                fields={applicantAccount(index)}
                editMode={editMode}
              />
            ),
          )}
        </SimpleGrid>

        {!isSamastaLoan(appFormData?.loanProduct) && (
          <>
            <Flex ref={accValidationsRef}>
              <Title order={5}>Account Validation</Title>
            </Flex>
            <Flex className="w-full" gap={20}>
              {pennyTesting &&
                pennyTesting.length > 0 &&
                pennyTesting.some((p) => p.value) && (
                  <TitleCard
                    title="Penny Testing"
                    width="w-1/2"
                    fields={pennyTesting}
                    header={getPennyTestingHeader()}
                    editMode={editMode}
                  />
                )}
              {appFormData?.mandate && (
                <TitleCard
                  title="Mandate Registration"
                  width="w-1/2"
                  fields={mandate}
                  header={getMandateHeader()}
                  editMode={editMode}
                />
              )}
            </Flex>
          </>
        )}

        <Space h="lg"></Space>
      </Stack>

      <EditModal
        modalContent={modalContent}
        onSaveModalFunc={saveModalData}
        opened={opened}
        modalAction={{ open, close }}
      />

      <EditHistory
        opened={historyModalOpened}
        open={openHistoryModal}
        close={closeHistoryModal}
        historyItems={appFormHistory}
      />

      {/* </Flex> */}
    </React.Fragment>
  );
};
