import { ChevronUpIcon, MicIcon, PaperclipIcon, SendIcon } from "lucide-react";
import { type KeyboardEvent, type ReactNode, useId, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EmojiPicker } from "@/components/ui/emoji-picker";
import { IconButton } from "@/components/ui/icon-button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export interface QuickReply {
  /** Typed after "/" to find it, e.g. "hello". */
  key: string;
  name: string;
  text: string;
}

interface ChatComposerProps {
  value: string;
  onValueChange: (value: string) => void;
  onSend: (text: string) => void;
  /** WhatsApp's 24-hour window has closed: free text is blocked, templates only. */
  windowClosed?: boolean;
  quickReplies?: QuickReply[];
  /** DropdownMenuItems for the "More options" menu. */
  moreMenu?: ReactNode;
  onAttach?: () => void;
  onRecord?: () => void;
  emojibaseUrl?: string;
  className?: string;
}

export function ChatComposer({
  value,
  onValueChange,
  onSend,
  windowClosed,
  quickReplies = [],
  moreMenu,
  onAttach,
  onRecord,
  emojibaseUrl,
  className,
}: ChatComposerProps) {
  const { t } = useTranslation();
  const listId = useId();
  const [active, setActive] = useState(0);
  const query = value.startsWith("/") ? value.slice(1).toLowerCase() : null;
  const matches =
    query === null ? [] : quickReplies.filter((reply) => `${reply.key} ${reply.name}`.toLowerCase().includes(query));
  const showReplies = matches.length > 0;
  const canSend = !windowClosed && value.trim().length > 0 && query === null;

  function pick(reply: QuickReply) {
    onValueChange(reply.text);
    setActive(0);
  }

  function onKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (showReplies) {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const step = event.key === "ArrowDown" ? 1 : -1;
        setActive((current) => (current + step + matches.length) % matches.length);
        return;
      }
      if (event.key === "Enter" || event.key === "Tab") {
        event.preventDefault();
        const reply = matches[active];
        if (reply) pick(reply);
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        onValueChange("");
        return;
      }
    }
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (canSend) onSend(value.trim());
    }
  }

  return (
    <div data-slot="chat-composer" className={cn("relative px-4 pt-1.5 pb-4", className)}>
      <div
        hidden={!showReplies}
        className="absolute inset-x-3 bottom-full z-10 mb-1.5 overflow-hidden rounded-xl bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-foreground/10"
      >
        <div className="px-2 py-1.5 text-caption font-semibold tracking-wide text-muted-foreground uppercase">
          {t("chat.composer.quickReplies")}
        </div>
        <div role="listbox" id={listId} aria-label={t("chat.composer.quickReplies")}>
          {matches.map((reply, index) => (
            <div
              key={reply.key}
              id={`${listId}-${reply.key}`}
              role="option"
              aria-selected={index === active}
              tabIndex={-1}
              onMouseDown={(event) => {
                event.preventDefault();
                pick(reply);
              }}
              className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 aria-selected:bg-accent"
            >
              <code className="w-20 shrink-0 text-body-sm text-primary">/{reply.key}</code>
              <span className="truncate text-body-sm text-muted-foreground">{reply.text}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex min-h-14 items-end gap-1 rounded-3xl bg-background py-2 pr-2 pl-3 shadow-sm ring-1 ring-foreground/5">
        {moreMenu ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton icon={ChevronUpIcon} label={t("chat.composer.more")} tooltip={false} />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-72">
              {moreMenu}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
        {onAttach ? (
          <IconButton
            icon={PaperclipIcon}
            label={t("chat.composer.attach")}
            onClick={onAttach}
            disabled={windowClosed}
            className="text-muted-foreground"
          />
        ) : null}
        <Textarea
          rows={1}
          value={value}
          onChange={(event) => {
            onValueChange(event.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          disabled={windowClosed}
          aria-label={t("chat.composer.message")}
          placeholder={windowClosed ? t("chat.composer.windowClosed") : t("chat.composer.placeholder")}
          aria-autocomplete="list"
          aria-controls={listId}
          aria-activedescendant={showReplies && matches[active] ? `${listId}-${matches[active].key}` : undefined}
          className="max-h-40 min-h-8 flex-1 resize-none self-center rounded-none border-0 bg-transparent px-2 py-1 text-body shadow-none focus-visible:ring-0 disabled:bg-transparent"
        />
        {onRecord ? (
          <IconButton
            icon={MicIcon}
            label={t("chat.composer.voice")}
            onClick={onRecord}
            disabled={windowClosed}
            className="text-muted-foreground"
          />
        ) : null}
        {!windowClosed ? (
          <EmojiPicker
            onEmojiSelect={(emoji) => onValueChange(value + emoji)}
            {...(emojibaseUrl ? { emojibaseUrl } : {})}
          />
        ) : null}
        <Button
          size="icon-lg"
          className="ml-1 rounded-full"
          aria-label={t("chat.composer.send")}
          disabled={!canSend}
          onClick={() => onSend(value.trim())}
        >
          <SendIcon aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
