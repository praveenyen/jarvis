import { verificationStatus } from '@/lib/utils/constants';
import { dedupeStatus } from '@/lib/utils/constants';
import { regulatoryStatus } from '@/lib/utils/constants';

export const formatDateToDDMMYYYY = (
  dateString: string|undefined|null,
  timeStampReq: boolean,
): string => {
  if (dateString == undefined || dateString == null) return""
  const date = new Date(dateString);

  date.setHours(date.getHours() + 5);
  date.setMinutes(date.getMinutes() + 30);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  if (timeStampReq) {
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }

  return `${day}-${month}-${year}`;
};

export const formatUTCtoIST = (dateString:string):string => {
  let date = new Date(dateString).toLocaleString("en-IN", {timeZone: 'Asia/Kolkata'})
  return date
}

export const formatSnakeCase = (text: string) => {
  if (!text) {
    return '';
  }
  return text.replace(/_/g, ' ');
};

export const truncateString = (stringLength: number, textValue: string) => {
  if (stringLength < 1 || textValue == null) return '';
  const slicedStringValue = textValue.slice(0, stringLength);
  return `${slicedStringValue}...`;
};

export const createReturnStatusFunction = (statusType: string) => {
  let statusObj: any;
  switch (statusType?.toLowerCase()) {
    case 'verification':
      statusObj = verificationStatus;
      break;
    case 'dedupe':
      statusObj = dedupeStatus;
      break;
    case 'regulatory':
      statusObj = regulatoryStatus;
      break;
    default:
      statusObj = {};
      return statusObj;
  }

  return function (getStatusFor: string) {
    if (!statusObj || !statusObj[getStatusFor]) {
      return getStatusFor;
    }
    return statusObj[getStatusFor];
  };
};

export const formatCamelCase = (text: string) => {
  const result = text
    .replace(/[0-9]{2,}/g, (match) => ` ${match} `)
    .replace(/[^A-Z0-9][A-Z]/g, (match) => `${match[0]} ${match[1]}`)
    .replace(
      /[A-Z][A-Z][^A-Z0-9]/g,
      (match) => `${match[0]} ${match[1]}${match[2]}`,
    )
    .replace(/[ ]{2,}/g, (match) => ' ')
    .replace(/\s./g, (match) => match.toUpperCase())
    .replace(/^./, (match) => match.toUpperCase())
    .trim();
  return result;
};
export function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}


export function formatDateObjToDDMMYYYY(date:string) {
  // Check if the input is a valid Date object
  if(!date || typeof date !== 'string' || date === 'null') 
    return null;
  let dateObj = new Date(date);
  if (!(dateObj instanceof Date) ){
    return null;
  }

  const day = dateObj.getDate(); 
  const month = dateObj.getMonth() + 1; 
  const year = dateObj.getFullYear();

  const formattedDay = String(day).padStart(2, '0');
  const formattedMonth = String(month).padStart(2, '0');

  return `${formattedDay}-${formattedMonth}-${year}`;
}

export const isDiscrepancyModuleEnabled = (status: string|undefined) =>
 status != '15' && status != '-20'


