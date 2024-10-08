"use client"

import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { Input } from "@/components/ui/input"

import { ADD_TEACHER_PAYMENT } from "../action"
import { useTeacherPayment } from "@/hooks/use-teacher-payment"
import { TeacherFeeSchema } from "../schema"


export const AddTeacherPaymentModal = () => {
    const { open, onClose, id } = useTeacherPayment()


    const { mutate: addPayment, isPending } = useMutation({
        mutationFn: ADD_TEACHER_PAYMENT,
        onSuccess: (data) => {
            form.reset()
            onClose()
            toast.success(data?.success, {
                id: "add-payment"
            })
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "add-payment"
            })
        }
    })

    const form = useForm<z.infer<typeof TeacherFeeSchema>>({
        resolver: zodResolver(TeacherFeeSchema),
        defaultValues: {
            perClass: undefined
        },
    })

    function onSubmit(values: z.infer<typeof TeacherFeeSchema>) {
        toast.loading("Fee adding...", {
            id: "add-payment"
        });
        addPayment({ teacherId: id, values })
    }

    return (
        <Dialog open={open && !!id} onOpenChange={!isPending ? onClose : () => { }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Payment</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="perClass"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Class Rate</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter class rate..." {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} type="number" disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isPending}>Submit</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}