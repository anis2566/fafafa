"use client"

import { toast } from "sonner"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { useAttendenceLeft } from "@/hooks/use-attendence"
import { STUDENT_LEFT } from "../action"

export const StudentLeftModal = () => {
    const [value, setValue] = useState<string>("")

    const { open, id, onClose } = useAttendenceLeft()

    const { mutate: studentLeft, isPending } = useMutation({
        mutationFn: STUDENT_LEFT,
        onSuccess: (data) => {
            onClose()
            toast.success(data?.success, {
                id: "left"
            })
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "left"
            })
        }
    })

    const handleUpdate = () => {
        toast.loading("Applying changes...", {
            id: "left"
        })
        studentLeft({ id, leftReason: value })
    }

    return (
        <Dialog open={open && !!id} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Student Left</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label>Describe reason</Label>
                        <Textarea placeholder="Enter new number..." onChange={(e) => setValue(e.target.value)} disabled={isPending} />
                    </div>

                    <Button disabled={!value || isPending} onClick={handleUpdate}>Update</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}