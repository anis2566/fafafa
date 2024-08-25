"use client"

import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useMutation } from "@tanstack/react-query"
import { Expense, Expenses, Month } from "@prisma/client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { ExpenseSchema } from "../../../create/schema"
import { UPDATE_EXPENSE } from "../action"
import { formatString } from "@/lib/utils"

interface Props {
    expense: Expense;
}

export const EditExpenseForm = ({ expense }: Props) => {

    const router = useRouter()

    const { mutate: updateExpense, isPending } = useMutation({
        mutationFn: UPDATE_EXPENSE,
        onSuccess: (data) => {
            form.reset()
            toast.success(data.success, {
                id: "update-expense"
            });
            router.push("/dashboard/expense")
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "update-expense"
            });
        }
    })

    const form = useForm<z.infer<typeof ExpenseSchema>>({
        resolver: zodResolver(ExpenseSchema),
        defaultValues: {
            type: expense.type || undefined,
            amount: expense.amount || undefined,
            month: expense.month || undefined,
            note: expense.note || ""
        },
    })

    function onSubmit(values: z.infer<typeof ExpenseSchema>) {
        if (!form.watch("note")) {
            toast.error("Please write down note")
        } else {
            toast.loading("Expense updating...", {
                id: "update-expense"
            });
            updateExpense({ id: expense.id, values })
        }
    }

    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>Edit Expense Form</CardTitle>
                <CardDescription>Customize expense information.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange} disabled={isPending}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                Object.values(Expenses).map((v, i) => (
                                                    <SelectItem value={v} key={i}>{formatString(v)}</SelectItem>
                                                ))
                                            }
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
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter amount..." {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} type="number" disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="month"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Month</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange} disabled={isPending}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select month" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                Object.values(Month).map((v, i) => (
                                                    <SelectItem value={v} key={i}>{v}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="note"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Note</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Describe edit reason.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isPending}>Update</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}