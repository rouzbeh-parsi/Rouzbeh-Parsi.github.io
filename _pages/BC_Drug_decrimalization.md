---
layout: archive
title: "Drug Policy Analysis Dashboard"
permalink: /drug-dashboard/
author_profile: true
---

## Drug-related Deaths in BC

This dashboard visualizes monthly drug-related deaths and highlights the policy intervention period.

<div id="debug"></div>

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

});
</script>
