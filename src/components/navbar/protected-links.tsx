"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

import { useTranslations } from "next-intl";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { Castle, Crown, Menu, SquareUserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { rolesQueryOptions } from "../../queries/roles.query";
import { FC } from "react";

export const ProtectedLinks = () => {
  const { data: commanders = [] } = useQuery(rolesQueryOptions());

  const { data } = useSession();

  const isCommander =
    (data && commanders.some((e) => e.discordId === data.user.id)) || false;
  const isHouseLeader =
    (data &&
      commanders
        .filter((e) => e.role === "HouseLeader" || e.role === "RightHand")
        .some((e) => e.discordId === data.user.id)) ||
    false;

  if (!data) return null;
  return (
    <>
      <MobileMenu isCommander={isCommander} isHouseLeader={isHouseLeader} />
      <DesktopMenu isCommander={isCommander} isHouseLeader={isHouseLeader} />
    </>
  );
};

interface ProtectedMenuProps {
  isCommander: boolean;
  isHouseLeader: boolean;
}
const DesktopMenu: FC<ProtectedMenuProps> = ({
  isCommander,
  isHouseLeader,
}) => {
  const t = useTranslations("HomePage");

  return (
    <>
      <NavigationMenu delayDuration={0} className="hidden md:block">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger
              className={cn({
                "rounded-r-none": isCommander,
              })}
            >
              <SquareUserRound className="size-5" />
              {t("member_menu")}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="grid w-max">
                <Link href="/profile" legacyBehavior passHref>
                  <NavigationMenuLink className="w-full px-4 py-2 hover:bg-accent">
                    {t("my_profile")}
                  </NavigationMenuLink>
                </Link>
                <Link href="/update-form" legacyBehavior passHref>
                  <NavigationMenuLink className="w-full px-4 py-2 hover:bg-accent">
                    {t("update_form")}
                  </NavigationMenuLink>
                </Link>
                <Link href="/house" legacyBehavior passHref>
                  <NavigationMenuLink className="w-full px-4 py-2 hover:bg-accent">
                    {t("house")}
                  </NavigationMenuLink>
                </Link>
                <Link href="/houses" legacyBehavior passHref>
                  <NavigationMenuLink className="w-full px-4 py-2 hover:bg-accent">
                    {t("all_houses")}
                  </NavigationMenuLink>
                </Link>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      {isCommander ? (
        <NavigationMenu delayDuration={0} className="hidden md:block">
          <NavigationMenuList>
            <NavigationMenuItem className="w-max">
              <NavigationMenuTrigger
                className={cn({
                  "rounded-l-none": isCommander,
                  "rounded-r-none": isHouseLeader,
                })}
              >
                <Crown className="size-5" />
                {t("high_command_menu")}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-max">
                  <Link href="/team-builder" legacyBehavior passHref>
                    <NavigationMenuLink className="w-full px-4 py-2 hover:bg-accent">
                      {t("build_team")}
                    </NavigationMenuLink>
                  </Link>
                  <Link href="/my-house" legacyBehavior passHref>
                    <NavigationMenuLink className="w-full px-4 py-2 hover:bg-accent">
                      {t("my_house")}
                    </NavigationMenuLink>
                  </Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      ) : null}
      {isHouseLeader ? (
        <NavigationMenu delayDuration={0} className="hidden md:block">
          <NavigationMenuList>
            <NavigationMenuItem className="w-max">
              <NavigationMenuTrigger className={"rounded-l-none"}>
                <Castle className="size-5" />
                {t("house_leader_menu")}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-max">
                  <Link href="/settings" legacyBehavior passHref>
                    <NavigationMenuLink className="w-full px-4 py-2 hover:bg-accent">
                      {t("settings")}
                    </NavigationMenuLink>
                  </Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      ) : null}
    </>
  );
};
const MobileMenu: FC<ProtectedMenuProps> = ({ isCommander, isHouseLeader }) => {
  const t = useTranslations("HomePage");

  return (
    <NavigationMenu delayDuration={0} className="md:hidden">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger hideChevron>
            <Menu />
          </NavigationMenuTrigger>
          <NavigationMenuContent className="space-y-4">
            <div className="grid w-max py-1">
              <div className="flex gap-1 font-bold items-center px-2">
                <SquareUserRound className="size-5" />
                {t("member_menu")}
              </div>
              <Link href="/profile" legacyBehavior passHref>
                <NavigationMenuLink className="w-full px-4 py-2 hover:bg-accent">
                  {t("my_profile")}
                </NavigationMenuLink>
              </Link>
              <Link href="/update-form" legacyBehavior passHref>
                <NavigationMenuLink className="w-full px-4 py-2 hover:bg-accent">
                  {t("update_form")}
                </NavigationMenuLink>
              </Link>
              <Link href="/house" legacyBehavior passHref>
                <NavigationMenuLink className="w-full px-4 py-2 hover:bg-accent">
                  {t("house")}
                </NavigationMenuLink>
              </Link>
              <Link href="/houses" legacyBehavior passHref>
                <NavigationMenuLink className="w-full px-4 py-2 hover:bg-accent">
                  {t("all_houses")}
                </NavigationMenuLink>
              </Link>
            </div>
            {isCommander ? (
              <div className="grid w-max  py-1">
                <div className="flex gap-1 font-bold items-center px-2">
                  <Crown className="size-5" />
                  {t("high_command_menu")}
                </div>
                <Link href="/team-builder" legacyBehavior passHref>
                  <NavigationMenuLink className="w-full px-4 py-2 hover:bg-accent">
                    {t("build_team")}
                  </NavigationMenuLink>
                </Link>
                <Link href="/my-house" legacyBehavior passHref>
                  <NavigationMenuLink className="w-full px-4 py-2 hover:bg-accent">
                    {t("my_house")}
                  </NavigationMenuLink>
                </Link>
              </div>
            ) : null}
            {isHouseLeader ? (
              <div className="grid w-max  py-1">
                <div className="flex gap-1 font-bold items-center px-2">
                  <Castle className="size-5" />
                  {t("house_leader_menu")}
                </div>
                <Link href="/settings" legacyBehavior passHref>
                  <NavigationMenuLink className="w-full px-4 py-2 hover:bg-accent">
                    {t("settings")}
                  </NavigationMenuLink>
                </Link>
              </div>
            ) : null}
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
