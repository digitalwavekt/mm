import { createRouter, publicQuery } from "./middleware";
import { fetchGoogleReviews, isGoogleReviewsConfigured } from "./lib/googlePlaces";

export const googleReviewsRouter = createRouter({
  // Public — powers the Reviews section on the homepage. Fails soft: if
  // Google Reviews isn't configured yet, or the Places API call fails,
  // this returns success: false instead of throwing, so the site's own
  // (manually submitted) reviews keep showing instead of breaking the page.
  get: publicQuery.query(async () => {
    if (!isGoogleReviewsConfigured()) {
      return {
        success: false as const,
        configured: false,
        rating: null,
        userRatingCount: null,
        googleMapsUri: null,
        reviews: [],
      };
    }

    try {
      const data = await fetchGoogleReviews();
      return { success: true as const, configured: true, ...data };
    } catch (err) {
      console.error("[googleReviews] fetch failed:", err);
      return {
        success: false as const,
        configured: true,
        rating: null,
        userRatingCount: null,
        googleMapsUri: null,
        reviews: [],
      };
    }
  }),
});
