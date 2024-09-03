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

import { useBatch } from "@/hooks/use-batch"
import { DELETE_BATCH } from "../action"


export const DeleteBatchModal = () => {
    const { open, id, onClose } = useBatch()

    const { mutate: deleteBatch, isPending } = useMutation({
        mutationFn: DELETE_BATCH,
        onSuccess: (data) => {
            onClose()
            toast.success(data?.success, {
                id: "delete-batch"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "delete-batch"
            });
        }
    })

    const handleDelete = () => {
        toast.loading("Batch deleting...", {
            id: "delete-batch"
        })
        deleteBatch(id)
    }

    return (
        <AlertDialog open={open && !!id}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your batch
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