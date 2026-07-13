const DATA_URL = "/data/health dash/Beds.json";


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

    try {

        const response = await fetch(DATA_URL);

        if (!response.ok) {
            throw new Error("Cannot load Beds.json");
        }

        const data = await response.json();


        // Keep only 2024 observations
        const beds2024 = data.filter(
            d => Number(d.fiscal_yr) === 2024
        );


        const select = document.getElementById("provinceSelect");


        // Create dropdown
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
            else {

                // Canada calculation if zz does not exist
                if(province === "zz"){

                    const total =
                        beds2024.reduce(
                            (sum,d)=>sum + d.Total_hosp_bed,
                            0
                        );

                    const average =
                        total / beds2024.length;


                    document.getElementById("bedsValue").textContent =
                        average.toFixed(1);

                }
                else {

                    document.getElementById("bedsValue").textContent =
                        "N/A";

                }

            }

        }


        select.addEventListener(
            "change",
            updateCard
        );


        // Default selection
        select.value = "BC";

        updateCard();


    }
    catch(error){

        console.error(error);

        document.getElementById("bedsValue").textContent =
            "Error";

    }

}


loadBeds();
