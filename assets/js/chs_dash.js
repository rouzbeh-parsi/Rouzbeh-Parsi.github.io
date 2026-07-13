const DATA_URL = "/data/health/Beds.json";

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

    // Keep only 2024 observations
    const beds2024 = data.filter(d => d.fiscal_yr === 2024);

    // Sort provinces
    beds2024.sort((a,b)=>a.prov_cd.localeCompare(b.prov_cd));

    const select = document.getElementById("provinceSelect");

Object.entries(provinceNames).forEach(([code, name]) => {

    const option = document.createElement("option");

    option.value = code;

    option.text = name;

    select.appendChild(option);

});


    function updateCard(){

        const province = select.value;

        const row = beds2024.find(d=>d.prov_cd===province);

        if(!row) return;

        document.getElementById("bedsValue").innerHTML =
            row.Total_hosp_bed.toFixed(1);

    }

    select.addEventListener("change",updateCard);

    updateCard();

}

loadBeds();
