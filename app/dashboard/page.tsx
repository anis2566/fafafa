import { Metadata } from "next";
import { Day, PaymentStatus } from "@prisma/client";

import { ContentLayout } from "./_components/content-layout"
import { db } from "@/lib/prisma";
import { WeeklyIncomeChart } from "./_components/charts/weekly-income-chart";
import { MonthlyIncomeChart } from "./_components/charts/monthly-income-chart";
import { DailyExpenseChart } from "./_components/charts/daily-expense-chart";
import { DailyIncomeChart } from "./_components/charts/daily-income-chart";

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
            ...todayFilter,
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
        createdAt: {
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
        createdAt: {
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

    // const todayExpense = await db.expense.groupBy({
    //     by: ["title"],
    //     where: todayFilter,
    //     _sum: {
    //         amount: true
    //     }
    // })


    return (
        <ContentLayout title="Dashboard">
            <div className="space-y-8">
                <div className="space-y-4">
                    <div className="grid md:grid-cols-4 gap-6">
                        <DailyIncomeChart data={todaySalary.map(item => ({ class: item.class, amount: item._sum.amount ?? 0 }))} />
                        <WeeklyIncomeChart data={weeklySalaryData} />
                        <MonthlyIncomeChart data={monthlySalary.map(item => ({ class: item.class, amount: item._sum.amount ?? 0 }))} />
                        {/* <DailyExpenseChart data={todayExpense.map(item => ({ title: item.title, amount: item._sum.amount ?? 0 }))} /> */}
                    </div>
                </div>
            </div>
        </ContentLayout>
    )
}

export default Dashboard