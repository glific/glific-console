export interface Contact {
  id: string;
  name: string;
  phone: string;
  /** WhatsApp opt-in status. */
  status: "valid" | "invalid";
}
