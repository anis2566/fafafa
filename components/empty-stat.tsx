import { PackageOpen } from "lucide-react"

interface Props {
    title: string;
}

export const EmptyData = ({title}:Props) => {
    return (
        <div className="h-[40vh] w-full flex items-center justify-center">
            <div className="space-y-2">
                <PackageOpen className="w-10 h-10 text-sky-700 mx-auto" />
                <p className="italic text-md text-muted-foreground">Opps! {title}</p>
            </div>
        </div>
    )
}