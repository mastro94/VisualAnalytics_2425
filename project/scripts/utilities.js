// Default year

let globalYear = "2008";  

// Function to update the year globally from the slider
function updateYearFromSlider(value) {
    // Map slider values
    const yearMapping = {
        0: "2008",
        1: "2013",
        2: "2020-2022"
    };

    globalYear = yearMapping[value];

    
    d3.select("#selected-year").text(globalYear);

    // For updating all charts with the global year
    updateChoroplethMap(globalYear);
    updateScatterPlot(globalYear);
    updateClusterVisualization(globalYear);
    updateStackedBar(globalYear);
}

// Reset function to restore all visualizations to their default states and first year 2008
function resetApplication() {
    globalYear = "2008"; 

    // Reset slider
    d3.select("#years").property("value", 0); 
    d3.select("#selected-year").text(2008);

    // Reset dropdowns to default values
    d3.select("#year-selector").property("value", "2008");
    d3.select("#scatterplot-year").property("value", "2008");
    d3.select("#pca-year-selector").property("value", "2008");

    // Reset charts to default year and values
    updateChoroplethMap(globalYear);
    updateScatterPlot(globalYear);
    resetClusterVisualization(globalYear);
    resetStackedBarChart(); 
    resetParallelCoordinatesChart();

}

// Update the choroplethmap visualization with the selected year
function updateChoroplethMap(selectedYear) {
    d3.select("#year-selector").property("value", selectedYear);

    measureType = "prevalence";


    d3.select("#measure-selector").property("value",measureType);
    loadMapData(selectedYear, measureType); 
}

// Update the scatter plot chart with the selected year
function updateScatterPlot(selectedYear) {
    const scatterDropdown = d3.select("#scatterplot-year").node();
    scatterDropdown.value = selectedYear;
    
    renderScatterPlotByYear(selectedYear); 
}

// Update the stacked bar chart with the selected year
function updateStackedBar(selectedYear, reset = false) {
    const effectiveYear = selectedYear === "2008" ? "2013" : selectedYear;
    const yearSelect = document.getElementById("year-select");
    const regionSelect = document.getElementById("region-select");

    if (yearSelect) {
        yearSelect.value = effectiveYear;
    }


    let effectiveRegion;
    if (reset) {
        effectiveRegion = "all";
        if (regionSelect) regionSelect.value = "all"; 
    } else {
        effectiveRegion = regionSelect?.value || "all"; 
    }

    loadAndAggregateData(effectiveYear, effectiveRegion);
}

function initAutoZoom() {
  window.addEventListener('DOMContentLoaded', () => {
    document.body.style.zoom = '30%';
  });
}


// Update the cluster visualization with default values
function resetClusterVisualization() {
    const defaultYear = "2008";
    const defaultOption = "4"; 
    const defaultClusterNumbers = "3";

    d3.select("#pca-year-selector").property("value", defaultYear);
    d3.select("#pca-variable-selector").property("value", defaultOption);
    d3.select("#cluster-dropdown").property("value",defaultClusterNumbers);
    
    loadAndRenderData(defaultYear, defaultOption,defaultClusterNumbers);
}


// Reset the stacked bar chart to its default values
function resetStackedBarChart() {
    const defaultYear = "2013";
    const defaultRegion = "all";
  
    const yearSelect = document.getElementById("year-select");
    if (yearSelect) {
      yearSelect.value = defaultYear;
    }
  
    d3.select("#region-select").property("value", defaultRegion);

    updateStackedBar("2013", true);
}
  


function resetParallelCoordinatesChart() {
    if (window.parallelData) {
        renderParallelCoordinatesChart(window.parallelData, "Number of Prevalent Cases");
        d3.select("#metric-select").property("value", "Number of Prevalent Cases");

    } else {
        console.error("Parallel coordinates data not loaded yet.");
    }
}

  