import Link from "next/link";
import { Metadata } from "next";
import { Month, PaymentStatus } from "@prisma/client";

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

export const metadata: Metadata = {
    title: "BEC | Income Overview",
    description: "Basic Education Care",
};


const OverView = async () => {
    const admissionIncome = await db.admissionPayment.groupBy({
        by: ["month"],
        where: {
            status: PaymentStatus.Paid
        },
        _sum: {
            amount: true
        }
    })

    const admissionIncomeTotal = admissionIncome.reduce((acc, curr) => acc + (curr._sum.amount ?? 0), 0)

    const payments = await db.monthlyPayment.groupBy({
        by: ["class", "month"],
        where: {
            status: PaymentStatus.Paid
        },
        _sum: {
            amount: true
        }
    })

    const paymentTotal = payments.reduce((acc, curr) => acc + (curr._sum.amount ?? 0), 0)

    const modifiedPayment = payments.reduce((acc: { class: string, months: { month: Month, amount: number }[] }[], payment) => {
        const existingClass = acc.find(item => item.class === payment.class);

        if (existingClass) {
            existingClass.months.push({
                month: payment.month,
                amount: payment._sum.amount ?? 0
            });
        } else {
            acc.push({
                class: payment.class,
                months: [{
                    month: payment.month,
                    amount: payment._sum.amount ?? 0
                }]
            });
        }

        return acc;
    }, []);

    const othersIncome = await db.income.groupBy({
        by: ["month",],
        _sum: {
            amount: true
        }
    })

    const othersIncomeTotal = othersIncome.reduce((acc, curr) => acc + (curr._sum.amount ?? 0), 0)


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
                            <Link href="/dashboard/report/income">Income</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Overview</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Total Income</CardTitle>
                    <CardDescription>Income overview.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Income Type</TableHead>
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
                                <TableCell>Admission</TableCell>
                                {
                                    Object.values(Month).map((month, i) => {
                                        const monthData = admissionIncome.find(m => m.month === month);
                                        return (
                                            <TableCell key={i} className="text-center">
                                                {monthData ? monthData._sum.amount : 0}
                                            </TableCell>
                                        );
                                    })
                                }
                                <TableCell className="font-semibold">
                                    {admissionIncomeTotal}
                                </TableCell>
                            </TableRow>
                            {
                                modifiedPayment.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.class}</TableCell>
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
                            <TableRow>
                                <TableCell>Others</TableCell>
                                {
                                    Object.values(Month).map((month, i) => {
                                        const monthData = othersIncome.find(m => m.month === month);
                                        return (
                                            <TableCell key={i} className="text-center">
                                                {monthData ? monthData._sum.amount : 0}
                                            </TableCell>
                                        );
                                    })
                                }
                                <TableCell className="font-semibold">{othersIncomeTotal}</TableCell>
                            </TableRow>
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell className="font-semibold">Total</TableCell>
                                {
                                    Object.values(Month).map((month, i) => {
                                        const totalAmountForMonth = 
                                            (admissionIncome.find(m => m.month === month)?._sum.amount ?? 0) +
                                            modifiedPayment.reduce((total, item) => {
                                                const monthData = item.months.find(m => m.month === month);
                                                return total + (monthData ? monthData.amount : 0);
                                            }, 0) +
                                            (othersIncome.find(m => m.month === month)?._sum.amount ?? 0);

                                        return (
                                            <TableCell key={i} className="text-center font-semibold">
                                                {totalAmountForMonth}
                                            </TableCell>
                                        );
                                    })
                                }
                                <TableCell className="font-semibold">
                                    {
                                        Object.values(Month).reduce((grandTotal, month) => {
                                            const monthTotal = 
                                                (admissionIncome.find(m => m.month === month)?._sum.amount ?? 0) +
                                                modifiedPayment.reduce((total, item) => {
                                                    const monthData = item.months.find(m => m.month === month);
                                                    return total + (monthData ? monthData.amount : 0);
                                                }, 0) +
                                                (othersIncome.find(m => m.month === month)?._sum.amount ?? 0);

                                            return grandTotal + monthTotal;
                                        }, 0)
                                    }
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default OverView
