import Link from "next/link";
import { Metadata } from "next";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { ContentLayout } from "@/app/dashboard/_components/content-layout";
import { ClassForm } from "./_components/class-form";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "BEC | Batch Class",
    description: "Basic Education Care",
};

interface Props {
    params: {
        id: string;
    }
}

const BatchClass = async ({ params: { id } }: Props) => {
    const batch = await db.batch.findUnique({
        where: {
            id
        }
    })

    if (!batch) redirect("/dashboard")

    return (
        <ContentLayout title="Batch">
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
                            <Link href="/dashboard/batch">Batch</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Class</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <ClassForm batch={batch} />
        </ContentLayout>
    )
}

export default BatchClass
