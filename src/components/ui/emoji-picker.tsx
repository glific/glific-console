import { EmojiPicker as EmojiPickerPrimitive } from "frimousse"
import { SmileIcon } from "lucide-react"
import * as React from "react"
import { useTranslation } from "react-i18next"
import { IconButton } from "@/components/ui/icon-button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void
  /** Emoji data source. Defaults to frimousse's CDN (jsDelivr); point at a self-hosted copy for production. */
  emojibaseUrl?: string
  size?: React.ComponentProps<typeof IconButton>["size"]
}

function EmojiPicker({
  onEmojiSelect,
  emojibaseUrl,
  size = "default",
}: EmojiPickerProps) {
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <IconButton
          icon={SmileIcon}
          label={t("emoji.open")}
          size={size}
          tooltip={false}
        />
      </PopoverTrigger>
      <PopoverContent
        className="w-fit p-0"
        align="end"
        aria-label={t("emoji.open")}
      >
        <EmojiPickerPrimitive.Root
          className="isolate flex h-80 w-72 flex-col"
          onEmojiSelect={({ emoji }) => {
            onEmojiSelect(emoji)
            setOpen(false)
          }}
          {...(emojibaseUrl ? { emojibaseUrl } : {})}
        >
          <EmojiPickerPrimitive.Search
            aria-label={t("emoji.search")}
            placeholder={t("emoji.search")}
            className="z-10 mx-2 mt-2 h-8 appearance-none rounded-md border border-input bg-background px-2.5 text-body outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          />
          <EmojiPickerPrimitive.Viewport className="relative flex-1 outline-none">
            <EmojiPickerPrimitive.Loading className="absolute inset-0 flex items-center justify-center text-body-sm text-muted-foreground">
              {t("emoji.loading")}
            </EmojiPickerPrimitive.Loading>
            <EmojiPickerPrimitive.Empty className="absolute inset-0 flex items-center justify-center text-body-sm text-muted-foreground">
              {t("emoji.empty")}
            </EmojiPickerPrimitive.Empty>
            <EmojiPickerPrimitive.List
              className="pb-1.5 select-none"
              components={{
                CategoryHeader: ({ category, ...props }) => (
                  <div
                    className="bg-popover px-3 pt-3 pb-1.5 text-caption font-medium text-muted-foreground"
                    {...props}
                  >
                    {category.label}
                  </div>
                ),
                Row: ({ children, ...props }) => (
                  <div className="scroll-my-1.5 px-1.5" {...props}>
                    {children}
                  </div>
                ),
                Emoji: ({ emoji, ...props }) => (
                  <button
                    type="button"
                    className="flex size-8 items-center justify-center rounded-md text-subheading data-active:bg-accent"
                    {...props}
                  >
                    {emoji.emoji}
                  </button>
                ),
              }}
            />
          </EmojiPickerPrimitive.Viewport>
        </EmojiPickerPrimitive.Root>
      </PopoverContent>
    </Popover>
  )
}

export { EmojiPicker }
