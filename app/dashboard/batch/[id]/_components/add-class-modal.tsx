"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { z } from "zod"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { useAddClass } from "@/hooks/use-class"
import { useDebounce } from "@/hooks/use-debounce"
import { ADD_BATCH_CLASS, GET_SUBJECT_BY_BATCH, GET_TEACHERS_BY_BATCH } from "../action"

const formSchema = z.object({
    teacherId: z.string().min(1, { message: "required" }),
    subjectId: z.string().min(1, { message: "required" }),
});

export const AddClassModal = () => {
    const [search, setSearch] = useState<number>()

    const { open, batchId, day, onClose, time } = useAddClass()
    const searchId = useDebounce(search, 500)

    const { data: subjects } = useQuery({
        queryKey: ["get-subjects-batch", batchId],
        queryFn: async () => {
            const res = await GET_SUBJECT_BY_BATCH(batchId)
            return res.subjects
        },
        enabled: open
    })

    const { data: teachers } = useQuery({
        queryKey: ["get-teacher-by-batch", batchId, searchId],
        queryFn: async () => {
            const res = await GET_TEACHERS_BY_BATCH({ id: batchId, searchId })
            return res.teachers
        },
        enabled: open
    })

    const { mutate: addClass, isPending } = useMutation({
        mutationFn: ADD_BATCH_CLASS,
        onSuccess: (data) => {
            onClose()
            form.reset()
            toast.success(data.success, {
                id: "add-class"
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "add-class"
            });
        }
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            subjectId: "",
            teacherId: ""
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        toast.loading("Class adding...", {
            id: "add-class"
        });
        addClass({ batchId, day, time, ...values })
    }

    return (
        <Dialog open={open && !!batchId} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Class</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="subjectId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Subject</FormLabel>
                                    <Select value={field.value} onValueChange={(value) => field.onChange(value)} disabled={isPending}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select subject" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                subjects?.map((subject, i) => (
                                                    <SelectItem value={subject.id} key={i}>{subject.name}</SelectItem>
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
                            name="teacherId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Teacher</FormLabel>
                                    <Select onValueChange={(value) => {
                                        field.onChange(value)
                                        setSearch(undefined)
                                    }} disabled={isPending}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select teacher" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <Input placeholder="Search by id..." type="number" onChange={(e) => setSearch(parseInt(e.target.value))} className="my-2" />
                                            {
                                                teachers?.map((v, i) => (
                                                    <SelectItem value={v.id} key={i}>{v.name}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
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