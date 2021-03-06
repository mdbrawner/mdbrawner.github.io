

var hideLabel = function(label){ label.labelObject.style.opacity = 0;};
var showLabel = function(label){ label.labelObject.style.opacity = 1;};
var labelEngine = new labelgun.default(hideLabel, showLabel);
var labels = [];

// 18. define the coordinate reference system (CRS)
mycrs = new L.Proj.CRS('EPSG:2991',
    '+proj=lcc +lat_1=42.33333333333334 +lat_2=48.66666666666666 +lat_0=41 +lon_0=-117 +x_0=914401.8287999999 +y_0=0 +ellps=clrk66 +datum=NAD27 +to_meter=0.3048006096012192 +no_defs',
    {
        resolutions: [131056, 65528,32768, 16384, 8192, 4096, 2048, 1024, 512, 256, 128] // example zoom level resolutions
    }
);

  // 1. Create a map object.
var mymap = L.map('map', {
    crs: mycrs,
    center: [48, -96],
    zoom: 2,
    maxZoom: 8,
    minZoom: 1,
    detectRetina: true // detect whether the sceen is high resolution or not.
});

// 2. Add a base map.
// L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png').addTo(mymap);

// 3. Add cell towers GeoJSON Data
// Null variable that will hold cell tower data
var airports = null;
var grades = ["Y", "N"];
  // 4. build up a set of colors from colorbrewer's dark2 category
  var colors = ['#41ab5d', '#006d2c'];

  // // 5. dynamically append style classes to this page. This style classes will be used for colorize the markers.
  for (i = 0; i <= 1; i++) {
      $('head').append($("<style> .marker-color-" + i.toString()  + " { color: " + colors[i] + "; font-size: 15px; text-shadow: 0 0 3px #ffffff;} </style>"));
  }

//  get the color based on the class which the input value falls in.
  function getColor(d) {
      for (var i = 0; i <= 1 ; i++) {
          if ( d == grades[i]) return colors[i];
        }
//if (d == grades[1]) return colors[1];
  }

// function style(feature) {
//     return {
//         weight: 2,
//         opacity: 1,
//         color: 'blue',
//         fillOpacity: 0.7,
//         // fillColor: getColor(feature.properties.CNTL_TWR)
//     };
// }

var airports = null;

  // Get GeoJSON and put on it on the map when it loads
  airports= L.geoJson.ajax("assets/airports.geojson", {
    onEachFeature: function (feature, layer) {
      layer.bindPopup('Airport Name: '+feature.properties.AIRPT_NAME +'<br> City: '+feature.properties.CITY);
    },
    pointToLayer: function (feature, latlng) {
      var id = 0;
      if (feature.properties.CNTL_TWR == "Y") {id = 0; }
      else {id = 1; }
      return L.marker(latlng, {icon: L.divIcon({className: 'fa fa-plane marker-color-' +  id.toString() })});
    },
    attribution: 'Airport Data &copy; Data.Gov | US States &copy; Mike Bostock of D3 | Base Map &copy; CartoDB | Made By mdbrawner'
}).addTo(mymap);


// 6. Set function for color ramp
colors = chroma.scale('Blues').colors(5); //colors = chroma.scale('OrRd').colors(5);

function setColor(density) {
    var id = 0;
    if (density > 25) { id = 4; }
    else if (density > 20 && density <= 25) { id = 3; }
    else if (density > 15 && density <= 20) { id = 2; }
    else if (density > 10 &&  density <= 15) { id = 1; }
    else  { id = 0; }
    return colors[id];
}

// 7. Set style function that sets fill color.md property equal to cell tower density
function style(feature) {
    return {
        fillColor: setColor(feature.properties.count),
        fillOpacity: 0.4,
        weight: 2,
        opacity: 1,
        color: '#b4b4b4',
        dashArray: '4'
    };
}

var states = null;
states = L.geoJson.ajax("assets/us-states.geojson", {
  style: style,
  onEachFeature: function (feature, label) {
          label.bindTooltip(feature.properties.name, {className: 'feature-label', permanent:true, direction: 'center'});
          labels.push(label);
  }
}).addTo(mymap);


var legend = L.control({position: 'topright'});

  // 10. Function that runs when legend is added to map
  legend.onAdd = function () {

      // Create Div Element and Populate it with HTML
      var div = L.DomUtil.create('div', 'legend');
      div.innerHTML += '<b># Airports </b><br />';
      div.innerHTML += '<i style="background: ' + colors[4] + '; opacity: 0.5"></i><p>>25</p>';
      div.innerHTML += '<i style="background: ' + colors[3] + '; opacity: 0.5"></i><p>20-25</p>';
      div.innerHTML += '<i style="background: ' + colors[2] + '; opacity: 0.5"></i><p>16-20</p>';
      div.innerHTML += '<i style="background: ' + colors[1] + '; opacity: 0.5"></i><p> 11-15</p>';
      div.innerHTML += '<i style="background: ' + colors[0] + '; opacity: 0.5"></i><p> <11</p>';
      div.innerHTML += '<hr><b>Control Tower Present<b><br />';
      div.innerHTML += '<i class="fa fa-plane marker-color-0"></i><p> Yes</p>';
      div.innerHTML += '<i class="fa fa-plane marker-color-1"></i><p> No</p>';
      // Return the Legend div containing the HTML content
      return div;
  };

  // 11. Add a legend to map
  legend.addTo(mymap);

  // 12. Add a scale bar to map
// L.control.scale({position: 'bottomleft'}).addTo(mymap);


// 13. Add a latlng graticules.
    L.latlngGraticule({
      showLabel: true,
      opacity: 0.7,
      color: "#EDBB99",
      font: "10px Palatino",
      zoomInterval: [
        {start: 1, end: 2, interval: 10},
          {start: 3, end: 4, interval: 5},
          {start: 5, end: 10, interval: 0.5}
      ],
      lngLineCurved: 1,
      latLineCurved: 1,
    }).addTo(mymap);


    function addLabel(layer, id) {
    // This is ugly but there is no getContainer method on the tooltip :(
    var label = layer.getTooltip()._source._tooltip._container;
    if (label) {
        // We need the bounding rectangle of the label itself
        var rect = label.getBoundingClientRect();

        // We convert the container coordinates (screen space) to Lat/lng
        var bottomLeft = mymap.containerPointToLatLng([rect.left, rect.bottom]);
        var topRight = mymap.containerPointToLatLng([rect.right, rect.top]);
        var boundingBox = {
            bottomLeft : [bottomLeft.lng, bottomLeft.lat],
            topRight   : [topRight.lng, topRight.lat]
        };

        // Ingest the label into labelgun itself
        labelEngine.ingestLabel(
            boundingBox,
            id,
            parseInt(Math.random() * (5 - 1) + 1), // Weight
            label,
            label.innerText,
            false
        );

        // If the label hasn't been added to the map already
        // add it and set the added flag to true
        if (!layer.added) {
            layer.addTo(mymap);
            layer.added = true;
        }
    }

}

// 17. We will update the visualization of the labels whenever you zoom the map.
mymap.on("zoomend", function(){
    var i = 0;
    states.eachLayer(function(label){
        addLabel(label, ++i);
    });
    labelEngine.update();
});
