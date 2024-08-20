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

import { DELETE_SUBJECT } from "../action"
import { useDeleteSubject } from "@/hooks/use-subject"

export const DeleteSubjectModal = () => {
    const { open, id, onClose } = useDeleteSubject()

    const { mutate: deleteSubject, isPending } = useMutation({
        mutationFn: DELETE_SUBJECT,
        onSuccess: (data) => {
            onClose()
            toast.success(data?.success, {
                id: "delete-subject"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "delete-subject"
            });
        }
    })

    const handleDelete = () => {
        toast.loading("Fee deleting...", {
            id: "delete-subject"
        })
        deleteSubject(id)
    }

    return (
        <AlertDialog open={open && !!id}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this subject
                        and remove the data from your servers.
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