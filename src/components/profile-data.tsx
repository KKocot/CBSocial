import { goldenUnits } from "@/assets/golden-units-data";
import { heroicUnits } from "@/assets/heroic-units-data";
import { blueUnits, greenUnits, greyUnits } from "@/assets/low-units-data";
import { ownedUnits } from "@/lib/utils";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  Table,
} from "@/components/ui/table";
import List from "./unit-list";
import { weapons } from "@/assets/weapons";
import clsx from "clsx";
import { useTranslations } from "next-intl";
import { Survey } from "@/lib/get-data";

const ProfileData = ({ profile }: { profile: Survey }) => {
  const t = useTranslations("BuildTeam");
  const golden = ownedUnits(goldenUnits, profile.units.golden);
  const heroic = ownedUnits(heroicUnits, profile.units.heroic);
  const blue = ownedUnits(blueUnits, profile.units.low);
  const green = ownedUnits(greenUnits, profile.units.low);
  const grey = ownedUnits(greyUnits, profile.units.low);
  const weapons_list = weapons.map((weapon) => {
    const matchingWeapon = profile.weapons.find(
      (w, index) => index + 1 === weapon.id
    );
    return { ...weapon, matchingWeapon };
  });
  return (
    <>
      <ul className="flex gap-8 flex-wrap">
        {weapons_list.map((e) =>
          e.matchingWeapon?.value ? (
            <li
              key={e.id}
              className="flex flex-col items-center w-18"
              title={t("leadership") + ": " + e.matchingWeapon.leadership}
            >
              <img
                src={e.src}
                alt={e.name}
                className="rounded-full w-12 h-12"
              />
              <span
                className={clsx("text-sm", {
                  "text-yellow-600": e.matchingWeapon.pref === 1,
                  "text-purple-600": e.matchingWeapon.pref === 2,
                  "text-blue-600": e.matchingWeapon.pref === 3,
                  "text-green-600": e.matchingWeapon.pref === 4,
                })}
              >
                {t("leadership")}: {e.matchingWeapon.leadership}
              </span>
            </li>
          ) : null
        )}
      </ul>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center px-0 text-yellow-500">
              {t("maxed_and_preffer")}
            </TableHead>
            <TableHead className="text-center px-0 text-purple-500">
              {t("preffer")}
            </TableHead>
            <TableHead className="text-center px-0 text-blue-500">
              {t("maxed")}
            </TableHead>
            <TableHead className="text-center px-0 text-green-500">
              {t("i_have")}{" "}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <List units={golden} value="4" />
            <List units={golden} value="3" />
            <List units={golden} value="2" />
            <List units={golden} value="1" />
          </TableRow>
          <TableRow>
            <List units={heroic} value="4" />
            <List units={heroic} value="3" />
            <List units={heroic} value="2" />
            <List units={heroic} value="1" />
          </TableRow>
          <TableRow>
            <List units={blue} value="4" />
            <List units={blue} value="3" />
            <List units={blue} value="2" />
            <List units={blue} value="1" />
          </TableRow>
          <TableRow>
            <List units={green} value="4" />
            <List units={green} value="3" />
            <List units={green} value="2" />
            <List units={green} value="1" />
          </TableRow>
          <TableRow>
            <List units={grey} value="4" />
            <List units={grey} value="3" />
            <List units={grey} value="2" />
            <List units={grey} value="1" />
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};

export default ProfileData;
