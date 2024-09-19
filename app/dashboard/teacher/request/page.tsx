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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { ContentLayout } from "../../_components/content-layout";
import { db } from "@/lib/prisma";
import { RequestList } from "./_components/request-list";
import { CustomPagination } from "@/components/custom-pagination";
import { Header } from "./_components/header";

export const metadata: Metadata = {
    title: "BEC | Teacher | Request",
    description: "Basic Education Care",
};

interface Props {
    searchParams: {
        id?: string;
        name?: string;
        page?: string;
        perPage?: string;
    };
}

const TeacherRequest = async ({ searchParams }: Props) => {
    const {
        id,
        name,
        page = "1",
        perPage = "5"
    } = searchParams;

    const itemsPerPage = parseInt(perPage, 10);
    const currentPage = parseInt(page, 10);
    const teacherId = id ? parseInt(id) : undefined;

    const [requests, totalRequest] = await Promise.all([
        await db.teacherRequest.findMany({
            where: {
                ...(name && {
                    teacher: {
                        name: {
                            contains: name, mode: "insensitive"
                        }
                    }
                }),
                ...(teacherId && {
                    teacher: {
                        teacherId
                    }
                }),
            },
            include: {
                user: true,
                teacher: true
            },
            orderBy: {
                createdAt: "desc"
            },
            skip: (currentPage - 1) * itemsPerPage,
            take: itemsPerPage,
        }),
        await db.teacherRequest.count({
            where: {
                ...(name && {
                    teacher: {
                        name: {
                            contains: name, mode: "insensitive"
                        }
                    }
                }),
                ...(teacherId && {
                    teacher: {
                        teacherId
                    }
                })
            }
        })
    ])

    const totalPage = Math.ceil(totalRequest / itemsPerPage)

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

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Request List</CardTitle>
                    <CardDescription>A collection of teacher request.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Header />
                    <RequestList requests={requests} />
                    <CustomPagination totalPage={totalPage} />
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default TeacherRequest
