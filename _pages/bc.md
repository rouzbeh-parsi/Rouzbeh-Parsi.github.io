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



---

### ARIMA (Autoregressive Integrated Moving Average)

In the second step I'm going to use the ARIMA (Autoregressive Integrated Moving Average) model. The modeling process was implemented in Python using the "statsmodels" library. the code and related figures are provided in the appendix.
Before fitting the ARIMA model, the time series should be tested for stationarity, I used the Augmented Dickey-Fuller (ADF) test for this porpus. Stationarity is required for ARIMA models to ensure consistent statistical properties over time. the test result, showed a p-value to 1 so the series is non-stationary so I applied first-order differencing to stabilize the mean. to find the suitable AR and MA terms for the model I used the Autocorrelation (ACF) and Partial Autocorrelation (PACF) plots. Based on theplots, the first lag for both the MA and AR components appears to be a reasonable specification. in the final step I fit the model to the data and generated forecasts for the next three years.

figure below shows the ACF and PACF plots for our data.
<p align="center">
<img src="/images/test.png" width="900">
</p>

## Results
<div id="chart" style="width:120%;height:450px;"></div>
<script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>
<script src="{{ '/assets/js/bc.js' | relative_url }}"></script>

## Appendix 1: Code and the related plots
The outpot is:
<pre>                               
==============================================================================
Dep. Variable:                    PIT   No. Observations:                   27
Model:                 ARIMA(1, 1, 1)   Log Likelihood                -220.209
Date:                Thu, 25 Jun 2026   AIC                            446.418
Time:                        16:58:32   BIC                            450.192
Sample:                             0   HQIC                           447.505
                                 - 27                                         
Covariance Type:                  opg                                         
==============================================================================
                 coef    std err          z      P>|z|      [0.025      0.975]
------------------------------------------------------------------------------
ar.L1          1.0000      0.009    111.109      0.000       0.982       1.018
ma.L1         -0.9975      0.341     -2.926      0.003      -1.666      -0.329
sigma2      1.285e+06   2.81e-07   4.58e+12      0.000    1.29e+06    1.29e+06
===================================================================================

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
