"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import type { MascotaEstado } from "@/types";

const especies = ["Perro", "Gato"] as const;
const sexos = ["Macho", "Hembra"] as const;
const estados = ["Disponible", "En proceso", "Adoptado"] as const;

function textValue(formData: FormData, field: string) {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
}

function parseMascotaForm(formData: FormData) {
  const nombre = textValue(formData, "nombre");
  const especie = textValue(formData, "especie");
  const raza = textValue(formData, "raza");
  const edad = Number(textValue(formData, "edad"));
  const sexo = textValue(formData, "sexo");
  const descripcion = textValue(formData, "descripcion");
  const imagenUrl = textValue(formData, "imagenUrl");
  const estado = textValue(formData, "estado");

  if (
    nombre.length < 2 ||
    raza.length < 2 ||
    descripcion.length < 20 ||
    !Number.isInteger(edad) ||
    edad < 0 ||
    edad > 30 ||
    !especies.includes(especie as (typeof especies)[number]) ||
    !sexos.includes(sexo as (typeof sexos)[number]) ||
    (estado && !estados.includes(estado as MascotaEstado))
  ) {
    throw new Error("Revisa los datos de la mascota antes de guardar.");
  }

  if (imagenUrl) {
    try {
      new URL(imagenUrl);
    } catch {
      throw new Error("La imagen debe ser una URL válida.");
    }
  }

  return {
    nombre,
    especie: especie as (typeof especies)[number],
    raza,
    edad,
    sexo: sexo as (typeof sexos)[number],
    descripcion,
    imagen_url: imagenUrl || null,
    estado: (estado || "Disponible") as MascotaEstado,
  };
}

function editPath(id: number, error: string) {
  return `/mascotas/${id}/editar?error=${encodeURIComponent(error)}`;
}

export async function createMascotaAction(formData: FormData) {
  const { user } = await requireRole("refugio");

  let mascota;
  try {
    mascota = parseMascotaForm(formData);
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo validar el formulario.";
    redirect(`/mascotas/nuevo?error=${encodeURIComponent(message)}`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mascotas")
    .insert({ ...mascota, refugio_id: user.id })
    .select("id")
    .single();

  if (error) {
    redirect(`/mascotas/nuevo?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  revalidatePath("/mascotas");
  revalidatePath("/dashboard");
  redirect(`/mascotas/${data.id}`);
}

export async function updateMascotaAction(formData: FormData) {
  const { user } = await requireRole("refugio");
  const id = Number(textValue(formData, "id"));

  if (!Number.isInteger(id) || id < 1) {
    redirect("/dashboard?error=No%20encontramos%20esa%20mascota.");
  }

  let mascota;
  try {
    mascota = parseMascotaForm(formData);
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo validar el formulario.";
    redirect(editPath(id, message));
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("mascotas")
    .update(mascota)
    .eq("id", id)
    .eq("refugio_id", user.id);

  if (error) {
    redirect(editPath(id, error.message));
  }

  revalidatePath("/");
  revalidatePath("/mascotas");
  revalidatePath(`/mascotas/${id}`);
  revalidatePath("/dashboard");
  redirect(`/mascotas/${id}`);
}

export async function deleteMascotaAction(formData: FormData) {
  const { user } = await requireRole("refugio");
  const id = Number(textValue(formData, "id"));

  if (!Number.isInteger(id) || id < 1) {
    redirect("/dashboard?error=No%20encontramos%20esa%20mascota.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("mascotas")
    .delete()
    .eq("id", id)
    .eq("refugio_id", user.id);

  if (error) {
    redirect(`/mascotas/${id}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/");
  revalidatePath("/mascotas");
  revalidatePath("/dashboard");
  redirect("/dashboard?message=Mascota%20eliminada%20correctamente.");
}
