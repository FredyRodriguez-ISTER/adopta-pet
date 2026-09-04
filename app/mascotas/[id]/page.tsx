import Link from "next/link";
import { mascotas } from "@/types/mascotas";

interface MascotaDetalleProps {
  params: {
    id: string;
  };
}

export default function MascotaDetalle({
  params,
}: MascotaDetalleProps) {
  const mascota = mascotas.find(
    (item) => item.id === Number(params.id)
  );

  if (!mascota) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-bold">
          Mascota no encontrada
        </h1>

        <Link
          href="/mascotas"
          className="mt-6 inline-block text-green-700 hover:underline"
        >
          Volver al catálogo
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <Link
        href="/mascotas"
        className="mb-8 inline-block text-green-700 hover:underline"
      >
        ← Volver al catálogo
      </Link>

      <div className="grid overflow-hidden rounded-2xl bg-white shadow-lg md:grid-cols-2">
        <img
          src={mascota.imagen_url}
          alt={`Foto de ${mascota.nombre}`}
          className="h-full min-h-[400px] w-full object-cover"
        />

        <div className="p-8">
          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
            {mascota.estado}
          </span>

          <h1 className="mt-4 text-4xl font-bold">
            {mascota.nombre}
          </h1>

          <p className="mt-2 text-xl text-gray-600">
            {mascota.raza}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="rounded-lg bg-gray-100 p-4">
              <p className="text-sm text-gray-500">Edad</p>
              <p className="font-semibold">
                {mascota.edad} años
              </p>
            </div>

            <div className="rounded-lg bg-gray-100 p-4">
              <p className="text-sm text-gray-500">Sexo</p>
              <p className="font-semibold">
                {mascota.sexo}
              </p>
            </div>

            <div className="rounded-lg bg-gray-100 p-4">
              <p className="text-sm text-gray-500">Especie</p>
              <p className="font-semibold">
                {mascota.especie}
              </p>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-bold">
              Sobre {mascota.nombre}
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              {mascota.descripcion}
            </p>
          </div>

          <button
            type="button"
            className="mt-8 w-full rounded-lg bg-green-700 px-5 py-3 font-bold text-white transition hover:bg-green-800"
          >
            Solicitar adopción
          </button>
        </div>
      </div>
    </main>
  );
}