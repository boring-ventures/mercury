import { ImportadorRouteGuard } from "@/components/importador/importador-route-guard";

export default function ImportadorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ImportadorRouteGuard>{children}</ImportadorRouteGuard>;
}
