"use client";

import { BookOpen, BuildingIcon, Layers } from "lucide-react";

import { cn } from "@/lib/utils";
import { AnimatedList } from "@/components/magicui/animated-list";

const ClassComp = ({ className }: { className: ClassData }) => {
    return (
        <figure
            className={cn(
                "relative mx-auto min-h-fit w-full w-full cursor-pointer overflow-hidden rounded-md",
                "transition-all duration-200 ease-in-out hover:scale-[103%]",
                "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
                "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
            )}
        >
            <div className="border flex items-center gap-x-3">
                <div className="text-center border-r p-2">
                    <p>
                        {className.time}
                    </p>
                    <p>
                        {className.day}
                    </p>
                </div>
                <div className="space-y-1 p-2">
                    <div className="flex items-center gap-x-2">
                        <BookOpen className="w-5 h-5" />
                        <p className="text-lg font-semibold">{className?.subjectName}</p>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <Layers className="w-5 h-5" />
                        <p className="text-md">{className?.batchName}</p>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <BuildingIcon className="w-5 h-5" />
                        <p className="text-md">{className.roomName}</p>
                    </div>
                </div>
            </div>
        </figure>
    );
};

type ClassData = {
    time: string;
    day: string;
    batchName: string;
    subjectName: string;
    roomName: number;
};

export function AnimatedClassList({
    className,
    classes
}: {
    className?: string;
    classes: ClassData[]
}) {
    return (
        <div
            className={cn(
                "h-[450px] overflow-hidden ",
                className,
            )}
        >
            <AnimatedList delay={6000}>
                {classes.map((item, idx) => (
                    <ClassComp className={item} key={idx} />
                ))}
            </AnimatedList>
        </div>
    );
}
