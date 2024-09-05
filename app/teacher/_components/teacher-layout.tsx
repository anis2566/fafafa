"use client";

import { cn } from "@/lib/utils";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { Sidebar } from "./sidebar";
import { useSidebar } from "@/hooks/use-sidebar";
import { useSession } from "next-auth/react";

export function TeacherLayoutComp({
  children
}: {
  children: React.ReactNode;
}) {
  const sidebar = useSidebar(useSidebarToggle, (state) => state);
  const { data } = useSession()
  if (!sidebar) return null;
  console.log(data)

  return (
    <>
      <Sidebar />
      <main
        className={cn(
          "min-h-[calc(100vh_-_56px)] transition-[margin-left] ease-in-out duration-300",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-64"
        )}
      >
        {children}
      </main>
    </>
  );
}