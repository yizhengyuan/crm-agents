"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_S,
  createSessionToken,
} from "@/server/auth";

function safeNext(input: FormDataEntryValue | null): string {
  if (typeof input !== "string") return "/";
  if (!input.startsWith("/")) return "/";
  if (input.startsWith("//")) return "/";
  if (input.startsWith("/login")) return "/";
  return input;
}

export async function loginAction(formData: FormData): Promise<void> {
  const password = formData.get("password");
  const next = safeNext(formData.get("next"));

  const expected = process.env.APP_ACCESS_PASSWORD;
  const secret = process.env.APP_SESSION_SECRET;
  if (!expected || !secret) {
    redirect("/login?error=misconfigured");
  }

  if (typeof password !== "string" || password !== expected) {
    const params = new URLSearchParams({ error: "invalid" });
    if (next !== "/") params.set("next", next);
    redirect(`/login?${params.toString()}`);
  }

  const token = await createSessionToken(secret);
  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_S,
  });
  redirect(next);
}

export async function logoutAction(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE_NAME);
  redirect("/login");
}
