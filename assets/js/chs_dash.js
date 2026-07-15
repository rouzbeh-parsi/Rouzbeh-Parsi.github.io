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


        const bedsData = await bedsResponse.json();
        const doctorsData = await doctorsResponse.json();
        const unmetData = await unmetResponse.json();
        const waitData = await waitResponse.json();
        const popData = await popResponse.json();


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
                    2.5,


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

// =================================
// Population vs Healthcare Growth
// =================================

function loadGrowthChart(
    bedsData,
    doctorsData,
    popData
){


    const province = "BC";


    // ------------------------------
    // Population
    // ------------------------------

    const popRow = popData.find(
        d => d.Geography === province
    );


    const years = Object.keys(popRow)
        .filter(
            d => !isNaN(d)
        )
        .map(
            d => Number(d)
        )
        .sort();



    const population = years.map(
        y => Number(popRow[y])
    );



    // ------------------------------
    // Hospital Beds Total
    // ------------------------------

    const beds = bedsData
        .filter(
            d =>
            d.prov_cd === province &&
            d.alias === "Total"
        )
        .sort(
            (a,b)=>
            a.fiscal_yr-b.fiscal_yr
        );



    // ------------------------------
    // Doctors Total
    // ------------------------------

    const doctors = doctorsData
        .filter(
            d =>
            d.prov_cd === province &&
            d.alias === "Total"
        )
        .sort(
            (a,b)=>
            a.year-b.year
        );




    function growth(values){

        let result=[];


        for(let i=1;i<values.length;i++){

            result.push(
                (
                    (values[i]-values[i-1])
                    /
                    values[i-1]
                )*100
            );

        }


        return result;

    }




    const popGrowth =
        growth(population);



    const bedGrowth =
        growth(
            beds.map(
                d=>Number(d.Total_hosp_bed)
            )
        );



    const doctorGrowth =
        growth(
            doctors.map(
                d=>Number(d.fdp)
            )
        );



    const tracePopulation = {

        x: years.slice(1),

        y: popGrowth,

        name:"Population",

        type:"scatter",

        mode:"lines+markers"

    };



    const traceBeds = {

        x: years.slice(1),

        y: bedGrowth,

        name:"Hospital Beds",

        type:"scatter",

        mode:"lines+markers"

    };



    const traceDoctors = {

        x: years.slice(1),

        y: doctorGrowth,

        name:"Family Doctors",

        type:"scatter",

        mode:"lines+markers"

    };





    const layout = {


        title:
        "Annual Growth Rate: Population vs Healthcare Capacity",


        yaxis:{

            title:
            "Annual Growth (%)"

        },


        xaxis:{

            title:
            "Year"

        },


        hovermode:
        "x unified"


    };




    Plotly.newPlot(

        "growthChart",

        [
            tracePopulation,
            traceBeds,
            traceDoctors
        ],

        layout,

        {
            responsive:true
        }

    );


}

loadDashboard();
