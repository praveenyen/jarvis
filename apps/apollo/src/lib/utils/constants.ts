export const smeDirectLpc = ['PCL', 'SMB', 'UDC', 'LKB', 'MNC', 'AFB', 'PCT'];
export const APP_FORM_DASHBOARD_CONSTANTS = {
  ADMIN_ROLES: [
    'superadmin',
    'qcreview',
    'qcapprove',
    'qcadmin',
    'qcapprovecolending',
    'creditadmin',
    'productrole',
    'creditrole',
    'auditrole',
    'viewadmin',
    'dashboardviewrole',
  ],
};
export const verificationStatus = {
  '-11': 'Rejected',
  '-1': 'Check',
  '-2': 'Check',
  '0': 'None',
  '3M': 'Check',
  '3H': 'Check',
  '1': 'Ok',
  '2': 'Resolved',
};

export const appForEditableRolesRegex =
  /qcadmin|qcApprove|qcReview|qcApproveColending|superadmin/i;

export const regulatoryStatus = {
  '-11': 'Reject',
  '3M': 'Check',
  '3H': 'Check',
  '1': 'Ok',
  '0': 'Pending',
  '2': 'Resolved',
  failure: 'Failed',
};
export const dedupeStatus = {
  '-1': 'Unique',
  '-2': 'Check',
  '3M': 'Check',
  '3H': 'Check',
  '1': 'Ok',
  '0': 'No Dedupe',
  '2': 'Resolved',
};

export const appFormStatus: Record<string, string> = {
  '-20': 'Rejected',
  '10': 'FCU In Progress',
  '11': '',
  '12': 'Ready for Approval',
  '8': 'Green Channel Manual Review',
  '9': 'Green Channel Tech Issue',
};

export const partnerBankIdMap: Record<string, string> = {
  '33': 'Yes Bank',
  '68': 'Rbl Bank',
  '102': 'Kotak Bank',
};

export const businessTypeMap: Record<string, string> = {
  '1': 'Individual',
  '2': 'Public Limited Company',
  '3': 'Private Limited Company',
  '4': 'Partnership Firm',
  '5': 'Limited Liability Partnership',
  '6': 'Indi-Sal',
  '7': 'Sole Proprietorship',
  '8': 'Indi-Se',
  '9': 'Small Individual Business Loan',
};

const objectToQueryString = (obj: any) =>
  Object.keys(obj)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&');

const validatePhoneNumber = function (rule: any, value: any, callback: any) {
  if (!value) {
    return callback(new Error('Please enter phone number'));
  } else if (isNaN(Number(value))) {
    return callback(new Error('Please input only numbers'));
  } else if (value.length !== 10) {
    return callback(new Error('Phone number must have 10 digits'));
  } else {
    return callback();
  }
};
export const validateLEI = function (rule: any, value: any, callback: any) {
  const regexp = /^\d{1,4}00[a-zA-Z0-9]{12}\d{2}$/g;
  if (value && value?.length < 20) {
    return callback(new Error('Please enter valid LEI number'));
  } else if (value && !regexp.test(value)) {
    return callback(new Error('Please enter valid LEI number'));
  } else {
    return callback();
  }
};
const validateEntityOrBusinessName = function (
  rule: any,
  value: any,
  callback: any,
) {
  const regexp = /^[\s]*[a-zA-Z0-9]+[a-zA-Z0-9\s.&()-]*$/g;
  if (!value) {
    return callback(new Error('Please enter a company name'));
  } else if (!regexp.test(value)) {
    return callback(
      new Error(
        'Customer name is invalid. Allowed special characters are & . - ( )',
      ),
    );
  } else {
    return callback();
  }
};
const validateRevenue = function (rule: any, value: any, callback: any) {
  if (value > 0) {
    return callback();
  } else {
    return callback(new Error('Please enter only positive number'));
  }
};
const validateEntity = function (rule: any, value: any, callback: any) {
  if (!value) {
    return callback(new Error('Please enter a company name'));
  } else {
    return callback();
  }
};
const validateShareHolding = function (rule: any, value: any, callback: any) {
  if (value === '') {
    return callback(new Error('Please enter share holding'));
  } else if (isNaN(Number(value))) {
    return callback(new Error('Please input only numbers'));
  } else if (Number(value) < 0 || Number(value) > 100) {
    return callback(new Error('Share holding must be between 0 to 100'));
  } else if (rule > 100) {
    return callback(
      new Error('Total Share holding must be less than or equal to 100'),
    );
  } else if (!/^[0-9]*(\.[0-9]{0,2})?$/.test(value)) {
    return callback(new Error('Please enter 2 decimals only'));
  } else {
    return callback();
  }
};
const validatePincode = function (rule: any, value: any, callback: any) {
  if (!value) {
    return callback(new Error('Please enter PIN code'));
  } else if (isNaN(Number(value))) {
    return callback(new Error('Please input only numbers'));
  } else if (value.length !== 6) {
    return callback(new Error('PIN code must have 6 digits'));
  } else {
    return callback();
  }
};
const validateUPLPincode = function (rule: any, value: any, callback: any) {
  if (isNaN(Number(value))) {
    return callback(new Error('Please input only numbers'));
  } else if (value.length >= 1 && value.length < 6) {
    return callback(new Error('PIN code must have 6 digits'));
  } else {
    return callback();
  }
};
const validateEmail = function (_rule: any, value: any, callback: any) {
  const regexp = /\b[\w.-]+@[\w.-]+\.\w{2,4}\b/;
  if (!value) {
    return callback(new Error('Please enter a email'));
  } else if (!regexp.test(value)) {
    return callback(new Error('Please enter a valid email'));
  } else {
    return callback();
  }
};

function getOrdinalSuffix(number: any) {
  const suffixes = ['th', 'st', 'nd', 'rd'];
  const lastDigit = number % 10;
  const secondLastDigit = Math.floor(number / 10) % 10;

  // If the last two digits form a number between 11 and 13, use "th"
  if (secondLastDigit === 1 || lastDigit === 0 || lastDigit >= 4) {
    return 'th';
  } else {
    return suffixes[lastDigit] || 'th';
  }
}
const PARTNER_TYPE = {
  DSA: 'DSA',
  CONNECTOR: 'CONNECTOR',
};

const PARTNERS = [
  {
    label: 'DSA',
    value: PARTNER_TYPE.DSA,
  },
  {
    label: 'Connector',
    value: PARTNER_TYPE.CONNECTOR,
  },
];

export default {
  PARTNERS: PARTNERS,
  PARTNER_TYPE: PARTNER_TYPE,
  objectToQueryString: objectToQueryString,
  getOrdinalSuffix: getOrdinalSuffix,
  validatePincode: validatePincode,
  validateEntityOrBusinessName: validateEntityOrBusinessName,
  validateEntity: validateEntity,
  validatePhoneNumber: validatePhoneNumber,
  validateShareHolding: validateShareHolding,
  validateEmail: validateEmail,
  validateRevenue: validateRevenue,
  validateLEI: validateLEI,
  FILE_SIZE_100_MB: 100,
  CREDIT_REPORT_LIMIT_MB: 50,
  DOCUMENT_UPLOAD_LIMIT_MB: 10,
  DMS_DOCUMENT_UPLOAD_LIMIT_MB: 1024,
  RISK_CATEGORY_DATE: '2023-05-01T00:00:00',
  getRoleForStage: {
    dsaStage: ['DSA'],
    camStage: ['CAM'],
    creditReviewStage: ['creditReview'],
    creditApproveStage: ['creditApprove'],
    termsStage: ['terms'],
    qcReviewStage: ['qcReview', 'qcadmin'],
    qcApproveStage: ['qcApprove', 'qcadmin'],
  },
  securedLoanNavList: [
    'DSA Details',
    'Primary Applicant Details',
    'CoApplicant Details',
    'Loan requirement and Terms',
    'Bank Details',
    'Fee Details',
    'Beneficial Owner Details',
    'Insurance Details',
    'Beneficiary Details',
    'Collateral Details',
    'LOD',
    'Sanction Condition Details',
    'Repayment Details',
  ],
  completeStageList: [
    'dsaStage',
    'camStage',
    'creditReviewStage',
    'creditApproveStage',
    'termsStage',
    'fulfilment',
    'manualActivity',
    'fcu',
    'qcReviewStage',
    'qcApproveStage',
    'bookingstage',
    'disbursalstage',
    'welcomeKitStage',
    'deferralUpload',
    'deferralReview',
    'loginDeskStage',
  ],
  nomineeApplicant: {
    id: '',
    name: '',
    dob: '',
    gender: '',
    relationshipWithApplicant: '',
    contacts: [
      {
        type: 'email',
        value: '',

        notify: null,
        priority: 5,
        typeCode: 'PERSONAL',
        countryCode: '+91',
      },
      {
        type: 'phone',
        value: '',

        notify: null,
        priority: 5,
        typeCode: 'PERSONAL',
        countryCode: '+91',
      },
    ],
    address: {
      line1: '',
      state: '',
      pinCode: '',
      country: '',
      city: '',
    },
  },
  individualDetails: {
    applicantType: 'LinkedIndividual',
    individual: {
      firstName: '',
      middleName: '',
      lastName: '',
      dob: '',
      gender: '',
      maritalStatus: 'NA',
      salutation: '',
      designation: null,
      shareHolding: '',
      aadhaarLinked: '',
      aadhaarMatch: '',
    },
    kyc: [
      {
        kycType: 'panCard',
        kycValue: '',
        issuedCountry: 'IN',
      },
      {
        kycType: 'Aadhaar',
        kycValue: '',
        issuedCountry: 'IN',
      },
    ],
    addresses: [
      {
        type: 'CURRES',
        line1: '',
        line2: '',
        city: '',
        state: '',
        country: 'IN',
        pinCode: '',
        priority: 5,
        ownership: null,
      },
      {
        type: 'PER',
        line1: '',
        line2: '',
        city: '',
        state: '',
        country: 'IN',
        pinCode: '',
        priority: 5,
        ownership: null,
      },
      {
        type: 'CORRESPOND',
        line1: '',
        line2: '',
        city: '',
        state: '',
        country: 'IN',
        pinCode: '',
        priority: 5,
        ownership: null,
      },
    ],
    contacts: [
      {
        type: 'phone',
        value: '',
        priority: 5,
        typeCode: 'MOBILE',
        countryCode: '+91',
      },
      {
        type: 'email',
        value: '',
        priority: 5,
        typeCode: 'PERSONAL',
        countryCode: '+91',
      },
    ],
    transitionState: 'loaded',
  },
  isFieldDisabledOnKycVerify: {
    entityName: false,
    proprietorName: false,
    prorietorOption: false,
    businessType: false,
    pan: false,
    gstin: false,
  },
  balanceTransferRules: {
    productType: {
      required: true,
      message: 'Please select a productType',
      trigger: 'change',
    },
    financier: {
      required: true,
      message: 'Please choose a financier',
      trigger: 'change',
    },
    creditCardNumber: {
      required: true,
      message: 'Please enter CardNumber',
      trigger: 'blur',
    },
    accountNumber: {
      required: true,
      message: 'Please enter a account number',
      trigger: 'blur',
    },
    sanctionDate: {
      required: true,
      message: 'Please choose a sanction Date',
      trigger: 'change',
    },
    sanctionAmount: {
      required: true,
      message: 'Please enter a sanctionAmount',
      trigger: 'change',
    },
    paymentAmount: {
      required: true,
      message: 'Please enter payment Amount',
      trigger: 'change',
    },
  },
  dsaRules: {
    dsaCode: {
      required: true,
      message: 'Please choose a DSA Code',
      trigger: 'change',
    },
    branch: {
      required: true,
      message: 'Please choose a Branch',
      trigger: 'change',
    },
    areaSalesManager: {
      required: false,
      message: 'Please choose a Area Sales Manager',
      trigger: 'change',
    },
    salesManager: {
      required: false,
      message: 'Please choose a Sales Manager',
      trigger: 'change',
    },
    productType: {
      required: true,
      message: 'Please choose a ProductType',
      trigger: 'change',
    },
    scheme: {
      required: true,
      message: 'Please choose a Scheme',
      trigger: 'change',
    },
  },
  businessRulesDSA: {
    kyc: [
      {
        kycValue: {
          required: true,
          message: 'Please enter PAN number',
          trigger: 'change',
        },
      },
      {
        kycValue: {
          required: true,
          message: 'Please enter GST number',
          trigger: 'change',
        },
      },
    ],
    business: {
      name: {
        required: true,
        validator: validateEntity,
        trigger: 'change',
      },
      businessName: {
        required: true,
        validator: validateEntityOrBusinessName,
        trigger: 'change',
      },
      type: {
        required: true,
        message: 'Please select entity',
        trigger: 'change',
      },
      registrationDate: {
        required: true,
        message: 'Please pick a date',
        trigger: 'change',
      },
    },
    addresses: [
      {
        line1: {
          required: true,
          message: 'Please enter the operational address (line 1)',
          trigger: 'change',
        },
        line2: {
          required: true,
          message: 'Please enter the operational address (line 2)',
          trigger: 'change',
        },
        city: {
          required: true,
          message: 'Please enter the office address city',
          trigger: 'change',
        },
        state: {
          required: true,
          message: 'Please select a state',
          trigger: 'change',
        },
        pinCode: {
          required: true,
          trigger: 'change',
          validator: validatePincode,
        },
        ownership: {
          required: true,
          message: 'Please select ownership',
          trigger: 'change',
        },
      },
      {
        line1: {
          required: true,
          message: 'Please enter the registered address (line 1)',
          trigger: 'change',
        },
        line2: {
          required: true,
          message: 'Please enter the registered address (line 2)',
          trigger: 'change',
        },
        city: {
          required: true,
          message: 'Please enter the registered address city',
          trigger: 'change',
        },
        state: {
          required: true,
          message: 'Please select a state',
          trigger: 'change',
        },
        pinCode: {
          required: true,
          trigger: 'change',
          validator: validatePincode,
        },
        ownership: {
          required: true,
          message: 'Please select ownership',
          trigger: 'change',
        },
      },
    ],
    contacts: [
      {
        value: {
          required: true,
          trigger: 'change',
          validator: validatePhoneNumber,
        },
      },
      {
        value: {
          required: true,
          trigger: 'change',
          validator: validateEmail,
        },
      },
    ],
    misc: {
      revenue: {
        required: true,
        validator: validateRevenue,
        trigger: 'change',
      },
    },
  },
  businessRules: {
    business: {
      lei: {
        required: false,
        validator: validateLEI,
      },
      registrationDate: {
        required: true,
        message: 'Please enter registration date',
      },
      industrySubType: {
        required: true,
        message: 'Please select sub sector type',
      },
      industryType: {
        required: true,
        message: 'Please select industry type',
      },
      operationDate: {
        required: true,
        message: 'Please enter operation date',
      },
      type: {
        message: 'Please select entity',
      },
      category: {
        message: 'Please select classification',
      },
      msmeType: {
        required: true,
        message: 'Please enter business type',
        trigger: 'change',
      },
      uan: {
        required: true,
        message: 'Please enter UAN/UDYAM number',
        trigger: 'change',
      },
    },
    addresses: [
      {
        line1: {
          required: true,
          message: 'Please enter the company operation address (line 1)',
        },
        line2: {
          required: true,
          message: 'Please enter the company operation address (line 2)',
        },
        city: {
          required: true,
          message: 'Please enter the company operation address city',
        },
        state: {
          required: true,
          message: 'Please enter the company operation address state',
        },
        country: {
          required: true,
          message: 'Please enter the compant opertation country',
        },
        pinCode: {
          required: true,
          validator: validatePincode,
          message: 'Please enter valid pincode',
        },
        ownership: {
          required: true,
          message: 'Please choose a ownership',
        },
      },
      {
        line1: {
          required: true,
          message: 'Please enter the registered address (line 1)',
        },
        line2: {
          required: true,
          message: 'Please enter the registered address (line 2)',
        },
        city: {
          required: true,
          message: 'Please enter the registered address city',
        },
        state: {
          required: true,
          message: 'Please enter the registered address state',
        },
        pinCode: {
          required: true,
          validator: validatePincode,
        },
        ownership: {
          required: true,
          message: 'Please choose a ownership',
        },
      },
    ],
    contacts: [
      {
        value: {
          validator: validatePhoneNumber,
        },
      },
      {
        value: [
          {
            required: true,
            message: 'Please enter email',
          },
          {
            type: 'email',
            message: 'Please enter valid email',
          },
        ],
      },
    ],
    misc: {
      employeeCount: [
        {
          required: true,
          message: 'Please enter employee count',
        },
        {
          min: 0,
          type: 'number',
          message: 'Please enter a positive number',
        },
      ],
      revenue: [
        {
          required: true,
          message: 'Please enter revenue',
        },
        {
          min: 0,
          type: 'number',
          message: 'Please enter a positive amount',
        },
      ],
    },
  },
  addRulesDSA: {
    individual: {
      firstName: {
        required: true,
        message: 'Please enter first name',
      },
      dob: {
        required: true,
        message: 'Please enter date of birth',
      },
      salutation: {
        required: true,
        message: 'Please enter salutation',
      },
    },
    kyc: [
      {
        kycValue: [
          {
            required: true,
            message: 'Please enter PAN Number',
          },
          {
            pattern: '[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}',
            message: 'Invalid PAN Number',
          },
        ],
      },
    ],
    addresses: [
      {
        line1: {
          required: true,
          message: 'Please enter the correspondence address (line 1)',
        },
        line2: {
          required: true,
          message: 'Please enter the correspondence address (line 2)',
        },
        pinCode: {
          required: true,
          validator: validatePincode,
        },
        ownership: {
          required: true,
          message: 'Please select a ownership',
          trigger: 'blur',
        },
        city: {
          required: true,
          message: 'Please enter a city',
        },
        state: {
          required: true,
          message: 'Please select a state',
          trigger: 'change',
        },
      },
      {
        ownership: {
          required: true,
          message: 'Please select a ownership',
        },
        city: {
          required: true,
          message: 'Please enter a city',
        },
        state: {
          required: true,
          message: 'Please select a state',
        },
        pinCode: {
          required: true,
          validator: validatePincode,
        },
      },
    ],
    contacts: [
      {
        value: {
          validator: validatePhoneNumber,
          required: true,
        },
      },
      {
        value: [
          {
            required: true,
            message: 'Please enter email',
          },
          {
            type: 'email',
            message: 'Please enter valid email',
          },
        ],
      },
    ],
  },
  addRules: {
    individual: {
      firstName: {
        required: true,
        message: 'Please enter first name',
      },
      dob: {
        required: true,
        message: 'Please enter date of birth',
      },
      salutation: {
        required: true,
        message: 'Please enter salutation',
      },
      designation: {
        required: true,
        message: 'Please enter designation',
      },
      gender: {
        required: true,
        message: 'Please enter gender',
      },
      shareHolding: {
        required: true,
        validator: validateShareHolding,
      },
    },
    kyc: [
      {
        kycValue: [
          {
            required: true,
            message: 'Please enter PAN Number',
          },
          {
            pattern: '[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}',
            message: 'Invalid PAN Number',
          },
        ],
      },
      {
        kycValue: [
          {
            required: true,
            message: 'Please enter Aadhar Number',
          },
          {
            pattern: '^[0-9]*$',
            message: 'Please input only numbers',
          },
          {
            pattern: '^[0-9]{4}$',
            message: 'Please enter last 4 digit of aadhar',
          },
        ],
      },
    ],
    addresses: [
      {
        line1: {
          required: true,
          message: 'Please enter the current address (line 1)',
        },
        line2: {
          required: true,
          message: 'Please enter the current address (line 2)',
        },
        city: {
          required: true,
          message: 'Please enter a city',
        },
        state: {
          required: true,
          message: 'Please select a state',
        },
        pinCode: {
          required: true,
          validator: validatePincode,
        },
        country: {
          required: true,
          message: 'Please select a country',
        },
        ownership: {
          required: true,
          message: 'Please select a ownership',
        },
      },
      {
        line1: {
          required: true,
          message: 'Please enter the permanent address (line 1)',
        },
        line2: {
          required: true,
          message: 'Please enter the permanent address (line 2)',
        },
        city: {
          required: true,
          message: 'Please enter a city',
        },
        state: {
          required: true,
          message: 'Please select a state',
        },
        pinCode: {
          required: true,
          validator: validatePincode,
        },
        country: {
          required: true,
          message: 'Please select a country',
        },
        ownership: {
          required: true,
          message: 'Please select a ownership',
        },
      },
      {
        line1: {
          required: true,
          message: 'Please enter the correspondence address (line 1)',
        },
        line2: {
          required: true,
          message: 'Please enter the correspondence address (line 2)',
        },
        city: {
          required: true,
          message: 'Please enter a city',
        },
        state: {
          required: true,
          message: 'Please select a state',
        },
        pinCode: {
          required: true,
          validator: validatePincode,
        },
        country: {
          required: true,
          message: 'Please select a country',
        },
        ownership: {
          required: true,
          message: 'Please select a ownership',
        },
      },
    ],
    contacts: [
      {
        value: {
          validator: validatePhoneNumber,
          required: true,
        },
      },
      {
        value: [
          {
            required: true,
            message: 'Please enter email',
          },
          {
            type: 'email',
            message: 'Please enter valid email',
          },
        ],
      },
    ],
  },
  ddeRules: {
    individual: {
      gender: {
        required: true,
        message: 'Please Enter Gender',
        trigger: 'change',
      },
      motherName: {
        required: true,
        message: 'Please Enter Mother Name',
      },
      employer: {
        required: true,
        message: 'Please Enter Employer',
      },
      empCategory: {
        required: true,
        message: 'Please Enter Employer Category',
      },
      employmentType: {
        required: true,
        message: 'Please Enter Employment Type',
      },
      totalWorkEx: {
        required: true,
        message: 'Please Enter total work experience',
      },
    },
    loan: {
      loanType: {
        required: true,
        message: 'Please Enter loan type',
        trigger: 'change',
      },
      enduse: {
        required: true,
        message: 'Please Enter purpose',
      },
      requestedAmount: {
        required: true,
        message: 'Please Enter requested amount',
      },
    },
    misc: {
      income: {
        required: true,
        message: 'Please Enter income',
      },
    },
    references: [
      {
        name: {
          required: true,
          message: 'Please Enter reference name',
        },
        phone: {
          validator: validatePhoneNumber,
          required: true,
        },
      },
      {
        name: {
          required: true,
          message: 'Please Enter reference name',
        },
        phone: {
          validator: validatePhoneNumber,
          required: true,
        },
      },
    ],
    contacts: [
      {
        value: {
          validator: validatePhoneNumber,
          required: true,
        },
      },
      {
        value: [
          {
            required: true,
            message: 'Please enter email',
          },
          {
            type: 'email',
            message: 'Please enter valid email',
          },
        ],
      },
      {
        value: [
          {
            required: true,
            message: 'Please enter official email',
          },
          {
            type: 'email',
            message: 'Please enter valid official email',
          },
        ],
      },
    ],
    addresses: [
      {
        line1: {
          required: false,
          message: 'Please enter the Correspondence address (line 1)',
        },
        line2: {
          required: false,
          message: 'Please enter the Correspondence address (line 2)',
        },
        city: {
          required: false,
          message: 'Please enter a city',
        },
        pinCode: {
          validator: validateUPLPincode,
        },
        country: {
          required: false,
          message: 'Please select a country',
        },
        ownership: {
          required: false,
          message: 'Please select a ownership',
        },
        state: {
          required: false,
          message: 'Please select a state',
        },
      },
      {
        line1: {
          required: false,
          message: 'Please enter the permanent address (line 1)',
        },
        line2: {
          required: false,
          message: 'Please enter the permanent address (line 2)',
        },
        city: {
          required: false,
          message: 'Please enter a city',
        },
        pinCode: {
          validator: validateUPLPincode,
        },
        country: {
          required: false,
          message: 'Please select a country',
        },
        ownership: {
          required: false,
          message: 'Please select a ownership',
        },
        state: {
          required: false,
          message: 'Please select a state',
        },
      },
      {
        line1: {
          required: false,
          message: 'Please enter the correspondence address (line 1)',
        },
        line2: {
          required: false,
          message: 'Please enter the correspondence address (line 2)',
        },
        city: {
          required: false,
          message: 'Please enter a city',
        },
        pinCode: {
          validator: validateUPLPincode,
        },
        country: {
          required: false,
          message: 'Please select a country',
        },
        ownership: {
          required: false,
          message: 'Please select a ownership',
        },
        state: {
          required: false,
          message: 'Please select a state',
        },
      },
      {
        line1: {
          required: true,
          message: 'Please enter the office address (line 1)',
        },
        line2: {
          required: true,
          message: 'Please enter the office address (line 2)',
        },
        city: {
          required: true,
          message: 'Please enter a city',
        },
        state: {
          required: true,
          message: 'Please select a state',
        },
        pinCode: {
          required: true,
          validator: validatePincode,
        },
        country: {
          required: true,
          message: 'Please select a country',
        },
      },
    ],
  },
  ownership: {
    'Self Owned': 'Self Owned',
    'Family Owned': 'Family Owned',
    'Company Owned': 'Company Owned',
    Rented: 'Rented',
  },
  salutation: {
    Mr: 'Mr.',
    Mrs: 'Mrs.',
    Miss: 'Miss.',
  },
  designation: {
    Individual: 'Individual',
    Director: 'Director',
    Proprieter: 'Proprieter',
    'Co-Applicant': 'Co-Applicant',
    Partner: 'Partner',
  },
  gender: {
    M: 'Male',
    F: 'Female',
    T: 'Transgender',
  },
  stageList: {
    dsaDetails: 'DSA Details',
    businessDetails: 'Business Details',
    consent: 'Customer Consent',
    individualDetails: 'Co-Applicant Details',
    loanRequirements: 'Loan Requirements',
    uploadDocuments: 'Upload Documents',
    goodToGo: 'Good To Go',
  },
  businessDetails: {
    business: {
      name: null,
      msmeType: null,
      bussinessType: null,
      type: null,
      category: 'CORPORATE',
      cin: null,
      registrationDate: null,
      operationDate: null,
      industryType: null,
      industrySubType: null,
      cgtmse: null,
      uan: null,
      shareHolding: null,
      lei: null,
    },
    kyc: [
      {
        kycType: 'panCard',
        kycValue: null,
      },
      {
        kycType: 'gstin',
        kycValue: null,
      },
    ],
    addresses: [
      {
        type: 'CORP',
        line1: null,
        line2: null,
        city: null,
        state: null,
        country: 'IN',
        pinCode: null,
        priority: 5,
        ownership: 'Self Owned',
      },
      {
        type: 'REGADD',
        line1: null,
        line2: null,
        city: null,
        state: null,
        country: 'IN',
        pinCode: null,
        priority: 4,
        ownership: 'Self Owned',
      },
    ],
    contacts: [
      {
        type: 'phone',
        value: null,
        priority: 5,
        typeCode: 'OFFICE',
        countryCode: '+91',
      },
      {
        type: 'email',
        value: null,
        priority: 5,
        typeCode: 'OFFICE',
        countryCode: '+91',
      },
    ],
    misc: {
      revenue: null,
      employeeCount: 0,
    },
  },
  newBusinessDetails: {
    applicantType: 'CoApplicant',
    business: {
      name: null,
      businessName: null,
      msmeType: null,
      bussinessType: null,
      type: null,
      category: 'CORPORATE',
      cin: null,
      registrationDate: null,
      operationDate: null,
      industryType: null,
      industrySubType: null,
      cgtmse: null,
      uan: null,
      shareHolding: null,
    },
    kyc: [
      {
        kycType: 'panCard',
        kycValue: null,
      },
      {
        kycType: 'gstin',
        kycValue: null,
      },
    ],
    addresses: [
      {
        type: 'CORP',
        line1: null,
        line2: null,
        city: null,
        state: null,
        country: 'IN',
        pinCode: null,
        priority: 5,
        ownership: '',
      },
      {
        type: 'REGADD',
        line1: null,
        line2: null,
        city: null,
        state: null,
        country: 'IN',
        pinCode: null,
        priority: 4,
        ownership: '',
      },
      {
        type: 'REGADD',
        line1: null,
        line2: null,
        city: null,
        state: null,
        country: 'IN',
        pinCode: null,
        priority: 4,
        ownership: '',
      },
    ],
    contacts: [
      {
        type: 'phone',
        value: null,
        priority: 5,
        typeCode: 'OFFICE',
        countryCode: '+91',
      },
      {
        type: 'email',
        value: null,
        priority: 5,
        typeCode: 'OFFICE',
        countryCode: '+91',
      },
    ],
    misc: {
      revenue: null,
      employeeCount: 0,
    },
  },
  subStage: {
    verification: 'verification',
    docsUpload: 'docsUpload',
    regulatory: 'regulatory',
  },
  state: {
    JK: 'JAMMU & KASHMIR ',
    HP: 'HIMACHAL PRADESH ',
    PB: 'PUNJAB ',
    CH: 'CHANDIGARH',
    UT: 'UTTARAKHAND',
    HR: 'HARYANA ',
    DL: 'DELHI ',
    RJ: 'RAJASTHAN ',
    UP: 'UTTAR PRADESH ',
    BH: 'BIHAR ',
    SK: 'SIKKIM ',
    AR: 'ARUNACHAL PRADESH ',
    NL: 'NAGALAND ',
    MN: 'MANIPUR ',
    MI: 'MIZORAM ',
    TR: 'TRIPURA ',
    ME: 'MEGHALAYA ',
    AS: 'ASSAM ',
    WB: 'WEST BENGAL ',
    JH: 'JHARKHAND ',
    OR: 'ODISHA ',
    CT: 'CHHATTISGARH ',
    MP: 'MADHYA PRADESH ',
    GJ: 'GUJARAT ',
    DD: 'DAMAN & DIU ',
    DN: 'DADAR & NAGAR HAVELI ',
    MH: 'MAHARASHTRA ',
    AP: 'ANDHRA PRADESH ',
    KA: 'KARNATAKA ',
    GA: 'GOA ',
    LD: 'LAKSHADWEEP ',
    KL: 'KERALA ',
    TN: 'TAMILNADU ',
    PY: 'PUDUCHERRY ',
    AN: 'ANDAMAN & NICOBAR ',
    TL: 'TELANGANA ',
  },
  businessType: {
    Micro: 'Micro',
    Small: 'Small',
    Medium: 'Medium',
    'Non-MSME': 'Non-MSME',
  },
  businessEntityType: {
    '7': 'Proprietorship',
    '4': 'Partnership',
    '3': 'Pvt Ltd Company',
    '5': 'LLP',
    '2': 'Ltd Company - unlisted',
  },
  ublBusinessEntityType: {
    '7': 'Proprietorship',
    '4': 'Partnership',
    '3': 'Pvt Ltd Company',
    '5': 'LLP',
    '2': 'Ltd Company - unlisted',
    T1: 'Trust',
  },
  subSector: {
    2: 'Service',
    1: 'Manufacturing',
    18: 'Trader- Retail',
    19: 'Trader- Wholesale',
  },
  uplSideNavBar: [
    'Appform Ownership Details',
    'QDE Details',
    'DDE Details',
    'Co-Applicant Details',
    'Loan Requirements',
    'Bank Details',
    'Insurance Details',
    'Vas Details',
  ],
  ublSideNavList: [
    'DSA Details',
    'Business Details',
    'Co-Applicant Details',
    'Loan Requirements',
    'Bank Details',
    'Vas Details',
  ],
  fodSideNavList: [
    'DSA Details',
    'Business Details',
    'Co-Applicant Details',
    'Loan Requirements',
    'Bank Details',
    'Vas Details',
  ],
  sblSideNavList: [
    'DSA Details',
    'Business Details',
    'Co-Applicant Details',
    'Loan Requirements',
    'Bank Details',
    'Insurance Details',
    'Vas Details',
    'Deferral Document',
    'Disbursal Details',
    'Repayments Details',
    'FCU Details',
  ],
  entity: {
    7: 'Proprietorship',
    4: 'Partnership',
    3: 'Pvt Ltd Company',
    5: 'LLP',
    2: 'Ltd Company - unlisted',
    T1: 'Trust',
  },
  loanTypeMapping: {
    0: 'Other',
    1: 'Auto Loan(Personal)',
    2: 'Housing Loan',
    3: 'Property Loan',
    4: 'Loan against Shares/Securities',
    5: 'Personal Loan',
    6: 'Consumer Loan',
    7: 'Gold Loan',
    8: 'Educational Loan',
    9: 'Loan to Professional',
    10: 'Credit Card',
    11: 'Leasing',
    12: 'Overdraft',
    13: 'Two-Wheeler Loan',
    14: 'Non-funded Credit Facility',
    15: 'Loan against Bank Deposits',
    16: 'Fleet Card',
    17: 'Commercial Vehicle Loan',
    18: 'Telco - Wireless',
    19: 'Telco - Broadband',
    20: 'Telco - Landline',
    31: 'Secured Credit Card',
    32: 'Used Car Loan',
    33: 'Construction Equipment Loan',
    34: 'Tractor Loan',
    35: 'Corporate Credit Card',
    36: 'Kisan Credit Card',
    37: 'Loan on Credit Card',
    38: 'Prime Minister Jan Dhan Yojana - Overdraft',
    39: 'Mudra Loans - Shishu / Kishor / Tarun',
    43: 'Microfinance - Others',
    44: 'Pradhan Mantri Awas Yojana - Credit Link Subsidy Scheme MAY CLSS',
    45: 'P2P Personal Loan',
    46: 'P2P Auto Loan',
    47: 'P2P Education Loan',
    51: 'Business Loan - General',
    52: 'Business Loan - Priority Sector - Small Business',
    53: 'Business Loan - Priority Sector - Agriculture',
    54: 'Business Loan - Priority Sector - Others',
    55: 'Business Non-Funded Credit Facility - General',
    56: 'Business Non-Funded Credit Facility - Priority Sector - Small Business',
    57: 'Business Non-Funded Credit Facility - Priority Sector - Agriculture',
    58: 'Business Non-Funded Credit Facility - Priority Sector - Others',
    59: 'Business Loans against Bank Deposits',
    60: 'Staff Loan',
    61: 'Business Loan - Unsecured',
  },

  adminRoles: [
    'superadmin',
    'qcreview',
    'qcapprove',
    'qcadmin',
    'qcapprovecolending',
    'creditadmin',
    'productrole',
    'creditrole',
    'auditrole',
    'viewadmin',
    'dashboardviewrole',
  ],
  fetchUsersForRole: {
    qcadmin: 'qcuser',
    creditadmin: 'qcuser',
    viewadmin: 'qcuser',
  },
  dashboardStageApproval: {
    qcadmin: ['qcstage', 'creditstage'],
    opsadmin: ['qcstage', 'creditstage'],
    creditadmin: ['creditstage'],
  },
  appForEditableRolesRegex:
    /qcadmin|qcApprove|qcReview|qcApproveColending|superadmin/i,
  smeDirectLpc: ['PCL', 'SMB', 'UDC', 'LKB', 'MNC', 'AFB', 'PCT'],
  appFormEditablePaths: [
    /* eslint-disable */
    '\\/?creditLine\\/creditLimit\\/?',
    '\\/?creditLine\\/dateOfCreditLimit\\/?',
    '\\/?creditLine\\/expiryDateOfCreditLimit\\/?',
    '\\/?loan\\/amount\\/?',
    '\\/?loan\\/loanIntRate\\/?',
    '\\/?loan\\/tenure\\/?',
    '\\/?loan\\/overAllLoanAmount\\/?',
    '\\/?loan\\/loanStartDate\\/?',
    '\\/?linkedIndividuals\\/\\S+\\/individual\\/firstName\\/?',
    '\\/?linkedIndividuals\\/\\S+\\/individual\\/middleName\\/?',
    '\\/?linkedIndividuals\\/\\S+\\/individual\\/lastName\\/?',
    '\\/?linkedIndividuals\\/\\S+\\/individual\\/gender\\/?',
    '\\/?linkedIndividuals\\/\\S+\\/individual\\/fatherName\\/?',
    '\\/?linkedIndividuals\\/\\S+\\/addresses\\/\\S+\\/line1\\/?',
    '\\/?linkedIndividuals\\/\\S+\\/addresses\\/\\S+\\/line2\\/?',
    '\\/?linkedIndividuals\\/\\S+\\/addresses\\/\\S+\\/city\\/?',
    '\\/?linkedIndividuals\\/\\S+\\/addresses\\/\\S+\\/state\\/?',
    '\\/?linkedIndividuals\\/\\S+\\/addresses\\/\\S+\\/country\\/?',
    '\\/?linkedIndividuals\\/\\S+\\/addresses\\/\\S+\\/pinCode\\/?',
    '\\/?linkedIndividuals\\/\\S+\\/individual\\/dob\\/?',
    '\\/?linkedBusiness\\/addresses\\/\\S+\\/line1\\/?',
    '\\/?linkedBusiness\\/addresses\\/\\S+\\/line2\\/?',
    '\\/?linkedBusiness\\/addresses\\/\\S+\\/city\\/?',
    '\\/?linkedBusiness\\/addresses\\/\\S+\\/state\\/?',
    '\\/?linkedBusiness\\/addresses\\/\\S+\\/pinCode\\/?',
    '\\/linkedBusiness\\/business\\/name',
    '\\/?linkedBusiness\\/business\\/industryType\\/?',
    '\\/?linkedBusiness\\/business\\/registrationDate\\/?',
    /* eslint-enable */
  ],
  uanConstants: {
    url: 'verify/uan',
    successMessage: 'Success : UAN verified successfully',
    failureMessage:
      'Failure : UAN is not verified. Please resolve from verification tab in Credit Review stage',
  },
  udyamConstants: {
    url: 'verify/udyam',
    successMessage: 'Success : UDYAM verified successfully',
    failureMessage:
      'Failure : UDYAM is not verified. Please resolve from verification tab in Credit Review stage',
  },
  beneficiaryList: [
    {
      value: 'AXIS BANK LTD',
      name: 'AXIS BANK LTD <LOAN ACCOUNT NO>',
    },
    {
      value: 'BAJAJ FINANCE LTD',
      name: 'BAJAJ FINANCE LTD',
    },
    {
      value: 'CANARA BANK',
      name: 'CANARA BANK <LOAN ACCOUNT NO>',
    },
    {
      value: 'IDFC FIRST BANK LTD',
      name: 'IDFC FIRST BANK LTD <LOAN ACCOUNT NO>',
    },
    {
      value: 'CLIX CAPITAL SERVICES PVT LTD',
      name: 'CLIX CAPITAL SERVICES PVT LTD',
    },
    {
      value: 'CITI BANK',
      name: 'CITI BANK <LOAN ACCOUNT NO>',
    },
    {
      value: 'HDFC BANK LTD',
      name: 'HDFC BANK LTD <LOAN ACCOUNT NO>',
    },
    {
      value: 'HDB FINANCIAL SERVICES LTD',
      name: 'HDB FINANCIAL SERVICES LTD',
    },
    {
      value: 'SMFG INDIA CREDIT COMPANY LTD',
      name: 'SMFG INDIA CREDIT COMPANY LTD',
    },
    {
      value: 'INDUSIND BANK LTD',
      name: 'INDUSIND BANK LTD <LOAN ACCOUNT NO>',
    },
    {
      value: 'ICICI BANK',
      name: 'ICICI BANK <LOAN ACCOUNT NO>',
    },
    {
      value: 'KOTAK MAHINDRA BANK LTD',
      name: 'KOTAK MAHINDRA BANK LTD <LOAN ACCOUNT NO>',
    },
    {
      value: 'TATA CAPITAL FINANCIAL SERVICES LTD',
      name: 'TATA CAPITAL FINANCIAL SERVICES LTD',
    },
    {
      value: 'STANDARD CHARTERED BANK',
      name: 'STANDARD CHARTERED BANK <LOAN ACCOUNT NO>',
    },
    {
      value: 'STATE BANK OF INDIA',
      name: 'STATE BANK OF INDIA <LOAN ACCOUNT NO>',
    },
    {
      value: 'HSBC',
      name: 'HSBC <LOAN ACCOUNT NO>',
    },
    {
      value: 'RBL BANK LTD',
      name: 'RBL BANK LTD <LOAN ACCOUNT NO>',
    },
    {
      value: 'DCB BANK LTD',
      name: 'DCB BANK LTD <LOAN ACCOUNT NO>',
    },
    {
      value: 'FEDERAL BANK',
      name: 'FEDERAL BANK <LOAN ACCOUNT NO>',
    },
    {
      value: 'YES BANK LTD',
      name: 'YES BANK LTD <LOAN ACCOUNT NO>',
    },
    {
      value: 'TAB CAPITAL LTD',
      name: 'TAB CAPITAL LTD',
    },
    {
      value: 'CITI CO-OP BANK LTD',
      name: 'CITI CO-OP BANK LTD <LOAN ACCOUNT NO>',
    },
    {
      value: 'ADITYA BIRLA FINANCE LTD',
      name: 'ADITYA BIRLA FINANCE LTD <LOAN ACCOUNT NO>',
    },
    {
      value: 'VOLITION CREDIT & HOLDINGS PVT LTD',
      name: 'VOLITION CREDIT & HOLDINGS PVT LTD',
    },
    {
      value: 'RELIANCE CAPITAL LTD',
      name: 'RELIANCE CAPITAL LTD <LOAN ACCOUNT NO>',
    },
    {
      value: 'THANA JANANTA SAHAKARI BANK LTD',
      name: 'THANA JANATA SAHAKARI BANK LTD <LOAN ACCOUNT NO>',
    },
    {
      value: 'INCRED FINANCIAL SERVICES LTD',
      name: 'INCRED FINANCIAL SERVICES LTD',
    },
    {
      value: 'NAVI FINANACE',
      name: 'AS PER FORECLOSURE LETTER',
    },
  ],
  printingLocations: {
    MUM1: 'KSF Mumbai',
    '003': 'AHMEDABAD',
    '006': 'CHENNAI',
    '081': 'COCHIN',
    '008': 'HYDERABAD',
    '043': 'INDORE',
    '010': 'JAIPUR',
    '057': 'JODHPUR',
    '037': 'PUNE',
    '047': 'SURAT',
    '477': 'TRICHY ROAD',
    '013': 'VADODARA',
    '069': 'VIJAYAWADA',
    '276': 'AGARTALA',
    '086': 'AGRA',
    '215': 'AHMEDNAGAR',
    '749': 'AKOLA',
    '286': 'ALLAHABAD',
    '587': 'AMBIKAPUR',
    '179': 'AMRITSAR',
    '332': 'ANANTAPUR',
    '328': 'ANDHERI EAST',
    '288': 'ANGUL',
    '458': 'ANKLESHWAR',
    '016': 'ANNA NAGAR',
    '165': 'AURANGABAD',
    '221': 'BALASORE',
    '009': 'BANGALORE',
    '205': 'BAREILLY',
    '138': 'BELGAUM',
    '267': 'BELLARY',
    '398': 'BHADRAK',
    '242': 'BHATINDA',
    '200': 'BHAVNAGAR',
    '214': 'BHILAI',
    '241': 'BHILWARA',
    '044': 'BHOPAL',
    '024': 'BHUBANESHWAR',
    '525': 'BIJAPUR',
    '335': 'BIKANER',
    '164': 'BILASPUR',
    '531': 'BITTAN MARKET BRANCH',
    '230': 'BKC',
    '387': 'BORING ROAD PATNA',
    '073': 'BUNDGARDEN',
    '1765': 'BY PASS ROAD MADURAI',
    '861': 'CBD BELAPUR',
    '274': 'CENTRALISED COLLECTION AND PAYMENT HUB',
    '041': 'CHANDIGARH',
    '651': 'CHANDRAPUR',
    '063': 'CHEMBUR',
    '670': 'CHINDWARA',
    '217': 'CHINNAMIRAM',
    '091': 'CUTTACK',
    '225': 'DAVANGERE',
    '093': 'DEHRADUN',
    '007': 'DELHI1',
    '456': 'DEWAS',
    '603': 'DHARWAD',
    '378': 'DIMAPUR',
    '352': 'DINDIGUL',
    '131': 'DLF-GURGAON',
    '213': 'DURGAPUR',
    '844': 'ELURU',
    '118': 'ERODE',
    '348': 'FARIDABAD',
    '648': 'FATEHABAD (HARYANA)',
    '178': 'GANDHIDHAM',
    '424': 'GEORGE TOWN',
    '029': 'GHATKOPAR',
    '095': 'GHAZIABAD',
    '815': 'GONDIA',
    '331': 'GORAKHPUR',
    '624': 'GREATER NOIDA',
    '342': 'GULBARGA',
    '070': 'GUNTUR',
    '056': 'GURGAON',
    '140': 'GUWAHATI',
    '158': 'GWALIOR',
    '261': 'HALDIA',
    '358': 'HARIDWAR',
    '260': 'HISSAR',
    '618': 'HOSPET (KARNATAKA)',
    '535': 'HOSUR',
    '129': 'HUBLI',
    '379': 'ITANAGAR',
    '128': 'JABALPUR',
    '155': 'JALANDHAR',
    '174': 'JALGAON',
    '487': 'JALNA',
    '147': 'JAMMU',
    '175': 'JAMNAGAR',
    '012': 'JAMSHEDPUR',
    '207': 'JANAKPURI',
    '052': 'JAYANAGAR',
    '725': 'JIND',
    '1113': 'KADAPA',
    '76': 'KAKINADA',
    '438': 'KALPANA SQUARE',
    '574': 'KALYAN WEST',
    '159': 'KANNUR',
    '133': 'KANPUR',
    '290': 'KARIMNAGAR',
    '394': 'KARNAL',
    '123': 'KARUR',
    '190': 'KHARAGPUR',
    '2986': 'KK NAGAR MADUR MAD TN',
    '814': 'KOLAR',
    '134': 'KOLHAPUR',
    '005': 'KOLKATA',
    '228': 'KOTA',
    '051': 'KOTTAYAM',
    '136': 'KOZHIKODE',
    '244': 'KURNOOL',
    '314': 'KURUKSHETRA',
    '588': 'LOK VIHAR (NEW DELHI)',
    '53': 'Lucknow',
    '109': 'MADURAI',
    '389': 'MALDA',
    '796': 'MANDYA',
    '077': 'MANGALORE',
    '121': 'MARGOA',
    '177': 'MEERUT',
    '130': 'MEHSANA',
    '324': 'MILLER GANJ',
    '085': 'MOHALI',
    '282': 'MORADABAD',
    '108': 'MULUND',
    '004': 'MUMBAI (FORT)',
    '460': 'MUNDRA',
    '151': 'MYSORE',
    '048': 'NAGPUR',
    '318': 'NANDED',
    '3706': 'NANJANGUD C3205 KT',
    '149': 'NAPEAN SEA ROAD',
    '115': 'NASHIK',
    '152': 'NELLORE',
    '291': 'NIZAMABAD',
    '022': 'NOIDA',
    '691': 'PALARIVATTOM KERALA',
    '067': 'PANCHKULA',
    '078': 'PANJIM',
    '713': 'PARADIP',
    '195': 'PATIALA',
    '142': 'PATNA',
    '103': 'PIMPRI',
    '209': 'PONDICHERRY',
    '139': 'RAIPUR',
    '107': 'RAJAHMUNDRY',
    '087': 'RAJKOT',
    '106': 'RANCHI',
    '563': 'RSPURAM',
    '176': 'RUDRAPUR',
    '170': 'SALEM',
    '306': 'SAMBALPUR',
    '503': 'SAPNA SANGITA ROAD',
    '188': 'SATARA',
    '202': 'SATNA',
    '361': 'SECTOR-18 NOIDA',
    '1035': 'SEONI',
    '050': 'SHIMLA',
    '362': 'SHIMOGA',
    '763': 'SIKAR',
    '271': 'SILCHAR',
    '666': 'SOLAN',
    '266': 'SOLAPUR',
    '675': 'SONIPAT',
    '184': 'SRI GANGANAGAR',
    '536': 'SRIKAKULAM',
    '326': 'SURENDRANAGAR',
    '719': 'TALCHER',
    '584': 'TALLI HALDWANI',
    '596': 'TEZPUR',
    '061': 'THANE',
    '046': 'THRISUR',
    '382': 'TINSUKIA',
    '258': 'TIRUNELVELI',
    '1018': 'TIRUPATI',
    '210': 'TIRUPUR',
    '137': 'TRICHY',
    '113': 'TRIVANDRUM',
    '343': 'TUMKUR',
    '105': 'TUTICORIN',
    '097': 'UDAIPUR',
    '181': 'UDUPI',
    '111': 'VAPI',
    '287': 'VARANASI',
    '072': 'VASHI',
    '523': 'VELLORE',
    '568': 'VIJAYANAGAR(MP)',
    '369': 'VISAKHAPATNAM',
    '614': 'VIZIANAGARAM (ANDHRA PRADESH)',
    '292': 'WARANGAL',
    '581': 'YAMUNANAGAR',
    '488': 'YAVATMAL',
    '094': 'YELAHANKA',
    BANG1: 'KSFBANGALORE',
    KISETSUHUB: 'KISETSU SAISON FINANCE INDIA PRIVATE LIMITED Hub',
    DEL1: 'KSFDELHI',
  },

  CaseStatusFCU: {
    OP: 'Open',
    WIP: 'Work in Progress',
    WIP_RW: 'WIP - Rework',
    RR: 'Report Received',
    CL: 'Closed',
  },
  CaseStatusFI: {
    NI: 'Not Initiated',
    OP: 'Open',
    WIP: 'Work in Progress',
    WIP_RW: 'WIP - Rework',
    RR: 'Report Received',
    CL: 'Closed',
  },

  VerdictStatusofFCU: {
    PENDING: 'Pending',
    NEGATIVE: 'Negative',
    POSITIVE: 'Positive',
    CNV: 'Could Not Verify', //Could Not Verify
    CREDIT_REFER: 'Credit Refer',
    FRAUD: 'Fraud',
  },
  appStatusofFI: {
    NI: 'Not Initiated',
    WIP: 'Work in Progress',
    CL: 'Closed',
    ATV: 'Assigned to Vendor',
    CP: 'Completed',
  },
  appStatusFCU: {
    SCREENED: 'Screened',
    SAMPLED: 'Sampled',
    NI: 'Not Initiated',
  },
  locality: {
    OGL: 'OGL',
    LOCAL: 'Local',
    EXTERIOR: 'Exterior',
  },

  CCFiniciar: [
    {
      value: 'KOTAK MAHINDRA BANK CARD',
      name: 'KOTAK MAHINDRA BANK CARD A/C <XXXX XXXX XXXX XXXX>',
    },
    {
      value: 'HDFC BANK CARD',
      name: 'HDFC BANK CARD A/C <XXXX XXXX XXXX XXXX>',
    },
    {
      value: 'CITI BANK CREDIT CARD',
      name: 'CITI BANK CREDIT CARD NO <XXXX XXXX XXXX XXXX>',
    },
    {
      value: 'SBI CREDIT CARD',
      name: 'SBI CREDIT CARD <XXXX XXXX XXXX XXXX>',
    },
    {
      value: 'ICICI BANK CARD',
      name: 'ICICI BANK CREDIT CARD NO <XXXX XXXX XXXX XXXX>',
    },
    {
      value: 'AXIS BANK CARD',
      name: 'AXIS BANK CARD NO. <XXXX XXXX XXXX XXXX>',
    },
    {
      value: 'STANDARD CHARTERED BANK CARD',
      name: 'STANDARD CHARTERED BANK CARD NO. <XXXX XXXX XXXX XXXX>',
    },
    {
      value: 'INDUSIND BANK CREDIT CARD',
      name: 'INDUSIND BANK CREDIT CARD NO <XXXX XXXX XXXX XXXX>',
    },
    {
      value: 'AEBC CARD',
      name: 'AEBC CARD NO. <XXXX XXXX XXXX XXXX>',
    },
    {
      value: 'HSBC CREDIT CARD',
      name: 'HSBC CREDIT CARD <XXXX XXXX XXXX XXXX>',
    },
    {
      value: 'DHANI CREDIT CARD',
      name: 'AS PER BANK LETTER',
    },
    {
      value: 'YES BANK LTD CREDIT CARD',
      name: 'YES BANK LTD CREDIT CARD NO <XXXX XXXX XXXX XXXX>',
    },
  ],
  documentList: [
    {
      label: 'Resi visit',
      id: 'RESI_VISIT',
    },
    {
      label: 'Office visit',
      id: 'OFFICE_VISIT',
    },
    {
      label: 'PAN Card',
      id: 'PAN_CARD',
    },
    {
      label: 'Aadhaar Card',
      id: 'AADHAAR_CARD',
    },
    {
      label: 'Driving License',
      id: 'DRIVING_LICENSE',
    },
    {
      label: 'Passport',
      id: 'PASSPORT',
    },
    {
      label: 'Voter ID',
      id: 'VOTER_ID',
    },
    {
      label: 'GAS Bill',
      id: 'GAS_BILL',
    },
    {
      label: 'Udyog Aadhaar',
      id: 'UDYOG_AADHAAR',
    },
    {
      label: 'MSME Certificate',
      id: 'MSME_CERTIFICATE',
    },
    {
      label: 'Rental Agreement',
      id: 'RENTAL_AGREEMENT',
    },
    {
      label: 'Payslip',
      id: 'PAYSLIP',
    },
    {
      label: 'ITR',
      id: 'ITR',
    },

    {
      label: 'Financials',
      id: 'FINANCIALS',
    },

    {
      label: 'Bank Statement',
      id: 'BANK_STATEMENT',
    },

    {
      label: 'GST 3 B',
      id: 'GST_3B',
    },
    {
      label: 'GST',
      id: 'GST',
    },

    {
      label: 'Mobile Bill',
      id: 'MOBILE_BILL',
    },
    {
      label: 'E Bill',
      id: 'E_Bill',
    },
    {
      label: 'HR Letter',
      id: 'HR_Letter',
    },
    {
      label: 'Others if any',
      id: 'OTHER',
    },
    {
      label: 'Trade/Business Certificate',
      id: 'TRADE_BUSINESS_CERTIFICATE',
    },
  ],
  postTermsStage: [
    'qcReviewStage',
    'qcApproveStage',
    'fcu',
    'deferralUpload',
    'deferralReview',
    'manualActivity',
    'welcomeKitStage',
    'fulfilment',
    'disbursalstage',
    'bookingstage',
  ],
};
