/* ================================
Week 7 Assignment: Slide Model
================================ */

/** Here's the simplest implementation I could come up with for
 * representing a deck of slides (nothing exotic is necessary!)
 */
var slides = [
  {
    slidenumber:1,
    title: "Find Your New Home",
    text: " This series of maps are designed to help a newly-married couple to choose a housing unit to purchase as their new home. On different pages we focus on different criteria and help the couple make their decision step by step.<br>On the first page, let’s first take a look at the general conditions of the dataset. <br>This map shows how many data we have and where they are in Beijing. <br>As we can see, the housing price data are scattered throughout the city.<br>Since we want to see all the data points, there is no filter on this page.<br>I tried to distinguish housing units lacking key properties from the others using different styles in case there is missing data.<br>Fortunately, according to the visualization results, every housing unit in our dataset has all the properties, suggesting that our dataset is complete.",
    color: "white"
  },
  {
    slidenumber:2,
    title: "Total Price Level of <br> &nbsp; &nbsp;&nbsp;&nbsp; Housing Units Built <br> &nbsp; &nbsp;&nbsp;&nbsp; After 2000",
    text: "On this page, we look at the total price level of housing units. <br>Assume that the new couple want new units built later than 2000. <br>Their budget is 8 million RMB and a total price lower than 5 million is preferred. <br>I used a filter here to only show those newly-built units. <br>Three styles with different colors were applied to show high, medium low total price levels. <br>As we can see on the map, the red circles suggest units the couple don’t need to consider and visit. <br>The blue circles indicate units at medium price level, which are acceptable. <br>The yellow ones perfectly meet the couple’s criteria.",
    color: "white"
  },
  {
    slidenumber:3,
    title: "Area and Bedroom <br> &nbsp; &nbsp;&nbsp;&nbsp;Amount",
    text: "On this page, we help the couple further in terms of the area and number of bedrooms.<br>Assume that they want a unit no smaller than 80 m² and they prefer those with more than one bedrooms. <br>Here I used a filter to only show those units selected as suitable on the previous page. <br>The red circles indicate housing units too small. <br>The yellow ones are units larger than 80 m²  with more than one bedrooms, which are the most suitable for the couple. <br>The blue circle is a unit large enough but with only one bedroom. Since it is not preferred, this one is showed separately for the couple to consider. ",
    color: "white"
  },
  {
    slidenumber:4,
    title: "In School District or <br> &nbsp; &nbsp;&nbsp;&nbsp; Not",
    text: "On this page, we will visualize whether a housing unit is in school district or not. <br><br>As on the previous pages, I utilized a filter to keep units we considered as suitable according to previous criteria. <br><br>The yellow circles are units in school district and the red ones are not. ",
    color: "white"
  },
  {
    slidenumber:5,
    title: "Unit Price Level",
    text: "On this page, we focus on the unit price level of housing units.<br><br>I also used a filter to keep all the suitable units selected in the previous steps.<br><br>A set of gradual colors were applied to show increasing unit price levels. The deeper the color, the higher the price.<br><br>In addition, since the points cluster in the north part of the city, I chose to zoom in this area for the usesr' convenience. <br><br> As the map shows, the light pink circles are the first choices for the couple to consider and visit.",
    color: "white"
  }
];

var currentSlide = 0;
  $('#previous').hide();

var addTitle = (title) => {
  $('.sidebar').append(`<h1 id='title' ><i class="fas fa-home icon-3x" style="color:#fff;"></i>&nbsp;${title}</h1>`)
};

var addText = (text) => {
  $('.sidebar').append(`<p id='text' >${text}</p>`)
};



var setColor = (color) => {
  $('#map').css('background-color', color)
};

var cleanup = () => {
  $('#title').remove();
  $('#text').remove();
};

var buildSlide = (slideObject) => {
  cleanup();
  addTitle(slideObject.title);
  addText(slideObject.text);
  setColor(slideObject.color);
};

buildSlide(slides[currentSlide]);


function checkNavigation() {
  $('#previous').show();
  $('#next').show();
  if (currentSlide == 0) {
    $('#previous').hide();
  }  else if (currentSlide == slides.length - 1) {
    $('#next').hide();
  }
}

$("#next").click(() => {
  // Reset currentSlide index to 0 if it is greater than slides size
  if (currentSlide == slides.length - 1) {
    currentSlide = 0
  } else {
    currentSlide = currentSlide + 1;
  }
  checkNavigation();
  buildSlide(slides[currentSlide]);
});

$("#previous").click(() => {
  // Reset currentSlide index to 0 if it is greater than slides size
  if (currentSlide == 0) {
    currentSlide = 4
  } else {
    currentSlide = currentSlide - 1;
  };
  checkNavigation();
  buildSlide(slides[currentSlide]);
});




$(document).ready(function() {
  // Populate the map
  loadMap();
  var legend = L.control({position: 'bottomright'});
  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    labels = ['<strong>Categories</strong>'],
    categories = ['Road Surface','Signage','Line Markings','Roadside Hazards','Other'];
    currentSlideLegend = legendMap[0];

    for (var i = 0; i < currentSlideLegend.length; i++) {
      div.innerHTML += '<p><i class="fa fa-circle" aria-hidden="true" style="color:' + currentSlideLegend[i].color + '"></i>&nbsp;' + currentSlideLegend[i].label + '</p>';
    }
    return div;
  }
  legend.addTo(map);

  // Get data set from Ajax promises of midtermFunctions.js
  getDataSet().then(function(data) {
    // Format data
    var parsedData = JSON.parse(data);
    // Populate the default points
    allPoints(parsedData).addTo(map);

    $("#next").click(() => {
      // Clear the map once user clicks the next button
      map.eachLayer(function (layer) {
        map.remove();
        map.removeLayer(layer)
        // Reload the map
        loadMap();
      });
      // Call corresponding functions by filterSlideMapping
      window[filterSlideMapping[currentSlide]](parsedData).addTo(map);

      if (currentSlide ==4){
        map.setView([40.060611, 116.383500],13)
      }

      var legend = L.control({position: 'bottomright'});
      legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        labels = ['<strong>Categories</strong>'],
        categories = ['Road Surface','Signage','Line Markings','Roadside Hazards','Other'];
        currentSlideLegend = legendMap[currentSlide];

        for (var i = 0; i < currentSlideLegend.length; i++) {
          div.innerHTML += '<p><i class="fa fa-circle" aria-hidden="true" style="color:' + currentSlideLegend[i].color + '"></i>&nbsp;' + currentSlideLegend[i].label + '</p>';
        }
        return div;
      }
      legend.addTo(map);
    });


    $("#previous").click(() => {
      // Clear the map once user clicks the next button
      map.eachLayer(function (layer) {
        map.remove();
        map.removeLayer(layer)
        // Reload the map
        loadMap();
      });
      // Call corresponding functions by filterSlideMapping
      window[filterSlideMapping[currentSlide]](parsedData).addTo(map);

      var legend = L.control({position: 'bottomright'});
      legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        labels = ['<strong>Categories</strong>'],
        categories = ['Road Surface','Signage','Line Markings','Roadside Hazards','Other'];
        currentSlideLegend = legendMap[currentSlide];

        for (var i = 0; i < currentSlideLegend.length; i++) {
          div.innerHTML += '<p><i class="fa fa-circle" aria-hidden="true" style="color:' + currentSlideLegend[i].color + '"></i>&nbsp;' + currentSlideLegend[i].label + '</p>';
        }
        console.log(div);
        return div;
      }
      legend.addTo(map);
    });

  }).fail(function() {
    window.alert('Failed to get dataset. Please try to reload the page.');
  });


});
