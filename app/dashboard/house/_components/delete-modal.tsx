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

import { useHouse } from "@/hooks/use-house"
import { DELETE_HOUSE } from "../action"


export const DeleteHouseModal = () => {
    const { open, id, onClose } = useHouse()

    const { mutate: deleteHouse, isPending } = useMutation({
        mutationFn: DELETE_HOUSE,
        onSuccess: (data) => {
            onClose()
            toast.success(data?.success, {
                id: "delete-house"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "delete-house"
            });
        }
    })

    const handleDelete = () => {
        toast.loading("House deleting...", {
            id: "delete-house"
        })
        deleteHouse(id)
    }

    return (
        <AlertDialog open={open && !!id}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your house
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