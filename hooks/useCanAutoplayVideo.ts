"use client";

import { useSyncExternalStore } from "react";
import { REDUCED_MOTION } from "@/lib/gsap";

type NetworkInformationLike = EventTarget & { saveData?: boolean };

const getConnection = () =>
  (navigator as Navigator & { connection?: NetworkInformationLike }).connection;

function subscribe(onChange: () => void) {
  const reduced = window.matchMedia(REDUCED_MOTION);
  const connection = getConnection();
  reduced.addEventListener("change", onChange);
  connection?.addEventListener("change", onChange);
  return () => {
    reduced.removeEventListener("change", onChange);
    connection?.removeEventListener("change", onChange);
  };
}

const getSnapshot = () =>
  !window.matchMedia(REDUCED_MOTION).matches && !getConnection()?.saveData;

/** Server renders the still image; the client upgrades to video after hydration. */
const getServerSnapshot = () => false;

/** False when the visitor prefers reduced motion or has Data Saver on. */
export function useCanAutoplayVideo() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
