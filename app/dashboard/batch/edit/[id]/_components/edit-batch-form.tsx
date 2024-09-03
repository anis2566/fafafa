"use client"

import { Batch, Class, Level, Room } from "@prisma/client"
import { useMutation, useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from "react"

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

import { formatString } from "@/lib/utils"
import { GET_ROOMS } from "../../../create/action"
import { BatchSchema } from "../../../create/schema"
import { UPDATE_BATCH } from "../action"

interface Props {
    batch: Batch
}

export const EditBatchForm = ({ batch }: Props) => {
    const [room, setRoom] = useState<Room | null>()

    const router = useRouter()

    const { data: rooms } = useQuery({
        queryKey: ["get-rooms-for-batch"],
        queryFn: async () => {
            const res = await GET_ROOMS()
            return res.rooms
        }
    })

    useEffect(() => {
        if (rooms) {
            setRoom(rooms.find(room => room.id === batch.roomId))
        }
    }, [rooms, batch.roomId])

    const { mutate: updateBatch, isPending } = useMutation({
        mutationFn: UPDATE_BATCH,
        onSuccess: (data) => {
            form.reset()
            toast.success(data.success, {
                id: "update-batch"
            });
            router.push("/dashboard/batch")
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "update-batch"
            });
        }
    })

    const form = useForm<z.infer<typeof BatchSchema>>({
        resolver: zodResolver(BatchSchema),
        defaultValues: {
            name: batch.name || undefined,
            class: batch.class || undefined,
            capacity: batch.capacity || undefined,
            roomId: batch.roomId || "",
            time: batch.time || [],
            classTime: batch.classTime || [],
            level: batch.level || undefined
        },
    })

    function onSubmit(values: z.infer<typeof BatchSchema>) {
        toast.loading("Batch updating...", {
            id: "update-batch"
        });
        updateBatch({ id: batch.id, values })
    }

    const existRoomOptions = room ? [...batch.time, ...room.availableTime.filter(time => !room.bookTime.includes(time))].map(item => ({ label: item, value: item })) : []
    const newRoomOptions = room ? room.availableTime.filter(time => !room.bookTime.includes(time)).map(item => ({ label: item, value: item })) : []

    console.log(form.formState.errors)

    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>Edit Batch Form</CardTitle>
                <CardDescription>Customize batch information.</CardDescription>
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
                                    <Select value={field.value} onValueChange={(value) => field.onChange(value)}>
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
                                        if (value !== batch.roomId) {
                                            field.onChange(value)
                                            setRoom(rooms?.find(item => item.id === value))
                                            form.setValue("time", [""])
                                        } else {
                                            field.onChange(value)
                                            setRoom(rooms?.find(item => item.id === value))
                                        }
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
                        <FormField
                            control={form.control}
                            name="time"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Time</FormLabel>
                                    <FormControl>
                                        <MultiSelect
                                            options={form.watch("roomId") === batch.roomId ? existRoomOptions : newRoomOptions}
                                            onValueChange={field.onChange}
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
                        <Button type="submit" disabled={isPending}>Submit</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}