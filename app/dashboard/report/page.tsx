import Link from "next/link";
import { Metadata } from "next";
import { Month, PaymentStatus, TeacherPaymentStatus, TransactionStatus } from "@prisma/client";

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

import { ContentLayout } from "../_components/content-layout";
import { db } from "@/lib/prisma";

export const metadata: Metadata = {
    title: "BEC | Report | Final",
    description: "Basic Education Care",
};


const FinalReport = async () => {

    const totalSalary = await db.monthlyPayment.groupBy({
        by: ["month"],
        where: {
            status: PaymentStatus.Paid
        },
        _sum: {
            amount: true
        }
    })

    const totalAdmissionFee = await db.admissionPayment.groupBy({
        by: ["month"],
        where: {
            status: PaymentStatus.Paid
        },
        _sum: {
            amount: true
        }
    })

    const othersIncome = await db.income.groupBy({
        by: ["month"],
        _sum: {
            amount: true
        }
    })


    const totalTeacherBill = await db.teacherPayment.groupBy({
        by: ["month"],
        where: {
            status: {
                in: [TeacherPaymentStatus.Pending],
                notIn: [TeacherPaymentStatus.Dismiss]
            }
        },
        _sum: {
            amount: true
        }
    })

    const totalHouseRent = await db.housePayment.groupBy({
        by: ["month"],
        _sum: {
            amount: true
        }
    })

    const totalUtilityBill = await db.expense.groupBy({
        by: ["month"],
        _sum: {
            amount: true
        }
    })

    const teacherAdvance = await db.teacherAdvance.groupBy({
        by: ["month"],
        where: {
            teacher: {
                bank: {
                    advance: {
                        gt: 0
                    }
                }
            }
        },
        _sum: {
            amount: true
        }
    })

    // Combine the data income
    const combinedDataIncome = Object.values(Month).map(month => {
        const salaryBill = totalSalary.find(item => item.month === month)?._sum.amount || 0;
        const admissionBill = totalAdmissionFee.find(item => item.month === month)?._sum.amount || 0;
        const othersBill = othersIncome.find(item => item.month === month)?._sum.amount || 0;
        return {
            month,
            total: salaryBill + admissionBill + othersBill
        };
    });

    const totalIncome = combinedDataIncome.reduce((acc, curr) => acc + curr.total, 0)

    // Combine the data expense
    const combinedDataExpense = Object.values(Month).map(month => {
        const teacherBill = totalTeacherBill.find(item => item.month === month)?._sum.amount || 0;
        const houseRent = totalHouseRent.find(item => item.month === month)?._sum.amount || 0;
        const utilityBill = totalUtilityBill.find(item => item.month === month)?._sum.amount || 0;
        const teacherAdvanceTotal = teacherAdvance.find(item => item.month === month)?._sum.amount || 0;
        return {
            month,
            total: teacherBill + houseRent + utilityBill + teacherAdvanceTotal
        };
    });
    const totalExpense = combinedDataExpense.reduce((acc, curr) => acc + curr.total, 0)


    // Calculate profit
    const combinedDataProfit = Object.values(Month).map(month => {
        const income = combinedDataIncome.find(item => item.month === month)?.total || 0;
        const expense = combinedDataExpense.find(item => item.month === month)?.total || 0;
        return {
            month,
            total: income - expense
        };
    });


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
                    <CardTitle>Final Report</CardTitle>
                    <CardDescription>Total overview.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Total Expense</TableHead>
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
                                <TableCell>Total Income</TableCell>
                                {
                                    combinedDataIncome.map((data, i) => (
                                        <TableCell key={i} className="text-center">{data.total}</TableCell>
                                    ))
                                }
                                <TableCell>{totalIncome}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell>Total Expense</TableCell>
                                {
                                    combinedDataExpense.map((data, i) => (
                                        <TableCell key={i} className="text-center">{data.total}</TableCell>
                                    ))
                                }
                                <TableCell>{totalExpense}</TableCell>
                            </TableRow>
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell>Profit</TableCell>
                                {
                                    combinedDataProfit.map((data, i) => (
                                        <TableCell key={i} className="text-center">{data.total}</TableCell>
                                    ))
                                }
                                <TableCell>{totalIncome - totalExpense}</TableCell>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default FinalReport
