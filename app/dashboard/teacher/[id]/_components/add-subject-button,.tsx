"use client"

import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

import { useTeacherSubject } from "@/hooks/use-teacher";

interface Props {
    id: string;
}

export const AddSubjectButton = ({ id }: Props) => {
    const { onOpen } = useTeacherSubject()

    return (
        <Button className="flex items-center gap-x-2 bg-amber-600 hover:bg-amber-700" onClick={() => onOpen(id)}>
            <PlusCircle className="w-5 h-5" />
            Add Subject
        </Button>
    )
}