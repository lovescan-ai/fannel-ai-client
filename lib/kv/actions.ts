"use server";
import { kvClient } from "./client";

interface PageTracker {
  creatorId: string;
  previousPage: string;
  nextPage?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  tierType:
    | "tier-agencies"
    | "tier-small-agencies"
    | "tier-creator"
    | "one-time";
  credits: number;
  price: number;
}

export async function pageTracker({
  creatorId,
  previousPage,
  nextPage,
}: PageTracker) {
  await deletePageTracker();
  const pageTracker = await kvClient.set(
    `page-tracker`,
    {
      previousPage,
      creatorId,
      nextPage,
    },
    { ex: 60 * 5 }
  );
  console.log("page tracker set successfully ✅");
  return pageTracker;
}

export async function readPageTracker() {
  const pageTracker = await kvClient.get(`page-tracker`);
  return pageTracker as unknown as PageTracker;
}

export async function deletePageTracker() {
  const pageTracker = await kvClient.del(`page-tracker`);
  return pageTracker;
}

export async function saveUserInfoKv(user: User) {
  await deleteUserInfoKv();
  const res = await kvClient.set(`user-info`, user);
  return res as unknown as User;
}

export async function readUserInfoKv() {
  const res = await kvClient.get(`user-info`);
  return res as unknown as User;
}

export async function deleteUserInfoKv() {
  const res = await kvClient.del(`user-info`);
  return res;
}
