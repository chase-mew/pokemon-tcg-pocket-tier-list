import github from "../assets/github.svg";
import twitter from "../assets/twitter.svg";

export const CARDS_URL =
  "https://raw.githubusercontent.com/chase-manning/pokemon-tcg-pocket-cards/refs/heads/main/v4.json";
export const EXPANSIONS_URL =
  "https://raw.githubusercontent.com/chase-manning/pokemon-tcg-pocket-cards/refs/heads/main/expansions.json";
export const GITHUB_URL =
  "https://github.com/chase-manning/pokemon-tcg-pocket-tier-list";
export const TWITTER_URL = "https://x.com/pocketdecks";
// Stripe Price IDs for the Premium subscription.
//
// Stripe prices are immutable — the amount of an existing price cannot be
// edited. To reprice Premium we create NEW prices in Stripe ($3/mo, $18/yr)
// and swap the IDs below. Leave the OLD $1/mo and $6/yr prices ACTIVE in
// Stripe (just no longer referenced here): existing subscribers stay on their
// original price until they cancel, which is exactly how grandfathering works.
// Do NOT use Stripe's "update subscriptions to this price" migration tools.
//
// The 7-day free trial is set in code (see FREE_TRIAL_DAYS) by passing
// `trial_period_days` on the checkout session document root; the extension
// forwards it to subscription_data.trial_period_days. No Stripe price
// configuration is required.
//
// Legacy prices (kept active in Stripe for grandfathered subscribers, no longer
// referenced here): $1/mo price_1RXU5FBIHa8JB5eJAkWt6cRp, $6/yr
// price_1RXgpJBIHa8JB5eJKys9UK8W.
export const MONTHLY_PRICE_ID = "price_1TeE4nBIHa8JB5eJZKGmmZSM"; // $3/mo
export const YEARLY_PRICE_ID = "price_1TeE57BIHa8JB5eJbycZcro1"; // $18/yr

// Free trial length (days) applied to new subscriptions. The Firebase Stripe
// extension reads `trial_period_days` from the checkout session document root
// and maps it to subscription_data.trial_period_days — so the trial is set
// here in code, not on the Stripe price. Set to 0 to disable.
export const FREE_TRIAL_DAYS = 7;
export const MANAGE_SUBSCRIPTION_URL =
  "https://billing.stripe.com/p/login/4gM9ASeDk2QcaKq2Y957W00";
export const FREE_DECK_AMOUNT = 30;

export const SOCIALS = [
  {
    url: GITHUB_URL,
    icon: github,
    alt: "GitHub",
    label: "View source code on GitHub",
  },
  {
    url: TWITTER_URL,
    icon: twitter,
    alt: "Twitter",
    label: "Follow us on Twitter",
  },
];
