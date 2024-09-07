import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AdminLayout } from "./_components/admin-layout";
import { AppKnockProviders } from "@/providers/knock-provider";

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth()

  if (!session?.status || !session.userId) {
    redirect("/")
  }

  return (
    <AppKnockProviders userId={session.userId}>
      <AdminLayout>{children}</AdminLayout>
    </AppKnockProviders>
  )
}