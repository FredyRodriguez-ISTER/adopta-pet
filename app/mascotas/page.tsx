import MascotaCard from "@/components/MascotaCard";
import { mascotas } from "@/types/mascotas";

export default function MascotasPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">
          Mascotas en adopción
        </h1>

        <p className="mt-2 text-gray-600">
          Encuentra el compañero ideal para tu familia.
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {mascotas.map((mascota) => (
          <MascotaCard
            key={mascota.id}
            mascota={mascota}
          />
        ))}
      </div>
    </main>
  );
}