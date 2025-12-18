export type AppUser = {
  id: string;
  name: string;
  email: string;
  type: string;
  dept: string;
  isActive: boolean;
  deactivatedReason: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  userId?: string;
};
export type DSAUser = {
  id: number;
  name: string;
  emailId: string;
  designation: string;
  department: string;
  userId: string;
  managerEmailId: string | null;
  managerName: string | null;
  managedLeadType: string | null;
  delegatedTo: string | null;
  delegatedDesignation: string | null;
  delegatedName: string | null;
  employeeId: string | null;
  delegated: string | null;
};

export type DSAAllUsersResponse = DSAUser[];

export type UsersResponse = {
  users: AppUser[];
};

export type Role = {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string;
  role: string;
};

export type RoleResponse = {
  user: AppUser & {
    roles: Role[];
  };
};
