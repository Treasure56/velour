"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { textureHref, type Texture } from "@/data/textures";
import { cn } from "@/lib/utils";

const CAN_HOVER = "(hover: hover) and (pointer: fine)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

type TextureCardProps = {
  texture: Texture;
  sizes: string;
};

/**
 * 4:5 texture card; the whole card is one link.
 * Desktop hover: image eases to 1.04, the hover video (if any) fades in and plays, arrow nudges right.
 * Touch devices and reduced motion: image only, the video is never requested.
 */
export function TextureCard({ texture, sizes }: TextureCardProps) {
  const { name, slug, tagline, image, video } = texture;
  const videoRef = useRef<HTMLVideoElement>(null);
  const hoveringRef = useRef(false);
  const pauseTimer = useRef<number | undefined>(undefined);
  const [showVideo, setShowVideo] = useState(false);

  const onEnter = () => {
    const el = videoRef.current;
    if (!el || !matchMedia(CAN_HOVER).matches || matchMedia(REDUCED_MOTION).matches) return;
    hoveringRef.current = true;
    window.clearTimeout(pauseTimer.current);
    // Fade in only once a frame is ready, so there is never a blank flash.
    el.play()
      .then(() => {
        if (hoveringRef.current) setShowVideo(true);
        else el.pause();
      })
      .catch(() => {});
  };

  const onLeave = () => {
    hoveringRef.current = false;
    setShowVideo(false);
    window.clearTimeout(pauseTimer.current);
    // Pause after the fade-out so it doesn't freeze mid-fade.
    pauseTimer.current = window.setTimeout(() => videoRef.current?.pause(), 500);
  };

  return (
    <Link
      href={textureHref(slug)}
      aria-label={`Shop ${name}. ${tagline}`}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className="group relative block aspect-4/5 overflow-hidden rounded-sm bg-mocha"
    >
      <div className="absolute inset-0 transition-transform duration-800 ease-luxe group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100">
        <Image src={image} alt="" fill sizes={sizes} className="object-cover" />
        {video && (
          <div
            className={cn(
              "absolute inset-0 transition-opacity duration-500 ease-luxe",
              showVideo ? "opacity-100" : "opacity-0",
            )}
          >
            <video ref={videoRef} src={video} muted loop playsInline preload="none" className="size-full object-cover" />
          </div>
        )}
      </div>

      {/* Bottom-only scrim so the cream text reads; the media itself is untouched. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-espresso/60 via-espresso/20 to-transparent"
      />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-cream lg:p-6">
        <div>
          <h3 className="font-serif text-[1.75rem] font-normal leading-[1.1]">{name}</h3>
          <p className="mt-1.5 text-[0.8125rem] leading-snug">{tagline}</p>
        </div>
        <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-full border border-cream/60">
          <ArrowRight
            size={16}
            strokeWidth={1.25}
            className="transition-transform duration-500 ease-luxe group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none"
          />
        </span>
      </div>
    </Link>
  );
}
