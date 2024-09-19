import Link from "next/link";
import { Metadata } from "next";
import { Class, PaymentStatus } from "@prisma/client"

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
import { PaymentList } from "./_components/payment-list";
import { Header } from "./_components/header";
import { CustomPagination } from "@/components/custom-pagination";
import { ContentLayout } from "@/app/dashboard/_components/content-layout";

export const metadata: Metadata = {
    title: "BEC | Income | Salary | History",
    description: "Basic Education Care",
};

interface Props {
    searchParams: {
        session?: string;
        className?: Class;
        id?: string;
        name?: string;
        status?: PaymentStatus;
        page: string;
        perPage: string;
    }
}

const MonthlyPayment = async ({ searchParams }: Props) => {
    const {
        session,
        className,
        id,
        name,
        status,
        page = "1",
        perPage = "5"
    } = searchParams;

    const itemsPerPage = parseInt(perPage, 10);
    const currentPage = parseInt(page, 10);
    const formatedSession = parseInt(session || `${new Date().getFullYear()}`);
    const studentId = id ? parseInt(id) : undefined;


    const [payments, totalPayment] = await Promise.all([
        await db.student.findMany({
            where: {
                session: formatedSession,
                ...(className && { class: className }),
                ...(studentId && { studentId }),
                ...(name && { name: { contains: name, mode: "insensitive" } }),
                ...(status && {
                    payments: {
                        some: {
                            status: status
                        }
                    }
                })
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
                createdAt: "desc"
            },
            skip: (currentPage - 1) * itemsPerPage,
            take: itemsPerPage,
        }),
        await db.student.count({
            where: {
                session: formatedSession,
                ...(className && { class: className }),
                ...(studentId && { studentId }),
                ...(name && { name: { contains: name, mode: "insensitive" } }),
                ...(status && {
                    payments: {
                        some: {
                            status: status
                        }
                    }
                })
            }
        })
    ])

    const totalPage = Math.ceil(totalPayment / itemsPerPage)

    return (
        <ContentLayout title="Income">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Salary History</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Salary List</CardTitle>
                    <CardDescription>
                        A collection of salary.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Header />
                    <PaymentList payments={payments} />
                    <CustomPagination totalPage={totalPage} />
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default MonthlyPayment
