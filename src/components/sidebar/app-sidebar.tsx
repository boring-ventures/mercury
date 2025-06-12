"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavGroup } from "./nav-group";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import { sidebarData } from "./data/sidebar-data";
import { useCurrentUser } from "@/hooks/use-current-user";
import { FileText } from "lucide-react";
import type { NavGroupProps } from "./types";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { profile, isLoading } = useCurrentUser();

  // Create dynamic navigation groups based on user role
  const getDynamicNavGroups = (): NavGroupProps[] => {
    const baseNavGroups = [...sidebarData.navGroups];

    // Add admin section if user is super admin
    if (!isLoading && profile && profile.role === "SUPERADMIN") {
      const adminGroupIndex = baseNavGroups.findIndex(
        (group) => group.title === "Administración"
      );

      const adminGroup: NavGroupProps = {
        title: "Administración",
        items: [
          {
            title: "Solicitudes de Registro",
            url: "/petitions",
            icon: FileText,
          },
        ],
      };

      if (adminGroupIndex === -1) {
        // Add admin group if it doesn't exist
        baseNavGroups.splice(1, 0, adminGroup); // Insert after "General" group
      } else {
        // Update existing admin group
        baseNavGroups[adminGroupIndex] = adminGroup;
      }
    }

    return baseNavGroups;
  };

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        {getDynamicNavGroups().map((props: NavGroupProps) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
