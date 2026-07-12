import { z } from "zod";
import { createRouter, publicQuery, adminQuery } from "./middleware";
import {
  getAllSettings,
  getSettingByKey,
  upsertSetting,
  upsertManySettings,
  deleteSetting,
} from "./queries/settings";

export const settingsRouter = createRouter({
  // Public
  list: publicQuery.query(async () => {
    const data = await getAllSettings();
    return data.reduce(
      (acc, item) => {
        if (item.value) acc[item.key] = item.value;
        return acc;
      },
      {} as Record<string, string>
    );
  }),

  getByKey: publicQuery
    .input(z.object({ key: z.string() }))
    .query(async ({ input }) => {
      const setting = await getSettingByKey(input.key);
      return setting?.value ?? null;
    }),

  // Admin
  adminList: adminQuery.query(async () => {
    return getAllSettings();
  }),

  upsert: adminQuery
    .input(z.object({ key: z.string(), value: z.string() }))
    .mutation(async ({ input }) => {
      return upsertSetting(input.key, input.value);
    }),

  upsertMany: adminQuery
    .input(z.array(z.object({ key: z.string(), value: z.string() })))
    .mutation(async ({ input }) => {
      return upsertManySettings(input);
    }),

  delete: adminQuery
    .input(z.object({ key: z.string() }))
    .mutation(async ({ input }) => {
      return deleteSetting(input.key);
    }),
});
