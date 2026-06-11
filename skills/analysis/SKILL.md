---
name: analysis
description: Use when a question needs computed evidence over data, including period comparison, segmentation, decomposition, cohorts, funnels, anomaly checks, seasonality, forecasting, confidence checks, charts, or tables.
---

# analysis

Use this when judgment depends on computed evidence.

Pair with a domain skill such as `paid-media-analysis`, `email-analysis`, `commerce-analysis`, or `measurement-audit` when the question is about a specific channel.

## Depth

Use the lightest level that can answer the ask.

1. Quick read means one metric, one period, and an obvious answer.
2. Diagnostic means performance moved, money is affected, or cause is unclear.
3. Deep analysis means forecast, high-impact decision, conflicting sources, budget change, strategy call, or messy data.

Do not run every diagnostic by default. Escalate only when the ask or risk justifies it.

## Workflow

1. Define business question, date window, comparison window, metric, grain, and source.
2. Pull data with the smallest provider or Notion request that can answer it.
3. Save raw data in `/tmp`.
4. Keep scratch files out of durable state.
5. Validate row count, date coverage, nulls, duplicates, currency, timezone, attribution window, and obvious outliers.
6. Analyze at the right depth.
7. Return facts, interpretation, confidence, recommendation, and limitations.

## Methods

- Period comparison against prior period, same period last year, target, or trailing average.
- Variance decomposition by channel, campaign, product, segment, device, geography, cohort, or funnel step.
- Funnel analysis for volume, conversion rate, dropoff, and where lost volume came from.
- Cohort analysis for new versus returning, first purchase cohorts, repeat purchase, retention, payback, and LTV movement.
- Lag analysis for paid spend, email sends, search traffic, and revenue that may land on different days.
- Anomaly detection against trailing average, same weekday, seasonal baseline, and source freshness.
- Forecasting with simple baselines first, then stronger models only when data supports them.

## Forecast guardrails

- Do not forecast from broken, tiny, sparse, or structurally changed data without saying the forecast is weak.
- Always compare the forecast against a naive baseline.
- State assumptions, confidence, and what would change the forecast.
- Include confidence bands or a range when possible.
- Mark promo periods, holidays, stockouts, tracking breaks, and campaign launches as structural context.

## Script

For time-series checks, use `scripts/analyze_timeseries.py`.

```bash
python3 skills/analysis/scripts/analyze_timeseries.py \
  --input /tmp/data.csv \
  --date date \
  --metric revenue \
  --grain D \
  --forecast 14
```

The script expects CSV input and writes JSON to stdout.

## Rules

- Never fabricate numbers.
- Separate fact, interpretation, confidence, and recommendation.
- Prefer reproducible code for anything more than simple arithmetic.
- Keep charts minimal and labeled with source, date window, and metric.
- If data quality blocks the answer, say that and recommend the next data fix.
