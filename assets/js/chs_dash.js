const DATA_URL =
"/_data/health%20dash/Beds.json";

async function loadBeds(){

    const response = await fetch(DATA_URL);

    const data = await response.json();

    // Keep only 2024 observations
    const beds2024 = data.filter(d => d.fiscal_yr === 2024);

    // Sort provinces
    beds2024.sort((a,b)=>a.prov_cd.localeCompare(b.prov_cd));

    const select = document.getElementById("provinceSelect");

    beds2024.forEach(row=>{

        const option = document.createElement("option");

        option.value = row.prov_cd;

        option.text = row.prov_cd;

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
