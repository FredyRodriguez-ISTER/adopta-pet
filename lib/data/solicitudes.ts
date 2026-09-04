import { createClient } from "@/lib/supabase/server";
import type { Mascota, Profile, SolicitudAdopcion } from "@/types";

export type SolicitudRecibida = SolicitudAdopcion & {
  mascota: Pick<Mascota, "id" | "nombre" | "imagen_url" | "estado"> | null;
  adoptante: Pick<Profile, "full_name"> | null;
};

export async function getSolicitudesRecibidas() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("solicitudes_adopcion")
    .select(
      "*, mascota:mascotas!solicitudes_adopcion_mascota_id_fkey(id,nombre,imagen_url,estado), adoptante:profiles!solicitudes_adopcion_adoptante_id_fkey(full_name)",
    )
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("No fue posible cargar las solicitudes recibidas.");
  }

  return data as SolicitudRecibida[];
}

export async function getSolicitudesDeAdoptante(adoptanteId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("solicitudes_adopcion")
    .select("*, mascota:mascotas!solicitudes_adopcion_mascota_id_fkey(*)")
    .eq("adoptante_id", adoptanteId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("No fue posible cargar tus solicitudes.");
  }

  return data as (SolicitudAdopcion & { mascota: Mascota | null })[];
}
