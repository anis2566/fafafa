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
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { ContentLayout } from "@/app/dashboard/_components/content-layout";
import { db } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "BEC | Report | House Rent",
    description: "Basic Education Care",
};

const HouseRentReport = async () => {
    const payments = await db.housePayment.groupBy({
        by: ["month", "houseName"],
        _sum: {
            amount: true
        }
    })

    const modifiedPayment = payments.reduce((acc: { houseName: string, months: { month: Month, amount: number }[] }[], payment) => {
        const existingHouse = acc.find(item => item.houseName === payment.houseName);

        if (existingHouse) {
            existingHouse.months.push({
                month: payment.month,
                amount: payment._sum.amount ?? 0
            });
        } else {
            acc.push({
                houseName: payment.houseName,
                months: [{
                    month: payment.month,
                    amount: payment._sum.amount ?? 0
                }]
            });
        }

        return acc;
    }, []);

    const totalForMonth = (month: Month) => {
        return payments.find((p) => p.month === month)?._sum.amount ?? 0;
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
                        <BreadcrumbPage>House Rent</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>House Rent</CardTitle>
                    <CardDescription>House rent overview.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="bg-slate-100 dark:bg-background/60">House</TableHead>
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
                                modifiedPayment.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="py-3">{item.houseName}</TableCell>
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
                                <TableCell className="text-cente font-semibold bg-slate-100 dark:bg-background/60">M. Total</TableCell>
                                {
                                    Object.values(Month).map((month, i) => {
                                        return (
                                            <TableCell key={i} className="text-center font-semibold bg-slate-100 dark:bg-background/60">
                                                {totalForMonth(month)}
                                            </TableCell>
                                        );
                                    })
                                }
                                <TableCell className="text-center font-semibold bg-slate-100 dark:bg-background/60">
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

export default HouseRentReport
