"use client";

import UserForm from "@/components/high-role-form";
import RolesTable from "@/components/high-role-table";
import HouseDetailsForm from "@/components/house-details";
import DataForm from "@/components/house-settings-table";
import { getHouseDetails, getHouseSettings } from "@/lib/get-data";
import { rolesQueryOptions } from "@/queries/roles.query";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Loading from "react-loading";

const SettingsPage = () => {
  const t = useTranslations("SettingsPage");
  const { data: commander } = useSession();
  const { data: rolesData, isLoading: rolesIsLoading } = useQuery(
    rolesQueryOptions()
  );
  const house =
    rolesData?.find((e) => e.discordId === commander?.user.id)?.house || "";

  const { data: houseDetailsData, isLoading: houseDetailsIsLoading } = useQuery(
    {
      queryKey: ["houseDetails"],
      queryFn: () => getHouseDetails(house),
      enabled: !!house,
    }
  );

  const { data: houseSettingsData, isLoading: houseSettingsIsLoading } =
    useQuery({
      queryKey: ["houseSettings"],
      queryFn: () => getHouseSettings(house),
      enabled: !!house,
    });

  if (
    rolesIsLoading ||
    !rolesData ||
    houseDetailsIsLoading ||
    !houseDetailsData ||
    houseSettingsIsLoading
  ) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading color="#94a3b8" />
      </div>
    );
  }

  const onDelete = async (discordId: string) => {
    const confirmed = confirm(
      "Are you sure you want to delete this player from his role?"
    );
    if (confirmed) {
      try {
        const response = await fetch(`/api/roles?id=${discordId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error occurred:", errorData);
        } else {
          console.log("Success:", await response.json());
        }
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
  };

  return (
    <div className="p-12">
      <h1 className="text-center text-3xl">{t("settings_page")}</h1>
      <div className="flex gap-6 flex-col">
        <div>
          <UserForm house={house} />
          <RolesTable rolesList={rolesData} house={house} onDelete={onDelete} />
        </div>
        {
          <DataForm
            data={
              houseSettingsData ?? {
                name: house,
                id: "",
                member: { name: "", id: "" },
                lineup: [{ name: "", id: "", roleId: "" }],
                logs: { logs: "", attendance: "" },
                tw: { server: "", member: "" },
              }
            }
          />
        }

        <HouseDetailsForm data={houseDetailsData} />
      </div>
    </div>
  );
};

export default SettingsPage;
