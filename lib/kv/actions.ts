"use server";
import { kvClient } from "./client";

interface PageTracker {
  creatorId: string;
  previousPage: string;
  nextPage?: string;
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
  console.log("Page Tracker 👮", pageTracker);
  return pageTracker as unknown as PageTracker;
}

export async function deletePageTracker() {
  console.log("Deleting Page Tracker ❌");
  const pageTracker = await kvClient.del(`page-tracker`);
  console.log("Page Tracker Deleted ✅");
  return pageTracker;
}
