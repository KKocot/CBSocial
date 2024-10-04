"use client";

import { Button } from "@/components/ui/button";
import { HouseDetails } from "@/lib/get-data";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { SiDiscord } from "@icons-pack/react-simple-icons";
import { Castle } from "lucide-react";

const HousesPage = () => {
  const t = useTranslations("HousePage");
  const [houses, setHouses] = useState<HouseDetails[]>([]);
  const fetchHouses = async () => {
    try {
      const response = await fetch("/api/house");
      const data = await response.json();
      setHouses(data);
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };
  useEffect(() => {
    fetchHouses();
  }, []);
  return (
    <div className="flex flex-col items-center container">
      <h1 className="m-10">{t("houses")}</h1>
      <ul className="flex flex-wrap  gap-4 m-12 justify-around">
        {houses.map((house) => (
          <li
            className="shadow-primary/50 hover:shadow-primary/50 shadow hover:shadow-lg transition-all grid  rounded-sm overflow-hidden basis-72"
            key={house.name}
          >
            <div className="relative w-full h-auto aspect-square">
              <Image fill src={house.avatar} alt="House Avatar" />
              <div className="absolute top-2 -right-16 rotate-45 h-10 w-40 bg-primary"></div>
              <div className="absolute text-white top-3 right-2 text-sm  text-center">
                {house.server}
              </div>
            </div>
            <div className="px-2">
              <div className="flex justify-between items-center">
                <h2 className="text-xl pt-2">{house.name}</h2>
                <p className="text-sm">{house.country}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm">{house.description}</p>
              </div>
            </div>
            <div className="flex">
              <Button
                variant="tab"
                className="w-full gap-1 text-black dark:text-white hover:text-white"
                asChild
              >
                <Link
                  className="w-full"
                  target="_blank"
                  href={house.discordLink}
                >
                  <SiDiscord className="size-4" /> {t("join_discord")}
                </Link>
              </Button>

              <Button
                variant="tab"
                className="w-full gap-1 text-black dark:text-white hover:text-white"
                onClick={() => {
                  toast.error("Not working yet");
                }}
              >
                {t("join_to_house")} <Castle className="size-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default HousesPage;
