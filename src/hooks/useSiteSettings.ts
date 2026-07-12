import { trpc } from "@/providers/trpc";

export function useSiteSettings() {
  const { data, isLoading } = trpc.settings.list.useQuery();

  return {
    settings: data ?? {},
    isLoading,
    getSetting: (key: string, fallback = "") => data?.[key] ?? fallback,
  };
}
