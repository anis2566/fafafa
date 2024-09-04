import { auth } from "@/auth";
import { AdminLayout } from "./_components/admin-layout";

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const {u} = await auth()
  return (
    <AdminLayout>{children}</AdminLayout>
  )
}