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
import { CustomPagination } from "@/components/custom-pagination";
import { PaymentList } from "./_components/payment-list";
import { Header } from "./_components/header";

export const metadata: Metadata = {
    title: "BEC | Expense | Teacher Bill",
    description: "Basic Education Care",
};

interface Props {
    searchParams: {
        month: Month;
        page: string;
        perPage: string;
        id: string;
    }
}

const HouseRent = async ({ searchParams }: Props) => {
    const { month, id, page, perPage } = searchParams;
    const itemsPerPage = parseInt(perPage) || 5;
    const currentPage = parseInt(page) || 1;
    const formatedId = id ? parseInt(id) : undefined

    const payments = await db.teacherPayment.findMany({
        where: {
            ...(month && { month }),
            ...(formatedId && {
                teacher: {
                    teacherId: formatedId
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
    })

    const totalPayment = await db.teacherPayment.count({
        where: {
            ...(month && { month }),
            ...(formatedId && {
                teacher: {
                    teacherId: formatedId
                }
            })
        },
    })

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
