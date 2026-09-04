import MascotaImagen from "@/components/MascotaImagen";

export const dynamic = "force-dynamic";

interface DogApiResponse {
  message: string;
  status: string;
}

async function obtenerPerro(): Promise<string | null> {
  try {
    const response = await fetch(
      "https://dog.ceo/api/breeds/image/random",
      {
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      }
    );

    if (!response.ok) {
      throw new Error("No se pudo consultar la API");
    }

    const data: DogApiResponse = await response.json();

    return data.message;
  } catch (error) {
    console.error("Error al consumir Dog CEO:", error);
    return null;
  }
}

export default async function RazasPage() {
  const imagenPerro = await obtenerPerro();

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-10">
        <p className="font-medium text-green-700">
          🐕 Información externa
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Conoce más sobre los perros
        </h1>

        <p className="mt-3 max-w-2xl text-gray-600">
          Esta sección utiliza una API externa para obtener
          información dinámica sobre perros.
        </p>
      </div>

      {imagenPerro ? (
        <section className="overflow-hidden rounded-2xl bg-white shadow-lg">
          <MascotaImagen
            src={imagenPerro}
            alt="Imagen de perro obtenida desde una API externa"
            className="h-[500px] w-full object-cover"
          />

          <div className="p-6">
            <h2 className="text-2xl font-bold">
              Imagen obtenida mediante Dog CEO API
            </h2>

            <p className="mt-2 text-gray-600">
              Esta imagen no está almacenada en nuestra base
              de datos. Es información obtenida en tiempo real
              desde un servicio externo.
            </p>
          </div>
        </section>
      ) : (
        <section className="rounded-2xl bg-red-50 p-8 text-center">
          <h2 className="text-xl font-bold text-red-700">
            No fue posible obtener información
          </h2>

          <p className="mt-2 text-red-600">
            La API externa no está disponible en este momento.
            Intenta nuevamente más tarde.
          </p>
        </section>
      )}
    </main>
  );
}
