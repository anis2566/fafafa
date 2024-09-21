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

import { ContentLayout } from "../_components/content-layout";
import { db } from "@/lib/prisma";
import { GET_TEACHER } from "@/services/user.service";
import { ClassList } from "./_components/class-list";

export const metadata: Metadata = {
    title: "BEC | Class",
    description: "Basic Education Care",
};

type ClassData = {
    time: string;
    day: string;
    batchName: string;
    subjectName: string;
    roomName: number;
};

type GroupedData = {
    time: string;
    classes: {
        batchName: string;
        subjectName: string;
        day: string;
        roomName: number;
    }[];
};

const TeacherClass = async () => {
    const { teacherId } = await GET_TEACHER()

    const classes = await db.batchClass.groupBy({
        by: ["time", "day", "batchName", "subjectName", "roomName"],
        where: {
            teacherId
        },
        orderBy: {
            time: "desc"
        }
    })

    const groupedData: GroupedData[] = Object.values(
        classes.reduce((acc: { [key: string]: GroupedData }, curr: ClassData) => {
            const { time, batchName, subjectName, day, roomName } = curr;
            if (!acc[time]) {
                acc[time] = {
                    time: time,
                    classes: [],
                };
            }
            acc[time].classes.push({ day, batchName, subjectName, roomName });
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

            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Class List</CardTitle>
                    <CardDescription>A collection of teacher class.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ClassList classes={groupedData} plainClasses={classes} />
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default TeacherClass
