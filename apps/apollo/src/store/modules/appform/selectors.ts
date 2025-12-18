import { atom } from 'jotai';
import { appFormRawData } from '@/store/atoms';
import { Loan, TAppformData } from '@/lib/queries/shield/queryResponseTypes';

export const getApplicantList = (appformData: TAppformData) => {
  const applicantList = [];
  const iconText = (firstName: string, lastName: string) => {
    return firstName.charAt(0) + lastName.charAt(0);
  };
  const getFullName = (
    firstName: string | undefined,
    middleName: string | undefined,
    lastName: string | undefined,
  ) => {
    const fName = firstName ? firstName + ' ' : '';
    const mName = middleName ? middleName + ' ' : '';
    const lName = lastName ? lastName : '';
    return fName + mName + lName;
  };
  for (const applicant of appformData.linkedIndividuals) {
    applicantList.push({
      id: applicant.id,
      name: getFullName(
        applicant?.individual?.firstName,
        applicant?.individual?.middleName,
        applicant?.individual?.lastName,
      ),
      firstName: applicant?.individual?.firstName,
      type: 'Individual',
      iconText: iconText(
        applicant?.individual?.firstName || '',
        applicant?.individual?.lastName || '',
      ),
    });
  }

  if (appformData.linkedBusiness) {
    applicantList.push({
      id: appformData.linkedBusiness.id,
      name: appformData.linkedBusiness.business?.name,
      firstName: appformData.linkedBusiness.business?.name,
      type: 'Business',
      iconText:
        appformData?.linkedBusiness?.business?.name &&
        appformData.linkedBusiness.business.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .slice(0, 2)
          .toUpperCase(),
    });
  }
  for (const applicant of appformData.coApplicants) {
    applicantList.push({
      id: applicant.id,
      name: applicant?.business?.name,
      firstName: applicant?.business?.name,
      type: 'Co-Applicant',
      iconText:
        applicant?.business?.name &&
        applicant.business.name.charAt(0) + applicant.business.name.charAt(1),
    });
  }
  for (const applicant of appformData.beneficialOwners) {
    applicantList.push({
      id: applicant.id,
      name: getFullName(
        applicant?.individual?.firstName,
        applicant?.individual?.middleName,
        applicant?.individual?.lastName,
      ),
      firstName: applicant?.individual?.firstName,
      type: 'Beneficial Owner',
      iconText:
        applicant.individual?.firstName &&
        applicant.individual?.lastName &&
        applicant.individual.firstName.charAt(0) +
          applicant.individual.lastName.charAt(0),
    });
  }

  return applicantList;
};

//Use selectors for derived states
export const getAppFormApplicantList = atom((get) => {
  const appformData: TAppformData | null = get(appFormRawData);
  return appformData ? getApplicantList(appformData) : [];
});

export const getLoan = atom<Loan | null>((get) => {
  const appformData: TAppformData | null = get(appFormRawData);
  if (!appformData) {
    return null;
  } else return appformData.loan;
});

export const isSBDApplication = atom<boolean>((get) => {
  const appformData: TAppformData | null = get(appFormRawData);
  return appformData?.loanProduct == 'SBD' || appformData?.loanProduct == 'SBA';
});

export const isSecuredLPC = atom<boolean>((get) => {
  const appformData: TAppformData | null = get(appFormRawData);
  return (
    appformData?.loanProduct == 'LAP' ||
    appformData?.loanProduct == 'PLP' ||
    appformData?.loanProduct == 'LPA'
  );
});
