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
import { EditHouseForm } from "./_components/edit-house-form";

export const metadata: Metadata = {
    title: "BEC | House | Edit",
    description: "Basic Education Care",
};

interface Props {
    params: {
        id: string;
    }
}

const EditHouse = async ({ params: { id } }: Props) => {
    const house = await db.house.findUnique({
        where: {
            id
        }
    })

    if (!house) redirect("/dashboard")

    return (
        <ContentLayout title="House">
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
                            <Link href="/dashboard/house">House</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Edit</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <EditHouseForm house={house} />
        </ContentLayout>
    )
}

export default EditHouse
