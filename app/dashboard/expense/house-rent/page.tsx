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
import { PaymentList } from "./_components/payment-list";
import { db } from "@/lib/prisma";
import { Header } from "./_components/header";
import { CustomPagination } from "@/components/custom-pagination";

export const metadata: Metadata = {
    title: "BEC | Expense | House Rent",
    description: "Basic Education Care",
};

interface Props {
    searchParams: {
        session?: string;
        month?: Month;
        name?: string;
        page?: string;
        perPage?: string;
    };
}

const HouseRent = async ({ searchParams }: Props) => {
    const {
        session,
        month,
        name,
        page = "1",
        perPage = "5"
    } = searchParams;

    const itemsPerPage = parseInt(perPage, 10);
    const currentPage = parseInt(page, 10);
    const formatedSession = parseInt(session || `${new Date().getFullYear()}`);

    const [payments, totalPayment] = await Promise.all([
        await db.housePayment.findMany({
            where: {
                session: formatedSession,
                ...(month && { month }),
                ...(name && { houseName: { contains: name, mode: "insensitive" } })
            },
            orderBy: {
                createdAt: "desc"
            },
            skip: (currentPage - 1) * itemsPerPage,
            take: itemsPerPage,
        }),
        await db.housePayment.count({
            where: {
                session: formatedSession,
                ...(month && { month }),
                ...(name && { houseName: { contains: name, mode: "insensitive" } })
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
                        <BreadcrumbPage>House Rent</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>House Rent</CardTitle>
                    <CardDescription>A collection of house rent.</CardDescription>
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
