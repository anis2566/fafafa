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
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"

import { useDebounce } from "@/hooks/use-debounce"
import { formatString } from "@/lib/utils"


interface Props {
    open: boolean;
    handleClose: () => void;
}

export const FilterDrawer = ({ open, handleClose }: Props) => {
    const [search, setSearch] = useState<string>("")
    const [id, setId] = useState<string>("")
    const [perPage, setPerPage] = useState<string>("")
    const [className, setClassName] = useState<Class | undefined>()
    const [session, setSession] = useState<number>(new Date().getFullYear())
    const [status, setStatus] = useState<PaymentStatus | "">("")

    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()
    const searchValue = useDebounce(search, 500)
    const searchIdValue = useDebounce(id, 500)

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
        handleClose()
        router.push(pathname)
        setSearch("")
        setId("")
        setSession(new Date().getFullYear())
        setPerPage("")
        setClassName(undefined)
        setStatus("")
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
                    <Select value={session.toString()} onValueChange={(value) => handleSessionChange(value)}>
                        <SelectTrigger>
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
                        <SelectTrigger>
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
                    <Select value={status} onValueChange={(value) => handleStatusChange(value as PaymentStatus)}>
                        <SelectTrigger>
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
                    <Button
                        variant="destructive"
                        onClick={handleReset}
                    >
                        Reset
                    </Button>
                </div>
            </SheetContent>
        </Sheet>

    )
}