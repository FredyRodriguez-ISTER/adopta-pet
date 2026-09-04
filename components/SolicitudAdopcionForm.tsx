import { createSolicitudAction } from "@/app/actions/solicitudes";

export default function SolicitudAdopcionForm({ mascotaId }: { mascotaId: number }) {
  return (
    <form action={createSolicitudAction} className="mt-8 rounded-xl bg-green-50 p-5">
      <input type="hidden" name="mascotaId" value={mascotaId} />
      <label htmlFor="mensaje" className="block font-semibold text-green-950">
        Cuéntale al refugio por qué quieres adoptar
      </label>
      <textarea id="mensaje" name="mensaje" rows={4} maxLength={1000} placeholder="Háblanos de tu hogar y de la vida que podrías ofrecerle..." className="mt-3 w-full rounded-lg border border-green-200 bg-white px-4 py-3 outline-none focus:border-green-700" />
      <button type="submit" className="mt-4 w-full rounded-lg bg-green-700 px-5 py-3 font-bold text-white transition hover:bg-green-800">
        Enviar solicitud de adopción
      </button>
    </form>
  );
}
