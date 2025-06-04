document.addEventListener("DOMContentLoaded", () => {

    const baseUrl = "https://mastro94visualanalytics.pythonanywhere.com/api/data/parallelCoordinates";
    
    
    const file2008 = "Aggregated_Data_2008.csv";
    const file2013 = "Aggregated_Data_2013.csv";
    const file2020 = "Aggregated_Data_2020-2022.csv";

    
    const url2008 = `${baseUrl}?file=${encodeURIComponent(file2008)}`;
    const url2013 = `${baseUrl}?file=${encodeURIComponent(file2013)}`;
    const url2020 = `${baseUrl}?file=${encodeURIComponent(file2020)}`;

    // Fetch data
    Promise.all([
        fetch(url2008).then(res => res.ok ? res.json() : Promise.reject(`Error loading 2008 data: ${res.statusText}`)),
        fetch(url2013).then(res => res.ok ? res.json() : Promise.reject(`Error loading 2013 data: ${res.statusText}`)),
        fetch(url2020).then(res => res.ok ? res.json() : Promise.reject(`Error loading 2020-2022 data: ${res.statusText}`))
    ])
    .then(([data2008, data2013, data2020]) => {

        // Processing Data
        function preprocessParallelData(data) {
            data.forEach(d => {
                d["Region"] = d["Macro Region"] || "";
                d["Number of Prevalent Cases"] = +d["Number of people with MS"] || 0;
                d["Mean Age of Onset"] = +d["Mean age of onset"] || 0;
                d["Prevalence of MS per 100,000"] = +d["Prevalence of MS per 100,000"] || 0;
            });
            return data;
        }

        data2008 = preprocessParallelData(data2008);
        data2013 = preprocessParallelData(data2013);
        data2020 = preprocessParallelData(data2020);

        // Merging Data by Region
        const regions = Array.from(new Set([
            ...data2008.map(d => d["Region"]),
            ...data2013.map(d => d["Region"]),
            ...data2020.map(d => d["Region"])
        ]));

        const combinedData = regions.map(region => {
            const d2008 = data2008.find(d => d["Region"] === region) || {};
            const d2013 = data2013.find(d => d["Region"] === region) || {};
            const d2020 = data2020.find(d => d["Region"] === region) || {};
            return {
                Region: region,
                "2008": {
                    "Number of Prevalent Cases": d2008["Number of Prevalent Cases"] || 0,
                    "Mean Age of Onset": d2008["Mean Age of Onset"] || 0,
                    "Prevalence of MS per 100,000": d2008["Prevalence of MS per 100,000"] || 0
                },
                "2013": {
                    "Number of Prevalent Cases": d2013["Number of Prevalent Cases"] || 0,
                    "Mean Age of Onset": d2013["Mean Age of Onset"] || 0,
                    "Prevalence of MS per 100,000": d2013["Prevalence of MS per 100,000"] || 0
                },
                "2020": {
                    "Number of Prevalent Cases": d2020["Number of Prevalent Cases"] || 0,
                    "Mean Age of Onset": d2020["Mean Age of Onset"] || 0,
                    "Prevalence of MS per 100,000": d2020["Prevalence of MS per 100,000"] || 0
                }
            };
        });

        window.parallelData = combinedData;

  
        renderParallelCoordinatesChart(combinedData, "Number of Prevalent Cases");


        const metrics = ["Number of Prevalent Cases", "Mean Age of Onset", "Prevalence of MS per 100,000"];
        const dropdown = d3.select("#metric-select")
            .on("change", function () {
                renderParallelCoordinatesChart(combinedData, this.value);
            });

        dropdown.selectAll("option")
            .data(metrics)
            .enter()
            .append("option")
            .text(d => d)
            .attr("value", d => d);

    })
    .catch(error => {
        console.error("Error loading Parallel Coordinates data from Flask API:", error);
    });
});






function renderParallelCoordinatesChart(data, metric) {


    d3.select("#parallel-chart").html(""); 

    const container = d3.select("#parallel-chart").node();
    const containerRect = container.getBoundingClientRect();


    const margin = { top: 70, right: 90, bottom: 50, left: 100 };

    const width = containerRect.width - margin.left - margin.right;
    const height = containerRect.height - margin.top - margin.bottom;


    const svg = d3.select("#parallel-chart")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", `translate(${margin.left},${margin.top})`);

    const dimensions = ["2008", "2013", "2020"];
    const dimensionLabels = {
        "2008": "2008",
        "2013": "2013",
        "2020": "2020-2022"
    };

    // Filtering data (excluding invalid entries where region is empty or values are all zero)
    const validData = data.filter(d =>
        d.Region !== "" && 
        d.Region !== "0" && 
        dimensions.some(year => d[year] && d[year][metric] !== 0) 
    );


    if (validData.length === 0) {
        console.error("No valid data for selected metric:", metric);
        return; 
    }

    const globalMin = d3.min(validData, d => d3.min(dimensions, year => d[year][metric]));
    const globalMax = d3.max(validData, d => d3.max(dimensions, year => d[year][metric]));

    const yGlobalScale = d3.scaleLinear()
        .domain([globalMin, globalMax]) 
        .range([height, 0]); 

    const xScale = d3.scalePoint().domain(dimensions).range([0, width]);

    const tooltip = d3.select("body").append("div")
        .attr("class", "general-tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background", "rgba(0, 0, 0, 0.8)")
        .style("color", "white")
        .style("padding", "10px")
        .style("border-radius", "6px")
        .style("font-size", "40px") 
        .style("font-family", "Arial, sans-serif")
        .style("text-align", "left")
        .style("pointer-events", "none") 
        .style("z-index", "1000");

    svg.selectAll(".line")
        .data(validData)
        .join("path")
        .attr("class", "line")
        .attr("d", d =>
            d3.line()
                .x(year => xScale(year))
                .y(year => yGlobalScale(d[year][metric]))
                (dimensions)
        )
        .attr("fill", "none")
        .attr("stroke", d => getRegionColor(d.Region))
        .attr("stroke-width", 4)
        .on("mouseover", function (event, d) {
            d3.select(this).attr("stroke-width", 20);

            const formatNumber = value => (value ? Math.ceil(value * 100) / 100 : "N/A"); 


            const tooltipContent = `
                <strong>Region:</strong> ${d.Region}<br>
                <strong>Metric:</strong> ${metric}<br>
                <strong>2008:</strong> ${formatNumber(d["2008"][metric])}<br>
                <strong>2013:</strong> ${formatNumber(d["2013"][metric])}<br>
                <strong>2020-2022:</strong> ${formatNumber(d["2020"][metric])}
            `;


            tooltip
                .html(tooltipContent)
                .style("visibility", "visible")
                .style("left", `${event.pageX + 15}px`)
                .style("bottom", "10px")
                .style("transform", "translateX(-50%)");
        })
        .on("mousemove", function (event) {
            tooltip
                .style("left", "60%")
                .style("bottom", "10px")
                .style("transform", "translateX(-50%)");
                })
        .on("mouseout", function () {
            d3.select(this).attr("stroke-width", 4);

            
            tooltip.style("visibility", "hidden");
        });


    svg.selectAll(".dimension")
        .data(dimensions)
        .join("g")
        .attr("class", "dimension")
        .attr("transform", d => `translate(${xScale(d)},0)`)
        .each(function(d) {
            d3.select(this)
            .call(d3.axisLeft(yGlobalScale).ticks(10)) 
                .selectAll("text")
                .style("font-size", "21px") 
                .style("font-weight", "bold");
        })
        .append("text")
        .attr("y", -10) 
        .attr("x", -20) 
        .attr("text-anchor", "middle")
        .style("font-size", "20px") 
        .style("font-weight", "bold")
        .text(d => dimensionLabels[d]);


    svg.selectAll(".time-label")
        .data(dimensions)
        .join("text")
        .attr("class", "time-label")
        .attr("x", d => xScale(d))
        .attr("y", height + 40)
        .attr("text-anchor", "middle")
        .style("font-size", "32px")
        .style("font-weight", "bold")
        .text(d => dimensionLabels[d]);
}





function getRegionColor(region) {
    const regionColors = {
        "African": "#1f77b4",
        "Americas": "#ff7f0e",
        "European": "#2ca02c",
        "Western Pacific": "#d62728",
        "South-East Asia": "#9467bd",
        "Eastern Mediterranean": "#8c564b"
    };
    return regionColors[region] || "#ccc";
}
