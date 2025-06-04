// Definitions of years and clustering options
const years = ["2008", "2013", "2020-2022"];
const clusteringOptions = {
    "4": "4 Variables (Total MS Cases, Prevalence, Incidence, Mean Age of Onset)",
    "2": "2 Variables (Total MS Cases, Mean Age of Onset)",
    "ms-smokers": "Correlation: Total MS Cases vs. Smokers"
};

let selectedCluster = null;         // To track the selected cluster

const endpoints = {
    "2": "https://mastro94visualanalytics.pythonanywhere.com/api/runPCA2",
    "4": "https://mastro94visualanalytics.pythonanywhere.com/api/runPCA4",
    "ms-smokers": "https://mastro94visualanalytics.pythonanywhere.com/api/runMergePCA"
};

// Function to update the clustering visualization
function updateClusterVisualization(selectedYear) {
    const currentOption = d3.select("#pca-variable-selector").property("value");
    const currentK = d3.select("#cluster-dropdown").property("value");
    loadAndRenderData(selectedYear, currentOption, currentK);
    d3.select("#pca-year-selector").property("value", selectedYear);
}

// Year dropdown
const yearDropdownClusterVisualization = d3.select("#pca-year-selector")
    .on("change", function () {
        const selectedYear = this.value;
        const selectedOption = variableDropdown.property("value");
        const currentK = d3.select("#cluster-dropdown").property("value");
        loadAndRenderData(selectedYear, selectedOption, currentK);
        const sliderValue = years.indexOf(selectedYear);
        d3.select("#years").property("value", sliderValue);
        d3.select("#selected-year").text(selectedYear);
    });

yearDropdownClusterVisualization.selectAll("option")
    .data(years)
    .enter()
    .append("option")
    .text(d => d)
    .attr("value", d => d);

// Metric dropdown
const variableDropdown = d3.select("#pca-variable-selector")
    .on("change", function () {
        const selectedOption = this.value;
        const selectedYear = d3.select("#pca-year-selector").property("value");
        const currentK = d3.select("#cluster-dropdown").property("value");
        loadAndRenderData(selectedYear, selectedOption, currentK);
    });

variableDropdown.selectAll("option")
    .data(Object.entries(clusteringOptions))
    .enter()
    .append("option")
    .text(([key, label]) => label)
    .attr("value", ([key]) => key);

//Cluster dropdown
const clusterDropdown = d3.select("#cluster-dropdown")
    .on("change", function () {
        const currentK = this.value;
        const selectedYear = d3.select("#pca-year-selector").property("value");
        const selectedOption = d3.select("#pca-variable-selector").property("value");
        loadAndRenderData(selectedYear, selectedOption, currentK);
    });

// cluster dropdown with values from 3 to 6
clusterDropdown.selectAll("option")
    .data([3, 4, 5, 6])
    .enter()
    .append("option")
    .text(d => d)
    .attr("value", d => d);

// Load and render PCA data by calling the proper endpoint with year and k
function loadAndRenderData(year, variableCount, k) {
    // Understanding which endpoint to use based on variableCount
    const endpoint = endpoints[variableCount];
    if (!endpoint) {
        console.error("Invalid variableCount selected.");
        return;
    }

    //building of JSON payload
    const payload = { year: year, k: k };

    // POST request
    fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }
        //return response.json();
        return response.text().then(text => {
            try {
                return JSON.parse(text);
            } catch (e) {
                throw new Error("Failed to parse JSON: " + e.message);
            }
        });
                
    })
    .then(data => {
        if (!data || data.length === 0) {
            console.error(`No data available for year ${year} with k=${k}.`);
            return;
        }

        data.forEach(d => {
            d.PCA1 = +d.PCA1;
            d.PCA2 = +d.PCA2;
            d.Cluster = +d.Cluster;
        });

        // Render the chart with  processed data
        renderPCAChart(data);
    })
    .catch(error => {
        console.error(`Error loading or processing data for year ${year} with k=${k}:`, error);
    });
}


//render the PCA chart with  legend
function renderPCAChart(data) {
    const container = d3.select("#pca-clustering-container");
    const containerWidth = container.node().getBoundingClientRect().width;
    const containerHeight = container.node().getBoundingClientRect().height;
    const margin = { top: 50, right: 150, bottom: 70, left: 100 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    // Clear previous chart
    container.html("");
    const svg = container.append("svg")
        .attr("width", containerWidth)
        .attr("height", containerHeight);

    const chartArea = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Define scales
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.PCA1))
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.PCA2))
        .range([height, 0]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Function to filter clusters dynamically
    function updateClusterVisibility() {
        d3.selectAll(".cluster-dot")
            .transition()
            .duration(500)
            .style("opacity", d => (selectedCluster === null || d.Cluster === selectedCluster) ? 1 : 0.2);
    }

    function updateLegendHighlight() {
        d3.selectAll(".legend-item text")
            .style("font-weight", cluster => (selectedCluster === cluster) ? "bold" : "normal")
            .style("opacity", cluster => (selectedCluster === null || selectedCluster === cluster) ? 1 : 0.5);

        d3.selectAll(".legend-item circle")
            .style("stroke", cluster => (selectedCluster === cluster) ? "black" : "none")
            .style("stroke-width", cluster => (selectedCluster === cluster) ? 3 : 0);
    }

    // Add axes
    // X-Axis
    chartArea.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale)
            .ticks(8) 
        )
        .selectAll(".tick text")
        .style("font-size", "28px")
        .style("font-family", "Arial, sans-serif")
        .style("fill", "black");

    chartArea.append("text")
        .attr("x", width / 2)
        .attr("y", height + 60)
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .attr("font-size", "35px")
        .style("font-weight", "bold")
        .text("PCA1");

    // Y-Axis
    chartArea.append("g")
        .call(d3.axisLeft(yScale)
            .ticks(8) 
        )
        .selectAll(".tick text")
        .style("font-size", "28px")
        .style("font-family", "Arial, sans-serif")
        .style("fill", "black");

    chartArea.append("text")
        .attr("class", "axis-label")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 25)
        .attr("transform", "rotate(-90)")
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .attr("font-size", "35px")
        .style("font-weight", "bold")
        .text("PCA2");

    // tooltip for interactivity
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background", "rgba(0,0,0,0.85)")
        .style("color", "white")
        .style("padding", "12px")
        .style("border-radius", "6px")
        .style("font-size", "30px")
        .style("font-weight", "bold")
        .style("width", "auto")
        .style("max-width", "300px")
        .style("text-align", "left")
        .style("z-index", "1000");

    // Plot data points
    chartArea.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "cluster-dot")
        .attr("cx", d => xScale(d.PCA1))
        .attr("cy", d => yScale(d.PCA2))
        .attr("r", 14)
        .attr("fill", d => colorScale(d.Cluster))
        .style("opacity", 1)
        .on("mouseover", (event, d) => {
            tooltip.style("visibility", "visible")
                .html(`
                    <strong>Country:</strong> ${d.Country}<br>
                    <strong>Region:</strong> ${d.Region}<br>
                    <strong>Cluster:</strong> ${d.Cluster}<br>
                    <strong>PCA1:</strong> ${d.PCA1.toFixed(2)}<br>
                    <strong>PCA2:</strong> ${d.PCA2.toFixed(2)}
                `);
        })
        .on("mousemove", event => {
            tooltip.style("top", `${event.pageY - 20}px`)
                .style("left", `${event.pageX + 10}px`);
        })
        .on("mouseout", () => tooltip.style("visibility", "hidden"))
        .on("click", (event, d) => {
            selectedCluster = (selectedCluster === d.Cluster) ? null : d.Cluster;
            updateClusterVisibility();
            updateLegendHighlight();
        });

    // Add legend
    const clusters = Array.from(new Set(data.map(d => d.Cluster))); 
    const legend = svg.append("g")
        .attr("transform", `translate(${width - 80}, ${height / 4})`);

    // Legend box
    legend.append("rect")
        .attr("x", -20)
        .attr("y", -20)
        .attr("width", 250)
        .attr("height", clusters.length * 45 + 30)
        .attr("fill", "white")
        .attr("stroke", "black")
        .attr("stroke-width", 3)
        .attr("rx", 12)
        .attr("ry", 12);

    // Legend items
    legend.selectAll(".legend-item")
        .data(clusters)
        .enter()
        .append("g")
        .attr("class", "legend-item")
        .attr("transform", (d, i) => `translate(15, ${i * 50})`)
        .on("click", (event, d) => {
            selectedCluster = (selectedCluster === d) ? null : d;
            updateClusterVisibility();
            updateLegendHighlight();
            d3.selectAll(".legend-item text")
                .style("font-weight", cluster => (selectedCluster === cluster) ? "bold" : "normal")
                .style("opacity", cluster => (selectedCluster === null || selectedCluster === cluster) ? 1 : 0.5);
        })
        .call(g => {
            g.append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", 14)
                .attr("fill", d => colorScale(d));
            g.append("text")
                .attr("x", 25)
                .attr("y", 6)
                .attr("fill", "black")
                .style("font-size", "22px")
                .style("dominant-baseline", "middle")
                .text(d => `Cluster ${d}`);
        });


    const legendHeight = clusters.length * 50 + 30;

    //Reset Button
    const resetButton = svg.append("g")
        .attr("class", "reset-button")
        .attr("transform", `translate(${width - 80}, ${height / 4 + legendHeight + 20})`)
        .style("cursor", "pointer")
        .on("click", function () {
            selectedCluster = null;
            updateClusterVisibility();
            updateLegendHighlight();
            d3.selectAll(".legend-item text")
                .style("font-weight", "normal")
                .style("opacity", 1);
        });

    resetButton.append("rect")
        .attr("x", -20)
        .attr("y", -10)
        .attr("width", 220)
        .attr("height", 40)
        .attr("fill", "#007bff")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("rx", 8)
        .attr("ry", 8);

    resetButton.append("text")
        .attr("x", 10)
        .attr("y", 15)
        .attr("fill", "white")
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .text("Show All Clusters");
}

// Initial load for the first year ("2008"), analysis ("4"), and default cluster value from the dropdown
const initialK = d3.select("#cluster-dropdown").property("value");
loadAndRenderData("2008", "4", initialK);

// Expose update function globally
window.updateClusterVisualization = updateClusterVisualization;
