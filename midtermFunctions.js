/* ================================
Week 7 Assignment: Midterm Functions + Signatures
================================ */
// Set the basemap
var map;
var Stamen_TonerLite;

// Get and parse data we want to use and visualize
var dataset = "https://raw.githubusercontent.com/MUSA611-CPLN692-spring2019/datasets/master/geojson/housingprice_Beijing.geojson";

// Function to load map
var loadMap = () => {
  map = L.map('map', {
    center: [39.919727, 116.413522],
    zoom: 11
  });
  Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    minZoom: 0,
    maxZoom: 20,
    ext: 'png'
  }).addTo(map);
};

// Ajax call to get data set
var getDataSet = () => {
  return $.ajax(dataset);
};

// Styles
var styles = [
  {
    radius: 8,
    color: "#fff",
    fillColor:"#e42b7d",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  },
  {
    radius: 8,
    color: "#11054c",
    fillColor:"#e42b7d",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  },
  {
    radius: 8,
    fillColor: "#ffdf2d",
    color: "#11054c",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  },
  {
    radius: 8,
    fillColor: "#9dd3fa",
    color: "#1f6fb5",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  },
  {
    radius: 8,
    color: "#1f6fb5",
    fillColor:"#9dd3fa",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  },
  {
    radius: 8,
    color: "#11054c",
    fillColor:"#ffe5dd",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  },
  {
    radius: 8,
    color: "#11054c",
    fillColor:"#ff5983",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  },
  {
    radius: 8,
    color: "#11054c",
    fillColor:"#720a22",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  },
  {
    radius: 8,
    color: "#11054c",
    fillColor:"#463a3e",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.8
  }
];

// Map filter functions to slide indexes
var filterSlideMapping = ["allPoints", "totalPriceLevel", "areAndBedrooms", "inSchoolDistrict", "unitPriceLevel"];

// add popup when clicked
function onEachFeature(feature, layer) {
    // does this feature have a property named popupContent?
    if (feature.properties && feature.properties.name) {
        layer.bindPopup( 'Name: ' + feature.properties.name + '<br>'+ 'Total Price: ' + feature.properties.totalprice + '<br>' + 'Area: ' +feature.properties.area + '<br>' + 'Bedrooms: ' + feature.properties.bedrooms + '<br>' + 'Price per Sq m: ' + feature.properties.priceperm2 + '<br>'  +'Year Built: ' + feature.properties.yearbuilt);
    }
}

// All points in dataset
var allPoints = (data) => {
  return L.geoJson(data, {
      onEachFeature:onEachFeature,
      pointToLayer: (feature, latlng) => {
        if (feature.properties.bedrooms !=" " && feature.properties.area !=" " && feature.properties.area !=" " && feature.properties.priceperm2 !=" " && feature.properties.totalprice !=" " && feature.properties.schooldistrict !=" "&& feature.properties.yearbuilt !=" "&& feature.properties.floor !=" "&& feature.properties.name !=" ") {
          return L.circleMarker(latlng, styles[0]);
        } else {
          return L.circleMarker(latlng, styles[1]);
        }
      }
    });
};

// Total price level of housing units built later than 2000
var totalPriceLevel = (data) => {
  return L.geoJson(data, {
      onEachFeature:onEachFeature,
      pointToLayer: (feature, latlng) => {
        if (feature.properties.totalprice > 800) {
          return L.circleMarker(latlng, styles[1]);
        } else if (feature.properties.totalprice >= 500 && feature.properties.totalprice <= 800) {
          return L.circleMarker(latlng, styles[3]);
        } else {
          return L.circleMarker(latlng, styles[2]);
        }
      },
      filter: (feature, layer) => {
        return feature.properties.yearbuilt >= 2000;
      }
    });
};

// Area and number of bedrooms
var areAndBedrooms = (data) => {
  return L.geoJson(data, {
      onEachFeature:onEachFeature,
      pointToLayer: (feature, latlng) => {
        if (feature.properties.area < 80) {
          return L.circleMarker(latlng, styles[1]);
        } else if (feature.properties.area >=80 && feature.properties.bedrooms != 1) {
          return L.circleMarker(latlng, styles[2]);
        } else {
          return L.circleMarker(latlng, styles[4]);
        }
      },
      filter: (feature, layer) => {
        return feature.properties.yearbuilt >= 2000 && feature.properties.totalprice < 800;
      }
    });
};

// In school district or not
var inSchoolDistrict = (data) => {
  return L.geoJson(data, {
      onEachFeature:onEachFeature,
      pointToLayer: (feature, latlng) => {
        if (feature.properties.schooldistrict == 0) {
          return L.circleMarker(latlng, styles[1]);
        } else {
          return L.circleMarker(latlng, styles[2]);
        }
      },
      filter: (feature, layer) => {
        return feature.properties.yearbuilt >= 2000 && feature.properties.totalprice < 800 && feature.properties.area >=80;
      }
    });
};

// Unit price level
var unitPriceLevel = (data) => {
  return L.geoJson(data, {
     onEachFeature:onEachFeature,
      pointToLayer: (feature, latlng) => {
        if (feature.properties.priceperm2 < 25000) {
          return L.circleMarker(latlng, styles[5]);
        }  else if (feature.properties.priceperm2 < 50000 && feature.properties.priceperm2 >= 25000) {
          return L.circleMarker(latlng, styles[6]);
        } else if (feature.properties.priceperm2 < 75000 && feature.properties.priceperm2 >= 50000) {
          return L.circleMarker(latlng, styles[7]);
        } else {
          return L.circleMarker(latlng, styles[8]);
        }
      },
      filter: (feature, layer) => {
        return feature.properties.yearbuilt >= 2000 && feature.properties.totalprice < 800 && feature.properties.area >=80 && feature.properties.schooldistrict == 1
      }
    });
};

// add Legend
function getColor(feature, currentSlide) {
  switch (currentSlide){
    case 0:
      return {color: "#e42b7d", label: "Valid Housing Data"};
    case 1:
      if (feature.properties.totalprice > 800) {
        return {color: "#e42b7d", label: "Total Price over 800m"};
      } else if (feature.properties.totalprice>=500 && feature.properties.totalprice <= 800) {
        return {color: "#b0dbfa", label: "Total Price Range: 500m-800m"};
      } else {
        return {color: "#fde355", label: "Total Price Range below 500m"};
      }
    case 2:
      if (feature.properties.area < 80 ) {
        return {color: "#e85496", label: "Area below 80 Sq m"}
      } else if (feature.properties.area >=80 && feature.properties.bedrooms != 1) {
        return {color: "#fee456", label: "Area over 80 Sq m with 1+ Bedrooms" }
      } else {
        return {color: "#a1d5fa", label: "Area over 80 Sq m with 1 Bedroom"}
      }
    case 3:
      if (feature.properties.schooldistrict == 0) {
        return {color: "#e85496", label: "Not in School District"}
      } else {
        return {color: "#fce254", label: "in Schhol District"}
      }
    case 4:
      if (feature.properties.priceperm2 < 25000) {
        return {color: "#fee9e3", label: "Price per Sq m below 25k"}
      } else if (feature.properties.priceperm2 < 50000 && feature.properties.priceperm2 >= 25000) {
        return {color: "#fe799b", label: "Price per Sq m range: 25k-50k"}
      } else if (feature.properties.priceperm2 < 75000 && feature.properties.priceperm2 >= 50000) {
        return {color: "#8d3a4d", label: "Price per Sq m range: 50k-75k"}
      }
  }

}

var legendMap = [
  [
    {color: "#e42b7d", label: "Valid Housing Data"}
  ],
  [
    {color: "#e42b7d", label: "Total Price over 800m"},
    {color: "#b0dbfa", label: "Total Price Range: 500m-800m"},
    {color: "#fde355", label: "Total Price Range below 500m"},
  ],
  [
    {color: "#e85496", label: "Area below 80 Sq m"},
    {color: "#fee456", label: "Area over 80 Sq m with 1+ Bedrooms"},
    {color: "#a1d5fa", label: "Area over 80 Sq m with 1 Bedroom"}
  ],
  [
    {color: "#e85496", label: "Not in School District"},
    {color: "#fce254", label: "in Schhol District"}
  ],
  [
    {color: "#fee9e3", label: "Price per Sq m below 25k"},
    {color: "#fe799b", label: "Price per Sq m range: 25k-50k"},
    {color: "#8d3a4d", label: "Price per Sq m range: 50k-75k"}
  ]
];

    function style(feature) {
        return {
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8,
            radius: 8,
            fillColor: getColor(feature.properties.TypeOfIssue),
            color: "#4d306c"

        };
    }


var buildLegend = (currentSlide, map) => {
  var legend = L.control({position: 'bottomleft'});
  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
    labels = ['<strong>Categories</strong>'],
    categories = ['Road Surface','Signage','Line Markings','Roadside Hazards','Other'];

    currentSlideLegend = legendMap[currentSlide];

    for (var i = 0; i < currentSlideLegend.length; i++) {
      div.innerHTML +=
      labels.push(
          '<i class="circle" style="background:' + currentSlideLegend[i].color + '"></i> ' +
      (currentSlideLegend[i] ? currentSlideLegend[i].label : '+'));
    }
    return div;
  }
  legend.addTo(map);
};
