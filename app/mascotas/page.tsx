import FiltroMascotas from "@/components/FiltroMascotas";
import { getMascotas } from "@/lib/data/mascotas";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export default async function MascotasPage() {
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

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-10">
        <p className="font-medium text-green-700">🐾 AdoptaPet</p>
        <h1 className="mt-2 text-4xl font-bold">Mascotas en adopción</h1>
        <p className="mt-3 max-w-2xl text-gray-600">
          Explora nuestro catálogo y encuentra un compañero que esté buscando un hogar responsable.
        </p>
      </div>

      {!configured ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
          El catálogo estará disponible cuando Supabase esté configurado. Consulta el README para los pasos.
        </div>
      ) : hasDataError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-900">
          No pudimos cargar el catálogo. Comprueba la conexión y ejecuta el esquema con RLS.
        </div>
      ) : (
        <FiltroMascotas mascotas={mascotas} />
      )}
    </main>
  );
}
