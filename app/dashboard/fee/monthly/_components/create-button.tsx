"use client"

import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

import { useMonthlyFee } from "@/hooks/use-monthly-fee"

export const CreateButton = () => {
    const { onOpen } = useMonthlyFee()

    return (
        <Button className="mt-4 flex items-center gap-x-2" onClick={() => onOpen()}>
            <PlusCircle className="w-5 h-5" />
            Assign
        </Button>
    )
}