"use server";

import { cookies } from "next/headers";

import type { Channel } from "@/app/(main)/dashboard/default/_components/schema";
import { getChannels } from "@/lib/orders";

export async function getValueFromCookie(key: string): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(key)?.value;
}

export async function setValueToCookie(
  key: string,
  value: string,
  options: { path?: string; maxAge?: number } = {},
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(key, value, {
    path: options.path ?? "/",
    maxAge: options.maxAge ?? 60 * 60 * 24 * 7, // default: 7 days
  });
}

export async function getPreference<T extends string>(key: string, allowed: readonly T[], fallback: T): Promise<T> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(key);
  const value = cookie ? cookie.value.trim() : undefined;
  return allowed.includes(value as T) ? (value as T) : fallback;
}

// ============ New server actions for dashboard ============

export async function fetchChannelsByDateRange(from?: string, to?: string, limit: number = 10000): Promise<Channel[]> {
  try {
    const fromDate = from ? new Date(from) : undefined;
    const toDate = to ? new Date(to) : undefined;

    // Ensure toDate is end of day
    if (toDate) {
      toDate.setHours(23, 59, 59, 999);
    }

    const channels = await getChannels({
      from: fromDate,
      to: toDate,
      limit,
      offset: 0,
    });

    return channels;
  } catch (error) {
    console.error("Error fetching channels by date range:", error);
    return [];
  }
}
