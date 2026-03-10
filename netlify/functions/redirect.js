// netlify/functions/redirect.js

const BASE_URL = "https://ahangama.com";

const UTM_CONFIG = {
  source: "instagram",
  medium: "social",
  campaign: "ahangama_ig_2026",
};

// allowed categories (matches your places structure)
const VALID_CATEGORIES = new Set([
  "eat",
  "stays",
  "experiences",
  "culture",
  "wellness",
  "surf",
  "work-long-stays",
  "getting-around",
  "shops-essentials",
  "community",
  "maps-itineraries",
]);

const sanitize = (value) =>
  value
    ?.toLowerCase()
    .replace(/[^a-z0-9-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

exports.handler = async (event) => {
  try {
    const segments = (event.path || "/")
      .split("/")
      .filter(Boolean)
      .map(sanitize);

    let targetPath = "/";

    // routing logic
    if (segments[0] === "to") {
      const section = segments[1];
      const slug = segments[2];

      if (section === "pass") {
        targetPath = "/pass";
      } else if (section === "guide") {
        targetPath = "/guide";
      } else if (VALID_CATEGORIES.has(section) && slug) {
        targetPath = `/${section}/${slug}`;
      }
    }

    // extract tracking params
    const venue = sanitize(segments[segments.indexOf("v") + 1]);
    const surface = sanitize(segments[segments.indexOf("s") + 1]);
    const creative = sanitize(segments[segments.indexOf("c") + 1]);

    const contentParts = [];
    if (venue) contentParts.push(venue);
    if (surface) contentParts.push(surface);
    if (creative) contentParts.push(creative);

    const utm = new URLSearchParams({
      utm_source: UTM_CONFIG.source,
      utm_medium: UTM_CONFIG.medium,
      utm_campaign: UTM_CONFIG.campaign,
      utm_content: contentParts.join("__") || "instagram",
    });

    const redirectUrl = `${BASE_URL}${targetPath}?${utm.toString()}`;

    return {
      statusCode: 302,
      headers: {
        Location: redirectUrl,
        "Cache-Control": "no-cache",
        "X-Robots-Tag": "noindex, nofollow",
      },
    };
  } catch (error) {
    console.error("IG Redirect Error:", error);

    return {
      statusCode: 302,
      headers: {
        Location: BASE_URL,
      },
    };
  }
};
