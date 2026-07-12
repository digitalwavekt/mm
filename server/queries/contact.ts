import { getDb } from "./connection";
import { contactLeads, newsletter } from "@db/schema";
import { eq, desc } from "drizzle-orm";

// ─── Contact Leads ──────────────────────────────────────────────────────────

export async function getAllContactLeads() {
  return getDb().query.contactLeads.findMany({
    orderBy: [desc(contactLeads.createdAt)],
  });
}

export async function getContactLeadById(id: number) {
  return getDb().query.contactLeads.findFirst({
    where: eq(contactLeads.id, id),
  });
}

export async function createContactLead(data: {
  name: string;
  email?: string;
  phone?: string;
  serviceInterest?: string;
  message?: string;
}) {
  const [result] = await getDb()
    .insert(contactLeads)
    .values(data)
    .returning({ id: contactLeads.id });
  return getContactLeadById(result.id);
}

export async function updateLeadStatus(
  id: number,
  status: "new" | "read" | "replied" | "archived"
) {
  await getDb()
    .update(contactLeads)
    .set({ status })
    .where(eq(contactLeads.id, id));
  return getContactLeadById(id);
}

export async function deleteContactLead(id: number) {
  await getDb().delete(contactLeads).where(eq(contactLeads.id, id));
  return { success: true };
}

// ─── Newsletter ─────────────────────────────────────────────────────────────

export async function getAllSubscribers() {
  return getDb().query.newsletter.findMany({
    orderBy: [desc(newsletter.createdAt)],
  });
}

export async function getActiveSubscribers() {
  return getDb().query.newsletter.findMany({
    where: eq(newsletter.isActive, true),
    orderBy: [desc(newsletter.createdAt)],
  });
}

export async function subscribeEmail(email: string) {
  const existing = await getDb().query.newsletter.findFirst({
    where: eq(newsletter.email, email),
  });
  if (existing) {
    await getDb()
      .update(newsletter)
      .set({ isActive: true })
      .where(eq(newsletter.id, existing.id));
    return { success: true, message: "Already subscribed" };
  }
  await getDb().insert(newsletter).values({ email });
  return { success: true, message: "Subscribed successfully" };
}

export async function unsubscribeEmail(email: string) {
  await getDb()
    .update(newsletter)
    .set({ isActive: false })
    .where(eq(newsletter.email, email));
  return { success: true };
}

export async function deleteSubscriber(id: number) {
  await getDb().delete(newsletter).where(eq(newsletter.id, id));
  return { success: true };
}
