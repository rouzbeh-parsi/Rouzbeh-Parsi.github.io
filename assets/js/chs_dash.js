const BEDS_URL = "/assets/data/health/beds.json";
const DOCTORS_URL = "/assets/data/health/DPF.json";
const UNMET_URL = "/assets/data/health/unmet.json";
const WAIT_URL = "/assets/data/health/wait.json";
const GEO_URL = "/assets/data/canada.geojson";
const POP_URL = "/assets/data/health/pop.json";

const provinceNames = {
    "ZZ": "Canada",
    "NL": "Newfoundland and Labrador",
    "PE": "Prince Edward Island",
    "NS": "Nova Scotia",
    "NB": "New Brunswick",
    "QC": "Quebec",
    "ON": "Ontario",
    "MB": "Manitoba",
    "SK": "Saskatchewan",
    "AB": "Alberta",
    "BC": "British Columbia"
};



async function loadDashboard() {

    try {

       const [
    bedsResponse,
    doctorsResponse,
    unmetResponse,
    waitResponse,
    popResponse
] = await Promise.all([
    fetch(BEDS_URL),
    fetch(DOCTORS_URL),
    fetch(UNMET_URL),
    fetch(WAIT_URL),
    fetch(POP_URL)
]);


let bedsData;
let doctorsData;
let unmetData;
let waitData;
let popData;


try {
    bedsData = await bedsResponse.json();
    console.log("✅ Beds JSON loaded");
}
catch(e){
    console.error("❌ Beds JSON failed", e);
}


try {
    doctorsData = await doctorsResponse.json();
    console.log("✅ Doctors JSON loaded");
}
catch(e){
    console.error("❌ Doctors JSON failed", e);
}


try {
    unmetData = await unmetResponse.json();
    console.log("✅ Unmet JSON loaded");
}
catch(e){
    console.error("❌ Unmet JSON failed", e);
}


try {
    waitData = await waitResponse.json();
    console.log("✅ Wait JSON loaded");
}
catch(e){
    console.error("❌ Wait JSON failed", e);
}


try {
    popData = await popResponse.json();
    console.log("✅ Population JSON loaded");
}
catch(e){
    console.error("❌ Population JSON failed", e);
}


        // ==========================
        // Hospital Beds
        // 2024 per 100,000
        // ==========================

        const beds2024 = bedsData.filter(
            d =>
                Number(d.fiscal_yr) === 2024 &&
                d.alias === "per 100,000"
        );



        // ==========================
        // Family Doctors
        // 2024 per 100,000
        // ==========================

        const doctors2024 = doctorsData.filter(
            d =>
                Number(d.year) === 2024 &&
                d.alias === "per 100,000"
        );



        // ==========================
        // Unmet Health Needs
        // 2024
        // ==========================

        const unmet2024 = unmetData.filter(
            d =>
                Number(d.year) === 2024
        );



        // ==========================
        // Wait Time
        // 2024
        // ED Physician Initial Assessment
        // 90th percentile
        // ==========================

        const wait2024 = waitData.filter(
            d =>
                Number(d.year) === 2024 &&
                d["item 2"] === 
                "Emergency Department Wait Time for Physician Initial Assessment" &&
                d["item "] === "90th percentile"
        );



        const select = document.getElementById("provinceSelect");



        // Populate dropdown

        if (select.options.length === 0) {

            Object.entries(provinceNames).forEach(([code, name]) => {

                const option = document.createElement("option");

                option.value = code;
                option.textContent = name;

                select.appendChild(option);

            });

        }



        function updateCards() {


            const province = select.value;



            // ==========================
            // Hospital Beds
            // ==========================

            const bedsRow = beds2024.find(
                d => d.prov_cd.toUpperCase() === province
            );


            document.getElementById("bedsValue").textContent =
                bedsRow
                    ? Math.round(bedsRow.Total_hosp_bed).toLocaleString()
                    : "N/A";




            // ==========================
            // Family Doctors
            // ==========================

            const doctorRow = doctors2024.find(
                d => d.prov_cd.toUpperCase() === province
            );


            document.getElementById("doctorValue").textContent =
                doctorRow
                    ? Math.round(doctorRow.fdp).toLocaleString()
                    : "N/A";





            // ==========================
            // Unmet Health Needs
            // ==========================

            const unmetRow = unmet2024.find(
                d => d["loc-a"].toUpperCase() === province
            );


            document.getElementById("unmetValue").textContent =
                unmetRow
                    ? unmetRow.unmet.toFixed(1) + "%"
                    : "N/A";





            // ==========================
            // Wait Time
            // ==========================

            const waitRow = wait2024.find(
                d => d.prov_cd.toUpperCase() === province
            );


            document.getElementById("waitValue").textContent =
                waitRow
                    ? waitRow["wait time"].toFixed(1)
                    : "N/A";

        }




        select.addEventListener(
            "change",
            updateCards
        );



        // Default province

        select.value = "BC";

        updateCards();


// Load healthcare map
loadMap(
    bedsData,
    doctorsData,
    unmetData,
    waitData
);

loadGrowthChart(
    bedsData,
    doctorsData,
    popData
);

// Performance matrix
loadPerformanceMatrix(
    doctorsData,
    unmetData,
    waitData
);
        
    } catch (error) {


        console.error(
            "Dashboard loading error:",
            error
        );


        document.getElementById("bedsValue").textContent = "Error";
        document.getElementById("doctorValue").textContent = "Error";
        document.getElementById("unmetValue").textContent = "Error";
        document.getElementById("waitValue").textContent = "Error";

    }

}


// ==========================
// Healthcare Capacity Map
// ==========================

async function loadMap(
    bedsData,
    doctorsData,
    unmetData,
    waitData
){

    const geoResponse = await fetch(GEO_URL);

    if(!geoResponse.ok){
        throw new Error("GeoJSON failed to load");
    }


    const canadaGeo = await geoResponse.json();



    let selectedMetric = "beds";

    let selectedYear = 2024;



    const yearSlider =
        document.getElementById("mapYearSlider");


    const yearLabel =
        document.getElementById("selectedYear");



    // Slider settings

    yearSlider.min = 2019;

    yearSlider.max = 2024;

    yearSlider.value = 2024;


    yearLabel.textContent = 2024;





    // ==========================
    // Clean missing values
    // ==========================

    function cleanValue(value){

        if(
            value === "" ||
            value === null ||
            value === undefined ||
            isNaN(Number(value))
        ){

            return null;

        }


        return Number(value);

    }






    // ==========================
    // Prepare map data
    // ==========================

    function prepareData(){


        let data = [];



        // --------------------------
        // Hospital Beds
        // --------------------------

        if(selectedMetric === "beds"){


            data = bedsData

                .filter(d =>
                    Number(d.fiscal_yr) === selectedYear &&
                    d.alias === "per 100,000"
                )

                .map(d => ({

                    prov_cd:
                        d.prov_cd.toUpperCase(),

                    value:
                        cleanValue(
                            d.Total_hosp_bed
                        )

                }));

        }





        // --------------------------
        // Family Doctors
        // --------------------------

        if(selectedMetric === "doctors"){


            data = doctorsData

                .filter(d =>
                    Number(d.year) === selectedYear &&
                    d.alias === "per 100,000"
                )

                .map(d => ({

                    prov_cd:
                        d.prov_cd.toUpperCase(),

                    value:
                        cleanValue(d.fdp)

                }));

        }






        // --------------------------
        // Unmet Needs
        // --------------------------

        if(selectedMetric === "unmet"){


            data = unmetData

                .filter(d =>
                    Number(d.year) === selectedYear
                )

                .map(d => ({

                    prov_cd:
                        d["loc-a"].toUpperCase(),

                    value:
                        cleanValue(d.unmet)

                }));

        }






        // --------------------------
        // Wait Time
        // --------------------------

        if(selectedMetric === "wait"){


            data = waitData

                .filter(d =>
                    Number(d.year) === selectedYear &&
                    d["wait time"] !== ""
                )

                .map(d => ({

                    prov_cd:
                        d.prov_cd.toUpperCase(),

                    value:
                        cleanValue(
                            d["wait time"]
                        )

                }));

        }




        return data.filter(
            d => d.value !== null
        );

    }









    // ==========================
    // Draw Map
    // ==========================

    function drawMap(){



        const mapData = prepareData();



        const locations =
            mapData.map(
                d => d.prov_cd
            );



        const values =
            mapData.map(
                d => d.value
            );






        let colorScale;



        // Higher is better

        if(
            selectedMetric === "beds" ||
            selectedMetric === "doctors"
        ){


            colorScale = [

                [0, "#d73027"],

                [0.5, "#fee08b"],

                [1, "#1a9850"]

            ];

        }



        // Lower is better

        else{


            colorScale = [

                [0, "#1a9850"],

                [0.5, "#fee08b"],

                [1, "#d73027"]

            ];

        }







        const trace = {


            type:
                "choroplethmapbox",


            geojson:
                canadaGeo,


            locations:
                locations,


            z:
                values,


            featureidkey:
                "properties.CODE",



            colorscale:
                colorScale,



            marker:{


                line:{


                    color:"white",


                    width:1


                }


            },



            hovertemplate:


                "<b>%{location}</b><br>" +

                "Year: " + selectedYear +

                "<br>" +

                "Value: %{z:.1f}" +

                "<extra></extra>"

        };







        const layout = {


            autosize:true,


            mapbox:{


                style:
                    "carto-positron",


                zoom:
                    3.2,


                center:{


                    lat:57,


                    lon:-96

                }


            },


            margin:{


                t:10,

                b:10,

                l:10,

                r:10

            }


        };






        Plotly.react(

            "healthMap",

            [trace],

            layout,

            {
                responsive:true
            }

        );


    }








    // ==========================
    // Controls
    // ==========================


    document
        .getElementById("mapMetric")
        .addEventListener(
            "change",
            function(){

                selectedMetric =
                    this.value;


                drawMap();

            }
        );





    yearSlider.addEventListener(
        "input",
        function(){


            selectedYear =
                Number(this.value);


            yearLabel.textContent =
                selectedYear;


            drawMap();


        }
    );






    // Initial map

    drawMap();

}



// ==========================
// Growth CHART
// ==========================

function loadGrowthChart(
    bedsData,
    doctorsData,
    popData
){

    const select =
        document.getElementById("provinceSelect");



    function growthRate(values){

        let result = [];

        for(let i = 1; i < values.length; i++){

            result.push(
                ((values[i] - values[i-1]) / values[i-1]) * 100
            );

        }

        return result;

    }




    function drawCharts(){


        const province =
            select.value;



        // ==========================
        // Population
        // ==========================

        const popRow =
            popData.find(
                d=>d.Geography===province
            );


        if(!popRow){

            console.log(
                "No population data",
                province
            );

            return;

        }



        const popYears =
            Object.keys(popRow)
            .filter(
                y=>!isNaN(y)
            )
            .map(Number)
            .sort();



        const population =
            popYears.map(
                y=>Number(popRow[y])
            );



        const populationGrowth =
            growthRate(
                population
            );






        // ==========================
        // Beds TOTAL
        // ==========================

        const beds =
            bedsData
            .filter(
                d =>
                d.prov_cd === province &&
                d.alias === "Total"
            )
            .sort(
                (a,b)=>
                a.fiscal_yr-b.fiscal_yr
            );



        const bedYears =
            beds.map(
                d=>Number(d.fiscal_yr)
            );


        const bedTotals =
            beds.map(
                d=>Number(d.Total_hosp_bed)
            );



        const bedGrowth =
            growthRate(
                bedTotals
            );




        // ==========================
        // Doctors TOTAL
        // ==========================

        const doctors =
            doctorsData
            .filter(
                d =>
                d.prov_cd === province &&
                d.alias === "Total"
            )
            .sort(
                (a,b)=>
                a.year-b.year
            );



        const doctorYears =
            doctors.map(
                d=>Number(d.year)
            );


        const doctorTotals =
            doctors.map(
                d=>Number(d.fdp)
            );


        const doctorGrowth =
            growthRate(
                doctorTotals
            );







// ==========================
// BED CHART
// ==========================

const bedYearsGrowth = bedYears.slice(1);

const popGrowthBed = bedYearsGrowth.map(year => {

    const idx = popYears.indexOf(year);

    return idx > 0
        ? populationGrowth[idx - 1]
        : null;

});


const validBeds = bedYearsGrowth
    .map((year,i) => ({
        year,
        pop: popGrowthBed[i],
        bed: bedGrowth[i]
    }))
    .filter(d =>
        d.pop !== null &&
        d.bed !== undefined
    );


const bedGap = validBeds.map(
    d => d.pop - d.bed
);


// ==========================
// Linear Regression Trendline
// ==========================

function regressionTrend(x, y){

    const n = x.length;

    const xMean =
        x.reduce((a,b)=>a+b,0) / n;

    const yMean =
        y.reduce((a,b)=>a+b,0) / n;


    let numerator = 0;
    let denominator = 0;


    for(let i = 0; i < n; i++){

        numerator +=
            (x[i] - xMean) *
            (y[i] - yMean);

        denominator +=
            Math.pow(x[i] - xMean, 2);

    }


    const slope =
        numerator / denominator;


    const intercept =
        yMean - slope * xMean;


    return x.map(
        value =>
            intercept + slope * value
    );

}



// Regression trend
const bedTrend = regressionTrend(
    validBeds.map(d=>d.year),
    bedGap
);

Plotly.react(
    "bedGrowthChart",
    [
        {
            x: validBeds.map(d=>d.year),
            y: validBeds.map(d=>d.pop),
            name:"Population Growth",
            mode:"lines+markers",
            type:"scatter"
        },

        {
            x: validBeds.map(d=>d.year),
            y: validBeds.map(d=>d.bed),
            name:"Hospital Bed Growth",
            mode:"lines+markers",
            type:"scatter"
        },

        {
            x: validBeds.map(d=>d.year),
            y: bedTrend,
            name:"Gap Trend",
            mode:"lines",
            line:{
                dash:"dash",
                width:3
            },
            type:"scatter"
        }
    ],
    {
        title:
        `Population Growth vs Hospital Bed Growth (${province})`,

        yaxis:{
            title:"Annual Growth (%)"
        },

        hovermode:"x unified"
    },
    {
        responsive:true
    }
);
// ==========================
// DOCTOR CHART
// ==========================

const doctorYearsGrowth = doctorYears.slice(1);

const popGrowthDoctor = doctorYearsGrowth.map(year => {

    const idx = popYears.indexOf(year);

    return idx > 0
        ? populationGrowth[idx - 1]
        : null;

});


const validDoctors = doctorYearsGrowth
    .map((year,i) => ({
        year,
        pop: popGrowthDoctor[i],
        doctor: doctorGrowth[i]
    }))
    .filter(d =>
        d.pop !== null &&
        d.doctor !== undefined
    );


const doctorGap = validDoctors.map(
    d => d.pop - d.doctor
);


const doctorTrend = regressionTrend(
    validDoctors.map(d=>d.year),
    doctorGap
);

Plotly.react(
    "doctorGrowthChart",
    [
        {
            x: validDoctors.map(d=>d.year),
            y: validDoctors.map(d=>d.pop),
            name:"Population Growth",
            mode:"lines+markers",
            type:"scatter"
        },

        {
            x: validDoctors.map(d=>d.year),
            y: validDoctors.map(d=>d.doctor),
            name:"Family Doctor Growth",
            mode:"lines+markers",
            type:"scatter"
        },

        {
            x: validDoctors.map(d=>d.year),
            y: doctorTrend,
            name:"Gap Trend",
            mode:"lines",
            line:{
                dash:"dash",
                width:3
            },
            type:"scatter"
        }
    ],
    {
        title:
        `Population Growth vs Family Doctor Growth (${province})`,

        yaxis:{
            title:"Annual Growth (%)"
        },

        hovermode:"x unified"
    },
    {
        responsive:true
    }
);

    }
    // initial load
    
    drawCharts();



    // update when province changes

    select.addEventListener(
        "change",
        drawCharts
    );



}

// ==========================
// PERFORMANCE CHART
// ==========================

    
function loadPerformanceMatrix(
    doctorsData,
    unmetData,
    waitData
){

    const year = 2024;


    // ==========================
    // Filter data
    // ==========================

    const doctors = doctorsData.filter(
        d =>
            Number(d.year) === year &&
            d.alias === "per 100,000"
    );


    const unmet = unmetData.filter(
        d =>
            Number(d.year) === year
    );


    const wait = waitData.filter(
        d =>
            Number(d.year) === year &&
            d["item 2"] === 
            "Emergency Department Wait Time for Physician Initial Assessment" &&
            d["item "] === "90th percentile"
    );



    // ==========================
    // Combine datasets
    // ==========================

    let matrixData = [];


    Object.keys(provinceNames).forEach(code => {


        const doctorRow = doctors.find(
            d => d.prov_cd.toUpperCase() === code
        );


        const unmetRow = unmet.find(
            d => d["loc-a"].toUpperCase() === code
        );


        const waitRow = wait.find(
            d => d.prov_cd.toUpperCase() === code
        );



        if(
            doctorRow &&
            unmetRow &&
            waitRow &&
            waitRow["wait time"] !== ""
        ){

            matrixData.push({

                province: provinceNames[code],

                code: code,

                doctors:
                    Number(doctorRow.fdp),

                unmet:
                    Number(unmetRow.unmet),

                wait:
                    Number(waitRow["wait time"])

            });

        }


    });



    // ==========================
    // Bubble scaling
    // ==========================

    const minDoctor = Math.min(
        ...matrixData.map(d=>d.doctors)
    );


    const bubbleSizes = matrixData.map(d => {

        return 10 +
            (
                (d.doctors - minDoctor)
                /
                minDoctor
            )
            * 40;

    });



    // ==========================
    // Create chart
    // ==========================


    const trace = {


        x:
            matrixData.map(
                d=>d.wait
            ),


        y:
            matrixData.map(
                d=>d.unmet
            ),


        text:
            matrixData.map(
                d=>d.province
            ),


        mode:
            "markers+text",


        textposition:
            "top center",


        type:
            "scatter",


        marker:{


            size:
                bubbleSizes,


            sizemode:
                "diameter",


            opacity:
                0.75


        },


        hovertemplate:


            "<b>%{text}</b><br>" +

            "Wait Time: %{x:.1f} hours<br>" +

            "Unmet Need: %{y:.1f}%<br>" +

            "<extra></extra>"

    };




    Plotly.react(

        "performanceMatrix",

        [trace],

        {


            title:
                "Healthcare Performance Matrix (2024)",


            xaxis:{

                title:
                    "Emergency Department Wait Time (hours)"

            },


            yaxis:{

                title:
                    "Unmet Healthcare Needs (%)"

            },


            hovermode:
                "closest",


            margin:{

                t:60

            }

        },


        {

            responsive:true

        }

    );

}
loadDashboard();
