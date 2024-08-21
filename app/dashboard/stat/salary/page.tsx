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

import { ContentLayout } from "../../_components/content-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/prisma";
import { SalaryList } from "./_components/salary-list";
import { Header } from "./_components/header";

export const metadata: Metadata = {
    title: "BEC | Salary Stat",
    description: "Basic Education Care",
};

interface Props {
    searchParams: {
        session: string;
        className: Class;
    }
}

const SalaryStat = async ({ searchParams }: Props) => {
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
        <ContentLayout title="Stat">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Salary Stat</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Salary Stat</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Header />
                    <SalaryList payments={payments} />
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default SalaryStat
