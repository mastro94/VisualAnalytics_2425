let combinedData = [];


//To retrieve all datasets from the Flask API
Promise.all([
    fetch("https://mastro94visualanalytics.pythonanywhere.com/api/data/scatterPlot?file=aggregated_smokers_2008.csv")
      .then(response => response.json()),
    fetch("https://mastro94visualanalytics.pythonanywhere.com/api/data/scatterPlot?file=aggregated_smokers_2013.csv")
      .then(response => response.json()),
    fetch("https://mastro94visualanalytics.pythonanywhere.com/api/data/scatterPlot?file=aggregated_smokers_2019.csv")
      .then(response => response.json()),
    fetch("https://mastro94visualanalytics.pythonanywhere.com/api/data/scatterPlot?file=Aggregated_Data_2008.csv")
      .then(response => response.json()),
    fetch("https://mastro94visualanalytics.pythonanywhere.com/api/data/scatterPlot?file=Aggregated_Data_2013.csv")
      .then(response => response.json()),
    fetch("https://mastro94visualanalytics.pythonanywhere.com/api/data/scatterPlot?file=Aggregated_Data_2020-2022.csv")
      .then(response => response.json())
  ]).then(([smokers2008, smokers2013, smokers2019, ms2008, ms2013, ms2020]) => {
    console.log("Data loaded successfully from Flask API");
  
    // Preprocessing and combining smokers data
    const smokersData = [
      { year: 2008, data: smokers2008 },
      { year: 2013, data: smokers2013 },
      { year: 2019, data: smokers2019 }
    ];
  
    smokersData.forEach(dataset => {
      dataset.data.forEach(d => {
        d["Region"] = d["Regions"] || "";
        d["Number of Smokers"] = +d["val"] || 0;
      });
    });
  
  
    // Preprocessing and combining MS data
    const msData = [
      { year: 2008, data: ms2008 },
      { year: 2013, data: ms2013 },
      { year: "2020-2022", data: ms2020 } 
    ];
  
    msData.forEach(dataset => {
      dataset.data.forEach(d => {
        d["Region"] = d["Macro Region"] || "";
        d["Number of Prevalent Cases"] = +d["Number of people with MS"] || 0;
        d["Prevalence of MS per 100,000"] = +d["Prevalence of MS per 100,000"] || 0;
      });
    });
  
  
    // Combining data for both smokers and MS by region and year
    combinedData = smokersData.map(smokersDataset => {
      const year = smokersDataset.year;
  
      
      const msDataset = year === 2019
        ? msData.find(d => d.year === "2020-2022")
        : msData.find(d => d.year === year);
  
      if (!msDataset) {
        console.warn(`No MS dataset found for year: ${year}`);
        return {
          year,
          data: smokersDataset.data.map(d => ({
            Region: d.Region,
            Year: year,
            Smokers: d["Number of Smokers"],
            MS_Cases: 0,
            MS_Prevalence: 0
          }))
        };
      }
  
      const combinedYearData = smokersDataset.data
        .filter(smoker => smoker.Region !== "Unmapped")     // Excluding "Unmapped" regions
        .map(smoker => {
          const msEntry = msDataset.data.find(ms => ms.Region === smoker.Region) || {};
          return {
            Region: smoker.Region,
            Year: year,
            Smokers: smoker["Number of Smokers"],
            MS_Cases: msEntry["Number of Prevalent Cases"] || 0,
            MS_Prevalence: msEntry["Prevalence of MS per 100,000"] || 0
          };
        });
  
  
      return { year, data: combinedYearData };
    });
  
  
    const years = [2008, 2013, "2020-2022"];
    const dropdown = d3.select("#scatterplot-year")
      .on("change", function () {
        const selectedYear = this.value === "2020-2022" ? 2019 : +this.value;
        renderScatterPlotByYear(selectedYear);
      });
  
    dropdown.selectAll("option")
      .data(years)
      .enter()
      .append("option")
      .text(d => d)
      .attr("value", d => d);
  
  
    renderScatterPlotByYear(2008);
  }).catch(error => {
    console.error("Error loading data from Flask API:", error);
  });
  

// For rendering scatter plot retrieved data
function renderScatterPlot(data) {

    const container = d3.select("#scatterplot-container");
    if (container.empty()) {
        console.error("#scatterplot-container is missing.");
        return;
    }

    
    const containerNode = container.node();
    const containerWidth = containerNode.getBoundingClientRect().width;
    const containerHeight = containerNode.getBoundingClientRect().height;

    if (containerWidth === 0 || containerHeight === 0) {
        console.warn(
            "Container dimensions are zero. Ensure #scatterplot-container is properly styled and visible."
        );
        return;
    }

    
    container.html("");

    
    const margin = { top: 50, right: 50, bottom: 100, left: 220 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    
    const svg = container.append("svg")
        .attr("width", containerWidth)
        .attr("height", containerHeight);

    const chartArea = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.Smokers)])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.MS_Cases)])
        .range([height, 0]);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);



    // Add x-axis and y-axis
    chartArea.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(xScale)
        .ticks(8) 
        .tickFormat(d3.format(".2s")) 
    )
    .selectAll(".tick text")
    .style("font-size", "28px") 
    .style("font-family", "Arial, sans-serif")
    .style("fill", "black")
    .attr("transform", "rotate(-20)") 
    .style("text-anchor", "end"); 


    chartArea.append("g")
    .call(d3.axisLeft(yScale)
        .ticks(8) 
        .tickFormat(d3.format(",d"))
    ) 
    .selectAll(".tick text")
    .style("font-size", "28px") 
    .style("font-family", "Arial, sans-serif")
    .style("fill", "black");


    // Add x-axis label
    chartArea.append("text")
        .attr("x", width / 2)
        .attr("y", height + 100) 
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .attr("font-size", "35px") 
        .attr("font-weight", "bold")
        .text("Number of Smokers");

    // Add y-axis label
    chartArea.append("text")
        .attr("x", -height / 2)
        .attr("y", -150) 
        .attr("transform", "rotate(-90)")
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .attr("font-size", "35px") 
        .attr("font-weight", "bold")
        .text("Number of MS Cases");

    


   
    chartArea.selectAll(".tick text")
        .attr("font-size", "14px") 
        .attr("font-family", "Arial, sans-serif"); 

    // Tooltip style
    const tooltip = d3.select("body").append("div")
        .attr("class", "scatter-tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background", "rgba(0, 0, 0, 0.8)")
        .style("color", "white")
        .style("padding", "10px") 
        .style("border-radius", "6px")
        .style("font-size", "40px") 
        .style("font-family", "Arial, sans-serif");


    // Extracting unique regions for the legend
const uniqueRegions = Array.from(new Set(data.map(d => d.Region)));

// Moving legend closer to the chart
const legendXOffset = width - 280; 
const legendYOffset = 50; 


const legend = svg.append("g")
    .attr("transform", `translate(${legendXOffset}, ${legendYOffset})`);


const legendBox = legend.append("rect")
    .attr("x", -30) 
    .attr("y", -30)
    .attr("width", 350) 
    .attr("height", uniqueRegions.length * 50 + 40) 
    .attr("fill", "white")
    .attr("stroke", "black")
    .attr("stroke-width", 3)
    .attr("rx", 15) 
    .attr("ry", 15);


const legendItems = legend.selectAll(".legend-item")
    .data(uniqueRegions)
    .enter()
    .append("g")
    .attr("class", "legend-item")
    .attr("transform", (d, i) => `translate(15, ${i * 50})`);

legendItems.append("circle")
    .attr("cx", 0)
    .attr("cy", 5)
    .attr("r", 16) 
    .attr("fill", d => colorScale(d))
    .attr("stroke", "black") 
    .attr("stroke-width", 2);

legendItems.append("text")
    .attr("x", 35) 
    .attr("y", 10)
    .attr("fill", "black")
    .style("font-size", "22px") 
    .style("font-weight", "normal") 
    .style("font-family", "Arial, sans-serif") 
    .text(d => d);




    // Draw dot points
    chartArea.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(d.Smokers))
        .attr("cy", d => yScale(d.MS_Cases))
        .attr("r", d => {
            const ratio = d.MS_Cases / (d.Smokers || 1); 
            const minRatio = d3.min(data, d => d.MS_Cases / (d.Smokers || 1)); 
            const maxRatio = d3.max(data, d => d.MS_Cases / (d.Smokers || 1)); 

            
            const minSize = 15; 
            const maxSize = 50;
            const normalizedRatio = (ratio - minRatio) / (maxRatio - minRatio); 

            return minSize + normalizedRatio * (maxSize - minSize); 
        })
        .attr("fill", d => colorScale(d.Region))
        .on("mouseover", (event, d) => {
            
            const formatNumber = value => (value ? Math.ceil(value) : "N/A");

            const ratio = d.MS_Cases / (d.Smokers || 1); 
            
            
            tooltip.style("visibility", "visible")
                .html(`
                    <strong>Region:</strong> ${d.Region}<br>
                    <strong>Smokers:</strong> ${formatNumber(d.Smokers)}<br>
                    <strong>MS Cases:</strong> ${formatNumber(d.MS_Cases)}<br>
                    <strong>Ratio:</strong> ${ratio.toFixed(4)}
                `);
        })
        .on("mousemove", event => {
            tooltip.style("top", `${event.pageY - 20}px`)
                .style("left", `${event.pageX + 10}px`);
        })
        .on("mouseout", () => tooltip.style("visibility", "hidden"));

    console.log("Scatter plot rendered successfully");
}


function renderScatterPlotByYear(selectedYear) {


    
    const normalizedYear = selectedYear === "2020-2022" ? 2019 : +selectedYear;

    
    const yearData = combinedData.find(d => d.year === normalizedYear);

    if (!yearData) {
        console.error(`No data found for year: ${selectedYear}`);
        return;
    }


    
    renderScatterPlot(yearData.data);
}


// Exposing function globally
window.renderScatterPlotByYear = renderScatterPlotByYear;


