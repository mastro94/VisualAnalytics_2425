# Multiple Sclerosis: A Visual Perspective on Epidemiological Data

Project for Visual Analytics course taught by Prof. Giuseppe Santucci at La Sapienza University of Rome for the academic year 2024-2025.

## Developed by
Francesco Mastrostefano

## Overview
Multiple Sclerosis (MS) is a chronic, autoimmune neurological disease and one of the leading causes of non-traumatic disability in young adults. In the last 10 years, MS incidence has been rising globally, increasing the interest of researchers, more specifically epidemiologists. With this project, my goal is to turn complex and heterogeneous MS epidemiological data into an intuitive and interactive Visual Analytics web application.

The application unifies MS data (prevalence, incidence, disease types, age of onset) with lifestyle indicators like smoking, using a coordinated set of views that enable users (e.g.from public health researchers to patients) to explore data, identify patterns, and generate hypotheses.

## Description
The core data sources are:
- **Atlas of MS**: A global dataset collecting country-level MS data in 2008, 2013, and 2020-2022 years, including prevalence, incidence, MS subtypes, and diagnostic infos.
- **GBD 2019 Smokers Dataset**: Containing global data on smoking numerics by country.

I selected and cleaned key indicators from :
- Total number of people with MS
- Prevalence and incidence (absolute and per 100,000)
- Mean age of onset
- Distribution of MS types (RRMS, SPMS, PPMS, Unknown)

Data derived and obtained from these mentioned selection were normalized, merged, and transformed into three restructured CSVs, each one for the year of analysis. Smoking data were aligned and merged with MS data.

![Web App Screenshot](docs/screenshot.png)

## Visualizations
The application presents multiple coordinated views, each one with possibility selection of year and analysis variable of interest by the user:

- **Choropleth Heatmap**: Visualizes prevalence or incidence for each country by using color intensity scale, projecting these infos over a global map, reflecting the numerical variation related to the chosen metric.
- **Bubble Chart**: Analyzes smokers vs. MS cases for each WHO region (African,Americas,European,Western Pacific,South-East Asia,Eastern Mediterranean macro regions), with bubble size representing the MS-to-smoker ratio.
- **Stacked Bar Chart**: Chart related to proportions of MS subtypes with respect to WHO macro-regions.
- **Parallel Coordinates Chart**: Represents temporal evolution of metrics  by WHO region across time periods.
- **PCA Clustering Plot**: Visualizes three clustering options: (i) 2-variable MS-only clustering, (ii) 4-variable clustering with prevalence/incidence/onset/cases, and (iii) MS + Smoking combined clustering.

These visualizations offer exploration of:
- Regional patterns and temporal trends
- Lifestyle risk correlations (e.g., smoking)
- Disease heterogeneity
- Discover of hidden clustering patterns between countries

## Analytics and Backend
The backend is deployed on **PythonAnywhere** using a simple, lightweight and efficient **Flask** server that exposes RESTful endpoints. The API supports:
- Data retrieval of all required informations in JSON format
- Preprocessing and caching using SHA-256 hashes
- Computations of PCA and KMeans clustering

QUI

## Use Cases
The platform supports several use cases:
- Possibility of identifying regions with growing MS trends
- Analysts can explore lifestyle influences (e.g. smoking) 
- Strategists decisions about therapy deployment
- Researchers investigating temporal and demographic changes

## How to use
To use the web application: simply users can interact and explore the features offered by this project by navigating to the <DA INSERIRE URL>.



## Future Works
- Integrating additional comorbidities (obesity, vitamin D deficiency, inactivity)
- Analyze recent studies in which the correlation between Epstein-Barr virus and the onset of multiple sclerosis emerges
- Organizing user study sessions with neurologists and analysts to improve usability

## Project Links
- [Project Proposal](docs/VisualAnalytics_Proposal.pdf)
- [Final Report](docs/v2_officialReport.pdf)
- [Live Application](https://mastro94visualanalytics.pythonanywhere.com/)



---

*Developed by Francesco Mastrostefano, 2024-2025*
