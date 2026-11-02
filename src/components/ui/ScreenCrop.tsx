import Image from "next/image";
import { cx } from "@/lib/cx";
import type { ScreenSpec } from "@/lib/screens";

/* A real screenshot cropped and zoomed around its focus point (lib/screens.ts) */
export function ScreenCrop({
  spec,
  sizes,
  className,
  priority = false,
}: {
  spec: ScreenSpec;
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  const [fx, fy] = spec.focus;
  return (
    <div className={cx("relative overflow-hidden bg-bg-muted", className)}>
      <Image
        src={spec.src}
        alt={spec.alt}
        fill
        sizes={sizes}
        quality={90}
        priority={priority}
        className="object-cover"
        style={{
          objectPosition: `${fx}% ${fy}%`,
          transform: spec.zoom !== 1 ? `scale(${spec.zoom})` : undefined,
          transformOrigin: `${fx}% ${fy}%`,
        }}
      />
    </div>
  );
}
