"use client"

import { Button } from "@/components/ui/button"
import { Class} from "@prisma/client"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { useTeacherSubject } from "@/hooks/use-teacher"
import { formatString } from "@/lib/utils"
import { ADD_TEACHER_SUBJECT, GET_SUBJECTS_FOR_TEACHER } from "../action"


export const AddTeacherSubjectModal = () => {
    const [className, setClassName] = useState<Class | null>(null)
    const [subjectId, setSubjectId] = useState<string>("")

    const { open, onClose, id } = useTeacherSubject()

    const { data: subjects } = useQuery({
        queryKey: ["get-subject-for-teacher", className],
        queryFn: async () => {
            if (className) {
                const res = await GET_SUBJECTS_FOR_TEACHER(className)
                return res.subjects
            }
        },
        enabled: open && !!id
    })

    const { mutate: addSubject, isPending } = useMutation({
        mutationFn: ADD_TEACHER_SUBJECT,
        onSuccess: (data) => {
            onClose()
            toast.success(data?.success, {
                id: "add-subject"
            })
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "add-subject"
            })
        }
    })

    const handleSubmit = () => {
        toast.loading("Subject adding...", {
            id: "add-subject"
        })
        addSubject({ teacherId: id, subjectId })
    }

    return (
        <Dialog open={open && !!id} onOpenChange={!isPending ? onClose : () => { }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Subject</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    <Select onValueChange={(value) => {
                        setClassName(value as Class)
                        setSubjectId("")
                    }} disabled={isPending}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Class" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                Object.values(Class).map((v, i) => (
                                    <SelectItem value={v} key={i}>{formatString(v)}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                    <Select onValueChange={(value) => setSubjectId(value)} disabled={isPending}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Subject" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                subjects?.map((subject, i) => (
                                    <SelectItem value={subject.id} key={i}>{subject.name}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>

                    <Button disabled={!subjectId || isPending} onClick={handleSubmit}>Submit</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}