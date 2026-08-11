---
name: commerce-analysis
description: Use when diagnosing Shopify or ecommerce business performance, including revenue, orders, AOV, refunds, discounts, product mix, inventory, new versus returning customers, promo impact, checkout behavior, or margin risk.
---

# commerce-analysis

Use this to understand business performance, not channel-reported performance.

## Depth

1. Quick read means revenue, orders, AOV, product, or customer metric.
2. Diagnostic means business result moved and cause is unclear.
3. Deep analysis means product mix, customer cohort, promo, margin, inventory, or channel attribution decision.

## Workflow

1. Identify account id, date window, comparison window, currency, and business question.
2. Pull Shopify data through `accounts-operations`.
3. Pair with paid media or email skills when diagnosing channel drivers.
4. Pair with `analysis` for cohorts, decomposition, forecasts, or charts.
5. Pair with `measurement-audit` when Shopify and platform data disagree.

## Minimum diagnostic tree

- Revenue, orders, AOV, units, refunds, discounts, taxes, and shipping when relevant.
- New versus returning customers.
- Product, collection, SKU, variant, and bundle mix.
- Promo impact across discount rate, promo window, and full-price versus discounted sales.
- Conversion context when available.
- Operational context such as stockouts, fulfillment, refunds, payment issues, and returns.
- Margin risk when cost or gross margin fields are available.

## References

Read `references/ecommerce-movement.md` when Shopify performance moved and the reason is unclear.

## Rules

- Shopify is usually the revenue source of truth.
- Do not compare gross sales, net sales, and platform conversion value as if they are the same metric.
- Always check whether refunds, discounts, taxes, shipping, and currency matter for the ask.
- Segment before concluding when product mix or customer mix could explain the movement.
