import Link from "next/link";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireUser();
  const isRefugio = profile?.role === "refugio";

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b pb-6">
        <div>
          <p className="font-medium text-green-700">Área privada</p>
          <h1 className="mt-1 text-3xl font-bold">Hola, {profile?.full_name ?? "bienvenido"}</h1>
          <p className="mt-2 text-gray-600">{isRefugio ? "Administra tus publicaciones y solicitudes." : "Consulta tus favoritos y solicitudes de adopción."}</p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-semibold">
          <Link href="/dashboard" className="rounded-lg border border-green-700 px-4 py-2 text-green-800 hover:bg-green-50">Resumen</Link>
          {isRefugio ? (
            <>
              <Link href="/mascotas/nuevo" className="rounded-lg bg-green-700 px-4 py-2 text-white hover:bg-green-800">Publicar mascota</Link>
              <Link href="/dashboard/solicitudes" className="rounded-lg border border-green-700 px-4 py-2 text-green-800 hover:bg-green-50">Solicitudes</Link>
            </>
          ) : (
            <Link href="/dashboard/favoritos" className="rounded-lg border border-green-700 px-4 py-2 text-green-800 hover:bg-green-50">Mis favoritos</Link>
          )}
        </div>
      </div>
      {children}
    </main>
  );
}
