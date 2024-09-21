import Link from "next/link";
import { Metadata } from "next";
import { Expenses, Month, TeacherPaymentStatus, Prisma } from "@prisma/client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
import { formatString } from "@/lib/utils";

export const metadata: Metadata = {
    title: "BEC | Report | Expense",
    description: "Basic Education Care",
};

type GroupedPayment = {
    month: Month;
    _sum: {
        amount: number | null;
    };
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

const ExpenseOverview = async () => {
    const [housePayment, utilityPayment, teacherPayment, teacherAdvance, teacherDismissPayments] = await Promise.all([
        db.housePayment.groupBy({
            by: ["month"],
            _sum: { amount: true },
        }),
        db.expense.groupBy({
            by: ["month", "type"],
            _sum: { amount: true },
        }),
        db.teacherPayment.groupBy({
            by: ["month"],
            where: { status: { not: TeacherPaymentStatus.Dismiss } },
            _sum: { amount: true },
        }),
        db.teacherAdvance.groupBy({
            by: ["month"],
            _sum: { amount: true },
        }),
        db.teacherPayment.groupBy({
            by: ["month"],
            where: { status: TeacherPaymentStatus.Dismiss },
            _sum: { amount: true },
        }),
    ]);

    const modifiedUtilityPayment = processUtilityPayments(utilityPayment);

    const calculateAdjustedAdvance = (
        month: Month,
        teacherAdvance: GroupedPayment[],
        teacherDismissPayments: GroupedPayment[]
    ) => {
        const advance = teacherAdvance.find((a) => a.month === month)?._sum.amount ?? 0;
        const dismiss = teacherDismissPayments.find((d) => d.month === month)?._sum.amount ?? 0;
        return advance - dismiss;
    };

    const totalForMonth = (month: Month) => {
        const houseAmount = housePayment.find((p) => p.month === month)?._sum.amount ?? 0;
        const teacherAmount = teacherPayment.find((p) => p.month === month)?._sum.amount ?? 0;
        const advanceAmount = calculateAdjustedAdvance(month, teacherAdvance, teacherDismissPayments);

        const utilityAmount = modifiedUtilityPayment.reduce((total, utilityItem) => { 
            const utilityMonth = utilityItem.months.find((m) => m.month === month)?.amount ?? 0;
            return total + utilityMonth;
        }, 0);

        return houseAmount + teacherAmount + advanceAmount + utilityAmount;
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
                                <TableHead className="bg-slate-100 dark:bg-background/60">Expense Type</TableHead>
                                {Object.values(Month).map((month, i) => (
                                    <TableHead key={i} className="text-center bg-slate-100 dark:bg-background/60">
                                        {month}
                                    </TableHead>
                                ))}
                                <TableHead className="bg-slate-100 dark:bg-background/60">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {/* Teacher Payment Row */}
                            <TableRow>
                                <TableCell className="py-3">Teacher Bill</TableCell>
                                {Object.values(Month).map((month, i) => (
                                    <TableCell key={i} className="text-center py-3">
                                        {teacherPayment.find((p) => p.month === month)?._sum.amount ?? 0}
                                    </TableCell>
                                ))}
                                <TableCell className="font-semibold py-3">
                                    {teacherPayment.reduce((acc, curr) => acc + (curr._sum.amount ?? 0), 0)}
                                </TableCell>
                            </TableRow>

                            {/* House Rent Row */}
                            <TableRow>
                                <TableCell className="py-3">House Rent</TableCell>
                                {Object.values(Month).map((month, i) => (
                                    <TableCell key={i} className="text-center py-3">
                                        {housePayment.find((p) => p.month === month)?._sum.amount ?? 0}
                                    </TableCell>
                                ))}
                                <TableCell className="font-semibold py-3">
                                    {housePayment.reduce((acc, curr) => acc + (curr._sum.amount ?? 0), 0)}
                                </TableCell>
                            </TableRow>

                            {/* Utility Payments */}
                            {modifiedUtilityPayment.map((item, index) => (
                                <TableRow key={index}>
                                    <TableCell className="py-3">{formatString(item.type)}</TableCell>
                                    {Object.values(Month).map((month, i) => (
                                        <TableCell key={i} className="text-center py-3">
                                            {item.months.find((m) => m.month === month)?.amount ?? 0}
                                        </TableCell>
                                    ))}
                                    <TableCell className="font-semibold">
                                        {item.months.reduce((total, m) => total + m.amount, 0)}
                                    </TableCell>
                                </TableRow>
                            ))}

                            {/* Advance Payments */}
                            <TableRow>
                                <TableCell className="py-3">Advance</TableCell>
                                {Object.values(Month).map((month, i) => {
                                    const advanceData = teacherAdvance.find((m) => m.month === month);
                                    const dismissData = teacherDismissPayments.find((m) => m.month === month);
                                    return (
                                        <TableCell key={i} className="text-center py-3">
                                            {(advanceData?._sum.amount ?? 0) - (dismissData?._sum.amount ?? 0)}
                                        </TableCell>
                                    );
                                })}
                                <TableCell className="font-semibold py-3">
                                    {teacherAdvance.reduce((total, m) => {
                                        const dismissAmount = teacherDismissPayments.find((d) => d.month === m.month)?._sum.amount ?? 0;
                                        return total + (m._sum.amount ?? 0) - dismissAmount;
                                    }, 0)}
                                </TableCell>
                            </TableRow>
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell className="font-semibold bg-slate-100 dark:bg-background/60">Total</TableCell>
                                {Object.values(Month).map((month, i) => (
                                    <TableCell key={i} className="text-center font-semibold bg-slate-100 dark:bg-background/60">
                                        {totalForMonth(month)}
                                    </TableCell>
                                ))}
                                <TableCell className="font-semibold bg-slate-100 dark:bg-background/60">{grandTotal}</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </CardContent>
            </Card>
        </ContentLayout>
    );
};

export default ExpenseOverview;
