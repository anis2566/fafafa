"use client"

import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

import { useAddSubject } from "@/hooks/use-subject"

export const AddSubjectButton = () => {
    const { onOpen } = useAddSubject()

    return (
        <Button className="mt-4 flex items-center gap-x-2" onClick={() => onOpen()}>
            <PlusCircle className="w-5 h-5" />
            Add Subject
        </Button>
    )
}