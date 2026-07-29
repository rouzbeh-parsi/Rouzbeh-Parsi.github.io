---
layout: archive
title: "BC Drug Decriminalization Pilot Evaluation: Step 2 — Did BC change differently from a comparable province? "
permalink: /BC-drug-policy2/
author_profile: true
mathjax: false
---

## Comparing BC and Alberta

The previous analysis examined changes in drug-related mortality in British Columbia using an interrupted time-series model. While this approach identifies changes in trends after decriminalization, it cannot fully separate policy effects from broader changes over time.

This analysis extends the approach by comparing British Columbia with Alberta as a control province. The first step is to compare mortality rates per 100,000 population between the two provinces before estimating a difference-in-differences event-study model.




## Data Sources

- **British Columbia:** BC Coroners Service — Statistical Reports on Deaths  
  [https://www2.gov.bc.ca/gov/content/life-events/death/coroners-service/statistical-reports](https://www2.gov.bc.ca/gov/content/life-events/death/coroners-service/statistical-reports)

- **Alberta:** Substance Use Surveillance Data  fuck
  [https://www.alberta.ca/substance-use-surveillance-data](https://www.alberta.ca/substance-use-surveillance-data)

<div id="bc_ab_chart" style="width:100%;height:600px;"></div>

<script>
window.BCAB_DATA = {{ site.data.BCABDRUG | jsonify }};
console.log("DATA LOADED:", window.BCAB_DATA);
</script>


<script>
console.log("SCRIPT START");

window.addEventListener("load", function(){

    console.log("PAGE LOADED");

    const data = window.BCAB_DATA;

    console.log(data);

});
</script>
