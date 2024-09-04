import Link from "next/link";
import { Metadata } from "next";
import { Month } from "@prisma/client";

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
import { AdvanceList } from "./_components/advance-list";
import { CustomPagination } from "@/components/custom-pagination";
import { Header } from "./_components/header";

export const metadata: Metadata = {
    title: "BEC | Expense | Advance | History",
    description: "Basic Education Care",
};

interface Props {
    searchParams: {
        session: string;
        month: Month;
        id: string;
        name: string;
        page: string;
        perPage: string;
    }
}

const Advances = async ({ searchParams }: Props) => {
    const { session, id, name, page, perPage, month } = searchParams;
    const itemsPerPage = parseInt(perPage) || 5;
    const currentPage = parseInt(page) || 1;
    const formatedSession = session ? parseInt(session) : new Date().getFullYear()
    const teacherId = id ? parseInt(id) : undefined

    const advances = await db.teacherAdvance.findMany({
        where: {
            session: formatedSession,
            ...(month && { month }),
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
    })

    const totalAdvance = await db.teacherAdvance.count({
        where: {
            session: formatedSession,
            ...(month && { month }),
            teacher: {
                ...(teacherId && { teacherId }),
                ...(name && { name: { contains: name, mode: "insensitive" } }),
            }
        },
    })

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
                        <BreadcrumbPage>Advance</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Advance History</CardTitle>
                    <CardDescription>A collection of advance.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Header />
                    <AdvanceList advances={advances} />
                    <CustomPagination totalPage={totalPage} />
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default Advances
