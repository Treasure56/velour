"use client";

import { useCallback, useSyncExternalStore } from "react";
import { useCartStore } from "@/store/cart";

type PersistedStore = {
  persist: { onFinishHydration: (fn: () => void) => () => void; hasHydrated: () => boolean };
};

const getServerSnapshot = () => false;

/**
 * True once a persisted Zustand store (the cart by default) has been read from storage on the
 * client. Render saved values only when this is true, so the server HTML and the first client
 * render match. (CartHydration in the root layout loads the cart; the checkout loads its own store.)
 * `store.persist` only exists in the browser (no storage on the server), so it is read only
 * inside the subscribe/snapshot callbacks, which React never calls during server rendering.
 */
export function useHydrated(store: PersistedStore = useCartStore) {
  const subscribe = useCallback((onChange: () => void) => store.persist.onFinishHydration(onChange), [store]);
  return useSyncExternalStore(subscribe, () => store.persist.hasHydrated(), getServerSnapshot);
}
