import Link from "next/link";
import { Metadata } from "next";
import { Class, Month } from "@prisma/client";

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
import { CustomPagination } from "@/components/custom-pagination";
import { PaymentList } from "./_components/payment-list";
import { Header } from "./_components/header";

export const metadata: Metadata = {
    title: "BEC | Expense | Teacher Bill",
    description: "Basic Education Care",
};

interface Props {
    searchParams: {
        session?: string;
        month?: Month;
        id?: string;
        name?: string;
        page?: string;
        perPage?: string;
    };
}

const HouseRent = async ({ searchParams }: Props) => {
    const {
        session,
        id,
        month,
        name,
        page = "1",
        perPage = "5"
    } = searchParams;

    const itemsPerPage = parseInt(perPage, 10);
    const currentPage = parseInt(page, 10);
    const formatedSession = parseInt(session || `${new Date().getFullYear()}`);
    const teacherId = id ? parseInt(id) : undefined;

    const [payments, totalPayment] = await Promise.all([
        await db.teacherPayment.findMany({
            where: {
                session: formatedSession,
                ...(month && { month }),
                ...(teacherId && {
                    teacher: {
                        teacherId
                    }
                }),
                ...(name && {
                    teacher: {
                        name: { contains: name, mode: "insensitive" }
                    }
                })
            },
            include: {
                teacher: {
                    include: {
                        fee: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            skip: (currentPage - 1) * itemsPerPage,
            take: itemsPerPage,
        }),
        await db.teacherPayment.count({
            where: {
                session: formatedSession,
                ...(month && { month }),
                ...(teacherId && {
                    teacher: {
                        teacherId
                    }
                }),
                ...(name && {
                    teacher: {
                        name: { contains: name, mode: "insensitive" }
                    }
                })
            },
        })
    ])

    const totalPage = Math.ceil(totalPayment / itemsPerPage)

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
                        <BreadcrumbPage>Teacher Bill</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Teacher Bill</CardTitle>
                    <CardDescription>A collection of teacher bill.</CardDescription>
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

export default HouseRent
