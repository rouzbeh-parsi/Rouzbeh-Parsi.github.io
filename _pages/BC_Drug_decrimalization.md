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

    const rawData = {{ site.data.drug | jsonify }};

    console.log("FULL DATA:", rawData);
    console.log("FIRST ROW:", rawData[0]);

    document.getElementById("debug").innerHTML =
        "First row: " +
        rawData[0].DeathYear + "-" +
        rawData[0].Month + " = " +
        rawData[0].Frequency;

    const x = rawData.map(d =>
        new Date(Number(d.DeathYear), Number(d.Month) - 1, 1)
    );

    const y = rawData.map(d => Number(d.Frequency));

   Plotly.newPlot("drug_chart", [{
    x: x,
    y: y,
    mode: "lines+markers",
    name: "Drug-related deaths"
}], {
    title: "Drug-related Deaths in BC",
    xaxis: { title: "Date", type: "date" },
    yaxis: { title: "Deaths" },
    hovermode: "x unified",

    shapes: [

        // shaded policy period (2023–2026)
        {
            type: "rect",
            xref: "x",
            yref: "paper",
            x0: new Date(2023, 0, 1),
            x1: new Date(2026, 0, 1),
            y0: 0,
            y1: 1,
            fillcolor: "rgba(255, 0, 0, 0.08)",
            line: { width: 0 }
        },

        // start line
        {
            type: "line",
            x0: new Date(2023, 0, 1),
            x1: new Date(2023, 0, 1),
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

        // end line
        {
            type: "line",
            x0: new Date(2026, 0, 1),
            x1: new Date(2026, 0, 1),
            y0: 0,
            y1: 1,
            xref: "x",
            yref: "paper",
            line: {
                color: "red",
                width: 2,
                dash: "dash"
            }
        }

    ],

    annotations: [

        {
            x: new Date(2023, 0, 1),
            y: 1,
            xref: "x",
            yref: "paper",
            text: "Policy Start (2023)",
            showarrow: false,
            yanchor: "bottom",
            font: { color: "red" }
        },

        {
            x: new Date(2026, 0, 1),
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
