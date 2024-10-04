import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { SiDiscord } from "@icons-pack/react-simple-icons";

export const ProfileMenu = () => {
  const { data } = useSession();
  const t = useTranslations("HomePage");

  if (!data)
    return (
      <Button
        onClick={() =>
          signIn("discord", { callbackUrl: window.location.origin })
        }
        className="gap-1"
      >
        {t("login")}
        <SiDiscord />
      </Button>
    );
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon-sm"
          className="relative rounded-full"
        >
          <Image
            src={data.user?.image ?? ""}
            alt="user"
            fill
            className="rounded-full"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          className="cursor-pointer text-red-700"
          onClick={() => signOut()}
        >
          {t("logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
