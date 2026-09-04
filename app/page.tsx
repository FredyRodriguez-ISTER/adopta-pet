import Link from "next/link";
import MascotaCard from "@/components/MascotaCard";
import { getMascotas } from "@/lib/data/mascotas";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export default async function Home() {
  const configured = isSupabaseConfigured();
  let mascotas: Awaited<ReturnType<typeof getMascotas>> = [];
  let hasDataError = false;

  if (configured) {
    try {
      mascotas = await getMascotas();
    } catch {
      hasDataError = true;
    }
  }

  const mascotasDestacadas = mascotas
    .filter((mascota) => mascota.estado === "Disponible")
    .slice(0, 3);

  return (
    <main>
      <section
        className="relative overflow-hidden bg-cover bg-center px-6 py-24 text-white"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1800&q=85')",
        }}
      >
        <div className="absolute inset-0 bg-green-950/70" />
        <div className="relative mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="mb-4 text-lg font-medium">🐾 Encuentra a tu nuevo mejor amigo</p>
            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
              Una segunda oportunidad comienza contigo
            </h1>
            <p className="mt-6 text-lg text-green-50">
              AdoptaPet conecta a personas que desean adoptar con mascotas que buscan un hogar responsable y lleno de amor.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/mascotas" className="rounded-lg bg-white px-6 py-3 font-bold text-green-800 transition hover:bg-green-50">
                Ver mascotas
              </Link>
              <Link href="/register" className="rounded-lg border border-white px-6 py-3 font-bold text-white transition hover:bg-white/10">
                Crear una cuenta
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-medium text-green-700">Historias que esperan comenzar</p>
            <h2 className="mt-2 text-3xl font-bold">Mascotas destacadas</h2>
            <p className="mt-2 text-gray-600">Conoce algunas mascotas que buscan un hogar.</p>
          </div>
          <Link href="/mascotas" className="font-semibold text-green-700 hover:underline">Ver el catálogo completo →</Link>
        </div>

        {!configured ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
            <h3 className="font-bold">Conecta el catálogo a Supabase</h3>
            <p className="mt-1 text-sm">Agrega las variables de <code>.env.example</code> en <code>.env.local</code> y ejecuta <code>supabase/schema.sql</code> en el SQL Editor.</p>
          </div>
        ) : hasDataError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-900">
            No pudimos cargar las mascotas. Verifica la conexión y las políticas RLS de Supabase.
          </div>
        ) : mascotasDestacadas.length === 0 ? (
          <div className="rounded-2xl bg-white p-10 text-center shadow-md">
            <h3 className="text-xl font-bold">Pronto habrá nuevas historias aquí</h3>
            <p className="mt-2 text-gray-600">Los refugios pueden iniciar sesión y publicar una mascota.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {mascotasDestacadas.map((mascota) => <MascotaCard key={mascota.id} mascota={mascota} />)}
          </div>
        )}
      </section>
    </main>
  );
}
