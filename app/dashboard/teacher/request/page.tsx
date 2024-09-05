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
import { ContentLayout } from "../../_components/content-layout";
import { db } from "@/lib/prisma";
import { Role, Status } from "@prisma/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RequestList } from "./_components/request-list";

export const metadata: Metadata = {
    title: "BEC | Teacher | Request",
    description: "Basic Education Care",
};


const TeacherRequest = async () => {
    const requests = await db.teacherRequest.findMany({
        include: {
            user: true,
            teacher: true
        }
    })

    return (
        <ContentLayout title="Teacher">
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
                            <Link href="/dashboard/teacher">Teacher</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Request</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card>
                <CardHeader>
                    <CardTitle>Request List</CardTitle>
                    <CardDescription>A collection of teacher request.</CardDescription>
                </CardHeader>
                <CardContent>
                    <RequestList requests={requests} />
                </CardContent>
            </Card>
            {/* <EditTeacherForm teacher={teacher} /> */}
        </ContentLayout>
    )
}

export default TeacherRequest
