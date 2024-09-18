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
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { useDebounce } from "@/hooks/use-debounce"
import { GET_ROOMS } from "../create/action"
import { formatString } from "@/lib/utils"
import { FilterDrawer } from "./filter-drawer"


export const Header = () => {
    const [search, setSearch] = useState<string>("")
    const [perPage, setPerPage] = useState<number>()
    const [room, setRoom] = useState<string>()
    const [className, setClassName] = useState<Class | undefined>()
    const [open, setOpen] = useState<boolean>(false)

    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
    const searchValue = useDebounce(search, 500)

    const handleClose = () => {
        setOpen(false)
    }

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

    const handlePerPageChange = (perPage: string) => {
        setPerPage(parseInt(perPage))
        const params = Object.fromEntries(searchParams.entries());
        const url = queryString.stringifyUrl({
            url: pathname,
            query: {
                ...params,
                perPage,
            }
        }, { skipNull: true, skipEmptyString: true })

        router.push(url)
    }

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
        setPerPage(undefined)
        setClassName(undefined)
        setRoom("")
    }

    return (
        <div className="space-y-2 shadow-sm shadow-primary px-2 py-3">
            <FilterDrawer open={open} handleClose={handleClose} />
            <div className="flex items-center justify-between gap-x-3">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild className="md:hidden">
                            <Button onClick={() => setOpen(true)}>Filter</Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Filter result</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <div className="hidden md:flex items-center gap-x-3">
                    <Select value={room} onValueChange={(value) => handleRoomChange(value)}>
                        <SelectTrigger className="w-[130px]">
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
                        <SelectTrigger className="w-[130px]">
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
                        variant="outline"
                        className="bg-rose-500 text-white"
                        onClick={handleReset}
                    >
                        Reset
                    </Button>
                </div>
                <Select value={perPage?.toString() || ""} onValueChange={(value) => handlePerPageChange(value)}>
                    <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Limit" />
                    </SelectTrigger>
                    <SelectContent>
                        {
                            ["5", "10", "20", "50", "100", "200"].map((v, i) => (
                                <SelectItem value={v} key={i}>{v}</SelectItem>
                            ))
                        }
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}