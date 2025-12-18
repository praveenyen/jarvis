export type DropResult = {
  draggableId: string;
  type: string;
  reason: 'DROP' | 'CANCEL';
  source: {
    droppableId: string;
    index: number;
  };
  destination?: {
    droppableId: string;
    index: number;
  } | null;
};

export type UploadFilePreSignDetails = {
  filePreSignedUrl: string;
  fileUrls: string;
  file: File;
  contentType: string;
  uploadSection?: UploadResponse | null;
  entityId?: string | null;
};

export type PreSignedUrlResp = {
  presignedUrl: string;
  objectUrl: string;
  expirationTime: string;
  method: string;
};

export type DocumentDetails = {
  id: number;
  docTypeId: number;
  filename: string;
  docType: string;
  section: string[];
  osvStatus: boolean;
  s3Url: string;
  comment: string | null;
  docTypeLinked: boolean;
  isDocEditValid: boolean;
};

export type AadharXmlData = {
  aadhaarUrl?: string;
  aadhaarType?: string;
  verifySignature?: boolean;
};

export type Document = {
  id: number;
  docTypeId: number;
  filename: string;
  docType: string;
  section: string[];
  osvStatus: boolean;
  s3Url: string;
  comment: string | null;
  docTypeLinked: boolean;
  isDocEditValid: boolean;
};

export type AllowedDocType = {
  id: number;
  isActive: boolean;
  name: string;
};

export type EntityType = {
  id: number;
  isActive: boolean;
  linkedTo: string;
};

export type SectionProperty = {
  sectionType: string;
  metadata: Record<string, unknown>;
  allowedDocTypes: AllowedDocType[];
  entityType: EntityType;
};

export type DocsSection = {
  section: string;
  sectionId: string;
  checklist: boolean;
  osvStatus: boolean | null;
  isActive: boolean | null;
  sectionConfigId: number | null;
  count: number;
  sectionProperty: SectionProperty;
  docs: Document[];
};

export type LinkedEntity = {
  entityId: string;
  customerType: string | null;
  docsSections: DocsSection[];
};

export type MainObject = {
  id: string;
  dmsComplete: boolean;
  checklistStatus: boolean;
  linkedIndividual: LinkedEntity[];
  linkedBusiness: LinkedEntity;
  coApplicants: LinkedEntity[];
  beneficialOwners: any[];
  authorizedSignatories: any[];
  appForm: DocsSection[];
  untagged: DocumentDetails[];
};

export type UploadResponse = {
  s3Urls?: string[];
  applicantId?: number | undefined;
  docTypeId?: number | null;
  sectionId: string | null | undefined;
  osvStatus?: boolean | null;
  sourceSectionId?: string | null;
};

export type EditUploadResponse = {
  s3Urls?: string[];
  applicantId?: number | undefined;
  docTypeId?: number | null;
  sectionId: string;
  osvStatus?: boolean | null;
  sourceSectionId?: string | null;
};

export type DocumentMoveRequest = {
  entityId: string | null;
  entityTypeId: number | null;
  docTypeId: number | null;
  sourceSectionId?: string | null;
  destinationSectionId?: string | null;
  osvStatus: boolean | null;
};

export type FileUplaodDetails = {
  files?: File[];
  uploadDetails: DocsSection | null;
  entityId: string | null;
  dropFiles?: Document[] | null;
  sourceSectionId?: string | null;
  uploadSectionDetails?: UploadResponse | null;
  callMode?: string | null;
};

export type TaggedUnTaggedData = {
  coApplicants: LinkedEntity[];
  linkedBusiness: LinkedEntity | null;
  linkedIndividuals: LinkedEntity[];
  authorizedSignatories: LinkedEntity[];
  beneficialOwners: LinkedEntity[];
  appForm: DocsSection[];
  untaggedList: DocumentDetails[];
  dmsComplete?: boolean;
};

export type AllowedDocFormat = {
  id: number;
  isActive: boolean;
  extension: string;
  purpose: string;
};

export type SectionType = {
  id: number;
  isActive: boolean;
  sectionType: string;
};

export type AddSectionProperty = {
  id: number;
  isActive: boolean;
  loanProductCode: string;
  sectionType: SectionType;
  allowedDocTypes: AllowedDocType[];
  customerType: string | null;
  count: number;
  allowedDocFormat: AllowedDocFormat[];
  entityType: EntityType;
  optional: boolean;
  optionalRuleLink: string | null;
  isChecklist: boolean;
  isAutoCreated: boolean;
};

///
export interface DocumentSection {
  id: string;
  updatedAt: number;
  name: string;
  sectionProperty: SectionProperty;
}

export type DocActivity = {
  documentActivity:string;
  sortOrder:string;
  page:string;
  size:string;
}

// export interface SectionProperty {
//   id: string;
//   updatedAt: number;
//   sectionType: string;
//   metadata: Record<string, any>;
//   allowedDocTypes: AllowedDocType[];
//   allowedDocFormat: AllowedDocFormat[];
//   entityType: EntityType;
// }

// export interface AllowedDocType {
//   id: number;
//   isActive: boolean;
//   name: string;
// }

// export interface AllowedDocFormat {
//   id: number;
//   isActive: boolean;
//   extension: string;
//   purpose: string;
// }

// export interface EntityType {
//   id: number;
//   isActive: boolean;
//   linkedTo: string;
// }
