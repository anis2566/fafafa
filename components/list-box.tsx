import { format } from "date-fns";
import { LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils";

interface ListBoxProps {
    icon: LucideIcon;
    title: string;
    description?: string;
    date?: Date;
}

export const ListBox = ({ icon: Icon, title, description, date }: ListBoxProps) => {

    return (
        <div className="flex gap-x-4">
            <div className="bg-violet-400 flex items-center justify-center w-10 h-10 rounded-md flex-shrink-0">
                <Icon className="text-white" />
            </div>
            <div className="space-y-1">
                <h4 className="font-semibold">{title}</h4>
                <p className="text-muted-foreground break-words leading-4">
                    {date ? format(date, "dd MMM yyyy") : description}
                </p>
            </div>
        </div>
    )
}