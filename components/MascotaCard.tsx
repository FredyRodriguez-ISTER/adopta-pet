import Link from "next/link";
import { Mascota } from "@/types";

interface MascotaCardProps {
  mascota: Mascota;
}

export default function MascotaCard({
  mascota,
}: MascotaCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl">
      <img
        src={mascota.imagen_url}
        alt={`Foto de ${mascota.nombre}`}
        className="h-64 w-full object-cover"
      />

      <div className="p-5">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {mascota.nombre}
          </h2>

          <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
            {mascota.estado}
          </span>
        </div>

        <p className="text-gray-600">
          {mascota.raza}
        </p>

        <div className="mt-3 flex gap-4 text-sm text-gray-500">
          <span>{mascota.edad} años</span>
          <span>{mascota.sexo}</span>
          <span>{mascota.especie}</span>
        </div>

        <Link
          href={`/mascotas/${mascota.id}`}
          className="mt-5 block rounded-lg bg-green-700 px-4 py-3 text-center font-semibold text-white transition hover:bg-green-800"
        >
          Ver detalles
        </Link>
      </div>
    </article>
  );
}