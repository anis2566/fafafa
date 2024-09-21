import Link from "next/link";
import { Metadata } from "next";
import { Month, PaymentStatus } from "@prisma/client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
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
} from "@/components/ui/table";
import { ContentLayout } from "../../_components/content-layout";
import { db } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "BEC | Income | Overview",
    description: "Basic Education Care",
};

const OverView = async () => {
    const [admissionIncome, payments, othersIncome] = await Promise.all([
        db.admissionPayment.groupBy({
            by: ["month"],
            where: {
                status: PaymentStatus.Paid,
            },
            _sum: {
                amount: true,
            },
        }),
        db.monthlyPayment.groupBy({
            by: ["class", "month"],
            where: {
                status: PaymentStatus.Paid,
            },
            _sum: {
                amount: true,
            },
        }),
        db.income.groupBy({
            by: ["month"],
            _sum: {
                amount: true,
            },
        }),
    ]);

    // Calculate total amounts
    const admissionIncomeTotal = admissionIncome.reduce((acc, curr) => acc + (curr._sum.amount ?? 0), 0);
    const paymentTotal = payments.reduce((acc, curr) => acc + (curr._sum.amount ?? 0), 0);
    const othersIncomeTotal = othersIncome.reduce((acc, curr) => acc + (curr._sum.amount ?? 0), 0);

    // Organize payments by class and months
    const modifiedPayment = payments.reduce(
        (acc: { class: string; months: { month: Month; amount: number }[] }[], payment) => {
            const existingClass = acc.find((item) => item.class === payment.class);

            if (existingClass) {
                existingClass.months.push({
                    month: payment.month,
                    amount: payment._sum.amount ?? 0,
                });
            } else {
                acc.push({
                    class: payment.class,
                    months: [
                        {
                            month: payment.month,
                            amount: payment._sum.amount ?? 0,
                        },
                    ],
                });
            }

            return acc;
        },
        []
    );

    // Helper to get total amount for a specific month
    const getTotalForMonth = (month: Month): number => {
        return (
            (admissionIncome.find((m) => m.month === month)?._sum.amount ?? 0) +
            modifiedPayment.reduce((total, item) => {
                const monthData = item.months.find((m) => m.month === month);
                return total + (monthData?.amount ?? 0);
            }, 0) +
            (othersIncome.find((m) => m.month === month)?._sum.amount ?? 0)
        );
    };

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
                                <TableHead className="bg-slate-100 dark:bg-background/60">Income Type</TableHead>
                                {Object.values(Month).map((month, i) => (
                                    <TableHead key={i} className="text-center bg-slate-100 dark:bg-background/60">
                                        {month}
                                    </TableHead>
                                ))}
                                <TableHead className="bg-slate-100 dark:bg-background/60">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Admission Row */}
                            <TableRow>
                                <TableCell className="py-3">Admission</TableCell>
                                {Object.values(Month).map((month, i) => {
                                    const monthData = admissionIncome.find((m) => m.month === month);
                                    return (
                                        <TableCell key={i} className="text-center py-3">
                                            {monthData ? monthData._sum.amount : 0}
                                        </TableCell>
                                    );
                                })}
                                <TableCell className="font-semibold py-3">{admissionIncomeTotal}</TableCell>
                            </TableRow>

                            {/* Monthly Payments Rows */}
                            {modifiedPayment.map((item, index) => (
                                <TableRow key={index} className="py-3">
                                    <TableCell>{item.class}</TableCell>
                                    {Object.values(Month).map((month, i) => {
                                        const monthData = item.months.find((m) => m.month === month);
                                        return (
                                            <TableCell key={i} className="text-center py-3">
                                                {monthData ? monthData.amount : 0}
                                            </TableCell>
                                        );
                                    })}
                                    <TableCell className="font-semibold py-3">
                                        {item.months.reduce((total, m) => total + m.amount, 0)}
                                    </TableCell>
                                </TableRow>
                            ))}

                            {/* Other Income Row */}
                            <TableRow>
                                <TableCell className="py-3">Others</TableCell>
                                {Object.values(Month).map((month, i) => {
                                    const monthData = othersIncome.find((m) => m.month === month);
                                    return (
                                        <TableCell key={i} className="text-center py-3">
                                            {monthData ? monthData._sum.amount : 0}
                                        </TableCell>
                                    );
                                })}
                                <TableCell className="font-semibold py-3">{othersIncomeTotal}</TableCell>
                            </TableRow>
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell className="font-semibold bg-slate-100 dark:bg-background/60">Total</TableCell>
                                {Object.values(Month).map((month, i) => (
                                    <TableCell key={i} className="text-center font-semibold bg-slate-100 dark:bg-background/60">
                                        {getTotalForMonth(month)}
                                    </TableCell>
                                ))}
                                <TableCell className="font-semibold bg-slate-100 dark:bg-background/60">
                                    {admissionIncomeTotal + paymentTotal + othersIncomeTotal}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </CardContent>
            </Card>
        </ContentLayout>
    );
};

export default OverView;
