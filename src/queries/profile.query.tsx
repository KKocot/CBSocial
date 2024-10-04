import { isServer, QueryKey, queryOptions } from "@tanstack/react-query";
import { z } from "zod";

const unitSchema = z.object({
  id: z.number(),
  value: z.string(),
});
const surveySchema = z.object({
  artyAmount: z.enum(["none", "some", "average", "aLot"]),
  avatar: z.string().optional(),
  characterLevel: z.string(),
  discordId: z.string(),
  discordNick: z.string(),
  house: z.string(),
  inGameNick: z.string(),
  role: z.string().optional(),
  weapons: z
    .object({
      value: z.boolean(),
      leadership: z.number(),
      pref: z.number().optional(),
    })
    .array(),
  units: z.object({
    low: unitSchema.array(),
    heroic: unitSchema.array(),
    golden: unitSchema.array(),
  }),
});
export type Survey = z.infer<typeof surveySchema>;

export const profileQueryOptions = (discordId: string) =>
  queryOptions({
    queryKey: ["profile", discordId] as QueryKey,
    queryFn: async () => {
      const baseUrl = !isServer ? window.location.origin : process.env.ORIGIN;
      const data = await fetch(baseUrl + `/api/survey/${discordId}`, {})
        .then((res) => res.json())
        .then((json) => json.survey);
      return surveySchema.parse(data);
    },
  });
