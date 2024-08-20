"use client"

import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { Loader } from "lucide-react"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useAddStudent } from "@/hooks/use-student"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"

import { ADD_STUDENT_TO_BATCH, GET_STUDENTS_FOR_BATCH } from "../action"

export const AddStudentModal = () => {
    const [studentId, setStudentId] = useState<number | undefined>()
    const [selectedStudents, setSelectedStudents] = useState<string[]>([])

    const { open, id, onClose, className } = useAddStudent()

    const { data: students, isPending } = useQuery({
        queryKey: ["get-sutdent-for-batch", studentId, className],
        queryFn: async () => {
            const res = await GET_STUDENTS_FOR_BATCH({ id: studentId, className })
            return res.students
        },
        enabled: open
    })

    const toggleCheck = (id: string) => {
        const findId = selectedStudents.find(item => item === id)
        if (findId) {
            setSelectedStudents(selectedStudents.filter(item => item !== id))
        } else {
            setSelectedStudents(prev => [...prev, id])
        }
    }


    const { mutate: addStudent, isPending: isLoading } = useMutation({
        mutationFn: ADD_STUDENT_TO_BATCH,
        onSuccess: (data) => {
            setStudentId(undefined)
            setSelectedStudents([])
            onClose()
            toast.success(data.success, {
                id: "add-student"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "add-student"
            });
        }
    })


    const handleAddStudent = () => {
        toast.loading("Student adding...", {
            id: "add-student"
        })
        addStudent({ batchId: id, ids: selectedStudents })
    }

    return (
        <Dialog open={open && !!id} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Student</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 p-2">
                    <Input
                        type="number"
                        placeholder="Search by id ..."
                        value={studentId}
                        onChange={(e) => setStudentId(parseInt(e.target.value))}
                        disabled={isPending || isLoading}
                    />
                    <ScrollArea className="h-[400px] px-2">
                        <div className="space-y-4">
                            {
                                isPending ? (
                                    <div className="w-full h-[200px] flex items-center justify-center">
                                        <Loader className="w-5 h-5 animate-spin" />
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {
                                            students?.map(student => (
                                                <div key={student.id} className="flex justify-between items-center border border-slate-200 p-2 rounded-sm hover:border-slate-500">
                                                    <div className="flex items-center gap-x-3">
                                                        <Badge>{student.studentId}</Badge>
                                                        <Avatar>
                                                            <AvatarImage src={student.imageUrl} />
                                                            <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                                        </Avatar>
                                                        <p>{student.name.length > 20 ? `${student.name.substring(0, 20)} ...` : student.name}</p>
                                                    </div>
                                                    <Checkbox onCheckedChange={() => toggleCheck(student.id)} />
                                                </div>
                                            ))
                                        }
                                    </div>
                                )
                            }
                            {
                                students?.length === 0 && (
                                    <p className="text-center text-muted-foreground italic">No Student Found!</p>
                                )
                            }
                        </div>
                    </ScrollArea>
                    <Button className="flex ml-auto" disabled={isPending || isLoading} onClick={handleAddStudent}>Submit</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}