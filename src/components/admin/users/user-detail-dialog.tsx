"use client";

import { format } from "date-fns";
import { useUser } from "@/hooks/use-users";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Loader2,
  User,
  Building,
  Phone,
  Mail,
  Calendar,
  Clock,
  FileText,
  Bell,
  Activity,
} from "lucide-react";

interface UserDetailDialogProps {
  userId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserDetailDialog({
  userId,
  open,
  onOpenChange,
}: UserDetailDialogProps) {
  const { data: user, isLoading: userLoading } = useUser(userId || "");

  const handleClose = () => {
    onOpenChange(false);
  };

  const getUserInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "U";
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "INACTIVE":
        return "secondary";
      case "SUSPENDED":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "SUPERADMIN":
        return "destructive";
      case "IMPORTADOR":
        return "default";
      default:
        return "outline";
    }
  };

  if (!open || !userId) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="h-5 w-5" />
            <span>User Details</span>
          </DialogTitle>
          <DialogDescription>
            Detailed information about the user and their activity
          </DialogDescription>
        </DialogHeader>

        {userLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading user details...</span>
          </div>
        ) : user ? (
          <div className="space-y-6">
            {/* User Profile Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback className="text-lg">
                      {getUserInitials(user.firstName, user.lastName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-semibold">
                        {user.firstName} {user.lastName}
                      </h3>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role === "SUPERADMIN"
                          ? "Super Admin"
                          : "Importador"}
                      </Badge>
                      <Badge variant={getStatusBadgeVariant(user.status)}>
                        {user.status}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground">User ID: {user.id}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Created{" "}
                          {format(new Date(user.createdAt), "MMM dd, yyyy")}
                        </span>
                      </div>
                      {user.lastLogin && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>
                            Last login{" "}
                            {format(
                              new Date(user.lastLogin),
                              "MMM dd, yyyy 'at' HH:mm"
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.phone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {user.active ? "Active Account" : "Inactive Account"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Information */}
            {user.company && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Building className="h-5 w-5" />
                    <span>Company Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Company Name
                      </label>
                      <p className="font-medium">{user.company.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        RUC
                      </label>
                      <p className="font-medium">{user.company.ruc}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Country
                      </label>
                      <p className="font-medium">{user.company.country}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Activity
                      </label>
                      <p className="font-medium">
                        {user.company.activity.replace(/_/g, " ")}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Contact Name
                      </label>
                      <p className="font-medium">{user.company.contactName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">
                        Contact Position
                      </label>
                      <p className="font-medium">
                        {user.company.contactPosition}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.company.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{user.company.phone}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Activity Statistics */}
            {user._count && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Activity Statistics</span>
                  </CardTitle>
                  <CardDescription>
                    User activity and engagement metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center space-y-2">
                      <div className="text-2xl font-bold text-primary">
                        {user._count.createdRequests}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Requests Created
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="text-2xl font-bold text-blue-600">
                        {user._count.assignedRequests}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Requests Assigned
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="text-2xl font-bold text-orange-600">
                        {user._count.notifications}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Notifications
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">User not found</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
