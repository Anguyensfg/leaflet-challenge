// Store our API endpoint as queryUrl.
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  function getColour(depth) {
    return depth < 10 ? "#4e5180" :
            depth < 10 ? "#00cccc" : 
            depth < 30 ? "#3fff00" :
            depth < 50 ? "#eaa221" :
            depth < 70 ? "#fff000" :
            "#fd3f92"
  }

  function createCircleMarker(feature, latlng) {
    var markerOptions = {
        radius: (6 * feature.properties.mag),
        fillColor: getColour(feature.geometry.coordinates[2]),
        color: "#ed1c24",
        weight: 1.5,
        opacity: 1.5,
        fillOpacity: 0.5
    };
    return L.circleMarker(latlng, markerOptions);
  }

  // Define a function and create a popup with description
  function onEachFeature(feature, layer) {
    layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
  }

  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  let earthquakes = L.geoJSON(earthquakeData, {
    pointToLayer: createCircleMarker,
    onEachFeature: onEachFeature
  });

  // add info to map
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
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

  // Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Display earthquarke layers on map
  let myMap = L.map("map", {
    center: [
     40.93, -113.71
    ],
    zoom: 3,
    layers: [street, earthquakes]
  });

  // Create a layer control through baseMaps and overlaymaps
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


  // Create a legend to reference colour 
  var legend = L.control({ position: "bottomright" });

    legend.onAdd = function(map) {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML += '<i style="background: #4e5180"></i><span>-10-10</span><br>';
    div.innerHTML += '<i style="background: #00cccc"></i><span>10-30</span><br>';
    div.innerHTML += '<i style="background: #3fff00"></i><span>30-50</span><br>';
    div.innerHTML += '<i style="background: #eaa221"></i><span>50-70</span><br>';
    div.innerHTML += '<i style="background: #fff000"></i><span>70-90</span><br>';    
    div.innerHTML += '<i style="background: #fd3f92"></i><span>90+</span><br>';    

    return div;
    };

    legend.addTo(myMap);

  }
