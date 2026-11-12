import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + last).toUpperCase() || "?";
}

/** Avatar with initials for a contact or group. */
export function ContactAvatar({ name, size = "default" }: { name: string; size?: "sm" | "default" | "lg" }) {
  return (
    <Avatar size={size}>
      <AvatarFallback aria-hidden="true">{initialsOf(name)}</AvatarFallback>
    </Avatar>
  );
}
