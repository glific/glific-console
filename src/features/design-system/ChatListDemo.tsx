import { useState } from "react";
import { ConversationListItem } from "@/components/chat";

export function ChatListDemo() {
  const [selected, setSelected] = useState("asha");
  const rows = [
    {
      id: "asha",
      name: "Asha Kulkarni",
      preview: "हिन्दी",
      time: "10:03",
      tone: "danger" as const,
      toneLabel: "Problem",
    },
    {
      id: "rahul",
      name: "Rahul Verma",
      preview: "When is the next class?",
      time: "09:41",
      unread: 2,
      tone: "warning" as const,
      toneLabel: "Waiting",
    },
    { id: "meera", name: "Meera Iyer", preview: "Thanks!", time: "Yesterday" },
  ];
  return (
    <div className="flex w-80 flex-col gap-0.5 rounded-xl border p-1">
      {rows.map((row) => (
        <ConversationListItem
          key={row.id}
          {...row}
          selected={selected === row.id}
          onSelect={() => setSelected(row.id)}
        />
      ))}
    </div>
  );
}
