"use client"

import { SearchIcon } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import queryString from "query-string"
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


interface Props {
    open: boolean;
    handleClose: () => void;
}

export const FilterDrawer = ({ open, handleClose }: Props) => {
    const [search, setSearch] = useState<string>("")
    const [id, setId] = useState<string>("")
    const [session, setSession] = useState<number>(new Date().getFullYear())

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
    }, [searchValue, router, pathname, searchParams])

    useEffect(() => {
        const url = queryString.stringifyUrl({
            url: pathname,
            query: {
                id: searchIdValue
            }
        }, { skipEmptyString: true, skipNull: true });

        router.push(url);
    }, [searchIdValue, router, pathname])

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
        handleClose()
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