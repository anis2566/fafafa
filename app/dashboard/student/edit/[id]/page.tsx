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
import { EditStudentFrom } from "./_components/edit-student-form";

export const metadata: Metadata = {
    title: "BEC | Edit Student",
    description: "Basic Education Care",
};

interface Props {
    params: {
        id: string;
    }
}

const EditStudent = async ({ params: { id } }: Props) => {
    const student = await db.student.findUnique({
        where: {
            id
        }
    })

    if (!student) redirect("/dashboard")

    return (
        <ContentLayout title="Student">
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
                            <Link href="/dashboard/student">Student</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Edit</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <EditStudentFrom student={student} />
        </ContentLayout>
    )
}

export default EditStudent
