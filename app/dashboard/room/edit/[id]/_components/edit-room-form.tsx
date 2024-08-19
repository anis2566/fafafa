"use client"

import { Room, RoomStatus } from "@prisma/client"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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

import { availableTime } from "@/constant"
import { RoomSchema } from "../../../create/schema"
import { UPDATE_ROOM } from "../action"

interface Props {
    room: Room
}

export const EditRoomForm = ({ room }: Props) => {

    const router = useRouter()

    const { mutate: updateRoom, isPending } = useMutation({
        mutationFn: UPDATE_ROOM,
        onSuccess: (data) => {
            toast.success(data.success, {
                id: "update-room"
            });
            router.push("/dashboard/room")
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "update-room"
            });
        }
    })

    const form = useForm<z.infer<typeof RoomSchema>>({
        resolver: zodResolver(RoomSchema),
        defaultValues: {
            name: room.name || undefined,
            capacity: room.capacity || undefined,
            status: room.status || undefined,
            availableTime: room.availableTime || []
        },
    })

    function onSubmit(values: z.infer<typeof RoomSchema>) {
        toast.loading("Room updating...", {
            id: "update-room"
        });
        updateRoom({ id: room.id, values })
    }

    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle>Room Form</CardTitle>
                <CardDescription>Fill up room information.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Room Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter room name..." {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} type="number" disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="capacity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Room Capacity</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter room capacity..." {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} type="number" disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="availableTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Available Time</FormLabel>
                                    <FormControl>
                                        <MultiSelect
                                            options={availableTime.map(item => ({ label: item, value: item }))}
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
                                            {
                                                Object.values(RoomStatus).map((v, i) => (
                                                    <SelectItem value={v} key={i}>{v}</SelectItem>
                                                ))
                                            }
                                        </SelectContent>
                                    </Select>
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