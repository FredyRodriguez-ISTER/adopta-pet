export type UserRole = "adoptante" | "refugio";
export type MascotaEstado = "Disponible" | "En proceso" | "Adoptado";
export type SolicitudEstado = "Pendiente" | "Aprobada" | "Rechazada";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string;
          role?: UserRole;
          updated_at?: string;
        };
        Relationships: [];
      };
      mascotas: {
        Row: {
          id: number;
          nombre: string;
          especie: "Perro" | "Gato";
          raza: string;
          edad: number;
          sexo: "Macho" | "Hembra";
          descripcion: string;
          imagen_url: string | null;
          estado: MascotaEstado;
          refugio_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: never;
          nombre: string;
          especie: "Perro" | "Gato";
          raza: string;
          edad: number;
          sexo: "Macho" | "Hembra";
          descripcion: string;
          imagen_url?: string | null;
          estado?: MascotaEstado;
          refugio_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          nombre?: string;
          especie?: "Perro" | "Gato";
          raza?: string;
          edad?: number;
          sexo?: "Macho" | "Hembra";
          descripcion?: string;
          imagen_url?: string | null;
          estado?: MascotaEstado;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "mascotas_refugio_id_fkey";
            columns: ["refugio_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      solicitudes_adopcion: {
        Row: {
          id: number;
          mascota_id: number;
          adoptante_id: string;
          mensaje: string | null;
          estado: SolicitudEstado;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: never;
          mascota_id: number;
          adoptante_id: string;
          mensaje?: string | null;
          estado?: SolicitudEstado;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          estado?: SolicitudEstado;
          mensaje?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "solicitudes_adopcion_mascota_id_fkey";
            columns: ["mascota_id"];
            isOneToOne: false;
            referencedRelation: "mascotas";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "solicitudes_adopcion_adoptante_id_fkey";
            columns: ["adoptante_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      favoritos: {
        Row: {
          usuario_id: string;
          mascota_id: number;
          created_at: string;
        };
        Insert: {
          usuario_id: string;
          mascota_id: number;
          created_at?: string;
        };
        Update: {
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "favoritos_usuario_id_fkey";
            columns: ["usuario_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "favoritos_mascota_id_fkey";
            columns: ["mascota_id"];
            isOneToOne: false;
            referencedRelation: "mascotas";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Mascota = Database["public"]["Tables"]["mascotas"]["Row"];
export type SolicitudAdopcion =
  Database["public"]["Tables"]["solicitudes_adopcion"]["Row"];
export type Favorito = Database["public"]["Tables"]["favoritos"]["Row"];
