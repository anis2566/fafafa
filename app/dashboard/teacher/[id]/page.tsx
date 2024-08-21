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
import { redirect } from "next/navigation";
import { Card, CardContent} from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { AddSubjectButton } from "./_components/add-subject-button,";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SubjectList } from "./_components/subject-list";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export const metadata: Metadata = {
    title: "BEC | Teacher Details",
    description: "Basic Education Care",
};

interface Props {
    params: {
        id: string;
    }
}

const TeacherDetails = async ({ params: { id } }: Props) => {
    const teacher = await db.teacher.findUnique({
        where: {
            id
        }
    })

    if (!teacher) redirect("/dashboard")

    const subjects = await db.teacherSubject.findMany({
        where: {
            teacherId: id
        },
        include: {
            subject: true
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
                        <BreadcrumbPage>Details</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="mt-4 space-y-6">
                <Card>
                    <CardContent>
                        <div className="flex flex-col md:flex-row items-center gap-4 p-4 md:p-6">
                            <Image
                                alt="Avatar"
                                className="rounded-full"
                                height="100"
                                src={teacher.imageUrl}
                                style={{
                                    aspectRatio: "100/100",
                                    objectFit: "cover",
                                }}
                                width="100"
                            />
                            <div className="space-y-1">
                                <div className="font-semibold text-xl text-primary">{teacher.name}</div>
                                <div>{teacher.phone}</div>
                                <Badge>{teacher.teacherId}</Badge>
                            </div>
                        </div>
                        <div className="flex items-center gap-x-3">
                            <AddSubjectButton id={id} />
                            {/* <Button asChild>
                                <Link href={`/dashboard/teacher/${id}/booking`} className="flex items-center gap-x-2 bg-indigo-500 hover:bg-indigo-600">
                                    <PlusCircle className="w-5 h-5" />
                                    Add Booking
                                </Link>
                            </Button> */}
                        </div>
                    </CardContent>
                </Card>

                <Tabs defaultValue="subjects" className="w-full">
                    <TabsList className="flex justify-center mb-4">
                        <TabsTrigger value="subjects">Subjects</TabsTrigger>
                        <TabsTrigger value="class">Class</TabsTrigger>
                        <TabsTrigger value="teachers">Teachers</TabsTrigger>
                    </TabsList>
                    <TabsContent value="subjects">
                        <SubjectList subjects={subjects} />
                    </TabsContent>
                    <TabsContent value="password">Change your password here.</TabsContent>
                </Tabs>
            </div>
        </ContentLayout>
    )
}

export default TeacherDetails
