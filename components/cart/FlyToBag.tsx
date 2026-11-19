/**
 * Layer the fly-to-bag image travels in (above everything, never catches clicks).
 * The flight itself lives in hooks/useFlyToBag.ts.
 */
export function FlyToBag() {
  return <div id="fly-to-bag-layer" aria-hidden className="pointer-events-none fixed inset-0 z-90" />;
}
