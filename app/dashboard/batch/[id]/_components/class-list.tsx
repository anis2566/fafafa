"use client"

import { BookOpen, BuildingIcon, PlusCircle, Trash2, UserPen } from "lucide-react";
import Link from "next/link";
import { Day } from "@prisma/client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button";

import { useAddClass, useClass } from "@/hooks/use-class";


type GroupedData = {
    day: Day;
    classes: {
        time: string;
        teacherName: string;
        subjectName: string;
        roomName: number;
        id: string;
        teacherId: string;
    }[];
};


interface Props {
    classes: GroupedData[];
    classTime: string[]
    batchId: string;
}

export const ClassList = ({ classes, classTime, batchId }: Props) => {
    const { onOpen } = useClass()
    const { onOpen: onOpenAddClass } = useAddClass()

    return (
        <Table>
            <TableHeader>
                <TableHead className="border bg-sky-100/60">Day</TableHead>
                {
                    classTime.map((time: string, i) => (
                        <TableHead key={i} className="border bg-sky-100/60">{time}</TableHead>
                    ))
                }
            </TableHeader>
            <TableBody>
                {
                    classes.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell className="border bg-sky-100/40">{item.day}</TableCell>
                            {
                                classTime.map((v, i) => {
                                    const isMatchedTime = item.classes.find(item => item.time === v)
                                    return (
                                        <TableCell key={i} className="border text-center">
                                            {isMatchedTime ? (
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-x-2">
                                                        <BookOpen className="w-5 h-5" />
                                                        <p className="text-lg font-semibold">{isMatchedTime?.subjectName}</p>
                                                    </div>
                                                    <div className="flex items-center gap-x-2">
                                                        <UserPen className="w-5 h-5" />
                                                        <Link href={`/dashboard/teacher/${isMatchedTime.teacherId}`} className="text-md hover:underline">
                                                            {isMatchedTime?.teacherName}
                                                        </Link>
                                                    </div>
                                                    <div className="flex items-center gap-x-2">
                                                        <BuildingIcon className="w-5 h-5" />
                                                        <p className="text-md">{isMatchedTime.roomName}</p>
                                                        <TooltipProvider>
                                                            <Tooltip delayDuration={0}>
                                                                <TooltipTrigger asChild>
                                                                    <Button className="ml-auto" variant="ghost" size="icon" onClick={() => onOpen(isMatchedTime.id)}>
                                                                        <Trash2 className="w-5 h-5 text-rose-600" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>
                                                                    <p>Delete class</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </div>
                                                </div>
                                            ) : (
                                                <TooltipProvider>
                                                    <Tooltip delayDuration={0}>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="ghost" size="icon" onClick={() => onOpenAddClass(batchId, v, item.day)}>
                                                                <PlusCircle className="text-green-600" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Add class</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
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