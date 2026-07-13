---
name: paid-media-analysis
description: Use when diagnosing paid media performance across Meta Ads, Google Ads, TikTok Ads, or other ad platforms, including pacing, CPA, ROAS, CAC, MER, CTR, CPC, CPM, CVR, fatigue, attribution, and budget decisions.
---

# paid-media-analysis

Use this to diagnose paid media performance.

Do not use it to create or mutate campaigns unless the user explicitly asks and approval is clear.

## Depth

1. Quick read means one platform, one metric, and obvious direction.
2. Diagnostic means spend or efficiency moved, cause is unclear, or recommendation is needed.
3. Deep analysis means budget decision, scale or cut decision, conflicting attribution, forecast, or multi-platform mix shift.

## Workflow

1. Identify platform, account id, date window, comparison window, business goal, and active campaigns.
2. Pull only needed fields through `accounts-ops`.
3. Pair with `measurement-audit` when attribution or tracking could change the answer.
4. Pair with `analysis` for decomposition, fatigue checks, lag, pacing, forecasting, or charts.
5. Explain the mechanism as price, traffic quality, conversion rate, spend mix, creative, audience, landing page, or tracking.

## Minimum diagnostic tree

- Volume means spend, impressions, clicks, conversions, revenue, or conversion value.
- Price means CPM, CPC, and CPA.
- Quality means CTR, CVR, ROAS, and value per conversion.
- Mix means platform, campaign, ad set, ad group, creative, placement, audience, match type, device, and geography.
- Concentration means how much spend or revenue depends on top campaigns or creatives.
- Fatigue means frequency, CTR decay, CPM rise, CVR decay, and creative age.
- Budget pacing means spend versus planned run rate and sudden budget or bid changes.
- Attribution means platform conversions versus Shopify, GA4, or PostHog when available.

## Platform references

Read only the needed provider reference in `/Users/jg/Dev/hellogafaro-accounts/skills/hellogafaro-accounts/references`.

- Meta Ads.
- Google Ads.
- TikTok Ads.

Read `references/diagnostics.md` when performance moved and the driver is not obvious.

## Rules

- Do not optimize for platform ROAS alone when business revenue disagrees.
- Do not blame creative until mix, tracking, and landing page effects were checked enough for the ask.
- Be careful during learning phases, promos, launches, stockouts, and budget shocks.
- Recommendations should specify increase, hold, cut, isolate, refresh, retarget, exclude, or investigate.
