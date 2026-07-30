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


<div id="bc_ab_chart" style="width:100%;height:600px;"></div>

<script>
window.BCAB_DATA = {{ site.data.BCABDRUG | jsonify }};
</script>

<script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>


<script>

window.addEventListener("load", function(){

    const data = window.BCAB_DATA;

    const dates = data.map(d =>
        new Date(d.DeathYear, d.Month - 1, 1)
    );


    const bc = data.map(d =>
        Number(d.fpcbc)
    );

    const ab = data.map(d =>
        d.fpcab === "" ? null : Number(d.fpcab)
    );


    const policyStart = new Date(2023,0,1);
    const policyEnd = new Date(2026,0,1);

    Plotly.newPlot(
        "bc_ab_chart",
        [

            {
                x: dates,
                y: bc,
                mode: "lines",
                name: "British Columbia",
                line:{
                    width:3
                }
            },

            {
                x: dates,
                y: ab,
                mode:"lines",
                name:"Alberta",
                line:{
                    width:3
                }
            }

        ],

        {

            title:{
                text:"Drug-Related Mortality Rate per 100,000 Population: BC vs Alberta",
                x:0.5,
                font:{
                    size:22
                }
            },


            xaxis:{
                title:"Date",
                type:"date"
            },


            yaxis:{
                title:"Deaths per 100,000 Population"
            },


            hovermode:"x unified",


            shapes:[
                  {
                type: "rect",
                xref: "x",
                yref: "paper",
                x0: policyStart,
                x1: policyEnd,
                y0: 0,
                y1: 1,
                fillcolor: "rgba(255,0,0,0.08)",
                line: { width: 0 }
            },
                {
                    type:"line",
                    x0:policyStart,
                    x1:policyStart,
                    y0:0,
                    y1:1,
                    xref:"x",
                    yref:"paper",
                    line:{
                        color:"red",
                        dash:"dash",
                        width:2
                    }
                },
                              {
                    type:"line",
                    x0:policyEnd,
                    x1:policyEnd,
                    y0:0,
                    y1:1,
                    xref:"x",
                    yref:"paper",
                    line:{
                        color:"red",
                        dash:"dash",
                        width:2
                    }
                }
            ],


            annotations:[
                {
                    x:policyStart,
                    y:1,
                    xref:"x",
                    yref:"paper",
                    text:"Policy Start (Jan 2023)",
                    showarrow:false,
                    font:{
                        color:"red"
                    }
                },
                {
                    x:policyEnd,
                    y:1,
                    xref:"x",
                    yref:"paper",
                    text:"Policy End (Jan 2026)",
                    showarrow:false,
                    font:{
                        color:"red"
                    }
                }
            ],


            margin:{
                l:80,
                r:40,
                t:90,
                b:80
            }

        },

        {
            responsive:true
        }

    );


});

</script>

## Difference-in-Differences Event Study

To estimate whether drug-related mortality changed differently in British Columbia after decriminalization, a **difference-in-differences (DiD) event-study model** is applied. This approach compares changes in BC with changes in Alberta, while controlling for permanent differences between provinces and common time trends.

The model specification is:

Y(i,t) = α(i) + λ(t) + Σ β(k) × (BC(i) × EventTime(k,t)) + ε(i,t)

where:

- **Y(i,t)** is the drug-related mortality rate per 100,000 population for province *i* in month *t*.
- **BC(i)** is a treatment indicator equal to 1 for British Columbia and 0 for Alberta.
- **EventTime(k,t)** represents the number of months relative to the start of decriminalization (January 2023).
- **β(k)** estimates the change in BC mortality relative to Alberta for each month before and after the policy.
- **α(i)** represents province fixed effects, controlling for time-invariant differences between BC and Alberta.
- **λ(t)** represents month fixed effects, controlling for factors affecting both provinces over time.

The month immediately before implementation (k = -1) is used as the reference period. Coefficients before the policy show whether BC and Alberta followed similar trends before decriminalization, while coefficients after implementation estimate the relative change in BC compared with Alberta. A 6-month lag is also considered to account for delayed policy effects, recognizing that changes in drug-related mortality may take time to appear after implementation.

A positive coefficient indicates that mortality increased in BC relative to Alberta compared with the pre-policy period. A negative coefficient indicates a relative decrease.

## Data Sources

- **British Columbia:** BC Coroners Service — Statistical Reports on Deaths  
  [https://www2.gov.bc.ca/gov/content/life-events/death/coroners-service/statistical-reports](https://www2.gov.bc.ca/gov/content/life-events/death/coroners-service/statistical-reports)

- **Alberta:** Substance Use Surveillance Data  
  [https://www2.gov.bc.ca/gov/content/life-events/death/coroners-service/statistical-reports](https://www.alberta.ca/substance-use-surveillance-data)

