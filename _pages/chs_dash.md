---
title: "Canadian Healthcare System Dashboard"
permalink: /chs-dashboard/
layout: single
author_profile: true
---

<link rel="stylesheet" href="{{ '/assets/css/chs_dash.css' | relative_url }}">

<script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>

# Canadian Healthcare System Dashboard

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

    <div class="kpi-card">

    <div class="kpi-title">
        ⏳ Wait Time
    </div>

    <div id="waitValue" class="kpi-value">
        --
    </div>

    <div class="kpi-subtitle">
        Days (90th percentile ED physician assessment, 2024)
    </div>

</div>

</div>

</div>

<script src="{{ '/assets/js/chs_dash.js' | relative_url }}"></script>
