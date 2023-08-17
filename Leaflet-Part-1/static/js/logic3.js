console.log("Start of map using logic2");

//logic2 gets USGS Data, creates circle marker, time and magnitude pop up

let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Create a baseMaps object.
let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
};

// create an empty (new) leaflet layerGroup for earthquakes
let earthquakes = new L.layerGroup();


// Create an overlay object to hold our overlay.
let overlayMaps = {
    Earthquakes: earthquakes
};

// Create our map, giving it the streetmap and earthquakes layers to display on load.
let myMap = L.map("map", {
    center: [
        37.09, -95.71
    ],
    zoom: 3.5,
    layers: [street, earthquakes]
    });

// Create a layer control.
// Pass it our baseMaps and overlayMaps.
// Add the layer control to the map.
L.control.layers(baseMaps, overlayMaps, {
collapsed: false
}).addTo(myMap);

//get earthquake data
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson"
// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  console.log(data.features[0]);

  //create a GeoJSON layer using data
  var geojsonMarkerOptions = {
    radius: 8,
    fillColor: "#ff7800",
    color: "#000",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  };

  L.geoJSON(data, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, geojsonMarkerOptions);
    },

    //use onEachFeature to add popup
    onEachFeature: function onEachFeature(feature, layer) {
        layer.bindPopup(`
        <h3>${feature.properties.place}</h3>
        <hr>
        <p>${new Date(feature.properties.time)}</p>
        <h3>Magnitude: ${feature.properties.mag.toLocaleString()}</h3>
        <h3>Depth: ${feature.geometry.coordinates[2].toLocaleString()}</h3>
        `);

    }
  }).addTo(earthquakes)





  //data only available above this line
});