---
layout: single
title: "BC "
permalink: /bc/
author_profile: true
mathjax: true
---
<script>
window.MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']],
    displayMath: [['$$', '$$']]
  }
};
</script>

<script async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
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
For a simple additive ETS model, the forecast is updated recursively as

\[
\hat{y}_{t+1}= \alpha y_t + (1-\alpha)\hat{y}_t,
\tag{1}
\]

where:

- \(y_t\) is the observed value at time \(t\),
- \(\hat{y}_t\) is the estimated level,
- \(\alpha\) is the smoothing parameter \((0<\alpha<1)\).


---

### ARIMA (Autoregressive Integrated Moving Average)

In the second step I'm going to use the ARIMA (Autoregressive Integrated Moving Average) model. The modeling process was implemented in Python using the "statsmodels" library. the code and related figures are provided in the appendix.
Before fitting the ARIMA model, the time series should be tested for stationarity, I used the Augmented Dickey-Fuller (ADF) test for this porpus. Stationarity is required for ARIMA models to ensure consistent statistical properties over time. the test result, showed a p-value to 1 so the series is non-stationary so I applied first-order differencing to stabilize the mean. to find the suitable AR and MA terms for the model I used the Autocorrelation (ACF) and Partial Autocorrelation (PACF) plots. Based on theplots, the first lag for both the MA and AR components appears to be a reasonable specification. in the final step I fit the model to the data and generated forecasts for the next three years.
After first differencing, the ARIMA model is

\[
\Delta y_t
=
c
+
\phi_1 \Delta y_{t-1}
+
\theta_1 \varepsilon_{t-1}
+
\varepsilon_t,
\tag{2}
\]

where:

- \(\Delta y_t=y_t-y_{t-1}\) is the first difference,
- \(\phi_1\) is the autoregressive coefficient,
- \(\theta_1\) is the moving-average coefficient,
- \(\varepsilon_t\) is the random error

---
### SARIMAX (Seasonal ARIMA with Exogenous Variables)

The SARIMAX model extends the ARIMA framework by incorporating **exogenous (external) variables** that may influence the time series. In this analysis, **inflation** and **GDP growth** were included as exogenous predictors.

The modeling process is very similar to the ARIMA methodology described above, with the addition of these external variables. The detailed implementation and model specification are provided in the Appendix.

Although SARIMAX can improve in-sample forecasting when reliable external variables are available, I did not select it as the primary forecasting model for this project. Producing **ex ante forecasts** requires future values of the exogenous variables (inflation and GDP growth), which must themselves be forecast or obtained from another source. This additional dependency introduces extra uncertainty and reduces the model's practicality for independent long-term revenue forecasting.

For this reason, the ETS and ARIMA models were preferred for the primary analysis, as they can generate forecasts directly from the historical PIT time series without requiring forecasts of external variables.

\[
\Delta y_t
=
c
+
\phi_1 \Delta y_{t-1}
+
\theta_1 \varepsilon_{t-1}
+
\beta_1X_{1,t}
+
\beta_2X_{2,t}
+
\varepsilon_t,
\tag{3}
\]

where:

- \(X_{1,t}\) is the inflation rate,
- \(X_{2,t}\) is GDP growth,
- \(\beta_1\) and \(\beta_2\) measure the effects of the exogenous variables.
---
## Results
The results can be compared in the graph below. As can be seen, ARIMA and ETS produce very similar outcomes, while SARIMAX yields slightly lower predictions.
<div id="chart" style="width:120%;height:450px;"></div>
<script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>
<script src="{{ '/assets/js/bc.js' | relative_url }}"></script>

## Appendix 1: Code and the related plots

### Code

```python
import pandas as pd
import numpy as np

import matplotlib.pyplot as plt

from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.stattools import adfuller

from statsmodels.graphics.tsaplots import plot_acf, plot_pacf

# Getting data
df = pd.read_excel("data.xlsx")

df = df.set_index("year")
y = df["PIT"]

# ADF test
y= y.loc[:2025]
result = adfuller(y)

print("ADF Statistic:", result[0])
print("p-value:", result[1])

# difference the series first
y_diff = y.diff().dropna()
result1= adfuller(y_diff)

print("ADF Statistic:", result1[0])
print("p-value:", result1[1])
```
<pre>
ADF Statistic: 3.0510245117045023
p-value: 1.0
ADF Statistic (y_diff): -4.853524168075111
p-value (y_diff): 4.291531922202673e-05
</pre>
```python
# ACF & PACF
fig, axes = plt.subplots(1, 2, figsize=(12, 4))

# ACF plot
plot_acf(y_diff, lags=10, ax=axes[0])
axes[0].set_title("ACF (Autocorrelation Function)")

# PACF plot
plot_pacf(y_diff, lags=10, ax=axes[1], method="ywm")
axes[1].set_title("PACF (Partial Autocorrelation Function)")

plt.tight_layout()
plt.show()
```


<p align="center">
<img src="/images/test.png" width="900">
</p>


```python
# Fit model (already done in your case)
final_model = ARIMA(y, order=(1,1,1))
final_results = final_model.fit()
print(final_results.summary())

# Forecast next 3 steps
forecast_result = final_results.get_forecast(steps=3)

# Mean forecast
forecast_mean = forecast_result.predicted_mean

# 95% confidence interval
conf_int = forecast_result.conf_int(alpha=0.05)

print("Forecast:")
print(forecast_mean)

print("\n95% Confidence Interval:")
print(conf_int)
```

<pre>                               
SARIMAX Results                                
==============================================================================
Dep. Variable:                    PIT   No. Observations:                   27
Model:                 ARIMA(1, 1, 1)   Log Likelihood                -220.209
Date:                Tue, 30 Jun 2026   AIC                            446.418
Time:                        10:55:39   BIC                            450.192
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
Ljung-Box (L1) (Q):                   0.05   Jarque-Bera (JB):                 3.21
Prob(Q):                              0.82   Prob(JB):                         0.20
Heteroskedasticity (H):               5.92   Skew:                             0.84
Prob(H) (two-sided):                  0.01   Kurtosis:                         3.42
===================================================================================

Forecast:
2026    17420.588161
2027    17815.163161
2028    18209.725001
Name: predicted_mean, dtype: float64

95% Confidence Interval:
         lower PIT     upper PIT
2026  15171.587536  19669.588786
2027  14593.088572  21037.237750
2028  14213.311847  22206.138155
</pre> 
```python
# SARIMAX MODEL

from statsmodels.tsa.statespace.sarimax import SARIMAX

#  Inflation and GDP growth were included as exogenous predictors
X = df[["INF","RG"]]


X_Historical = X.loc[:2025]
X_forecast = X.loc[2026:2028]

model = SARIMAX(
    y,
    exog=X_Historical,
    order=(1,1,1)
)

results = model.fit()

print(results.summary())
```
<pre>  
SARIMAX Results                                
==============================================================================
Dep. Variable:                    PIT   No. Observations:                   27
Model:               SARIMAX(1, 1, 1)   Log Likelihood                -215.169
Date:                Tue, 30 Jun 2026   AIC                            440.338
Time:                        11:01:42   BIC                            446.629
Sample:                             0   HQIC                           442.150
                                 - 27                                         
Covariance Type:                  opg                                         
==============================================================================
                 coef    std err          z      P>|z|      [0.025      0.975]
------------------------------------------------------------------------------
INF          458.5382    149.896      3.059      0.002     164.748     752.329
RG          5153.1093   1.07e+04      0.482      0.630   -1.58e+04    2.61e+04
ar.L1          0.9872      0.194      5.090      0.000       0.607       1.367
ma.L1         -0.9402      0.480     -1.959      0.050      -1.881       0.000
sigma2      8.877e+05   3.68e+05      2.410      0.016    1.66e+05    1.61e+06
===================================================================================
Ljung-Box (L1) (Q):                   0.11   Jarque-Bera (JB):                 0.45
Prob(Q):                              0.74   Prob(JB):                         0.80
Heteroskedasticity (H):               1.67   Skew:                            -0.16
Prob(H) (two-sided):                  0.46   Kurtosis:                         2.44
===================================================================================
</pre>
  
```python
forecast = results.get_forecast(
    steps=len(X_forecast),
    exog=X_forecast
)

pred = forecast.predicted_mean
print(pred)
```
<pre>  
2026    17240.688393
2027    17627.008740
2028    18068.150743
Name: predicted_mean, dtype: float64
</pre>
