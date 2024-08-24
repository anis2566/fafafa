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

import { ContentLayout } from "../_components/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExpenseList } from "./_components/expense-list";
import { db } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "BEC | Expense",
    description: "Basic Education Care",
};


const Expense = async () => {
    const expenses = await db.expense.findMany()

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
                        <BreadcrumbPage>Expense</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Expense List</CardTitle>
                    <CardDescription>A collection of expense.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ExpenseList expenses={expenses} />
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default Expense
