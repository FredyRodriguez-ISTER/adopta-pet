"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export async function toggleFavoritoAction(formData: FormData) {
  const { user } = await requireRole("adoptante");
  const mascotaIdValue = formData.get("mascotaId");
  const mascotaId = typeof mascotaIdValue === "string" ? Number(mascotaIdValue) : NaN;

  if (!Number.isInteger(mascotaId) || mascotaId < 1) {
    throw new Error("La mascota seleccionada no es válida.");
  }

  const supabase = await createClient();
  const { data: favorito, error: lookupError } = await supabase
    .from("favoritos")
    .select("mascota_id")
    .eq("mascota_id", mascotaId)
    .eq("usuario_id", user.id)
    .maybeSingle();

  if (lookupError) {
    throw new Error("No fue posible actualizar tus favoritos.");
  }

  if (favorito) {
    const { error } = await supabase
      .from("favoritos")
      .delete()
      .eq("mascota_id", mascotaId)
      .eq("usuario_id", user.id);

    if (error) {
      throw new Error("No fue posible actualizar tus favoritos.");
    }
  } else {
    const favoritoParaCrear: Database["public"]["Tables"]["favoritos"]["Insert"] = {
      mascota_id: mascotaId,
      usuario_id: user.id,
    };
    const { error } = await supabase.from("favoritos").insert(favoritoParaCrear);

    if (error) {
      throw new Error("No fue posible actualizar tus favoritos.");
    }
  }

  revalidatePath(`/mascotas/${mascotaId}`);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/favoritos");
}
