import Link from "next/link";
import { Metadata } from "next";
import { BookOpen, BuildingIcon, Clock, Layers } from "lucide-react";
import { format } from "date-fns";
import { Day } from "@prisma/client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { ContentLayout } from "../../_components/content-layout";
import { GET_TEACHER } from "@/services/user.service";
import { db } from "@/lib/prisma";
import { CustomPagination } from "@/components/custom-pagination";

export const metadata: Metadata = {
    title: "BEC | Class | Proxy",
    description: "Basic Education Care",
};

type ClassData = {
    time: string;
    day: Day;
    batchName: string | null;
    subjectName: string;
    date: Date;
    roomName: number;
};

type GroupedData = {
    date: string;
    day: Day;
    classes: {
        time: string;
        batchName: string | null;
        subjectName: string;
        day: Day;
        roomName: number;
    }[];
};

interface Props {
    searchParams: {
        page: string;
        perPage: string;
    }
}

const ProxyClass = async ({ searchParams }: Props) => {

    const { page, perPage } = searchParams;
    const itemsPerPage = parseInt(perPage) || 5;
    const currentPage = parseInt(page) || 1;

    const { teacherId } = await GET_TEACHER()

    const [classes, totalClasses] = await Promise.all([
        await db.leaveClass.groupBy({
            by: ["time", "day", "batchName", "subjectName", "date", "roomName"],
            where: {
                teacherId,
                date: {
                    gte: new Date()
                }
            },
            orderBy: {
                time: "desc"
            },
            skip: (currentPage - 1) * itemsPerPage,
            take: itemsPerPage,
        }),
        await db.leaveClass.count({
            where: {
                teacherId,
                date: {
                    gte: new Date()
                }
            }
        })
    ])

    const groupedData: GroupedData[] = Object.values(
        classes.reduce((acc: { [key: string]: GroupedData }, curr: ClassData) => {
            const { time, batchName, subjectName, day, date, roomName } = curr;
            const dateString = date.toISOString();
            if (!acc[dateString]) {
                acc[dateString] = {
                    date: dateString,
                    classes: [],
                    day
                };
            }
            acc[dateString].classes.push({ day, batchName, subjectName, time, roomName });
            return acc;
        }, {})
    );

    const totalPage = Math.ceil(totalClasses / itemsPerPage)

    return (
        <ContentLayout title="Class">
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
                            <Link href="/dashboard/class">Class</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Proxy</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Proxy List</CardTitle>
                    <CardDescription>A collection of proxy class.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Table>
                        <TableBody>
                            {
                                groupedData.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="border">
                                            <p className="text-muted-foreground">
                                                {format(item.date, "dd MMM")}
                                            </p>
                                            <p>{item.day}</p>
                                        </TableCell>
                                        {
                                            item.classes.map((cls, i) => (
                                                <TableCell key={i} className="border">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-x-2">
                                                            <BookOpen className="w-5 h-5" />
                                                            <p className="text-lg font-semibold">{cls.subjectName}</p>
                                                        </div>
                                                        <div className="flex items-center gap-x-2">
                                                            <Layers className="w-5 h-5" />
                                                            <p className="text-md">{cls?.batchName}</p>
                                                        </div>
                                                        <div className="flex items-center gap-x-2">
                                                            <BuildingIcon className="w-5 h-5" />
                                                            <p className="text-md">{cls.roomName}</p>
                                                        </div>
                                                        <div className="flex items-center gap-x-2">
                                                            <Clock className="w-5 h-5" />
                                                            <p className="text-md">{cls.time}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            ))
                                        }
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                    <CustomPagination totalPage={totalPage} />
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default ProxyClass
