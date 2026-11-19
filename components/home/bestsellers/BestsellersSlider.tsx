"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { StaggerItem, StaggerList } from "@/components/ui";
import { SliderControls } from "./SliderControls";

type BestsellersSliderProps = {
  /** Left side of the header row (eyebrow + heading), rendered on the server */
  header: ReactNode;
  /** "View all" link */
  viewAll: ReactNode;
  /** One product card per slide, rendered on the server */
  slides: ReactNode[];
};

const NO_STATE = "0|0";

/**
 * Embla slider: 4 cards on desktop, 2.5 on tablet, 1.3 on mobile (next card peeks in).
 * Drag/swipe with snap, prev/next arrows disabled at the ends, and a thin progress line.
 */
export function BestsellersSlider({ header, viewAll, slides }: BestsellersSliderProps) {
  const [viewportRef, api] = useEmblaCarousel({ align: "start", containScroll: "trimSnaps" });
  const fillRef = useRef<HTMLDivElement>(null);

  // Arrow state comes straight from Embla's events (no setState in effects).
  const subscribe = useCallback(
    (onChange: () => void) => {
      api?.on("select", onChange).on("reInit", onChange);
      return () => {
        api?.off("select", onChange).off("reInit", onChange);
      };
    },
    [api],
  );
  const state = useSyncExternalStore(
    subscribe,
    () => (api ? `${+api.canScrollPrev()}|${+api.canScrollNext()}` : NO_STATE),
    () => NO_STATE,
  );
  const [canPrev, canNext] = state.split("|").map((v) => v === "1");

  useEffect(() => {
    if (!api) return;

    // Progress line: fill starts at one "page" and grows to full as you reach the end.
    const paintProgress = () => {
      const pages = Math.max(api.scrollSnapList().length, 1);
      const min = 1 / pages;
      const p = Math.min(1, Math.max(0, api.scrollProgress()));
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${min + p * (1 - min)})`;
    };

    // Keyboard: tabbing into an off-screen card scrolls the slider to it (instead of the
    // browser scrolling the clipped viewport behind Embla's back).
    const viewport = api.rootNode();
    const onFocusIn = (event: FocusEvent) => {
      const slide = (event.target as HTMLElement).closest("li");
      const index = slide ? api.slideNodes().indexOf(slide) : -1;
      viewport.scrollLeft = 0;
      if (index >= 0 && !api.slidesInView().includes(index)) api.scrollTo(index);
    };

    paintProgress();
    api.on("scroll", paintProgress).on("reInit", paintProgress);
    viewport.addEventListener("focusin", onFocusIn);
    return () => {
      api.off("scroll", paintProgress).off("reInit", paintProgress);
      viewport.removeEventListener("focusin", onFocusIn);
    };
  }, [api]);

  return (
    <>
      <div className="mb-10 flex items-end justify-between gap-6 lg:mb-14">
        {header}
        <div className="flex shrink-0 items-center gap-6">
          {viewAll}
          <div className="hidden sm:block">
            <SliderControls
              label="bestsellers"
              onPrev={() => api?.scrollPrev()}
              onNext={() => api?.scrollNext()}
              canPrev={canPrev}
              canNext={canNext}
            />
          </div>
        </div>
      </div>

      <div ref={viewportRef} className="overflow-hidden py-1" aria-roledescription="carousel" aria-label="Bestsellers">
        <StaggerList className="-ml-4 flex touch-pan-y">
          {slides.map((slide, i) => (
            <StaggerItem key={i} className="min-w-0 shrink-0 grow-0 basis-[77%] pl-4 sm:basis-[40%] lg:basis-1/4">
              {slide}
            </StaggerItem>
          ))}
        </StaggerList>
      </div>

      <div aria-hidden className="relative mt-10 h-px overflow-hidden bg-champagne lg:mt-12">
        <div ref={fillRef} className="absolute inset-0 origin-left scale-x-0 bg-espresso" />
      </div>
    </>
  );
}
