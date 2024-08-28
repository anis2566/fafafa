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

import { ContentLayout } from "@/app/dashboard/_components/content-layout";
import { db } from "@/lib/prisma";
import { EditTeacherBillForm } from "./_components/edit-teacher-bill-form";

export const metadata: Metadata = {
    title: "BEC | Expense | Teacher Bill | Edit",
    description: "Basic Education Care",
};

interface Props {
    params: {
        id: string;
    }
}

const EditTeacherBill = async ({ params: { id } }: Props) => {
    const payment = await db.teacherPayment.findUnique({
        where: {
            id
        }
    })

    if (!payment) redirect("/dashboard")

    return (
        <ContentLayout title="Expense">
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
                            <Link href="/dashboard/expense/teacher">Teacher Bill</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Edit</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <EditTeacherBillForm payment={payment} />
        </ContentLayout>
    )
}

export default EditTeacherBill
