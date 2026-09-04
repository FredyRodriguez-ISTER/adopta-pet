export default function LoginPage() {
  return (
    <main className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-3xl font-bold">
          Iniciar sesión
        </h1>

        <p className="mt-2 text-gray-600">
          Ingresa a tu cuenta de AdoptaPet.
        </p>

        <form className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block font-medium">
              Correo electrónico
            </label>

            <input
              type="email"
              placeholder="correo@ejemplo.com"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-700"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Contraseña
            </label>

            <input
              type="password"
              placeholder="********"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-green-700"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-green-700 px-4 py-3 font-bold text-white hover:bg-green-800"
          >
            Iniciar sesión
          </button>
        </form>
      </div>
    </main>
  );
}