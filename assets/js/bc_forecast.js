function drawChart() {
    const chartDiv = document.getElementById("chart");
    if (!chartDiv) return;

    const year = [1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,
                  2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,
                  2019,2020,2021,2022,2023,2024,2025,2026,2027,2028];

    const pit = [5423,5839,6015,5366,4150,4877,5050,5838,6905,6956,
                 6093,5529,5361,6427,6977,6862,8076,8380,9704,8923,
                 11364,10657,11118,13704,17268,16443,17026,null,null,null];

    const forecast = [null,null,null,null,null,null,null,null,null,null,
                      null,null,null,null,null,null,null,null,null,null,
                      null,null,null,null,null,null,17026,17445.31136,17864.62271,18283.93407];

    const lower = [null,null,null,null,null,null,null,null,null,null,
                   null,null,null,null,null,null,null,null,null,null,
                   null,null,null,null,null,null,17026,14752.88,14358.14,14118.15];

    const upper = [null,null,null,null,null,null,null,null,null,null,
                   null,null,null,null,null,null,null,null,null,null,
                   null,null,null,null,null,null,17026,20137.74,21371.10,22449.72];

    function render() {
        Plotly.newPlot(chartDiv, [
            {
                x: year,
                y: pit,
                mode: 'lines+markers',
                name: 'Historical PIT'
            },
            {
                x: year,
                y: forecast,
                mode: 'lines+markers',
                name: 'Forecast PIT'
            },
            {
                x: year,
                y: lower,
                mode: 'lines',
                name: 'Lower Bound',
                line: { dash: 'dot' }
            },
            {
                x: year,
                y: upper,
                mode: 'lines',
                name: 'Upper Bound',
                line: { dash: 'dot' }
            }
        ], {
            title: 'BC Personal Income Tax Forecast',
            hovermode: 'x unified',
            margin: { t: 50 }
        });

        window.dispatchEvent(new Event('resize'));
    }

    requestAnimationFrame(() => {
        setTimeout(render, 250);
    });
}

window.addEventListener("load", drawChart);
