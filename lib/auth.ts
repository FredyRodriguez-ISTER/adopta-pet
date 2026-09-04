import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "./supabase/config";
import { createClient } from "./supabase/server";
import type { Profile, UserRole } from "@/types";

export type CurrentUser = {
  user: User;
  profile: Profile | null;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return { user, profile };
}

export async function requireUser() {
  if (!isSupabaseConfigured()) {
    redirect("/login?error=Configura%20Supabase%20antes%20de%20iniciar%20sesión.");
  }

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login?error=Inicia%20sesión%20para%20continuar.");
  }

  return currentUser;
}

export async function requireRole(role: UserRole) {
  const currentUser = await requireUser();

  if (currentUser.profile?.role !== role) {
    redirect("/dashboard?error=No%20tienes%20permiso%20para%20esa%20acción.");
  }

  return currentUser;
}
