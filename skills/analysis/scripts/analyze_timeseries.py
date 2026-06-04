#!/usr/bin/env python3
import argparse
import csv
import json
import math
import statistics
from collections import defaultdict
from datetime import datetime, timedelta


def parse_date(value):
    return datetime.fromisoformat(value[:10]).date()


def safe_float(value):
    try:
        if value in ("", None):
            return None
        number = float(value)
        return number if math.isfinite(number) else None
    except Exception:
        return None


def aggregate(rows, date_col, metric_col):
    by_day = defaultdict(float)
    bad = 0
    for row in rows:
        try:
            d = parse_date(row[date_col])
            v = safe_float(row[metric_col])
            if v is None:
                bad += 1
                continue
            by_day[d] += v
        except Exception:
            bad += 1
    return dict(sorted(by_day.items())), bad


def fill_daily(series):
    if not series:
        return []
    start, end = min(series), max(series)
    out = []
    d = start
    while d <= end:
        out.append((d, series.get(d, 0.0)))
        d += timedelta(days=1)
    return out


def moving_average(values, window):
    if not values:
        return None
    window = max(1, min(window, len(values)))
    return sum(values[-window:]) / window


def same_weekday_baseline(points):
    if len(points) < 14:
        return None
    target_weekday = points[-1][0].weekday()
    matches = [v for d, v in points[:-1] if d.weekday() == target_weekday]
    return statistics.mean(matches[-8:]) if matches else None


def zscore_last(values):
    if len(values) < 8:
        return None
    baseline = values[:-1]
    sd = statistics.pstdev(baseline)
    if sd == 0:
        return None
    return (values[-1] - statistics.mean(baseline)) / sd


def forecast(values, days):
    if not values or days <= 0:
        return []
    short = moving_average(values, 7)
    long = moving_average(values, 28)
    baseline = short if long is None else (0.65 * short + 0.35 * long)
    residuals = [v - moving_average(values[: i + 1], min(7, i + 1)) for i, v in enumerate(values)]
    spread = statistics.pstdev(residuals[-28:]) if len(residuals) > 2 else 0
    return [
        {"period": i + 1, "forecast": baseline, "low": baseline - 1.96 * spread, "high": baseline + 1.96 * spread}
        for i in range(days)
    ]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", required=True)
    parser.add_argument("--date", required=True)
    parser.add_argument("--metric", required=True)
    parser.add_argument("--grain", default="D")
    parser.add_argument("--forecast", type=int, default=0)
    args = parser.parse_args()

    with open(args.input, newline="") as f:
        rows = list(csv.DictReader(f))

    daily, bad_rows = aggregate(rows, args.date, args.metric)
    points = fill_daily(daily)
    values = [v for _, v in points]
    missing_days = len([1 for _, v in points if v == 0])

    result = {
        "rows": len(rows),
        "valid_days": len(points),
        "bad_rows": bad_rows,
        "missing_or_zero_days": missing_days,
        "date_start": str(points[0][0]) if points else None,
        "date_end": str(points[-1][0]) if points else None,
        "total": sum(values),
        "latest": values[-1] if values else None,
        "avg_7": moving_average(values, 7),
        "avg_28": moving_average(values, 28),
        "same_weekday_baseline": same_weekday_baseline(points),
        "latest_zscore": zscore_last(values),
        "forecast": forecast(values, args.forecast),
        "warnings": [],
    }

    if len(points) < 14:
        result["warnings"].append("less than 14 daily observations")
    if missing_days / len(points) > 0.2 if points else False:
        result["warnings"].append("more than 20 percent of days are missing or zero")
    if bad_rows:
        result["warnings"].append("some rows could not be parsed")

    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
