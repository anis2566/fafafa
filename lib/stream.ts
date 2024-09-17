import { StreamChat } from "stream-chat";

if (!process.env.NEXT_PUBLIC_STREAM_KEY || !process.env.STREAM_SECRET) {
  throw new Error("Missing Stream API keys");
}

if (!StreamChat) {
  throw new Error("StreamChat is not initialized correctly");
}

const streamServerClient = StreamChat.getInstance(
  process.env.NEXT_PUBLIC_STREAM_KEY!,
  process.env.STREAM_SECRET,
  {
    timeout: 6000,
  }
);

export default streamServerClient;
