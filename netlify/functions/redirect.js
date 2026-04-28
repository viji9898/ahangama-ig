// netlify/functions/redirect.js

exports.handler = async (event) => {
  const BASE_URL = "https://ahangama.com";

  try {
    const rawPath = (event.path || "/").trim();
    const segments = rawPath.split("/").filter(Boolean);

    const readKV = (key) => {
      const index = segments.indexOf(key);
      return index >= 0 && segments[index + 1] ? segments[index + 1] : null;
    };

    const goal = readKV("g") || "h"; // h = home
    const venue = readKV("v") || "ig-root";
    const entry = readKV("e"); // bio, story, reel, ad
    const creative = readKV("c"); // google-map-v1, coffee-offer-v1, guide-v1

    const contentParts = [venue];
    if (entry) contentParts.push(entry);
    if (creative) contentParts.push(creative);

    const utmParams = new URLSearchParams({
      utm_source: "instagram",
      utm_medium: "social",
      utm_campaign: "ig_launch_2026",
      utm_content: contentParts.join("__"),
      utm_term: goal,
    });

    const incomingQuery = event.queryStringParameters || {};

    Object.entries(incomingQuery).forEach(([key, value]) => {
      if (!key.toLowerCase().startsWith("utm_") && value != null) {
        utmParams.set(key, value);
      }
    });

    const redirectUrl = `${BASE_URL}/?${utmParams.toString()}`;

    return {
      statusCode: 302,
      headers: {
        Location: redirectUrl,
        "Cache-Control": "no-cache, no-store, must-revalidate",
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
