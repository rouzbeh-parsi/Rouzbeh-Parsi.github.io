const BEDS_URL = "/assets/data/health/beds.json";
const DOCTORS_URL = "/assets/data/health/DPF.json";
const UNMET_URL = "/assets/data/health/unmet.json";
const WAIT_URL = "/assets/data/health/wait.json";
const GEO_URL = "/assets/data/canada.geojson";


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
            waitResponse
        ] = await Promise.all([
            fetch(BEDS_URL),
            fetch(DOCTORS_URL),
            fetch(UNMET_URL),
            fetch(WAIT_URL)
        ]);


        const bedsData = await bedsResponse.json();
        const doctorsData = await doctorsResponse.json();
        const unmetData = await unmetResponse.json();
        const waitData = await waitResponse.json();



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
    beds2024,
    doctors2024,
    unmet2024,
    wait2024
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




async function loadMap(
    beds2024,
    doctors2024,
    unmet2024,
    wait2024
){

    const geoResponse = await fetch(GEO_URL);

    const canadaGeo = await geoResponse.json();


    let selectedMetric = "beds";


    function prepareData(metric){

        let data = [];


        if(metric === "beds"){

            data = beds2024.map(d => ({
                prov_cd: d.prov_cd.toUpperCase(),
                value: d.Total_hosp_bed
            }));

        }


        if(metric === "doctors"){

            data = doctors2024.map(d => ({
                prov_cd: d.prov_cd.toUpperCase(),
                value: d.fdp
            }));

        }


        if(metric === "unmet"){

            data = unmet2024.map(d => ({
                prov_cd: d["loc-a"].toUpperCase(),
                value: d.unmet
            }));

        }


        if(metric === "wait"){

            data = wait2024.map(d => ({
                prov_cd: d.prov_cd.toUpperCase(),
                value: d["wait time"]
            }));

        }


        return data;

    }



    function drawMap(){


        const mapData = prepareData(selectedMetric);


        const values = {};


        mapData.forEach(d => {

            values[d.prov_cd] = d.value;

        });



        const trace = {

            type: "choroplethmapbox",

            geojson: canadaGeo,


            locations: Object.keys(values),


            z: Object.values(values),


            featureidkey: "properties.CODE",


            colorscale: "Viridis",


            marker: {

                line: {

                    color: "white",

                    width: 1

                }

            },


            hovertemplate:

                "<b>%{location}</b><br>" +

                "Value: %{z:.1f}" +

                "<extra></extra>"

        };




        const layout = {

            mapbox: {

                style: "carto-positron",

                zoom: 2.8,

                center: {

                    lat: 57,

                    lon: -96

                }

            },


            margin: {

                t: 0,

                b: 0,

                l: 0,

                r: 0

            }

        };



        Plotly.newPlot(

            "healthMap",

            [trace],

            layout,

            {
                responsive: true
            }

        );

    }



    drawMap();



    document
        .getElementById("mapMetric")
        .addEventListener(
            "change",
            function(){

                selectedMetric = this.value;

                drawMap();

            }
        );

}
loadDashboard();
