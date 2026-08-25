---
name: email-analysis
description: Use when diagnosing Klaviyo, email, SMS, or lifecycle marketing performance, including campaigns, flows, deliverability, revenue per recipient, clicks, conversions, unsubscribes, spam, segment quality, or attribution.
---

# email-analysis

Use this to inspect email and lifecycle performance.

## Depth

1. Quick read means one campaign, flow, or metric.
2. Diagnostic means revenue, engagement, deliverability, or segment quality moved.
3. Deep analysis means flow health, lifecycle revenue, promo impact, cohort impact, or cross-channel attribution conflict.

## Workflow

1. Identify account id, date window, comparison window, campaign or flow scope, and business question.
2. Pull needed Klaviyo data through `accounts-operations`.
3. Pair with `commerce-analysis` when email revenue needs Shopify validation.
4. Pair with `measurement-audit` when attribution or tracking is suspect.
5. Pair with `analysis` for cohorts, time series, segmentation, or forecasting.

## Minimum diagnostic tree

- Sends, delivered, bounced, spam complaints, and unsubscribes.
- Opens, clicks, click-to-open, conversion, revenue, and revenue per recipient.
- Campaign versus flow revenue.
- Flow step performance for welcome, abandoned cart, browse abandonment, post-purchase, replenishment, and winback.
- Segment quality across list growth, suppression, engaged segment size, and buyer versus non-buyer split.
- Offer and calendar context across promo timing, discount depth, product focus, and send frequency.
- Fatigue through engagement decay, unsubscribe rise, spam rise, and revenue per recipient decay.

## References

Read `references/lifecycle.md` when campaign or flow movement needs deeper lifecycle diagnosis.

## Rules

- Do not treat opens as a reliable primary metric when privacy effects may distort them.
- Revenue per recipient is usually more useful than total attributed revenue for campaign quality.
- Separate list-size effects from message-quality effects.
- Use Shopify as final revenue context when the question is business impact.
