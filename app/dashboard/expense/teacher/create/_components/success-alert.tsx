"use client"

import { List, PlusCircle } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

interface Props {
    open: boolean
}

export const SuccessAlert = ({ open }: Props) => {
    const handleReload = () => {
        window.location.reload()
    }
    return (
        <Dialog open={open}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Bill created successfuly</DialogTitle>
                </DialogHeader>
                <div className="flex items-center justify-center gap-x-4 py-8">
                    <Button className="flex items-center gap-x-3" onClick={handleReload}>
                        <PlusCircle />
                        Add More
                    </Button>
                    <Button variant="outline" asChild>
                        <Link href={"/dashboard/expense/teacher"} className="flex items-center gap-x-3">
                            <List />
                            See List
                        </Link>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}