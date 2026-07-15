const BEDS_URL = "/assets/data/health/Beds.json";
const DOCTORS_URL = "/assets/data/health/DPF.json";

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

        const [bedsResponse, doctorsResponse] = await Promise.all([
            fetch(BEDS_URL),
            fetch(DOCTORS_URL)
        ]);

        const bedsData = await bedsResponse.json();
        const doctorsData = await doctorsResponse.json();

        // Hospital beds (2024, per 100,000)
        const beds2024 = bedsData.filter(
            d =>
                Number(d.fiscal_yr) === 2024 &&
                d.alias === "per 100,000"
        );

        // Family doctors (2024, per 100,000)
        const doctors2024 = doctorsData.filter(
            d =>
                Number(d.year) === 2024 &&
                d.alias === "per 100,000"
        );

        const select = document.getElementById("provinceSelect");

        // Populate dropdown only once
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
                d => d.prov_cd === province
            );

            document.getElementById("bedsValue").textContent =
                bedsRow
                    ? Math.round(bedsRow.Total_hosp_bed).toLocaleString()
                    : "N/A";

            // ==========================
            // Family Doctors
            // ==========================
            const doctorRow = doctors2024.find(
                d => d.prov_cd === province
            );

            document.getElementById("doctorValue").textContent =
                doctorRow
                    ? Math.round(doctorRow.fdp).toLocaleString()
                    : "N/A";
        }

        select.addEventListener(
            "change",
            updateCards
        );

        // Default province
        select.value = "BC";

        updateCards();

    } catch (error) {

        console.error("Dashboard loading error:", error);

        document.getElementById("bedsValue").textContent = "Error";
        document.getElementById("doctorValue").textContent = "Error";
    }
}

loadDashboard();
