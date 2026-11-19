"use client";

import { useMemo, useSyncExternalStore } from "react";
import { ORDER_EVENT, parseOrder, readOrderRaw } from "@/lib/order";

const subscribe = (onChange: () => void) => {
  window.addEventListener(ORDER_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(ORDER_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
};
const noopSubscribe = () => () => {};

/** The last order saved in this tab's sessionStorage. `ready` is false during SSR/first render. */
export function useOrder() {
  const ready = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const raw = useSyncExternalStore(subscribe, readOrderRaw, () => null);
  const order = useMemo(() => parseOrder(raw), [raw]);
  return { ready, order };
}
