import Link from "next/link";
import { Metadata } from "next";
import { Day } from "@prisma/client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { ContentLayout } from "../_components/content-layout";
import { db } from "@/lib/prisma";
import { GET_TEACHER } from "@/services/user.service";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
    title: "BEC | Class",
    description: "Basic Education Care",
};

type ClassData = {
    time: string;
    day: string;
    batchName: string;
    subjectName: string;
};

type GroupedData = {
    time: string;
    classes: {
        batchName: string;
        subjectName: string;
        day: string;
    }[];
};

const TeacherClass = async () => {
    const { teacherId } = await GET_TEACHER()

    const classes = await db.batchClass.groupBy({
        by: ["time", "day", "batchName", "subjectName"],
        where: {
            teacherId
        },
        orderBy: {
            time: "desc"
        }
    })

    const groupedData: GroupedData[] = Object.values(
        classes.reduce((acc: { [key: string]: GroupedData }, curr: ClassData) => {
            const { time, batchName, subjectName, day } = curr;
            if (!acc[time]) {
                acc[time] = {
                    time: time,
                    classes: [],
                };
            }
            acc[time].classes.push({ day, batchName, subjectName });
            return acc;
        }, {})
    );


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
                        <BreadcrumbPage>Class</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card>
                <CardHeader>
                    <CardTitle>Class List</CardTitle>
                    <CardDescription>A collection of teacher class.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Table>
                        <TableHeader>
                            <TableHead>Time</TableHead>
                            {
                                Object.values(Day).map((v, i) => (
                                    <TableHead key={i}>{v}</TableHead>
                                ))
                            }
                        </TableHeader>
                        <TableBody>
                            {
                                groupedData.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.time}</TableCell>
                                        {
                                            Object.values(Day).map((v, i) => {
                                                const isMatchDay = item.classes.find(item => item.day === v)
                                                return (
                                                    <TableCell key={i} className={cn("bg-indigo-100/50", index % 2 === 0 ? "odd:bg-sky-100/50" : "even:bg-sky-100/50")}>
                                                        {isMatchDay ? (
                                                            <div>
                                                                <p className="text-lg font-semibold">{isMatchDay?.subjectName}</p>
                                                                <p>{isMatchDay?.batchName}</p>
                                                            </div>
                                                        ) : "-"}
                                                    </TableCell>
                                                )
                                            })
                                        }
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default TeacherClass
