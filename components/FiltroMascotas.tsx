"use client";

import { useState } from "react";
import { Mascota } from "@/types";
import MascotaCard from "./MascotaCard";

interface FiltroMascotasProps {
  mascotas: Mascota[];
}

export default function FiltroMascotas({
  mascotas,
}: FiltroMascotasProps) {
  const [busqueda, setBusqueda] = useState("");
  const [especie, setEspecie] = useState("Todas");
  const [sexo, setSexo] = useState("Todos");

  const mascotasFiltradas = mascotas.filter((mascota) => {
    const coincideBusqueda =
      mascota.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      mascota.raza.toLowerCase().includes(busqueda.toLowerCase());

    const coincideEspecie =
      especie === "Todas" || mascota.especie === especie;

    const coincideSexo =
      sexo === "Todos" || mascota.sexo === sexo;

    return coincideBusqueda && coincideEspecie && coincideSexo;
  });

  return (
    <div>
      <div className="mb-10 rounded-2xl bg-white p-6 shadow-md">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label
              htmlFor="busqueda"
              className="mb-2 block font-medium"
            >
              Buscar
            </label>

            <input
              id="busqueda"
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Nombre o raza..."
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-700"
            />
          </div>

          <div>
            <label
              htmlFor="especie"
              className="mb-2 block font-medium"
            >
              Especie
            </label>

            <select
              id="especie"
              value={especie}
              onChange={(e) => setEspecie(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-700"
            >
              <option value="Todas">Todas</option>
              <option value="Perro">Perros</option>
              <option value="Gato">Gatos</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="sexo"
              className="mb-2 block font-medium"
            >
              Sexo
            </label>

            <select
              id="sexo"
              value={sexo}
              onChange={(e) => setSexo(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-700"
            >
              <option value="Todos">Todos</option>
              <option value="Macho">Machos</option>
              <option value="Hembra">Hembras</option>
            </select>
          </div>
        </div>
      </div>

      {mascotasFiltradas.length === 0 ? (
        <div className="rounded-2xl bg-white p-10 text-center shadow-md">
          <p className="text-lg text-gray-600">
            No encontramos mascotas con esos criterios.
          </p>
        </div>
      ) : (
        <>
          <p className="mb-6 text-gray-600">
            {mascotasFiltradas.length}{" "}
            {mascotasFiltradas.length === 1
              ? "mascota encontrada"
              : "mascotas encontradas"}
          </p>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {mascotasFiltradas.map((mascota) => (
              <MascotaCard
                key={mascota.id}
                mascota={mascota}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}