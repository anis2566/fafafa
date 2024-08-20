"use client"

import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { useRemoveStudent } from "@/hooks/use-student"
import { REMOVE_STUDENT_FROM_BATCH } from "../action"

export const RemoveStudentModal = () => {

    const { open, id, onClose } = useRemoveStudent()

    const { mutate: removeStudent, isPending } = useMutation({
        mutationFn: REMOVE_STUDENT_FROM_BATCH,
        onSuccess: (data) => {
            onClose()
            toast.success(data?.success, {
                id: "remove-student"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "remove-student"
            });
        }
    })

    const handleDelete = () => {
        toast.loading("Student removing...", {
            id: "remove-student"
        })
        removeStudent(id)
    }

    return (
        <AlertDialog open={open && !!id}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will remove the student from this batch.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose} disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isPending}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}