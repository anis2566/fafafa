import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import { useSession } from "next-auth/react";

import kyInstance from "@/lib/ky";

export default function useInitializeChatClient() {
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);

  const { data: session } = useSession();

  useEffect(() => {
    if (!session) return;

    const client = StreamChat.getInstance(process.env.NEXT_PUBLIC_STREAM_KEY!);

    client
      .connectUser(
        {
          id: session?.userId || "",
          username: session?.user?.name || "",
          name: session?.user?.name || "",
          image: session?.user?.image || "",
        },
        async () =>
          kyInstance
            .get("/api/stream/token")
            .json<{ token: string }>()
            .then((data) => data.token)
      )
      .catch((error) => console.error("Failed to connect user", error))
      .then(() => setChatClient(client));

    return () => {
      setChatClient(null);
      client
        .disconnectUser()
        .catch((error) => console.error("Failed to disconnect user", error))
        .then(() => console.log("Connection closed"));
    };
  }, [session]);

  return chatClient;
}
