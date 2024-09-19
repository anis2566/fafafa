import Link from "next/link";
import { Metadata } from "next";
import { Class } from "@prisma/client"

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
import { CustomPagination } from "@/components/custom-pagination";
import { ContentLayout } from "../../_components/content-layout";
import { CreateButton } from "./_components/create-button";
import { Header } from "../admission/_components/header";
import { FeeList } from "./_components/fee-list";

export const metadata: Metadata = {
    title: "BEC | Fee | Monthly",
    description: "Basic Education Care",
};

interface Props {
    searchParams: {
        className?: Class;
        page?: string;
        perPage?: string;
    };
}

const MonthlyFee = async ({ searchParams }: Props) => {
    const {
        className,
        page = "1",
        perPage = "5"
    } = searchParams;

    const itemsPerPage = parseInt(perPage, 10);
    const currentPage = parseInt(page, 10);

    const [fees, totalFee] = await Promise.all([
        await db.monthlyFee.findMany({
            where: {
                ...(className && {
                    class: {
                        equals: className
                    }
                })
            },
            orderBy: {
                createdAt: "desc"
            },
            skip: (currentPage - 1) * itemsPerPage,
            take: itemsPerPage,
        }),
        await db.monthlyFee.count({
            where: {
                ...(className && {
                    class: className
                })
            }
        })
    ])


    const totalPage = Math.ceil(totalFee / itemsPerPage)

    return (
        <ContentLayout title="Fee">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Monthly Fee</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <CreateButton />

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Fee List</CardTitle>
                    <CardDescription>
                        A collection of monthly fee.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Header />
                    <FeeList fees={fees} />
                    <CustomPagination totalPage={totalPage} />
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default MonthlyFee
