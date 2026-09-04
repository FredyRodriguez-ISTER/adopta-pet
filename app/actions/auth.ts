"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function valueOf(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function redirectWith(path: string, key: "error" | "message", message: string) {
  redirect(`${path}?${key}=${encodeURIComponent(message)}`);
}

export async function signUpAction(formData: FormData) {
  const fullName = valueOf(formData, "fullName");
  const email = valueOf(formData, "email").toLowerCase();
  const password = valueOf(formData, "password");
  const role = valueOf(formData, "role");

  if (fullName.length < 2 || !email || password.length < 8) {
    redirectWith(
      "/register",
      "error",
      "Completa tu nombre, correo y una contraseña de al menos 8 caracteres.",
    );
  }

  if (role !== "adoptante" && role !== "refugio") {
    redirectWith("/register", "error", "Selecciona un tipo de cuenta válido.");
  }

  const supabase = await createClient();
  const origin = headers().get("origin") ?? "http://localhost:3000";
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    redirectWith("/register", "error", error.message);
  }

  if (data.session) {
    redirect("/dashboard?message=Tu%20cuenta%20está%20lista.");
  }

  redirectWith(
    "/login",
    "message",
    "Revisa tu correo para confirmar la cuenta y luego inicia sesión.",
  );
}

export async function signInAction(formData: FormData) {
  const email = valueOf(formData, "email").toLowerCase();
  const password = valueOf(formData, "password");
  const requestedNext = valueOf(formData, "next");
  const nextPath = requestedNext.startsWith("/") && !requestedNext.startsWith("//")
    ? requestedNext
    : "/dashboard";

  if (!email || !password) {
    redirectWith("/login", "error", "Ingresa tu correo y contraseña.");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirectWith("/login", "error", "Correo o contraseña incorrectos.");
  }

  redirect(nextPath);
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
