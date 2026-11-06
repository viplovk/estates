import { ExternalLink, MapPin } from "lucide-react";
import { SITE } from "@/lib/site";

// Approximate locality centres — used only when a listing has no exact pin,
// and always labelled as approximate.
const LOCALITY_COORDS = {
  Shakarpur: [28.6315, 77.2774],
  "Laxmi Nagar": [28.636, 77.2773],
  "Nirman Vihar": [28.6372, 77.287],
  "Preet Vihar": [28.6413, 77.295],
  "Pandav Nagar": [28.626, 77.287],
  "Mayur Vihar": [28.609, 77.293],
  Patparganj: [28.61, 77.295],
  "IP Extension": [28.628, 77.308],
  "Anand Vihar": [28.647, 77.316],
  "Krishna Nagar": [28.655, 77.284],
  "Geeta Colony": [28.648, 77.272],
  "Vivek Vihar": [28.67, 77.312],
  Shahdara: [28.673, 77.289],
  "Dilshad Garden": [28.68, 77.32],
  Karkardooma: [28.648, 77.3],
};

export function PropertyMap({ property }) {
  const exact = !!property.map_lat && !!property.map_lng;
  const fallback = LOCALITY_COORDS[property.locality] || LOCALITY_COORDS[SITE.locality];
  const lat = exact ? Number(property.map_lat) : fallback[0];
  const lng = exact ? Number(property.map_lng) : fallback[1];
  const d = 0.008;
  const bbox = [lng - d, lat - d, lng + d, lat + d].join(",");
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
    bbox,
  )}&layer=mapnik&marker=${lat}%2C${lng}`;
  const directions = `https://www.openstreetmap.org/directions?to=${lat}%2C${lng}`;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline pb-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-gold" strokeWidth={1.6} />
          <p className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-ink">
            {property.locality}, East Delhi
          </p>
        </div>
        <a
          href={directions}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-gold transition-colors hover:text-ink"
        >
          Get directions
          <ExternalLink className="h-3 w-3" strokeWidth={1.6} />
        </a>
      </div>
      <div className="mt-4 aspect-[16/9] w-full overflow-hidden border border-hairline bg-[#E7E2D6]">
        <iframe
          title={`Map of ${property.locality}, East Delhi`}
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full border-0"
        />
      </div>
      <p className="mt-3 font-body text-[11px] leading-relaxed text-stone">
        {exact
          ? "Approximate pin. Exact address is shared on request."
          : `Approximate location in ${property.locality}. Exact address is shared on request.`}
      </p>
    </div>
  );
}