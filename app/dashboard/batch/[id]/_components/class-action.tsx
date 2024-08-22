"use client"

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useClass } from "@/hooks/use-class";


interface Props {
    id: string;
}

export const ClassActions = ({ id }: Props) => {
    const {onOpen} = useClass()

    return (
        <Button variant="ghost" size="icon" onClick={() => onOpen(id)}>
            <Trash2 className="h-5 w-5 text-rose-500" />
        </Button>
    )
}