import { env } from "./env";

export type GoogleReview = {
  authorName: string;
  authorPhotoUrl: string | null;
  authorProfileUrl: string | null;
  rating: number;
  text: string;
  relativeTime: string;
  publishTime: string;
};

export type GooglePlaceReviewsResult = {
  rating: number | null;
  userRatingCount: number | null;
  googleMapsUri: string | null;
  reviews: GoogleReview[];
};

// Places API (New) returns at most 5 reviews per place — this is a hard
// limit set by Google, not something we can page around.
const FIELD_MASK = "id,displayName,rating,userRatingCount,reviews,googleMapsUri";

// Cache the response in memory. On Vercel this persists for the lifetime of
// a warm serverless instance (often several minutes to hours), which keeps
// us well inside Google's free quota without needing a database round trip.
let cache: { data: GooglePlaceReviewsResult; expiresAt: number } | null = null;
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

export function isGoogleReviewsConfigured() {
  return Boolean(env.googlePlacesApiKey && env.googlePlaceId);
}

export async function fetchGoogleReviews(): Promise<GooglePlaceReviewsResult> {
  if (cache && cache.expiresAt > Date.now()) {
    return cache.data;
  }

  if (!isGoogleReviewsConfigured()) {
    throw new Error(
      "Google Reviews not configured. Set GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID.",
    );
  }

  const url = `https://places.googleapis.com/v1/places/${env.googlePlaceId}`;
  const res = await fetch(url, {
    headers: {
      "X-Goog-Api-Key": env.googlePlacesApiKey,
      "X-Goog-FieldMask": FIELD_MASK,
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Google Places API error (${res.status}): ${body}`);
  }

  const data = (await res.json()) as {
    rating?: number;
    userRatingCount?: number;
    googleMapsUri?: string;
    reviews?: Record<string, any>[];
  };

  const result: GooglePlaceReviewsResult = {
    rating: typeof data.rating === "number" ? data.rating : null,
    userRatingCount:
      typeof data.userRatingCount === "number" ? data.userRatingCount : null,
    googleMapsUri: data.googleMapsUri ?? null,
    reviews: Array.isArray(data.reviews)
      ? data.reviews.map((r: Record<string, any>) => ({
          authorName: r.authorAttribution?.displayName ?? "Google User",
          authorPhotoUrl: r.authorAttribution?.photoUri ?? null,
          authorProfileUrl: r.authorAttribution?.uri ?? null,
          rating: typeof r.rating === "number" ? r.rating : 5,
          text: r.text?.text ?? r.originalText?.text ?? "",
          relativeTime: r.relativePublishTimeDescription ?? "",
          publishTime: r.publishTime ?? "",
        }))
      : [],
  };

  cache = { data: result, expiresAt: Date.now() + CACHE_TTL_MS };
  return result;
}
