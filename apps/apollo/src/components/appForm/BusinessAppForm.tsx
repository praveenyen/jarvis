'use client';
import {
  Flex,
  Tabs,
  Title,
  Button,
  Stack,
  SimpleGrid,
  Text,
  Space,
  Box,
  useMantineTheme,
} from '@mantine/core';
import React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLoader } from '@/lib/context/loaders/useLoader';
import CustomIcon from '../icons/CustomIcons';
import { TitleCard } from '@/components/common/TitleCard';
import { appFormRawData } from '@/store/modules/appform';
import { useAtomValue } from 'jotai';
import { user } from '@/store/atoms';
import { TFields } from '@/components/common/TitleCard';
import {
  currencyValidation,
  dateObjToStr,
  formattedDate,
  getAddressLines,
  getInitials,
} from '@/components/appFormLayout/appFormHelpers';
import { AppAvatar } from '../common/AppAvatar';
import iconColors from '../icons/iconColors';
import { getAppFormApplicantList } from '@/store/modules/appform';
import { partnerBankIdMap, businessTypeMap } from '@/lib/utils/constants';
import classes from './AppForm.module.css';
import {
  Address,
  LinkedIndividual,
  TAppFormChangeSet,
  TAppformData,
} from '@/lib/queries/shield/queryResponseTypes';
import ApplicationDetailHeader from '@/components/appForm/ApplicationDetailHeader';
import { EditModal, TEditModalInput } from './EditModal';
import { useNotification } from '@/lib/context/notifications/useNotifications';
import { useAppFormPatch } from '@/lib/queries';
import { TAppFormEditData } from '@/lib/queries/shield/queryResponseTypes';
import { useDisclosure } from '@mantine/hooks';
import { ComboboxItem } from '@mantine/core';
import { useQueryClient } from '@tanstack/react-query';
import {
  getAppFormDataQKey,
  getAppFormHistoryQKey,
} from '@/lib/queries/queryKeys';
import EditHistory from './EditHistory';
import { genderMap, messageRegex } from './AppFormView';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

let editRequests: TAppFormEditData[] = [];

const genderSelectOptions: ComboboxItem[] = [
  {
    value: 'M',
    label: 'Male',
  },
  { value: 'F', label: 'Female' },
  { value: 'T', label: 'Transgender' },
];
const NOT_PROVIDED = 'Not Provided';

export const BusinessAppForm = ({
  appFormId,
  appFormHistory,
}: {
  appFormId: string | undefined;
  appFormHistory: TAppFormChangeSet[] | undefined | Error;
}) => {
  const appFormDataAtom = useAtomValue(appFormRawData);

  const [appFormData, setAppFormData] = useState<TAppformData | null>();
  const { notify } = useNotification();
  const { start, stop } = useLoader();
  const [opened, { open, close }] = useDisclosure(false);
  const queryClient = useQueryClient();
  const userData = useAtomValue(user);

  const [basicInfo, setBasicInfo] = useState<TFields[]>();
  const [communication, setCommunication] = useState<TFields[]>();
  const [loanRequest, setLoanRequest] = useState<TFields[]>();
  const [obligations, setObligations] = useState<TFields[]>();
  const [disbursementAccount, setDibursementAccount] = useState<TFields[]>();
  const [direktor, setDirektor] = useState<TFields[][]>();
  const [modalContent, setModalContent] = useState<TEditModalInput[]>();
  const [selectedAddress, setSelectedAddress] = useState<string>();
  const [keyValMap, setKeyValMap] = useState<Record<string, any>[]>([]);
  const [businessName, setBusinessName] = useState<string>();

  const [activeSection, setActiveSection] = useState<string | null>('profile');

  const profileRef = useRef<HTMLDivElement>(null);
  const directorsRef = useRef(null);
  const financialsRef = useRef<HTMLDivElement>(null);
  const bankAccsRef = useRef(null);
  const theme = useMantineTheme();
  const [editMode, setEditMode] = useState(false);

  const [
    historyModalOpened,
    { open: openHistoryModal, close: closeHistoryModal },
  ] = useDisclosure(false);

  const revertAllChanges = () => {
    setAppFormData(appFormDataAtom);
    editRequests = [];
    setEditMode(false);
  };

  const onAppFormPatchError = (error: Error) => {
    stop();
    const match = messageRegex.exec(error.message);
    notify({ message: match ? match[1] : error.message, type: 'error' });
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

  const updatedContent = useCallback(
    (
      data: TFields[] | undefined,
      modifiableIndex: number | undefined,
      currentItem: TEditModalInput,
    ) => {
      let infoObj = structuredClone(data);
      if (infoObj && modifiableIndex !== undefined && modifiableIndex >= 0) {
        if (currentItem.type === 'date')
          infoObj[modifiableIndex].value = formattedDate(currentItem.value);
        else infoObj[modifiableIndex].value = currentItem.value;
      }
      return infoObj;
    },
    [],
  );

  const updateEditRequest = (
    path: string | undefined,
    key: string,
    value: any,
  ) => {
    let existingDataIndex = editRequests.findIndex(
      (d) => d.resourcePath === path,
    );
    let newData = { [key]: value };
    if (path) {
      if (existingDataIndex >= 0)
        editRequests[existingDataIndex].editData = {
          ...editRequests[existingDataIndex].editData,
          ...newData,
        };
      else
        editRequests.push({
          resourcePath: path,
          editData: newData,
        });
    }
  };

  const saveModalData = (modalData: TEditModalInput[] | undefined) => {
    close();
    if (modalData) {
      if (
        modalData.some(
          (m) => m.key === 'pinCode' && m.misc.section === 'communication',
        )
      ) {
        let infoObj = structuredClone(communication);
        let modifiableItem = communication?.findIndex(
          (i) => i.key === selectedAddress,
        );
        let addresObj = modalData.reduce((acc: Record<string, string>, a) => {
          acc[a.key] = a.value;
          return acc;
        }, {});
        if (infoObj && modifiableItem !== undefined && modifiableItem >= 0) {
          infoObj[modifiableItem].value = getAddressLines(addresObj);

          let editData = infoObj[modifiableItem].editData;
          let modifiedKeys = Object.keys({ ...editData, ...addresObj }).filter(
            (key) => editData && editData[key] !== addresObj[key],
          );
          modifiedKeys.forEach((key) =>
            updateEditRequest(
              modalData[0].misc.resourcePath,
              key,
              addresObj[key],
            ),
          );

          infoObj[modifiableItem].editData = addresObj;
        }

        setCommunication(infoObj);
      } else if (
        modalData.some(
          (m) => m.misc.section?.includes('direktor') && m.key === 'pinCode',
        )
      ) {
        let infoObj = structuredClone(direktor);
        let direktorIndex = modalData[0]?.misc?.section
          ? parseInt(modalData[0].misc.section.split('-')[1])
          : -1;
        let modifiableItem =
          direktor &&
          direktor[direktorIndex]?.findIndex((i) => i.key === selectedAddress);
        let addresObj = modalData.reduce((acc: Record<string, string>, a) => {
          acc[a.key] = a.value;
          return acc;
        }, {});

        if (
          infoObj &&
          direktorIndex !== undefined &&
          modifiableItem !== undefined &&
          modifiableItem >= 0 &&
          direktorIndex >= 0
        ) {
          infoObj[direktorIndex][modifiableItem].value =
            getAddressLines(addresObj);

          let editData = infoObj[direktorIndex][modifiableItem]?.editData;
          let modifiedKeys = Object.keys({ ...editData, ...addresObj }).filter(
            (key) => editData && editData[key] !== addresObj[key],
          );
          modifiedKeys.forEach((key) =>
            updateEditRequest(
              modalData[0].misc.resourcePath,
              key,
              addresObj[key],
            ),
          );
          infoObj[direktorIndex][modifiableItem].editData = addresObj;
        }
        setDirektor(infoObj);
      } else if (modalData.some((m) => m.misc.section?.includes('direktor'))) {
        let directorInfo = structuredClone(direktor);
        let keyMap = structuredClone(keyValMap);
        let directorCardHeader = [
          'firstName',
          'lastName',
          'middleName',
          'gender',
        ];
        modalData?.forEach((item) => {
          let direktorIndex = item?.misc?.section
            ? parseInt(item.misc.section.split('-')[1])
            : -1;
          if (modalData.some((m) => directorCardHeader.includes(m.key))) {
            keyMap[direktorIndex][item.key] = item.value;
            updateEditRequest(item.misc.resourcePath, item.key, item.value);
          } else {
            let modifiableItem =
              direktor &&
              direktor[direktorIndex]?.findIndex((i) => i.key === item.key);
            if (
              directorInfo &&
              modifiableItem !== undefined &&
              modifiableItem >= 0
            ) {
              if (item.type === 'date') {
                const dateObject = dayjs(item.value, 'YYYY-MM-DD');
                const outputDate = dateObject.format('DD-MM-YYYY');
                directorInfo[direktorIndex][modifiableItem].value = outputDate
                updateEditRequest(
                  item.misc.resourcePath,
                  item.key,
                  item.value,
                );
              } else {
                directorInfo[direktorIndex][modifiableItem].value = item.value;
                updateEditRequest(item.misc.resourcePath, item.key, item.value);
              }
            }
          }
        });

        if (modalData.some((m) => directorCardHeader.includes(m.key))) {
          setKeyValMap(keyMap);
        } else {
          setDirektor(directorInfo);
        }
      } else
        modalData?.forEach((item) => {
          let val = item.value;
          if (item.type === 'date') {
            val = formattedDate(val);
          }
          if (item.misc.section === 'basicInfo') {
            let modifiableItem = basicInfo?.findIndex(
              (i) => i.key === item.key,
            );
            setBasicInfo(updatedContent(basicInfo, modifiableItem, item));
          } else if (item.misc.section === 'loanReq') {
            let modifiableItem = loanRequest?.findIndex(
              (i) => i.key === item.key,
            );
            setLoanRequest(updatedContent(loanRequest, modifiableItem, item));
          } else {
            if (item.label.toLowerCase() === 'business name') {
              setBusinessName(val);
            }
          }
          updateEditRequest(
            item.misc.resourcePath,
            item.key,
            item.type === 'date' ? dateObjToStr(item?.value) : val,
          );
        });
    }
  };

  const setModalContentAndShow = (field: TFields) => {
    if (field?.key) {
      if (['corpAddress', 'regAddress', 'currentAddress'].includes(field.key)) {
        setSelectedAddress(field.key);
        if (field?.editData)
          setModalContent(
            Object.entries(field?.editData).map(([key, value]) => ({
              label: key,
              value: value,
              key: key,
              type: ['line1', 'line2'].includes(key) ? 'textarea' : 'text',
              misc: {
                resourcePath: field?.resourcePath,
                section: field?.section,
              },
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
              misc: {
                resourcePath: field?.resourcePath,
                section: field?.section,
              },
            })),
          );
      } else
        setModalContent([
          {
            label: field.label,
            value: field.value,
            key: field?.key || '',
            type:
              /\bdate\b/.test(field?.label?.toLowerCase()) ||
              field?.label === 'DOB'
                ? 'date'
                : field.key === 'gender'
                  ? 'select'
                  : 'text',
            misc: {
              resourcePath: field?.resourcePath,
              section: field?.section,
              options: genderSelectOptions,
            },
          },
        ]);
      open();
    } else console.log('No key present!');
  };

  const setBasicInfoDetails = useCallback(() => {
    let fields: TFields[] = [];
    let linkedBusiness = appFormData?.linkedBusiness;
    setBusinessName(linkedBusiness?.business?.name);
    fields.push({
      label: 'INDUSTRY TYPE',
      value: linkedBusiness?.business?.industryType || NOT_PROVIDED,
      isEditable: true,
      key: 'industryType',
      resourcePath: `linkedBusiness/business`,
      section: 'basicInfo',
    });
    fields.push({
      label: 'INDUSTRY SUB-TYPE',
      value: linkedBusiness?.business?.industrySubType || NOT_PROVIDED,
      isEditable: false,
    });
    fields.push({
      label: 'REGISTRATION DATE',
      value: formattedDate(linkedBusiness?.business?.registrationDate),
      isEditable: true,
      key: 'registrationDate',
      resourcePath: `linkedBusiness/business`,
      section: 'basicInfo',
    });
    fields.push({
      label: 'NO. OF EMPLOYEES',
      value: linkedBusiness?.misc?.employeeCount,
      isEditable: false,
    });
    fields.push({
      label: 'PAN NO',
      value: linkedBusiness?.kyc.find(
        (i) => i.kycType?.toLowerCase() === 'pancard',
      )?.kycValue,
      isEditable: false,
    });
    fields.push({
      label: 'GSTIN',
      value: linkedBusiness?.kyc.find(
        (i) => i.kycType?.toLowerCase() === 'gstin',
      )?.kycValue,
      isEditable: false,
    });
    setBasicInfo(fields);
  }, [appFormData]);

  const setCommunicationDetails = useCallback(() => {
    let fields: TFields[] = [];
    let linkedBusiness = appFormData?.linkedBusiness;
    const regAddress = linkedBusiness?.addresses.find(
      (address) =>
        address.type?.toLowerCase() === 'regadd' ||
        address.type?.toLowerCase() === 'registeredaddress',
    );
    const corpAddress = linkedBusiness?.addresses.find(
      (address) => address.type?.toLowerCase() === 'corp',
    );
    fields.push({
      label: 'EMAIL',
      value: linkedBusiness?.contacts.find(
        (contact) => contact.type === 'email',
      )?.value,
      isEditable: false,
    });
    fields.push({
      label: 'CONTACT NO',
      value: linkedBusiness?.contacts?.find(
        (contact) => contact.type === 'phone',
      )?.value,
      isEditable: false,
    });
    fields.push({
      label: 'REGISTERED ADDRESS',
      key: 'regAddress',
      value: getAddressLines(regAddress),
      isEditable: true,
      editData: {
        line1: regAddress?.line1,
        line2: regAddress?.line2,
        city: regAddress?.city,
        state: regAddress?.state,
        pinCode: regAddress?.pinCode,
      },
      resourcePath: `linkedBusiness/addresses/[id=${regAddress?.id}]`,
      section: 'communication',
    });
    fields.push({
      label: 'CORPORATE ADDRESS',
      value: getAddressLines(corpAddress),
      isEditable: true,
      key: 'corpAddress',
      editData: {
        line1: corpAddress?.line1,
        line2: corpAddress?.line2,
        city: corpAddress?.city,
        state: corpAddress?.state,
        pinCode: corpAddress?.pinCode,
      },
      resourcePath: `linkedBusiness/addresses/[id=${corpAddress?.id}]`,
      section: 'communication',
    });
    setCommunication(fields);
  }, [appFormData]);

  const setLoanRequestDetails = useCallback(() => {
    let fields: TFields[] = [];
    let loan = appFormData?.loan;
    fields.push({
      label: 'LOAN AMT ₹',
      value: loan?.amount || '-',
      isEditable: true,
      key: 'amount',
      resourcePath: 'loan',
      section: 'loanReq',
    });
    fields.push({
      label: 'ALLOCATED AMT ₹',
      value: loan?.fundingAllocation,
      isEditable: true,
      key: 'fundingAllocation',
      resourcePath: 'loan',
      section: 'loanReq',
    });
    fields.push({
      label: 'TENURE(MONTHS)',
      value: loan?.tenure,
      isEditable: false,
    });
    fields.push({
      label: 'ROI',
      value: loan?.loanIntRate,
      isEditable: false,
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
      value: loan?.overAllLoanAmount,
      isEditable: false,
    });
    fields.push({
      label: 'LOAN START DATE',
      value: formattedDate(loan?.loanStartDate?.toString()),
      isEditable: false,
    });
    fields.push({
      label: 'CREDIT LIMIT ₹',
      value: appFormData?.creditLine?.creditLimit,
      key: 'creditLimit',
      isEditable: true,
      resourcePath: 'loan',
      section: 'loanReq',
    });
    fields.push({
      label: 'START DATE OF CL',
      value: formattedDate(appFormData?.creditLine?.dateOfCreditLimit),
      key: 'dateOfCreditLimit',
      isEditable: true,
      resourcePath: 'creditLine',
      section: 'loanReq',
    });
    fields.push({
      label: 'EXPIRY DATE OF CL',
      value: formattedDate(appFormData?.creditLine?.expiryDateOfCreditLimit),
      key: 'expiryDateOfCreditLimit',
      isEditable: true,
      resourcePath: 'creditLine',
      section: 'loanReq',
    });
    setLoanRequest(fields);
  }, [appFormData]);

  const setObligationsDetails = useCallback(() => {
    let fields: TFields[] = [];
    let misc = appFormData?.miscData;
    fields.push({
      label: 'ANNUAL REVENUE ₹',
      value: currencyValidation(misc?.revenue),
      isEditable: true,
    });
    fields.push({
      label: 'ANNUAL INCOME ₹',
      value: currencyValidation(misc?.income),
      isEditable: true,
    });
    fields.push({
      label: 'WORKING CAPITAL ₹',
      value: currencyValidation(misc?.workingCapital),
      isEditable: true,
    });
    fields.push({
      label: 'NETWORTH ₹',
      value: currencyValidation(misc?.netWorth),
      isEditable: true,
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
    setObligations(fields);
  }, [appFormData]);

  const setDisbursementAccountDetails = useCallback(() => {
    let fields: TFields[] = [];
    let disbursebankDetails = appFormData?.loan?.disbursement;
    fields.push({
      label: 'BANK NAME',
      value:
        disbursebankDetails?.partnerBankId &&
        partnerBankIdMap[disbursebankDetails.partnerBankId],
      isEditable: false,
    });
    fields.push({
      label: 'A/C TYPE',
      value: disbursebankDetails?.accType,
      isEditable: false,
    });
    fields.push({
      label: 'A/C NO.',
      value: disbursebankDetails?.accountNo,
      isEditable: false,
    });
    fields.push({
      label: 'ACCOUNT HOLDER NAME',
      value: disbursebankDetails?.acHolderName,
      isEditable: false,
    });
    fields.push({
      label: 'IFSC CODE',
      value: disbursebankDetails?.ifsc,
      isEditable: false,
    });
    setDibursementAccount(fields);
  }, [appFormData]);

  const setDirektorDetails = useCallback(() => {
    // const directors = appFormData?.linkedIndividuals.filter((individual) => individual.individual?.partyRelation.toLowerCase() === "director");
    let keyMap = structuredClone(keyValMap);
    appFormData?.linkedIndividuals.forEach(
      (linkedIndividual: LinkedIndividual, index) => {
        let infoHeaderMap: Record<string, any> = {};
        infoHeaderMap['firstName'] =
          linkedIndividual?.individual?.firstName || '';
        infoHeaderMap['middleName'] =
          linkedIndividual?.individual?.middleName || '';
        infoHeaderMap['lastName'] =
          linkedIndividual?.individual?.lastName || '';
        infoHeaderMap['gender'] = linkedIndividual?.individual?.gender;
        keyMap[index] = infoHeaderMap;
      },
    );
    setKeyValMap(keyMap);

    setDirektor(
      appFormData?.linkedIndividuals.map(
        (linkedIndividual: LinkedIndividual, index) => {
          let fields: TFields[] = [];
          const currentAddress = linkedIndividual?.addresses.find(
            (address) => address?.type?.toLowerCase() === 'curres',
          );
          fields.push({
            label: 'DOB',
            value: formattedDate(linkedIndividual?.individual?.dob?.toString()),
            isEditable: true,
            key: 'dob',
            resourcePath: linkedIndividual?.individual
              ? `linkedIndividuals/[id=${linkedIndividual?.id}]/individual`
              : '',
            section: `direktor-${index}`,
          });
          fields.push({
            label: 'MARITIAL STATUS',
            value: linkedIndividual?.individual?.maritalStatus,
            isEditable: false,
          });
          fields.push({
            label: 'EDUCATION',
            value: linkedIndividual?.individual?.education,
            isEditable: false,
          });
          fields.push({
            label: "FATHER'S NAME",
            value: linkedIndividual?.individual?.fatherName,
            isEditable: true,
            key: 'fatherName',
            resourcePath: linkedIndividual?.individual
              ? `linkedIndividuals/[id=${linkedIndividual?.id}]/individual`
              : '',
            section: `direktor-${index}`,
          });
          fields.push({
            label: 'ASSOCIATION',
            value: linkedIndividual?.individual?.accessLevel,
            isEditable: false,
          });
          fields.push({
            label: 'PAN NO.',
            value: linkedIndividual?.kyc?.find(
              (i) => i.kycType?.toLowerCase() === 'pancard',
            )?.kycValue,
            isEditable: false,
          });
          fields.push({
            label: 'VOTER ID NO.',
            value: linkedIndividual?.kyc.find(
              (i) => i.kycType?.toLowerCase() === 'voterid',
            )?.kycValue,
            isEditable: false,
          });
          fields.push({
            label: 'DL NO.',
            value: linkedIndividual?.kyc.find(
              (i) => i.kycType?.toLowerCase() === 'drivinglicense',
            )?.kycValue,
            isEditable: false,
          });
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
          fields.push({
            label: 'CURRENT ADDRESS',
            key: 'currentAddress',
            value: getAddressLines(currentAddress),
            isEditable: true,
            editData: {
              line1: currentAddress?.line1,
              line2: currentAddress?.line2,
              city: currentAddress?.city,
              state: currentAddress?.state,
              pinCode: currentAddress?.pinCode,
            },
            resourcePath: `linkedIndividuals/[id=${linkedIndividual?.id}]/addresses/[id=${currentAddress?.id}]`,
            section: `direktor-${index}`,
          });
          fields.push({
            label: 'PERMANENT ADDRESSS',
            value: getAddressLines(
              linkedIndividual?.addresses.find(
                (address) => address?.type?.toLowerCase() === 'per',
              ),
            ),
            isEditable: false,
          });
          fields.push({
            label: 'LAT TAG',
            value: linkedIndividual.vkyc?.latTag,
            isEditable: false,
          });
          fields.push({
            label: 'LONG TAG',
            value: linkedIndividual.vkyc?.longTag,
            isEditable: false,
          });
          fields.push({
            label: 'CITY',
            value: linkedIndividual.vkyc?.city,
            isEditable: false,
          });
          fields.push({
            label: 'COUNTRY',
            value: linkedIndividual.vkyc?.country,
            isEditable: false,
          });
          return fields;
        },
      ),
    );
  }, [appFormData]);

  useEffect(() => {
    setBasicInfoDetails();
    setCommunicationDetails();
    setLoanRequestDetails();
    setDisbursementAccountDetails();
    setDirektorDetails();
  }, [
    setBasicInfoDetails,
    setCommunicationDetails,
    setLoanRequestDetails,
    setObligationsDetails,
    setDisbursementAccountDetails,
    setDirektorDetails,
    appFormData,
  ]);

  useEffect(() => {
    setAppFormData(JSON.parse(JSON.stringify(appFormDataAtom)));
  }, [appFormDataAtom]);

  const getDirektorHeader = useCallback(
    (director: LinkedIndividual, index: number) => {
      return (
        <Flex direction={'row'} p={4} justify={'flex-start'}>
          <Stack gap={0}>
            <Flex align={'center'} justify={'flex-start'} gap={5}>
              <Title order={5}>
                {keyValMap && keyValMap[index]?.firstName}{' '}
                {keyValMap && keyValMap[index]?.middleName}{' '}
                {keyValMap && keyValMap[index]?.lastName}
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
                      resourcePath: `linkedIndividuals/[id=${director?.id}]/individual`,
                      section: `direktor-${index}`,
                      editData: {
                        firstName: keyValMap && keyValMap[index]?.firstName,
                        middleName: keyValMap && keyValMap[index]?.middleName,
                        lastName: keyValMap && keyValMap[index]?.lastName,
                      },
                    })
                  }
                />
              )}
            </Flex>
            <Flex align={'center'} justify={'flex-start'} gap={5}>
              <Text size="xs">
                {keyValMap[index]?.gender
                  ? genderMap[keyValMap[index]?.gender as 'M' | 'F' | 'T']
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
                      value: keyValMap[index]?.gender,
                      isEditable: true,
                      resourcePath: `linkedIndividuals/[id=${director?.id}]/individual`,
                      section: `direktor-${index}`,
                    })
                  }
                />
              )}
            </Flex>
          </Stack>
        </Flex>
      );
    },
    [keyValMap, editMode],
  );

  const getHeaderForBasicInfo = useCallback(() => {
    return (
      <Flex direction={'row'} p={4} justify={'flex-start'}>
        <Stack gap={0}>
          <Flex align={'center'} justify={'flex-start'} gap={5}>
            <Title order={5}>{businessName}</Title>
            {editMode && (
              <CustomIcon
                src="MaterialIcon"
                name="MdOutlineModeEdit"
                size={'12px'}
                color={theme.colors.neutral[4]}
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  setModalContentAndShow({
                    label: 'Business Name',
                    key: 'name',
                    value: businessName,
                    isEditable: true,
                    resourcePath: 'linkedBusiness/business',
                  })
                }
              />
            )}
          </Flex>
          <Text size="xs">
            {appFormData?.linkedBusiness?.business &&
              businessTypeMap[appFormData.linkedBusiness.business.type]}
          </Text>
        </Stack>
      </Flex>
    );
  }, [appFormData, businessName, editMode]);

  const tabChange = (tabValue: string | null) => {
    setActiveSection(tabValue);
    const scrollBehaviour: ScrollIntoViewOptions = {
      behavior: 'smooth',
      block: 'start',
    };
    let refCopy = null;
    switch (tabValue) {
      case 'profile':
        refCopy = profileRef;
        break;
      case 'director':
        refCopy = directorsRef;
        break;
      case 'bankAccounts':
        refCopy = bankAccsRef;
        break;
      case 'financials':
        refCopy = financialsRef;
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

  return (
    <React.Fragment>
      <Stack
        pl={20}
        style={{
          position: 'sticky',
          top: '7rem',
          overflow: 'hidden',
          height: 'fit-content',
          marginTop: '1rem',
          zIndex: 100,
          float: 'left',
          width:"15%"
        }}
      >
        <Flex
          justify={'flex-start'}
          align={'center'}
          className={classes.buttonFlex}
          style={{
            cursor: 'pointer',
            borderRadius: '8px',
          }}
          p={5}
          styles={{
            root: {
              backgroundColor: theme.colors.primary[0],
            },
          }}
          gap={12}
        >
          <AppAvatar size={'md'} radius={'sm'} name={''} color={iconColors[0]}>
            {getInitials(appFormData?.linkedBusiness.business?.name)}
          </AppAvatar>

          <Stack gap={0}>
            <Title size="xs" order={5}>
              {appFormData?.linkedBusiness.business?.name}
            </Title>
            <Text size="xs">
              {' '}
              {appFormData?.linkedBusiness.business?.type &&
                businessTypeMap[appFormData?.linkedBusiness.business?.type]}
            </Text>
          </Stack>
        </Flex>
        <Tabs
          orientation="vertical"
          placement="left"
          value={activeSection}
          onChange={(tab) => tabChange(tab)}
        >
          <Tabs.List>
            <Tabs.Tab value="profile">Profile</Tabs.Tab>
            <Tabs.Tab value="director">Directors</Tabs.Tab>
            <Tabs.Tab value="financials">Financials</Tabs.Tab>
            <Tabs.Tab value="bankAccounts">Bank Accounts</Tabs.Tab>
          </Tabs.List>
        </Tabs>
      </Stack>
      <Stack
        className="w-4/5"
        pl={35}
        pt={20}
        pr={20}
        justify={'flex-start'}
        align={'flex-start'}
        style={{ float: 'left' }}
        ref={profileRef}
      >
        <ApplicationDetailHeader
          editMode={editMode}
          changeEditMode={(mode) => setEditMode(mode)}
          saveAction={saveAppForm}
          revertAction={revertAllChanges}
          viewHistory={viewHistory}
        />

        <Flex className="w-full">
          <Title order={5}> Profile</Title>
        </Flex>
        <Flex className="w-full" gap={20}>
          <TitleCard
            editMode={editMode}
            title="Basic info"
            shadow="xs"
            width="w-1/2"
            cols={3}
            header={getHeaderForBasicInfo()}
            fields={basicInfo}
            editBtnAction={setModalContentAndShow}
          />
          <TitleCard
            editMode={editMode}
            title="Communication"
            shadow="xs"
            width="w-1/2"
            cols={2}
            fields={communication}
            editBtnAction={setModalContentAndShow}
          />
        </Flex>

        <Flex ref={directorsRef}>
          <Title order={5}>Directors</Title>
        </Flex>
        <SimpleGrid className="w-full" cols={2}>
          {appFormData?.linkedIndividuals
            // .filter(
            //   (i) => i.individual?.partyRelation?.toLowerCase() === 'director',
            // )
            .map((director, index) => (
              <TitleCard
                key={`Director ${index + 1}`}
                editMode={editMode}
                title={`Director ${index + 1}`}
                width="w-full"
                shadow="xs"
                header={getDirektorHeader(director, index)}
                fields={direktor && direktor[index]}
                editBtnAction={setModalContentAndShow}
              />
            ))}
        </SimpleGrid>

        <Flex className="w-full" ref={financialsRef}>
          <Title order={5}> Financials</Title>
        </Flex>

        <Flex className="w-full" gap={20}>
          <TitleCard
            editMode={editMode}
            title="Loan Request"
            shadow="xs"
            width="w-1/2"
            cols={3}
            fields={loanRequest}
            editBtnAction={setModalContentAndShow}
          />
          {obligations !== undefined && obligations?.length > 0 && (
            <TitleCard
              editMode={editMode}
              title="Income & current obligations"
              shadow="xs"
              width="w-1/2"
              cols={2}
              fields={obligations}
            />
          )}
        </Flex>

        <Flex ref={bankAccsRef}>
          <Title order={5}>Bank Accounts</Title>
        </Flex>

        <TitleCard
          editMode={editMode}
          title={`Disbursement Account`}
          width="w-full"
          shadow="xs"
          fields={disbursementAccount}
        />

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
        historyItems={appFormHistory as TAppFormChangeSet[]}
      />

      {/* </Flex> */}
    </React.Fragment>
  );
};
