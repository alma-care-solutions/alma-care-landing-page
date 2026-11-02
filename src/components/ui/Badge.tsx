import { cx } from "@/lib/cx";

type Variant = "status" | "planned" | "neutral" | "onDark" | "success";

const styles: Record<Variant, { wrap: string; dot: string; text: string }> = {
  status: { wrap: "bg-status-warning-soft", dot: "bg-status-warning", text: "text-status-warning" },
  planned: { wrap: "bg-accent-soft", dot: "bg-accent", text: "text-accent-text" },
  neutral: { wrap: "bg-bg-muted", dot: "bg-text-tertiary", text: "text-text-secondary" },
  onDark: {
    wrap: "bg-bg-dark-elevated border border-border-dark",
    dot: "bg-status-warning",
    text: "text-text-inverse",
  },
  success: { wrap: "bg-status-success-soft", dot: "bg-status-success", text: "text-status-success" },
};

export function Badge({
  variant = "status",
  dot = true,
  pulse = false,
  className,
  children,
}: {
  variant?: Variant;
  dot?: boolean;
  /** The dot "breathes": a slow ping ring around it (live status) */
  pulse?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const s = styles[variant];
  return (
    <span
      className={cx(
        "inline-flex items-center gap-2 rounded-full py-1.5 pl-3 pr-3.5 text-label-s whitespace-nowrap",
        s.wrap,
        s.text,
        className,
      )}
    >
      {dot && (
        <span aria-hidden="true" className="relative flex size-2 shrink-0">
          {pulse && <span className={cx("absolute inset-0 rounded-full animate-ping-slow", s.dot)} />}
          <span className={cx("relative size-2 rounded-full", s.dot)} />
        </span>
      )}
      {children}
    </span>
  );
}
