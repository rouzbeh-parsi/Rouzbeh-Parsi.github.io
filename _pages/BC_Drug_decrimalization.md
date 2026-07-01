---
layout: archive
title: "Drug Policy Analysis Dashboard"
permalink: /drug-dashboard/
author_profile: true
mathjax: false
---

## Drug-related Deaths in BC

This dashboard visualizes monthly drug-related deaths and highlights the policy intervention period.

<div id="debug"></div>
<div id="drug_chart" style="width:100%;height:650px;"></div>

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
