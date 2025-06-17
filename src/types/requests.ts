import type {
  RequestStatus,
  Currency,
  DocumentType,
  DocumentStatus,
} from "@prisma/client";

export interface RequestData {
  id: string;
  code: string;
  amount: number;
  currency: Currency;
  description: string;
  status: RequestStatus;
  reviewNotes?: string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  // Relations
  providerId: string;
  provider: {
    id: string;
    name: string;
    country: string;
    bankingDetails: string;
    email?: string;
    phone?: string;
  };

  companyId: string;
  company: {
    id: string;
    name: string;
    country: string;
    email: string;
    phone: string;
  };

  createdById: string;
  createdBy: {
    id: string;
    firstName?: string;
    lastName?: string;
  };

  assignedToId?: string;
  assignedTo?: {
    id: string;
    firstName?: string;
    lastName?: string;
  };

  documents: RequestDocument[];
  quotations: RequestQuotation[];
  contracts: RequestContract[];
  payments: RequestPayment[];

  _count?: {
    documents: number;
  };
}

export interface RequestDocument {
  id: string;
  filename: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  type: DocumentType;
  status: DocumentStatus;
  reviewNotes?: string;
  reviewedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface RequestQuotation {
  id: string;
  code: string;
  amount: number;
  currency: Currency;
  status: string;
  validUntil: Date;
  createdAt: Date;
  documents: RequestDocument[];
}

export interface RequestContract {
  id: string;
  code: string;
  title: string;
  amount: number;
  currency: Currency;
  status: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  documents: RequestDocument[];
}

export interface RequestPayment {
  id: string;
  code: string;
  amount: number;
  currency: Currency;
  type: string;
  status: string;
  description: string;
  dueDate?: Date;
  paidAt?: Date;
  createdAt: Date;
  documents: RequestDocument[];
}

export interface RequestListResponse {
  requests: RequestData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface RequestDetailResponse {
  request: RequestData;
}

export interface CreateRequestPayload {
  amount: number;
  currency?: Currency;
  description: string;
  providerName: string;
  providerCountry: string;
  providerBankingDetails: string;
  documents?: Array<{
    filename: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    type?: DocumentType;
  }>;
}

export interface UpdateRequestPayload {
  status?: RequestStatus;
  reviewNotes?: string;
  assignedToId?: string;
  amount?: number;
  description?: string;
}

export interface RequestFilters {
  status?: string;
  country?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

// Status configuration for UI display
export interface StatusConfig {
  label: string;
  color: string;
  icon: string;
}

export interface WorkflowAction {
  text: string;
  href: string;
}

// File upload types
export interface DocumentFile {
  file: File;
  filename: string;
  fileSize: number;
  mimeType: string;
  type: string;
  fileUrl?: string;
}

export interface UploadResponse {
  success: boolean;
  fileUrl?: string;
  error?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  error?: string;
  data?: T;
}

export interface CreateRequestResponse extends ApiResponse {
  request?: RequestData;
}

export interface UpdateRequestResponse extends ApiResponse {
  request?: RequestData;
}

export interface DeleteRequestResponse extends ApiResponse {
  // No additional data needed for delete response
}
