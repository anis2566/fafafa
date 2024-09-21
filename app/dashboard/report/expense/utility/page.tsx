import { Metadata } from "next";
import { Expenses, Month, Prisma } from "@prisma/client";
import Link from "next/link";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { ContentLayout } from "@/app/dashboard/_components/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { formatString } from "@/lib/utils";
import { db } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "BEC | Report | Expense | Utility",
    description: "Basic Education Care",
};

type UtilityPayment = {
    type: Expenses;
    months: { month: Month; amount: number }[];
};

const processUtilityPayments = (
    utilityPayment: (Pick<Prisma.ExpenseGroupByOutputType, "month" | "type"> & { _sum: { amount: number | null } })[]
): UtilityPayment[] => {
    return utilityPayment.reduce(
        (acc: UtilityPayment[], payment) => {
            const existingType = acc.find((item) => item.type === payment.type);

            if (existingType) {
                existingType.months.push({
                    month: payment.month,
                    amount: payment._sum?.amount ?? 0,
                });
            } else {
                acc.push({
                    type: payment.type,
                    months: [
                        {
                            month: payment.month,
                            amount: payment._sum?.amount ?? 0,
                        },
                    ],
                });
            }

            return acc;
        },
        []
    );
};

const UtilityReport = async () => {

    const payments = await db.expense.groupBy({
        by: ["month", "type"],
        _sum: {
            amount: true
        }
    })

    const modifiedPayments = payments.reduce((acc: { type: Expenses, months: { month: Month, amount: number }[] }[], payment) => {
        const existingType = acc.find(item => item.type === payment.type);

        if (existingType) {
            existingType.months.push({
                month: payment.month,
                amount: payment._sum.amount ?? 0
            });
        } else {
            acc.push({
                type: payment.type,
                months: [{
                    month: payment.month,
                    amount: payment._sum.amount ?? 0
                }]
            });
        }

        return acc;
    }, []);

    const modifiedUtilityPayment = processUtilityPayments(payments);

    const totalForMonth = (month: Month) => {
        return modifiedUtilityPayment.reduce((total, utilityItem) => {
            const utilityMonth = utilityItem.months.find((m) => m.month === month)?.amount ?? 0;
            return total + utilityMonth;
        }, 0);
    };

    const grandTotal = Object.values(Month).reduce(
        (total, month) => total + totalForMonth(month),
        0
    );

    return (
        <ContentLayout title="Report">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard/report/expense">Expense</Link>
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
                    <CardTitle>Utility</CardTitle>
                    <CardDescription>Utility overview.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="bg-slate-100 dark:bg-background/60">Expense Type</TableHead>
                                {
                                    Object.values(Month).map((month, i) => (
                                        <TableHead key={i} className="text-center bg-slate-100 dark:bg-background/60">{month}</TableHead>
                                    ))
                                }
                                <TableHead className="bg-slate-100 dark:bg-background/60">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {
                                modifiedPayments.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="py-3">{formatString(item.type)}</TableCell>
                                        {
                                            Object.values(Month).map((month, i) => {
                                                const monthData = item.months.find(m => m.month === month);
                                                return (
                                                    <TableCell key={i} className="text-center py-3">
                                                        {monthData ? monthData.amount : 0}
                                                    </TableCell>
                                                );
                                            })
                                        }
                                        <TableCell className="font-semibold py-3">
                                            {item.months.reduce((total, m) => total + m.amount, 0)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell className="font-semibold bg-slate-100 dark:bg-background/60">Total</TableCell>
                                {
                                    Object.values(Month).map((month, i) => {
                                        return (
                                            <TableCell key={i} className="text-center font-semibold bg-slate-100 dark:bg-background/60">
                                                {totalForMonth(month)}
                                            </TableCell>
                                        );
                                    })
                                }
                                <TableCell className="bg-slate-100 dark:bg-background/60">
                                    {grandTotal}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default UtilityReport
