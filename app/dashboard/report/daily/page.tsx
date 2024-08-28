import Link from "next/link";
import { Metadata } from "next";
import { Month, PaymentStatus, TransactionStatus } from "@prisma/client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { ContentLayout } from "../../_components/content-layout";
import { db } from "@/lib/prisma";
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

export const metadata: Metadata = {
    title: "BEC | Report | Daily",
    description: "Basic Education Care",
};

const DailyReport = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayFilter = {
        createdAt: {
            gte: today,
            lt: tomorrow,
        },
    };

    const totalSalary = await db.monthlyPayment.groupBy({
        by: ["month",],
        where: {
            status: PaymentStatus.Paid,
            ...todayFilter
        },
        _sum: {
            amount: true
        }
    })

    const totalAdmissionFee = await db.admissionPayment.groupBy({
        by: ["month"],
        where: {
            status: PaymentStatus.Paid,
            ...todayFilter
        },
        _sum: {
            amount: true
        }
    })


    const totalTeacherBill = await db.teacherPayment.groupBy({
        by: ["month"],
        where: {
            status: TransactionStatus.Approve,
            ...todayFilter
        },
        _sum: {
            amount: true
        }
    })

    const totalHouseRent = await db.housePayment.groupBy({
        by: ["month"],
        where: todayFilter,
        _sum: {
            amount: true
        }
    })

    const totalUtilityBill = await db.expense.groupBy({
        by: ["month"],
        where: todayFilter,
        _sum: {
            amount: true
        }
    })

    // Combine the data income
    const combinedDataIncome = Object.values(Month).map(month => {
        const salaryBill = totalSalary.find(item => item.month === month)?._sum.amount || 0;
        const admissionBill = totalAdmissionFee.find(item => item.month === month)?._sum.amount || 0;
        return {
            month,
            total: salaryBill + admissionBill
        };
    });

    const totalIncome = combinedDataIncome.reduce((acc, curr) => acc + curr.total, 0)

    // Combine the data expense
    const combinedDataExpense = Object.values(Month).map(month => {
        const teacherBill = totalTeacherBill.find(item => item.month === month)?._sum.amount || 0;
        const houseRent = totalHouseRent.find(item => item.month === month)?._sum.amount || 0;
        const utilityBill = totalUtilityBill.find(item => item.month === month)?._sum.amount || 0;
        return {
            month,
            total: teacherBill + houseRent + utilityBill
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

    console.log(totalSalary)

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
                        <BreadcrumbPage>Daily Report</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>


        </ContentLayout>
    )
}

export default DailyReport
