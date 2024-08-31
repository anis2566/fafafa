import Link from "next/link";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { BookOpen, Building, Clock, PlusCircle } from "lucide-react";
import { PaymentStatus } from "@prisma/client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { ContentLayout } from "@/app/dashboard/_components/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button";

import { adjustTime } from "@/lib/utils";
import { AddStudentButton } from "./_components/add-student-button";
import { StudentList } from "./_components/student-list";
import { db } from "@/lib/prisma";
import { ClassList } from "./_components/class-list";
import { TeacherList } from "./_components/teacher-list";

export const metadata: Metadata = {
    title: "BEC | Batch Details",
    description: "Basic Education Care",
};

interface Props {
    params: {
        id: string;
    },
}

const BatchDetails = async ({ params: { id } }: Props) => {

    const batch = await db.batch.findUnique({
        where: {
            id
        },
        include: {
            room: true,
            students: {
                include: {
                    payments: {
                        where: {
                            status: PaymentStatus.Unpaid
                        }
                    }
                }
            },
            classes: {
                include: {
                    teacher: {
                        include: {
                            classes: {
                                include: {
                                    batch: true,
                                    subject: true
                                }
                            },
                        }
                    },
                    subject: true
                }
            }
        }
    })

    if (!batch) redirect("/dashboard")

    const teachers = await db.batchClass.findMany({
        where: {
            batchId: id,
        },
        include: {
            subject: true,
            teacher: true
        }
    })

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
                        <BreadcrumbPage>Details</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="space-y-6">
                <Card className="pt-4 mt-4">
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <h1 className="text-2xl font-semibold">{batch.name}</h1>
                            <div className="flex items-center gap-x-3">
                                <Badge className="flex items-center gap-x-1 max-w-fit" variant="outline">
                                    <BookOpen className="w-4 h-4" />
                                    <p>{batch.class}</p>
                                </Badge>
                                <Badge className="flex items-center gap-x-1 max-w-fit" variant="outline">
                                    <Building className="w-4 h-4" />
                                    <p>{batch.room.name}</p>
                                </Badge>
                                <Badge className="flex items-center gap-x-1 max-w-fit" variant="outline">
                                    <Clock className="w-4 h-4" />
                                    <p>{adjustTime(batch.time[0])} - {batch.time[batch.time.length - 1]}</p>
                                </Badge>
                            </div>
                        </div>
                        <div className="flex items-center gap-x-3">
                            <AddStudentButton id={id} className={batch.class} />
                            <Button asChild className="bg-amber-600 hover:bg-amber-700">
                                <Link href={`/dashboard/batch/${id}/class`} className="mt-4 flex items-center gap-x-2">
                                    <PlusCircle className="w-5 h-5" />
                                    Add Class
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Tabs defaultValue="students" className="w-full">
                    <TabsList className="flex justify-center mb-4">
                        <TabsTrigger value="students">Students</TabsTrigger>
                        <TabsTrigger value="class">Class</TabsTrigger>
                        <TabsTrigger value="teachers">Teachers</TabsTrigger>
                    </TabsList>
                    <TabsContent value="students">
                        <Card>
                            <CardHeader>
                                <CardTitle>Student List</CardTitle>
                                <CardDescription>A collection of batch student.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <StudentList students={batch.students} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="class">
                        <Card>
                            <CardHeader>
                                <CardTitle>Class List</CardTitle>
                                <CardDescription>A collection of batch class.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <ClassList classes={batch.classes} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="teachers">
                        <Card>
                            <CardHeader>
                                <CardTitle>Teacher List</CardTitle>
                                <CardDescription>A collection of batch teacher.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <TeacherList classes={teachers} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

            </div>
        </ContentLayout>
    )
}

export default BatchDetails
