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

    // ✅ SAFE JEKYLL DATA (no broken JS injection)
    const rawData = JSON.parse(`{{ site.data.drug | jsonify | escape }}`);

    const x = rawData.map(d =>
        new Date(Number(d.DeathYear), Number(d.Month) - 1, 1)
    );

    const y = rawData.map(d => Number(d.Frequency));

    const trace = {
        x: x,
        y: y,
        mode: "lines+markers",
        name: "Drug-related deaths"
    };

    const layout = {
        title: "BC Drug-Related Deaths",
        hovermode: "x unified",
        margin: { t: 50 },
        xaxis: { type: "date" }
    };

    Plotly.newPlot("drug_chart", [trace], layout);

});
</script>

