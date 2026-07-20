const arabicToLatinMap: Record<string, string> = {
  "أ": "a", "إ": "i", "آ": "a", "ا": "a", "ب": "b", "ت": "t",
  "ث": "th", "ج": "j", "ح": "h", "خ": "kh", "د": "d", "ذ": "dh",
  "ر": "r", "ز": "z", "س": "s", "ش": "sh", "ص": "s", "ض": "d",
  "ط": "t", "ظ": "z", "ع": "a", "غ": "gh", "ف": "f", "ق": "q",
  "ك": "k", "ل": "l", "م": "m", "ن": "n", "ه": "h", "و": "w",
  "ي": "y", "ة": "a", "ى": "a", "ء": "a",
  "َ": "a", "ُ": "u", "ِ": "i", "ّ": "", "ْ": "",
};

const transliterate = (text: string): string => {
  return text
    .split("")
    .map((char) => arabicToLatinMap[char] ?? char)
    .join("");
};

export const generateSlug = (text: string): string => {
  const transliterated = transliterate(text.toLowerCase());
  return transliterated
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .trim();
};

export const ensureUniqueSlug = (baseSlug: string, existingSlugs: string[]): string => {
  let slug = baseSlug;
  let counter = 1;
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
};
