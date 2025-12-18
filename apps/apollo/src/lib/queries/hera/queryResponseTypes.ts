export type PartnerCompany = {
  dsaCode: string;
  name: string;
  partnerType: string;
  partnerId: number;
};
export type PartnerCodesResponse = {
  partnerCompanyList: PartnerCompany[];
};

export type BranchHierarchyResponse = {
  [key: string]: string[];
};

export type SpecifierUser = {
  id: number;
  name: string;
  emailId: string;
  designation: string;
  department: string;
  userId: string;
  managerEmailId: string;
  managerName: string;
  managedLeadType: string | null;
  delegatedTo: string | null;
  delegatedDesignation: string | null;
  delegatedName: string | null;
  employeeId: string | null;
  delegated: string | null;
};

export type SpecifiedUsersResponse = SpecifierUser[];

export type Designation = {
  id: number;
  name: string;
  priority: string;
};

export type AllDesignationsResponse = Designation[];
