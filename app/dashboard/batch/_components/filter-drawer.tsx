"use client"

import { SearchIcon } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import queryString from "query-string"
import { Class } from "@prisma/client"
import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"

import { useDebounce } from "@/hooks/use-debounce"
import { formatString } from "@/lib/utils"
import { GET_ROOMS } from "../create/action"


interface Props {
    open: boolean;
    handleClose: () => void;
}

export const FilterDrawer = ({ open, handleClose }: Props) => {
    const [search, setSearch] = useState<string>("")
    const [room, setRoom] = useState<string>()
    const [className, setClassName] = useState<Class | undefined>()

    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
    const searchValue = useDebounce(search, 500)

    const { data: rooms } = useQuery({
        queryKey: ["get-rooms-header"],
        queryFn: async () => {
            const res = await GET_ROOMS();
            return res.rooms
        },
        staleTime: 60 * 60 * 1000
    })

    useEffect(() => {
        const params = Object.fromEntries(searchParams.entries());
        const url = queryString.stringifyUrl({
            url: pathname,
            query: {
                ...params,
                name: searchValue
            }
        }, { skipEmptyString: true, skipNull: true });

        router.push(url);
    }, [searchValue, router, pathname, searchParams])

    const handleClassChange = (className: Class) => {
        setClassName(className)
        const params = Object.fromEntries(searchParams.entries());
        const url = queryString.stringifyUrl({
            url: pathname,
            query: {
                ...params,
                className: className
            }
        }, { skipNull: true, skipEmptyString: true })

        router.push(url)
    }

    const handleRoomChange = (room: string) => {
        setRoom(room)
        const params = Object.fromEntries(searchParams.entries());
        const url = queryString.stringifyUrl({
            url: pathname,
            query: {
                ...params,
                room
            }
        }, { skipNull: true, skipEmptyString: true })

        router.push(url)
    }

    const handleReset = () => {
        router.push(pathname)
        setSearch("")
        setClassName(undefined)
        setRoom("")
    }

    return (
        <Sheet open={open} onOpenChange={handleClose}>
            <SheetContent>
                <SheetHeader className="space-y-0">
                    <SheetTitle className="text-start">Filter</SheetTitle>
                    <SheetDescription className="text-start">
                        Filter search result
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-3 mt-4">
                    <Select value={room} onValueChange={(value) => handleRoomChange(value)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Room" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                rooms?.map((room, i) => (
                                    <SelectItem value={room.name.toString()} key={i}>{room.name}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                    <Select
                        value={className || ""}
                        onValueChange={(value) => handleClassChange(value as Class)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Class" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                Object.values(Class).map((v, i) => (
                                    <SelectItem value={v} key={i}>{formatString(v)}</SelectItem>
                                ))
                            }
                        </SelectContent>
                    </Select>
                    <div>
                        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search by name..."
                            className="w-full appearance-none bg-background pl-8 shadow-none"
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                        />
                    </div>
                    <Button
                        className="bg-rose-500 text-white"
                        onClick={handleReset}
                    >
                        Reset
                    </Button>
                </div>
            </SheetContent>
        </Sheet>

    )
}