"use client";

import { Button } from "@/components/ui/button";
import { SiDiscord } from "@icons-pack/react-simple-icons";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const t = useTranslations("HomePage");
  const params = useSearchParams();

  return (
    <main className="grid  sm:grid-cols-2 lg:grid-cols-3 ">
      <div className="absolute -z-10 inset-0 sm:relative lg:col-span-2 flex justify-center">
        <div className="relative h-full w-auto aspect-square">
          <Image
            src={"/hero.png"}
            alt="hero-preview"
            fill
            className="object-contain"
          />
        </div>
      </div>
      <div className="grid place-content-center">
        <div className="mt-8 max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <p className="text-gray-500 dark:text-gray-400">
            {t("login_to_access_your_profile")}
          </p>
          <div className="mt-4 flex justify-center">
            <Button
              onClick={() =>
                signIn("discord", {
                  callbackUrl:
                    params.get("callbackUrl") ?? window.location.origin,
                })
              }
              className="text-xl gap-2"
            >
              <SiDiscord />
              {t("login")}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
