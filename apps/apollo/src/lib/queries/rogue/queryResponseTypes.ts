export type Lsa = {
  LsaCode: string;
  LsaName: string;
};

export type MnrlData = {
  tsp: string;
  disconnectionReason: string;
  dateOfDisconnection: string;
  mobileNo: string;
  lsa: Lsa;
};

export type FriData = {
  tsp: string;
  mobileNo: string;
  fri: string;
  lsa: Lsa;
  status: string;
};

type BaseDataItem = {
  mobileNumber: string;
  entityId: string;
  type: string;
};

export type DataItem = BaseDataItem & (
  {
    diu_data_type: "MNRL";
    data: MnrlData;
  } |
  {
    diu_data_type: "FRI";
    data: FriData;
  }
);

export type MnrlFriData = {
  data: MnrlFriDiuResponse
}

export type MnrlFriDiuResponse = {
  data: DataItem[];
  message: string;
  status: 'success' | 'failure';
};


export type MnrlFriDiuReqBody = {
  mobileNumber: string;
  entityId: string;
  entityType: string;
};

export type MnrlFriDiuReq = {
  data: MnrlFriDiuReqBody[];
};