import { announcements } from "@/lib/navigation";
import { getActivePromotion } from "@/lib/promotion";

/** One run of the messages. Repeated so a single copy is wider than any screen. */
function MarqueeGroup({ messages }: { messages: readonly string[] }) {
  const items = [...messages, ...messages];
  return (
    <ul className="flex shrink-0 items-center">
      {items.map((message, i) => (
        <li key={i} className="flex items-center">
          <span className="px-6 sm:px-8">{message}</span>
          <span className="text-champagne">✦</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Thin espresso bar with a slow CSS marquee. Two identical groups translate by -50%,
 * so the loop is seamless. Pauses on hover; static and centred with reduced motion.
 * While a promotion is live, its message leads (data/promotions.ts).
 */
export async function AnnouncementBar() {
  const promo = await getActivePromotion();
  const messages = promo ? [promo.announcement, ...announcements] : announcements;

  return (
    <div
      role="region"
      aria-label="Announcements"
      className="group relative flex h-9 items-center overflow-hidden bg-espresso text-[0.625rem] font-medium uppercase tracking-[0.24em] text-cream sm:text-[0.6875rem]"
    >
      <p className="sr-only">{messages.join(". ")}.</p>

      <div
        aria-hidden
        className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:hidden"
      >
        <MarqueeGroup messages={messages} />
        <MarqueeGroup messages={messages} />
      </div>

      <p aria-hidden className="hidden w-full justify-center motion-reduce:flex">
        <span>{messages[0]}</span>
      </p>
    </div>
  );
}
