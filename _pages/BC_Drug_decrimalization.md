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

<script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>

<script>
// 1. Inject the Jekyll data safely into a global window variable first
window.dashboardRawData = {{ site.data.drug | jsonify }};
</script>

{% raw %}
<script>
// 2. Wrap the rest of the execution in raw tags so Kramdown ignores the JS syntax
window.addEventListener("load", function () {
    const rawData = window.dashboardRawData;

    if (!rawData || rawData.length === 0) {
        document.getElementById("debug").innerHTML = "Error: No data found.";
        return;
    }

    console.log("FULL DATA:", rawData);

    document.getElementById("debug").innerHTML =
        "First row: " +
        rawData[0].DeathYear + "-" +
        rawData[0].Month + " = " +
        rawData[0].Frequency;

    const x = rawData.map(d => new Date(d.DeathYear, d.Month - 1, 1));
    const y = rawData.map(d => d.Frequency);

    Plotly.newPlot("drug_chart", [{
        x: x,
        y: y,
        mode: "lines+markers",
        name: "Drug-related deaths"
    }], {
        title: "Drug-related Deaths in BC",
        xaxis: { title: "Date", type: "date" },
        yaxis: { title: "Deaths" },
        hovermode: "x unified"
    });
});
</script>
{% endraw %}
