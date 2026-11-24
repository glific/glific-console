import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

// The backend allows one code per 30 seconds from the same address.
const COOLDOWN_SECONDS = 30;

interface ResendCodeProps {
  onResend: () => Promise<void>;
}

export function ResendCode({ onResend }: ResendCodeProps) {
  const { t } = useTranslation();
  const [wait, setWait] = useState(COOLDOWN_SECONDS);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (wait <= 0) return;
    const timer = setTimeout(() => setWait((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [wait]);

  return (
    <Button
      type="button"
      variant="link"
      size="sm"
      className="h-auto self-start p-0"
      disabled={wait > 0 || sending}
      onClick={async () => {
        setSending(true);
        try {
          await onResend();
        } finally {
          setSending(false);
          setWait(COOLDOWN_SECONDS);
        }
      }}
    >
      {wait > 0 ? t("auth.code.resendIn", { seconds: wait }) : t("auth.code.resend")}
    </Button>
  );
}
