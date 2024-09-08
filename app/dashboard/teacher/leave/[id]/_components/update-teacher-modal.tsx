"use client"

import { toast } from "sonner"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

import { useLeaveClassUpdate } from "@/hooks/use-leave-class"
import { GET_TEACHERS_BY_DAY_TIME, UPDATE_LEAVE_CLASS_TEACHER } from "../action"


export const UpdateLeaveClassModal = () => {
    const [searchId, setSearchId] = useState<number>()
    const [teacher, setTeacher] = useState<string>("")

    const { open, onClose, day, time, id, teacherId } = useLeaveClassUpdate()

    const { data: teachers } = useQuery({
        queryKey: ["get-teacher-by-day-time", day, time, searchId],
        queryFn: async () => {
            if (day) {
                const res = await GET_TEACHERS_BY_DAY_TIME({ day, time, id: searchId })
                return res.teachers
            }
        },
        enabled: open
    })

    useEffect(() => {
        if (teachers) {
            setTeacher(teacherId)
        }
    }, [teacherId, teachers])

    const { mutate: updateClassTeacher, isPending } = useMutation({
        mutationFn: UPDATE_LEAVE_CLASS_TEACHER,
        onSuccess: (data) => {
            setTeacher("")
            setSearchId(undefined)
            onClose()
            toast.success(data.success, {
                id: "update-class"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "update-class"
            });
        }
    })

    const handleUpdate = () => {
        toast.loading("Teacher assigning...", {
            id: "update-class"
        })
        updateClassTeacher({ id, teacherId: teacher })
    }

    return (
        <Dialog open={open && !!id} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Class Teacher</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    <Select defaultValue={teacherId} value={teacher} onValueChange={(value) => setTeacher(value)} disabled={isPending}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select teacher" />
                        </SelectTrigger>
                        <SelectContent className="p-2">
                            <Input placeholder="Search by id..." type="number" onChange={(e) => setSearchId(parseInt(e.target.value))} className="my-2" />
                            {
                                teachers?.map(teacher => (
                                    <SelectItem value={teacher.id} key={teacher.id}>{teacher.name}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>

                    <Button disabled={!teacher || isPending} onClick={handleUpdate}>Submit</Button>
                </div>
            </DialogContent>
        </Dialog>

    )
}