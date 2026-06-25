function drawChart() {
    const chartDiv = document.getElementById("chart");

    if (!chartDiv) {
        console.error("Chart div not found");
        return;
    }

    var historical = {
        x: [2018,2019,2020,2021,2022,2023,2024,2025],
        y: [17,18,19,20,21,22,23,24],
        mode: 'lines+markers',
        name: 'Historical'
    };

    var forecast = {
        x: [2026,2027,2028],
        y: [25,26,27],
        mode: 'lines+markers',
        name: 'Forecast'
    };

    var upper = {
        x: [2026,2027,2028],
        y: [26,27,28],
        mode: 'lines',
        line: {dash:'dot'},
        name:'Upper Bound'
    };

    var lower = {
        x: [2026,2027,2028],
        y: [24,25,26],
        mode:'lines',
        line:{dash:'dot'},
        name:'Lower Bound'
    };

    Plotly.newPlot(chartDiv, [historical, forecast, upper, lower], {
        title:'BC Personal Income Tax Forecast',
        hovermode:'x unified'
    });
}
