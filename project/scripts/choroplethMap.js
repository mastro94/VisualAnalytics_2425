//Function for normalizing string 
function normalizeString(str) {
    if (!str) return "";
    let cleaned = str.trim(); 
    cleaned = cleaned.replace(/\u00A0/g, " "); 
    cleaned = cleaned.replace(/\s+/g, " "); 
    cleaned = cleaned.toLowerCase(); 
    cleaned = cleaned.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); 
    return cleaned;
}


// Dynamically resize the map
function resizeMap() {
    
    const parentWidth = d3.select(".map-section").node().clientWidth;
    const parentHeight = d3.select(".map-section").node().clientHeight;

    
    mapSvg.attr("width", parentWidth).attr("height", parentHeight);

    
    mapProjection
        .translate([parentWidth / 2, parentHeight / 2]) 
        .scale(Math.min(parentWidth / 5, parentHeight / 2)); 

    
    mapSvg.selectAll("path").attr("d", mapPath);
}


// countryMapping
const countryMapping = {
    "Afghanistan": ["afghanistan"],
    "Albania": ["albania"],
    "Algeria": ["algeria"],
    "American Samoa": ["american samoa"],
    "Andorra": ["andorra"],
    "Angola": ["angola"],
    "Antigua and Barb.": ["antigua and barbuda"],
    "Argentina": ["argentina"],
    "Armenia": ["armenia"],
    "Aruba": ["aruba"],
    "Australia": ["australia"],
    "Austria": ["austria"],
    "Azerbaijan": ["azerbaijan"],

    "Bahamas": [
        "bahamas",
        "bahamas, the"
    ],
    "Bahrain": ["bahrain"],
    "Bangladesh": ["bangladesh"],
    "Barbados": ["barbados"],
    "Belarus": ["belarus"],
    "Belgium": ["belgium"],
    "Belize": ["belize"],
    "Benin": ["benin"],
    "Bhutan": ["bhutan"],
    "Bolivia": ["bolivia"],

    "Bosnia and Herz.": [
        "bosnia and herzegovina",
        "bosnia and herz."
    ],

    "Botswana": ["botswana"],
    "Brazil": ["brazil"],
    "Brunei": ["brunei darussalam"],
    "Bulgaria": ["bulgaria"],
    "Burkina Faso": ["burkina faso"],
    "Burundi": ["burundi"],

    "Cabo Verde": [
        "cabo verde",
        "cape verde"
    ],
    "Cambodia": ["cambodia"],
    "Cameroon": ["cameroon"],
    "Canada": ["canada"],

    // Central African Rep.: array with synonyms
    "Central African Rep.": [
        "central african rep.",
        "central african republic"
    ],

    "Chad": ["chad"],
    "Chile": ["chile"],
    "China": ["china"],
    "Colombia": ["colombia"],
    "Comoros": ["comoros"],

    "Congo": [
        "congo",
        "congo, republic of the",
        "congo, republic of",
        "republic of congo"
    ],

    "Costa Rica": ["costa rica"],
    "Croatia": ["croatia"],
    "Cuba": ["cuba"],
    "Curaçao": ["curacao"],
    "Cyprus": ["cyprus"],

    // Czechia: array
    "Czechia": [
        "czech republic",
        "czechia"
    ],

    // Côte d'Ivoire: array
    "Côte d'Ivoire": [
        "cote d'ivoire",
        "côte d'ivoire",
        "cote d'lvoire"
    ],

    // Dem. Rep. Congo: array
    "Dem. Rep. Congo": [
        "dem. rep. congo",
        "democratic republic of the congo",
        "democratic republic of congo",
        "congo, democratic republic of"
    ],

    "Denmark": ["denmark"],
    "Djibouti": ["djibouti"],
    "Dominica": ["dominica"],
    "Dominican Rep.": ["dominican republic"],
    "Ecuador": ["ecuador"],
    "Egypt": ["egypt"],
    "El Salvador": ["el salvador"],
    "Eq. Guinea": ["equatorial guinea"],
    "Eritrea": ["eritrea"],
    "Estonia": ["estonia"],
    "Ethiopia": ["ethiopia"],

    "Fiji": ["fiji"],
    "Finland": ["finland"],
    "Fr. Polynesia": ["french polynesia"],
    "France": ["france"],

    "Gabon": ["gabon"],
    "Gambia": [
        "gambia",
        "gambia,the"
    ],
    "Georgia": ["georgia"],
    "Germany": ["germany"],
    "Ghana": ["ghana"],
    "Greece": ["greece"],
    "Grenada": ["grenada"],
    "Guam": ["guam"],
    "Guatemala": ["guatemala"],
    "Guinea": ["guinea"],
    "Guinea-Bissau": ["guinea-bissau"],
    "Guyana": ["guyana"],
    "Haiti": ["haiti"],
    "Honduras": ["honduras"],
    "Hong Kong": ["hong kong"],
    "Hungary": ["hungary"],
    "Iceland": ["iceland"],
    "India": ["india"],
    "Indonesia": ["indonesia"],

    "Iran": [
        "iran",
        "iran islamic republic of",
        "iran, islamic republic of"
    ],
    "Iraq": ["iraq"],
    "Ireland": ["ireland"],
    "Israel": ["israel"],
    "Italy": ["italy"],
    "Jamaica": ["jamaica"],
    "Japan": ["japan"],
    "Jordan": ["jordan"],
    "Kazakhstan": ["kazakhstan"],
    "Kenya": ["kenya"],
    "Kiribati": ["kiribati"],

    "Kosovo": [
        "kosovo",
        "republic of kosovo"
    ],

    "Kuwait": ["kuwait"],
    "Kyrgyzstan": ["kyrgyzstan"],

    // Laos
    "Laos": [
        "lao people's democratic republic",
        "laos",
        "lao, people's democratic republic of"
    ],

    "Latvia": ["latvia"],
    "Lebanon": ["lebanon"],
    "Lesotho": ["lesotho"],
    "Liberia": ["liberia"],
    "Libya": ["libya"],
    "Liechtenstein": ["liechtenstein"],
    "Lithuania": ["lithuania"],
    "Luxembourg": ["luxembourg"],
    "Macao": ["macao sar"],

    "Macedonia": [
        "macedonia",
        "north macedonia"
    ],

    "Madagascar": ["madagascar"],
    "Malawi": ["malawi"],
    "Malaysia": ["malaysia"],
    "Maldives": ["maldives"],
    "Mali": ["mali"],
    "Malta": ["malta"],
    "Marshall Is.": ["marshall islands"],
    "Mauritania": ["mauritania"],
    "Mauritius": ["mauritius"],
    "Mexico": ["mexico"],
    "Micronesia": ["micronesia federated states of"],
    "Moldova": [
        "moldova",
        "moldova republic of",
        "moldova, republic of"
    ],
    "Monaco": ["monaco"],
    "Mongolia": ["mongolia"],
    "Montenegro": ["montenegro"],
    "Morocco": ["morocco"],
    "Mozambique": ["mozambique"],
    "Myanmar": ["myanmar"],
    "Namibia": ["namibia"],
    "Nauru": ["nauru"],
    "Nepal": ["nepal"],
    "Netherlands": ["netherlands"],
    "New Caledonia": ["new caledonia"],
    "New Zealand": ["new zealand"],
    "Nicaragua": ["nicaragua"],
    "Niger": ["niger"],
    "Nigeria": ["nigeria"],
    "Niue": ["niue"],

    // North Korea: array
    "North Korea": [
        "democratic people's republic of korea",
        "north korea",
        "korea, democratic people's republic of"
    ],

    "Norway": ["norway"],
    "Oman": ["oman"],
    "Pakistan": ["pakistan"],
    "Palau": ["palau"],
    "Palestine": ["palestinian authority"],
    "Panama": ["panama"],
    "Papua New Guinea": ["papua new guinea"],
    "Paraguay": ["paraguay"],
    "Peru": ["peru"],
    "Philippines": ["philippines"],
    "Poland": ["poland"],
    "Portugal": ["portugal"],
    "Puerto Rico": ["puerto rico"],
    "Qatar": ["qatar"],
    "Romania": ["romania"],

    "Russia": [
        "russia",
        "russian federation"
    ],

    "Rwanda": ["rwanda"],

    // S. Sudan: array
    "S. Sudan": [
        "s. sudan",
        "south sudan"
    ],

    "Saint Lucia": ["saint lucia"],
    "Samoa": ["samoa"],
    "San Marino": ["san marino"],
    "Saudi Arabia": ["saudi arabia"],
    "Senegal": ["senegal"],
    "Serbia": ["serbia"],
    "Seychelles": ["seychelles"],
    "Sierra Leone": ["sierra leone"],
    "Singapore": ["singapore"],
    "Sint Maarten": ["sint maarten dutch part"],
    "Slovakia": ["slovakia"],
    "Slovenia": ["slovenia"],
    "Solomon Is.": ["solomon islands"],
    "Somalia": ["somalia"],

    // South Africa
    "South Africa": ["south africa"],

    // South Korea: array
    "South Korea": [
        "republic of korea",
        "korea republic of",
        "south korea",
        "korea republic of"
    ],

    "Spain": ["spain"],
    "Sri Lanka": ["sri lanka"],

    "St. Kitts and Nevis": ["saint kitts and nevis"],
    "St. Vin. and Gren.": ["saint vincent and the grenadines"],
    "Sudan": ["sudan"],
    "Suriname": ["suriname"],

    // Swaziland => Eswatini
    "Swaziland": ["eswatini"],

    "Sweden": ["sweden"],
    "Switzerland": ["switzerland"],

    // Syria: array
    "Syria": [
        "syrian arab republic",
        "syria"
    ],

    "São Tomé and Principe": ["sao tome and principe"],
    "Taiwan": ["taiwan"],
    "Tajikistan": ["tajikistan"],

    // Tanzania: array
    "Tanzania": [
        "tanzania united republic of",
        "tanzania",
        "united republic of tanzania",
        "tanzania united republic of"
    ],

    "Thailand": ["thailand"],
    "Timor-Leste": ["timor-leste"],
    "Togo": ["togo"],
    "Tonga": ["tonga"],
    "Trinidad and Tobago": ["trinidad and tobago"],
    "Tunisia": ["tunisia"],
    "Turkey": ["turkey"],
    "Turkmenistan": ["turkmenistan"],
    "Turks and Caicos Is.": ["turks and caicos islands"],
    "U.S. Virgin Is.": ["virgin islands"],
    "Uganda": ["uganda"],
    "Ukraine": ["ukraine"],
    "United Arab Emirates": ["united arab emirates"],
    "United Kingdom": ["united kingdom"],

    "United States of America": [
        "united states",
        "united states of america"
    ],

    "Uruguay": ["uruguay"],
    "Uzbekistan": ["uzbekistan"],
    "Vanuatu": ["vanuatu"],
    "Venezuela": ["venezuela"],
    "Vietnam": ["vietnam"],
    "W. Sahara": ["western sahara"],
    "Yemen": ["yemen"],
    "Zambia": ["zambia"],
    "Zimbabwe": ["zimbabwe"],

    // eSwatini => Eswatini
    "eSwatini": ["eswatini"]
};

// Normalize the countryMapping
Object.keys(countryMapping).forEach(key => {
    const val = countryMapping[key];
    countryMapping[key] = Array.isArray(val) ? val.map(normalizeString) : [normalizeString(val)];
});

// SVG and Tooltip
const mapWidth = 960;
const mapHeight = 500;

const mapSvg = d3.select("#world-map")
    .attr("width", mapWidth)
    .attr("height", mapHeight);

const mapProjection = d3.geoNaturalEarth1()
    .scale(170)
    .translate([mapWidth / 2, mapHeight / 2]);

const mapPath = d3.geoPath().projection(mapProjection);

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



//  Color Scales for the Heat Map 
const colorScales = {
    prevalence: d3.scaleSequential(d3.interpolateBlues).unknown("white"),
    incidence: d3.scaleSequential(d3.interpolateReds).unknown("white") // Updated to red
};

//  Handling Missing Data 
const defs = mapSvg.append("defs");

const pattern = defs.append("pattern")
    .attr("id", "black-white-stripes")
    .attr("width", 4)
    .attr("height", 4)
    .attr("patternUnits", "userSpaceOnUse")
    .attr("patternTransform", "rotate(45)");

pattern.append("rect")
    .attr("width", 4)
    .attr("height", 4)
    .attr("fill", "white");

pattern.append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", 4)
    .attr("stroke", "black")
    .attr("stroke-width", 1);




// get request from pythonanywhere.com
let missingCountries = []; // Array used to collect unmatched countries

function loadMapData(year, measure) {
    // API URL to fetch data 
    const apiUrl = `https://mastro94visualanalytics.pythonanywhere.com/api/data/choroplethMap?file=${year}.csv`;

    // Columns for prevalence and incidence
    let prevalenceColumn, incidenceColumn;
    if (year === "2008") {
        prevalenceColumn = "Prevalence of MS, 2008";
        incidenceColumn = "Incidence of MS, 2008";
    } else if (year === "2013") {
        prevalenceColumn = "Prevalence of MS";
        incidenceColumn = "Incidence of MS";
    } else if (year === "2020-2022") {
        prevalenceColumn = "Prevalence of MS per 100,000";
        incidenceColumn = "Incidence of MS per 100,000";
    } else {
        prevalenceColumn = "Prevalence of MS"; 
        incidenceColumn = "Incidence of MS"; 
    }

    // missing data values for each year
    const missingValues = {
        "2008": ["NO DATA PROVIDED", "NOT KNOWN"],
        "2013": ["NOT KNOWN", ""],
        "2020-2022": ["", "Not Available"]
    };

    const selectedMeasureColumn = measure === "prevalence" ? prevalenceColumn : incidenceColumn;
    const invalidValues = missingValues[year] || [""]; 

    // retrieval of data from API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error("API Error:", data.error);
                return;
            }

            // Normalize dataset country names
            data.forEach(row => {
                if (row["Country"]) {
                    row["Country"] = normalizeString(row["Country"]);
                }
            });

            // Update color based on data range.
            const values = data
                .map(row => {
                    let val = +row[selectedMeasureColumn];
                    if (measure === "incidence" && !isNaN(val)) {
                        return Number(val.toFixed(2));
                    }
                    return val;
                })
                .filter(value => !isNaN(value) && !invalidValues.includes(value));


            if (values.length > 0) {
                const min = d3.min(values);
                const max = d3.max(values);

                if (measure === "prevalence") {
                    colorScales.prevalence.domain([min, max]);
                } else {
                    colorScales.incidence.domain([min, max]);
                }
            }

            // Fetch world map data and update the visualization
            d3.json("https://unpkg.com/world-atlas@2.0.2/countries-50m.json").then(worldData => {
                const countries = topojson
                    .feature(worldData, worldData.objects.countries)
                    .features;

                missingCountries = []; 

                mapSvg.selectAll("path")
                    .data(countries)
                    .join("path")
                    .attr("d", mapPath)
                    .attr("fill", d => {
                        const mapCountryName = normalizeString(d.properties.name);

                        const matchedKey = Object.keys(countryMapping).find(leftName => {
                            const synonyms = countryMapping[leftName];
                            return synonyms.includes(mapCountryName);
                        });

                        // Drawing unmatched countries with striped pattern
                        if (!matchedKey) {
                            missingCountries.push(mapCountryName);
                            return "url(#black-white-stripes)";
                        }

                        const synonyms = countryMapping[matchedKey];
                        const foundDataRow = data.find(row => synonyms.includes(row["Country"]));

                        if (!foundDataRow) {
                            missingCountries.push(matchedKey);
                            return "url(#black-white-stripes)"; 
                        }

                        const value = foundDataRow[selectedMeasureColumn];

                        const numericValue = measure === "incidence" ? Number((+value).toFixed(2)) : +value;


                        if (invalidValues.includes(value) || !value || isNaN(numericValue)) {
                            return "url(#black-white-stripes)";
                        }

                        
                        return measure === "prevalence"
                            ? colorScales.prevalence(numericValue)
                            : colorScales.incidence(numericValue);
                    })
                    .attr("stroke", "#003366")
                    .attr("stroke-width", 0.5)
                    .on("mouseover", function (event, d) {
                        const mapCountryName = normalizeString(d.properties.name);
                        const matchedKey = Object.keys(countryMapping).find(leftName => {
                            const synonyms = countryMapping[leftName];
                            return synonyms.includes(mapCountryName);
                        });

                        const synonyms = matchedKey ? countryMapping[matchedKey] : [];
                        const foundDataRow = data.find(row => synonyms.includes(row["Country"]));

                        d3.select(this).attr("stroke-width", 1.5);


                        const displayValue = foundDataRow && foundDataRow[selectedMeasureColumn] && !invalidValues.includes(foundDataRow[selectedMeasureColumn])
                            ? (measure === "incidence"
                                ? Number((+foundDataRow[selectedMeasureColumn]).toFixed(2))
                                : foundDataRow[selectedMeasureColumn])
                            : null;

                        tooltip.style("visibility", "visible")
                            .html(displayValue
                                ? `<strong>${capitalizeFirstLetter(foundDataRow.Country)}</strong><br>${capitalizeFirstLetter(measure)}: ${displayValue}`
                                : `<strong>${capitalizeFirstLetter(d.properties.name)}</strong><br>No Data`
                            );
                    })
                    .on("mousemove", event => {
                        tooltip
                            .style("top", `${event.pageY - 20}px`)
                            .style("left", `${event.pageX + 10}px`);
                    })
                    .on("mouseout", function () {
                        d3.select(this).attr("stroke-width", 0.5);
                        tooltip.style("visibility", "hidden");
                    });



                updateLegend(measure);
            });
        })
        .catch(error => console.error("Error loading data from API:", error));
}




function updateLegend(measure) {

    d3.select("#legend-container").remove();


    const scale = measure === "prevalence" ? colorScales.prevalence : colorScales.incidence;
    const [minValue, maxValue] = scale.domain(); // Get and save min and max values


    const legendContainer = d3.select("body")
        .append("div")
        .attr("id", "legend-container")
        .style("position", "absolute")
        .style("top", "1000px")
        .style("left", `30px`)
        .style("background", "#fff")
        .style("padding", "25px")
        .style("border-radius", "8px")
        .style("box-shadow", "0 0 8px rgba(0,0,0,0.3)");

    const legendWidth = 450; 

    const legendSvg = legendContainer.append("svg")
        .attr("width", legendWidth + 20) 
        .attr("height", 90);


    const legendGradient = legendSvg.append("defs")
        .append("linearGradient")
        .attr("id", "legend-gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");

    const stops = d3.range(0, 1.1, 0.1);
    stops.forEach((t) => {
        legendGradient.append("stop")
            .attr("offset", `${t * 100}%`)
            .attr("stop-color", scale(minValue + t * (maxValue - minValue)));
    });


    legendSvg.append("rect")
        .attr("width", legendWidth)
        .attr("height", 30)
        .style("fill", "url(#legend-gradient)");

    const numTicks = 6;
    const tickValues = d3.range(minValue, maxValue, (maxValue - minValue) / (numTicks - 1));
    if (!tickValues.includes(minValue)) tickValues.unshift(minValue); 
    if (!tickValues.includes(maxValue)) tickValues.push(maxValue); 
    const legendScale = d3.scaleLinear()
        .domain([minValue, maxValue])
        .range([0, legendWidth]); 

    const legendAxis = d3.axisBottom(legendScale)
        .tickValues(tickValues) 
        .tickSize(10)
        .tickSizeOuter(0) 
        .tickFormat(d3.format("d")); 


    const axisGroup = legendSvg.append("g")
        .attr("transform", "translate(0,30)")
        .call(legendAxis);


    axisGroup.selectAll("text")
        .style("font-size", "24px")
        .style("font-weight", "bold")
        .attr("text-anchor", (d) => 
            d === minValue ? "start" : d === maxValue ? "end" : "middle") 
        .attr("dx", (d) => d === minValue ? "-1px" : d === maxValue ? "10px" : "0px") 
        .attr("dy", "20px"); 

    // Legend title
    legendContainer.append("p")
        .style("text-align", "center")
        .style("margin", "12px 0 0 0")
        .style("font-size", "20px")
        .style("font-weight", "bold")
        .text(`${capitalizeFirstLetter(measure)} (per 100,000)`);
}


function capitalizeFirstLetter(str) {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
}





const yearDropdown = d3.select("#year-selector")
    .on("change", function () {
        const selectedYear = this.value;
        const selectedMeasure = d3.select("#measure-selector").node().value;
        loadMapData(selectedYear, selectedMeasure);
    });

yearDropdown.selectAll("option")
    .data(["2008", "2013", "2020-2022"])
    .enter()
    .append("option")
    .text(d => d)
    .attr("value", d => d);

const measureDropdown = d3.select("#measure-selector")
    .on("change", function () {
        const selectedMeasure = this.value;
        const selectedYear = d3.select("#year-selector").node().value;
        loadMapData(selectedYear, selectedMeasure);
    });

measureDropdown.selectAll("option")
    .data(["prevalence", "incidence"])
    .enter()
    .append("option")
    .text(d => capitalizeFirstLetter(d))
    .attr("value", d => d);



window.addEventListener("resize", resizeMap);


resizeMap();


loadMapData("2008", "prevalence");
