import { EyeIcon, EyeOffIcon } from "lucide-react"
import { type ComponentProps, useState } from "react"
import { useTranslation } from "react-i18next"
import { IconButton } from "@/components/ui/icon-button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

function PasswordInput({
  className,
  ...props
}: Omit<ComponentProps<typeof InputGroupInput>, "type">) {
  const { t } = useTranslation()
  const [shown, setShown] = useState(false)
  return (
    <InputGroup className={className}>
      <InputGroupInput type={shown ? "text" : "password"} {...props} />
      <InputGroupAddon align="inline-end">
        <IconButton
          icon={shown ? EyeOffIcon : EyeIcon}
          label={shown ? t("auth.hidePassword") : t("auth.showPassword")}
          size="xs"
          tooltip={false}
          aria-pressed={shown}
          onClick={() => setShown((value) => !value)}
        />
      </InputGroupAddon>
    </InputGroup>
  )
}

export { PasswordInput }
