import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24 text-center">
      <p className="text-5xl">🐾</p>
      <h1 className="mt-5 text-3xl font-bold">No encontramos esta mascota</h1>
      <p className="mt-3 text-gray-600">Puede que haya sido adoptada o que el enlace no sea correcto.</p>
      <Link href="/mascotas" className="mt-7 inline-block rounded-lg bg-green-700 px-5 py-3 font-bold text-white hover:bg-green-800">Volver al catálogo</Link>
    </main>
  );
}
