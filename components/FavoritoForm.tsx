import { toggleFavoritoAction } from "@/app/actions/favoritos";

type FavoritoFormProps = {
  mascotaId: number;
  esFavorita: boolean;
};

export default function FavoritoForm({ mascotaId, esFavorita }: FavoritoFormProps) {
  return (
    <form action={toggleFavoritoAction}>
      <input type="hidden" name="mascotaId" value={mascotaId} />
      <button type="submit" className="w-full rounded-lg border border-green-700 px-5 py-3 font-bold text-green-800 transition hover:bg-green-50">
        {esFavorita ? "♥ Quitar de favoritos" : "♡ Guardar en favoritos"}
      </button>
    </form>
  );
}
