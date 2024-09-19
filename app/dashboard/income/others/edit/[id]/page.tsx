import Link from "next/link";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";

import { db } from "@/lib/prisma";
import { ContentLayout } from "@/app/dashboard/_components/content-layout";
import { EditIncomeForm } from "./_components/edit-income-form";

export const metadata: Metadata = {
    title: "BEC | Income | Others | Edit",
    description: "Basic Education Care",
};

interface Props {
    params: {
        id: string;
    }
}

const EditOtherIncome = async ({ params: { id } }: Props) => {
    const income = await db.income.findUnique({
        where: {
            id
        }
    })

    if (!income) redirect("/dashboard")

    return (
        <ContentLayout title="Income">
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
                            <Link href="/dashboard/income/history/others">Others Income</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Edit</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <EditIncomeForm income={income} />
        </ContentLayout>
    )
}

export default EditOtherIncome
