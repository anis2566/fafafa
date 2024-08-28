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
import { EditHouseRentForm } from "./_components/edit-house-rent-form";

export const metadata: Metadata = {
    title: "BEC | Expense | House Rent | Edit",
    description: "Basic Education Care",
};

interface Props {
    params: {
        id: string;
    }
}

const EditHouseRentPayment = async ({ params: { id } }: Props) => {
    const payment = await db.housePayment.findUnique({
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
                            <Link href="/dashboard/expense/house-rent">House Rent</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Edit</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <EditHouseRentForm payment={payment} />
        </ContentLayout>
    )
}

export default EditHouseRentPayment
