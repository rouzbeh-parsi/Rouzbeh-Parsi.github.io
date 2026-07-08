window.onload = function(){

// KPI values
document.getElementById("avgPrice").innerHTML="$742,000";
document.getElementById("medianIncome").innerHTML="$97,500";
document.getElementById("ratio").innerHTML="7.6×";
document.getElementById("mortgage").innerHTML="$3,940";
document.getElementById("burden").innerHTML="48%";
document.getElementById("needed").innerHTML="$158,000";

// Placeholder map
Plotly.newPlot("map",[],{

title:"Canada Housing Affordability Map (Coming Soon)",

height:650,

annotations:[{

text:"Interactive choropleth map will appear here.",

showarrow:false,

font:{size:20}

}]

});

// Placeholder charts
function placeholder(id,title){

Plotly.newPlot(id,[],{

title:title,

height:500,

annotations:[{

text:"Data visualization coming soon.",

showarrow:false,

font:{size:20}

}]

});

}

placeholder("priceChart","House Prices");
placeholder("ratioChart","Price-to-Income Ratio");
placeholder("mortgageChart","Mortgage Burden");

};
