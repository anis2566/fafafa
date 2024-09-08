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

import { db } from "@/lib/prisma";
import { ContentLayout } from "@/app/dashboard/_components/content-layout";
import { LeaveClassForm } from "./_components/leave-class-form";

export const metadata: Metadata = {
    title: "BEC | Teacher | Leave | Classes",
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
                            <Link href="/dashboard/teacher/leave/history">History</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Classes</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <LeaveClassForm id={id} days={app.days} teacherId={app.teacherId} />
        </ContentLayout>
    )
}

export default LevaeClass
