import { ArrowLeft, ArrowRight } from "lucide-react";

type SliderControlsProps = {
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
  /** What is being scrolled, for the button labels */
  label: string;
};

const button =
  "grid size-11 place-items-center rounded-full border border-champagne text-espresso transition-colors duration-300 hover:bg-champagne/30 disabled:pointer-events-none disabled:opacity-35 motion-reduce:transition-none";

/** Circular prev/next arrows, disabled at the start and end. */
export function SliderControls({ onPrev, onNext, canPrev, canNext, label }: SliderControlsProps) {
  return (
    <div className="flex gap-2">
      <button type="button" onClick={onPrev} disabled={!canPrev} aria-label={`Previous ${label}`} className={button}>
        <ArrowLeft aria-hidden size={16} strokeWidth={1.25} />
      </button>
      <button type="button" onClick={onNext} disabled={!canNext} aria-label={`Next ${label}`} className={button}>
        <ArrowRight aria-hidden size={16} strokeWidth={1.25} />
      </button>
    </div>
  );
}
