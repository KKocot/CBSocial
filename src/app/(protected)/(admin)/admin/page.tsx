"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getRoleById, Survey } from "@/lib/get-data";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const AdminPage = () => {
  const { data: roleData, isLoading: roleIsLoading } = useQuery({
    queryKey: ["rolesList", "303156898532818944"],
    queryFn: () => getRoleById("303156898532818944"),
  });
  const { data: surveyData, isLoading: surveyIsLoading } = useQuery({
    queryKey: ["surveyList", "303156898532818944"],
    queryFn: () => getRoleById("303156898532818944"),
  });
  const [house, setHouse] = useState<string>("");

  const saveAdminData = async () => {
    try {
      await fetch("/api/survey", {
        method: "POST",
        body: JSON.stringify({ ...surveyData, house: house }),
      });
      await fetch("/api/roles", {
        method: "POST",
        body: JSON.stringify({ ...roleData, house: house }),
      });
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  if (roleIsLoading || surveyIsLoading) {
    return <div className="text-center mt-12">Loading...</div>;
  }
  return (
    <div>
      <Input
        className="w-1/2"
        value={house}
        onChange={(e) => {
          setHouse(e.target.value);
        }}
      />
      <Button onClick={saveAdminData}>Save</Button>
    </div>
  );
};

export default AdminPage;
