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
<div id="drug_chart" style="width:100%;height:600px;"></div>

<!-- =========================
     1. SAFE DATA INJECTION
     ========================= -->
<script>
window.DRUG_DATA = {{ site.data.drug | jsonify }};
</script>

<!-- =========================
     2. PLOTLY LIBRARY
     ========================= -->
<script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>

<!-- =========================
     3. DASHBOARD LOGIC
     ========================= -->
<script>
window.addEventListener("load", function () {
    const rawData = window.DRUG_DATA;

    if (!rawData || rawData.length === 0) {
        document.getElementById("debug").innerHTML = "Error: No data found.";
        return;
    }

    console.log("FULL DATA:", rawData);
    console.log("FIRST ROW:", rawData[0]);

    document.getElementById("debug").innerHTML =
        "First row: " +
        rawData[0].DeathYear + "-" +
        rawData[0].Month + " = " +
        rawData[0].Frequency;

    const x = rawData.map(function (d) {
        return new Date(d.DeathYear, d.Month - 1, 1);
    });

    const y = rawData.map(function (d) {
        return d.Frequency;
    });

    const policyStart = new Date(2023, 0, 1);
    const policyEnd = new Date(2026, 0, 1);

    Plotly.newPlot("drug_chart", [{
        x: x,
        y: y,
        mode: "lines+markers",
        name: "Drug-related deaths"
    }], {
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

        shapes: [{
            type: "rect",
            xref: "x",
            yref: "paper",
            x0: policyStart,
            x1: policyEnd,
            y0: 0,
            y1: 1,
            fillcolor: "rgba(255, 0, 0, 0.08)",
            line: { width: 0 }
        }, {
            type: "line",
            x0: policyStart,
            x1: policyStart,
            y0: 0,
            y1: 1,
            xref: "x",
            yref: "paper",
            line: { color: "red", width: 2, dash: "dash" }
        }, {
            type: "line",
            x0: policyEnd,
            x1: policyEnd,
            y0: 0,
            y1: 1,
            xref: "x",
            yref: "paper",
            line: { color: "red", width: 2, dash: "dash" }
        }],

        annotations: [{
            x: policyStart,
            y: 1,
            xref: "x",
            yref: "paper",
            text: "Policy Start (2023)",
            showarrow: false,
            yanchor: "bottom",
            font: { color: "red" }
        }, {
            x: policyEnd,
            y: 1,
            xref: "x",
            yref: "paper",
            text: "Policy End (2026)",
            showarrow: false,
            yanchor: "bottom",
            font: { color: "red" }
        }]
    });
});
</script>
