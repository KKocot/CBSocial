"use client";

import { Button } from "@/components/ui/button";
import { ArtilleryProps, SheetTypes } from "@/lib/type";
import { getCloserDay } from "@/lib/utils";
import { useSession } from "next-auth/react";
import React, { useEffect, useMemo, useState } from "react";
import Loading from "react-loading";
import clsx from "clsx";
import { weapons } from "@/assets/weapons";
import Item from "@/components/sheet-form-item";
import { goldenUnits } from "@/assets/golden-units-data";
import { heroicUnits } from "@/assets/heroic-units-data";
import { blueUnits, greenUnits, greyUnits } from "@/assets/low-units-data";
import { others } from "@/assets/other-units-data";
import Preview from "@/components/preview";
import { useTranslations } from "next-intl";
import { ScanEye } from "lucide-react";
import UsersList from "@/components/users-list";
import TemplateMenu from "@/components/templates-menu";
import UnitsFilter from "@/components/units-filter";
import RaidsFilter from "@/components/raids-filter";
import StorageTemplate from "@/components/storage-template";
import { Survey } from "@/lib/get-data";
import { useQuery } from "@tanstack/react-query";
import { rolesQueryOptions } from "@/queries/roles.query";

const next_tw = getCloserDay();

const DEFAULT_CARD = {
  username: "",
  unit1: "",
  unit2: "",
  unit3: "",
  weapon: "",
  description: "",
  color: "slate",
  artillery: [
    { id: 1, check: false },
    { id: 2, check: false },
    { id: 3, check: false },
    { id: 4, check: false },
    { id: 5, check: false },
    { id: 6, check: false },
    { id: 7, check: false },
    { id: 8, check: false },
    { id: 9, check: false },
    { id: 10, check: false },
    { id: 11, check: false },
  ],
};

function getLineup(surveys: Survey[] | undefined, lineup: string[]) {
  const data = surveys?.filter((survey) => lineup.includes(survey.discordId));
  return data;
}
interface Signup {
  name: string;
  signup: string[];
}

interface LineupData {
  date: string;
  house: string;
  lineup: Signup[];
}

const Page: React.FC = () => {
  const { data: commander } = useSession();
  const t = useTranslations("BuildTeam");
  const [signup, setSignup] = useState<LineupData | null>(null);
  const [surveys, setSurveys] = useState<Survey[]>();
  const [userList, setUserList] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(false);
  const [sheetData, setSheetData] = useState<SheetTypes[]>([]);
  const [allPlayers, setAllPlayers] = useState<Survey[]>([]);
  const [lineup, setLineup] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [houseId, setHouseId] = useState<number | null>(null);
  const [pending, setPending] = useState(false);
  const [filterUnits, setFilterUnits] = useState({
    rustic_checked: true,
    chivalric_checked: true,
    silver_checked: true,
    heroic_checked: true,
    golden_checked: true,
    other_checked: true,
    meta_units_only: true,
  });
  const { data: command_list = [] } = useQuery(rolesQueryOptions());

  const commander_house =
    commander && commander.user.id
      ? command_list.find((e) => e.discordId === commander.user.id)
      : "";

  const fetchSettings = async (house: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/houseSettings?house=${house}`);
      const result = await response.json();
      setHouseId(result.house.id);
    } catch (error) {
      console.error("Error fetching settings:", error);
      return (
        <div className="flex justify-center items-center h-screen">
          {t("finish_settings_first")}
        </div>
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchLineup = async (house: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/attendance?house=${house}&date=${next_tw}`
      );
      const data = await response.json();
      setSignup(data.attendance[0]);
    } catch (error) {
      console.error("Error fetching:", error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };
  const fetchSurveys = async (house: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/survey?house=${house}`);
      const data = await response.json();
      setSurveys(data.surveys);
    } catch (error) {
      console.error("Error fetching:", error);
    } finally {
      setTimeout(() => setLoading(false), 1000);
    }
  };

  const units = useMemo(() => {
    const golden_era = filterUnits.golden_checked ? goldenUnits : [];
    const heroic_era = filterUnits.heroic_checked ? heroicUnits : [];
    const silver_era = filterUnits.silver_checked ? blueUnits : [];
    const chivalric_era = filterUnits.chivalric_checked ? greenUnits : [];
    const rustic_era = filterUnits.rustic_checked ? greyUnits : [];
    const others_unit = filterUnits.other_checked ? others : [];
    return [
      ...golden_era,
      ...heroic_era,
      ...silver_era,
      ...chivalric_era,
      ...rustic_era,
      ...others_unit,
    ];
  }, [
    filterUnits.golden_checked,
    filterUnits.heroic_checked,
    filterUnits.silver_checked,
    filterUnits.chivalric_checked,
    filterUnits.rustic_checked,
    filterUnits.other_checked,
  ]);
  useEffect(() => {
    setAllPlayers(getLineup(surveys, lineup) ?? []);
  }, [lineup.length]);

  useEffect(() => {
    if (!commander_house) return;
    fetchSettings(commander_house.house);
    fetchLineup(commander_house.house);
    fetchSurveys(commander_house.house);
  }, [Boolean(commander_house), pending]);

  const handleEdit = (
    index: number,
    username: string,
    unit1: string,
    unit2: string,
    unit3: string,
    weapon: string,
    description: string,
    color: string,
    artillery: ArtilleryProps[]
  ) => {
    setSheetData((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              username: username,
              unit1: unit1,
              unit2: unit2,
              unit3: unit3,
              weapon: weapon,
              description: description,
              color: color,
              artillery: artillery,
            }
          : item
      )
    );
  };
  useEffect(() => {
    setSheetData((prev) => {
      const requiredLength = allPlayers.length + 10;
      if (prev.length < requiredLength) {
        const newCards = Array.from(
          { length: requiredLength - prev.length },
          () => DEFAULT_CARD
        );
        return [...prev, ...newCards];
      } else if (prev.length > requiredLength) {
        return prev.slice(0, requiredLength);
      }
      return prev;
    });
  }, [allPlayers.length, surveys]);
  useEffect(() => {
    setUserList(
      allPlayers.filter(
        (user) =>
          !sheetData.some(
            (input) =>
              user.inGameNick.toLocaleLowerCase() ===
              input.username.toLocaleLowerCase()
          )
      )
    );
  }, [JSON.stringify(sheetData)]);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading color="#94a3b8" />
      </div>
    );
  }
  return (
    <div className="flex justify-center flex-col items-center">
      <div className="flex items-center justify-around bg-indigo-950 w-3/4">
        <Button
          onClick={() => setShowPreview(!showPreview)}
          variant="tab"
          className="rounded-none"
        >
          <ScanEye className="h-5 w-5" />
          {showPreview ? t("editor") : t("preview")}
        </Button>
        <StorageTemplate
          data={sheetData}
          setData={setSheetData}
          playersNum={allPlayers.length}
        />
        <div className="flex gap-4">
          <UnitsFilter filters={filterUnits} setFilter={setFilterUnits} />
          {signup?.lineup ? (
            <RaidsFilter lineups={signup.lineup} setLineup={setLineup} />
          ) : null}
        </div>
      </div>
      <TemplateMenu
        userHouse={commander_house ? commander_house.house : ""}
        data={sheetData}
        setData={setSheetData}
        players={allPlayers}
      />
      <div className={clsx("flex flex-col gap-5 p-2", { hidden: showPreview })}>
        <UsersList players={allPlayers} allPlayers={userList} />
        <div className="flex justify-center gap-2">
          <span className="text-yellow-500">{t("maxed_and_preffer")}</span>
          <span className="text-purple-500">{t("preffer")}</span>
          <span className="text-blue-500">{t("maxed")}</span>
          <span className="text-green-500">{t("i_have")}</span>
        </div>
        <ul className="grid grid-cols-5 gap-8">
          {sheetData.map((e, index) => (
            <Item
              users={userList}
              weapons={weapons}
              key={index}
              index={index}
              units={
                filterUnits.meta_units_only
                  ? units.filter((e) => e.value > 7)
                  : units
              }
              data={e}
              onEdit={handleEdit}
            />
          ))}
        </ul>
      </div>
      <div className={clsx({ hidden: !showPreview })}>
        <Preview data={sheetData} units={units} />
      </div>
    </div>
  );
};

export default Page;
