# Ahangama Instagram Redirect & Tracking Service

Production redirect infrastructure used to power **Instagram campaign tracking** for Ahangama.com.

This service converts clean Instagram links into fully attributed URLs with **UTM analytics**, allowing Ahangama to measure:

- Instagram campaign performance
- Venue discovery traffic
- Pass purchase attribution
- Content format performance
- Influencer campaign results

The system runs as a **Netlify Serverless Function** and serves links under:

https://ig.ahangama.com

---

# Overview

Instagram links typically lack reliable tracking.

This redirect service solves that problem by:

1. Providing **clean shareable links**
2. Automatically generating **UTM parameters**
3. Standardizing **campaign attribution**
4. Allowing **structured analytics for growth teams**

Example:

Instagram link

https://ig.ahangama.com/to/pass/s/story

Redirects to

https://ahangama.com/pass

?utm_source=instagram
&utm_medium=social
&utm_campaign=ahangama_ig_2026
&utm_content=story

---

# System Architecture

Instagram
↓
ig.ahangama.com link
↓
Netlify Redirect Function
↓
ahangama.com destination + UTM parameters
↓
Analytics Platform (GA4 / PostHog / Amplitude)

The redirect function processes the URL path and generates the final destination URL.

---

# Repository Structure

netlify/
functions/
redirect.js

README.md

The redirect logic is implemented in:

netlify/functions/redirect.js

---

# Core Routing System

The redirect service uses a structured routing format.

/to/{destination}
/to/{category}/{slug}

This keeps links clean while still providing flexible routing.

---

# Route Types

## Pass Page

/to/pass

Example

https://ig.ahangama.com/to/pass

Redirects to

https://ahangama.com/pass

---

## Guide Page

/to/guide

Example

https://ig.ahangama.com/to/guide

Redirects to

https://ahangama.com/guide

---

## Venue Pages

Format

/to/{category}/{slug}

Example

https://ig.ahangama.com/to/eat/kaffi-ahangama

Redirects to

https://ahangama.com/eat/kaffi-ahangama

---

# Supported Categories

Categories mirror the Ahangama venue taxonomy.

eat
stays
experiences
culture
wellness
surf
work-long-stays
getting-around
shops-essentials
community
maps-itineraries

Each category corresponds to a section of the Ahangama guide.

---

# UTM Tracking Strategy

All redirects automatically append standardized UTM parameters.

## Default UTM Parameters

utm_source=instagram
utm_medium=social
utm_campaign=ahangama_ig_2026

---

# UTM Content Generation

The `utm_content` parameter is generated from optional path segments.

Format:

utm_content={venue}{surface}{creative}

Example

utm_content=kaffi\_\_reel

---

# Optional Tracking Segments

Tracking parameters can be embedded in the URL.

| Segment | Meaning          |
| ------- | ---------------- |
| v       | venue identifier |
| s       | content surface  |
| c       | creative variant |

Example

/v/kaffi
/s/reel
/c/summer

Full example

https://ig.ahangama.com/to/eat/kaffi-ahangama/v/kaffi/s/reel/c/summer

Redirect result

utm_content=kaffi**reel**summer

---

# Instagram Surface Tracking

Recommended values for `s`.

reel
carousel
story
post
bio
highlight
dm
ad

These values allow Ahangama to measure which content formats perform best.

---

# Example Links

## Instagram Bio

https://ig.ahangama.com/to/pass/s/bio

---

## Reel promoting a venue

https://ig.ahangama.com/to/eat/kaffi-ahangama/v/kaffi/s/reel

---

## Carousel post about Samba

https://ig.ahangama.com/to/stays/samba/v/samba/s/carousel

---

## Story promoting pass purchase

https://ig.ahangama.com/to/pass/s/story

---

# Analytics Use Cases

This system enables several critical growth insights.

---

## Venue Discovery Tracking

Example report

| Venue     | Instagram Clicks |
| --------- | ---------------- |
| Kaffi     | 320              |
| Samba     | 150              |
| Board Hut | 90               |

This helps determine which venues drive discovery.

---

## Content Format Performance

Example report

| Format   | Clicks |
| -------- | ------ |
| Reel     | 1200   |
| Carousel | 700    |
| Story    | 500    |

---

## Campaign Attribution

Example

| Campaign    | Pass Sales |
| ----------- | ---------- |
| Launch Week | 82         |
| Summer Push | 130        |

---

# Link Generation Guidelines

To maintain consistent analytics, follow these rules.

### Always use `/to/`

Correct

ig.ahangama.com/to/pass

Incorrect

ig.ahangama.com/pass

---

### Always use canonical venue slugs

Example

kaffi-ahangama
samba-ahangama
board-hut

These should match the slugs used on Ahangama.com.

---

### Always track Instagram format

Add a surface parameter when possible.

Example

/s/reel
/s/story
/s/carousel

---

# Operational Workflow

Typical marketing workflow.

1. Create Instagram content
2. Generate tracking link
3. Add link to caption, story, or bio
4. Monitor analytics dashboard

Example workflow

Post: Reel about Kaffi
Link: ig.ahangama.com/to/eat/kaffi-ahangama/s/reel

---

# Security & SEO

The redirect function includes:

X-Robots-Tag: noindex, nofollow

This prevents redirect links from being indexed by search engines.

All URL segments are sanitized before generating redirects.

---

# Error Handling

If an invalid path is provided, the system redirects to:

https://ahangama.com

---

# Deployment

The redirect service deploys automatically through Netlify.

Deployment process

git add netlify/functions/redirect.js
git commit -m "update redirect logic"
git push

Netlify will automatically deploy the updated function.

---

# Future Improvements

Several enhancements may be added.

---

## Automatic Venue Detection

Currently

/to/eat/kaffi-ahangama/v/kaffi

Future version

/to/eat/kaffi-ahangama

The venue identifier will be extracted automatically.

---

## Link Aliases

Example

ig.ahangama.com/pass
ig.ahangama.com/kaffi
ig.ahangama.com/samba

Aliases would internally redirect to structured routes.

---

## Redirect Logging

Store redirect events for deeper analytics.

Example metrics

| Venue | Clicks | Pass Sales |
| ----- | ------ | ---------- |
| Kaffi | 320    | 18         |
| Samba | 150    | 5          |

---

# Maintainers

Ahangama.com  
Tech For Good Pvt Ltd

---

# License

Internal infrastructure used for Ahangama.com growth analytics and campaign tracking.
