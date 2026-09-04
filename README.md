# AdoptaPet

AdoptaPet es una plataforma para conectar refugios con personas que desean dar un hogar responsable a una mascota. Los refugios publican y administran mascotas; los adoptantes pueden explorar, filtrar, guardar favoritos y enviar solicitudes de adopción.

**Demo en vivo:** [adopta-pet-sepia.vercel.app](https://adopta-pet-sepia.vercel.app)

## Capturas de pantalla

Las capturas deben tomarse después de configurar Supabase con datos de prueba, para que representen flujos reales y no una maqueta. Guarda y enlaza estas tres evidencias antes de la entrega:

1. Inicio o catálogo con mascotas y filtros activos.
2. Detalle de una mascota y formulario de solicitud para un adoptante.
3. Panel de un refugio con sus publicaciones o solicitudes recibidas.

> Sugerencia: guarda las imágenes en `docs/screenshots/` y reemplaza esta lista por enlaces Markdown antes de entregar.

## Stack tecnológico

- [Next.js 14.2](https://nextjs.org/) con App Router y Server Components.
- [TypeScript](https://www.typescriptlang.org/) para tipos de datos y componentes.
- [Tailwind CSS 3](https://tailwindcss.com/) para la interfaz responsiva.
- [Supabase](https://supabase.com/) para PostgreSQL, Auth, RLS y sesiones SSR.
- `@supabase/ssr` para cookies, middleware y clientes de servidor/navegador.
- [Dog CEO API](https://dog.ceo/dog-api/) como API REST externa, consumida con `fetch` y `async/await` en `/razas`.
- [Vercel](https://vercel.com/) como destino de producción.

## Roles y permisos

| Rol | Puede hacer |
| --- | --- |
| **Adoptante** | Explorar el catálogo público, buscar y filtrar mascotas, guardar favoritos, enviar una solicitud y consultar sus solicitudes. |
| **Refugio** | Crear, editar y eliminar únicamente sus publicaciones; revisar y aprobar o rechazar solicitudes de sus mascotas. |

El rol se guarda en `public.profiles`, no en el código. El trigger `handle_new_user` crea el perfil cuando Supabase Auth registra un usuario.

## Rutas

| Ruta | Acceso | Propósito |
| --- | --- | --- |
| `/` | Público | Inicio y mascotas destacadas. |
| `/mascotas` | Público | Catálogo con búsqueda y filtros de `useState`. |
| `/mascotas/[id]` | Público | Ruta dinámica con detalle, favoritos y solicitud. |
| `/razas` | Público | Datos de Dog CEO API con manejo de errores. |
| `/login`, `/register` | Público | Autenticación real de Supabase. |
| `/dashboard` | Privado | Panel adaptado al rol. |
| `/dashboard/favoritos` | Privado, adoptante | Mascotas guardadas. |
| `/dashboard/solicitudes` | Privado, refugio | Solicitudes recibidas. |
| `/mascotas/nuevo`, `/mascotas/[id]/editar` | Privado, refugio | CRUD de publicaciones con Server Actions. |

`middleware.ts` actualiza la sesión y redirige a usuarios sin sesión antes de entrar en rutas privadas. Las Server Actions y las políticas RLS vuelven a verificar el rol y la propiedad de cada operación.

## Modelo de datos

```text
auth.users
    │ 1:1 (trigger)
    ▼
profiles
    ├── 1:N ── mascotas
    │              │
    │              └── 1:N ── solicitudes_adopcion ── N:1 ── profiles (adoptante)
    │
    └── N:M ── favoritos ── N:1 ── mascotas
```

| Tabla | Función |
| --- | --- |
| `profiles` | Extiende `auth.users` con nombre y rol. |
| `mascotas` | Recurso principal, publicado por un refugio. |
| `solicitudes_adopcion` | Solicitud única de un adoptante por mascota. |
| `favoritos` | Relación muchos-a-muchos entre adoptantes y mascotas. |

El archivo [supabase/schema.sql](./supabase/schema.sql) crea tablas, restricciones, índices, trigger de perfiles, RLS y todas las políticas necesarias.

## Configuración de Supabase

1. Crea un proyecto de Supabase.
2. En **SQL Editor**, ejecuta el contenido completo de `supabase/schema.sql`.
3. En **Project Settings → API**, copia la URL del proyecto y la clave anónima/publishable.
4. Copia `.env.example` como `.env.local` y completa los valores:

```bash
cp .env.example .env.local
```

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu-clave-publishable
```

5. En **Authentication → URL Configuration**, agrega `http://localhost:3000/auth/callback` a las Redirect URLs. Cuando publiques, agrega también `https://tu-dominio.vercel.app/auth/callback`.

`.env.local` está excluido de Git. Nunca agregues una service role key al navegador ni al repositorio.

## Seguridad

- Las operaciones de escritura se ejecutan como Server Actions y validan el rol en el servidor.
- RLS aplica la misma autorización en PostgreSQL. Los refugios no pueden cambiar el dueño de una mascota y solo reciben solicitudes de sus publicaciones; el rol del perfil no es editable desde la API.
- La clave anónima/publishable de Supabase puede estar en variables `NEXT_PUBLIC_` porque RLS protege los datos. Las claves `service_role` no se usan ni se deben publicar.
- La API externa expira tras 8 segundos y muestra un estado visible si no responde.
- `npm audit --omit=dev` informa vulnerabilidades heredadas de Next.js 14.2.35. La corrección automática disponible implica migrar a Next 16, lo cual incumpliría el requisito de usar Next.js 14. Para producción real, planifica una migración de framework y una nueva auditoría cuando la restricción académica deje de aplicar.

### Datos de prueba

Registra dos cuentas desde `/register`, una para cada rol. No se incluyen contraseñas o correos ficticios en el repositorio para evitar publicar credenciales. Antes de la sustentación crea una cuenta de **adoptante** y otra de **refugio**, conserva las credenciales de prueba en un lugar seguro y compártelas solo con el docente si corresponde.

## Instalación local

```bash
git clone https://github.com/TU-USUARIO/adopta-pet.git
cd adopta-pet
npm install
cp .env.example .env.local
# completa .env.local y ejecuta supabase/schema.sql en el panel de Supabase
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

Para comprobar la versión de producción localmente:

```bash
npm run build
npm run start
```

## Funcionalidades implementadas

- [x] Next.js 14 App Router, TypeScript y Tailwind CSS.
- [x] Rutas públicas, rutas privadas con middleware y ruta dinámica de detalle.
- [x] Registro, login, cierre de sesión y callback de confirmación con Supabase Auth.
- [x] Dos roles persistidos en PostgreSQL con permisos diferentes.
- [x] Cuatro tablas relacionadas, FK, trigger, índices y RLS.
- [x] CRUD completo de mascotas con Server Actions y validación en servidor.
- [x] Solicitudes de adopción, favoritos y gestión de estado para refugios.
- [x] Búsqueda/filtros en un Client Component con `useState`.
- [x] API externa de Dog CEO con `fetch`, `async/await` y estado de error.
- [x] Estados vacíos, `not-found` y error boundary.
- [x] Variables de entorno documentadas y protegidas por `.gitignore`.

## Arquitectura a explicar en la defensa

- **Server Component:** `app/mascotas/page.tsx` obtiene las mascotas desde Supabase en el servidor.
- **Client Component:** `components/FiltroMascotas.tsx` utiliza `useState` para filtrar sin recargar la página.
- **Server Action:** `app/actions/mascotas.ts` valida el formulario y crea, actualiza o elimina una mascota; no hay una API REST propia para mutaciones.
- **Seguridad en capas:** middleware para sesión, `requireRole` para autorización en servidor y RLS para aplicar las mismas reglas directamente en PostgreSQL.

## Despliegue en Vercel

1. Sube el repositorio a GitHub sin incluir `.env.local`.
2. En Vercel, selecciona **Add New → Project** e importa el repositorio.
3. Añade `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` en **Settings → Environment Variables** para Production y Preview.
4. Despliega. Copia el dominio generado.
5. En Supabase, agrega `https://adopta-pet-sepia.vercel.app/auth/callback` en las Redirect URLs y configura el Site URL con `https://adopta-pet-sepia.vercel.app`.
6. Prueba registro, login, ambas cuentas, CRUD, favoritos, solicitudes y `/razas` en la URL pública.
7. La versión actual está publicada en [adopta-pet-sepia.vercel.app](https://adopta-pet-sepia.vercel.app). Añade tres capturas reales antes de la entrega final.

## Historial Git recomendado

Usa mensajes descriptivos y mantén `main` funcional. Ejemplos de avances coherentes para este proyecto:

```text
chore: preparar dependencias y entorno de Supabase
feat: definir esquema relacional y políticas RLS
feat: conectar clientes SSR de Supabase
feat: implementar registro e inicio de sesión
feat: proteger rutas privadas con middleware
feat: consultar catálogo desde PostgreSQL
feat: crear panel de refugio
feat: agregar creación de mascotas con Server Action
feat: agregar edición y eliminación de mascotas
feat: implementar solicitudes de adopción
feat: implementar favoritos para adoptantes
fix: manejar estados vacíos y errores de datos
docs: documentar instalación, seguridad y despliegue
```

No alteres fechas de commits ni publiques código roto: el historial debe reflejar trabajo verificable.

## Guion breve para el video de defensa

1. Explica el problema y los dos roles (2 min).
2. Navega el catálogo, filtros, detalle y API externa (3 min).
3. Muestra tablas, relaciones, trigger y políticas RLS en Supabase (3 min).
4. Explica un Server Component, `useState` y una Server Action (3 min).
5. Demuestra login, middleware, CRUD y permisos de ambos roles (3 min).
6. Cuenta los retos, seguridad de variables y despliegue (2 min).

**Video de defensa:** pendiente de añadir el enlace final antes de la entrega.

## Autor

Fredy Omar Rodríguez Hernández
