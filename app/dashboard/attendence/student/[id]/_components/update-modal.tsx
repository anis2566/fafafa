"use client"

import { toast } from "sonner"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

import { useAttendenceUpdate } from "@/hooks/use-attendence"
import { UPDATE_STUDENT_NUMBER } from "../action"

export const UpdateNumberModal = () => {
    const [value, setValue] = useState<string>("")

    const { open, id, onClose } = useAttendenceUpdate()

    const { mutate: updateNumber, isPending } = useMutation({
        mutationFn: UPDATE_STUDENT_NUMBER,
        onSuccess: (data) => {
            onClose()
            toast.success(data?.success, {
                id: "number-update"
            })
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "number-update"
            })
        }
    })

    const handleUpdate = () => {
        if (value.length !== 11) {
            toast.error("Invalid number")
        } else {
            toast.loading("Number updating...", {
                id: "number-update"
            })
            updateNumber({ id, number: value })
        }
    }

    return (
        <Dialog open={open && !!id} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Number</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label>New Number</Label>
                        <Input placeholder="Enter new number..." onChange={(e) => setValue(e.target.value)} disabled={isPending} />
                    </div>

                    <Button disabled={!value || isPending} onClick={handleUpdate}>Update</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}