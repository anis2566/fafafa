"use client"

import { Attendence, AttendenceStatus } from "@prisma/client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MessageCircleQuestion, Phone } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { useMutation } from "@tanstack/react-query"
import { UPDATE_ATTENDENCES } from "../action"
import { toast } from "sonner"

interface StudentWithAttendense {
    id: string;
    name: string;
    studentId: number;
    imageUrl: string;
    mPhone: string;
    attendences: Attendence[]
    payments: { id: string }[]
}

interface Props {
    students: StudentWithAttendense[]
    batchId: string;
}

export const AttendenceList = ({ students, batchId }: Props) => {
    const [ids, setIds] = useState<string[]>([]);
    const [allChecked, setAllChecked] = useState(false); // Add state for allChecked

    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const toggleIds = (id: string, isChecked: boolean) => {
        setIds(prevIds => {
            if (isChecked) {
                return [...prevIds, id];
            } else {
                return prevIds.filter(existingId => existingId !== id);
            }
        });
    };

    useEffect(() => {
        setIds(
            students
                .filter(student => student.attendences.some(i => i.status === AttendenceStatus.P))
                .map(student => student.id)
        );
    }, []);

    // New function to mark attendance for all students
    const markAllAttendance = (status: AttendenceStatus) => {
        const allIds = students.map(student => student.id);
        if (status === AttendenceStatus.P) {
            setIds(allIds);
        } else {
            setIds([]);
        }
    };

    const { mutate: updateAttendence } = useMutation({
        mutationFn: UPDATE_ATTENDENCES,
        onSuccess: (data) => {
            toast.success(data?.success)
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    const submitAttendance = () => {
        updateAttendence({ ids, batchId })
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-x-3">
                <Button onClick={() => markAllAttendance(AttendenceStatus.P)} variant={allChecked ? "outline" : "ghost"}>Mark All Present</Button>
                <Button onClick={() => markAllAttendance(AttendenceStatus.A)} variant={!allChecked ? "outline" : "ghost"}>Mark All Absent</Button>
                <Button onClick={submitAttendance} variant="default" disabled={ids.length === 0}>Submit Attendance</Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Due</TableHead>
                        <TableHead className="bg-slate-200 text-accent-foreground text-center">Today</TableHead>
                        {
                            Array.from({ length: daysInMonth }).map((_, i) => (
                                i + 1 !== currentDay && (
                                    <TableHead key={i} className="text-center">{i + 1}</TableHead>
                                )
                            ))
                        }
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        students.map(item => (
                            <TableRow key={item.id}>
                                <TableCell>{item.studentId}</TableCell>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>
                                    <Avatar>
                                        <AvatarImage src={item.imageUrl} />
                                        <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </TableCell>
                                <TableCell>{item.payments.length}</TableCell>
                                <TableCell className="bg-slate-200 text-accent-foreground">
                                    {
                                        item.attendences.find(it => it.day === currentDay) && (
                                            <Checkbox
                                                className="ml-4"
                                                checked={ids.includes(item.id)}
                                                onCheckedChange={(isChecked: boolean) => toggleIds(item.id, isChecked)}
                                            />
                                        )
                                    }
                                </TableCell>
                                {
                                    Array.from({ length: daysInMonth }).map((_, i) => {
                                        if (i + 1 === currentDay) return null;
                                        const day = item.attendences.find(it => it.day === i + 1);
                                        return (
                                            <TableCell key={i} className="text-center">
                                                <div className="flex items-center">
                                                    {
                                                        day?.status === AttendenceStatus.NA && "-"
                                                    }
                                                    {
                                                        day?.status !== AttendenceStatus.NA && (
                                                            <p className={cn("text-md font-semibold", day?.status === AttendenceStatus.A ? "text-rose-500" : "text-green-500")}>{day?.status}</p>
                                                        )
                                                    }
                                                    {
                                                        day?.status === AttendenceStatus.A && day?.absentReason ? (

                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                                        <span className="sr-only">Open menu</span>
                                                                        <MessageCircleQuestion className="h-5 w-5" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    fafaflal
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        ) : day?.status === AttendenceStatus.A && !day?.absentReason ? (
                                                            <Button variant="ghost" size="icon">
                                                                    <Phone className="w-4 h-4" />
                                                            </Button>
                                                        ) : null
                                                    }
                                                </div>
                                            </TableCell>
                                        )
                                    })
                                }
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}