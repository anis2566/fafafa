import Link from "next/link";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";

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
import { ClassList } from "./_components/class-list";
import { db } from "@/lib/prisma";
import { DownloadButton } from "./_components/download-button";

export const metadata: Metadata = {
    title: "BEC | Teacher | Leave | Class",
    description: "Basic Education Care",
};

interface Props {
    params: {
        id: string;
    }
}

const LeaveDetails = async ({ params: { id } }: Props) => {
    const app = await db.leaveApp.findUnique({
        where: {
            id
        },
        include: {
            classes: true,
            teacher: true,
        }
    })

    if (!app) redirect("/dashboard")

    return (
        <ContentLayout title="Leave">
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
                            <Link href="/dashboard/teacher/leave">History</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Details</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="mt-4 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h1 className="text-md font-semibold">{app.teacher.name}</h1>
                            <div className="flex items-center gap-x-2">
                                <h1>#{app.teacher.teacherId}</h1>
                                <h1>{app.teacher.phone}</h1>
                            </div>
                        </div>
                        <p className="tex-base italic">{app.reason}</p>
                        <div>
                            <h1 className="text-md font-semibold">Attachments</h1>
                            <div className="flex items-center gap-x-3">
                                {
                                    app.attachments.map((item, i) => (
                                        <div key={i} className="space-y-2">
                                            <Image
                                                src={item}
                                                alt="Attachments"
                                                height={200}
                                                width={200}
                                                className="object-cover rounded-md aspect-square"
                                            />
                                            <DownloadButton url={item} />
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Classes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ClassList classes={app.classes} />
                    </CardContent>
                </Card>
            </div>

        </ContentLayout>
    )
}

export default LeaveDetails
