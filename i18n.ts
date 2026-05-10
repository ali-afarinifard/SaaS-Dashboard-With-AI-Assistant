import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

const SUPPORTED_LOCALES = ["en", "fa"] as const;
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

const DEFAULT_LOCALE: SupportedLocale = "en";

function getSupportedLocale(value: string | undefined): SupportedLocale {
  if (value && (SUPPORTED_LOCALES as readonly string[]).includes(value)) {
    return value as SupportedLocale;
  }
  return DEFAULT_LOCALE;
}

export default getRequestConfig(async () => {
  const cookieStore = cookies();
  const locale = getSupportedLocale(cookieStore.get("locale")?.value);

  return {
    locale,
    messages: (await import(`./src/i18n/messages/${locale}.json`)).default,
  };
});