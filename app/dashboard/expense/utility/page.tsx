import Link from "next/link";
import { Metadata } from "next";
import { Expenses, Month } from "@prisma/client";

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
import { ExpenseList } from "./_components/expense-list";
import { Header } from "./_components/header";
import { CustomPagination } from "@/components/custom-pagination";

export const metadata: Metadata = {
    title: "BEC | Expense | Utility",
    description: "Basic Education Care",
};

interface Props {
    searchParams: {
        type?: Expenses;
        session?: string;
        month?: Month;
        page: string;
        perPage: string;
    }
}

const UtilityList = async ({ searchParams }: Props) => {
    const {
        session,
        month,
        type,
        page = "1",
        perPage = "5"
    } = searchParams;

    const itemsPerPage = parseInt(perPage, 10);
    const currentPage = parseInt(page, 10);
    const formatedSession = parseInt(session || `${new Date().getFullYear()}`)

    const [expenses, totalExpense] = await Promise.all([
        await db.expense.findMany({
            where: {
                session: formatedSession,
                ...(month && { month }),
                ...(type && { type })
            },
            orderBy: {
                createdAt: "desc"
            },
            skip: (currentPage - 1) * itemsPerPage,
            take: itemsPerPage,
        }),
        await db.expense.count({
            where: {
                session: formatedSession,
                ...(month && { month }),
                ...(type && { type })
            },
        })
    ])

    const totalPage = Math.ceil(totalExpense / itemsPerPage)

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
                        <BreadcrumbPage>Utility</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Utility Expense List</CardTitle>
                    <CardDescription>A collection of utility expense.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Header />
                    <ExpenseList expenses={expenses} />
                    <CustomPagination totalPage={totalPage} />
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default UtilityList
