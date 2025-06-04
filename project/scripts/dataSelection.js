const chartSelectedOption = { value: "per100k" };   // Track selected option in an object
let chartData; //Global variable to hold the loaded data

// Load CSV data
d3.csv("./scripts/converted_csv/(final_version)merged_2020-2022_with_region_country_code_converted.csv").then(loadedData => {
    chartData = loadedData; 
    initializeChartDataSelection(); 
    renderChartRegionAggregation(); 
});

function initializeChartDataSelection() {
    d3.select("#ms-cases-option").on("change", function() {
        chartSelectedOption.value = this.value;
        clearChartArea(); 
    });
}

function displayChartCountryData(countryData) {
    const selectedData = chartSelectedOption.value === "per100k"
        ? `${countryData['Prevalence of MS per 100,000']} per 100,000`
        : `${countryData['Number of Prevalent Cases']}`;

    d3.select("#country-name")
        .style("display", "block") 
        .html(`
            <strong>Country:</strong> ${countryData.Country}<br>
            <strong>Population (2019):</strong> ${countryData['2019 Estimated Population'].toLocaleString()}<br>
            <strong>${chartSelectedOption.value === "per100k" ? "Prevalence" : "Total Cases"}:</strong> ${selectedData}
        `);
}

function clearChartArea() {
    d3.select("#chart").selectAll("*").remove(); 
}

function renderChartRegionAggregation() {
    d3.select("#region-chart").selectAll("*").remove();

    // Aggregate data
    const regionData = Array.from(
        d3.group(chartData.filter(d => d.Region && d['Number of Prevalent Cases']), d => d.Region),
        ([key, values]) => ({
            region: key,
            totalCases: d3.sum(values, d => +d['Number of Prevalent Cases'] || 0)
        })
    );

    const regionChartWidth = 800;
    const regionChartHeight = 400;
    const regionChartMargin = { top: 20, right: 30, bottom: 40, left: 100 };

    const regionChartSvg = d3.select("#region-chart").append("svg")
        .attr("width", regionChartWidth)
        .attr("height", regionChartHeight)
        .append("g")
        .attr("transform", `translate(${regionChartMargin.left},${regionChartMargin.top})`);

    const regionChartX = d3.scaleLinear()
        .domain([0, d3.max(regionData, d => d.totalCases)])
        .range([0, regionChartWidth - regionChartMargin.left - regionChartMargin.right]);

    const regionChartY = d3.scaleBand()
        .domain(regionData.map(d => d.region))
        .range([0, regionChartHeight - regionChartMargin.top - regionChartMargin.bottom])
        .padding(0.1);

    // Add bars
    regionChartSvg.selectAll(".bar")
        .data(regionData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("y", d => regionChartY(d.region))
        .attr("width", d => regionChartX(d.totalCases))
        .attr("height", regionChartY.bandwidth())
        .style("fill", "steelblue");

    // Add value labels
    regionChartSvg.selectAll(".label")
        .data(regionData)
        .enter()
        .append("text")
        .attr("class", "label")
        .attr("x", d => regionChartX(d.totalCases) + 5) 
        .attr("y", d => regionChartY(d.region) + regionChartY.bandwidth() / 2)
        .attr("dy", ".35em") 
        .text(d => d.totalCases.toLocaleString()); 

    // Add x-axis
    regionChartSvg.append("g")
        .attr("transform", `translate(0,${regionChartHeight - regionChartMargin.top - regionChartMargin.bottom})`)
        .call(d3.axisBottom(regionChartX).ticks(5))
        .append("text")
        .attr("y", regionChartMargin.bottom - 10)
        .attr("x", regionChartWidth - regionChartMargin.right)
        .attr("text-anchor", "end")
        .attr("fill", "black")
        .text("Total MS Cases");

    // Add y-axis
    regionChartSvg.append("g")
        .call(d3.axisLeft(regionChartY))
        .append("text")
        .attr("y", -regionChartMargin.left + 10)
        .attr("x", -regionChartMargin.top)
        .attr("text-anchor", "end")
        .attr("fill", "black")
        .text("Region");
}
