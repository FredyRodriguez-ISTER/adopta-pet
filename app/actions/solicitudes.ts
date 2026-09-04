"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { SolicitudEstado } from "@/types";

function textValue(formData: FormData, field: string) {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
}

export async function createSolicitudAction(formData: FormData) {
  const { user } = await requireRole("adoptante");
  const mascotaId = Number(textValue(formData, "mascotaId"));
  const mensaje = textValue(formData, "mensaje");

  if (!Number.isInteger(mascotaId) || mascotaId < 1 || mensaje.length > 1000) {
    redirect("/mascotas?error=La%20solicitud%20no%20es%20válida.");
  }

  const supabase = await createClient();
  const { data: mascota, error: mascotaError } = await supabase
    .from("mascotas")
    .select("id, estado, refugio_id")
    .eq("id", mascotaId)
    .maybeSingle();

  if (mascotaError || !mascota || mascota.estado !== "Disponible" || mascota.refugio_id === user.id) {
    redirect(`/mascotas/${mascotaId}?error=Esta%20mascota%20no%20está%20disponible%20para%20solicitar.`);
  }

  const { error } = await supabase.from("solicitudes_adopcion").insert({
    mascota_id: mascotaId,
    adoptante_id: user.id,
    mensaje: mensaje || null,
  });

  if (error) {
    const message = error.code === "23505"
      ? "Ya enviaste una solicitud para esta mascota."
      : error.message;
    redirect(`/mascotas/${mascotaId}?error=${encodeURIComponent(message)}`);
  }

  revalidatePath(`/mascotas/${mascotaId}`);
  revalidatePath("/dashboard");
  redirect(`/mascotas/${mascotaId}?message=Tu%20solicitud%20fue%20enviada.`);
}

export async function updateSolicitudAction(formData: FormData) {
  const { user } = await requireRole("refugio");
  const solicitudId = Number(textValue(formData, "solicitudId"));
  const estado = textValue(formData, "estado");

  if (
    !Number.isInteger(solicitudId) ||
    !["Aprobada", "Rechazada"].includes(estado)
  ) {
    redirect("/dashboard/solicitudes?error=La%20actualización%20no%20es%20válida.");
  }

  const supabase = await createClient();
  const { data: solicitud, error: solicitudError } = await supabase
    .from("solicitudes_adopcion")
    .select("mascota_id")
    .eq("id", solicitudId)
    .maybeSingle();

  if (solicitudError || !solicitud) {
    redirect("/dashboard/solicitudes?error=No%20encontramos%20esa%20solicitud.");
  }

  const { error } = await supabase
    .from("solicitudes_adopcion")
    .update({ estado: estado as SolicitudEstado })
    .eq("id", solicitudId);

  if (error) {
    redirect(`/dashboard/solicitudes?error=${encodeURIComponent(error.message)}`);
  }

  if (estado === "Aprobada") {
    await supabase
      .from("mascotas")
      .update({ estado: "En proceso" })
      .eq("id", solicitud.mascota_id)
      .eq("refugio_id", user.id);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/solicitudes");
  revalidatePath(`/mascotas/${solicitud.mascota_id}`);
  redirect("/dashboard/solicitudes?message=Solicitud%20actualizada.");
}
