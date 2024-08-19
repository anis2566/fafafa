"use client"

import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import { Class as PrismaClass } from "@prisma/client"
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
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { useAdmissionFee } from "@/hooks/use-admission-fee"
import { AdmissionFeeSchema } from "../schema"
import { formatString } from "@/lib/utils"
import { CREATE_FEE } from "../action"


export const AssignFeeModal = () => {
    const { open, onClose } = useAdmissionFee()


    const form = useForm<z.infer<typeof AdmissionFeeSchema>>({
        resolver: zodResolver(AdmissionFeeSchema),
        defaultValues: {
            class: undefined,
            amount: undefined
        },
    })

    const { mutate: assignFee, isPending } = useMutation({
        mutationFn: CREATE_FEE,
        onSuccess: (data) => {
            onClose()
            form.reset()
            toast.success(data.success, {
                id: "assign-fee"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "assign-fee"
            });
        }
    })

    function onSubmit(values: z.infer<typeof AdmissionFeeSchema>) {
        toast.loading("Fee assigning...", {
            id: "assign-fee"
        })
        assignFee(values)
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Assign New Fee</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="class"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Class</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(PrismaClass).map((v) => (
                                                <SelectItem key={v} value={v}>
                                                    {formatString(v)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amoont</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter coupon title" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} type="number" disabled={isPending} />
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