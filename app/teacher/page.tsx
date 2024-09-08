import Link from "next/link";
import { Metadata } from "next";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { ContentLayout } from "./_components/content-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen } from "lucide-react";
import { db } from "@/lib/prisma";
import { GET_TEACHER } from "@/services/user.service";
import { Day, LeaveStatus } from "@prisma/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
    title: "BEC | Dashboard",
    description: "Basic Education Care",
};

const TeacherDashboard = async () => {
    const { teacherId } = await GET_TEACHER()
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const todayName = daysOfWeek[new Date().getDay()];

    const todayClass = await db.batchClass.count({
        where: {
            teacherId,
            day: todayName as Day
        }
    })

    const todayProxy = await db.leaveClass.count({
        where: {
            teacherId,
            day: todayName as Day
        }
    })

    const leaves = await db.leaveApp.findMany({
        where: {
            teacherId
        },
        orderBy: {
            createdAt: "desc"
        },
        take: 3,
    })

    return (
        <ContentLayout title="Dashboard">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="mt-4 grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-5">
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="flex flex-col max-h-[120px]">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-md font-medium">Class Today</CardTitle>
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                {todayClass}
                            </CardContent>
                        </Card>
                        <Card className="flex flex-col max-h-[120px]">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-md font-medium">Proxy Today</CardTitle>
                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                {todayProxy}
                            </CardContent>
                        </Card>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Leave</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>#SL</TableHead>
                                        <TableHead>Days</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        leaves?.map((leave, i) => (
                                            <TableRow key={leave.id}>
                                                <TableCell className="py-3">{i + 1}</TableCell>
                                                <TableCell className="py-3">{leave.days[0]} - {leave.days[leave.days.length - 1]}</TableCell>
                                                <TableCell className="py-3">
                                                    <Badge variant={leave.status === LeaveStatus.Approved ? "default" : leave.status === LeaveStatus.Rejected ? "destructive" : "outline"}>
                                                        {leave.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Notice Board</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="w-full h-[400px]">

                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </ContentLayout>
    )
}

export default TeacherDashboard
