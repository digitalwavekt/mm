import { getDb } from "./connection";
import { settings } from "@db/schema";
import { eq } from "drizzle-orm";

export async function getAllSettings() {
  return getDb().query.settings.findMany();
}

export async function getSettingByKey(key: string) {
  return getDb().query.settings.findFirst({
    where: eq(settings.key, key),
  });
}

export async function upsertSetting(key: string, value: string) {
  const existing = await getSettingByKey(key);
  if (existing) {
    await getDb()
      .update(settings)
      .set({ value, updatedAt: new Date() })
      .where(eq(settings.key, key));
    return { key, value };
  }
  await getDb().insert(settings).values({ key, value });
  return { key, value };
}

export async function upsertManySettings(data: { key: string; value: string }[]) {
  const db = getDb();
  for (const item of data) {
    const existing = await getSettingByKey(item.key);
    if (existing) {
      await db
        .update(settings)
        .set({ value: item.value, updatedAt: new Date() })
        .where(eq(settings.key, item.key));
    } else {
      await db.insert(settings).values(item);
    }
  }
  return data;
}

export async function deleteSetting(key: string) {
  await getDb().delete(settings).where(eq(settings.key, key));
  return { success: true };
}
