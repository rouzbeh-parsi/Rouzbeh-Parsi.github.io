---
layout: archive
title: "Drug Policy Analysis Dashboard"
permalink: /drug-dashboard/
author_profile: true
---

## Drug-related Deaths in BC

This dashboard visualizes monthly drug-related deaths and highlights the policy intervention period.

<div id="drug_chart"></div>

<script>
window.addEventListener("load", function () {

    // Load Jekyll data safely
    const rawData = {{ site.data.drug | jsonify }};

    // Debug checks
    console.log("Data loaded:", rawData);
    console.log("First row:", rawData[0]);

});
</script>
