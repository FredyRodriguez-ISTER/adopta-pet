import Link from "next/link";
import { notFound } from "next/navigation";
import FavoritoForm from "@/components/FavoritoForm";
import MascotaImagen from "@/components/MascotaImagen";
import SolicitudAdopcionForm from "@/components/SolicitudAdopcionForm";
import { getCurrentUser } from "@/lib/auth";
import { getMascotaById, isFavorita } from "@/lib/data/mascotas";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type MascotaDetalleProps = {
  params: { id: string };
  searchParams: { error?: string; message?: string };
};

export const dynamic = "force-dynamic";

export default async function MascotaDetalle({ params, searchParams }: MascotaDetalleProps) {
  const id = Number(params.id);

  if (!Number.isInteger(id) || id < 1 || !isSupabaseConfigured()) {
    notFound();
  }

  const mascota = await getMascotaById(id);

  if (!mascota) {
    notFound();
  }

  const currentUser = await getCurrentUser();
  const isAdoptante = currentUser?.profile?.role === "adoptante";
  const isOwner = currentUser?.user.id === mascota.refugio_id;
  const esFavorita = isAdoptante && currentUser
    ? await isFavorita(mascota.id, currentUser.user.id)
    : false;

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Link href="/mascotas" className="mb-8 inline-block text-green-700 hover:underline">← Volver al catálogo</Link>

      {searchParams.error ? <p className="mb-6 rounded-lg bg-red-50 p-4 text-red-800" role="alert">{searchParams.error}</p> : null}
      {searchParams.message ? <p className="mb-6 rounded-lg bg-green-50 p-4 text-green-800">{searchParams.message}</p> : null}

      <article className="grid overflow-hidden rounded-2xl bg-white shadow-lg md:grid-cols-2">
        <MascotaImagen src={mascota.imagen_url} alt={`Foto de ${mascota.nombre}`} className="h-full min-h-[400px] w-full object-cover" />

        <div className="p-8">
          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">{mascota.estado}</span>
          <h1 className="mt-4 text-4xl font-bold">{mascota.nombre}</h1>
          <p className="mt-2 text-xl text-gray-600">{mascota.raza}</p>
          <p className="mt-2 text-sm text-gray-500">Publicado por {mascota.refugio?.full_name ?? "un refugio"}</p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-gray-100 p-3"><p className="text-sm text-gray-500">Edad</p><p className="font-semibold">{mascota.edad} años</p></div>
            <div className="rounded-lg bg-gray-100 p-3"><p className="text-sm text-gray-500">Sexo</p><p className="font-semibold">{mascota.sexo}</p></div>
            <div className="rounded-lg bg-gray-100 p-3"><p className="text-sm text-gray-500">Especie</p><p className="font-semibold">{mascota.especie}</p></div>
          </div>

          <section className="mt-8">
            <h2 className="text-xl font-bold">Sobre {mascota.nombre}</h2>
            <p className="mt-3 leading-7 text-gray-600">{mascota.descripcion}</p>
          </section>

          <div className="mt-8 space-y-3">
            {isOwner ? <Link href={`/mascotas/${mascota.id}/editar`} className="block w-full rounded-lg bg-green-700 px-5 py-3 text-center font-bold text-white transition hover:bg-green-800">Editar publicación</Link> : null}
            {isAdoptante && mascota.estado === "Disponible" ? <SolicitudAdopcionForm mascotaId={mascota.id} /> : null}
            {isAdoptante ? <FavoritoForm mascotaId={mascota.id} esFavorita={esFavorita} /> : null}
            {!currentUser ? <Link href={`/login?next=/mascotas/${mascota.id}`} className="block w-full rounded-lg bg-green-700 px-5 py-3 text-center font-bold text-white transition hover:bg-green-800">Inicia sesión para solicitar adopción</Link> : null}
          </div>
        </div>
      </article>
    </main>
  );
}
