// Central business configuration for East Delhi Realty.
// Contact details are real (provided by the consultant). Anything unverified
// stays editable here and is never invented elsewhere in the app.

export const SITE = {
  name: "East Delhi Realty",
  consultant: "Viplov Kashyap",
  tagline: "Property consultancy · East Delhi",
  phone: "+91 9958381701",
  phoneRaw: "+919958381701",
  whatsappNumber: "919958381701",
  email: "viplov7@icloud.com",
  locality: "Shakarpur",
  areaServed: "East Delhi, Delhi, India",
  address: "Shakarpur, East Delhi, Delhi 110092, India",
  mapQuery: "Shakarpur, East Delhi, Delhi 110092, India",
  coords: { lat: 28.6315, lng: 77.2774 },
};

export function whatsappLink(message) {
  const base = `https://wa.me/${SITE.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function telLink() {
  return `tel:${SITE.phoneRaw}`;
}

export const LOCALITIES = [
  "Shakarpur",
  "Laxmi Nagar",
  "Nirman Vihar",
  "Preet Vihar",
  "Pandav Nagar",
  "Mayur Vihar",
  "Patparganj",
  "IP Extension",
  "Anand Vihar",
  "Krishna Nagar",
  "Geeta Colony",
  "Vivek Vihar",
  "Shahdara",
  "Dilshad Garden",
  "Karkardooma",
];

export const CATEGORIES = [
  "Flat / Apartment",
  "Builder Floor",
  "Independent House",
  "Villa",
  "Plot / Land",
  "Shop",
  "Office Space",
  "Warehouse",
];

export const RESIDENTIAL_CATEGORIES = [
  "Flat / Apartment",
  "Builder Floor",
  "Independent House",
  "Villa",
  "Plot / Land",
];

export const COMMERCIAL_CATEGORIES = ["Shop", "Office Space", "Warehouse"];

export const FURNISHING = ["Unfurnished", "Semi-Furnished", "Fully Furnished"];

export const PARKING = ["None", "Bike", "Car", "Car + Bike", "Two Cars"];

export const FLOORS = ["Ground", "1st", "2nd", "3rd", "4th", "5th+"];

export const AVAILABILITY = ["Available Now", "Under Construction", "Sold", "Rented"];

export const TRANSACTIONS = [
  { value: "buy", label: "Buy" },
  { value: "rent", label: "Rent" },
];

export const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "area-desc", label: "Largest Area" },
];

const LAKH = 100000;
const CRORE = 10000000;

export const BUDGETS = {
  buy: [
    { value: 2500000, label: "₹25 L" },
    { value: 5000000, label: "₹50 L" },
    { value: 7500000, label: "₹75 L" },
    { value: 10000000, label: "₹1 Cr" },
    { value: 15000000, label: "₹1.5 Cr" },
    { value: 20000000, label: "₹2 Cr" },
    { value: 30000000, label: "₹3 Cr" },
    { value: 50000000, label: "₹5 Cr" },
  ],
  rent: [
    { value: 8000, label: "₹8,000" },
    { value: 12000, label: "₹12,000" },
    { value: 18000, label: "₹18,000" },
    { value: 25000, label: "₹25,000" },
    { value: 40000, label: "₹40,000" },
    { value: 60000, label: "₹60,000" },
    { value: 100000, label: "₹1 L" },
  ],
};

export const BEDROOM_OPTIONS = [1, 2, 3, 4, 5];
export const BATHROOM_OPTIONS = [1, 2, 3, 4];

/** ₹1,25,00,000 -> ₹1.25 Cr */
export function formatINR(value) {
  const n = Number(value) || 0;
  if (n >= CRORE) {
    const cr = n / CRORE;
    return `₹${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(2).replace(/0$/, "")} Cr`;
  }
  if (n >= LAKH) {
    const l = n / LAKH;
    return `₹${l % 1 === 0 ? l.toFixed(0) : l.toFixed(1)} L`;
  }
  return `₹${n.toLocaleString("en-IN")}`;
}

export function formatPrice(value, transaction) {
  const base = formatINR(value);
  return transaction === "rent" ? `${base}/mo` : base;
}

export function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Buy", to: "/buy" },
  { label: "Rent", to: "/rent" },
  { label: "Properties", to: "/properties" },
  { label: "About", to: "/about" },
];