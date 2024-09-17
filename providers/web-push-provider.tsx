"use client";

import { useEffect, useState } from "react";

import { registerServiceWorker } from "@/lib/serviceWorker";
import {
    getCurrentPushSubscription,
    registerPushNotifications,
} from "@/services/push.service";

export const WebPushProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        async function initializeWebPush() {
            if (isInitialized) return;

            try {
                await registerServiceWorker();
                const currentSubscription = await getCurrentPushSubscription();
                if (!currentSubscription) {
                    await registerPushNotifications();
                }
            } catch (error) {
                console.error(error);
                if (Notification.permission === "denied") {
                    console.warn("Push notifications are denied in browser settings");
                } else {
                    console.error("Failed to set up push notifications");
                }
            } finally {
                setIsInitialized(true);
            }
        }

        initializeWebPush();
    }, [isInitialized]);

    return <>{children}</>;
};