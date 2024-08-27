"use client"

import { RoomStatus } from "@prisma/client"
import { useMutation, useQuery } from "@tanstack/react-query"
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

import { CREATE_ROOM, GET_HOUSES } from "../action"
import { RoomSchema } from "../schema"
import { MultiSelect } from "@/components/ui/multi-select"
import { availableTime } from "@/constant"

export const CreateRoomForm = () => {

    const router = useRouter()

    const { data: houses } = useQuery({
        queryKey: ["get-houses-for-room"],
        queryFn: async () => {
            const res = await GET_HOUSES()
            return res.houses
        }
    })

    const { mutate: createRoom, isPending } = useMutation({
        mutationFn: CREATE_ROOM,
        onSuccess: (data) => {
            form.reset()
            toast.success(data.success, {
                id: "create-room"
            });
            router.push("/dashboard/room")
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "create-room"
            });
        }
    })

    const form = useForm<z.infer<typeof RoomSchema>>({
        resolver: zodResolver(RoomSchema),
        defaultValues: {
            name: undefined,
            houseId: "",
            capacity: undefined,
            status: undefined,
            availableTime: []
        },
    })

    function onSubmit(values: z.infer<typeof RoomSchema>) {
        toast.loading("Room creating...", {
            id: "create-room"
        });
        createRoom(values)
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
                            name="houseId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>House</FormLabel>
                                    <Select onValueChange={field.onChange} disabled={isPending}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select house" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {
                                                houses?.map((v, i) => (
                                                    <SelectItem value={v.id} key={i}>{v.name}</SelectItem>
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
                                    <Select onValueChange={field.onChange} disabled={isPending}>
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
                        <Button type="submit" disabled={isPending}>Submit</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}