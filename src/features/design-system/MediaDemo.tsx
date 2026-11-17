import { MessageBubble, MessageMedia } from "@/components/chat";

export function MediaDemo() {
  return (
    <div className="grid w-full max-w-3xl gap-2 rounded-xl bg-chat-surface p-4 sm:grid-cols-2">
      <MessageBubble direction="inbound" time="11:20">
        <MessageMedia kind="image" name="Photo of admit card" />
      </MessageBubble>
      <MessageBubble direction="inbound" time="11:21">
        <MessageMedia kind="video" />
      </MessageBubble>
      <MessageBubble direction="inbound" time="11:22">
        <MessageMedia kind="audio" detail="0:42" />
      </MessageBubble>
      <MessageBubble direction="inbound" time="11:23">
        <MessageMedia
          kind="location"
          location={{ latitude: 19.04, longitude: 72.85, label: "Dharavi community centre" }}
        />
      </MessageBubble>
    </div>
  );
}
