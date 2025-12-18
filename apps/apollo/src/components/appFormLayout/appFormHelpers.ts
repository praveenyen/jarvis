import { TExpAddress } from '@/lib/queries/cerebro/queryResponseTypes';
import { Address, TAppformData } from '@/lib/queries/shield/queryResponseTypes';
import { stateMappings } from '../bureau/common/codeMappings';

export const mainCustomerId = (data: TAppformData | null): string => {
  try {
    if (data?.linkedBusiness && Object.keys(data?.linkedBusiness).length > 0) {
      return data?.linkedBusiness.customerId;
    }
  } catch (e) {
    console.log(e);
  }
  if (data?.loanType === 'secured') {
    let primaryApplicant = data?.linkedIndividuals.find(
      (individual) => individual.type === 'Primary',
    );
    if (primaryApplicant) {
      return primaryApplicant.customerId;
    }
  }
  try {
    return data?.linkedIndividuals[0].customerId || '';
  } catch (e) {
    console.log(e);
  }
  return '';
};

export const getYearsDifference = (startDate: Date, endDate: Date) => {
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();
  const diff = endYear - startYear;

  if (isNaN(diff) || !startDate || !endDate) return '-';
  else return diff + ' years';
};

export const currencyFilter = (val: number | string | null) => {
  if (!val && val !== 0) {
    return '-';
  }
  val = val.toString();
  let afterPoint = '';
  if (val.indexOf('.') > 0)
    afterPoint = val.substring(val.indexOf('.'), val.length);
  val = Math.floor(parseInt(val));
  val = val.toString();
  let lastThree = val.substring(val.length - 3);
  const otherNumbers = val.substring(0, val.length - 3);
  // eslint-disable-next-line eqeqeq
  if (otherNumbers != '') lastThree = ',' + lastThree;
  const res =
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree + afterPoint;
  return res;
};

export const capitaliseFilter = (val: number | null | string): string => {
  if (!val) return '';
  val = val.toString();
  return val
    .split(' ')
    .map((n) => n.charAt(0).toUpperCase() + n.slice(1))
    .join(' ');
};

export const formattedDate = (value: string | undefined) => {
  if (value === '-') {
    return value;
  } else if (!value) {
    return '-';
  }
  const dt = new Date(value);
  if (dt == null) return '';
  const f = function (d: number) {
    return d < 10 ? '0' + d : d;
  };
  return f(dt.getDate()) + '-' + f(dt.getMonth() + 1) + '-' + dt.getFullYear();
};

export const formattedDateTime = (value: string | undefined) => {
  if (value === '-') {
    return value;
  } else if (!value) {
    return '-';
  }

  const dt = new Date(value);
  if (isNaN(dt.getTime())) return '';

  const f = (d: number) => (d < 10 ? '0' + d : d);

  return (
    `${f(dt.getDate())}-${f(dt.getMonth() + 1)}-${dt.getFullYear()} ` +
    `${f(dt.getHours())}:${f(dt.getMinutes())}:${f(dt.getSeconds())}`
  );
};

export const dateObjToStr = (value: Date | null, format?: string) => {
  if (format === 'dd-mm-yyyy') {
    return value
      ? value?.toLocaleDateString('fr-CA', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })
      : null;
  } else {
    return value
      ? value?.toLocaleDateString('fr-CA', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
      : null;
  }
};

export const getAddressLines = (
  addressObj: Address | undefined | Record<string, string>,
): string => {
  if (addressObj)
    return (
      (addressObj?.line1 || '-') +
      '\n' +
      (addressObj?.line2 || '-') +
      '\n' +
      (addressObj?.city || '-') +
      '\n' +
      addressObj?.state +
      '\n' +
      addressObj?.pinCode
    );
  else return '-';
};

export const getAddressLinesBureau = (
  addressObj: Address | undefined | Record<string, string>,
): string => {
  if (addressObj)
    return Object.values(addressObj)
      .reduce((acc, val) => {
        return acc + '\n' + val;
      }, '')
      ?.toString();
  else return '-';
};

export const getAddressLinesBureauData = (
  addressObj: TExpAddress | undefined | Record<string, string>,
): string => {
  const stateCode = addressObj?.state ? parseInt(addressObj.state) : 0;
  if (addressObj && Object.entries(addressObj).length > 0)
    return (
      (addressObj?.line1 || '-') +
      '\n' +
      (addressObj?.city || '-') +
      '\n' +
      (isNaN(stateCode) ? (addressObj?.state||'-') : stateMappings[stateCode]) +
      '\n' +
      addressObj?.pincode
    );
  else return '-';
};

export const currencyValidation = (
  value: number | string | undefined | null,
) => {
  if (value !== null || value !== undefined || value !== '') {
    value = value?.toString().replaceAll(',', '');
    let formattedNumber =
      value && new Intl.NumberFormat('en-IN').format(parseInt(value));
    if (formattedNumber === 'NaN') {
      return '';
    }
    return formattedNumber;
  } else return '';
};
export function getInitials(name: string | undefined | null): string {
  if (!name) return '-';
  const words = name?.trim().split(/\s+/);

  if (words.length >= 2) {
    return words[0][0] + words[1][0];
  }

  return words[0].slice(0, 2);
}
