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

import { useRoom } from "@/hooks/use-room"
import { DELETE_ROOM } from "../action"


export const DeleteRoomModal = () => {
    const { open, id, onClose } = useRoom()

    const { mutate: deleteFee, isPending } = useMutation({
        mutationFn: DELETE_ROOM,
        onSuccess: (data) => {
            onClose()
            toast.success(data?.success, {
                id: "delete-room"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "delete-room"
            });
        }
    })

    const handleDelete = () => {
        toast.loading("Room deleting...", {
            id: "delete-room"
        })
        deleteFee(id)
    }

    return (
        <AlertDialog open={open && !!id}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your room
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