import { Fragment, type ReactNode } from "react";

// WhatsApp formatting: *bold*, _italic_, ~strike~, ```monospace```. Markers must hug the text, as in WhatsApp.
const TOKEN = /```([^`]+)```|\*([^*\s](?:[^*]*[^*\s])?)\*|_([^_\s](?:[^_]*[^_\s])?)_|~([^~\s](?:[^~]*[^~\s])?)~/g;

function formatLine(line: string, lineKey: number): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const match of line.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    if (index > last) out.push(line.slice(last, index));
    const key = `${lineKey}-${index}`;
    const [, mono, bold, italic, strike] = match;
    if (mono !== undefined)
      out.push(
        <code key={key} className="font-mono">
          {mono}
        </code>,
      );
    else if (bold !== undefined) out.push(<strong key={key}>{bold}</strong>);
    else if (italic !== undefined) out.push(<em key={key}>{italic}</em>);
    else if (strike !== undefined) out.push(<s key={key}>{strike}</s>);
    last = index + match[0].length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

export function WhatsAppText({ children }: { children: string }) {
  const lines = children.split("\n");
  return (
    <>
      {lines.map((line, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: lines have no identity beyond their position
        <Fragment key={index}>
          {formatLine(line, index)}
          {index < lines.length - 1 ? <br /> : null}
        </Fragment>
      ))}
    </>
  );
}
