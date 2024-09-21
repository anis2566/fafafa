import Link from "next/link";
import { Metadata } from "next";
import { Month, PaymentStatus, TeacherPaymentStatus } from "@prisma/client";

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
} from "@/components/ui/table";

import { ContentLayout } from "../_components/content-layout";
import { db } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "BEC | Report | Final",
    description: "Basic Education Care",
};

// Define custom types for your grouped data
type GroupedData = {
    month: Month;
    _sum: {
        amount: number | null;
    };
};

// Utility function to sum grouped amounts
const sumGroupedData = (data: GroupedData[], month: Month): number => {
    return data.find(item => item.month === month)?._sum.amount || 0;
};

// Utility function to sum totals
const calculateTotal = (data: { month: Month; total: number }[]): number => {
    return data.reduce((acc, curr) => acc + curr.total, 0);
};

const FinalReport = async () => {
    const [
        totalSalary, totalAdmissionFee, othersIncome, totalTeacherBill,
        totalHouseRent, totalUtilityBill, teacherAdvance, teacherDismissPayments
    ] = await Promise.all([
        db.monthlyPayment.groupBy({
            by: ["month"],
            where: { status: PaymentStatus.Paid },
            _sum: { amount: true },
        }),    
        db.admissionPayment.groupBy({
            by: ["month"],
            where: { status: PaymentStatus.Paid },
            _sum: { amount: true },
        }),    
        db.income.groupBy({
            by: ["month"],
            _sum: { amount: true },
        }),  
        db.teacherPayment.groupBy({
            by: ["month"],
            where: { status: { in: [TeacherPaymentStatus.Pending], notIn: [TeacherPaymentStatus.Dismiss] }},
            _sum: { amount: true },
        }),
        db.housePayment.groupBy({
            by: ["month"],
            _sum: { amount: true },
        }),
        db.expense.groupBy({
            by: ["month"],
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

    // Combine data into monthly total for income and expense
    const combinedDataIncome = Object.values(Month).map(month => ({
        month,
        total: sumGroupedData(totalSalary, month) + 
               sumGroupedData(totalAdmissionFee, month) + 
               sumGroupedData(othersIncome, month),
    }));

    const totalIncome = calculateTotal(combinedDataIncome);

    const combinedDataExpense = Object.values(Month).map(month => ({
        month,
        total: sumGroupedData(totalTeacherBill, month) + 
               sumGroupedData(totalHouseRent, month) + 
               sumGroupedData(totalUtilityBill, month) + 
               (sumGroupedData(teacherAdvance, month) - sumGroupedData(teacherDismissPayments, month)),
    }));

    const totalExpense = calculateTotal(combinedDataExpense);

    // Combine the data to calculate profit
    const combinedDataProfit = Object.values(Month).map(month => ({
        month,
        total: (combinedDataIncome.find(item => item.month === month)?.total || 0) -
               (combinedDataExpense.find(item => item.month === month)?.total || 0),
    }));

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
                        <BreadcrumbPage>Final</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Final</CardTitle>
                    <CardDescription>Total overview.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="bg-slate-100 dark:bg-background/60">Total Expense</TableHead>
                                {Object.values(Month).map((month, i) => (
                                    <TableHead key={i} className="text-center bg-slate-100 dark:bg-background/60">{month}</TableHead>
                                ))}
                                <TableHead className="bg-slate-100 dark:bg-background/60">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="py-3">Total Income</TableCell>
                                {combinedDataIncome.map((data, i) => (
                                    <TableCell key={i} className="text-center py-3">{data.total}</TableCell>
                                ))}
                                <TableCell className="py-3">{totalIncome}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="py-3">Total Expense</TableCell>
                                {combinedDataExpense.map((data, i) => (
                                    <TableCell key={i} className="text-center py-3">{data.total}</TableCell>
                                ))}
                                <TableCell className="py-3">{totalExpense}</TableCell>
                            </TableRow>
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell className="bg-slate-100 dark:bg-background/60">Profit</TableCell>
                                {combinedDataProfit.map((data, i) => (
                                    <TableCell key={i} className="text-center bg-slate-100 dark:bg-background/60">{data.total}</TableCell>
                                ))}
                                <TableCell className="bg-slate-100 dark:bg-background/60">{totalIncome - totalExpense}</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </CardContent>
            </Card>
        </ContentLayout>
    );
};

export default FinalReport;
