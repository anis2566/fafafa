import { Metadata } from "next";
import { Day, PaymentStatus, Expenses } from "@prisma/client";

import { ContentLayout } from "./_components/content-layout"
import { db } from "@/lib/prisma";
import { WeeklyIncomeChart } from "./_components/charts/weekly-income-chart";
import { MonthlyIncomeChart } from "./_components/charts/monthly-income-chart";
import { DailyExpenseChart } from "./_components/charts/daily-expense-chart";
import { DailyIncomeChart } from "./_components/charts/daily-income-chart";
import { AdmissionChart } from "./_components/charts/admission-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatString } from "@/lib/utils";
import { format } from "date-fns";

export const metadata: Metadata = {
    title: "BEC | Dashboard",
    description: "Basic Education Care",
};

const Dashboard = async () => {
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

    const todaySalary = await db.monthlyPayment.groupBy({
        by: ["class"],
        where: {
            updatedAt: {
                gte: today,
                lt: tomorrow,
            },
            status: PaymentStatus.Paid
        },
        _sum: {
            amount: true
        }
    });

    // Calculate the start of the week (previous Sunday)
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());

    // Calculate the end of the week (upcoming Saturday)
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999); // Set to the end of the day

    const weekFilter = {
        updatedAt: {
            gte: weekStart,
            lt: weekEnd,
        },
    };

    const weeklySalary = await db.monthlyPayment.groupBy({
        by: ["createdAt"],
        where: {
            ...weekFilter,
            status: PaymentStatus.Paid
        },
        _sum: {
            amount: true
        }
    });

    // Transform the data to group by day
    const weeklySalaryByDay = weeklySalary.reduce((acc: { [key: string]: { day: Day, amount: number } }, item) => {
        const day = item.createdAt.toLocaleDateString('en-US', { weekday: 'long' }) as Day; // Cast to Day type
        if (!acc[day]) {
            acc[day] = { day, amount: 0 };
        }
        acc[day].amount += item._sum.amount ?? 0;
        return acc;
    }, {});

    const weeklySalaryData = Object.values(weeklySalaryByDay);

    // Calculate the start of the month
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    // Calculate the end of the month
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    monthEnd.setHours(23, 59, 59, 999); // Set to the end of the day

    const monthFilter = {
        updatedAt: {
            gte: monthStart,
            lt: monthEnd,
        },
    };

    const monthlySalary = await db.monthlyPayment.groupBy({
        by: ["class"],
        where: {
            ...monthFilter,
            status: PaymentStatus.Paid
        },
        _sum: {
            amount: true
        }
    });

    const todayExpense = await db.expense.groupBy({
        by: ["type"],
        where: todayFilter,
        _sum: {
            amount: true
        }
    })

    const formatedToadyExpense = todayExpense.map(item => ({ title: item.type as Expenses, amount: item._sum.amount ?? 0 }));

    const todayAdvance = await db.teacherAdvance.aggregate({
        _sum: {
            amount: true
        }
    })

    const expensaArray = [...formatedToadyExpense, { title: "Advance", amount: todayAdvance._sum.amount ?? 0 }];

    const students = await db.student.groupBy({
        by: ["createdAt"],
        where: {
            OR: [
                {
                    ...monthFilter
                },
            ]
        },
        _count: {
            _all: true
        }
    })

    // Initialize an array with all dates of the current month up to today
    const daysInMonth = today.getDate();
    const studentsByDay = Array.from({ length: daysInMonth }, (_, i) => {
        const date = new Date(today.getFullYear(), today.getMonth(), i + 1).toLocaleDateString('en-US');
        return { date, count: 0 };
    });

    // Fill in the student counts
    students.forEach(item => {
        const date = item.createdAt.toLocaleDateString('en-US');
        const day = studentsByDay.find(d => d.date === date);
        if (day) {
            day.count = item._count._all ?? 0;
        }
    });

    const recentStudent = await db.student.findMany({
        orderBy: {
            createdAt: "desc"
        },
        take: 3
    })

    return (
        <ContentLayout title="Dashboard">
            <div className="space-y-8">
                <div className="grid md:grid-cols-4 gap-6">
                    <DailyIncomeChart data={todaySalary.map(item => ({ class: item.class, amount: item._sum.amount ?? 0 }))} />
                    <WeeklyIncomeChart data={weeklySalaryData} />
                    <MonthlyIncomeChart data={monthlySalary.map(item => ({ class: item.class, amount: item._sum.amount ?? 0 }))} />
                    <DailyExpenseChart data={expensaArray} />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <AdmissionChart data={studentsByDay} />
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Admission</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {
                                recentStudent.map(student => (
                                    <div className="flex items-center justify-between border border-primary/40 p-2 rounded-md" key={student.id}>
                                        <div className="flex items-center gap-x-3">
                                            <Avatar>
                                                <AvatarImage src={student.imageUrl} />
                                                <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p>{student.name}</p>
                                                <Badge>{formatString(student.class)}</Badge>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{format(student.createdAt, "dd MMM yyyy")}</p>
                                    </div>
                                ))
                            }
                        </CardContent>
                    </Card>
                </div>
            </div>
        </ContentLayout>
    )
}

export default Dashboard