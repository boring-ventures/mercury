import {
  LayoutDashboard,
  Settings,
  HelpCircle,
  Ship,
  Package,
  FileText,
  TrendingUp,
  Users,
  Building2,
  ShieldCheck,
  UserPlus,
  Bell,
  Wallet,
  DollarSign,
} from "lucide-react";
import type { SidebarData } from "../types";

// Base sidebar data - can be extended per role
export const baseSidebarData: SidebarData = {
  user: {
    name: "NORDEX User",
    email: "user@nordex.com",
    avatar: "/avatars/default.jpg",
  },
  teams: [
    {
      name: "NORDEX Platform",
      logo: Ship,
      plan: "Gestión de Envíos Internacionales",
    },
  ],
  navGroups: [],
};

// Admin/Superadmin sidebar configuration
export const adminSidebarData: SidebarData = {
  ...baseSidebarData,
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          url: "/admin/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Notificaciones",
          url: "/dashboard/notifications",
          icon: Bell,
        },
        {
          title: "Solicitudes",
          url: "/admin/solicitudes",
          icon: Package,
        },
        {
          title: "Cotizaciones",
          url: "/admin/quotations",
          icon: FileText,
        },
        {
          title: "Contratos",
          url: "/admin/contracts",
          icon: Building2,
        },
        {
          title: "Pagos",
          url: "/admin/payments",
          icon: TrendingUp,
        },
      ],
    },
    {
      title: "Gestión",
      items: [
        {
          title: "Solicitudes de Registro",
          url: "/petitions",
          icon: UserPlus,
        },
        {
          title: "Empresas",
          url: "/admin/companies",
          icon: Building2,
        },
        {
          title: "Usuarios",
          url: "/admin/users",
          icon: Users,
        },
        {
          title: "Proveedores",
          url: "/admin/providers",
          icon: Ship,
        },
      ],
    },
    {
      title: "Sistema",
      items: [
        {
          title: "Configuración",
          icon: Settings,
          url: "/admin/configuracion",
        },
        {
          title: "Auditoría",
          url: "/admin/auditoria",
          icon: ShieldCheck,
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

// Importador sidebar configuration
export const importadorSidebarData: SidebarData = {
  ...baseSidebarData,
  navGroups: [
    {
      title: "Mi Cuenta",
      items: [
        {
          title: "Dashboard",
          url: "/importador/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Mis Solicitudes",
          url: "/importador/solicitudes",
          icon: Package,
        },
        {
          title: "Mis Cotizaciones",
          url: "/importador/cotizaciones",
          icon: FileText,
        },
        {
          title: "Mis Contratos",
          url: "/importador/contratos",
          icon: Building2,
        },
      ],
    },
    {
      title: "Documentos",
      items: [
        {
          title: "Mis Documentos",
          url: "/importador/documentos",
          icon: FileText,
        },
        {
          title: "Historial",
          url: "/importador/historial",
          icon: TrendingUp,
        },
      ],
    },
    {
      title: "Soporte",
      items: [
        {
          title: "Mi Perfil",
          url: "/importador/perfil",
          icon: Settings,
        },
      ],
    },
  ],
};

// Cajero sidebar configuration
export const cajeroSidebarData: SidebarData = {
  ...baseSidebarData,
  navGroups: [
    {
      title: "Cajero",
      items: [
        {
          title: "Dashboard",
          url: "/cajero/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Cotizaciones",
          url: "/cajero/cotizaciones",
          icon: FileText,
        },
        {
          title: "Transacciones",
          url: "/cajero/transacciones",
          icon: DollarSign,
        },
        {
          title: "Mis Cuentas",
          url: "/cajero/cuentas",
          icon: Wallet,
        },
        {
          title: "Notificaciones",
          url: "/dashboard/notifications",
          icon: Bell,
        },
      ],
    },
    {
      title: "Soporte",
      items: [
        {
          title: "Centro de Ayuda",
          url: "/help-center",
          icon: HelpCircle,
        },
      ],
    },
  ],
};

// Default export for backward compatibility
export const sidebarData = adminSidebarData;

// Helper function to get sidebar data based on user role
export function getSidebarDataByRole(role: string): SidebarData {
  switch (role.toUpperCase()) {
    case "SUPERADMIN":
    case "ADMIN":
      return adminSidebarData;
    case "IMPORTADOR":
      return importadorSidebarData;
    case "CAJERO":
      return cajeroSidebarData;
    case "DEFAULT":
    default:
      // Return a basic navigation for unknown roles or during loading
      return {
        ...baseSidebarData,
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
                title: "Centro de Ayuda",
                url: "/help-center",
                icon: HelpCircle,
              },
            ],
          },
        ],
      };
  }
}
