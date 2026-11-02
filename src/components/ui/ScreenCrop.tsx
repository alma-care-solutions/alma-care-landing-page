import Image from "next/image";
import { cx } from "@/lib/cx";
import { BrowserFrame } from "@/components/ui/Browser";
import { PhoneFrame } from "@/components/ui/Phone";
import { PRODUCT_SCREENS } from "@/lib/screens";

/*
  Whole, uncropped product screen (lib/screens.ts) in its device frame.
  tile: a landscape tile (browser frame with the full web screen, or a phone standing on a muted panel,
        its lower part below the tile edge). hero: the full phone or browser, nothing cut.
*/
export function ProductScreen({
  slug,
  variant = "tile",
  sizes,
  className,
  priority = false,
}: {
  slug: string;
  variant?: "tile" | "hero";
  sizes: string;
  className?: string;
  priority?: boolean;
}) {
  const spec = PRODUCT_SCREENS[slug] ?? PRODUCT_SCREENS.ados;

  if (spec.kind === "web") {
    return (
      <BrowserFrame className={cx("shadow-[0_8px_24px_-10px_rgba(20,23,31,0.25)]", className)}>
        <div className="relative aspect-[2400/1633] w-full">
          <Image src={spec.src} alt={spec.alt} fill sizes={sizes} quality={90} priority={priority} className="object-cover object-top" />
        </div>
      </BrowserFrame>
    );
  }

  if (variant === "hero") {
    return (
      <div className={cx("flex justify-center rounded-16 bg-accent-soft/60 px-6 py-8", className)}>
        <PhoneFrame className="w-[58%] max-w-[300px]">
          <Image src={spec.src} alt={spec.alt} fill sizes={sizes} quality={90} priority={priority} className="object-cover object-top" />
        </PhoneFrame>
      </div>
    );
  }

  return (
    <div className={cx("relative aspect-[2400/1633] w-full overflow-hidden rounded-12 bg-accent-soft/60", className)}>
      <PhoneFrame className="absolute left-1/2 top-[7%] w-[38%] -translate-x-1/2">
        <Image src={spec.src} alt={spec.alt} fill sizes={sizes} quality={90} priority={priority} className="object-cover object-top" />
      </PhoneFrame>
    </div>
  );
}
