import { FileTextIcon, MessageSquareIcon, MoreVerticalIcon, WorkflowIcon } from "lucide-react";
import { useState } from "react";
import {
  ChatComposer,
  ChatHeader,
  DayDivider,
  MessageBubble,
  MessageMedia,
  PollMessage,
  type QuickReply,
  SystemNotice,
} from "@/components/chat";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { IconButton } from "@/components/ui/icon-button";

const quickReplies: QuickReply[] = [
  { key: "hello", name: "Greeting", text: "Hello! How can we help you today?" },
  { key: "helpline", name: "Helpline", text: "You can call our helpline on 1800-123-456." },
  { key: "callback", name: "Call back", text: "We'll call you back within a day." },
];

export function ChatDemo() {
  const [value, setValue] = useState("");
  const [sent, setSent] = useState<string[]>([]);
  return (
    <div className="flex w-full max-w-3xl flex-col overflow-hidden rounded-xl border">
      <ChatHeader
        name="Asha Kulkarni"
        phone="+91 98765 00001"
        group="Batch A"
        hoursLeft={2}
        onInfo={() => {}}
        actions={<IconButton icon={MoreVerticalIcon} label="Contact options" />}
      />
      <div className="flex flex-col gap-2 bg-chat-surface px-6 py-4">
        <DayDivider>Today</DayDivider>
        <MessageBubble direction="inbound" text="Hi, I want to *register* for the tailoring course" time="10:02" />
        <MessageBubble
          direction="outbound"
          text="Welcome! Which language do you prefer?"
          time="10:02"
          status="read"
          buttons={["English", "हिन्दी", "मराठी"]}
          meta={<span>Registration › Language</span>}
        />
        <MessageBubble direction="inbound" text="हिन्दी" time="10:03" />
        <MessageBubble direction="outbound" time="10:03" status="delivered">
          <MessageMedia kind="document" name="course-details.pdf" detail="240 KB · PDF" />
        </MessageBubble>
        <MessageBubble direction="outbound" time="10:04" status="sent">
          <PollMessage question="Which batch suits you?" options={["Morning", "Evening"]} />
        </MessageBubble>
        <MessageBubble
          direction="outbound"
          text="Your certificate is ready"
          time="10:05"
          status="error"
          error="Webhook returned 500 from certificates.example.org"
          onErrorClick={() => {}}
        />
        <SystemNotice tone="success">Restarted from “Language”</SystemNotice>
        {sent.map((text, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: demo messages have no ids
          <MessageBubble key={index} direction="outbound" text={text} time="now" status="pending" />
        ))}
      </div>
      <div className="bg-chat-surface">
        <ChatComposer
          value={value}
          onValueChange={setValue}
          onSend={(text) => {
            setSent((s) => [...s, text]);
            setValue("");
          }}
          quickReplies={quickReplies}
          onAttach={() => {}}
          onRecord={() => {}}
          moreMenu={
            <>
              <DropdownMenuItem>
                <FileTextIcon /> Send a template
              </DropdownMenuItem>
              <DropdownMenuItem>
                <WorkflowIcon /> Start a flow
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquareIcon /> Interactive message
              </DropdownMenuItem>
            </>
          }
        />
      </div>
    </div>
  );
}
