import { BookOpen, BuildingIcon, Layers } from "lucide-react";
import { Day } from "@prisma/client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type GroupedData = {
    time: string;
    classes: {
        batchName: string;
        subjectName: string;
        day: string;
        roomName: number;
    }[];
};


interface Props {
    classes: GroupedData[];
}

export const ClassList = ({ classes }: Props) => {

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
                                                        <p className="text-md">{isMatchDay?.batchName}</p>
                                                    </div>
                                                    <div className="flex items-center gap-x-2">
                                                        <BuildingIcon className="w-5 h-5" />
                                                        <p className="text-md">{isMatchDay.roomName}</p>
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