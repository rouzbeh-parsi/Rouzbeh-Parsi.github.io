---
layout: archive
title: "Drug Policy Analysis Dashboard"
permalink: /drug-dashboard/
author_profile: true
mathjax: false
---

## Overview

This project examines the evolution of drug-related mortality in British Columbia in the context of a major public health policy intervention aimed at addressing the opioid crisis. The analysis focuses on monthly drug-related death counts and evaluates how trends change before, during, and after the introduction of the policy framework.

The dataset spans from January 2015 to January 2026, providing a long-term view of structural changes in mortality patterns. This time frame allows for both pre-policy baseline behavior and post-policy outcome assessment, capturing medium- to long-term effects rather than short-term fluctuations.

The key policy intervention period begins in January 2023, marking the implementation phase of decriminalization and related harm-reduction strategies. The period from 2015 to 2022 is treated as the pre-policy baseline, while 2023 onward represents the post-intervention environment. This structure enables comparison of trends across distinct policy regimes and supports evaluation of whether observed changes in mortality align with the timing of policy adoption.

## Data

The dataset used in this analysis consists of monthly counts of unregulated drug toxicity deaths in British Columbia, sourced from the BC Coroners Service (BCCS). These records capture confirmed deaths where unregulated toxic drug supply is identified as a contributing cause.

The data is reported on a monthly basis, allowing for high-frequency time-series analysis of trends in mortality over time. This structure makes it suitable for evaluating both short-term fluctuations and longer-term structural changes associated with public health interventions and policy shifts.


<div id="debug"></div>
<div id="drug_chart" style="width:105%;height:650px;"></div>

<script>
window.DRUG_DATA = {{ site.data.drug | jsonify }};
</script>

<script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>


<script>
window.addEventListener("load", function () {
    const rawData = window.DRUG_DATA;

    if (!rawData || rawData.length === 0) {
        document.getElementById("debug").innerHTML = "Error: No data found.";
        return;
    }


    const x = rawData.map(function (d) {
        return new Date(d.DeathYear, d.Month - 1, 1);
    });

    const y = rawData.map(function (d) {
        return Number(d.Frequency);
    });

    const policyStart = new Date(2023, 0, 1);
    const policyEnd = new Date(2026, 0, 1);

    Plotly.newPlot("drug_chart", [
        {
            x: x,
            y: y,
            mode: "lines+markers",
            name: "Observed deaths",
            line: { color: "#2563eb", width: 2 },
            marker: { size: 6 }
        }
    ], {
        title: {
            text: "Drug-related Deaths in BC",
            font: { size: 22, color: "#222" },
            x: 0.5
        },

        font: {
            color: "#222"
        },

        margin: {
            l: 80,
            r: 40,
            t: 90,
            b: 80
        },

        xaxis: {
            title: {
                text: "Date",
                font: { size: 16, color: "#222" }
            },
            type: "date",
            tickfont: { color: "#222" }
        },

        yaxis: {
            title: {
                text: "Deaths",
                font: { size: 16, color: "#222" }
            },
            tickfont: { color: "#222" }
        },

        hovermode: "x unified",

        shapes: [
            {
                type: "rect",
                xref: "x",
                yref: "paper",
                x0: policyStart,
                x1: policyEnd,
                y0: 0,
                y1: 1,
                fillcolor: "rgba(255, 0, 0, 0.08)",
                line: { width: 0 }
            },
            {
                type: "line",
                x0: policyStart,
                x1: policyStart,
                y0: 0,
                y1: 1,
                xref: "x",
                yref: "paper",
                line: { color: "red", width: 2, dash: "dash" }
            },
            {
                type: "line",
                x0: policyEnd,
                x1: policyEnd,
                y0: 0,
                y1: 1,
                xref: "x",
                yref: "paper",
                line: { color: "red", width: 2, dash: "dash" }
            }
        ],

        annotations: [
            {
                x: policyStart,
                y: 1,
                xref: "x",
                yref: "paper",
                text: "Policy Start (Jan 2023)",
                showarrow: false,
                yanchor: "bottom",
                font: { color: "red" }
            },
            {
                x: policyEnd,
                y: 1,
                xref: "x",
                yref: "paper",
                text: "Policy End (Jan 2026)",
                showarrow: false,
                yanchor: "bottom",
                font: { color: "red" }
            }
        ]
    }, {
        responsive: true
    });
});
</script>

## Methodology: Interrupted Time Series Regression

To evaluate the potential impact of the policy intervention, this project uses an interrupted time-series (ITS) regression model. This approach is widely used in policy evaluation because it allows us to distinguish between pre-existing trends and changes that occur after an intervention. Rather than modeling raw death counts directly, the model uses the natural logarithm of monthly deaths, which stabilizes variance and allows coefficients to be interpreted approximately as percentage changes. 

Model specification:

log(Deaths_t) = β0 + β1 * Time_t + β2 * Policy_t + β3 * PolicyTime_t + ε_t

Variables:

- Deaths_t: Monthly number of unregulated drug toxicity deaths in month t.

- Time_t: A continuous time index starting from the first observation.

- Policy_t (policy indicator): A binary variable indicating whether the policy is in effect:

- Policy_t: This captures the immediate level shift after policy introduction (0  before Jan 2023, 1  from Jan 2023 to Dec 2025, 0  from Jan 2026 onward).

- PolicyTime_t (post-policy trend counter): A variable counting time since policy implementation, this captures changes in trend after the intervention.

Since changes in drug-related mortality are unlikely to occur immediately following policy implementation, the primary analysis assumes a 6-month implementation lag. Under this assumption, the policy is modeled as beginning to influence outcomes in July 2023, although it officially came into effect in January 2023. To evaluate the robustness of the findings, a sensitivity analysis will also be conducted using alternative lag assumptions.

## Results

The interrupted time-series regression model was estimated using RStudio. Data preparation, variable construction, model estimation, and diagnostic analyses were performed in R. The complete R script used for data processing, model specification, estimation, and visualization is included in Appendix 1. 

<div id="policy_model_chart" style="width:108%;height:650px;"></div>

The primary analysis assumes a 6-month implementation lag, with the policy effect beginning in July 2023. This specification was selected because changes in drug-related mortality are unlikely to occur immediately following implementation, as behavioral adaptation, service uptake, and changes in the unregulated drug supply may require time before measurable effects are observed.

The interrupted time-series model indicates that, prior to the policy period, monthly drug-related deaths were increasing at an average rate of 1.16% per month (p < 0.001), reflecting a statistically significant upward trend.

The estimated immediate level change following the assumed policy effect was an increase of 12.8%. However, this effect was not statistically significant, suggesting insufficient evidence of an immediate change in mortality levels when the policy began to influence outcomes.

More importantly, the estimated trend change during the policy period was −2.83% per month (p < 0.001). This indicates that the monthly growth rate in drug-related deaths slowed significantly following the intervention. Although deaths did not immediately decline, the rate at which they were increasing became substantially lower than during the pre-policy period.

Overall, the model estimates an average reduction of approximately 23.2% in drug-related deaths over the policy period relative to the counterfactual trend that would have been expected in the absence of the intervention. While this finding suggests that the policy may have contributed to moderating the upward trajectory of mortality, it should be interpreted as an observational association rather than definitive evidence of causality

<div id="sensitivity_table"></div>

<script>
window.addEventListener("load", function () {
    const modelData = {{ site.data.policy_main_model_plot_data | jsonify }};
    const sensitivityData = {{ site.data.policy_sensitivity_analysis | jsonify }};

    const policyStart = new Date(2023, 0, 1);
    const policyEnd = new Date(2026, 0, 1);
    const effectStart = new Date(2023, 6, 1);
    const fittedModelEnd = new Date(2025, 10, 1); 

    if (!modelData || modelData.length === 0) {
        document.getElementById("policy_model_chart").innerHTML = "Error: No policy model data found.";
        return;
    }

    const x = modelData.map(function (d) {
        return new Date(d.date);
    });

    const deaths = modelData.map(function (d) {
        return Number(d.deaths);
    });

    const fittedDeaths = modelData.map(function (d) {
    const date = new Date(d.date);

    if (date >= fittedModelEnd) {
        return null;
    }

    return Number(d.fitted_deaths);
});

    const counterfactualDeaths = modelData.map(function (d) {
        return Number(d.counterfactual_deaths);
    });


    Plotly.newPlot("policy_model_chart", [
        {
            x: x,
            y: deaths,
            mode: "lines+markers",
            name: "Observed deaths",
            line: { color: "#2563eb", width: 2 },
            marker: { size: 5 },
            hovertemplate: "%{x|%b %Y}<br>Observed deaths: %{y:.0f}<extra></extra>"
        },
        {
            x: x,
            y: fittedDeaths,
            mode: "lines",
            name: "Model fitted deaths",
            line: { color: "#dc2626", width: 3 },
            hovertemplate: "%{x|%b %Y}<br>Fitted deaths: %{y:.1f}<extra></extra>"
        },
        {
            x: x,
            y: counterfactualDeaths,
            mode: "lines",
            name: "Counterfactual without policy effect",
            line: { color: "#6b7280", width: 3, dash: "dash" },
            hovertemplate: "%{x|%b %Y}<br>Counterfactual deaths: %{y:.1f}<extra></extra>"
        }
    ], {
        title: {
            text: "Interrupted Time-Series Model with Delayed Policy Effect",
            font: { size: 22, color: "#222" },
            x: 0.5
        },

        font: { color: "#222" },

        margin: {
            l: 80,
            r: 40,
            t: 90,
            b: 80
        },

        xaxis: {
            title: { text: "Date", font: { size: 16, color: "#222" } },
            type: "date",
            tickfont: { color: "#222" }
        },

        yaxis: {
            title: { text: "Deaths", font: { size: 16, color: "#222" } },
            tickfont: { color: "#222" }
        },

        hovermode: "x unified",

        shapes: [
            {
                type: "rect",
                xref: "x",
                yref: "paper",
                x0: policyStart,
                x1: policyEnd,
                y0: 0,
                y1: 1,
                fillcolor: "rgba(255, 0, 0, 0.08)",
                line: { width: 0 }
            },
            {
                type: "line",
                x0: policyStart,
                x1: policyStart,
                y0: 0,
                y1: 1,
                xref: "x",
                yref: "paper",
                line: { color: "red", width: 2, dash: "dash" }
            },
            {
                type: "line",
                x0: policyEnd,
                x1: policyEnd,
                y0: 0,
                y1: 1,
                xref: "x",
                yref: "paper",
                line: { color: "red", width: 2, dash: "dash" }
            },
            {
                type: "line",
                x0: effectStart,
                x1: effectStart,
                y0: 0,
                y1: 1,
                xref: "x",
                yref: "paper",
                line: { color: "#dc2626", width: 2, dash: "dot" }
            }
        ],

        annotations: [
            {
                x: policyStart,
                y: 1,
                xref: "x",
                yref: "paper",
                text: "Policy Start",
                showarrow: false,
                yanchor: "bottom",
                font: { color: "red" }
            },
            {
                x: effectStart,
                y: 0.92,
                xref: "x",
                yref: "paper",
                text: "6-Month Effect Start",
                showarrow: false,
                yanchor: "bottom",
                font: { color: "#dc2626" }
            },
            {
                x: policyEnd,
                y: 1,
                xref: "x",
                yref: "paper",
                text: "Policy End",
                showarrow: false,
                yanchor: "bottom",
                font: { color: "red" }
            }
        ]
    }, {
        responsive: true
    });

    if (!sensitivityData || sensitivityData.length === 0) {
        document.getElementById("sensitivity_table").innerHTML = "Error: No sensitivity data found.";
        return;
    }

    let tableHtml = "";
    tableHtml += "<h3>Sensitivity Analysis</h3>";
    tableHtml += "<p>To assess the robustness of the findings, the interrupted time-series model was re-estimated using alternative assumptions regarding the delay between policy implementation and its observable effects. Five lag specifications were considered: 0, 3, 6, 9, and 12 months. Across all models, the estimated baseline trend remained highly consistent, ranging from 1.14% to 1.17% per month and remaining statistically significant (p < 0.001). Likewise, the estimated change in monthly trend during the policy period remained negative and statistically significant in every specification, varying only modestly from −2.51% to −3.08% per month. This consistency suggests that the estimated slowing of mortality growth is robust to reasonable assumptions regarding the timing of the policy effect. In contrast, the estimated immediate level change decreased as longer implementation lags were assumed. The estimated increase declined from 26.7% under the no-lag model to −3.3% under the 12-month lag specification, indicating that the apparent immediate effect is sensitive to the assumed onset of the intervention. Similarly, the estimated average policy effect became progressively larger in magnitude as longer lags were considered, increasing from an estimated 15.98% reduction under the no-lag model to 30.39% under the 12-month lag specification. The primary model, based on a 6-month lag, estimated an average reduction of 23.24%, which lies near the middle of this range and represents a balanced assumption regarding implementation timing. Overall, the sensitivity analysis demonstrates that the principal conclusion the policy period is associated with a significant reduction in the growth trajectory of drug-related deaths—remains consistent across a range of plausible implementation delays. This strengthens confidence that the findings are not driven solely by the choice of lag specification.</p>";
    tableHtml += "<p>Stars indicate statistical significance: *** p < 0.01, ** p < 0.05, * p < 0.10.</p>";
    tableHtml += "<table style='width:100%; border-collapse:collapse; margin-top:1rem;'>";
    tableHtml += "<thead>";
    tableHtml += "<tr>";
    tableHtml += "<th style='border-bottom:1px solid #ccc; text-align:left; padding:8px;'>Lag</th>";
    tableHtml += "<th style='border-bottom:1px solid #ccc; text-align:left; padding:8px;'>Effect Start</th>";
    tableHtml += "<th style='border-bottom:1px solid #ccc; text-align:right; padding:8px;'>Baseline Trend</th>";
    tableHtml += "<th style='border-bottom:1px solid #ccc; text-align:right; padding:8px;'>Immediate Effect</th>";
    tableHtml += "<th style='border-bottom:1px solid #ccc; text-align:right; padding:8px;'>Trend Change</th>";
    tableHtml += "<th style='border-bottom:1px solid #ccc; text-align:right; padding:8px;'>Avg. Model Effect</th>";
    tableHtml += "</tr>";
    tableHtml += "</thead>";
    tableHtml += "<tbody>";

    sensitivityData.forEach(function (row) {
        tableHtml += "<tr>";
        tableHtml += "<td style='border-bottom:1px solid #eee; padding:8px;'>" + row.lag_months + " months</td>";
        tableHtml += "<td style='border-bottom:1px solid #eee; padding:8px;'>" + row.effect_start + "</td>";
        tableHtml += "<td style='border-bottom:1px solid #eee; padding:8px; text-align:right;'>" + row.baseline_result + "%</td>";
        tableHtml += "<td style='border-bottom:1px solid #eee; padding:8px; text-align:right;'>" + row.immediate_policy_result + "%</td>";
        tableHtml += "<td style='border-bottom:1px solid #eee; padding:8px; text-align:right;'>" + row.policy_trend_result + "%</td>";
        tableHtml += "<td style='border-bottom:1px solid #eee; padding:8px; text-align:right;'>" + row.average_model_percent_difference + "%</td>";
        tableHtml += "</tr>";
    });

    tableHtml += "</tbody>";
    tableHtml += "</table>";

    document.getElementById("sensitivity_table").innerHTML = tableHtml;
});
</script>

