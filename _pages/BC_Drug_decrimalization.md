---
layout: archive
title: "Drug Policy Analysis Dashboard"
permalink: /drug-dashboard/
author_profile: true
---

## Drug-related Deaths in BC

This dashboard visualizes monthly drug-related deaths and highlights the policy intervention period.

<div id="debug"></div>
<div id="drug_chart" style="width:100%;height:600px;"></div>

<script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>

<script>
window.addEventListener("load", function () {

    // =========================
    // Load Jekyll data
    // =========================
    const rawData = {{ site.data.drug | jsonify }};

    console.log("FULL DATA:", rawData);
    console.log("FIRST ROW:", rawData[0]);

    // =========================
    // Debug output
    // =========================
    document.getElementById("debug").innerHTML =
        "First row: " +
        rawData[0].DeathYear + "-" +
        rawData[0].Month + " = " +
        rawData[0].Frequency;

    // =========================
    // Convert data (NOW CLEAN NUMBERS)
    // =========================
    const x = rawData.map(d =>
        new Date(d.DeathYear, d.Month - 1, 1)
    );

    const y = rawData.map(d => d.Frequency);

    // =========================
    // Policy dates
    // =========================
    const policyStart = new Date(2023, 0, 1);
    const policyEnd   = new Date(2026, 0, 1);

    // =========================
    // Plot
    // =========================
    Plotly.newPlot("drug_chart", [
        {
            x: x,
            y: y,
            mode: "lines+markers",
            name: "Drug-related deaths"
        }
    ], {
        title: "Drug-related Deaths in BC",
        xaxis: {
            title: "Date",
            type: "date"
        },
        yaxis: {
            title: "Deaths"
        },
        hovermode: "x unified",

        shapes: [
            // policy start line
            {
                type: "line",
                x0: policyStart,
                x1: policyStart,
                y0: 0,
                y1: 1,
                xref: "x",
                yref: "paper",
                line: {
                    color: "red",
                    width: 2,
                    dash: "dash"
                }
            },

            // policy end line
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
                    dash: "dash"
                }
            },

            // shaded policy period
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
    });

});
</script>
