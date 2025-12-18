import {
  AppFlow,
  CkycFlow,
  GreenChannelAppStates,
  GreenChannelManualReview,
  SearchBy,
  VkycFlow,
} from '@/components/appFormDashboard/FilterTypes';

export const ADMIN_ROLES = [
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
];

export const searchByOptions: SearchBy = {
  individualName: 'Individual Applicant',
  businessName: 'Business Entity',
  appFormId: 'App ID',
  partnerLoanId: 'Partner LID',
  appFormRefId: 'App Reference ID',
};

export const greenChannelAppStates: GreenChannelAppStates = {
  manualReview: 'Manual Review',
  approved: 'Approved',
  techIssue: 'Tech Issue',
};

/*TODO SHOW THIS*/
export const reviewTypeOptions: Omit<GreenChannelManualReview, 'techIssue'> = {
  manualReview: 'Manual Review',
  autoReview: 'Auto Review',
};

export const ckycOptions: CkycFlow = {
  ckyc: 'CKYC',
  nonckyc: 'Non CKYC',
};

export const vkycoptions: VkycFlow = {
  vkyc: 'VKYC',
  nonvkyc: 'Non VKYC',
};
export const appflowOptions: AppFlow = {
  greenchannel: 'Green Channel',
  nongreenchannel: 'Non Green Channel',
};

export const allChannels: string[] = ['ZM', 'PS', 'CF', 'ES', 'MT'];

export const allStatusOptions: { key: string; label: string }[] = [
  {
    key: `MCU_IN_PROGRESS`,
    label: `MCU in Progress`,
  },
  {
    key: `FCU_IN_PROGRESS`,
    label: `FCU in Progress`,
  },
  {
    key: `SALES_DESK_IN_PROGRESS`,
    label: `Sales Desk in Progress`,
  },
  {
    key: `SALES_DESK_COMPLETED`,
    label: `Sales Desk Complete`,
  },
  {
    key: `inferencePass`,
    label: `Inference Pass`,
  },
  { key: 'QC_IN_PROGRESS', label: 'QC in Progress' },
  { key: 'QC_COMPLETE', label: 'QC Complete' },
  { key: 'QC_ON_HOLD', label: 'QC on hold' },
  { key: 'QC_FAILED', label: 'QC failed' },
  { key: 'CREDIT_IN_PROGRESS', label: 'Credit in Progress' },
  { key: 'CREDIT_COMPLETE', label: 'Credit Complete' },
  { key: 'CREDIT_ON_HOLD', label: 'Credit on hold' },
  { key: 'CREDIT_FAILED', label: 'Credit failed' },
  { key: 'DISBURSAL_IN_PROGRESS', label: 'Disbursal in Progress' },
  { key: 'DISBURSAL_COMPLETE', label: 'Disbursal Complete' },
  { key: 'DISBURSAL_ON_HOLD', label: 'Disbursal on hold' },
  { key: 'DISBURSAL_FAILED', label: 'Disbursal failed' },
  { key: 'DSA_IN_PROGRESS', label: 'Dsa in Progress' },
  { key: 'DSA_COMPLETE', label: 'Dsa Complete' },
  { key: 'DSA_ON_HOLD', label: 'Dsa on hold' },
  { key: 'DSA_FAILED', label: 'Dsa failed' },
  { key: 'CAM_IN_PROGRESS', label: 'Cam in Progress' },
  { key: 'CAM_COMPLETE', label: 'Cam Complete' },
  { key: 'CAM_ON_HOLD', label: 'Cam on hold' },
  { key: 'CAM_FAILED', label: 'Cam failed' },
  { key: 'QC_REVIEW_IN_PROGRESS', label: 'Qc_review in Progress' },
  { key: 'QC_REVIEW_COMPLETE', label: 'Qc_review Complete' },
  { key: 'QC_REVIEW_ON_HOLD', label: 'Qc_review on hold' },
  { key: 'QC_REVIEW_FAILED', label: 'Qc_review failed' },
  {
    key: 'DEFERRAL_BOOKING_UPLOAD_IN_PROGRESS',
    label: 'Deferral_booking_upload in Progress',
  },
  {
    key: 'DEFERRAL_BOOKING_UPLOAD_COMPLETE',
    label: 'Deferral_booking_upload Complete',
  },
  {
    key: 'DEFERRAL_BOOKING_UPLOAD_ON_HOLD',
    label: 'Deferral_booking_upload on hold',
  },
  {
    key: 'DEFERRAL_BOOKING_UPLOAD_FAILED',
    label: 'Deferral_booking_upload failed',
  },
  {
    key: 'DEFERRAL_BOOKING_REVIEW_IN_PROGRESS',
    label: 'Deferral_booking_review in Progress',
  },
  {
    key: 'DEFERRAL_BOOKING_REVIEW_COMPLETE',
    label: 'Deferral_booking_review Complete',
  },
  {
    key: 'DEFERRAL_BOOKING_REVIEW_ON_HOLD',
    label: 'Deferral_booking_review on hold',
  },
  {
    key: 'DEFERRAL_BOOKING_REVIEW_FAILED',
    label: 'Deferral_booking_review failed',
  },
  { key: 'QC_APPROVE_IN_PROGRESS', label: 'Qc_approve in Progress' },
  { key: 'QC_APPROVE_COMPLETE', label: 'Qc_approve Complete' },
  { key: 'QC_APPROVE_ON_HOLD', label: 'Qc_approve on hold' },
  { key: 'QC_APPROVE_FAILED', label: 'Qc_approve failed' },
  { key: 'CREDIT_REVIEW_IN_PROGRESS', label: 'Credit_review in Progress' },
  { key: 'CREDIT_REVIEW_COMPLETE', label: 'Credit_review Complete' },
  { key: 'CREDIT_REVIEW_ON_HOLD', label: 'Credit_review on hold' },
  { key: 'CREDIT_REVIEW_FAILED', label: 'Credit_review failed' },
  { key: 'CREDIT_APPROVE_IN_PROGRESS', label: 'Credit_approve in Progress' },
  { key: 'CREDIT_APPROVE_COMPLETE', label: 'Credit_approve Complete' },
  { key: 'CREDIT_APPROVE_ON_HOLD', label: 'Credit_approve on hold' },
  { key: 'CREDIT_APPROVE_FAILED', label: 'Credit_approve failed' },
  { key: 'TERMS_IN_PROGRESS', label: 'Terms in Progress' },
  { key: 'TERMS_COMPLETE', label: 'Terms Complete' },
  { key: 'TERMS_ON_HOLD', label: 'Terms on hold' },
  { key: 'TERMS_FAILED', label: 'Terms failed' },
  {
    key: 'SANCTION_APPROVAL_IN_PROGRESS',
    label: 'Sanction_approval in Progress',
  },
  { key: 'SANCTION_APPROVAL_COMPLETE', label: 'Sanction_approval Complete' },
  { key: 'SANCTION_APPROVAL_ON_HOLD', label: 'Sanction_approval on hold' },
  { key: 'SANCTION_APPROVAL_FAILED', label: 'Sanction_approval failed' },
  { key: 'FULFILMENT_IN_PROGRESS', label: 'Fulfilment in Progress' },
  { key: 'FULFILMENT_COMPLETE', label: 'Fulfilment Complete' },
  { key: 'WELCOME_KIT_IN_PROGRESS', label: 'Welcome_kit in Progress' },
  { key: 'WELCOME_KIT_COMPLETED', label: 'Welcome_kit Complete' },
  { key: 'DEFERRAL_REVIEW_IN_PROGRESS', label: 'Deferral_review in Progress' },
  { key: 'DEFERRAL_REVIEW_COMPLETED', label: 'Deferral_review Complete' },
  { key: 'DEFERRAL_UPLOAD_IN_PROGRESS', label: 'Deferral_upload in Progress' },
  { key: 'DSA_QDE_IN_PROGRESS', label: 'Dsa_qde in Progress' },
  { key: 'DSA_QDE_COMPLETE', label: 'Dsa_qde Complete' },
  { key: 'DSA_DDE_IN_PROGRESS', label: 'Dsa_dde in Progress' },
  { key: 'DSA_DDE_COMPLETE', label: 'Dsa_dde Complete' },
  { key: 'LOGIN_DESK_IN_PROGRESS', label: 'Login_desk in Progress' },
  { key: 'LOGIN_DESK_COMPLETE', label: 'Login_desk Complete' },
  { key: 'LOGIN_DESK_ON_HOLD', label: 'Login_desk on hold' },
  { key: 'LOGIN_DESK_FAILED', label: 'Login_desk failed' },
  {
    key: 'SANCTION_LETTER_INITIATION_IN_PROGRESS',
    label: 'Sanction_letter_initiation in Progress',
  },
  {
    key: 'SANCTION_LETTER_INITIATION_COMPLETE',
    label: 'Sanction_letter_initiation Complete',
  },
  {
    key: 'SANCTION_LETTER_INITIATION_ON_HOLD',
    label: 'Sanction_letter_initiation on hold',
  },
  {
    key: 'SANCTION_LETTER_INITIATION_FAILED',
    label: 'Sanction_letter_initiation failed',
  },
  {
    key: 'DISBURSAL_REQUEST_MAKER_IN_PROGRESS',
    label: 'Disbursal_request_maker in Progress',
  },
  {
    key: 'DISBURSAL_REQUEST_MAKER_COMPLETE',
    label: 'Disbursal_request_maker Complete',
  },
  {
    key: 'DISBURSAL_REQUEST_MAKER_ON_HOLD',
    label: 'Disbursal_request_maker on hold',
  },
  {
    key: 'DISBURSAL_REQUEST_MAKER_FAILED',
    label: 'Disbursal_request_maker failed',
  },
  {
    key: 'DISBURSAL_REQUEST_CHECKER_IN_PROGRESS',
    label: 'Disbursal_request_checker in Progress',
  },
  {
    key: 'DISBURSAL_REQUEST_CHECKER_COMPLETE',
    label: 'Disbursal_request_checker Complete',
  },
  {
    key: 'DISBURSAL_REQUEST_CHECKER_ON_HOLD',
    label: 'Disbursal_request_checker on hold',
  },
  {
    key: 'DISBURSAL_REQUEST_CHECKER_FAILED',
    label: 'Disbursal_request_checker failed',
  },
  {
    key: 'DISBURSAL_REQUEST_APPROVER_IN_PROGRESS',
    label: 'Disbursal_request_approver in Progress',
  },
  {
    key: 'DISBURSAL_REQUEST_APPROVER_COMPLETE',
    label: 'Disbursal_request_approver Complete',
  },
  {
    key: 'DISBURSAL_REQUEST_APPROVER_ON_HOLD',
    label: 'Disbursal_request_approver on hold',
  },
  {
    key: 'DISBURSAL_REQUEST_APPROVER_FAILED',
    label: 'Disbursal_request_approver failed',
  },
  {
    key: 'DISBURSAL_REQUEST_AUTHORIZER_IN_PROGRESS',
    label: 'Cheque_Handover_Stage in Progress',
  },
  {
    key: 'DISBURSAL_REQUEST_AUTHORIZER_COMPLETE',
    label: 'Cheque_Handover_Stage Complete',
  },
  {
    key: 'DISBURSAL_REQUEST_AUTHORIZER_ON_HOLD',
    label: 'Cheque_Handover_Stage on hold',
  },
  {
    key: 'DISBURSAL_REQUEST_AUTHORIZER_FAILED',
    label: 'Cheque_Handover_Stage failed',
  },
  { key: 'BOOKING_IN_PROGRESS', label: 'Booking in Progress' },
  { key: 'BOOKING_COMPLETE', label: 'Booked' },
  { key: 'BOOKING_ON_HOLD', label: 'Booking on hold' },
  { key: 'BOOKING_FAILED', label: 'Booking failed' },
  {
    key: 'DEFERRAL_APPROVE_IN_PROGRESS',
    label: 'Deferral_approve in Progress',
  },
  { key: 'DEFERRAL_APPROVE_COMPLETE', label: 'Deferral_approve Complete' },
  { key: 'DEFERRAL_APPROVE_ON_HOLD', label: 'Deferral_approve on hold' },
  { key: 'DEFERRAL_APPROVE_FAILED', label: 'Deferral_approve failed' },
  { key: 'INITIAL_DETAILS_IN_PROGRESS', label: 'Initial_details in Progress' },
  { key: 'INITIAL_DETAILS_COMPLETE', label: 'Initial_details Complete' },
  { key: 'INITIAL_DETAILS_ON_HOLD', label: 'Initial_details on hold' },
  { key: 'INITIAL_DETAILS_FAILED', label: 'Initial_details failed' },
  { key: 'PD_IN_PROGRESS', label: 'Pd in Progress' },
  { key: 'PD_COMPLETE', label: 'Pd Complete' },
  { key: 'PD_ON_HOLD', label: 'Pd on hold' },
  { key: 'PD_FAILED', label: 'Pd failed' },
  { key: 'BD_IN_PROGRESS', label: 'Bd in Progress' },
  { key: 'BD_COMPLETE', label: 'Bd Complete' },
  { key: 'BD_ON_HOLD', label: 'Bd on hold' },
  { key: 'BD_FAILED', label: 'Bd failed' },
  { key: 'BANKING_IN_PROGRESS', label: 'Banking in Progress' },
  { key: 'BANKING_COMPLETE', label: 'Banking Complete' },
  { key: 'BANKING_ON_HOLD', label: 'Banking on hold' },
  { key: 'BANKING_FAILED', label: 'Banking failed' },
  {
    key: 'ADDITIONAL_DETAILS_IN_PROGRESS',
    label: 'Additional_details in Progress',
  },
  { key: 'ADDITIONAL_DETAILS_COMPLETE', label: 'Additional_details Complete' },
  { key: 'ADDITIONAL_DETAILS_ON_HOLD', label: 'Additional_details on hold' },
  { key: 'ADDITIONAL_DETAILS_FAILED', label: 'Additional_details failed' },
  { key: 'REVIEW_IN_PROGRESS', label: 'Review in Progress' },
  { key: 'REVIEW_COMPLETE', label: 'Review Complete' },
  { key: 'REVIEW_ON_HOLD', label: 'Review on hold' },
  { key: 'REVIEW_FAILED', label: 'Review failed' },
];
