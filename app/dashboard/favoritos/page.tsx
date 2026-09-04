import Link from "next/link";
import FavoritoForm from "@/components/FavoritoForm";
import MascotaCard from "@/components/MascotaCard";
import { requireRole } from "@/lib/auth";
import { getFavoritosDeUsuario } from "@/lib/data/mascotas";

export default async function FavoritosPage() {
  const { user } = await requireRole("adoptante");
  const favoritos = await getFavoritosDeUsuario(user.id);

  return (
    <section>
      <h2 className="text-2xl font-bold">Mis favoritos</h2>
      <p className="mt-2 text-gray-600">Aquí están las mascotas que quieres recordar.</p>
      {favoritos.length === 0 ? <div className="mt-6 rounded-2xl bg-white p-8 shadow-sm"><p className="text-gray-600">Todavía no tienes favoritos.</p><Link href="/mascotas" className="mt-3 inline-block font-semibold text-green-700 hover:underline">Explorar el catálogo</Link></div> : <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{favoritos.map((mascota) => <div key={mascota.id} className="space-y-3"><MascotaCard mascota={mascota} /><FavoritoForm mascotaId={mascota.id} esFavorita /></div>)}</div>}
    </section>
  );
}
