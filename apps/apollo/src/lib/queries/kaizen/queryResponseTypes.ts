export type TPositiveConfirmationRecordResponse = {
  appFormId: string;
  spName: string;
  awb: string;
  finalStatus: string;
};
export type TDiscrepancyData = Discrepancy[] 

export type Discrepancy = {
  entityId: string;
  id: number;
  isFtr: boolean;
  totalDiscrepancy: number;
  appFormMoveCountToQc: number;
  countDroppedDiscrepancy: number;
  countInReviewDiscrepancy: number;
  countPendingDiscrepancy: number;
  countResolvedDiscrepancy: number;
  department: string;
  createdAt: string;
  discrepancyDetails: DiscrepancyList[];
}

export type DiscrepancyList = {
  categoryType: string;
  comments: CommentList[];
  createdAt: string;
  createdBy: string;
  id: number;
  updatedBy: string;
  originStage: string;
  status: string;
  subCategoryType: string;
  narration: string;
  remarks: string;
};

export type CommentList = {
  commentAtStage: string;
  commentText: string;
  commentedTo: string;
  createdAt: string;
  createdBy: string;
  id: number;
  label: string;
  disableNotification: boolean;
};

export type NarrationList = Narration[]

export type Narration = {
  stage: string;
  id: number;
  narration: string;
  lpc: string;
  discrepancySubCategoryId:number;
  remarks?:string | null;
};


export type DiscrepancyStatus = {
    totalDiscrepancy: number,
    countPendingDiscrepancy: number,
    countInReviewDiscrepancy: number,
    countDroppedDiscrepancy: number,
    countResolvedDiscrepancy: number,
    appFormCanApprove: boolean,
    ftrAndNftrStatus: string,
    department: string | null,
    isCreditFtr: boolean
}
