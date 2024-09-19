"use client"

import { SearchIcon } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import queryString from "query-string"
import { useEffect, useState } from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { useDebounce } from "@/hooks/use-debounce"

export const Header = () => {
    const [search, setSearch] = useState<string>("")
    const [id, setId] = useState<string>("")

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
        const url = queryString.stringifyUrl({
            url: pathname,
            query: {
                id: searchIdValue
            }
        }, { skipEmptyString: true, skipNull: true });

        router.push(url);
    }, [searchIdValue, router, pathname])

    return (
        <div className="space-y-2 shadow-sm shadow-primary px-2 py-3">
            <div className="flex items-center justify-between gap-x-3">
                <div className="flex items-center gap-x-3">
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
                        variant="destructive"
                        className="hidden md:flex"
                        onClick={() => {
                            setSearch("")
                            setId("")
                            router.push(pathname)
                        }}
                    >
                        Reset
                    </Button>
                </div>
            </div>
            <Button
                variant="destructive"
                className="md:hidden"
                onClick={() => {
                    setSearch("")
                    setId("")
                    router.push(pathname)
                }}
            >
                Reset
            </Button>
        </div>
    )
}