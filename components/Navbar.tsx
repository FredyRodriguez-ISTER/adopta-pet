import Link from "next/link";
import { signOutAction } from "@/app/actions/auth";
import { getCurrentUser } from "@/lib/auth";

export default async function Navbar() {
  const currentUser = await getCurrentUser();
  const isRefugio = currentUser?.profile?.role === "refugio";

  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-green-700">
          🐾 AdoptaPet
        </Link>

        <div className="flex flex-wrap items-center gap-3 text-sm sm:gap-5">
          <Link href="/mascotas" className="text-gray-700 transition hover:text-green-700">
            Mascotas
          </Link>
          <Link href="/razas" className="text-gray-700 transition hover:text-green-700">
            Razas
          </Link>

          {currentUser ? (
            <>
              <Link href="/dashboard" className="text-gray-700 transition hover:text-green-700">
                Panel
              </Link>
              {isRefugio ? (
                <Link href="/mascotas/nuevo" className="text-gray-700 transition hover:text-green-700">
                  Publicar
                </Link>
              ) : null}
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="rounded-lg border border-green-700 px-3 py-2 font-medium text-green-700 transition hover:bg-green-50"
                >
                  Cerrar sesión
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="rounded-lg bg-green-700 px-3 py-2 font-medium text-white transition hover:bg-green-800">
                Iniciar sesión
              </Link>
              <Link href="/register" className="rounded-lg border border-green-700 px-3 py-2 font-medium text-green-700 transition hover:bg-green-50">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
