"use client"

import { SearchIcon } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import queryString from "query-string"
import { Class, PaymentStatus } from "@prisma/client"
import { useEffect, useState } from "react"

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
import { formatString } from "@/lib/utils"
import { FilterDrawer } from "./filter-drawer"


export const Header = () => {
    const [search, setSearch] = useState<string>("")
    const [id, setId] = useState<string>("")
    const [perPage, setPerPage] = useState<string>("")
    const [className, setClassName] = useState<Class | undefined>()
    const [session, setSession] = useState<number>(new Date().getFullYear())
    const [status, setStatus] = useState<PaymentStatus | "">("")
    const [open, setOpen] = useState<boolean>(false)

    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
    const searchValue = useDebounce(search, 500)
    const searchIdValue = useDebounce(id, 500)

    const handleClose = () => {
        setOpen(false)
    }

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
    }, [searchValue, router, pathname])

    useEffect(() => {
        const params = Object.fromEntries(searchParams.entries());
        const url = queryString.stringifyUrl({
            url: pathname,
            query: {
                ...params,
                id: searchIdValue
            }
        }, { skipEmptyString: true, skipNull: true });

        router.push(url);
    }, [searchIdValue, router, pathname])

    const handlePerPageChange = (perPage: string) => {
        setPerPage(perPage)
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
    const handleStatusChange = (status: PaymentStatus) => {
        setStatus(status)
        const params = Object.fromEntries(searchParams.entries());
        const url = queryString.stringifyUrl({
            url: pathname,
            query: {
                ...params,
                status
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

    const handleSessionChange = (session: string) => {
        setSession(parseInt(session))
        const params = Object.fromEntries(searchParams.entries());
        const url = queryString.stringifyUrl({
            url: pathname,
            query: {
                ...params,
                session
            }
        }, { skipNull: true, skipEmptyString: true })

        router.push(url)
    }

    const handleReset = () => {
        router.push(pathname)
        setSearch("")
        setId("")
        setSession(new Date().getFullYear())
        setPerPage("")
        setClassName(undefined)
        setStatus("")
    }

    return (
        <div className="space-y-2 shadow-sm shadow-primary px-2 py-3">
            <FilterDrawer open={open} handleClose={handleClose} />
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
            <div className="hidden md:flex items-center justify-between gap-x-3">
                <div className="flex items-center gap-x-3">
                    <Select value={session.toString()} onValueChange={(value) => handleSessionChange(value)}>
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Session" />
                        </SelectTrigger>
                        <SelectContent>
                            {
                                ["2020", "2021", "2022", "2023", "2024", "2025", "2026"].map((v, i) => (
                                    <SelectItem value={v} key={i}>{v}</SelectItem>
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
                            type="number"
                            placeholder="Search by ID..."
                            className="w-full appearance-none bg-background pl-8 shadow-none"
                            onChange={(e) => setId(e.target.value)}
                            value={id}
                        />
                    </div>
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
                    <Select value={perPage || ""} onValueChange={(value) => handlePerPageChange(value)}>
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
                    <Button
                        variant="destructive"
                        onClick={handleReset}
                    >
                        Reset
                    </Button>
                </div>
                <Select value={status} onValueChange={(value) => handleStatusChange(value as PaymentStatus)}>
                    <SelectTrigger className="w-[130px]">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        {Object.values(PaymentStatus).map((status) => (
                            <SelectItem key={status} value={status}>
                                {status}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}