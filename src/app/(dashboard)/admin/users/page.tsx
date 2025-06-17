"use client";

import { useState } from "react";
import { useUsers, useUserStats } from "@/hooks/use-users";
import { useCurrentUser } from "@/hooks/use-current-user";
import type { UserListFilters } from "@/types/users";
import { UserDataTable } from "@/components/admin/users/user-data-table";
import { UserFilters } from "@/components/admin/users/user-filters";
import { UserStatsCards } from "@/components/admin/users/user-stats-cards";
import { CreateUserDialog } from "@/components/admin/users/create-user-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Users } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function UsersPage() {
  const { profile } = useCurrentUser();
  const [filters, setFilters] = useState<UserListFilters>({
    page: 1,
    limit: 10,
  });
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
  } = useUsers(filters);

  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = useUserStats();

  // Check if user is super admin
  if (profile && profile.role !== "SUPERADMIN") {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertDescription>
            You don't have permission to access this page. Super admin access
            required.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleFiltersChange = (newFilters: Partial<UserListFilters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page || 1, // Reset to page 1 when filters change
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  if (usersLoading && !usersData) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Loading users...</span>
        </div>
      </div>
    );
  }

  if (usersError) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertDescription>
            Error loading users: {usersError.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage users, assign roles, and monitor user activity across the
            platform.
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create User
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && <UserStatsCards stats={stats} isLoading={statsLoading} />}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Filters</CardTitle>
              <CardDescription>
                Filter users by role, status, and company
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UserFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <CardTitle>Users</CardTitle>
                </div>
                {usersData && (
                  <div className="text-sm text-muted-foreground">
                    {usersData.pagination.total} total users
                  </div>
                )}
              </div>
              <CardDescription>
                View and manage all system users
              </CardDescription>
            </CardHeader>
            <CardContent>
              {usersData ? (
                <UserDataTable
                  data={usersData}
                  filters={filters}
                  onPageChange={handlePageChange}
                  isLoading={usersLoading}
                />
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No users found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create User Dialog */}
      <CreateUserDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}
