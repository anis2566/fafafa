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

import { useClass } from "@/hooks/use-class"
import { REMOVE_CLASS_FROM_BATCH } from "../action"

export const RemoveClassModal = () => {

    const { open, id, onClose } = useClass()

    const { mutate: removeClass, isPending } = useMutation({
        mutationFn: REMOVE_CLASS_FROM_BATCH,
        onSuccess: (data) => {
            onClose()
            toast.success(data?.success, {
                id: "remove-class"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "remove-class"
            });
        }
    })

    const handleDelete = () => {
        toast.loading("Class removing...", {
            id: "remove-class"
        })
        removeClass(id)
    }

    return (
        <AlertDialog open={open && !!id}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will remove the class from this batch.
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