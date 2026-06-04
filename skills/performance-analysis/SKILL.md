---
name: performance-analysis
description: Route and perform computed performance diagnosis across measurement trust, paid media, lifecycle email, ecommerce, forecasting, attribution, and business-impact interpretation.
---

# performance-analysis

Use this skill when reporting work needs diagnosis beyond a simple metric read.

It covers computed analysis, measurement trust, paid media, Klaviyo, Shopify, attribution, forecasting, and business-impact interpretation.

Do not use this skill to write final report structure. Use `reporting` for reporting output and workflow.

Do not use this skill to access provider APIs directly. Use `accounts-ops` for live provider data.

## purpose

Turn performance movement into a source-backed explanation with the right level of evidence.

## routing

- Use `analysis` for computed comparisons, segmentation, decomposition, cohorts, funnels, anomalies, forecasts, and charts.
- Use `measurement-audit` when source trust, tracking, attribution, UTMs, or platform mismatch affects the answer.
- Use `paid-media-analysis` for Meta Ads, Google Ads, TikTok Ads, spend pacing, ROAS, CAC, creative fatigue, and budget recommendations.
- Use `email-analysis` for Klaviyo campaigns, flows, deliverability, revenue per recipient, list quality, and lifecycle movement.
- Use `commerce-analysis` for Shopify revenue, orders, AOV, refunds, discounts, product mix, customer mix, inventory, and store-level truth.

## workflow

1. Define business question, date window, comparison window, metric, grain, account, provider, and source of truth.
2. Pull the smallest dataset that can answer the question.
3. Validate row count, date coverage, freshness, nulls, duplicates, currency, timezone, attribution window, and obvious outliers.
4. Compare against the right baseline.
5. Segment before concluding when the segment can change the answer.
6. Separate facts, interpretation, confidence, recommendation, and limitations.
7. Use code when calculation, reshaping, validation, forecasting, or charts are clearer and safer in code.

## methods

- Period comparison for direct performance movement.
- Variance decomposition when the total changed and the driver is unclear.
- Funnel analysis when traffic exists at one step but fails at the next step.
- Cohort analysis when new versus returning, retention, repeat purchase, payback, or lifecycle quality matters.
- Lag analysis when paid spend, email sends, search traffic, and revenue may land on different days.
- Anomaly checks against trailing average, same weekday, seasonal baseline, and source freshness.
- Simple forecasts only when data quality and volume support it.

## output

Return the shortest complete answer.

State what changed, why it likely changed, why it matters, what to do next, confidence, and limitations.

Use charts or tables only when they clarify the decision.

