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
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { ContentLayout } from "../../_components/content-layout";
import { db } from "@/lib/prisma";
import { formatString } from "@/lib/utils";

export const metadata: Metadata = {
    title: "BEC | Report | Expense",
    description: "Basic Education Care",
};

const ExpenseOverview = async () => {
    const housePayment = await db.housePayment.groupBy({
        by: ["month",],
        _sum: {
            amount: true
        }
    })

    const utilityPayment = await db.expense.groupBy({
        by: ["month", "type"],
        _sum: {
            amount: true
        }
    })

    const modifiedUtilityPayment = utilityPayment.reduce((acc: { type: Expenses, months: { month: Month, amount: number }[] }[], payment) => {
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
                        <BreadcrumbPage>Expense</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Total Expense</CardTitle>
                    <CardDescription>Expense overview.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-center">Expense Type</TableHead>
                                {
                                    Object.values(Month).map((month, i) => (
                                        <TableHead key={i} className="text-center">{month}</TableHead>
                                    ))
                                }
                                <TableHead>Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell>House Rent</TableCell>
                                {
                                    Object.values(Month).map((month, i) => {
                                        const payment = housePayment.find(p => p.month === month);
                                        return (
                                            <TableCell key={i} className="text-center">
                                                {payment ? payment._sum.amount : 0}
                                            </TableCell>
                                        );
                                    })
                                }
                                <TableCell>
                                    {
                                        housePayment.reduce((acc, curr) => acc + (curr._sum.amount ?? 0), 0)
                                    }
                                </TableCell>
                            </TableRow>
                            {
                                modifiedUtilityPayment.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="text-center">{formatString(item.type)}</TableCell>
                                        {
                                            Object.values(Month).map((month, i) => {
                                                const monthData = item.months.find(m => m.month === month);
                                                return (
                                                    <TableCell key={i} className="text-center">
                                                        {monthData ? monthData.amount : 0}
                                                    </TableCell>
                                                );
                                            })
                                        }
                                        <TableCell className="font-semibold">
                                            {item.months.reduce((total, m) => total + m.amount, 0)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell className="text-center font-semibold">Total</TableCell>
                                {
                                    Object.values(Month).map((month, i) => {
                                        const totalAmountForMonth = housePayment.reduce((total, item) => {
                                            return total + (item.month === month ? item._sum.amount ?? 0 : 0);
                                        }, 0) + modifiedUtilityPayment.reduce((total, item) => {
                                            const monthData = item.months.find(m => m.month === month);
                                            return total + (monthData ? monthData.amount : 0);
                                        }, 0);
                                        return (
                                            <TableCell key={i} className="text-center font-semibold">
                                                {totalAmountForMonth}
                                            </TableCell>
                                        );
                                    })
                                }
                                <TableCell></TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default ExpenseOverview
