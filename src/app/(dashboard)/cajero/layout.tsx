import { CajeroRouteGuard } from "@/components/cajero/cajero-route-guard";

export default function CajeroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CajeroRouteGuard>{children}</CajeroRouteGuard>;
}
