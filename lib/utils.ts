import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase() // met tout en minuscule
    .trim() // enlève les espaces au début/fin
    .replace(/[àáâãäå]/g, "a") // remplace les accents
    .replace(/[èéêë]/g, "e")
    .replace(/[ìíîï]/g, "i")
    .replace(/[òóôõö]/g, "o")
    .replace(/[ùúûü]/g, "u")
    .replace(/[ç]/g, "c")
    .replace(/[^a-z0-9 -]/g, "") // enlève les caractères spéciaux
    .replace(/\s+/g, "-") // remplace les espaces par des tirets
    .replace(/-+/g, "-"); // évite les doubles tirets
}
