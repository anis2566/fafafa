import Link from "next/link";
import { Metadata } from "next";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { ContentLayout } from "../../_components/content-layout";
import { db } from "@/lib/prisma";
import { LeaveList } from "./_components/leave-list";
import { Header } from "./_components/header";
import { CustomPagination } from "@/components/custom-pagination";

export const metadata: Metadata = {
    title: "BEC | Teacher | Leave | History",
    description: "Basic Education Care",
};

interface Props {
    searchParams: {
        id?: string;
        name?: string;
        page: string;
        perPage: string;
    }
}

const Leaves = async ({ searchParams }: Props) => {
    const {
        id,
        name,
        page = "1",
        perPage = "5"
    } = searchParams;

    const itemsPerPage = parseInt(perPage, 10);
    const currentPage = parseInt(page, 10);
    const teacherId = id ? parseInt(id) : undefined;

    const [leaves, totalLeave] = await Promise.all([
        db.leaveApp.findMany({
            where: {
                ...(teacherId && {
                    teacher: {
                        teacherId
                    }
                }),
                ...(name && {
                    teacher: {
                        name: { contains: name, mode: "insensitive" }
                    }
                }),

            },
            include: {
                classes: true,
                teacher: true
            },
            orderBy: {
                createdAt: "desc"
            },
            skip: (currentPage - 1) * itemsPerPage,
            take: itemsPerPage,
        }),
        await db.leaveApp.count({
            where: {
                ...(teacherId && {
                    teacher: {
                        teacherId
                    }
                }),
                ...(name && {
                    teacher: {
                        name: { contains: name, mode: "insensitive" }
                    }
                }),
            }
        })
    ])


    const totalPage = Math.ceil(totalLeave / itemsPerPage)

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
                        <BreadcrumbPage>History</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>History</CardTitle>
                    <CardDescription>A collection of leave app.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Header />
                    <LeaveList leaves={leaves} />
                    <CustomPagination totalPage={totalPage} />
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default Leaves
