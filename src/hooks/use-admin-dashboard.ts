import { useQuery } from "@tanstack/react-query";

export interface DashboardMetricsFilters {
  dateFrom?: string;
  dateTo?: string;
}

export interface PendingRequest {
  id: string;
  code: string;
  companyName: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: Date;
}

export interface ClientStat {
  id: string;
  name: string;
  requestCount: number;
  totalAmount: number;
  approvedAmount: number;
}

export interface DashboardMetrics {
  totalApprovedUSD: number;
  totalApprovedBS: number;
  totalCommissionsBS: number;
  approvedRequestsCount: number;
  pendingRequests: PendingRequest[];
  clientStats: ClientStat[];
}

function buildQueryString(filters: DashboardMetricsFilters): string {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value.toString());
    }
  });

  return params.toString();
}

export function useDashboardMetrics(filters: DashboardMetricsFilters = {}) {
  const queryString = buildQueryString(filters);

  return useQuery<DashboardMetrics>({
    queryKey: ["admin-dashboard-metrics", queryString],
    queryFn: async () => {
      const response = await fetch(
        `/api/admin/dashboard-metrics?${queryString}`
      );
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error fetching dashboard metrics");
      }
      return response.json();
    },
    staleTime: 30000, // 30 seconds
  });
}
