---
layout: single
title: "BC "
permalink: /bc/
author_profile: true
---

## Overview

This exercise presents a three-year forecast of **British Columbia’s Personal Income Tax (PIT) revenue** for the period **2026–2028**. The objective is to analyze historical revenue patterns and generate forward-looking projections using ETS, ARIMA and SARIMAX.

The visualization included in this page shows historical PIT revenue trends alongside forecasted values and their associated uncertainty bounds.

---

## Data

The dataset is obtained from the **British Columbia Public Accounts**, which provides annual government financial statements and revenue breakdowns.

- Source: BC Public Accounts  
- Frequency: Annual observations  
- Variable: Personal Income Tax revenue (BC)

---

## Forcasting

Three time series forecasting models were applied and compared:

### ETS (Exponential Smoothing)

ETS models capture patterns in time series data by decomposing it into:
- Level (baseline value)
- Trend (long-term direction)
- Seasonality (repeating patterns, if present)

The model assigns exponentially decreasing weights to older observations, making it more responsive to recent changes. the model can be easily applied by using the built-in Forecast Sheet visual tool or by using the core formula: =FORECAST.ETS . 

#### ETS Forecast Results
<div id="chart" style="width:120%;height:450px;"></div>
<script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>
<script src="{{ '/assets/js/bc.js' | relative_url }}"></script>

---

### ARIMA (Autoregressive Integrated Moving Average)

In the second step I'm going to use the ARIMA (Autoregressive Integrated Moving Average) model to forecast British Columbia’s Personal Income Tax revenue. The modeling process was implemented in Python using the "statsmodels" library.
Before fitting the ARIMA model, the time series should be tested for stationarity, I'm using the Augmented Dickey-Fuller (ADF) test for this porpus. Stationarity is required for ARIMA models to ensure consistent statistical properties over time.

```python
# ADF test
from statsmodels.tsa.stattools import adfuller

result = adfuller(y)
print("ADF Statistic:", result[0])
print("p-value:", result[1])
```
p-value is almost 1 so the series is non-stationary and we're gonna apply first-order differencing to stabilize the mean. 
to find the suitable AR and MA terms for the model i'm using the Autocorrelation (ACF) and Partial Autocorrelation (PACF) plots.
```python
import matplotlib.pyplot as plt
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf

fig, axes = plt.subplots(1, 2, figsize=(12, 4))

plot_acf(y_diff, lags=10, ax=axes[0])
axes[0].set_title("ACF (Autocorrelation Function)")

plot_pacf(y_diff, lags=10, ax=axes[1], method="ywm")
axes[1].set_title("PACF (Partial Autocorrelation Function)")

plt.tight_layout()
plt.show()
```

---

### SARIMA (Seasonal ARIMA)

SARIMA extends ARIMA by incorporating seasonal components. It captures:
- Seasonal autoregression
- Seasonal differencing
- Seasonal moving averages

This makes it suitable when revenue data exhibits cyclical or periodic patterns.

---

---

## Forecast

<p align="center">
<img src="/images/BC PIT forecast ETS.png" width="900">
</p>
