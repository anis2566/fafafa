"use client"

import { toast } from "sonner"
import { Phone } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useMutation } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { Textarea } from "@/components/ui/textarea"

import { useAttendenceCall } from "@/hooks/use-attendence"
import { UPDATE_ABSENT_REASON } from "../action"

export enum AbsentReason {
    Tommorow = "Tommorow",
    SwitchOff = "SwitchOff",
    NoAnswer = "NoAnswer",
    Sick = "Sick",
    Custom = "Custom"
}
export const CallModal = () => {
    const [reason, setReason] = useState<AbsentReason>()
    const [value, setValue] = useState<string>("")

    const { open, id, student, onClose } = useAttendenceCall()

    const { mutate: updateAttendence, isPending } = useMutation({
        mutationFn: UPDATE_ABSENT_REASON,
        onSuccess: (data) => {
            onClose()
            toast.success(data?.success, {
                id: "absent"
            })
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "absent"
            })
        }
    })

    const handleUpdate = () => {
        toast.loading("Attendence updating...", {
            id: "absent"
        })
        updateAttendence({ id, reason: reason === AbsentReason.Custom ? value : (reason?.toString() || "") })
    }

    return (
        <Dialog open={open && !!id} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Absent Call</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    <Separator />
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-x-3">
                            <div className="w-8 h-8 rounded-full ring-4 ring-primary flex items-center justify-center">
                                <Phone className="w-5 h-5 text-primary" />
                            </div>
                            <p>{student?.mPhone}</p>
                        </div>
                        <Button asChild disabled={isPending}>
                            <Link href={`tel:${student?.mPhone}`}>Call Now</Link>
                        </Button>
                    </div>
                    <div className="space-y-2">
                        <Label>Absent reason</Label>
                        <Select value={reason} onValueChange={(value) => setReason(value as AbsentReason)} disabled={isPending}>
                            <SelectTrigger className="">
                                <SelectValue placeholder="Select reason" />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    Object.values(AbsentReason).map((v, i) => (
                                        <SelectItem value={v} key={i}>{v}</SelectItem>
                                    ))
                                }
                            </SelectContent>
                        </Select>
                    </div>
                    <Collapsible open={reason === AbsentReason.Custom}>
                        <CollapsibleContent className="space-y-2">
                            <Label>Explanation</Label>
                            <Textarea onChange={(e) => setValue(e.target.value)} disabled={isPending} />
                        </CollapsibleContent>
                    </Collapsible>
                    <Button disabled={!reason || reason === AbsentReason.Custom ? !value : false || isPending} onClick={handleUpdate}>Submit</Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}