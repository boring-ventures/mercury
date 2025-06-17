import type { UserRole, UserStatus, ActivityType } from "@prisma/client";

export interface UserProfile {
  id: string;
  userId: string;
  avatarUrl?: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  companyId?: string;
  company?: UserCompany;
}

export interface UserCompany {
  id: string;
  name: string;
  ruc: string;
  country: string;
  activity: ActivityType;
  contactName: string;
  contactPosition: string;
  email: string;
  phone: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithDetails extends UserProfile {
  company?: UserCompany;
  _count?: {
    createdRequests: number;
    assignedRequests: number;
    notifications: number;
  };
}

export interface UserListFilters {
  role?: UserRole;
  status?: UserStatus;
  companyId?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface UserListResponse {
  users: UserWithDetails[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: UserRole;
  companyId?: string;
  password: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  role?: UserRole;
  status?: UserStatus;
  companyId?: string;
  active?: boolean;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  suspendedUsers: number;
  importadorUsers: number;
  superAdminUsers: number;
  usersWithoutCompany: number;
}
