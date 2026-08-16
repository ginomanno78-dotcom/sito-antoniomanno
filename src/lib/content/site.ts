export const SITE_URL = "https://www.antoniomanno.it";

export const CONTACT = {
  phone: "+39 3273229713",
  phoneDisplay: "+39 3273229713",
  email: "antoniomannoweb@gmail.com",
};

export const ANALYTICS = {
  ga4Id: "G-F36FN8B7ZW",
  iubendaSiteId: "1ee75747-81f6-4f66-9ddd-e1329de6e904",
  iubendaPolicyId: "75255023",
};

export const NAV_LINKS = [
  { href: "/#hero", label: "Home" },
  { href: "/#biografia", label: "Biografia" },
] as const;

export const MOSTRE_LINKS = [
  { href: "/mostra-auschwitz", label: "Auschwitz" },
  { href: "/mostra-jazz", label: "Jazz festival" },
  { href: "/mostra-storie", label: "Storie" },
] as const;

export const PORTFOLIO_ORDER = [
  "portraits",
  "street",
  "jazz",
  "processions",
  "arti-mestieri",
  "fulvio-vellone",
  "country-market",
  "giochi-di-paese",
  "windows",
  "urban",
  "train",
  "auschwitz",
  "colours",
  "landscapes",
] as const;

export const PERSON_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Antonio Manno",
  jobTitle: "Fotografo",
  url: SITE_URL + "/",
  email: CONTACT.email,
  telephone: CONTACT.phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Sparanise",
    addressRegion: "Caserta",
    addressCountry: "IT",
  },
};

export const SERVICE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Antonio Manno Fotografo",
  url: SITE_URL + "/",
  email: CONTACT.email,
  telephone: CONTACT.phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Sparanise",
    addressRegion: "Caserta",
    addressCountry: "IT",
  },
  founder: {
    "@type": "Person",
    name: "Antonio Manno",
  },
};
