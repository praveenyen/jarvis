export type TBureauReport = {
  bureauName: string;
  pullType: string;
  bureauPullId: string;
  score: number;
  enquiryNumber: string;
  createdAt: string; // ISO date string equivalent of Go's `time.Time`
  creditReports: TBureauDocResponse[];
};

export type TCreditResponse = {
  reports: TBureauReport[];
};

export type TBureauDocResponse = {
  id: string;
  type: string;
  format: string;
  s3Url: string;
};

export type TPreSignLinkResponse = {
  bureauDocId: string;
  fileUrl: string;
  expiryDurationInSeconds: number;
};
