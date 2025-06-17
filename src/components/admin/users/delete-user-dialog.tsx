"use client";

import { useState } from "react";
import { useUser, useDeleteUser } from "@/hooks/use-users";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, AlertTriangle, Building } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface DeleteUserDialogProps {
  userId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteUserDialog({
  userId,
  open,
  onOpenChange,
}: DeleteUserDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteUserMutation = useDeleteUser();
  const { toast } = useToast();

  const { data: user, isLoading: userLoading } = useUser(userId || "");

  const handleDelete = async () => {
    if (!userId) return;

    setIsDeleting(true);
    try {
      await deleteUserMutation.mutateAsync(userId);
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  const getUserInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "U";
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <DialogTitle>Delete User</DialogTitle>
          </div>
          <DialogDescription>
            This action will suspend the user account. The user will no longer
            be able to log in.
          </DialogDescription>
        </DialogHeader>

        {userLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Loading user data...</span>
          </div>
        ) : user ? (
          <div className="space-y-4">
            {/* User Info */}
            <div className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.avatarUrl} />
                  <AvatarFallback>
                    {getUserInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">
                      {user.firstName} {user.lastName}
                    </h3>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role === "SUPERADMIN"
                        ? "Super Admin"
                        : "Importador"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                </div>
              </div>

              {user.company && (
                <div className="flex items-center space-x-2 pt-2 border-t">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium text-sm">
                      {user.company.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {user.company.country}
                    </div>
                  </div>
                </div>
              )}

              {user._count && (
                <div className="grid grid-cols-3 gap-4 pt-2 border-t text-center">
                  <div>
                    <div className="text-lg font-semibold">
                      {user._count.createdRequests}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Requests Created
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">
                      {user._count.assignedRequests}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Requests Assigned
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">
                      {user._count.notifications}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Notifications
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Warning */}
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-destructive">Warning</p>
                  <p className="text-muted-foreground mt-1">
                    This will set the user's status to "SUSPENDED" and active to
                    false. The user will not be deleted from the database but
                    will no longer be able to access the system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">User not found</p>
          </div>
        )}

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting || !user}
          >
            {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Delete User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
