import Link from "next/link";
import { createMascotaAction } from "@/app/actions/mascotas";
import MascotaForm from "@/components/MascotaForm";
import { requireRole } from "@/lib/auth";

type NuevaMascotaPageProps = { searchParams: { error?: string } };

export const dynamic = "force-dynamic";

export default async function NuevaMascotaPage({ searchParams }: NuevaMascotaPageProps) {
  await requireRole("refugio");

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/dashboard" className="mb-6 inline-block text-green-700 hover:underline">← Volver al panel</Link>
      <p className="font-medium text-green-700">Publicación del refugio</p>
      <h1 className="mt-2 text-4xl font-bold">Publicar una mascota</h1>
      <p className="mt-3 text-gray-600">Completa la información para que una familia pueda conocerla mejor.</p>
      {searchParams.error ? <p className="mt-6 rounded-lg bg-red-50 p-4 text-red-800" role="alert">{searchParams.error}</p> : null}
      <div className="mt-8"><MascotaForm action={createMascotaAction} submitLabel="Publicar mascota" /></div>
    </main>
  );
}
