import { useQuery } from "@tanstack/react-query";

interface UserDocument {
  id: string;
  filename: string;
  mimeType: string;
  type?: string;
  fileUrl?: string;
  status?: string;
  reviewNotes?: string;
  createdAt: string;
  request?: {
    id: string;
    code: string;
  };
  company?: {
    id: string;
    name: string;
  };
}

interface UserDocumentsResponse {
  documents: UserDocument[];
}

export const useUserDocuments = (requestId: string, companyId: string) => {
  return useQuery<UserDocumentsResponse>({
    queryKey: ["user-documents", requestId, companyId],
    queryFn: async () => {
      const response = await fetch(
        `/api/documents/user?requestId=${requestId}&companyId=${companyId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user documents");
      }
      return response.json();
    },
    enabled: !!requestId && !!companyId,
  });
};
