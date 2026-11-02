"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { DevComment } from "@/app/api/dev-comments/route";

/*
  Development only: review mode. Press the "Komentáre" button (bottom left) or the key K, click anywhere on the page,
  write a note and save it. Notes are pinned to the page and stored in .dev-comments.json via /api/dev-comments,
  so they can be read later (by a person or an agent). Not rendered in production builds.
*/
type Draft = { x: number; y: number; section: string; element: string; snippet: string; clientX: number; clientY: number };

function describe(el: Element): { section: string; element: string; snippet: string } {
  const sectionEl = el.closest("section, header, footer, main, nav, form");
  const section =
    sectionEl?.getAttribute("aria-label") ?? sectionEl?.id ?? sectionEl?.tagName.toLowerCase() ?? "";
  // Short path: tag with id or first two classes, up to the section
  const parts: string[] = [];
  let node: Element | null = el;
  while (node && node !== sectionEl && parts.length < 4) {
    const tag = node.tagName.toLowerCase();
    const id = node.id ? `#${node.id}` : "";
    const cls = Array.from(node.classList)
      .filter((c) => !c.startsWith("gsap") && !/^[a-z]+-\[/.test(c))
      .slice(0, 2)
      .map((c) => `.${c}`)
      .join("");
    parts.unshift(`${tag}${id}${cls}`);
    node = node.parentElement;
  }
  const text = (el.textContent ?? "").replace(/\s+/g, " ").trim();
  return { section, element: parts.join(" > "), snippet: text.slice(0, 120) };
}

export function CommentMode() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [comments, setComments] = useState<DevComment[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [showDone, setShowDone] = useState(false);
  const [hover, setHover] = useState<DOMRect | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/dev-comments", { cache: "no-store" });
      if (res.ok) setComments((await res.json()) as DevComment[]);
    } catch {
      /* dev only */
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh, pathname]);

  // K toggles the mode, Escape closes the draft
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (e.key === "Escape") {
        setDraft(null);
        setOpen(null);
        return;
      }
      if (!typing && (e.key === "k" || e.key === "K")) setActive((a) => !a);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // In the mode: highlight the element under the cursor, a click opens the draft
  useEffect(() => {
    if (!active) {
      setHover(null);
      return;
    }
    const onMove = (e: MouseEvent) => {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (!el || el.closest("[data-dev-comments]")) {
        setHover(null);
        return;
      }
      setHover(el.getBoundingClientRect());
    };
    const onClick = (e: MouseEvent) => {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (!el || el.closest("[data-dev-comments]")) return;
      e.preventDefault();
      e.stopPropagation();
      const info = describe(el);
      setOpen(null);
      setDraft({
        x: e.pageX,
        y: e.pageY,
        clientX: e.clientX,
        clientY: e.clientY,
        ...info,
      });
      window.setTimeout(() => textareaRef.current?.focus(), 30);
    };
    document.addEventListener("mousemove", onMove);
    document.addEventListener("click", onClick, true);
    document.body.style.cursor = "crosshair";
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("click", onClick, true);
      document.body.style.cursor = "";
    };
  }, [active]);

  const saveDraft = async () => {
    const note = textareaRef.current?.value.trim();
    if (!draft || !note) return;
    await fetch("/api/dev-comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        page: pathname,
        viewport: window.innerWidth,
        section: draft.section,
        element: draft.element,
        snippet: draft.snippet,
        x: draft.x,
        y: draft.y,
        note,
      }),
    });
    setDraft(null);
    await refresh();
  };

  const toggleDone = async (c: DevComment) => {
    await fetch("/api/dev-comments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: c.id, done: !c.done }),
    });
    await refresh();
  };

  const remove = async (c: DevComment) => {
    await fetch("/api/dev-comments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: c.id }),
    });
    setOpen(null);
    await refresh();
  };

  const here = comments.filter((c) => c.page === pathname && (showDone || !c.done));
  const openCount = comments.filter((c) => !c.done).length;

  return (
    <div data-dev-comments="" className="contents">
      {/* Toggle */}
      <div className="fixed bottom-5 left-20 z-[90] flex items-center gap-2">
        <button
          type="button"
          onClick={() => setActive((a) => !a)}
          aria-pressed={active}
          title="Režim komentárov (klávesa K)"
          className={
            "flex h-10 items-center gap-2 rounded-full px-4 text-[13px] font-semibold shadow-[0_8px_24px_rgba(20,23,31,0.25)] transition-colors " +
            (active ? "bg-status-danger text-white" : "bg-bg-dark text-white hover:bg-bg-dark-elevated")
          }
        >
          <span className="inline-block size-2 rounded-full bg-current" />
          {active ? "Klikni, kde treba zmenu" : "Komentáre"}
          {openCount > 0 && (
            <span className="rounded-full bg-white/20 px-1.5 text-[11px] tabular-nums">{openCount}</span>
          )}
        </button>
        {comments.length > 0 && (
          <button
            type="button"
            onClick={() => setShowDone((s) => !s)}
            className="h-10 rounded-full bg-bg-surface px-3 text-[12px] text-text-secondary shadow-[0_8px_24px_rgba(20,23,31,0.18)] ring-1 ring-border-default"
          >
            {showDone ? "Skryť hotové" : "Aj hotové"}
          </button>
        )}
      </div>

      {/* Hover outline */}
      {active && hover && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed z-[85] rounded-[4px] ring-2 ring-status-danger/80"
          style={{ left: hover.left, top: hover.top, width: hover.width, height: hover.height }}
        />
      )}

      {/* Pins */}
      {here.map((c, i) => (
        <div key={c.id} className="absolute z-[86]" style={{ left: c.x, top: c.y }}>
          <button
            type="button"
            onClick={() => setOpen(open === c.id ? null : c.id)}
            title={c.note}
            className={
              "flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[12px] font-bold text-white shadow-[0_6px_16px_rgba(20,23,31,0.3)] ring-2 ring-white " +
              (c.done ? "bg-status-success" : "bg-status-danger")
            }
          >
            {i + 1}
          </button>
          {open === c.id && (
            <div className="absolute left-4 top-2 w-[300px] rounded-12 bg-bg-surface p-3 text-[13px] text-text-primary shadow-[0_16px_40px_rgba(20,23,31,0.3)] ring-1 ring-border-default">
              <p className="whitespace-pre-wrap">{c.note}</p>
              <p className="mt-2 text-[11px] text-text-tertiary">
                {c.section || "stránka"} · {c.viewport} px · {new Date(c.createdAt).toLocaleString("sk-SK")}
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => toggleDone(c)}
                  className="rounded-8 bg-bg-muted px-2.5 py-1 text-[12px] font-medium hover:bg-border-default"
                >
                  {c.done ? "Znova otvoriť" : "Hotové"}
                </button>
                <button
                  type="button"
                  onClick={() => remove(c)}
                  className="rounded-8 px-2.5 py-1 text-[12px] text-status-danger hover:bg-status-danger-soft"
                >
                  Zmazať
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Draft */}
      {draft && (
        <div
          className="fixed z-[95] w-[320px] rounded-12 bg-bg-surface p-3 shadow-[0_16px_40px_rgba(20,23,31,0.3)] ring-1 ring-border-default"
          style={{
            left: Math.min(draft.clientX + 12, window.innerWidth - 336),
            top: Math.min(draft.clientY + 12, window.innerHeight - 220),
          }}
        >
          <p className="mb-1 truncate text-[11px] text-text-tertiary" title={draft.element}>
            {draft.section || "stránka"} · {draft.snippet ? `„${draft.snippet.slice(0, 50)}…“` : draft.element}
          </p>
          <textarea
            ref={textareaRef}
            rows={4}
            placeholder="Čo treba zmeniť?"
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") void saveDraft();
            }}
            className="w-full resize-none rounded-8 border border-border-default bg-bg-surface p-2 text-[13px] text-text-primary outline-none focus:border-accent"
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[11px] text-text-tertiary">⌘ Enter uloží</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDraft(null)}
                className="rounded-8 px-2.5 py-1 text-[12px] text-text-secondary hover:bg-bg-muted"
              >
                Zrušiť
              </button>
              <button
                type="button"
                onClick={() => void saveDraft()}
                className="rounded-8 bg-accent px-3 py-1 text-[12px] font-semibold text-white hover:bg-accent-strong"
              >
                Uložiť
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
