import { UploadIcon } from "lucide-react"
import { type DragEvent, useId, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"

interface FileDropzoneProps {
  onFiles: (files: File[]) => void
  accept?: string
  multiple?: boolean
  disabled?: boolean
  hint?: string
  className?: string
}

// The whole zone is the <label> of the file input, so click, keyboard and screen readers all work without extra handlers.
export function FileDropzone({
  onFiles,
  accept,
  multiple,
  disabled,
  hint,
  className,
}: FileDropzoneProps) {
  const { t } = useTranslation()
  const id = useId()
  const input = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault()
    setDragging(false)
    if (disabled) return
    const files = [...event.dataTransfer.files]
    if (files.length > 0) onFiles(multiple ? files : files.slice(0, 1))
  }

  return (
    <label
      htmlFor={id}
      data-slot="file-dropzone"
      data-dragging={dragging || undefined}
      onDragOver={(event) => {
        event.preventDefault()
        if (!disabled) setDragging(true)
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-input p-section text-center transition-colors hover:bg-muted has-focus-visible:ring-3 has-focus-visible:ring-ring/50 data-dragging:border-primary data-dragging:bg-primary-soft",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <UploadIcon aria-hidden="true" className="size-6 text-muted-foreground" />
      <span className="text-body font-medium">{t("fileDropzone.title")}</span>
      {hint || accept ? (
        <span className="text-body-sm text-muted-foreground">
          {hint ?? t("fileDropzone.accepts", { types: accept })}
        </span>
      ) : null}
      <input
        ref={input}
        id={id}
        type="file"
        className="sr-only"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(event) => {
          const files = [...(event.target.files ?? [])]
          if (files.length > 0) onFiles(files)
          event.target.value = ""
        }}
      />
    </label>
  )
}
