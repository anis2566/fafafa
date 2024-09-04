import Link from "next/link";
import { Metadata } from "next";
import { PaymentStatus, TransactionStatus } from "@prisma/client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

    const todaySalary = await db.monthlyPayment.aggregate({
        where: {
            updatedAt: {
                gte: today,
                lt: tomorrow,
            },
            status: PaymentStatus.Paid
        },
        _sum: {
            amount: true
        },
        _count: {
            _all: true
        }
    })

    const todayِAdmission = await db.admissionPayment.aggregate({
        where: {
            OR: [
                {
                    ...todayFilter,
                    status: PaymentStatus.Paid
                },
                {
                    updatedAt: {
                        gte: today,
                        lt: tomorrow,
                    },
                    status: PaymentStatus.Paid
                }
            ]
        },
        _sum: {
            amount: true
        },
        _count: {
            _all: true
        }
    })

    const todayِHouseRent = await db.housePayment.aggregate({
        where: {
            OR: [
                {
                    ...todayFilter,
                },
                {
                    updatedAt: {
                        gte: today,
                        lt: tomorrow,
                    },
                }
            ]
        },
        _sum: {
            amount: true
        },
        _count: {
            _all: true
        }
    })

    const todayِUtility = await db.expense.groupBy({
        by: ["type"],
        where: {
            OR: [
                {
                    ...todayFilter,
                },
                {
                    updatedAt: {
                        gte: today,
                        lt: tomorrow,
                    },
                }
            ]
        },
        _sum: {
            amount: true
        },
        _count: {
            _all: true
        }
    })

    const todayِTeacherAdvance = await db.teacherAdvance.aggregate({
        where: {
            OR: [
                {
                    ...todayFilter,
                    status: TransactionStatus.Approve
                },
                {
                    updatedAt: {
                        gte: today,
                        lt: tomorrow,
                    },
                    status: TransactionStatus.Approve
                }
            ]
        },
        _sum: {
            amount: true
        },
        _count: {
            _all: true
        }
    })

    const totalIncome = (todaySalary._sum.amount ?? 0) + (todayِAdmission._sum.amount ?? 0);
    const totalExpenses = (todayِHouseRent._sum.amount ?? 0) +
        todayِUtility.reduce((acc, item) => acc + (item._sum.amount ?? 0), 0) +
        (todayِTeacherAdvance._sum.amount ?? 0)

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

            <div className="mt-4 space-y-8">
                <Card>
                    <CardHeader className="pb-0">
                        <CardTitle>Income</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Unit</TableHead>
                                    <TableHead>Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Total Salary</TableCell>
                                    <TableCell>{todaySalary._count._all}</TableCell>
                                    <TableCell>{todaySalary._sum.amount}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Total Admission Fee</TableCell>
                                    <TableCell>{todayِAdmission._count._all}</TableCell>
                                    <TableCell>{todayِAdmission._sum.amount ?? 0}</TableCell>
                                </TableRow>
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell className="text-md font-semibold">Sub Total</TableCell>
                                    <TableCell>{(todaySalary._sum.amount ?? 0) + (todayِAdmission._sum.amount ?? 0)}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-0">
                        <CardTitle>Expense</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Unit</TableHead>
                                    <TableHead>Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Teacher Advance</TableCell>
                                    <TableCell>{todayِTeacherAdvance._count._all}</TableCell>
                                    <TableCell>{todayِTeacherAdvance._sum.amount ?? 0}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>House Rent Payment</TableCell>
                                    <TableCell>{todayِHouseRent._count._all}</TableCell>
                                    <TableCell>{todayِHouseRent._sum.amount ?? 0}</TableCell>
                                </TableRow>
                                {
                                    todayِUtility.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{item.type}</TableCell>
                                            <TableCell>{item._count._all ?? 0}</TableCell>
                                            <TableCell>{item._sum.amount}</TableCell>
                                        </TableRow>
                                    ))
                                }

                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell className="text-md font-semibold">Sub Total</TableCell>
                                    <TableCell>{totalExpenses}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-0">
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Total</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Totoal Income</TableCell>
                                    <TableCell>{totalIncome}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Total Expense</TableCell>
                                    <TableCell>{totalExpenses}</TableCell>
                                </TableRow>
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell className="text-md font-semibold">Balance</TableCell>
                                    <TableCell>{totalIncome - totalExpenses}</TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </ContentLayout>
    )
}

export default DailyReport
