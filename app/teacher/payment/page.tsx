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

import { ContentLayout } from "../_components/content-layout";
import { db } from "@/lib/prisma";
import { GET_TEACHER } from "@/services/user.service";
import { PaymentList } from "./_components/payment-list";
import { Header } from "../leave/history/_components/header";
import { CustomPagination } from "@/components/custom-pagination";

export const metadata: Metadata = {
    title: "BEC | Payment",
    description: "Basic Education Care",
};

interface Props {
    searchParams: {
        page: string;
        perPage: string;
    }
}

const Payment = async ({searchParams}:Props) => {
    const { page, perPage } = searchParams;
    const itemsPerPage = parseInt(perPage) || 5;
    const currentPage = parseInt(page) || 1;

    const { teacherId } = await GET_TEACHER()

    const payments = await db.teacherPayment.findMany({
        where: {
            teacherId
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
            teacherId
        },
    })

    const totalPage = Math.ceil(totalPayment / itemsPerPage)

    return (
        <ContentLayout title="Payment">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/teacher">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Payment</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Payment List</CardTitle>
                    <CardDescription>A collection of your payment.</CardDescription>
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

export default Payment
