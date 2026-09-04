# AdoptaPet

AdoptaPet es una plataforma web para publicar mascotas en adopción y facilitar el contacto entre refugios y personas adoptantes.

## Enlaces

- Repositorio: [GitHub](https://github.com/FredyRodriguez-ISTER/adopta-pet)
- Demo: [AdoptaPet en Vercel](https://adopta-pet-sepia.vercel.app)

## Capturas de pantalla

### Página de inicio

![Página de inicio de AdoptaPet](./docs/capturas/inicio.jpeg)

### Catálogo de mascotas

![Catálogo de mascotas](./docs/capturas/catalogo.jpeg)

### Panel de usuario

![Panel de usuario refugio](./docs/capturas/panel-usuario.jpeg)

## Tecnologías utilizadas

- Next.js 14 con App Router
- TypeScript
- Tailwind CSS
- Supabase: PostgreSQL y Auth
- Vercel
- Dog CEO API

## Funcionalidades

- Registro e inicio de sesión con Supabase Auth.
- Dos roles de usuario: adoptante y refugio.
- Catálogo público de mascotas con búsqueda y filtros por especie y sexo.
- Ruta dinámica para consultar el detalle de cada mascota.
- Panel privado según el rol del usuario.
- CRUD completo de mascotas para refugios mediante Server Actions.
- Favoritos y solicitudes de adopción para adoptantes.
- Gestión de solicitudes recibidas para refugios.
- Consumo de Dog CEO API con `fetch`, `async/await` y manejo de errores.
- Protección de rutas con middleware y políticas RLS en Supabase.

## Roles

| Rol | Acciones disponibles |
| --- | --- |
| Adoptante | Consultar mascotas, filtrar el catálogo, guardar favoritos y enviar solicitudes de adopción. |
| Refugio | Crear, editar y eliminar sus mascotas; revisar y actualizar las solicitudes recibidas. |

## Modelo de datos

| Tabla | Descripción |
| --- | --- |
| `profiles` | Información adicional del usuario y su rol. |
| `mascotas` | Publicaciones creadas por los refugios. |
| `solicitudes_adopcion` | Solicitudes enviadas por adoptantes para una mascota. |
| `favoritos` | Mascotas guardadas por los adoptantes. |

Relaciones principales:

```text
profiles 1 ─── N mascotas
profiles 1 ─── N solicitudes_adopcion
mascotas 1 ─── N solicitudes_adopcion
profiles N ─── M mascotas, mediante favoritos
```

El esquema de la base de datos y las políticas RLS se encuentran en [supabase/schema.sql](./supabase/schema.sql).

## Instalación local

1. Clona el repositorio.

   ```bash
   git clone https://github.com/FredyRodriguez-ISTER/adopta-pet.git
   cd adopta-pet
   ```

2. Instala las dependencias.

   ```bash
   npm install
   ```

3. Copia el archivo de variables de entorno.

   ```powershell
   Copy-Item .env.example .env.local
   ```

4. Completa `.env.local` con las credenciales públicas de tu proyecto Supabase.

   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=tu-clave-publishable
   ```

5. Ejecuta el contenido de [supabase/schema.sql](./supabase/schema.sql) en el SQL Editor de Supabase.

6. Inicia el proyecto.

   ```bash
   npm run dev
   ```

La aplicación estará disponible en `http://localhost:3000`.

## Credenciales de prueba

| Rol | Correo | Contraseña |
| --- | --- | --- |
| Adoptante |  |  |
| Refugio |  |  |

## Despliegue

La aplicación está desplegada en [Vercel](https://adopta-pet-sepia.vercel.app). Para que la autenticación funcione en producción, el dominio de Vercel debe estar configurado en las Redirect URLs de Supabase.

## Autor

Fredy Omar Rodríguez Hernández
