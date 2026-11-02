"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { SegmentedOption } from "@/components/ui/SegmentedOption";
import { Checkbox } from "@/components/ui/Checkbox";
import { FormTimestamp } from "@/components/ui/FormTimestamp";
import { submitAlmaForm } from "@/app/actions";
import { PRODUCTS } from "@/lib/nav";
import { cx } from "@/lib/cx";

type Field = "name" | "organization" | "email" | "phone" | "product" | "consent";
type Errors = Partial<Record<Field, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[+\d][\d\s()/-]{5,24}$/;

/* Same rules as on the server (lib/antispam.ts), just with human-readable messages */
function validate(fd: FormData): Errors {
  const errors: Errors = {};
  const name = String(fd.get("name") ?? "").trim();
  const organization = String(fd.get("organization") ?? "").trim();
  const email = String(fd.get("email") ?? "").trim();
  const phone = String(fd.get("phone") ?? "").trim();
  if (name.length < 2) errors.name = "Zadajte meno a priezvisko.";
  if (organization.length < 2) errors.organization = "Zadajte názov organizácie.";
  if (!EMAIL_RE.test(email)) errors.email = "Zadajte platný e-mail, napríklad meno@organizacia.sk.";
  if (phone && !PHONE_RE.test(phone)) errors.phone = "Telefón môže obsahovať len číslice, medzery a znak +.";
  if (!fd.get("product")) errors.product = "Vyberte produkt, ktorý vás zaujíma.";
  if (fd.get("consent") !== "on") errors.consent = "Bez súhlasu vás nemôžeme kontaktovať.";
  return errors;
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      arrow={!pending}
      disabled={pending}
      aria-disabled={pending}
      className="w-full whitespace-normal text-center"
    >
      {pending ? "Odosielam…" : label}
    </Button>
  );
}

/* Contact form of the Alma pages: organisation, product of interest, message */
export function AlmaForm({
  product,
  submitLabel,
  footnote,
}: {
  product: string;
  submitLabel: string;
  footnote: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [summary, setSummary] = useState("");

  const clear = (field: Field) => {
    if (!errors[field]) return;
    setErrors((e) => {
      const next = { ...e };
      delete next[field];
      return next;
    });
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const found = validate(new FormData(form));
    setErrors(found);
    const keys = Object.keys(found) as Field[];
    if (keys.length === 0) {
      setSummary("");
      return; // server action runs
    }
    e.preventDefault();
    const n = keys.length;
    const fieldsLabel = n === 1 ? "jedno pole" : n < 5 ? `${n} polia` : `${n} polí`;
    setSummary(`Skontrolujte, prosím, ${fieldsLabel}.`);
    const first = form.querySelector<HTMLElement>(`[name="${keys[0]}"]`);
    first?.focus();
    first?.scrollIntoView({ block: "center", behavior: "smooth" });
  };

  return (
    <form
      ref={formRef}
      id="alma-form"
      action={submitAlmaForm}
      noValidate
      onSubmit={onSubmit}
      aria-labelledby="alma-form-title"
      className="gsap-reveal relative flex w-full max-w-[544px] flex-col gap-5 rounded-[20px] bg-bg-surface p-5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.25)] sm:p-8 lg:rounded-[24px] lg:p-10"
    >
      {/* Anti-spam honeypot, invisible to humans */}
      <div className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden" aria-hidden="true">
        <label>
          Web
          <input type="text" name="web" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <FormTimestamp />

      <div className="flex flex-col gap-1.5">
        <h3 id="alma-form-title" className="text-h4 text-text-primary">
          Ozvite sa nám
        </h3>
        <p className="text-body-s text-text-secondary">Vyplnenie trvá minútu. Odpovieme do dvoch pracovných dní.</p>
      </div>

      <p className="sr-only" aria-live="assertive">
        {summary}
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Meno a priezvisko"
          name="name"
          autoComplete="name"
          placeholder="Mária Kováčová"
          required
          error={errors.name}
          onChange={() => clear("name")}
        />
        <Input
          label="Organizácia"
          name="organization"
          autoComplete="organization"
          placeholder="Názov organizácie"
          required
          error={errors.organization}
          onChange={() => clear("organization")}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="E-mail"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="meno@organizacia.sk"
          required
          error={errors.email}
          onChange={() => clear("email")}
        />
        <Input
          label="Telefón"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="Nepovinné"
          error={errors.phone}
          onChange={() => clear("phone")}
        />
      </div>

      <fieldset
        className="flex flex-col gap-2"
        aria-invalid={errors.product ? true : undefined}
        aria-describedby={errors.product ? "product-error" : undefined}
        onChange={() => clear("product")}
      >
        <legend className="mb-2 text-label-s text-text-primary">Ktorý produkt vás zaujíma?</legend>
        <div
          className={cx(
            "flex flex-wrap gap-1 rounded-[10px] border bg-bg-muted p-1",
            errors.product ? "border-status-danger" : "border-border-default",
          )}
        >
          {PRODUCTS.map((p) => (
            <SegmentedOption
              key={p.slug}
              name="product"
              value={p.slug}
              required
              defaultChecked={p.slug === product}
              className="basis-[calc(50%-0.125rem)] sm:basis-auto"
            >
              {p.slug === "sluzby-a-pomocky" ? "Služby a pomôcky" : p.name}
            </SegmentedOption>
          ))}
        </div>
        {errors.product && (
          <p id="product-error" className="text-caption text-status-danger">
            {errors.product}
          </p>
        )}
      </fieldset>

      <Textarea
        label="Správa (nepovinné)"
        name="message"
        placeholder="Napíšte, čo vás dnes pri práci najviac zdržiava."
      />

      {/* TODO: final consent wording to be confirmed by a lawyer */}
      <Checkbox
        name="consent"
        required
        error={errors.consent}
        onChange={() => clear("consent")}
        label={
          <>
            Súhlasím so spracovaním osobných údajov na účely kontaktovania ohľadom produktov Alma. Viac v{" "}
            <Link
              href="/ochrana-osobnych-udajov"
              target="_blank"
              className="focus-ring rounded-[3px] text-accent-text underline underline-offset-2 hover:text-accent-strong"
            >
              zásadách ochrany osobných údajov
            </Link>
            .
          </>
        }
      />

      <SubmitButton label={submitLabel} />
      <p className="text-center text-caption text-text-tertiary">{footnote}</p>
    </form>
  );
}
