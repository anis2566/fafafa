import { Batch, BatchClass, Subject, Teacher } from "@prisma/client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { ScrollArea } from "@/components/ui/scroll-area";

import { adjustTime } from "@/lib/utils";
import { ClassActions } from "./class-action";

interface ClassWithBatch extends BatchClass {
    batch: Batch;
    subject: Subject
}

interface TeacherWithClasses extends Teacher {
    classes: ClassWithBatch[]
}

interface ClassWithTeacherAndSubject extends BatchClass {
    teacher: TeacherWithClasses;
    subject: Subject;
}

interface Props {
    classes: ClassWithTeacherAndSubject[]
}

export const ClassList = ({ classes }: Props) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Day</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    classes.map(item => (
                        <TableRow key={item.id}>
                            <TableCell>{adjustTime(item.time[0])} - {item.time[item.time.length - 1]}</TableCell>
                            <TableCell>
                                {
                                    item.day.map((day, i) => (
                                        <p key={i}>{day}</p>
                                    ))
                                }
                            </TableCell>
                            <TableCell>{item.subject.name}</TableCell>
                            <TableCell>
                                <HoverCard>
                                    <HoverCardTrigger asChild>
                                        <Badge>
                                            {item.teacher.name}
                                        </Badge>
                                    </HoverCardTrigger>
                                    <HoverCardContent className="w-auto">
                                        <ScrollArea className="space-y-3 h-[300px] w-[400px]">
                                            <p className="text-center font-semibold text-lg mb-2">Class List</p>
                                            {
                                                item.teacher.classes.map(cls => (
                                                    <div className="grid grid-cols-4 gap-2 shadow-sm shadow-primary/40 mb-2" key={cls.id}>
                                                        <div>{cls.batch.name}</div>
                                                        <div>{adjustTime(cls.time[0])} - {cls.time[item.time.length - 1]}</div>
                                                        <div>
                                                            {
                                                                cls.day.map((v, i) => (
                                                                    <div key={i}>{v}</div>
                                                                ))
                                                            }
                                                        </div>
                                                        <div>{cls.subject.name}</div>
                                                    </div>
                                                ))
                                            }
                                        </ScrollArea>
                                    </HoverCardContent>
                                </HoverCard>
                            </TableCell>
                            <TableCell>
                                <ClassActions id={item.id} />
                            </TableCell>
                        </TableRow>
                    ))
                }
            </TableBody>
        </Table>
    )
}