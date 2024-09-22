import Link from "next/link";
import { Metadata } from "next";
import { Month, TransactionStatus } from "@prisma/client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/prisma";
import { ContentLayout } from "@/app/dashboard/_components/content-layout";
import { AdvanceList } from "./_components/advance-list";
import { CustomPagination } from "@/components/custom-pagination";
import { Header } from "../_components/header";

export const metadata: Metadata = {
    title: "BEC | Expense | Advance | Approval",
    description: "Basic Education Care",
};

interface Props {
    searchParams: {
        session?: string;
        month?: Month;
        status?: TransactionStatus;
        id?: string;
        name?: string;
        page?: string;
        perPage?: string;
    };
}

const AdvanceApproval = async ({ searchParams }: Props) => {
    const {
        session,
        month,
        status,
        id,
        name,
        page = "1",
        perPage = "5"
    } = searchParams;

    const itemsPerPage = parseInt(perPage, 10);
    const currentPage = parseInt(page, 10);
    const formatedSession = parseInt(session || `${new Date().getFullYear()}`);
    const teacherId = id ? parseInt(id) : undefined;

    const [advances, totalAdvance] = await Promise.all([
        await db.teacherAdvance.findMany({
            where: {
                session: formatedSession,
                ...(month && { month }),
                ...(status && { status }),
                teacher: {
                    ...(teacherId && { teacherId }),
                    ...(name && { name: { contains: name, mode: "insensitive" } }),
                }
            },
            include: {
                teacher: true
            },
            orderBy: {
                createdAt: "desc"
            },
            skip: (currentPage - 1) * itemsPerPage,
            take: itemsPerPage,
        }),
        await db.teacherAdvance.count({
            where: {
                session: formatedSession,
                ...(month && { month }),
                teacher: {
                    ...(teacherId && { teacherId }),
                    ...(name && { name: { contains: name, mode: "insensitive" } }),
                }
            },
        })
    ])

    const totalPage = Math.ceil(totalAdvance / itemsPerPage)

    return (
        <ContentLayout title="Expense">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Advance Approval</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Advance Request</CardTitle>
                    <CardDescription>A collection of advance request.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Header />
                    <AdvanceList advances={advances} />
                    <CustomPagination totalPage={totalPage} />
                </CardContent>
            </Card>

            {/* <TeacherBillForm /> */}
        </ContentLayout>
    )
}

export default AdvanceApproval
