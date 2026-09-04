import { updateSolicitudAction } from "@/app/actions/solicitudes";
import MascotaImagen from "@/components/MascotaImagen";
import { requireRole } from "@/lib/auth";
import { getSolicitudesRecibidas } from "@/lib/data/solicitudes";

type SolicitudesPageProps = { searchParams: { error?: string; message?: string } };

export default async function SolicitudesPage({ searchParams }: SolicitudesPageProps) {
  await requireRole("refugio");
  const solicitudes = await getSolicitudesRecibidas();

  return (
    <section>
      <h2 className="text-2xl font-bold">Solicitudes recibidas</h2>
      <p className="mt-2 text-gray-600">Revisa con cuidado la información antes de tomar una decisión.</p>
      {searchParams.error ? <p className="mt-6 rounded-lg bg-red-50 p-4 text-red-800" role="alert">{searchParams.error}</p> : null}
      {searchParams.message ? <p className="mt-6 rounded-lg bg-green-50 p-4 text-green-800">{searchParams.message}</p> : null}
      {solicitudes.length === 0 ? <div className="mt-6 rounded-2xl bg-white p-8 text-gray-600 shadow-sm">Aún no has recibido solicitudes.</div> : <div className="mt-8 space-y-5">{solicitudes.map((solicitud) => <article key={solicitud.id} className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-sm md:flex-row"><MascotaImagen src={solicitud.mascota?.imagen_url ?? null} alt={`Foto de ${solicitud.mascota?.nombre ?? "mascota"}`} className="h-28 w-full rounded-xl object-cover md:w-36" /><div className="flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-xl font-bold">{solicitud.mascota?.nombre ?? "Mascota eliminada"}</h3><span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">{solicitud.estado}</span></div><p className="mt-2 text-sm text-gray-500">Solicitante: {solicitud.adoptante?.full_name ?? "Usuario"}</p>{solicitud.mensaje ? <p className="mt-3 rounded-lg bg-gray-50 p-3 text-gray-700">{solicitud.mensaje}</p> : <p className="mt-3 text-sm text-gray-500">No dejó un mensaje.</p>}{solicitud.estado === "Pendiente" ? <form action={updateSolicitudAction} className="mt-4 flex flex-wrap gap-3"><input type="hidden" name="solicitudId" value={solicitud.id} /><button name="estado" value="Aprobada" type="submit" className="rounded-lg bg-green-700 px-4 py-2 font-semibold text-white hover:bg-green-800">Aprobar</button><button name="estado" value="Rechazada" type="submit" className="rounded-lg border border-red-700 px-4 py-2 font-semibold text-red-700 hover:bg-red-50">Rechazar</button></form> : null}</div></article>)}</div>}
    </section>
  );
}
