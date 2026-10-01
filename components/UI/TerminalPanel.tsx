import type { HTMLAttributes } from "react";

type TerminalPanelProps = HTMLAttributes<HTMLDivElement>;

export default function TerminalPanel({
  children,
  className = "",
  ...props
}: TerminalPanelProps) {
  return (
    <div className={`terminal-panel ${className}`} {...props}>
      {children}
    </div>
  );
}