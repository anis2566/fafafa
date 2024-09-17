"use client";

import { Megaphone } from "lucide-react";
import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
import { Notice } from "@prisma/client";

import { cn } from "@/lib/utils";
import { AnimatedList } from "@/components/magicui/animated-list";

TimeAgo.addDefaultLocale(en)

const Notification = ({ notice }: { notice: Notice }) => {
    return (
        <figure
            className={cn(
                "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
                "transition-all duration-200 ease-in-out hover:scale-[103%]",
                "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
                "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
            )}
        >
            <div className="flex flex-row items-center gap-3">
                <div
                    className="flex size-10 items-center justify-center rounded-2xl bg-[#FF3D71] flex-shrink-0"
                >
                    <Megaphone className="w-5 h-5 text-white" />
                </div>
                <div className="flex flex-col overflow-hidden">
                    <figcaption className="flex flex-row items-center text-lg font-medium dark:text-white">
                        <span className="text-sm break-words">{notice.text}</span>
                    </figcaption>
                    <ReactTimeAgo date={notice.createdAt} locale="en-US" className="text-xs" />
                </div>
            </div>
        </figure>
    );
};

export function NoticeList({
    className,
    notices
}: {
    className?: string;
    notices: Notice[]
}) {
    return (
        <div
            className={cn(
                "relative flex h-[500px] w-full flex-col p-6 overflow-hidden rounded-lg border bg-background md:shadow-xl",
                className,
            )}
        >
            <h1 className="text-lg font-semibold">Notice Board</h1>
            <AnimatedList delay={6000}>
                {notices.map((item, idx) => (
                    <Notification notice={item} key={idx} />
                ))}
            </AnimatedList>
        </div>
    );
}
