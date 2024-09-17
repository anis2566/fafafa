import { Metadata } from "next";
import { format } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { ContentLayout } from "./_components/content-layout"
import { WeeklyIncomeChart } from "./_components/charts/weekly-income-chart";
import { MonthlyIncomeChart } from "./_components/charts/monthly-income-chart";
import { DailyExpenseChart } from "./_components/charts/daily-expense-chart";
import { DailyIncomeChart } from "./_components/charts/daily-income-chart";
import { AdmissionChart } from "./_components/charts/admission-chart";
import { Badge } from "@/components/ui/badge";
import { formatString } from "@/lib/utils";
import { GET_DASHBOARD_DATA } from "./action";

export const metadata: Metadata = {
    title: "BEC | Dashboard",
    description: "Basic Education Care",
};

const Dashboard = async () => {
    const { todaySalary, expenseArray, monthlySalary, recentStudent, studentsByDay, weeklySalaryData } = await GET_DASHBOARD_DATA()

    return (
        <ContentLayout title="Dashboard">
            <div className="space-y-8">
                <div className="grid md:grid-cols-4 gap-6">
                    <DailyIncomeChart data={todaySalary.map(item => ({ class: item.class, amount: item._sum.amount ?? 0 }))} />
                    <WeeklyIncomeChart data={weeklySalaryData} />
                    <MonthlyIncomeChart data={monthlySalary.map(item => ({ class: item.class, amount: item._sum.amount ?? 0 }))} />
                    <DailyExpenseChart data={expenseArray} />
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