# attribution and tracking checks

Use this when channel data and business data disagree.

## Definition mismatches

- Platform conversion value often uses attribution windows and modeled conversions.
- Shopify revenue may include or exclude discounts, refunds, taxes, shipping, and gift cards depending on the query.
- GA4 revenue can miss consent-restricted, blocked, or server-side-only events.
- PostHog can be better for behavioral funnels but not always final revenue.
- Search Console is click and query data, not revenue truth.

## Time mismatches

- Platform conversions may be credited to click date or conversion date.
- Shopify revenue lands on order date.
- GA4 and PostHog depend on event timestamp and property timezone.
- Search Console data can be delayed and may be preliminary.

## Identity mismatches

- Cross-device behavior breaks user joins.
- Consent mode, ad blockers, and cookie limits reduce web analytics completeness.
- Returning customers can be over-credited by retargeting.
- Email and paid platforms may both claim the same order.

## Decision rule

Use the source that matches the question:

- Business revenue: Shopify.
- Channel delivery and cost: ad platform or Klaviyo.
- Web behavior: GA4 or PostHog.
- Organic search demand: Search Console.
- Cross-source decision: reconcile definitions before recommending action.
