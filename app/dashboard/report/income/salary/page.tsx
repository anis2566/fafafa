import Link from "next/link";
import { Metadata } from "next";
import { Class } from "@prisma/client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ContentLayout } from "@/app/dashboard/_components/content-layout";
import { db } from "@/lib/prisma";
import { Header } from "./_components/header";
import { SalaryList } from "./_components/salary-list";

export const metadata: Metadata = {
    title: "BEC | Salary Report",
    description: "Basic Education Care",
};

interface Props {
    searchParams: {
        session: string;
        className: Class;
    }
}

const SalaryIncome = async ({ searchParams }: Props) => {
    const { session, className } = searchParams;
    const formatedSession = session ? parseInt(session) : new Date().getFullYear()

    const payments = await db.student.findMany({
        where: {
            session: formatedSession,
            class: className ? className : Class.Two
        },
        select: {
            id: true,
            name: true,
            studentId: true,
            imageUrl: true,
            class: true,
            payments: true,
        },
        orderBy: {
            studentId: "asc"
        },
    })

    return (
        <ContentLayout title="Report">
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
                            <Link href="/dashboard/report/income">Income</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Salary</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Salary Report</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Header />
                    <SalaryList payments={payments} />
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default SalaryIncome
