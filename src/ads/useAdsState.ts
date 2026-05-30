import useIsPremium from "../app/use-is-premium";
import { ADS_ENABLED, IS_DEV } from "./adsConfig";

export interface AdsState {
  // Premium status has resolved (avoids rendering then yanking ads).
  resolved: boolean;
  // Whether any ad UI (real or dev placeholder) should render.
  showAds: boolean;
  // Whether to load real AdSense ads vs a dev placeholder.
  useReal: boolean;
}

// Single source of truth for ad gating. Ads are hidden for Premium users
// (ad-free is a Premium benefit) and never rendered until premium status is
// known. In development we show placeholders; in production we only show real
// ads when the build flag is enabled.
const useAdsState = (): AdsState => {
  const isPremium = useIsPremium();
  const resolved = isPremium !== null;
  const isFree = resolved && !isPremium;

  const showAds = isFree && (IS_DEV || ADS_ENABLED);
  const useReal = showAds && !IS_DEV && ADS_ENABLED;

  return { resolved, showAds, useReal };
};

export default useAdsState;
