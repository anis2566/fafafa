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

import { useTeacherRequestDelete } from "@/hooks/use-teacher"
import { DELETE_REQUEST } from "../action"


export const DeleteTeacherRequestModal = () => {
    const { open, id, onClose } = useTeacherRequestDelete()

    const { mutate: deleteApp, isPending } = useMutation({
        mutationFn: DELETE_REQUEST,
        onSuccess: (data) => {
            onClose()
            toast.success(data?.success, {
                id: "delete-app"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "delete-app"
            });
        }
    })

    const handleDelete = () => {
        toast.loading("Application deleting...", {
            id: "delete-app"
        })
        deleteApp(id)
    }

    return (
        <AlertDialog open={open && !!id}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this application
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