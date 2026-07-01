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
    window.addEventListener("load", function () { const rawData = {{ site.data.drug | jsonify }}; 
    console.log("FULL DATA:", rawData); 
    console.log("FIRST ROW:", rawData[0]); 
    document.getElementById("debug").innerHTML = "First row: " + rawData[0].DeathYear + "-" + rawData[0].Month + " = " + rawData[0].Frequency; }); 

</script>

