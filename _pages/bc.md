---
layout: archive
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

##Forecast Results

<script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>
<script defer src="/assets/js/bc_forecast.js"></script>

---

### ARIMA (Autoregressive Integrated Moving Average)

ARIMA is a statistical forecasting method that models:
- Autoregression (AR): relationship with past values  
- Integration (I): differencing to achieve stationarity  
- Moving Average (MA): relationship with past errors  

It is widely used for non-seasonal time series forecasting.

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
