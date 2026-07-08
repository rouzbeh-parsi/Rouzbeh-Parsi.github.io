---
title: "Canada Housing Affordability Dashboard"
permalink: /housing-dashboard/
layout: single
author_profile: true
---

<link rel="stylesheet" href="{{ '/assets/css/housing.css' | relative_url }}">

<script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>

# Canada Housing Affordability Dashboard

This interactive dashboard explores housing affordability across Canada using public data. Users can compare provinces, evaluate affordability metrics, and examine trends in housing prices, incomes, and mortgage costs.

---

## National Overview

<div class="kpi-grid">

    <div class="kpi-card">
        <div class="kpi-title">🏠 Average Home Price</div>
        <div id="avgPrice" class="kpi-value">$742,000</div>
        <div class="kpi-change">▲ 4.2% YoY</div>
    </div>

    <div class="kpi-card">
        <div class="kpi-title">💵 Median Household Income</div>
        <div id="medianIncome" class="kpi-value">$97,500</div>
        <div class="kpi-change">▲ 2.8% YoY</div>
    </div>

    <div class="kpi-card">
        <div class="kpi-title">📊 Price-to-Income Ratio</div>
        <div id="ratio" class="kpi-value">7.6×</div>
        <div class="kpi-change">National</div>
    </div>

    <div class="kpi-card">
        <div class="kpi-title">🏦 Monthly Mortgage</div>
        <div id="mortgage" class="kpi-value">$3,940</div>
        <div class="kpi-change">@5% Interest</div>
    </div>

    <div class="kpi-card">
        <div class="kpi-title">📉 Mortgage Burden</div>
        <div id="burden" class="kpi-value">48%</div>
        <div class="kpi-change">Median Household</div>
    </div>

    <div class="kpi-card">
        <div class="kpi-title">💰 Income Needed</div>
        <div id="needed" class="kpi-value">$158,000</div>
        <div class="kpi-change">30% Rule</div>
    </div>

</div>

---

## Canada Map

<div id="map" style="height:650px;"></div>

---

## Housing Prices

<div id="priceChart" style="height:500px;"></div>

---

## Housing Affordability

<div id="ratioChart" style="height:500px;"></div>

---

## Mortgage Burden

<div id="mortgageChart" style="height:500px;"></div>

<script src="{{ '/assets/js/housing.js' | relative_url }}"></script>
