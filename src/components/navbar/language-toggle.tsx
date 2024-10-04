import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ReactCountryFlag from "react-country-flag";
import { useLocale, useTranslations } from "next-intl";
import { setUserLocale } from "@/lib/locale";
import { locales } from "@/i18n";
import { Button } from "../ui/button";

const LanguageToggle = () => {
  const locale = useLocale();
  const t = useTranslations("shared");

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon-sm" className="rounded-full">
          <ReactCountryFlag countryCode={locale} svg title={locale} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {locales.map((language) => (
          <DropdownMenuItem
            key={language}
            onClick={() => setUserLocale(language)}
            disabled={locale === language}
            className="space-x-2"
          >
            <ReactCountryFlag
              countryCode={language}
              svg
              title={t("language", { locale: language })}
            />

            <span>{t("language", { locale: language })}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageToggle;
