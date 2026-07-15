
const DATA_URL = "{{ '/assets/data/health/Beds.json' | relative_url }}";



const provinceNames = {
    "zz": "Canada",
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


async function loadBeds(){

    const response = await fetch(DATA_URL);

    const data = await response.json();


    // Select only 2024 and per 100,000 records
    const beds2024 = data.filter(
        d =>
        Number(d.fiscal_yr) === 2024 &&
        d.alias === "per 100,000"
    );


    const select = document.getElementById("provinceSelect");


    // Create province dropdown
    Object.entries(provinceNames).forEach(([code, name]) => {

        const option = document.createElement("option");

        option.value = code;

        option.textContent = name;

        select.appendChild(option);

    });



    function updateCard(){

        const province = select.value;


        const row = beds2024.find(
            d => d.prov_cd === province
        );


        if(row){

            document.getElementById("bedsValue").textContent =
                row.Total_hosp_bed.toFixed(1);

        }
        else{

            document.getElementById("bedsValue").textContent =
                "N/A";

        }

    }


    select.addEventListener(
        "change",
        updateCard
    );


    // Default province
    select.value = "BC";

    updateCard();

}


loadBeds();
