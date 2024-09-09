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

import { useNotice } from "@/hooks/use-notice"
import { DELETE_NOTICE } from "../action"


export const DeleteNoticeModal = () => {
    const { open, id, onClose } = useNotice()

    const { mutate: deleteNotice, isPending } = useMutation({
        mutationFn: DELETE_NOTICE,
        onSuccess: (data) => {
            onClose()
            toast.success(data?.success, {
                id: "delete-notice"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "delete-notice"
            });
        }
    })

    const handleDelete = () => {
        toast.loading("Notice deleting...", {
            id: "delete-notice"
        })
        deleteNotice(id)
    }

    return (
        <AlertDialog open={open && !!id}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this notice
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