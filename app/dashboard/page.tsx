import { Metadata } from "next";
import { ContentLayout } from "./_components/content-layout"
import { DailyIncomeChart } from "./_components/charts/daily-income-chart";
import { db } from "@/lib/prisma";
import { PaymentStatus } from "@prisma/client";

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

    return (
        <ContentLayout title="Dashboard">
            <div className="grid md:grid-cols-4 gap-6">
                <DailyIncomeChart />
            </div>
        </ContentLayout>
    )
}

export default Dashboard