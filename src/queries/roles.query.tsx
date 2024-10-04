import { isServer, QueryKey, queryOptions } from "@tanstack/react-query";
import { z } from "zod";

const roleSchema = z.object({
  discordId: z.string(),
  house: z.string(),
  role: z.string(),
  discordNick: z.string(),
});
export type Role = z.infer<typeof roleSchema>;

export const rolesQueryOptions = () =>
  queryOptions({
    queryKey: ["roles"] as QueryKey,
    queryFn: async () => {
      const baseUrl = !isServer ? window.location.origin : process.env.ORIGIN;
      const data = roleSchema.array().parse(
        await fetch(baseUrl + `/api/roles`)
          .then((res) => res.json())
          .then((json) => json.roles)
      );
      return data;
    },
    enabled: true,
  });
export const roleQueryOptions = () =>
  queryOptions({
    queryKey: ["role"] as QueryKey,
    queryFn: async () => {
      const baseUrl = !isServer ? window.location.origin : process.env.ORIGIN;
      const data = roleSchema.array().parse(
        await fetch(baseUrl + `/api/roles`)
          .then((res) => res.json())
          .then((json) => json.roles)
      );
      return data;
    },
    enabled: true,
  });
