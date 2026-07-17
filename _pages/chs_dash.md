---
title: "Canadian Healthcare System Dashboard"
permalink: /chs-dashboard/
layout: splash
---

<link rel="stylesheet" href="{{ '/assets/css/chs_dash.css' | relative_url }}">

<script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>

# Canadian Healthcare System Dashboard

## About the Dashboard

The objective of this dashboard is to provide an accessible overview of healthcare capacity and access across Canada. Rather than focusing on a single indicator, the dashboard combines multiple measures to help identify regions where healthcare resources may be keeping pace with population growth and where potential capacity pressures may be emerging.

## Data Sources

This dashboard combines data from two national sources:

### Statistics Canada
- Population estimates by province and territory
- Self-reported unmet healthcare needs

### Canadian Institute for Health Information (CIHI)
- Hospital beds
- Family physicians
- Emergency department wait times

Data are presented at the provincial and territorial level and are updated according to the latest publicly available releases from each organization.

<div class="controls">

    <label for="provinceSelect">
        <b>Select Province:</b>
    </label>

    <select id="provinceSelect"></select>

</div>


<div class="kpi-grid">


    <div class="kpi-card">

        <div class="kpi-title">
            🏥 Hospital Beds
        </div>

        <div id="bedsValue" class="kpi-value">
            --
        </div>

        <div class="kpi-subtitle">
            per 100,000 population (2024)
        </div>

    </div>



    <div class="kpi-card">

        <div class="kpi-title">
            👨‍⚕️ Family Doctors
        </div>

        <div id="doctorValue" class="kpi-value">
            --
        </div>

        <div class="kpi-subtitle">
            per 100,000 population (2024)
        </div>

    </div>



    <div class="kpi-card">

        <div class="kpi-title">
            🚑 Unmet Health Needs
        </div>

        <div id="unmetValue" class="kpi-value">
            --
        </div>

        <div class="kpi-subtitle">
            % of persons with unmet healthcare needs (2024)
        </div>

    </div>



    <div class="kpi-card">

        <div class="kpi-title">
            ⏳ Emergency Department Wait Time
        </div>

        <div id="waitValue" class="kpi-value">
            --
        </div>

        <div class="kpi-subtitle">
            Hours (90th percentile physician assessment, 2024)
        </div>

    </div>

</div>   <!-- CLOSE KPI GRID HERE -->

<div class="dashboard-section">

<h2>Healthcare Capacity Growth Gap</h2>


<h3>🏥 Hospital Beds</h3>

<div id="bedGrowthChart"
     style="width:100%;height:450px;">
</div>



<h3>👨‍⚕️ Family Doctors</h3>

<div id="doctorGrowthChart"
     style="width:100%;height:450px;">
</div>


</div>

<div class="dashboard-section">

    <h2>Healthcare Performance Matrix</h2>

    <p>
        Bubble size represents family doctors per 100,000 population.
    </p>

    <div id="performanceMatrix"
         style="width:100%; height:700px;">
    </div>

</div>

<div class="dashboard-section">

<h2>Healthcare Capacity Across Canada</h2>


<div class="map-controls">


    <div class="control-item">

        <label>
            <b>Select Indicator:</b>
        </label>

        <select id="mapMetric">

            <option value="beds">
                🏥 Hospital Beds
            </option>

            <option value="doctors">
                👨‍⚕️ Family Doctors
            </option>

            <option value="unmet">
                🚑 Unmet Health Needs
            </option>

            <option value="wait">
                ⏳ Emergency Department Wait Time
            </option>

        </select>

    </div>



    <div class="control-item">

        <label>
            <b>Year:</b>
            <span id="selectedYear">
                2024
            </span>
        </label>


        <input 
            type="range"
            id="mapYearSlider"
            min="2019"
            max="2024"
            step="1"
            value="2024"
            list="yearTicks"
        >


        <datalist id="yearTicks">

            <option value="2019" label="2019"></option>

            <option value="2020" label="2020"></option>

            <option value="2021" label="2021"></option>

            <option value="2022" label="2022"></option>

            <option value="2023" label="2023"></option>

            <option value="2024" label="2024"></option>

        </datalist>


    </div>


</div>



<div id="healthMap"></div>


</div>

<script src="{{ '/assets/js/chs_dash.js' | relative_url }}"></script>
