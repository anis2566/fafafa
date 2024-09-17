"use client";

import { cn } from "@/lib/utils";
import { useSidebarToggle } from "@/hooks/use-sidebar-toggle";
import { Sidebar } from "./sidebar";
import { useSidebar } from "@/hooks/use-sidebar";
import { usePathname } from "next/navigation";

export function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const sidebar = useSidebar(useSidebarToggle, (state) => state);
  const pathname = usePathname()
  const isChatPage = pathname === "/dashboard/chat"

  if (!sidebar) return null;

  return (
    <>
      {!isChatPage && (
        <Sidebar />
      )}
      <main
        className={cn(
          "min-h-[calc(100vh_-_56px)] transition-[margin-left] ease-in-out duration-300",
          sidebar?.isOpen === false ? "lg:ml-[90px]" : "lg:ml-64",
          isChatPage && "lg:ml-0"
        )}
      >
        {children}
      </main>
    </>
  );
}