---
name: measurement-audit
description: Use when work involves data trust, attribution, tracking, UTMs, GA4, PostHog, Search Console freshness, conversion events, duplicate or missing events, or platform versus store reconciliation.
---

# measurement-audit

Use this before trusting numbers when sources conflict, tracking changed, attribution matters, or the decision is high impact.

## Depth

1. Quick trust check verifies source freshness, date window, and obvious mismatches.
2. Diagnostic audit compares platform, Shopify, GA4, PostHog, and event definitions.
3. Deep audit inspects event paths, UTMs, conversion definitions, attribution windows, and source-specific limits.

## Checks

- Date and timezone alignment.
- Currency and tax, shipping, refund treatment.
- Attribution window and conversion definition.
- Primary versus all conversions.
- Duplicate events, missing events, delayed conversions, and consent loss.
- UTM consistency across source, medium, campaign, content, and term.
- Landing page and checkout event continuity.
- Platform revenue versus Shopify revenue versus GA4 or PostHog revenue.
- Search Console freshness and final versus fresh data.

## Provider routes

- GA4 and Search Console use `accounts-ops`, then the matching provider reference in the owning repo.
- PostHog uses Accounts Ops for HogQL event, session, funnel, retention, and attribution inspection.
- Shopify is commerce truth for orders, revenue, refunds, and discount context when available.
- Ad platforms and Klaviyo are channel truth, not final business truth.

## References

Read `references/attribution.md` when source definitions or attribution windows could change the answer.

## Rules

- Do not call data wrong until you identify the mismatch type.
- Do not reconcile metrics with different definitions as if they should match exactly.
- If tracking is broken, stop deep performance interpretation and report the trust gap.
- Record limitations in the answer, not as a footnote after confident claims.
