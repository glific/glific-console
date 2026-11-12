import { DownloadIcon, FileTextIcon, MapPinIcon, MicIcon, PlayIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export type MediaKind = "image" | "video" | "audio" | "document" | "location" | "sticker";

interface MessageMediaProps {
  kind: MediaKind;
  /** Media URL (image, video, audio, document, sticker). */
  url?: string;
  /** File name for documents; alt text for images. */
  name?: string;
  /** e.g. "2:14" for audio/video, "1.2 MB · PDF" for documents. */
  detail?: string;
  /** Location coordinates, rendered as a link to a map. */
  location?: { latitude: number; longitude: number; label?: string };
  className?: string;
}

/** Media inside a message bubble: image, video, voice note, document, location or sticker (live app ChatMessageType). */
export function MessageMedia({ kind, url, name, detail, location, className }: MessageMediaProps) {
  const { t } = useTranslation();
  const label = name ?? t(`chat.media.${kind}`);

  if (kind === "image" || kind === "sticker") {
    return url ? (
      <img
        src={url}
        alt={label}
        loading="lazy"
        className={cn(
          "mb-1 block rounded-lg object-cover",
          kind === "sticker" ? "size-32 bg-transparent" : "max-h-72 w-full",
          className,
        )}
      />
    ) : (
      <MediaPlaceholder label={label} className={className} />
    );
  }

  if (kind === "video") {
    return url ? (
      // biome-ignore lint/a11y/useMediaCaption: user-sent WhatsApp videos have no caption tracks
      <video
        src={url}
        controls
        preload="metadata"
        aria-label={label}
        className={cn("mb-1 max-h-72 w-full rounded-lg", className)}
      />
    ) : (
      <MediaPlaceholder label={label} icon={<PlayIcon aria-hidden="true" />} className={className} />
    );
  }

  if (kind === "audio") {
    return (
      <div className={cn("mb-1 flex min-w-56 items-center gap-inline", className)}>
        <MicIcon aria-hidden="true" className="size-4 text-chat-meta" />
        {url ? (
          // biome-ignore lint/a11y/useMediaCaption: voice notes have no caption tracks
          <audio src={url} controls preload="metadata" aria-label={label} className="h-8 flex-1" />
        ) : (
          <span className="text-body-sm text-muted-foreground">{label}</span>
        )}
        {detail ? <span className="text-caption text-chat-meta">{detail}</span> : null}
      </div>
    );
  }

  if (kind === "document") {
    return (
      <a
        href={url}
        download={name}
        title={t("chat.media.download", { name: label })}
        className={cn(
          "mb-1 flex min-w-56 items-center gap-inline rounded-lg bg-background/60 p-2 outline-none hover:bg-background focus-visible:ring-3 focus-visible:ring-ring/50",
          className,
        )}
      >
        <FileTextIcon aria-hidden="true" className="size-8 shrink-0 text-destructive" />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate text-body font-medium">{label}</span>
          {detail ? <span className="text-caption text-chat-meta">{detail}</span> : null}
        </span>
        <DownloadIcon aria-hidden="true" className="size-4 text-chat-meta" />
      </a>
    );
  }

  const href = location ? `https://maps.google.com/?q=${location.latitude},${location.longitude}` : undefined;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cn(
        "mb-1 flex min-w-56 items-center gap-inline rounded-lg bg-background/60 p-2 text-body outline-none hover:bg-background focus-visible:ring-3 focus-visible:ring-ring/50",
        className,
      )}
    >
      <MapPinIcon aria-hidden="true" className="size-6 shrink-0 text-destructive" />
      <span className="min-w-0 truncate">
        {location?.label ?? (location ? `${location.latitude}, ${location.longitude}` : t("chat.media.location"))}
      </span>
    </a>
  );
}

function MediaPlaceholder({ label, icon, className }: { label: string; icon?: React.ReactNode; className?: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "mb-1 flex h-40 w-64 items-center justify-center rounded-lg bg-muted text-muted-foreground [&_svg]:size-8",
        className,
      )}
    >
      {icon}
    </div>
  );
}
