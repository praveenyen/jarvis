export type Card = {
    id: string;
    loans: loanDetails;
    beneficiaryDetails: benefAccountDetails;
    partnerName: string;
    groupCreatedDate: string;
    disbursalAmount: number;
    loanProductCode: string;
};

export type loanDetails = {
    loanId: string;
    appFormId: string;
    loanAmount: number;
    disbursalAmount: number;
    fundingAllocation: number;
    status: string;
    partnerName: string;
    modeOfPayment: string | null;
    partnerLoanId: string;
    transactionDate: string | null;
    transactionDescription: string | null;
    utrNo: string | null;
    checkerId: number | null;
    offlineDisbursed: boolean;
    oldTransactionDate: string | null;
    oldTransactionDescription: string | null;
    oldUtrNo: string | null;
    loanCreatedDate: string | null;
    fee: number;
}[];

export type benefAccountDetails = {
    id: string;
    accNo: string;
    ifscCode: string;
    name: string;
    type: string;
    bankName: string;
};


export type loanDetail = {
    loanId: string;
    appFormId: string;
    loanAmount: number;
    disbursalAmount: number;
    fundingAllocation: number;
    status: string;
    partnerName: string;
    modeOfPayment: string | null;
    partnerLoanId: string;
    transactionDate: string | null;
    transactionDescription: string | null;
    utrNo: string | null;
    checkerId: number | null;
    offlineDisbursed: boolean;
    oldTransactionDate: string | null;
    oldTransactionDescription: string | null;
    oldUtrNo: string | null;
    loanCreatedDate: string | null;
    fee: number;
};


export type rejectedStatusPayload = {
    appFormId: string;
    reason: string | null;
    checkerId: string;
    status: string | number;
}[]

export type ProcessToPayload = {
    groupId: string;
    status: string;
}[]

export type NewUtrSuccessPayload = {
    appFormId: string;
    groupId: string;
    modeOfPayment: string;
    utr: string;
    oldUtr?: string | null;
}
