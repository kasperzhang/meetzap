export { LanguageProvider, useLanguage, type Locale } from "./context";
export { en, type Translations } from "./locales/en";
export { zh } from "./locales/zh";

export function interpolate(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/{(\w+)}/g, (_, key) => {
    return values[key] !== undefined ? String(values[key]) : `{${key}}`;
  });
}
