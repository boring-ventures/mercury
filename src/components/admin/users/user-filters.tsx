"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Search } from "lucide-react";
import type { UserListFilters, UserCompany } from "@/types/users";
import type { UserRole, UserStatus } from "@prisma/client";

interface UserFiltersProps {
  filters: UserListFilters;
  onFiltersChange: (filters: Partial<UserListFilters>) => void;
}

export function UserFilters({ filters, onFiltersChange }: UserFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search || "");

  // Fetch companies for company filter
  const { data: companiesData } = useQuery({
    queryKey: ["companies"],
    queryFn: async (): Promise<{ companies: UserCompany[] }> => {
      const response = await fetch("/api/companies");
      if (!response.ok) {
        throw new Error("Failed to fetch companies");
      }
      return response.json();
    },
    staleTime: 300000, // 5 minutes
  });

  const companies = companiesData?.companies || [];

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.search) {
        onFiltersChange({ search: searchValue || undefined });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue, filters.search, onFiltersChange]);

  const handleClearFilters = () => {
    setSearchValue("");
    onFiltersChange({
      role: undefined,
      status: undefined,
      companyId: undefined,
      search: undefined,
    });
  };

  const hasActiveFilters =
    filters.role || filters.status || filters.companyId || filters.search;

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="space-y-2">
        <Label htmlFor="search">Search Users</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Search by name, company..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Role Filter */}
      <div className="space-y-2">
        <Label>Role</Label>
        <Select
          value={filters.role || "all"}
          onValueChange={(value) =>
            onFiltersChange({
              role: value === "all" ? undefined : (value as UserRole),
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="IMPORTADOR">Importador</SelectItem>
            <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
            <SelectItem value="CAJERO">Cajero</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Status Filter */}
      <div className="space-y-2">
        <Label>Status</Label>
        <Select
          value={filters.status || "all"}
          onValueChange={(value) =>
            onFiltersChange({
              status: value === "all" ? undefined : (value as UserStatus),
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
            <SelectItem value="SUSPENDED">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Company Filter */}
      <div className="space-y-2">
        <Label>Company</Label>
        <Select
          value={filters.companyId || "all"}
          onValueChange={(value) =>
            onFiltersChange({
              companyId: value === "all" ? undefined : value,
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All companies" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Companies</SelectItem>
            <SelectItem value="no-company">No Company</SelectItem>
            {companies?.map((company) => (
              <SelectItem key={company.id} value={company.id}>
                {company.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearFilters}
          className="w-full"
        >
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}
