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


    const policyDate = new Date(2023,0,1);


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
                    type:"line",
                    x0:policyDate,
                    x1:policyDate,
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
                    x:policyDate,
                    y:1,
                    xref:"x",
                    yref:"paper",
                    text:"BC Decriminalization (Jan 2023)",
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
