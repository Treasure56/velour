/**
 * Newsletter sign-up. Currently a mock (no backend): it waits ~800ms and succeeds.
 *
 * To connect a real service (Mailchimp, Klaviyo, ...), replace the body of
 * `subscribeToNewsletter` with a call to your own Route Handler or Server Action that talks
 * to the provider. Keep API keys on the server; never call the provider from the browser.
 */

export type SubscribeResult = { ok: true } | { ok: false; error: string };

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export async function subscribeToNewsletter(email: string): Promise<SubscribeResult> {
  if (!isValidEmail(email)) {
    return { ok: false, error: "That email doesn't look quite right. Please check it and try again." };
  }
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { ok: true };
}
