"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type MouseEvent } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useLenis } from "@/components/layout/SmoothScroll";
import { cn } from "@/lib/utils";
import { GalleryLightbox } from "./GalleryLightbox";
import { GalleryThumbnails } from "./GalleryThumbnails";

type ProductGalleryProps = {
  images: string[];
  name: string;
};

const imageClass =
  "object-cover opacity-0 transition-[opacity,scale] duration-700 ease-luxe data-[loaded=true]:opacity-100 motion-reduce:transition-none";

/** Mark an image as loaded so it fades in (and stays visible if it was already cached). */
const markLoaded = (e: { currentTarget: HTMLImageElement }) => {
  e.currentTarget.dataset.loaded = "true";
};

/** Cursor-following zoom: point the transform origin at the cursor (scale itself is CSS, hover devices only). */
const followCursor = (e: MouseEvent<HTMLElement>) => {
  const img = e.currentTarget.querySelector("img");
  if (!img) return;
  const r = e.currentTarget.getBoundingClientRect();
  img.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`;
};

/**
 * Desktop: thumbnails strip + images stacked (4:5), zoom on hover, click for the lightbox.
 * Mobile: one-at-a-time Embla carousel with dots; tap for the lightbox.
 */
export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const closeLightbox = useCallback(() => setLightbox(null), []);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const lenis = useLenis();
  const alt = (i: number) => `${name}, image ${i + 1} of ${images.length}`;

  // Desktop: the image crossing the middle of the viewport is the "active" one.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    itemRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [images.length]);

  const scrollToImage = (i: number) => {
    const el = itemRefs.current[i];
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -96, duration: 1 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Mobile carousel
  const [viewportRef, api] = useEmblaCarousel({ align: "start" });
  const subscribe = useCallback(
    (onChange: () => void) => {
      api?.on("select", onChange);
      return () => {
        api?.off("select", onChange);
      };
    },
    [api],
  );
  const slide = useSyncExternalStore(subscribe, () => api?.selectedScrollSnap() ?? 0, () => 0);

  return (
    <div>
      {/* Desktop */}
      <div className="hidden lg:grid lg:grid-cols-[3.5rem_1fr] lg:gap-3">
        <GalleryThumbnails
          images={images}
          name={name}
          active={active}
          onSelect={scrollToImage}
          className="sticky top-[calc(var(--sticky-top)+2rem)] self-start transition-[top] duration-400 ease-luxe"
        />
        <div className="grid gap-2">
          {images.map((src, i) => (
            <button
              key={i}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              type="button"
              data-index={i}
              onClick={() => setLightbox(i)}
              onMouseMove={followCursor}
              aria-label={`Open ${alt(i)} full screen`}
              className="group relative block aspect-4/5 w-full cursor-zoom-in overflow-hidden rounded-sm bg-ivory"
            >
              <Image
                src={src}
                alt={alt(i)}
                fill
                sizes="(min-width: 1024px) 450px, 100vw"
                loading={i === 0 ? "eager" : undefined}
                fetchPriority={i === 0 ? "high" : undefined}
                onLoad={markLoaded}
                className={cn(imageClass, "[@media(hover:hover)]:group-hover:scale-160")}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden">
        <div ref={viewportRef} className="-mx-4 overflow-hidden sm:mx-0" aria-roledescription="carousel" aria-label={`${name} images`}>
          <div className="flex touch-pan-y">
            {images.map((src, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setLightbox(i)}
                aria-label={`Open ${alt(i)} full screen`}
                className="relative aspect-4/5 min-w-0 shrink-0 grow-0 basis-full bg-ivory"
              >
                <Image
                  src={src}
                  alt={alt(i)}
                  fill
                  sizes="100vw"
                  loading={i === 0 ? "eager" : undefined}
                  onLoad={markLoaded}
                  className={imageClass}
                />
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 flex justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => api?.scrollTo(i)}
              aria-label={`Go to image ${i + 1}`}
              aria-current={i === slide ? "true" : undefined}
              className="grid size-6 place-items-center"
            >
              <span
                aria-hidden
                className={cn(
                  "size-1.5 rounded-full transition-colors duration-300",
                  i === slide ? "bg-espresso" : "bg-champagne",
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <GalleryLightbox images={images} name={name} index={lightbox} onChange={setLightbox} onClose={closeLightbox} />
    </div>
  );
}
