import Link from "next/link";
import { signUpAction } from "@/app/actions/auth";

type RegisterPageProps = {
  searchParams: { error?: string };
};

export default function RegisterPage({ searchParams }: RegisterPageProps) {
  return (
    <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-12">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <p className="font-medium text-green-700">Únete a la comunidad</p>
        <h1 className="mt-2 text-3xl font-bold">Crear cuenta</h1>
        <p className="mt-2 text-gray-600">
          Elige el rol que mejor describe cómo usarás AdoptaPet.
        </p>

        {searchParams.error ? (
          <p className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
            {searchParams.error}
          </p>
        ) : null}

        <form action={signUpAction} className="mt-8 space-y-5">
          <div>
            <label htmlFor="fullName" className="mb-2 block font-medium">
              Nombre completo
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              minLength={2}
              required
              placeholder="Juan Pérez"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-700"
            />
          </div>

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
              autoComplete="new-password"
              minLength={8}
              required
              placeholder="Mínimo 8 caracteres"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-700"
            />
          </div>

          <fieldset>
            <legend className="mb-2 block font-medium">Tipo de usuario</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="cursor-pointer rounded-lg border p-3 has-[:checked]:border-green-700 has-[:checked]:bg-green-50">
                <input defaultChecked name="role" type="radio" value="adoptante" />{" "}
                <span className="font-medium">Adoptante</span>
                <span className="mt-1 block text-xs text-gray-600">Guarda favoritos y solicita adopciones.</span>
              </label>
              <label className="cursor-pointer rounded-lg border p-3 has-[:checked]:border-green-700 has-[:checked]:bg-green-50">
                <input name="role" type="radio" value="refugio" />{" "}
                <span className="font-medium">Refugio</span>
                <span className="mt-1 block text-xs text-gray-600">Publica y gestiona mascotas.</span>
              </label>
            </div>
          </fieldset>

          <button
            type="submit"
            className="w-full rounded-lg bg-green-700 px-4 py-3 font-bold text-white transition hover:bg-green-800"
          >
            Crear cuenta
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-semibold text-green-700 hover:underline">
            Inicia sesión
          </Link>
        </p>
      </section>
    </main>
  );
}
