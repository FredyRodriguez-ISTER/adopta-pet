-- AdoptaPet - esquema inicial para ejecutar en Supabase SQL Editor.
-- Este archivo no contiene secretos y se puede ejecutar una sola vez en un proyecto nuevo.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null check (char_length(trim(full_name)) >= 2),
  role text not null default 'adoptante' check (role in ('adoptante', 'refugio')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.mascotas (
  id bigint generated always as identity primary key,
  nombre text not null check (char_length(trim(nombre)) >= 2),
  especie text not null check (especie in ('Perro', 'Gato')),
  raza text not null check (char_length(trim(raza)) >= 2),
  edad smallint not null check (edad >= 0 and edad <= 30),
  sexo text not null check (sexo in ('Macho', 'Hembra')),
  descripcion text not null check (char_length(trim(descripcion)) >= 20),
  imagen_url text,
  estado text not null default 'Disponible'
    check (estado in ('Disponible', 'En proceso', 'Adoptado')),
  refugio_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.solicitudes_adopcion (
  id bigint generated always as identity primary key,
  mascota_id bigint not null references public.mascotas (id) on delete cascade,
  adoptante_id uuid not null references public.profiles (id) on delete cascade,
  mensaje text check (char_length(mensaje) <= 1000),
  estado text not null default 'Pendiente'
    check (estado in ('Pendiente', 'Aprobada', 'Rechazada')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (mascota_id, adoptante_id)
);

create table public.favoritos (
  usuario_id uuid not null references public.profiles (id) on delete cascade,
  mascota_id bigint not null references public.mascotas (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (usuario_id, mascota_id)
);

create index mascotas_refugio_id_idx on public.mascotas (refugio_id);
create index mascotas_estado_idx on public.mascotas (estado);
create index solicitudes_adopcion_mascota_id_idx on public.solicitudes_adopcion (mascota_id);
create index solicitudes_adopcion_adoptante_id_idx on public.solicitudes_adopcion (adoptante_id);
create index favoritos_mascota_id_idx on public.favoritos (mascota_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

create trigger mascotas_set_updated_at
before update on public.mascotas
for each row execute procedure public.set_updated_at();

create trigger solicitudes_adopcion_set_updated_at
before update on public.solicitudes_adopcion
for each row execute procedure public.set_updated_at();

-- Un perfil se crea automáticamente con los datos de Supabase Auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), 'Usuario'),
    case
      when new.raw_user_meta_data ->> 'role' = 'refugio' then 'refugio'
      else 'adoptante'
    end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.mascotas enable row level security;
alter table public.solicitudes_adopcion enable row level security;
alter table public.favoritos enable row level security;

create policy "profiles are publicly readable"
on public.profiles for select using (true);

-- No se permite modificar perfiles desde la API. Así nadie puede elevar su rol.
revoke update on public.profiles from authenticated;

create policy "available pets are publicly readable"
on public.mascotas for select using (true);

create policy "shelters create their own pets"
on public.mascotas for insert to authenticated
with check (
  auth.uid() = refugio_id
  and exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'refugio'
  )
);

create policy "shelters update their own pets"
on public.mascotas for update to authenticated
using (
  auth.uid() = refugio_id
  and exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'refugio'
  )
)
with check (
  auth.uid() = refugio_id
  and exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'refugio'
  )
);

create policy "shelters delete their own pets"
on public.mascotas for delete to authenticated
using (
  auth.uid() = refugio_id
  and exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'refugio'
  )
);

-- Un refugio puede editar los detalles, pero nunca transferir la propiedad de una mascota.
revoke update on public.mascotas from authenticated;
grant update (nombre, especie, raza, edad, sexo, descripcion, imagen_url, estado)
on public.mascotas to authenticated;

create policy "adopters create their own applications"
on public.solicitudes_adopcion for insert to authenticated
with check (
  auth.uid() = adoptante_id
  and exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'adoptante'
  )
);

create policy "adopters read their own applications"
on public.solicitudes_adopcion for select to authenticated
using (auth.uid() = adoptante_id);

create policy "shelters read received applications"
on public.solicitudes_adopcion for select to authenticated
using (
  exists (
    select 1 from public.mascotas
    where mascotas.id = solicitudes_adopcion.mascota_id
      and mascotas.refugio_id = auth.uid()
  )
);

create policy "shelters update received applications"
on public.solicitudes_adopcion for update to authenticated
using (
  exists (
    select 1 from public.mascotas
    where mascotas.id = solicitudes_adopcion.mascota_id
      and mascotas.refugio_id = auth.uid()
  )
)
with check (
  estado in ('Aprobada', 'Rechazada')
  and exists (
    select 1 from public.mascotas
    where mascotas.id = solicitudes_adopcion.mascota_id
      and mascotas.refugio_id = auth.uid()
  )
);

-- La única mutación válida para una solicitud es que su refugio cambie el estado.
revoke update on public.solicitudes_adopcion from authenticated;
grant update (estado) on public.solicitudes_adopcion to authenticated;

create policy "adopters read their favorites"
on public.favoritos for select to authenticated
using (auth.uid() = usuario_id);

create policy "adopters add favorites"
on public.favoritos for insert to authenticated
with check (
  auth.uid() = usuario_id
  and exists (
    select 1 from public.profiles
    where profiles.id = auth.uid() and profiles.role = 'adoptante'
  )
);

create policy "adopters remove favorites"
on public.favoritos for delete to authenticated
using (auth.uid() = usuario_id);
