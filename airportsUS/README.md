# US Airports

> Spring 2009 | Project for Geography 572 | Geovisual Analytics
> Oregon State Univesity, Corvallis OR
>
> **Design by:** [Michael Brawner](https://github.com/mdbrawner)


## Introduction
The primary goal of this project was to design a chloropleth map of the number of airports in the US by state.  In addition, further information such as whether the airport has a control tower or not and the name of the airport have also been included in the visualization

A version of the map can be found here: https://mdbrawner.github.io/airportsUS/

## Project Deliverables
- Chloropleth map of US showing # of airports by states
- Appropriate icon depicting location of airports and whether they have control tower or not
- Appropriate map projection
- Graticules
- State name labels
- Clickable markers
- Legend

## Map functions

To incorporate the above deliverables, we applied several functions to the map that allow us to visualize the informaiton contained.  First we found airplane icons on [Font Awesome](https://fontawesome.com/?from=io) to apply to the map for each airport location that were color coded by presence/absence of control tower and were fuctionalized into clickable markers to display the airport name and city when clicked.  Secondly, we dynamically set a color scheme for the cloropleth to display a color scale based on the number of airports per state categorized following the legend. For the legend we created a Leaflet control object and populated it with html and styled with css.  We also included state name labels with a bit of complicated code using the [LabelGun](https://github.com/Geovation/labelgun) library.  This allows us to actively update label styling while zooming in and out.  Finally we reporjected our map from web mercator to a lambert conformal conic projection allowing us to visualize all 50 states and Puerto Rico on the screen at once.  We also added graticules that dynamically change in width as the zoom is applied.


## Libraries
leaflet.css, leaflet.js, leaflet.ajax, jquery, chroma.js, Font awesome, Google fonts, LabelGun, Proj4, Proj4leaflet

## Data sources
Airport data: This data is converted from a shapefile, which was downloaded and unzipped from https://catalog.data.gov/dataset/usgs-small-scale-dataset-airports-of-the-united-states-201207-shapefile.

State data: This data is acquired from [Mike Bostock](https://github.com/mbostock) of D3.

## Acknowledgements
Thanks to [Bo Zhao](https://github.com/jakobzhao) and [Courtney Van Stolk](https://github.com/vanstolc) for previous code that this project was built off of.
