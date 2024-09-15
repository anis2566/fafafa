"use client"

import { BookOpen, BuildingIcon, Layers, Trash2 } from "lucide-react";
import { Day } from "@prisma/client";
import Link from "next/link";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button";

import { useClass } from "@/hooks/use-class";

type GroupedData = {
    time: string;
    batchId: string;
    classes: {
        batchName: string;
        subjectName: string;
        day: string;
        roomName: number;
        id: string;
    }[];
};


interface Props {
    classes: GroupedData[];
}

export const ClassList = ({ classes }: Props) => {
    const { onOpen } = useClass()

    return (
        <Table>
            <TableHeader>
                <TableHead className="border bg-sky-100/60">Time</TableHead>
                {
                    Object.values(Day).map((v, i) => (
                        <TableHead key={i} className="border bg-sky-100/60">{v}</TableHead>
                    ))
                }
            </TableHeader>
            <TableBody>
                {
                    classes.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell className="border">{item.time}</TableCell>
                            {
                                Object.values(Day).map((v, i) => {
                                    const isMatchDay = item.classes.find(item => item.day === v)
                                    return (
                                        <TableCell key={i} className="border text-center">
                                            {isMatchDay ? (
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-x-2">
                                                        <BookOpen className="w-5 h-5" />
                                                        <p className="text-lg font-semibold">{isMatchDay?.subjectName}</p>
                                                    </div>
                                                    <div className="flex items-center gap-x-2">
                                                        <Layers className="w-5 h-5" />
                                                        <Link href={`/dashboard/batch/${item.batchId}`} className="text-md hover:underline">
                                                            {isMatchDay.batchName}
                                                        </Link>
                                                    </div>
                                                    <div className="flex items-center gap-x-2">
                                                        <BuildingIcon className="w-5 h-5" />
                                                        <p className="text-md">{isMatchDay.roomName}</p>
                                                        <TooltipProvider>
                                                            <Tooltip delayDuration={0}>
                                                                <TooltipTrigger asChild>
                                                                    <Button className="ml-auto" variant="ghost" size="icon" onClick={() => onOpen(isMatchDay.id)}>
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