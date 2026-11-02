"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { sendAlmaRequest, sendPilotRequest } from "@/lib/mail";
import { rateLimited, tooFastOrStale, validateAlmaPayload, validatePayload } from "@/lib/antispam";

/*
  Server action for the Alma ADOS pilot program form.
  Sends an e-mail to CONTACT_TO (default info@alma-care.eu) plus a confirmation to the applicant,
  then redirects to the success state. Spam is silently dropped (also redirects, so a bot learns nothing).
*/
export async function submitPilotForm(formData: FormData) {
  const payload = {
    name: String(formData.get("name") ?? "").trim(),
    agency: String(formData.get("agency") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    nurseCount: String(formData.get("nurse-count") ?? ""),
    message: String(formData.get("message") ?? "").trim(),
    consent: formData.get("consent") === "on",
    // honeypot: hidden field that only bots fill in
    web: String(formData.get("web") ?? ""),
    // form render timestamp: submitting within 4 s means a bot
    ts: Number(formData.get("ts") ?? 0),
  };

  if (!payload.name || !payload.agency || !payload.email || !payload.consent) {
    // Native validation catches this first; this is a fallback for submissions without JS
    redirect("/ados#kontakt");
  }

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? h.get("x-real-ip") ?? "unknown").split(",")[0].trim();
  const errors = validatePayload(payload);
  const isSpam = Boolean(payload.web) || tooFastOrStale(payload.ts) || errors.length > 0 || rateLimited(ip);

  if (isSpam) {
    console.warn("[pilot form] dropped as spam", { ip, errors, honeypot: Boolean(payload.web), ts: payload.ts });
  } else {
    try {
      await sendPilotRequest(payload);
    } catch (err) {
      console.error("[pilot form] failed to send e-mail", err, payload);
    }
  }

  redirect("/dakujeme");
}

/*
  Server action for the Alma contact form (home page and product pages): organisation, product of interest, message.
*/
export async function submitAlmaForm(formData: FormData) {
  const payload = {
    name: String(formData.get("name") ?? "").trim(),
    organization: String(formData.get("organization") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    product: String(formData.get("product") ?? ""),
    message: String(formData.get("message") ?? "").trim(),
    consent: formData.get("consent") === "on",
    web: String(formData.get("web") ?? ""),
    ts: Number(formData.get("ts") ?? 0),
  };

  if (!payload.name || !payload.organization || !payload.email || !payload.consent) {
    redirect("/#kontakt");
  }

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? h.get("x-real-ip") ?? "unknown").split(",")[0].trim();
  const errors = validateAlmaPayload(payload);
  const isSpam = Boolean(payload.web) || tooFastOrStale(payload.ts) || errors.length > 0 || rateLimited(ip);

  if (isSpam) {
    console.warn("[alma form] dropped as spam", { ip, errors, honeypot: Boolean(payload.web), ts: payload.ts });
  } else {
    try {
      await sendAlmaRequest(payload);
    } catch (err) {
      console.error("[alma form] failed to send e-mail", err, payload);
    }
  }

  redirect(`/dakujeme?produkt=${encodeURIComponent(payload.product)}`);
}
