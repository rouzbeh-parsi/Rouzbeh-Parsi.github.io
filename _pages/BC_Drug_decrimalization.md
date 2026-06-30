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
window.addEventListener("load", function () {

    // -----------------------------
    // SAFE JEKYLL DATA LOAD
    // -----------------------------
    const rawData = JSON.parse(`{{ site.data.drug | jsonify }}`);

    // -----------------------------
    // Convert to real dates (IMPORTANT FIX)
    // -----------------------------
    const x = rawData.map(d =>
        new Date(Number(d.DeathYear), Number(d.Month) - 1, 1)
    );

    const y = rawData.map(d => Number(d.Frequency));

    // -----------------------------
    // MAIN SERIES
    // -----------------------------
    const trace = {
        x: x,
        y: y,
        mode: "lines+markers",
        name: "Drug-related deaths"
    };

    // -----------------------------
    // POLICY DATES (EDIT THESE)
    // -----------------------------
    const policyStart = new Date(2023, 0, 1);
    const policyEnd = new Date(2024, 0, 1);

    const layout = {
        title: "BC Drug Policy Outcomes (Descriptive)",
        hovermode: "x unified",
        margin: { t: 50 },

        xaxis: {
            type: "date"
        },

        shapes: [
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
