import Link from "next/link";
import { mascotas } from "@/types/mascotas";
import MascotaCard from "@/components/MascotaCard";

export default function Home() {
  const mascotasDestacadas = mascotas.slice(0, 3);

  return (
    <main>
      <section className="bg-green-700 px-6 py-24 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="mb-4 text-lg font-medium">
              🐾 Encuentra a tu nuevo mejor amigo
            </p>

            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
              Una segunda oportunidad comienza contigo
            </h1>

            <p className="mt-6 text-lg text-green-50">
              AdoptaPet conecta a personas que desean adoptar con
              mascotas que buscan un hogar responsable y lleno de amor.
            </p>

            <Link
              href="/mascotas"
              className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-bold text-green-700 transition hover:bg-gray-100"
            >
              Ver mascotas
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10">
          <h2 className="text-3xl font-bold">
            Mascotas destacadas
          </h2>

          <p className="mt-2 text-gray-600">
            Conoce algunas de las mascotas que buscan un nuevo hogar.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {mascotasDestacadas.map((mascota) => (
            <MascotaCard
              key={mascota.id}
              mascota={mascota}
            />
          ))}
        </div>
      </section>
    </main>
  );
}