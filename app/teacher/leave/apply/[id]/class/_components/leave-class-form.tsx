"use client"

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Day } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import { UPDATE_LEAVE_APP } from "../action";
import { GET_CLASS_BY_DAYS } from "../../../action";

interface Props {
    id: string;
    days: Day[]
}

export const LeaveClassForm = ({ id, days }: Props) => {
    const [ids, setIds] = useState<string[]>([])

    const router = useRouter()

    const { data: classes } = useQuery({
        queryKey: ["get-class-by-day", days],
        queryFn: async () => {
            const res = await GET_CLASS_BY_DAYS(days)
            return res.classes
        }
    })

    const toggleClasses = (id: string) => {
        const isExists = ids.find(item => item === id)
        if (isExists) {
            const updatedClasses = ids.filter(item => item !== id);
            setIds(updatedClasses)
        } else {
            setIds([...ids, id])
        }
    }

    const { mutate: applyLeave, isPending } = useMutation({
        mutationFn: UPDATE_LEAVE_APP,
        onSuccess: (data) => {
            toast.success(data.success, {
                id: "update-app"
            });
            router.push(`/teacher/leave/history`)
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "update-app"
            });
        }
    })

    const handleSubmit = () => {
        toast.loading("Class adding...", {
            id: "update-app"
        })
        applyLeave({ id, classIds: ids })
    }

    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>Class List</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Day</TableHead>
                            <TableHead>Time</TableHead>
                            <TableHead>Batch</TableHead>
                            <TableHead>Subject</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            classes?.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.day}</TableCell>
                                    <TableCell>{item.time}</TableCell>
                                    <TableCell>{item.batchName}</TableCell>
                                    <TableCell>{item.subjectName}</TableCell>
                                    <TableCell>
                                        <Checkbox disabled={isPending} onCheckedChange={() => toggleClasses(item.id)} />
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
                <Button disabled={ids.length < 1 || isPending} onClick={handleSubmit}>Submit</Button>
            </CardContent>
        </Card>
    )
}