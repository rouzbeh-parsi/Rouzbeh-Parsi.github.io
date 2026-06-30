function drawChart() {
    const chartDiv = document.getElementById("chart");
    if (!chartDiv) return;

    const historical = {
        x: [1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,
            2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,
            2019,2020,2021,2022,2023,2024,2025,2026,2027,2028],
        y: [5423,5839,6015,5366,4150,4877,5050,5838,6905,6956,
            6093,5529,5361,6427,6977,6862,8076,8380,9704,8923,
            11364,10657,11118,13704,17268,16443,17026,null,null,null],
        mode: 'lines+markers',
        name: 'Historical PIT'
    };

    const ETS = {
        x: [1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,
            2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,
            2019,2020,2021,2022,2023,2024,2025,2026,2027,2028],
        y: [null,null,null,null,null,null,null,null,null,null,
            null,null,null,null,null,null,null,null,null,null,
            null,null,null,null,null,null,17026,
            17445.31136,17864.62271,18283.93407],
        mode: 'lines+markers',
        name: 'ETS'
    };

    const ARIMA = {
        x: forecast.x,
        y: [null,null,null,null,null,null,null,null,null,null,
            null,null,null,null,null,null,null,null,null,null,
            null,null,null,null,null,null,17026,
            17420.588161,17815.163161,18209.725001],
        mode: 'lines',
        name: 'ARIMA',
        line: { dash: 'dot' }
    };
\
    const SARIMAX = {
        x: forecast.x,
        y: [null,null,null,null,null,null,null,null,null,null,
            null,null,null,null,null,null,null,null,null,null,
            null,null,null,null,null,null,17026,
            17240.688393,17627.008740,18068.150743],
        mode: 'lines',
        name: 'SARIMAX',
        line: { dash: 'dot' }
    };

    function render() {
        Plotly.newPlot(chartDiv,
            [historical, forecast, lower, upper],
            {
                title: 'BC Personal Income Tax Forecast',
                hovermode: 'x unified',
                margin: { t: 50 },

                // ⭐ VERTICAL LINE AT 2025
                shapes: [
                    {
                        type: 'line',
                        x0: 2025,
                        x1: 2025,
                        y0: 0,
                        y1: 1,
                        xref: 'x',
                        yref: 'paper',
                        line: {
                            color: 'black',
                            width: 2,
                            dash: 'dash'
                        }
                    }
                ],

                annotations: [
                    {
                        x: 2025,
                        y: 1,
                        xref: 'x',
                        yref: 'paper',
                        text: 'Forecast Start',
                        showarrow: false,
                        yanchor: 'bottom',
                        font: { size: 12 }
                    }
                ]
            }
        );

        window.dispatchEvent(new Event('resize'));
    }

    requestAnimationFrame(() => {
        setTimeout(render, 250);
    });
}

window.addEventListener("load", drawChart);
