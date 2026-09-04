import FiltroMascotas from "@/components/FiltroMascotas";
import { mascotas } from "@/types/mascotas";

export default function MascotasPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-10">
        <p className="font-medium text-green-700">
          🐾 AdoptaPet
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Mascotas en adopción
        </h1>

        <p className="mt-3 max-w-2xl text-gray-600">
          Explora nuestro catálogo y encuentra un compañero
          que esté buscando un hogar responsable.
        </p>
      </div>

      <FiltroMascotas mascotas={mascotas} />
    </main>
  );
}