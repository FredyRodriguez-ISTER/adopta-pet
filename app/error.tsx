"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="text-3xl font-bold">Algo no salió como esperábamos</h1>
      <p className="mt-3 text-gray-600">Comprueba tu conexión e inténtalo nuevamente.</p>
      <button onClick={reset} className="mt-7 rounded-lg bg-green-700 px-5 py-3 font-bold text-white hover:bg-green-800">Intentar de nuevo</button>
    </main>
  );
}
