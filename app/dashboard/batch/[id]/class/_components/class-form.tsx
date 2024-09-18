"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { BatchClassSchema } from "../schema"
import { Button } from "@/components/ui/button"
import { Batch, Day } from "@prisma/client"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState } from "react"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { MultiSelect } from "@/components/ui/multi-select"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

import { CREATE_BATCH_CLASS, GET_SUBJECT_BY_CLASS, GET_TEACHER_BY_LEVEL } from "../action"

interface Props {
    batch: Batch
}

export const ClassForm = ({ batch }: Props) => {
    const [id, setId] = useState<number | undefined>()

    const router = useRouter()

    const { data: subjects } = useQuery({
        queryKey: ["get-subjects-batch-class", batch.class],
        queryFn: async () => {
            const res = await GET_SUBJECT_BY_CLASS(batch.class)
            return res.subjects
        },
    })

    const { data: teachers } = useQuery({
        queryKey: ["get-teacher-by-level", batch.level, id],
        queryFn: async () => {
            const res = await GET_TEACHER_BY_LEVEL({ level: batch.level, id })
            return res.teachers
        },
    })

    const { mutate: createClass, isPending } = useMutation({
        mutationFn: CREATE_BATCH_CLASS,
        onSuccess: (data) => {
            form.reset()
            toast.success(data.success, {
                id: "create-class"
            });
            router.push(`/dashboard/batch/${batch.id}`)
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "create-class"
            });
        }
    })

    const form = useForm<z.infer<typeof BatchClassSchema>>({
        resolver: zodResolver(BatchClassSchema),
        defaultValues: {
            time: "",
            day: [],
            subjectId: "",
            teacherId: ""
        },
    })

    function onSubmit(values: z.infer<typeof BatchClassSchema>) {
        toast.loading("Class creating...", {
            id: "create-class"
        });
        createClass({ id: batch.id, values })
    }

    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>Class Form</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="time"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Time</FormLabel>
                                    <Select onValueChange={(value) => field.onChange(value)} disabled={isPending}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select time" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                batch.classTime.map((time, i) => (
                                                    <SelectItem value={time} key={i}>{time}</SelectItem>
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
                            name="day"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Days</FormLabel>
                                    <FormControl>
                                        <MultiSelect
                                            options={Object.values(Day).map(item => ({ label: item, value: item }))}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            placeholder="Select days"
                                            variant="inverted"
                                            animation={2}
                                            maxCount={3}
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                                    <Select value={field.value} onValueChange={(value) => field.onChange(value)} disabled={isPending}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select teacher" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <Input placeholder="Search by id..." type="number" onChange={(e) => setId(parseInt(e.target.value))} className="my-2" />
                                            {
                                                teachers?.map((subject, i) => (
                                                    <SelectItem value={subject.id} key={i}>{subject.name}</SelectItem>
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
            </CardContent>
        </Card>
    )
}