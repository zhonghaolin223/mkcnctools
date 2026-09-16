"use client";

import { useEffect } from "react";
import { trackEvent } from "@/components/analytics";

export function ViewTracker({ name, payload }: { name: "product_view" | "category_view"; payload: Record<string, unknown> }) {
  const serialized = JSON.stringify(payload);
  useEffect(() => { trackEvent(name, JSON.parse(serialized) as Record<string, unknown>); }, [name, serialized]);
  return null;
}
