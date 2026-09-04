export interface Mascota {
  id: number;
  nombre: string;
  especie: "Perro" | "Gato";
  raza: string;
  edad: number;
  sexo: "Macho" | "Hembra";
  descripcion: string;
  imagen_url: string;
  estado: "Disponible" | "Adoptado";
  refugio_id: string;
}