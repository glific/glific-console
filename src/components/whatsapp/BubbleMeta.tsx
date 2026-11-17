export function BubbleMeta({ time }: { time?: string }) {
  return time ? <span className="self-end text-caption text-chat-meta">{time}</span> : null;
}
