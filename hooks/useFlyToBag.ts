"use client";

import { useCallback } from "react";
import { REDUCED_MOTION } from "@/lib/gsap";
import { SHOW_NAV_EVENT } from "@/lib/events";

const SIZE = 60;
const DURATION = 700;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** The bag icon dips 3px and its count badge pops (1 → 1.25 → 1). */
function land(icon: HTMLElement) {
  icon.animate([{ transform: "translateY(0)" }, { transform: "translateY(3px)" }, { transform: "translateY(0)" }], {
    duration: 380,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
  });
  icon.querySelector("[data-cart-badge]")?.animate(
    [{ transform: "scale(1)" }, { transform: "scale(1.25)" }, { transform: "scale(1)" }],
    { duration: 450, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
  );
}

/**
 * Returns fly(from, image): a 60px round copy of the image travels along a curved path from `from`
 * to the navbar bag icon (~0.7s, ease in-out), shrinking and fading, then the icon lands.
 * Reduced motion (or nothing to fly): skip straight to the landing.
 * The curve comes from animating X and Y on two nested elements with different easings.
 */
export function useFlyToBag() {
  return useCallback(async (from: Element | null, image?: string) => {
    const icon = document.querySelector<HTMLElement>("[data-cart-icon]");
    if (!icon) return;

    // Measure the start point now: the source (e.g. a closing modal) may be gone after the wait.
    const a = from?.getBoundingClientRect();

    // Bring the navbar back if it's hidden, and give it time to slide in.
    const navHidden = document.documentElement.hasAttribute("data-nav-hidden");
    window.dispatchEvent(new Event(SHOW_NAV_EVENT));

    if (!a || !image || window.matchMedia(REDUCED_MOTION).matches) {
      if (navHidden) await wait(400);
      land(icon);
      return;
    }
    if (navHidden) await wait(420);

    const b = icon.getBoundingClientRect();
    const start = { x: a.left + a.width / 2, y: a.top + a.height / 2 };
    const dx = b.left + b.width / 2 - start.x;
    const dy = b.top + b.height / 2 - start.y;

    const layer = document.getElementById("fly-to-bag-layer") ?? document.body;
    const outer = document.createElement("div"); // moves on X
    const inner = document.createElement("img"); // moves on Y, shrinks, fades
    Object.assign(outer.style, {
      position: "fixed",
      left: `${start.x - SIZE / 2}px`,
      top: `${start.y - SIZE / 2}px`,
      width: `${SIZE}px`,
      height: `${SIZE}px`,
      pointerEvents: "none",
      willChange: "transform",
    });
    inner.src = image;
    inner.alt = "";
    Object.assign(inner.style, {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: "9999px",
      boxShadow: "0 8px 24px rgb(43 26 20 / 0.18)",
      willChange: "transform, opacity",
    });
    outer.append(inner);
    layer.append(outer);

    const x = outer.animate([{ transform: "translateX(0)" }, { transform: `translateX(${dx}px)` }], {
      duration: DURATION,
      easing: "cubic-bezier(0.65, 0, 0.35, 1)",
      fill: "forwards",
    });
    // Easing that first moves away from the target, then sweeps in: produces the arc.
    const y = inner.animate(
      [
        { transform: "translateY(0) scale(1)", opacity: 1 },
        { transform: `translateY(${dy}px) scale(0.25)`, opacity: 0.35 },
      ],
      { duration: DURATION, easing: "cubic-bezier(0.45, -0.55, 0.75, 1)", fill: "forwards" },
    );

    await Promise.all([x.finished, y.finished]).catch(() => {});
    outer.remove();
    land(icon);
  }, []);
}
