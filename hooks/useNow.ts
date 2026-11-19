"use client";

import { useSyncExternalStore } from "react";

const MINUTE = 60_000;
const subscribe = (onTick: () => void) => {
  const id = window.setInterval(onTick, MINUTE);
  return () => window.clearInterval(id);
};
// Rounded to the minute so the snapshot is stable between ticks.
const getSnapshot = () => Math.floor(Date.now() / MINUTE) * MINUTE;
const getServerSnapshot = () => 0;

/** The current time (to the minute), read outside render so components stay pure. 0 on the server. */
export function useNow() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
