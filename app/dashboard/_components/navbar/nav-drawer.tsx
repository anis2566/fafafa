import Link from "next/link";
import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetHeader,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "../sidebar/menu";

export function SheetMenu() {
    return (
        <Sheet>
            <SheetTrigger className="lg:hidden" asChild>
                <Button className="h-8" size="icon">
                    <MenuIcon size={20} />
                </Button>
            </SheetTrigger>
            <SheetContent className="sm:w-72 px-3 h-full flex flex-col" side="left">
                <SheetHeader>
                    <Button
                        className="flex justify-center items-center -mt-4"
                        variant="link"
                        asChild
                    >
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <img
                                src="/logo.png"
                                alt="Logo"
                                className="h-[30px] w-15"
                            />
                            <h1 className="font-bold text-lg">BEC</h1>
                        </Link>
                    </Button>
                </SheetHeader>
                <Menu isOpen />
            </SheetContent>
        </Sheet>
    );
}