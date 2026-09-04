import Link from "next/link";
import { deleteMascotaAction } from "@/app/actions/mascotas";
import MascotaImagen from "@/components/MascotaImagen";
import { requireUser } from "@/lib/auth";
import { getFavoritosDeUsuario, getMascotasDeRefugio } from "@/lib/data/mascotas";
import { getSolicitudesDeAdoptante, getSolicitudesRecibidas } from "@/lib/data/solicitudes";

type DashboardPageProps = { searchParams: { error?: string; message?: string } };

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const { user, profile } = await requireUser();
  const isRefugio = profile?.role === "refugio";

  const [mascotas, solicitudes, favoritos] = await Promise.all([
    isRefugio ? getMascotasDeRefugio(user.id) : Promise.resolve([]),
    isRefugio ? getSolicitudesRecibidas() : getSolicitudesDeAdoptante(user.id),
    isRefugio ? Promise.resolve([]) : getFavoritosDeUsuario(user.id),
  ]);

  return (
    <>
      {searchParams.error ? <p className="mb-6 rounded-lg bg-red-50 p-4 text-red-800" role="alert">{searchParams.error}</p> : null}
      {searchParams.message ? <p className="mb-6 rounded-lg bg-green-50 p-4 text-green-800">{searchParams.message}</p> : null}

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-green-700 p-6 text-white"><p className="text-sm text-green-100">{isRefugio ? "Mascotas publicadas" : "Favoritos guardados"}</p><p className="mt-2 text-4xl font-bold">{isRefugio ? mascotas.length : favoritos.length}</p></div>
        <div className="rounded-2xl bg-white p-6 shadow-sm"><p className="text-sm text-gray-500">{isRefugio ? "Solicitudes recibidas" : "Solicitudes enviadas"}</p><p className="mt-2 text-4xl font-bold">{solicitudes.length}</p></div>
        <div className="rounded-2xl bg-white p-6 shadow-sm"><p className="text-sm text-gray-500">Rol de la cuenta</p><p className="mt-2 text-2xl font-bold capitalize">{profile?.role ?? "Sin perfil"}</p></div>
      </section>

      {isRefugio ? (
        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between gap-4"><h2 className="text-2xl font-bold">Mis mascotas</h2><Link href="/mascotas/nuevo" className="font-semibold text-green-700 hover:underline">+ Publicar una mascota</Link></div>
          {mascotas.length === 0 ? <div className="rounded-2xl bg-white p-8 text-gray-600 shadow-sm">Aún no has publicado mascotas.</div> : <div className="grid gap-5 md:grid-cols-2">{mascotas.map((mascota) => <article key={mascota.id} className="flex gap-4 rounded-2xl bg-white p-4 shadow-sm"><MascotaImagen src={mascota.imagen_url} alt={`Foto de ${mascota.nombre}`} className="h-28 w-28 rounded-xl object-cover" /><div className="min-w-0 flex-1"><p className="text-sm font-medium text-green-700">{mascota.estado}</p><h3 className="truncate text-xl font-bold">{mascota.nombre}</h3><p className="text-sm text-gray-600">{mascota.raza}</p><div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold"><Link href={`/mascotas/${mascota.id}/editar`} className="text-green-700 hover:underline">Editar</Link><form action={deleteMascotaAction}><input type="hidden" name="id" value={mascota.id} /><button type="submit" className="text-red-700 hover:underline">Eliminar</button></form></div></div></article>)}</div>}
        </section>
      ) : (
        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between gap-4"><h2 className="text-2xl font-bold">Mis solicitudes recientes</h2><Link href="/mascotas" className="font-semibold text-green-700 hover:underline">Explorar mascotas</Link></div>
          {solicitudes.length === 0 ? <div className="rounded-2xl bg-white p-8 text-gray-600 shadow-sm">Aún no has enviado solicitudes.</div> : <div className="space-y-3">{solicitudes.map((solicitud) => <article key={solicitud.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-5 shadow-sm"><div><h3 className="font-bold">{solicitud.mascota?.nombre ?? "Mascota"}</h3><p className="text-sm text-gray-600">Enviada el {new Intl.DateTimeFormat("es-EC", { dateStyle: "medium" }).format(new Date(solicitud.created_at))}</p></div><span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">{solicitud.estado}</span></article>)}</div>}
        </section>
      )}
    </>
  );
}
