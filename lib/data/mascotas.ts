import { createClient } from "@/lib/supabase/server";
import type { Mascota, Profile } from "@/types";

export type MascotaConRefugio = Mascota & {
  refugio: Pick<Profile, "full_name"> | null;
};

export async function getMascotas() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mascotas")
    .select("*, refugio:profiles!mascotas_refugio_id_fkey(full_name)")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("No fue posible cargar las mascotas.");
  }

  return data as MascotaConRefugio[];
}

export async function getMascotaById(id: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mascotas")
    .select("*, refugio:profiles!mascotas_refugio_id_fkey(full_name)")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error("No fue posible cargar la mascota.");
  }

  return data as MascotaConRefugio | null;
}

export async function getMascotasDeRefugio(refugioId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mascotas")
    .select("*")
    .eq("refugio_id", refugioId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("No fue posible cargar tus publicaciones.");
  }

  return data;
}

export async function getFavoritosDeUsuario(usuarioId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("favoritos")
    .select("mascota:mascotas(*)")
    .eq("usuario_id", usuarioId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("No fue posible cargar tus favoritos.");
  }

  return data
    .map((favorite) => favorite.mascota)
    .filter((mascota): mascota is Mascota => mascota !== null);
}

export async function isFavorita(mascotaId: number, usuarioId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("favoritos")
    .select("mascota_id")
    .eq("mascota_id", mascotaId)
    .eq("usuario_id", usuarioId)
    .maybeSingle();

  if (error) {
    throw new Error("No fue posible comprobar los favoritos.");
  }

  return Boolean(data);
}
