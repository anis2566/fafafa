"use client"

import { Class, Level, Room } from "@prisma/client"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { MultiSelect } from "@/components/ui/multi-select"
import { Badge } from "@/components/ui/badge"

import { BatchSchema } from "../schema"
import { formatString } from "@/lib/utils"
import { CREATE_BATCH, GET_ROOMS } from "../action"

export const CreateBatchForm = () => {
    const [room, setRoom] = useState<Room | null>()
    const [classTime, setClassTime] = useState<string[]>([])
    const [selectedTime, setSelectedTime] = useState<string[]>([])

    const router = useRouter()

    const { data: rooms } = useQuery({
        queryKey: ["get-rooms-for-batch"],
        queryFn: async () => {
            const res = await GET_ROOMS()
            return res.rooms
        }
    }) 

    const handleAddClassTime = () => {
        setClassTime(classTime.filter(time => !selectedTime.includes(time)))
        setSelectedTime([])
        form.setValue("classTime", [...form.watch("classTime"), `${selectedTime[0].split("-")[0]} - ${selectedTime[selectedTime.length - 1].split("-")[1]}`])
    }

    const { mutate: createBatch, isPending } = useMutation({
        mutationFn: CREATE_BATCH,
        onSuccess: (data) => {
            form.reset()
            toast.success(data.success, {
                id: "create-batch"
            });
            router.push("/dashboard/batch")
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "create-batch"
            });
        }
    })

    const form = useForm<z.infer<typeof BatchSchema>>({
        resolver: zodResolver(BatchSchema),
        defaultValues: {
            name: undefined,
            level: undefined,
            class: undefined,
            capacity: undefined,
            roomId: "",
            time: [],
            classTime: []
        },
    })

    function onSubmit(values: z.infer<typeof BatchSchema>) {
        toast.loading("Batch creating...", {
            id: "create-batch"
        });
        createBatch(values)
    }

    const options = room?.availableTime.filter(time => !room.bookTime.includes(time))

    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>Batch Form</CardTitle>
                <CardDescription>Fill up batch information.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Batch Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter batch name..." {...field} disabled={isPending} />
                                    </FormControl>
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
                                    <Select defaultValue={field.value} onValueChange={(value) => field.onChange(value)}>
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
                            name="level"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Level</FormLabel>
                                    <Select defaultValue={field.value} onValueChange={(value) => field.onChange(value)}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select level" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                Object.values(Level).map((v, i) => (
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
                            name="capacity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Batch Capacity</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter batch capacity..." {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} type="number" disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="roomId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Room</FormLabel>
                                    <Select defaultValue={field.value} onValueChange={(value) => {
                                        field.onChange(value)
                                        setRoom(rooms?.find(item => item.id === value))
                                    }}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select room" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                rooms?.map((room, i) => (
                                                    <SelectItem value={room.id} key={i}>{room.name}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {
                            room && options && (
                                <FormField
                                    control={form.control}
                                    name="time"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Time</FormLabel>
                                            <FormControl>
                                                <MultiSelect
                                                    options={options?.map(item => ({ label: item, value: item }))}
                                                    onValueChange={(value) => {
                                                        field.onChange(value)
                                                        setClassTime(value)
                                                    }}
                                                    defaultValue={field.value}
                                                    placeholder="Select time"
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
                            )
                        }
                        {
                            room && options && (
                                <FormField
                                    control={form.control}
                                    name="classTime"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Class Time</FormLabel>
                                            <div className="flex items-center gap-x-3">
                                                <MultiSelect
                                                    options={classTime.map(item => ({ label: item, value: item }))}
                                                    onValueChange={(value) => {
                                                        setSelectedTime(value)
                                                    }}
                                                    defaultValue={selectedTime}
                                                    placeholder="Select class time"
                                                    variant="inverted"
                                                    animation={2}
                                                    maxCount={3}
                                                    disabled={isPending}
                                                    className="flex-1"
                                                />
                                                <Button type="button" onClick={() => handleAddClassTime()} disabled={selectedTime.length === 0}>Add</Button>
                                            </div>
                                            <div className="flex items-center gap-x-3 pt-1">
                                                {
                                                    form.watch("classTime").map((v, i) => (
                                                        <Badge key={i}>
                                                            {v}
                                                        </Badge>
                                                    ))
                                                }
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )
                        }

                        <Button type="submit" disabled={isPending}>Submit</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}