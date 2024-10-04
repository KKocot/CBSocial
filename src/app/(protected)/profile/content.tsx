"use client";

import { useState } from "react";
import { blueUnits, greenUnits, greyUnits } from "@/assets/low-units-data";
import { heroicUnits } from "@/assets/heroic-units-data";
import { goldenUnits } from "@/assets/golden-units-data";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  Table,
} from "@/components/ui/table";
import { weapons } from "@/assets/weapons";
import { useSession } from "next-auth/react";
import Loading from "react-loading";
import { ownedUnits } from "@/lib/utils";
import List from "@/components/unit-list";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Avatar } from "@radix-ui/react-avatar";
import { useTranslations } from "next-intl";
import clsx from "clsx";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { getSurvey, Survey } from "@/lib/get-data";
import { useQuery } from "@tanstack/react-query";
import { rolesQueryOptions } from "@/queries/roles.query";
import { profileQueryOptions } from "@/queries/profile.query";

export default function Content() {
  const { data: user_data } = useSession();
  const [housePending, setHousePending] = useState(false);
  const t = useTranslations("BuildTeam");
  const { data: rolesData, isLoading: rolesIsLoading } = useQuery(
    rolesQueryOptions()
  );

  const houseLeader = rolesData
    ?.filter((e) => e.role === "HouseLeader")
    .some((role) => role.discordId === user_data?.user.id);

  const { data: profileData, isLoading: profileIsLoading } = useQuery({
    ...profileQueryOptions(user_data!.user.id),
    enabled: !!user_data?.user.id,
  });

  const onDelete = async (values: Survey) => {
    const accept = confirm(t("are_u_sure"));
    if (accept) {
      setHousePending(true);
      const data = {
        ...values,
        house: "none",
      };
      try {
        const response = await fetch("/api/survey", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        const responseRoles = await fetch(
          `/api/roles?id=${user_data?.user.id}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok || !responseRoles.ok) {
          const errorRoles = await responseRoles.json();
          const errorData = await response.json();
          console.error("Error occurred:", errorData, errorRoles);
        } else {
          const responseData = await response.json();
          toast.success(`You left ${values.house}`);
          console.log("Success:", responseData);
        }
      } catch (error) {
        console.error("Error occurred:", error);
      } finally {
        setHousePending(false);
      }
    }
  };

  if (profileIsLoading || rolesIsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading color="#94a3b8" />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex flex-col items-center">
        <div className="text-center py-12 text-2xl font-extrabold">
          {t("update_form_first")}
        </div>
        <Link
          href="/update-form"
          className="block w-fit text-center text-destructive p-4 hover:text-destructive-foreground"
        >
          {t("update_form")}
        </Link>
      </div>
    );
  }

  const golden = ownedUnits(goldenUnits, profileData.units.golden);
  const heroic = ownedUnits(heroicUnits, profileData.units.heroic);
  const blue = ownedUnits(blueUnits, profileData.units.low);
  const green = ownedUnits(greenUnits, profileData.units.low);
  const grey = ownedUnits(greyUnits, profileData.units.low);
  const weapons_list = weapons.map((weapon) => {
    const matchingWeapon = profileData.weapons.find(
      (w, index) => index + 1 === weapon.id
    );
    return { ...weapon, matchingWeapon };
  });
  return (
    <div>
      <div className="p-2 sm:p-8">
        <div className="flex items-center gap-10">
          <Avatar className="w-16 h-16">
            <AvatarImage
              alt="avatar"
              src={user_data?.user.image ?? "/placeholder-avatar.jpg"}
            />
            <AvatarFallback>KK</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              <span>{profileData.inGameNick}</span>(
              <span className="text-red-600">{profileData.characterLevel}</span>
              )
            </h2>
            <div className="text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
              {profileData.discordNick}
              {profileData.house !== "none" ? (
                <div className="flex items-center">
                  <span>{t("from") + profileData.house}</span>
                  {houseLeader ? null : housePending ? (
                    <span>
                      <Loading color="#94a3b8" className="" />
                    </span>
                  ) : (
                    <Button
                      onClick={() => onDelete(profileData)}
                      variant="ghost"
                      className="text-destructive"
                      title="Leave House"
                    >
                      X
                    </Button>
                  )}
                </div>
              ) : null}
            </div>
          </div>
          <ul className="flex gap-8 flex-wrap">
            {weapons_list.map((e) =>
              e.matchingWeapon?.value ? (
                <li
                  key={e.id}
                  className={clsx("flex flex-col items-center w-18", {
                    "text-green-500": e.matchingWeapon.pref === 4,
                    "text-blue-500": e.matchingWeapon.pref === 3,
                    "text-purple-500": e.matchingWeapon.pref === 2,
                    "text-yellow-500": e.matchingWeapon.pref === 1,
                  })}
                  title={t("leadership") + ": " + e.matchingWeapon.leadership}
                >
                  <img src={e.src} className="rounded-full w-12 h-12" />
                  <span className="text-sm">{e.name}</span>
                </li>
              ) : null
            )}
          </ul>
        </div>
        <div className="py-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center px-1 text-yellow-500">
                  {t("maxed_and_preffer")}
                </TableHead>
                <TableHead className="text-center px-1 text-purple-500">
                  {t("preffer")}
                </TableHead>
                <TableHead className="text-center px-1 text-blue-500">
                  {t("maxed")}
                </TableHead>
                <TableHead className="text-center px-1 text-green-500">
                  {t("i_have")}
                </TableHead>
                <TableHead className="text-center px-1 text-red-500">
                  {t("i_dont_have")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <List units={golden} value="4" />
                <List units={golden} value="3" />
                <List units={golden} value="2" />
                <List units={golden} value="1" />
                <List units={golden} value="0" />
              </TableRow>
              <TableRow>
                <List units={heroic} value="4" />
                <List units={heroic} value="3" />
                <List units={heroic} value="2" />
                <List units={heroic} value="1" />
                <List units={heroic} value="0" />
              </TableRow>
              <TableRow>
                <List units={blue} value="4" />
                <List units={blue} value="3" />
                <List units={blue} value="2" />
                <List units={blue} value="1" />
                <List units={blue} value="0" />
              </TableRow>
              <TableRow>
                <List units={green} value="4" />
                <List units={green} value="3" />
                <List units={green} value="2" />
                <List units={green} value="1" />
                <List units={green} value="0" />
              </TableRow>
              <TableRow>
                <List units={grey} value="4" />
                <List units={grey} value="3" />
                <List units={grey} value="2" />
                <List units={grey} value="1" />
                <List units={grey} value="0" />
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
