import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { updateMascotaAction } from "@/app/actions/mascotas";
import MascotaForm from "@/components/MascotaForm";
import { requireRole } from "@/lib/auth";
import { getMascotaById } from "@/lib/data/mascotas";

type EditarMascotaPageProps = {
  params: { id: string };
  searchParams: { error?: string };
};

export const dynamic = "force-dynamic";

export default async function EditarMascotaPage({ params, searchParams }: EditarMascotaPageProps) {
  const { user } = await requireRole("refugio");
  const id = Number(params.id);

  if (!Number.isInteger(id) || id < 1) {
    notFound();
  }

  const mascota = await getMascotaById(id);

  if (!mascota) {
    notFound();
  }

  if (mascota.refugio_id !== user.id) {
    redirect("/dashboard?error=Solo%20puedes%20editar%20tus%20propias%20mascotas.");
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link href={`/mascotas/${mascota.id}`} className="mb-6 inline-block text-green-700 hover:underline">← Volver al detalle</Link>
      <p className="font-medium text-green-700">Publicación del refugio</p>
      <h1 className="mt-2 text-4xl font-bold">Editar a {mascota.nombre}</h1>
      {searchParams.error ? <p className="mt-6 rounded-lg bg-red-50 p-4 text-red-800" role="alert">{searchParams.error}</p> : null}
      <div className="mt-8"><MascotaForm action={updateMascotaAction} mascota={mascota} submitLabel="Guardar cambios" /></div>
    </main>
  );
}
