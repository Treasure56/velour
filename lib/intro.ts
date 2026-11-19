/** Intro loader: shown once per browser session. */
export const INTRO_SEEN_KEY = "velour:intro-seen";

/**
 * Runs in <head> before first paint. If the intro was already seen this session (or the visitor
 * prefers reduced motion), it flags <html> so CSS hides the loader before it can flash.
 */
export const introSeenScript = `try{if(sessionStorage.getItem("${INTRO_SEEN_KEY}")==="1"||matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.setAttribute("data-intro-seen","")}}catch(e){}`;
