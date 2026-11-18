import type { ComponentProps } from "react";
import { NavLink } from "react-router";

/** A route in this app, or a full URL such as a page still served by the current app. */
export type NavLinkTarget = { to: string; end?: boolean } | { href: string };

type NavTargetLinkProps = Omit<ComponentProps<"a">, "href"> & { destination: NavLinkTarget };

export function NavTargetLink({ destination, ...props }: NavTargetLinkProps) {
  if ("href" in destination) return <a href={destination.href} {...props} />;
  return <NavLink to={destination.to} end={destination.end} {...props} />;
}
