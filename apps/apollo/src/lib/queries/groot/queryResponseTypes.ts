export type TProductCodes = {
  id: number;
  productCode: string;
  partnerId: number | null;
  partnerName: string | null;
  colorHex: string;
  channelType: string;
  pennantIntegration: boolean;
  flowType: string;
  greenChannelEnabled: boolean;
  creditLineProduct: boolean;
  disbursalWorkflowName: string | null;
};

export type TProductCodesShortened = {
  id: number;
  code: string;
  name: string | null;
  color: string;
  channelType: string;
  disbursalWorkflowName: string|null;
  isCreditLine: boolean;
};
