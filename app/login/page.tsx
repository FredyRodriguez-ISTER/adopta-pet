import Link from "next/link";
import { signInAction } from "@/app/actions/auth";

type LoginPageProps = {
  searchParams: { error?: string; message?: string; next?: string };
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  return (
    <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-12">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <p className="font-medium text-green-700">Bienvenido de vuelta</p>
        <h1 className="mt-2 text-3xl font-bold">Iniciar sesión</h1>
        <p className="mt-2 text-gray-600">Ingresa a tu cuenta de AdoptaPet.</p>

        {searchParams.error ? (
          <p className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
            {searchParams.error}
          </p>
        ) : null}
        {searchParams.message ? (
          <p className="mt-6 rounded-lg bg-green-50 p-3 text-sm text-green-800">
            {searchParams.message}
          </p>
        ) : null}

        <form action={signInAction} className="mt-8 space-y-5">
          <input type="hidden" name="next" value={searchParams.next ?? ""} />
          <div>
            <label htmlFor="email" className="mb-2 block font-medium">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="correo@ejemplo.com"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-700"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block font-medium">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="********"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-700"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-green-700 px-4 py-3 font-bold text-white transition hover:bg-green-800"
          >
            Iniciar sesión
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Aún no tienes cuenta?{" "}
          <Link href="/register" className="font-semibold text-green-700 hover:underline">
            Regístrate
          </Link>
        </p>
      </section>
    </main>
  );
}
