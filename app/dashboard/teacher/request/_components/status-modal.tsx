"use client"

import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Status } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { useTeacherStatus } from "@/hooks/use-teacher"
import { UPDATE_TEACHER_STATUS } from "../action"

const formSchema = z.object({
    status: z
        .nativeEnum(Status)
        .refine((val) => Object.values(Status).includes(val), {
            message: "required",
        }),
})

export const UpdateTeacherStatusModal = () => {
    const { open, onClose, id } = useTeacherStatus()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            status: undefined
        },
    })

    const { mutate: updateStatus, isPending } = useMutation({
        mutationFn: UPDATE_TEACHER_STATUS,
        onSuccess: (data) => {
            onClose()
            form.reset()
            toast.success(data.success, {
                id: "update-stauts"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "update-stauts"
            });
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        toast.loading("Status updating...", {
            id: "update-stauts"
        })
        updateStatus({ status: values.status, id })
    }

    return (
        <Dialog open={open && !!id} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Teacher Stuats</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(Status).map((v) => (
                                                <SelectItem key={v} value={v}>
                                                    {v}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isPending}>Update</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>

    )
}