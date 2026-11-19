"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

type GalleryThumbnailsProps = {
  images: string[];
  name: string;
  active: number;
  onSelect: (index: number) => void;
  className?: string;
};

/** Thin vertical strip of thumbnails; the image in view is outlined, clicking scrolls to it. */
export function GalleryThumbnails({ images, name, active, onSelect, className }: GalleryThumbnailsProps) {
  return (
    <ul className={cn("grid gap-2", className)} aria-label={`${name} images`}>
      {images.map((src, i) => (
        <li key={i}>
          <button
            type="button"
            onClick={() => onSelect(i)}
            aria-label={`Show image ${i + 1} of ${images.length}`}
            aria-current={i === active ? "true" : undefined}
            className={cn(
              "relative block aspect-4/5 w-full overflow-hidden rounded-sm border bg-ivory transition-colors duration-300",
              i === active ? "border-espresso" : "border-transparent hover:border-champagne",
            )}
          >
            <Image src={src} alt="" fill sizes="56px" className="object-cover" />
          </button>
        </li>
      ))}
    </ul>
  );
}
