---
layout: archive
title: "Drug Policy Analysis Dashboard"
permalink: /drug-dashboard/
author_profile: true
---

## Drug-related Deaths in BC

This dashboard visualizes monthly drug-related deaths and highlights the policy intervention period.

<div id="drug_chart" style="width:100%;height:600px;"></div>

<script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>

<script>
document.addEventListener("DOMContentLoaded", function () {

    // -----------------------------
    // Load Jekyll data file
    // -----------------------------
    const rawData = {{ site.data.drug | jsonify }};

    // -----------------------------
    // Convert data
    // -----------------------------
    const x = rawData.map(d => `${d.DeathYear}-${d.Month}`);
    const y = rawData.map(d => Number(d.Frequency));

    // -----------------------------
    // Main time series
    // -----------------------------
    const trace = {
        x: x,
        y: y,
        mode: 'lines+markers',
        name: 'Drug-related deaths'
    };

    // -----------------------------
    // Policy markers (EDIT THESE DATES)
    // -----------------------------
    const policyStart = "2023-01";
    const policyEnd = "2024-01";

    const layout = {
        title: "BC Drug Policy Outcomes (Descriptive)",
        hovermode: "x unified",
        margin: { t: 50 },

        shapes: [
            // POLICY START LINE
            {
                type: "line",
                x0: policyStart,
                x1: policyStart,
                y0: 0,
                y1: 1,
                xref: "x",
                yref: "paper",
                line: {
                    color: "green",
                    width: 2,
                    dash: "dash"
                }
            },

            // POLICY END LINE (optional if needed)
            {
                type: "line",
                x0: policyEnd,
                x1: policyEnd,
                y0: 0,
                y1: 1,
                xref: "x",
                yref: "paper",
                line: {
                    color: "red",
                    width: 2,
                    dash: "dot"
                }
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
                font: { color: "green" }
            },
            {
                x: policyEnd,
                y: 1,
                xref: "x",
                yref: "paper",
                text: "Post-policy period",
                showarrow: false,
                yanchor: "bottom",
                font: { color: "red" }
            }
        ]
    };

    Plotly.newPlot("drug_chart", [trace], layout);
});
</script>
