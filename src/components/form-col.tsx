import { useState } from "react";
import clsx from "clsx";
import { Button } from "./ui/button";
import RadioComponent from "./radio-component";
import { useTranslations } from "next-intl";

type FormColData = {
  id: number;
  name: string;
  src: string;
  leadership: number;
  masteryPoints: boolean;
  value: number;
  era: string;
  icon: string;
};

const FormCol = ({
  data,
  controller,
  moveToStep,
  step,
}: {
  data: FormColData[];
  controller: any;
  moveToStep: (step: number) => void;
  step: number;
}) => {
  const t = useTranslations("AddForm");
  const [showMore, setShowMore] = useState(false);
  const sortedUnitData = showMore ? data : data.filter((e) => e.value > 7);
  const sortedData = sortedUnitData.sort((a, b) => b.value - a.value);
  return (
    <div className="flex flex-wrap sm:shadow-gray-600 sm:shadow-lg p-4 gap-4 justify-center">
      {sortedData.map((e) => (
        <div key={e.id + e.name} className="w-[270px]">
          <h2
            className={clsx("text-lg font-medium text-center", {
              "bg-gradient-to-r from-yellow-300 to-yellow-800":
                e.era === "golden",
              "bg-gradient-to-r from-violet-300 to-violet-800":
                e.era === "heroic",
              "bg-gradient-to-r from-green-300 to-green-800": e.era === "green",
              "bg-gradient-to-r from-blue-300 to-blue-800": e.era === "blue",
              "bg-gradient-to-r from-gray-300 to-gray-800": e.era === "grey",
            })}
          >
            {e.name}
          </h2>
          <div className="items-center grid grid-cols-2">
            <div className="flex justify-center">
              <img className="h-40" alt={e.name} src={e.src} />
            </div>
            <RadioComponent unitData={e} controller={controller} />
          </div>
        </div>
      ))}
      <Button
        className="sticky bottom-0 w-full bg-gray-300 dark:bg-slate-800 font-bold text-xl items-center"
        type="button"
        variant="secondary"
        onClick={() => setShowMore((prev) => !prev)}
      >
        {showMore ? t("show_meta_only") : t("show_all")}
      </Button>
      <div className="flex w-full gap-4">
        <Button
          type="button"
          onClick={() => moveToStep(step - 1)}
          disabled={step === 1}
          className="w-1/2"
        >
          {t("previous")}
        </Button>

        <Button
          type="button"
          onClick={() => moveToStep(step + 1)}
          className="w-1/2"
        >
          {t("next")}
        </Button>
      </div>
    </div>
  );
};

export default FormCol;
