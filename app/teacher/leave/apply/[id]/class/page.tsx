import Link from "next/link";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { LeaveStatus } from "@prisma/client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

import { ContentLayout } from "@/app/teacher/_components/content-layout";
import { db } from "@/lib/prisma";
import { LeaveClassForm } from "./_components/leave-class-form";

export const metadata: Metadata = {
    title: "BEC | Leave | Classes",
    description: "Basic Education Care",
};

interface Props {
    params: {
        id: string;
    }
}

const LevaeClass = async ({ params: { id } }: Props) => {
    const app = await db.leaveApp.findUnique({
        where: {
            id,
            status: LeaveStatus.Pending
        }
    })

    if (!app) redirect("/teacher")
    
    return (
        <ContentLayout title="Leave">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard/leave/history">History</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Classes</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <LeaveClassForm id={id} days={app.days} />
        </ContentLayout>
    )
}

export default LevaeClass
