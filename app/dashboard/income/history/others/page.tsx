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
import { ContentLayout } from "@/app/dashboard/_components/content-layout";
import { db } from "@/lib/prisma";

import { CustomPagination } from "@/components/custom-pagination";
import { Header } from "./_components/header";
import { IncomeList } from "./_components/income-list";

export const metadata: Metadata = {
    title: "BEC | Income | Others | History",
    description: "Basic Education Care",
};

interface Props {
    searchParams: {
        sort?: string;
        page?: string;
        perPage?: string;
    };
}


const Others = async ({ searchParams }: Props) => {
    const {
        sort,
        page = "1",
        perPage = "5"
    } = searchParams;

    const itemsPerPage = parseInt(perPage, 10);
    const currentPage = parseInt(page, 10);

    const [incomes, totalOthersIncome] = await Promise.all([

        await db.income.findMany({
            orderBy: {
                createdAt: sort === "asc" ? "asc" : "desc"
            },
            skip: (currentPage - 1) * itemsPerPage,
            take: itemsPerPage,
        }),
        await db.income.count()
    ])


    const totalPage = Math.ceil(totalOthersIncome / itemsPerPage);

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
                        <BreadcrumbPage>Others History</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Others Income</CardTitle>
                    <CardDescription>A collection of other income.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Header />
                    <IncomeList incomes={incomes} />
                    <CustomPagination totalPage={totalPage} />
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default Others
