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
const x = rawData.map(d =>
    new Date(
        Number(d.DeathYear),
        Number(d.Month) - 1,
        1
    )
);

const y = rawData.map(d => Number(d.Frequency));

console.log(x[0]);
console.log(y[0]);
 </script>
