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
import { getSidebarDataByRole } from "./data/sidebar-data";
import { useCurrentUser } from "@/hooks/use-current-user";
import type { NavGroupProps } from "./types";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { profile, isLoading } = useCurrentUser();

  // Get sidebar data based on user role
  const getSidebarData = () => {
    if (isLoading || !profile) {
      // Return basic sidebar data while loading
      return getSidebarDataByRole("DEFAULT");
    }

    return getSidebarDataByRole(profile.role);
  };

  const sidebarData = getSidebarData();

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <div className="px-2">
          <TeamSwitcher teams={sidebarData.teams} />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {sidebarData.navGroups.map((group: NavGroupProps) => (
          <NavGroup key={group.title} {...group} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
