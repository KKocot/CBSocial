import Link from "next/link";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";

export const Footer = () => {
  const t = useTranslations("HomePage");
  return (
    <div className="flex justify-end">
      <Button asChild variant={"link"}>
        <Link href="/policy">{t("privacy_policy")}</Link>
      </Button>
      <Button asChild variant={"link"}>
        <Link href="/tos">{t("terms_of_service")}</Link>
      </Button>
      <Button asChild variant={"link"}>
        <Link href="/docs">{t("documentation")}</Link>
      </Button>
    </div>
  );
};
