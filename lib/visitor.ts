//lib/visitor.ts

import { cookies } from "next/headers";

export async function getVisitorId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("visitor_id")?.value ?? null;
}
