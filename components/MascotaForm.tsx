import type { Mascota } from "@/types";

type MascotaFormProps = {
  action: (formData: FormData) => void | Promise<void>;
  mascota?: Mascota;
  submitLabel: string;
};

export default function MascotaForm({
  action,
  mascota,
  submitLabel,
}: MascotaFormProps) {
  return (
    <form action={action} className="space-y-6 rounded-2xl bg-white p-6 shadow-md sm:p-8">
      {mascota ? <input type="hidden" name="id" value={mascota.id} /> : null}
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="nombre" className="mb-2 block font-medium">Nombre</label>
          <input id="nombre" name="nombre" defaultValue={mascota?.nombre} minLength={2} required className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-700" />
        </div>
        <div>
          <label htmlFor="raza" className="mb-2 block font-medium">Raza</label>
          <input id="raza" name="raza" defaultValue={mascota?.raza} minLength={2} required className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-700" />
        </div>
        <div>
          <label htmlFor="especie" className="mb-2 block font-medium">Especie</label>
          <select id="especie" name="especie" defaultValue={mascota?.especie ?? "Perro"} className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-700">
            <option value="Perro">Perro</option>
            <option value="Gato">Gato</option>
          </select>
        </div>
        <div>
          <label htmlFor="sexo" className="mb-2 block font-medium">Sexo</label>
          <select id="sexo" name="sexo" defaultValue={mascota?.sexo ?? "Macho"} className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-700">
            <option value="Macho">Macho</option>
            <option value="Hembra">Hembra</option>
          </select>
        </div>
        <div>
          <label htmlFor="edad" className="mb-2 block font-medium">Edad (años)</label>
          <input id="edad" name="edad" type="number" min={0} max={30} defaultValue={mascota?.edad ?? 0} required className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-700" />
        </div>
        <div>
          <label htmlFor="estado" className="mb-2 block font-medium">Estado</label>
          <select id="estado" name="estado" defaultValue={mascota?.estado ?? "Disponible"} className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-700">
            <option value="Disponible">Disponible</option>
            <option value="En proceso">En proceso</option>
            <option value="Adoptado">Adoptado</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="imagenUrl" className="mb-2 block font-medium">URL de la imagen <span className="font-normal text-gray-500">(opcional)</span></label>
        <input id="imagenUrl" name="imagenUrl" type="url" defaultValue={mascota?.imagen_url ?? ""} placeholder="https://..." className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-700" />
      </div>

      <div>
        <label htmlFor="descripcion" className="mb-2 block font-medium">Descripción</label>
        <textarea id="descripcion" name="descripcion" defaultValue={mascota?.descripcion} minLength={20} rows={6} required className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-700" />
        <p className="mt-2 text-sm text-gray-500">Describe su personalidad, cuidados y el hogar ideal.</p>
      </div>

      <button type="submit" className="rounded-lg bg-green-700 px-5 py-3 font-bold text-white transition hover:bg-green-800">
        {submitLabel}
      </button>
    </form>
  );
}
