"use client"

import { Day, LeaveClass } from "@prisma/client"
import { BookOpen, BuildingIcon, Edit, Layers, PlusCircle } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { useLeaveClass, useLeaveClassUpdate } from "@/hooks/use-leave-class";

interface Props {
    classes: LeaveClass[]
}

type ClassData = {
    id: string;
    time: string;
    day: Day;
    batchName: string | null;
    subjectName: string;
    teacherName: string | null;
    teacherId: string | null;
    date: Date;
    roomName: number;
};

type GroupedData = {
    time: string;
    classes: {
        id: string;
        batchName: string | null;
        subjectName: string;
        day: Day;
        teacherName: string | null;
        time: string;
        teacherId: string | null;
        date: Date;
        roomName: number;
    }[];
};

export const ClassList = ({ classes }: Props) => {
    const { onOpen } = useLeaveClass()
    const { onOpen: onOpenUpdate } = useLeaveClassUpdate()

    const groupedData: GroupedData[] = Object.values(
        classes.reduce((acc: { [key: string]: GroupedData }, curr: ClassData) => {
            const { id, time, batchName, subjectName, day, teacherName, teacherId, date, roomName } = curr;
            if (!acc[time]) {
                acc[time] = {
                    time: time,
                    classes: [],
                };
            }
            acc[time].classes.push({ id, day, batchName, subjectName, teacherName, time, teacherId, date, roomName});
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
                            <TableCell className="border">{item.time}</TableCell>
                            {
                                Object.values(Day).map((v, i) => {
                                    const isMatchDay = item.classes.find(item => item.day === v)
                                    return (
                                        <TableCell key={i} className="border">
                                            {isMatchDay ? (
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-x-2">
                                                        <BookOpen className="w-5 h-5" />
                                                        <p className="text-lg font-semibold">{isMatchDay?.subjectName}</p>
                                                    </div>
                                                    <div className="flex items-center gap-x-2">
                                                        <Layers className="w-5 h-5" />
                                                        <p className="text-md">{isMatchDay?.batchName}</p>
                                                    </div>
                                                    <div className="flex items-center gap-x-2">
                                                        <BuildingIcon className="w-5 h-5" />
                                                        <p className="text-md">{isMatchDay.roomName}</p>
                                                    </div>
                                                    <div className="flex items-center gap-x-1">
                                                        <Badge variant={isMatchDay.teacherName ? "default" : "destructive"}>{isMatchDay.teacherName ? isMatchDay.teacherName : "No teacher"}</Badge>
                                                        {
                                                            isMatchDay.teacherName ? (
                                                                <Button variant="ghost" size="icon" onClick={() => onOpenUpdate(isMatchDay.id, isMatchDay.day, isMatchDay.time, isMatchDay.teacherId!, isMatchDay.date)}>
                                                                    <Edit className="w-5 h-5" />
                                                                </Button>
                                                            ) : (
                                                                <Button variant="ghost" size="icon" onClick={() => onOpen(isMatchDay.id, isMatchDay.day, isMatchDay.time, isMatchDay.date)}>
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