import {
  LayoutDashboard,
  Settings,
  HelpCircle,
  Ship,
  Package,
  FileText,
  TrendingUp,
} from "lucide-react";
import type { SidebarData } from "../types";

export const sidebarData: SidebarData = {
  user: {
    name: "Mercury User",
    email: "user@mercury.com",
    avatar: "/avatars/default.jpg",
  },
  teams: [
    {
      name: "Mercury Platform",
      logo: Ship,
      plan: "Gestión de Envíos Internacionales",
    },
  ],
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Solicitudes",
          url: "/requests",
          icon: Package,
        },
        {
          title: "Cotizaciones",
          url: "/quotations",
          icon: FileText,
        },
        {
          title: "Reportes",
          url: "/reports",
          icon: TrendingUp,
        },
      ],
    },
    {
      title: "Configuración",
      items: [
        {
          title: "Ajustes",
          icon: Settings,
          url: "/settings",
        },
        {
          title: "Centro de Ayuda",
          url: "/help-center",
          icon: HelpCircle,
        },
      ],
    },
  ],
};
