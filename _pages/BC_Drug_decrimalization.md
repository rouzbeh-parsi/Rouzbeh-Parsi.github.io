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

    document.getElementById("debug").innerHTML =
        "First row: " +
        rawData[0].DeathYear + "-" +
        rawData[0].Month + " = " +
        rawData[0].Frequency;

    const x = rawData.map(function (d) {
        return new Date(d.DeathYear, d.Month - 1, 1);
    });

    const y = rawData.map(function (d) {
        return Number(d.Frequency);
    });

    const policyStart = new Date(2023, 0, 1);
    const policyEnd = new Date(2026, 0, 1);

    function fitLine(points) {
        const n = points.length;

        if (n < 2) {
            return { slope: 0, intercept: points.length ? points[0].y : 0 };
        }

        const sumX = points.reduce(function (total, point) {
            return total + point.t;
        }, 0);

        const sumY = points.reduce(function (total, point) {
            return total + point.y;
        }, 0);

        const sumXY = points.reduce(function (total, point) {
            return total + point.t * point.y;
        }, 0);

        const sumXX = points.reduce(function (total, point) {
            return total + point.t * point.t;
        }, 0);

        const denominator = n * sumXX - sumX * sumX;

        if (denominator === 0) {
            return { slope: 0, intercept: sumY / n };
        }

        const slope = (n * sumXY - sumX * sumY) / denominator;
        const intercept = (sumY - slope * sumX) / n;

        return { slope: slope, intercept: intercept };
    }

    const indexedData = x.map(function (date, i) {
        return {
            date: date,
            t: i,
            y: y[i]
        };
    });

    const prePolicyData = indexedData.filter(function (d) {
        return d.date < policyStart;
    });

    const postPolicyData = indexedData.filter(function (d) {
        return d.date >= policyStart;
    });

    const prePolicyModel = fitLine(prePolicyData);
    const postPolicyModel = fitLine(postPolicyData);

    const prePolicyTrendY = prePolicyData.map(function (d) {
        return prePolicyModel.slope * d.t + prePolicyModel.intercept;
    });

    const counterfactualY = postPolicyData.map(function (d) {
        return prePolicyModel.slope * d.t + prePolicyModel.intercept;
    });

    const postPolicyTrendY = postPolicyData.map(function (d) {
        return postPolicyModel.slope * d.t + postPolicyModel.intercept;
    });

    Plotly.newPlot("drug_chart", [
        {
            x: x,
            y: y,
            mode: "lines+markers",
            name: "Observed deaths",
            line: { color: "#2563eb", width: 2 },
            marker: { size: 6 }
        },
        {
            x: prePolicyData.map(function (d) { return d.date; }),
            y: prePolicyTrendY,
            mode: "lines",
            name: "Pre-policy trend",
            line: { color: "#111827", width: 3 }
        },
        {
            x: postPolicyData.map(function (d) { return d.date; }),
            y: counterfactualY,
            mode: "lines",
            name: "Counterfactual from pre-policy trend",
            line: { color: "#6b7280", width: 3, dash: "dash" }
        },
        {
            x: postPolicyData.map(function (d) { return d.date; }),
            y: postPolicyTrendY,
            mode: "lines",
            name: "Post-policy trend",
            line: { color: "#dc2626", width: 3 }
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
                text: "Policy Start (2023)",
                showarrow: false,
                yanchor: "bottom",
                font: { color: "red" }
            },
            {
                x: policyEnd,
                y: 1,
                xref: "x",
                yref: "paper",
                text: "Policy End (2026)",
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

log(Deaths_t) =
    β0
  + β1 * Time_t
  + β2 * Policy_t
  + β3 * PolicyTime_t
  + ε_t


  Variables

Deaths_t
Monthly number of unregulated drug toxicity deaths in month t.

Time_t
A continuous time index starting from the first observation.

Policy_t (policy indicator)

A binary variable indicating whether the policy is in effect:

Policy_t =
  0  before Jan 2023
  1  from Jan 2023 to Dec 2025
  0  from Jan 2026 onward

This captures the immediate level shift after policy introduction.

PolicyTime_t (post-policy trend counter)

A variable counting time since policy implementation, this captures changes in trend after the intervention.

Coefficients interpretation
β1 → baseline monthly trend before policy
β2 → immediate change in level after policy introduction
β3 → change in slope (trend) after policy
