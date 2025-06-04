function loadAndAggregateData(year, region = "all") {
  const fileName = year === "2013"
        ? "aggregated_by_region_with_all.csv"
        : "(final_version)merged_2020-2022_with_region_country_code_converted.csv";

    const apiUrl = `https://mastro94visualanalytics.pythonanywhere.com/api/data/stackedBar?file=${fileName}`;
    console.log(`Caricamento dati da: ${apiUrl} per regione: ${region}`);

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            data.forEach(d => {
                d.Country = year === "2013"
                    ? (d.Region ? d.Region.trim() : "")
                    : (d.Country ? d.Country.trim() : "");

                d['RRMS'] = year === "2013"
                    ? +d['% Relapsing Remitting MS (includes those who may now have Secondary Progressive MS)'] || 0
                    : +d['Current Percent Relapsing Remitting_Overall'] || 0;

                d['PPMS'] = year === "2013"
                    ? +d['% Primary Progressive MS'] || 0
                    : +d['Current percent Primary Progressive_Overall'] || 0;

                d['SPMS'] = year === "2013"
                    ? +d['% Progressive Relapsing MS'] || 0
                    : +d['Current Percent Secondary Progressive_Overall'] || 0;

                d['UCS'] = year === "2013"
                    ? 0
                    : +d['Current Percent Unknown Disease Course_Overall'] || 0;
            });

            const validRegions = ["African", "Americas", "Eastern Mediterranean", "European", "South-East Asia", "Western Pacific"];
            const filtered = data.filter(d => validRegions.includes(d.Country));

            window.stackedBarData = filtered;

            updateChart(filtered, region, year);
        })
        .catch(error => {
            console.error("Errore nel caricamento dati stacked bar:", error);
        });
}




// Load data via Flask API and initialize chart
document.addEventListener("DOMContentLoaded", () => {
  const yearSelect = document.getElementById("year-select");
  const regionSelect = document.getElementById("region-select");

  yearSelect.addEventListener("change", function () {
    const selectedYear = this.value;
    const selectedRegion = document.getElementById("region-select").value;

    updateStackedBar(selectedYear); 
  }); 


  regionSelect.addEventListener("change", function () {
    updateChart(window.stackedBarData, this.value, yearSelect.value);
  });

  // Initial load and aggregation
  loadAndAggregateData(yearSelect.value);
});






function updateChart(data, region, year) {
  const chartTitle = `${region === "all" ? "All Regions" : region} — ${year}`;

  const filteredData = region === "all" ? data : data.filter(d => d.Country === region);
  if (filteredData.length === 0) {
      console.error("No data found for the selected region:", region);
      return;
  }


  let aggregatedData = [
    { Category: "RRMS", Value: d3.mean(filteredData, d => d['RRMS']) },
    { Category: "PPMS", Value: d3.mean(filteredData, d => d['PPMS']) },
    { Category: "SPMS", Value: d3.mean(filteredData, d => d['SPMS']) }
  ];
  
  if (year !== "2013") {
    aggregatedData.push({ Category: "UCS", Value: d3.mean(filteredData, d => d['UCS']) });
  }
  

  d3.select("#stacked-bar-chart").selectAll("*").remove();
  renderStackedBarChart(aggregatedData, chartTitle);
}



// Render the stacked bar chart
function renderStackedBarChart(data, titleText) {
    
    const container = document.getElementById("stacked-bar-chart");
    
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
  
    
    const safeContainerHeight = containerHeight > 0 ? containerHeight : 400;
  
    
    const margin = { top: 70, right: 30, bottom: 70, left: 150 };
  
    
    const width = containerWidth - margin.left - margin.right;
    const height = safeContainerHeight - margin.top - margin.bottom;
  
    
    const svg = d3.select("#stacked-bar-chart")
      .append("svg")
      .attr("viewBox", `0 0 ${containerWidth} ${safeContainerHeight}`)
      .attr("preserveAspectRatio", "xMidYMid meet")
      .style("width", "100%")
      .style("height", "100%")
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);
  
    
    svg.append("text")
      .attr("text-anchor", "middle") 
      .attr("dominant-baseline", "hanging") 
      .style("font-size", "25px")
      .style("font-weight", "bold")
      .text(titleText)
      .attr("transform", `translate(${(width / 2) - 20}, ${-margin.top / 1.5})`);

  
    
    const gradients = [
      { id: "gradient1", colors: ["#6baed6", "#3182bd"] },
      { id: "gradient2", colors: ["#fd8d3c", "#e6550d"] },
      { id: "gradient3", colors: ["#74c476", "#31a354"] },
      { id: "gradient4", colors: ["#d95f02", "#993404"] }
    ];
  
    const defs = svg.append("defs");
  
    gradients.forEach(gradient => {
      const linearGradient = defs.append("linearGradient")
        .attr("id", gradient.id)
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");
  
      linearGradient.selectAll("stop")
        .data([
          { offset: "0%", color: gradient.colors[0] },
          { offset: "100%", color: gradient.colors[1] }
        ])
        .join("stop")
        .attr("offset", d => d.offset)
        .attr("stop-color", d => d.color);
    });
  
    
    const colorMap = {
      "RRMS": "gradient1",
      "PPMS": "gradient2",
      "SPMS": "gradient3",
      "UCS": "gradient4"
    };
  
    
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.Category))
      .range([0, width])
      .padding(0.4);
  
    
    const minValue = d3.min(data, d => d.Value);
    const maxValue = d3.max(data, d => d.Value);
    const yDomain = [0, 100];
  
    const yScale = d3.scaleLinear()
      .domain(yDomain)
      .range([height, 0]);
  
    
    const yZero = yScale(0);
  
    
    const tooltip = d3.select("#tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "rgba(0,0,0,0.85)")
      .style("color", "white")
      .style("padding", "10px 20px") 
      .style("border-radius", "6px") 
      .style("font-size", "40px") 
      .style("font-weight", "bold")
      .style("max-width", "300px")
      .style("text-align", "left")
      .style("line-height", "1.2") 
      .style("white-space", "nowrap") 
      .style("z-index", "1000");

  
    
    svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.Category))
      .attr("y", d => d.Value >= 0 ? yScale(d.Value) : yZero)
      .attr("width", xScale.bandwidth())
      .attr("height", d => {
        const computedHeight = d.Value >= 0
          ? yZero - yScale(d.Value)
          : yScale(d.Value) - yZero;
        return Math.max(0, computedHeight);
      })
      .attr("fill", d => `url(#${colorMap[d.Category]})`)
      .on("mouseover", (event, d) => {
        tooltip.style("visibility", "visible")
          .text(`${d.Value.toFixed(1)}%`);
      })
      .on("mousemove", event => {
        tooltip.style("top", `${event.pageY - 30}px`)
          .style("left", `${event.pageX + 15}px`);
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      });

    // X-Axis
    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("dx", "1.4em") 
      .style("text-anchor", "end") 
      .style("font-size", "30px")
      .style("font-family", "Arial, sans-serif")
      .style("fill", "black");
    
    
  
    // X-Axis Label
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + 60)
      .attr("text-anchor", "middle")
      .style("font-size", "35px")
      .style("font-weight", "bold")
      .text("MS Disease Types");
  
    // Y-Axis
    svg.append("g")
      .call(d3.axisLeft(yScale).ticks(10).tickFormat(d => `${d}%`))
      .selectAll("text")
      .style("font-size", "22px")
      .style("font-family", "Arial, sans-serif")
      .style("fill", "black");
  
    // Y-Axis Label
    svg.append("text")
      .attr("x", -height / 2)
      .attr("y", -margin.left + 75)
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .style("font-size", "30px")
      .style("font-weight", "bold")
      .text("Percentage (%)");
  }
  

