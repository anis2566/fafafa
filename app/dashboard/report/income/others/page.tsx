import Link from "next/link";
import { Metadata } from "next";
import { Month } from "@prisma/client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ContentLayout } from "@/app/dashboard/_components/content-layout";
import { db } from "@/lib/prisma";
import { IncomeList } from "./_components/income-list";

export const metadata: Metadata = {
    title: "BEC | Report | Income | Others",
    description: "Basic Education Care",
};

const OtherReport = async () => {

    const payments = await db.income.groupBy({
        by: ["month", "name"],
        _sum: {
            amount: true
        }
    })

    const modifiedPayments = payments.reduce((acc: { name: string, months: { month: Month, amount: number }[] }[], payment) => {
        const existingType = acc.find(item => item.name === payment.name);

        if (existingType) {
            existingType.months.push({
                month: payment.month,
                amount: payment._sum.amount ?? 0
            });
        } else {
            acc.push({
                name: payment.name,
                months: [{
                    month: payment.month,
                    amount: payment._sum.amount ?? 0
                }]
            });
        }

        return acc;
    }, []);

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
                        <BreadcrumbPage>Others</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Others Report</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <IncomeList data={modifiedPayments} />
                    {/* <Header />
                    <SalaryList payments={payments} /> */}
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default OtherReport
