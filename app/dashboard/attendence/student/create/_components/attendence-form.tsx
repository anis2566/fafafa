"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import { AttendenceCreateSchema } from "../schema"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Class, Month } from "@prisma/client"
import { formatString } from "@/lib/utils"
import { CREATE_ATTENDENCE, GET_BATCH_BY_CLASS, GET_STUDENT_FOR_ATTENDENCE } from "../action"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox"

type Studnet = {
    id: string;
    name: string;
    imageUrl: string;
    studentId: number;
}

export const AttendenceForm = () => {
    const [students, setStudents] = useState<Studnet[]>([])
    const [studentIds, setStudentIds] = useState<string[]>([])

    const toggleStudent = (id: string) => {
        setStudentIds((prevIds) =>
            prevIds.includes(id)
                ? prevIds.filter((studentId) => studentId !== id)
                : [...prevIds, id]
        );
    }

    const { mutate: searchStudent, isPending } = useMutation({
        mutationFn: GET_STUDENT_FOR_ATTENDENCE,
        onSuccess: (data) => {
            setStudents(data.students)
            toast.success("Studnet founded", {
                id: "search"
            })
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "search"
            })
        }
    })

    const { mutate: createAttendence, isPending: isCreating } = useMutation({
        mutationFn: CREATE_ATTENDENCE,
        onSuccess: (data) => {
            toast.success(data.success, {
                id: "create-attendence"
            })
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "create-attendence"
            })
        }
    })

    const form = useForm<z.infer<typeof AttendenceCreateSchema>>({
        resolver: zodResolver(AttendenceCreateSchema),
        defaultValues: {
            batchId: "",
            class: undefined,
            session: new Date().getFullYear()
        },
    })

    const { data: batches } = useQuery({
        queryKey: ["get-batch-by-class", form.watch("class")],
        queryFn: async () => {
            const res = await GET_BATCH_BY_CLASS(form.watch("class"))
            return res.batches
        },
        enabled: !!form.watch("class")
    })

    function onSubmit(values: z.infer<typeof AttendenceCreateSchema>) {
        toast.loading("Searching...", {
            id: "search"
        });
        searchStudent(values)
    }

    const createAttendenceHandler = () => {
        toast.loading("Attendence creating...", {
            id: "create-attendence"
        });
        createAttendence({
            class: form.getValues("class"),
            batchId: form.getValues("batchId"),
            session: form.getValues("session"),
            students: studentIds
        })
    }

    return (
        <div className="space-y-6">
            <Card className="mt-4">
                <CardHeader>
                    <CardTitle>Search Students</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="grid md:grid-cols-3 gap-6">
                            <FormField
                                control={form.control}
                                name="session"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Session</FormLabel>
                                        <Select defaultValue={new Date().getFullYear().toString()} onValueChange={(value) => field.onChange(parseInt(value))} disabled={isPending}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select session" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    ["2023", "2024", "2025", "2026", "2027"].map((v, i) => (
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
                                name="class"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Class</FormLabel>
                                        <Select value={field.value} onValueChange={(value) => field.onChange(value)} disabled={isPending}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select class" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    Object.values(Class).map((v, i) => (
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
                                name="batchId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Batch</FormLabel>
                                        <Select value={field.value} onValueChange={(value) => field.onChange(value)} disabled={isPending}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select batch" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {
                                                    batches?.map((v, i) => (
                                                        <SelectItem value={v.id} key={i}>{v.name}</SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="max-w-fit" disabled={isPending}>Search</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            <Collapsible open={students.length > 0}>
                <CollapsibleContent>
                    <Card className="mt-4">
                        <CardHeader>
                            <CardTitle>Students</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>#ID</TableHead>
                                        <TableHead>Image</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        students.map(student => (
                                            <TableRow key={student.id}>
                                                <TableCell className="py-2">{student.studentId}</TableCell>
                                                <TableCell className="py-2">
                                                    <Avatar>
                                                        <AvatarImage src={student.imageUrl} />
                                                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                </TableCell>
                                                <TableCell className="py-2">{student.name}</TableCell>
                                                <TableCell className="py-2">
                                                    <Checkbox onCheckedChange={() => toggleStudent(student.id)} />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                            <Button disabled={studentIds.length === 0 || isCreating} onClick={createAttendenceHandler}>Submit</Button>
                        </CardContent>
                    </Card>
                </CollapsibleContent>
            </Collapsible>

        </div>
    )
}