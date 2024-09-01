"use client"

import { Attendence, AttendenceStatus } from "@prisma/client"
import { Edit, EllipsisVertical, LogOut, MessageCircleQuestion, Phone } from "lucide-react"
import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { useMutation } from "@tanstack/react-query"

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
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

import { cn } from "@/lib/utils"
import { UPDATE_ATTENDENCES } from "../action"
import { useAttendenceCall, useAttendenceLeft, useAttendenceUpdate } from "@/hooks/use-attendence"

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
    const [allChecked, setAllChecked] = useState(false);
    const [isHoliday, setIsHoliday] = useState<boolean>(false)

    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const [editDay, setEditDay] = useState<number>(currentDay)

    const { onOpen } = useAttendenceCall()
    const { onOpen: onOpenUpdate } = useAttendenceUpdate()
    const {onOpen: onOpenLeft} = useAttendenceLeft()

    const handleEdit = (day: number) => {
        // if (day > currentDay) {
        //     toast.error("Cannot edit future dates");
        //     return;
        // }
        setIds([]);
        setEditDay(prevDay => (prevDay === day ? currentDay : day));
    }

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
                .filter(student => student.attendences.some(i => i.day === editDay && i.status === AttendenceStatus.P))
                .map(student => student.id)
        );
    }, [editDay, students]);

    const markAsHoliday = () => {
        const allIds = students.map(student => student.id);
        setIsHoliday(true)
        setIds(allIds)
    }

    const markAllAttendance = (status: AttendenceStatus) => {
        const allIds = students.map(student => student.id);
        if (status === AttendenceStatus.P) {
            setIds(allIds);
            setIsHoliday(false)
            setAllChecked(true)
        } else {
            setIsHoliday(false)
            setAllChecked(false)
            setIds([]);
        }
    };

    const { mutate: updateAttendence, isPending } = useMutation({
        mutationFn: UPDATE_ATTENDENCES,
        onSuccess: (data) => {
            setEditDay(currentDay)
            toast.success(data?.success, {
                id: "update-attendence"
            })
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "update-attendence"
            })
        }
    })

    const submitAttendance = () => {
        toast.loading("Attendance updating...", {
            id: "update-attendence"
        })
        updateAttendence({ ids, batchId, day: editDay, isHoliday })
    };

    const isFriday = (date: Date) => date.getDay() === 5;


    return (
        <div className="space-y-4">
            <div className="flex items-center gap-x-3">
                <Button onClick={() => markAllAttendance(AttendenceStatus.P)} variant={ids.length === students.length && !isHoliday ? "outline" : "ghost"} disabled={isPending}>Mark All Present</Button>
                <Button onClick={() => markAllAttendance(AttendenceStatus.A)} variant={!allChecked ? "outline" : "ghost"} disabled={isPending}>Mark All Absent</Button>
                <Button onClick={markAsHoliday} variant={isHoliday ? "outline" : "ghost"} disabled={isPending}>Mark as Holiday</Button>
                <Button onClick={submitAttendance} variant="default" disabled={isPending}>Submit Attendance</Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Due</TableHead>
                        <TableHead className={cn("bg-slate-200 text-accent-foreground text-center", editDay !== currentDay && "hidden")}>Today</TableHead>
                        {
                            Array.from({ length: daysInMonth }).map((_, i) => {
                                const date = new Date(currentYear, currentMonth, i + 1);
                                const isDayFriday = isFriday(date);
                                const holiday = students.some(student =>
                                    student.attendences.some(att => att.day === i + 1 && att.status === AttendenceStatus.H)
                                );
                                return (
                                    <TableHead key={i} className={cn("text-center", isDayFriday && "bg-rose-300 text-white", holiday && "bg-rose-300 text-white")}>
                                        {i + 1}
                                    </TableHead>
                                )
                            })
                        }
                        <TableHead>Action</TableHead>
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
                                <TableCell className={cn("bg-slate-200 text-accent-foreground", editDay !== currentDay && "hidden")}>
                                    {
                                        item.attendences.find(it => it.day === currentDay) && (
                                            <Checkbox
                                                className="ml-4"
                                                checked={ids.includes(item.id)}
                                                onCheckedChange={(isChecked: boolean) => toggleIds(item.id, isChecked)}
                                                disabled={isPending || isFriday(new Date(currentYear, currentMonth, currentDay))}
                                            />
                                        )
                                    }
                                </TableCell>
                                {
                                    Array.from({ length: daysInMonth }).map((_, i) => {
                                        const day = item.attendences.find((it: Attendence) => it.day === i + 1);
                                        const date = new Date(currentYear, currentMonth, i + 1);
                                        const isDayFriday = isFriday(date);
                                        const holiday = students.some(student =>
                                            student.attendences.some(att => att.day === i + 1 && att.status === AttendenceStatus.H)
                                        );

                                        if (day?.day === editDay && editDay !== currentDay) {
                                            return (
                                                <TableCell className={cn("bg-slate-200 text-accent-foreground text-center", isDayFriday && "bg-rose-300 text-white")}>
                                                    <Checkbox
                                                        className="-ml-4"
                                                        checked={ids.includes(item.id)}
                                                        onCheckedChange={(isChecked: boolean) => toggleIds(item.id, isChecked)}
                                                        disabled={isPending}
                                                    />
                                                </TableCell>
                                            )
                                        }
                                        return (
                                            <TableCell key={i} className={cn("text-center", isDayFriday && "bg-rose-300 text-white", day?.status === AttendenceStatus.H && "bg-rose-300 text-white")}>
                                                <div className="flex items-center justify-center">
                                                    {
                                                        day?.status === AttendenceStatus.NA && "-"
                                                    }
                                                    {
                                                        day?.status !== AttendenceStatus.NA && (
                                                            <p className={cn("text-md font-semibold", day?.status === AttendenceStatus.A ? "text-rose-500" : "text-green-500", holiday && "text-white")}>{day?.status}</p>
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
                                                                <DropdownMenuContent align="end" className="p-2">
                                                                    <p>{day?.absentReason}</p>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        ) : day?.status === AttendenceStatus.A && !day?.absentReason ? (
                                                            <Button variant="ghost" size="icon" onClick={() => onOpen(day.id, item)}>
                                                                <Phone className="w-4 h-4" />
                                                            </Button>
                                                        ) : null
                                                    }
                                                </div>
                                            </TableCell>
                                        )
                                    })
                                }
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <EllipsisVertical className="h-5 w-5" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem className="flex items-center gap-x-3" onClick={() => onOpenUpdate(item.id)}>
                                                <Phone className="w-5 h-5" />
                                                Update Number
                                            </DropdownMenuItem>
                                            <DropdownMenuItem className="flex items-center gap-x-3" onClick={() => onOpenLeft(item.id)}>
                                                <LogOut className="w-5 h-5" />
                                                Left
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell className={cn("", editDay !== currentDay && "hidden")}></TableCell>
                        {
                            Array.from({ length: daysInMonth }).map((_, i) => {
                                const date = new Date(currentYear, currentMonth, i + 1);
                                const isDayFriday = isFriday(date);
                                const holiday = students.some(student =>
                                    student.attendences.some(att => att.day === i + 1 && att.status === AttendenceStatus.H)
                                );
                                return (
                                    <TableHead key={i} className="text-center">
                                        <Button variant={editDay !== currentDay && editDay === i + 1 ? "default" : "ghost"} size="icon" onClick={() => handleEdit(i + 1)} disabled={isDayFriday || currentDay === i + 1 || holiday || isPending}>
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                    </TableHead>
                                )
                            })
                        }
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    )
}