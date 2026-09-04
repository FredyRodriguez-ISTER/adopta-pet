interface MascotaImagenProps {
  src: string | null;
  alt: string;
  className: string;
}

const imagenPredeterminada =
  "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1200&q=80";

export default function MascotaImagen({
  src,
  alt,
  className,
}: MascotaImagenProps) {
  // The refuge supplies arbitrary HTTPS image URLs, which cannot be safely allowlisted for next/image.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src ?? imagenPredeterminada} alt={alt} className={className} />;
}
