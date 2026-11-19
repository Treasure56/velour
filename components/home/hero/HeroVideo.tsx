"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useCanAutoplayVideo } from "@/hooks/useCanAutoplayVideo";
import { hero } from "@/lib/media";
import { cn } from "@/lib/utils";

// Model is on the right; anchor right/top so the hair and lips stay in frame at every ratio.
const framing = "absolute inset-0 size-full object-cover object-[right_top]";

/**
 * Poster first (preloaded, it is the LCP image), then the looping film fades in over it once
 * playing. Reduced motion or Data Saver: the poster stays and no video is requested.
 */
export function HeroVideo() {
  const canPlay = useCanAutoplayVideo();
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Force muted (required for autoplay on iOS) and pause while off-screen to save battery.
  useEffect(() => {
    const video = videoRef.current;
    if (!canPlay || !video) return;
    video.muted = true;
    video.play().catch(() => {});

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, [canPlay]);

  return (
    <div aria-hidden className="absolute inset-0">
      <Image
        src={hero.poster.src}
        alt=""
        fill
        preload
        unoptimized // same URL as the <video poster>, so it downloads once
        sizes="100vw"
        className={framing}
      />
      {canPlay && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={hero.poster.src}
          onPlaying={() => setPlaying(true)}
          className={cn(
            framing,
            "transition-opacity duration-700 ease-luxe",
            playing ? "opacity-100" : "opacity-0",
          )}
        >
          <source media="(max-width: 1023px)" src={hero.video.mobileMp4} type="video/mp4" />
          <source src={hero.video.desktopWebm} type="video/webm" />
          <source src={hero.video.desktopMp4} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
