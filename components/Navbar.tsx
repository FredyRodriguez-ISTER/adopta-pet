import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-2xl font-bold text-green-700"
        >
          🐾 AdoptaPet
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-gray-700 transition hover:text-green-700"
          >
            Inicio
          </Link>

          <Link
            href="/mascotas"
            className="text-gray-700 transition hover:text-green-700"
          >
            Mascotas
          </Link>
          
          <Link
  href="/razas"
  className="text-gray-700 transition hover:text-green-700"
>
  Razas
</Link>

          <Link
            href="/login"
            className="rounded-lg bg-green-700 px-4 py-2 font-medium text-white transition hover:bg-green-800"
          >
            Iniciar sesión
          </Link>

          <Link
            href="/register"
            className="rounded-lg border border-green-700 px-4 py-2 font-medium text-green-700 transition hover:bg-green-50"
          >
            Registrarse
          </Link>
        </div>
      </nav>
    </header>
  );
}