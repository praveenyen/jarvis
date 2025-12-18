export const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

type Payment = {
  Year: number;
  Month: number;
  [key: string]: any;
};

type Account = {
  [key: string]: any;
  dateOpened?: string;
};

export function formatDateForBureauDates(input: string) {
  if (
    input === '' ||
    input === null ||
    input === undefined ||
    input.length !== 8
  )
    return '-';

  const year = input.substring(0, 4);
  const month = input.substring(4, 6);
  const day = input.substring(6, 8);

  return `${day}-${month}-${year}`;
}
export function formatDateForBureauDatesDDMMYYYY(input: string) {
  if (
    input === '' ||
    input === null ||
    input === undefined ||
    input.length !== 8
  )
    return '-';

  const year = input.substring(4, 8);
  const month = input.substring(2, 4);
  const day = input.substring(0, 2);

  return `${day}-${month}-${year}`;
}

export const convertPaymentHistory = (
  accounts: Account[],
  key: string,
  dataKey: string,
  bureauType: string
): Account[] => {
  accounts?.forEach((account) => {
    const paymentHistory: Payment[] = account[key] || [];

    const uniqueYears = [...new Set(paymentHistory.map((p) => p.Year))].sort(
      (a, b) => b - a,
    );
    const years: Record<number, Record<string, string>> = {};

    uniqueYears.forEach((year) => {
      years[year] = {};
      months.forEach((month) => {
        years[year][month] = '-';
      });
    });

    paymentHistory.forEach((payment) => {
      const { Year, Month } = payment;
      if (years[Year] !== undefined && Month && Month >= 1 && Month <= 12) {
        const monthName = months[12 - Month];
        years[Year][monthName] = payment[dataKey] ?? '-';
      }
    });

    account[key] = years;
  });
  if (bureauType !== 'cibil') {
    accounts?.sort((a, b) => {
      const dateA = a.dateOpened || '9999-12-31';
      const dateB = b.dateOpened || '9999-12-31';
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    });

    return accounts.reverse();
  }
  else
    return accounts;
};

//input str is of type DDMMYYYY
export const parseDDMMYYYYCompact = (str: string) => {
  const dd = parseInt(str.slice(0, 2), 10);
  const mm = parseInt(str.slice(2, 4), 10) - 1; // Month is 0-based
  const yyyy = parseInt(str.slice(4), 10);
  return new Date(yyyy, mm, dd);
};

export const parseDDMMYYYYCompactDateString = (str: string) => {
  if (str === '' || str === null || str === undefined || str.length !== 8)
    return '-';
  const dd = str.slice(0, 2);
  const mm = str.slice(2, 4);
  const yyyy = str.slice(4);
  return `${dd}-${mm}-${yyyy}`;
};
//format date object
export function formatDate(date: Date) {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

type enquiry = {
  amount: string;
  date: string;
  firstName: string;
  purpose: string;
};

export const countRecentDates = (data: enquiry[], xDays: number) => {
  if (!data || data.length === 0) return '-';
  const now = new Date();
  const xDaysAgo = new Date(now.getTime() - xDays * 24 * 60 * 60 * 1000);

  return data.filter((item) => {
    const dateStr = item.date;
    const day = parseInt(dateStr.slice(0, 2), 10);
    const month = parseInt(dateStr.slice(2, 4), 10) - 1;
    const year = parseInt(dateStr.slice(4, 8), 10);
    const itemDate = new Date(year, month, day);

    return itemDate >= xDaysAgo && itemDate <= now;
  }).length;
};

export const writePaymentHistory = (
  ph1: string,
  ph2: string,
  start: string,
  end: string,
) => {
  if (!start || !end) return [];

  let ph = (ph1 || '') + (ph2 || '');
  if (!ph.trim()) return [];

  // Parse DDMMYYYY to JS Date
  const parseDate = (str: string) => {
    const day = parseInt(str.slice(0, 2), 10);
    const month = parseInt(str.slice(2, 4), 10) - 1; // JS months are 0-indexed
    const year = parseInt(str.slice(4, 8), 10);
    return new Date(year, month, day);
  };

  let startDate = parseDate(start);
  let endDate = parseDate(end);

  // Swap to iterate from latest to earliest
  if (startDate < endDate) [startDate, endDate] = [endDate, startDate];

  const paymentHistory = [];
  let st = 0;

  let currentYear = startDate.getFullYear();
  let currentMonth = startDate.getMonth() + 1;

  const endYear = endDate.getFullYear();
  const endMonth = endDate.getMonth() + 1;

  while (currentYear > endYear || currentMonth >= endMonth) {
    if (st + 3 > ph.length) break;

    const type = ph.substring(st, st + 3);
    if (type.length !== 3) break;

    paymentHistory.push({
      Month: currentMonth,
      Year: currentYear,
      type: type,
    });

    st += 3;
    currentMonth--;
    if (currentMonth === 0) {
      currentMonth = 12;
      currentYear--;
    }
  }

  return paymentHistory;
};
