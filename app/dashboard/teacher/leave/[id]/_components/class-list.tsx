"use client"

import { Day, LeaveClass } from "@prisma/client"
import { Edit, PlusCircle } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { useLeaveClass, useLeaveClassUpdate } from "@/hooks/use-leave-class";

interface Props {
    classes: LeaveClass[]
}

type ClassData = {
    id: string; // Add id here
    time: string;
    day: Day;
    batchName: string;
    subjectName: string;
    teacherName: string | null;
    teacherId: string | null;
};

type GroupedData = {
    time: string;
    classes: {
        id: string; // Add id here
        batchName: string;
        subjectName: string;
        day: Day;
        teacherName: string | null;
        time: string;
        teacherId: string | null;
    }[];
};

export const ClassList = ({ classes }: Props) => {
    const { onOpen } = useLeaveClass()
    const { onOpen: onOpenUpdate } = useLeaveClassUpdate()

    const groupedData: GroupedData[] = Object.values(
        classes.reduce((acc: { [key: string]: GroupedData }, curr: ClassData) => {
            const { id, time, batchName, subjectName, day, teacherName, teacherId } = curr; // Destructure id
            if (!acc[time]) {
                acc[time] = {
                    time: time,
                    classes: [],
                };
            }
            acc[time].classes.push({ id, day, batchName, subjectName, teacherName, time, teacherId }); // Include id
            return acc;
        }, {})
    );

    return (
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
                                        <TableCell key={i}>
                                            {isMatchDay ? (
                                                <div>
                                                    <p className="text-lg font-semibold">{isMatchDay?.subjectName}</p>
                                                    <p>{isMatchDay?.batchName}</p>
                                                    <div className="flex items-center gap-x-1">
                                                        <Badge variant={isMatchDay.teacherName ? "default" : "destructive"}>{isMatchDay.teacherName ? isMatchDay.teacherName : "No teacher"}</Badge>
                                                        {
                                                            isMatchDay.teacherName ? (
                                                                <Button variant="ghost" size="icon" onClick={() => onOpenUpdate(isMatchDay.id, isMatchDay.day, isMatchDay.time, isMatchDay.teacherId!)}>
                                                                    <Edit className="w-5 h-5" />
                                                                </Button>
                                                            ) : (
                                                                <Button variant="ghost" size="icon" onClick={() => onOpen(isMatchDay.id, isMatchDay.day, isMatchDay.time)}>
                                                                    <PlusCircle className="w-5 h-5" />
                                                                </Button>
                                                            )
                                                        }
                                                    </div>
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
    )
}