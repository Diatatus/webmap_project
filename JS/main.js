var serverPort = "localhost:8080";
var geoserverWorkspace = "beesig_w";
var regions = "region";
var departements = "departement";
var communes = "commune";
var Localites_centre = "localite";
var identifyLayers = [];
var projectionName = "EPSG:4326";
var layerList = [];

var geojson;
var queryGeoJSON;

var highlightStyle = new ol.style.Style({
  fill: new ol.style.Fill({
    color: "rgba(64,244,208,0.4)",
  }),
  stroke: new ol.style.Stroke({
    color: "#40E0D0",
    width: 3,
  }),
  image: new ol.style.Circle({
    radius: 10,
    fill: new ol.style.Fill({
      color: "#40E0D0",
    }),
  }),
});
var featureOverlay = new ol.layer.Vector({
  source: new ol.source.Vector(),
  map: map,
  style: highlightStyle,
});

var querySelectedFeatureStyle = new ol.style.Style({
  fill: new ol.style.Fill({
    color: "rgba(64,244,208,0.4)",
  }),
  stroke: new ol.style.Stroke({
    color: "#40E0D0",
    width: 3,
  }),
  image: new ol.style.Circle({
    radius: 10,
    fill: new ol.style.Fill({
      color: "#40E0D0",
    }),
  }),
});
var querySelectedFeatureOverlay = new ol.layer.Vector({
  source: new ol.source.Vector(),
  map: map,
  style: querySelectedFeatureStyle,
});

var clickSelectedFeatureStyle = new ol.style.Style({
  fill: new ol.style.Fill({
    color: "rgba(255,255,0,0.4)",
  }),
  stroke: new ol.style.Stroke({
    color: "#FFFF00",
    width: 3,
  }),
  image: new ol.style.Circle({
    radius: 10,
    fill: new ol.style.Fill({
      color: "#FFFF00",
    }),
  }),
});
var clickSelectedFeatureOverlay = new ol.layer.Vector({
  source: new ol.source.Vector(),
  map: map,
  style: clickSelectedFeatureStyle,
});
var interactionStyle = new ol.style.Style({
  fill: new ol.style.Fill({
    color: "rgba(200, 200, 200, 0.6)",
  }),
  stroke: new ol.style.Stroke({
    color: "rgba(0, 0, 0, 0.5)",
    lineDash: [10, 10],
    width: 2,
  }),
  image: new ol.style.Circle({
    radius: 5,
    stroke: new ol.style.Stroke({
      color: "rgba(0, 0, 0, 0.7)",
    }),
    fill: new ol.style.Fill({
      color: "rgba(255, 255, 255, 0.2)",
    }),
  }),
});

// The Map
var mapView = new ol.View({
  center: ol.proj.fromLonLat([12.744686, 6.434886]),
  zoom: 6,
});

var map = new ol.Map({
  target: "map",
  view: mapView,
});

//Bing map Tile

var bingMapsAerial = new ol.layer.Tile({
  title: "Aerial",
  visible: true,
  type: "base",
  preload: Infinity,
  source: new ol.source.BingMaps({
    key: "AuOKP0N2ww907dY398Ci9ZKg38AqF2jc7q1QchUixWw30TpwdCt4T36ip-OyE49R",
    imagerySet: "Aerial",
  }),
});

var bingMapsAerialWithLabelsOnDemand = new ol.layer.Tile({
  title: "Aerial with labels",
  visible: false,
  type: "base",
  preload: Infinity,
  source: new ol.source.BingMaps({
    key: "AuOKP0N2ww907dY398Ci9ZKg38AqF2jc7q1QchUixWw30TpwdCt4T36ip-OyE49R",
    imagerySet: "AerialWithLabelsOnDemand",
  }),
});

var bingMapsRoadOnDemand = new ol.layer.Tile({
  title: "Road",
  visible: false,
  type: "base",
  preload: Infinity,
  source: new ol.source.BingMaps({
    key: "AuOKP0N2ww907dY398Ci9ZKg38AqF2jc7q1QchUixWw30TpwdCt4T36ip-OyE49R",
    imagerySet: "RoadOnDemand",
  }),
});

var bingMapsCanvasDark = new ol.layer.Tile({
  title: "Toile sombre",
  visible: false,
  type: "base",
  preload: Infinity,
  source: new ol.source.BingMaps({
    key: "AuOKP0N2ww907dY398Ci9ZKg38AqF2jc7q1QchUixWw30TpwdCt4T36ip-OyE49R",
    imagerySet: "CanvasDark",
  }),
});

var noneTile = new ol.layer.Tile({
  title: "None",
  type: "base",
  visible: false,
});

var baseGroup = new ol.layer.Group({
  title: "Base Maps",
  fold: true,
  layers: [
    noneTile,
    bingMapsCanvasDark,
    bingMapsRoadOnDemand,
    bingMapsAerialWithLabelsOnDemand,
    bingMapsAerial,
  ],
});

// WMS layer
var Cameroun_Regions = new ol.layer.Image({
  title: "Regions",
  source: new ol.source.ImageWMS({
    url: "http://localhost:8080/geoserver/beesig_w/wfs",
    params: { LAYERS: "beesig_w:region", TILED: true, INFO_FORMAT: "application/json" },
    serverType: "geoserver",
    visible: false,
    format: new ol.format.GeoJSON(),
  }),
 
});

var Cameroun_Departements = new ol.layer.Image({
  title: "Departements",
  source: new ol.source.ImageWMS({
    url: "http://localhost:8080/geoserver/beesig_w/wms",
    params: { LAYERS: "beesig_w:departement", TILED: true, INFO_FORMAT: "application/json" },
    serverType: "geoserver",
    visible: false,
    format: new ol.format.GeoJSON(),
  }),
  
});

var Cameroun_Communes = new ol.layer.Image({
  title: "Communes",
  source: new ol.source.ImageWMS({
    url: "http://localhost:8080/geoserver/beesig_w/wms",
    params: { LAYERS: "beesig_w:commune", TILED: true, INFO_FORMAT: "application/json" },
    serverType: "geoserver",
    visible: false,
    format: new ol.format.GeoJSON(),
  }),
});

var localite = new ol.layer.Image({
  title: "Localités",
  source: new ol.source.ImageWMS({
    url: "http://localhost:8080/geoserver/beesig_w/wms",
    params: { LAYERS: "beesig_w:Localite_centre", TILED: true, INFO_FORMAT: "application/json" },
    serverType: "geoserver",
    visible: false,
    format: new ol.format.GeoJSON(),
  }),
});

var Densite_pop = new ol.layer.Image({
  title: "Densité de Population",
  source: new ol.source.ImageWMS({
    url: "http://localhost:8080/geoserver/beesig_w/wms",
    params: { LAYERS: "beesig_w:ZonalSt_comm1", TILED: true },
    serverType: "geoserver",
    visible: false,
  }),
});

var overlayGroup = new ol.layer.Group({
  title: "Limites Administratives",
  fold: true,
  layers: [
    Cameroun_Regions,
    Cameroun_Departements,
    Cameroun_Communes,
    localite,
  ],
});



var overlayGroup2 = new ol.layer.Group({
  title: "Démographie",
  fold: true,
  layers: [
    Densite_pop,  
  ],
});




map.addLayer(baseGroup);
map.addLayer(overlayGroup2);
map.addLayer(overlayGroup);


// map.addLayer(lbLayer);

for (y = 0; y < map.getLayers().getLength(); y++) {
  var lyr1 = map.getLayers().item(y);
  if (lyr1.get("title") == "Base Maps") {
  } else {
    if (lyr1.getLayers().getLength() > 0) {
      for (z = 0; z < lyr1.getLayers().getLength(); z++) {
        var lyr2 = lyr1.getLayers().item(z);
        layerList.push(lyr2.getSource().getParams().LAYERS);
      }
    } else {
      layerList.push(lyr1.getSource().getParams().LAYERS);
    }
  }
}





// ProgressBar
var progress = new ol.control.ProgressBar({
  //target: $(".options").get(0),
  label: "Chargement...",
  layers: baseGroup,
});
map.addControl(progress);

// Scale Line

map.addControl(new ol.control.ScaleLine());



// Define a new legend
var legend = new ol.legend.Legend({
  title: "Légende",
  margin: 5,
  maxWidth: 300,
});
var legendCtrl = new ol.control.Legend({
  legend: legend,
  collapsed: false,
});
map.addControl(legendCtrl);

// New legend associated with a layer
var layerLegend = new ol.legend.Legend({ layer: Densite_pop });

layerLegend.addItem(
  new ol.legend.Image({
    title: "Population",
    src: "RSC/IMG/population.PNG",
  })
);

legend.addItem(layerLegend);



var toolbarDivElement = document.createElement("div");
toolbarDivElement.className = "toolbarDiv";

// start : full screen Control
var fsButton = document.createElement("button");
fsButton.innerHTML =
  '<i class="fa-solid fa-expand"></i>';
fsButton.className = "myButton";
fsButton.title = "Plein ecran";

var fsElement = document.createElement("div");
fsElement.className = "myButtonDiv";
fsElement.appendChild(fsButton);
toolbarDivElement.appendChild(fsElement);

fsButton.addEventListener("click", () => {
  var mapEle = document.getElementById("map");
  if (mapEle.requestFullscreen) {
    mapEle.requestFullscreen();
  } else if (mapEle.msRequestFullscreen) {
    mapEle.msRequestFullscreen();
  } else if (mapEle.mozRequestFullscreen) {
    mapEle.mozRequestFullscreen();
  } else if (mapEle.webkitRequestFullscreen) {
    mapEle.webkitRequestFullscreen();
  }
});

// map.addControl(fsControl);
// end : full screen Control
// start : Layers Control
var lyrsButton = document.createElement("button");
lyrsButton.innerHTML =
  '<i class="fa-solid fa-layer-group"></i>';
lyrsButton.className = "myButton";
lyrsButton.title = "Couches";

var lyrElement = document.createElement("div");
lyrElement.className = "myButtonDiv";
lyrElement.appendChild(lyrsButton);
toolbarDivElement.appendChild(lyrElement);

var layersFlag = false;
lyrsButton.addEventListener("click", () => {
  lyrsButton.classList.toggle("clicked");
  document.getElementById("map").style.cursor = "default";
  layersFlag = !layersFlag;

  if (layersFlag) {
    document.getElementById("layersDiv").style.display = "block";
  } else {
    document.getElementById("layersDiv").style.display = "none";
  }
});
// end : Layers Control

// start : pan Control
var panButton = document.createElement("button");
panButton.innerHTML = '<i class="fa-solid fa-hand"></i>';
panButton.className = "myButton";
panButton.id = "panButton";
panButton.title = "Pan";

var panElement = document.createElement("div");
panElement.className = "myButtonDiv";
panElement.appendChild(panButton);
toolbarDivElement.appendChild(panElement);

var panFlag = false;
var drgPanInteraction = new ol.interaction.DragPan();
panButton.addEventListener("click", () => {
  panButton.classList.toggle("clicked");
  panFlag = !panFlag;
  if (panFlag) {
    document.getElementById("map").style.cursor = "grab";
    map.addInteraction(drgPanInteraction);
  } else {
    document.getElementById("map").style.cursor = "default";
    map.removeInteraction(drgPanInteraction);
  }
});
// end : pan Control


// start : Length and Area Measurement Control
var lengthButton = document.createElement("button");
lengthButton.innerHTML =
  '<i class="fa-solid fa-ruler"></i>';
lengthButton.className = "myButton";
lengthButton.id = "lengthButton";
lengthButton.title = "Mesure Distance";

var lengthElement = document.createElement("div");
lengthElement.className = "myButtonDiv";
lengthElement.appendChild(lengthButton);
toolbarDivElement.appendChild(lengthElement);

var lengthFlag = false;
lengthButton.addEventListener("click", () => {
  // disableOtherInteraction('lengthButton');
  lengthButton.classList.toggle("clicked");
  lengthFlag = !lengthFlag;
  document.getElementById("map").style.cursor = "default";
  if (lengthFlag) {
    map.removeInteraction(draw);
    addInteraction("LineString");
  } else {
    map.removeInteraction(draw);
    source.clear();
    const elements = document.getElementsByClassName(
      "ol-tooltip ol-tooltip-static"
    );
    while (elements.length > 0) elements[0].remove();
  }
});

var areaButton = document.createElement("button");
areaButton.innerHTML =
  '<i class="fa-solid fa-draw-polygon"></i>';
areaButton.className = "myButton";
areaButton.id = "areaButton";
areaButton.title = "Mesure Aire";

var areaElement = document.createElement("div");
areaElement.className = "myButtonDiv";
areaElement.appendChild(areaButton);
toolbarDivElement.appendChild(areaElement);

var areaFlag = false;
areaButton.addEventListener("click", () => {
  // disableOtherInteraction('areaButton');
  areaButton.classList.toggle("clicked");
  areaFlag = !areaFlag;
  document.getElementById("map").style.cursor = "default";
  if (areaFlag) {
    map.removeInteraction(draw);
    addInteraction("Polygon");
  } else {
    map.removeInteraction(draw);
    source.clear();
    const elements = document.getElementsByClassName(
      "ol-tooltip ol-tooltip-static"
    );
    while (elements.length > 0) elements[0].remove();
  }
});

/**
 * Message to show when the user is drawing a polygon.
 * @type {string}
 */
var continuePolygonMsg = "Click to continue polygon, Double click to complete";

/**
 * Message to show when the user is drawing a line.
 * @type {string}
 */
var continueLineMsg = "Click to continue line, Double click to complete";

var draw; // global so we can remove it later

var source = new ol.source.Vector();
var vector = new ol.layer.Vector({
  source: source,
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: "rgba(255, 255, 255, 0.2)",
    }),
    stroke: new ol.style.Stroke({
      color: "#ffcc33",
      width: 2,
    }),
    image: new ol.style.Circle({
      radius: 7,
      fill: new ol.style.Fill({
        color: "#ffcc33",
      }),
    }),
  }),
});

map.addLayer(vector);

function addInteraction(intType) {
  draw = new ol.interaction.Draw({
    source: source,
    type: intType,
    style: interactionStyle,
  });
  map.addInteraction(draw);

  createMeasureTooltip();
  createHelpTooltip();

  /**
   * Currently drawn feature.
   * @type {import("../src/ol/Feature.js").default}
   */
  var sketch;

  /**
   * Handle pointer move.
   * @param {import("../src/ol/MapBrowserEvent").default} evt The event.
   */
  var pointerMoveHandler = function (evt) {
    if (evt.dragging) {
      return;
    }
    /** @type {string} */
    var helpMsg = "Click to start drawing";

    if (sketch) {
      var geom = sketch.getGeometry();
      // if (geom instanceof ol.geom.Polygon) {
      //   helpMsg = continuePolygonMsg;
      // } else if (geom instanceof ol.geom.LineString) {
      //   helpMsg = continueLineMsg;
      // }
    }

    //helpTooltipElement.innerHTML = helpMsg;
    //helpTooltip.setPosition(evt.coordinate);

    //helpTooltipElement.classList.remove('hidden');
  };

  map.on("pointermove", pointerMoveHandler);

  // var listener;
  draw.on("drawstart", function (evt) {
    // set sketch
    sketch = evt.feature;

    /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
    var tooltipCoord = evt.coordinate;

    //listener = sketch.getGeometry().on('change', function (evt) {
    sketch.getGeometry().on("change", function (evt) {
      var geom = evt.target;
      var output;
      if (geom instanceof ol.geom.Polygon) {
        output = formatArea(geom);
        tooltipCoord = geom.getInteriorPoint().getCoordinates();
      } else if (geom instanceof ol.geom.LineString) {
        output = formatLength(geom);
        tooltipCoord = geom.getLastCoordinate();
      }
      measureTooltipElement.innerHTML = output;
      measureTooltip.setPosition(tooltipCoord);
    });
  });

  draw.on("drawend", function () {
    measureTooltipElement.className = "ol-tooltip ol-tooltip-static";
    measureTooltip.setOffset([0, -7]);
    // unset sketch
    sketch = null;
    // unset tooltip so that a new one can be created
    measureTooltipElement = null;
    createMeasureTooltip();
    //ol.Observable.unByKey(listener);
  });
}

/**
 * The help tooltip element.
 * @type {HTMLElement}
 */
var helpTooltipElement;

/**
 * Overlay to show the help messages.
 * @type {Overlay}
 */
var helpTooltip;

/**
 * Creates a new help tooltip
 */
function createHelpTooltip() {
  if (helpTooltipElement) {
    helpTooltipElement.parentNode.removeChild(helpTooltipElement);
  }
  helpTooltipElement = document.createElement("div");
  helpTooltipElement.className = "ol-tooltip hidden";
  helpTooltip = new ol.Overlay({
    element: helpTooltipElement,
    offset: [15, 0],
    positioning: "center-left",
  });
  map.addOverlay(helpTooltip);
}

//  map.getViewport().addEventListener('mouseout', function () {
//    helpTooltipElement.classList.add('hidden');
//  });

/**
 * The measure tooltip element.
 * @type {HTMLElement}
 */
var measureTooltipElement;

/**
 * Overlay to show the measurement.
 * @type {Overlay}
 */
var measureTooltip;

/**
 * Creates a new measure tooltip
 */

function createMeasureTooltip() {
  if (measureTooltipElement) {
    measureTooltipElement.parentNode.removeChild(measureTooltipElement);
  }
  measureTooltipElement = document.createElement("div");
  measureTooltipElement.className = "ol-tooltip ol-tooltip-measure";
  measureTooltip = new ol.Overlay({
    element: measureTooltipElement,
    offset: [0, -15],
    positioning: "bottom-center",
  });
  map.addOverlay(measureTooltip);
}

/**
 * Format length output.
 * @param {LineString} line The line.
 * @return {string} The formatted length.
 */
var formatLength = function (line) {
  var length = ol.sphere.getLength(line);
  var output;
  if (length > 100) {
    output = Math.round((length / 1000) * 100) / 100 + " " + "km";
  } else {
    output = Math.round(length * 100) / 100 + " " + "m";
  }
  return output;
};

/**
 * Format area output.
 * @param {Polygon} polygon The polygon.
 * @return {string} Formatted area.
 */
var formatArea = function (polygon) {
  var area = ol.sphere.getArea(polygon);
  var output;
  if (area > 10000) {
    output = Math.round((area / 1000000) * 100) / 100 + " " + "km<sup>2</sup>";
  } else {
    output = Math.round(area * 100) / 100 + " " + "m<sup>2</sup>";
  }
  return output;
};
// end : Length and Area Measurement Control

// start : attribute query
var qryButton = document.createElement("button");
qryButton.innerHTML =
  '<i class="fa-solid fa-database"></i>';
qryButton.className = "myButton";
qryButton.id = "qryButton";
qryButton.title = "Requete Attribut";

var qryElement = document.createElement("div");
qryElement.className = "myButtonDiv";
qryElement.appendChild(qryButton);
toolbarDivElement.appendChild(qryElement);

var qryFlag = false;
qryButton.addEventListener("click", () => {
  // disableOtherInteraction('lengthButton');
  qryButton.classList.toggle("clicked");
  qryFlag = !qryFlag;
  document.getElementById("map").style.cursor = "default";
  if (qryFlag) {
    if (queryGeoJSON) {
      queryGeoJSON.getSource().clear();
      map.removeLayer(queryGeoJSON);
    }

    if (clickSelectedFeatureOverlay) {
      clickSelectedFeatureOverlay.getSource().clear();
      map.removeLayer(clickSelectedFeatureOverlay);
    }
    document.getElementById("map").style.cursor = "default";
    document.getElementById("attQueryDiv").style.display = "block";

    bolIdentify = false;

    addMapLayerList("selectLayer");
  } else {
    document.getElementById("map").style.cursor = "default";
    document.getElementById("attQueryDiv").style.display = "none";

    document.getElementById("attListDiv").style.display = "none";

    if (queryGeoJSON) {
      queryGeoJSON.getSource().clear();
      map.removeLayer(queryGeoJSON);
    }

    if (clickSelectedFeatureOverlay) {
      clickSelectedFeatureOverlay.getSource().clear();
      map.removeLayer(clickSelectedFeatureOverlay);
    }
  }
});

var markerFeature;
function addInteractionForSpatialQuery(intType) {
  draw = new ol.interaction.Draw({
    source: clickSelectedFeatureOverlay.getSource(),
    type: intType,
    style: interactionStyle,
  });
  map.addInteraction(draw);

  draw.on("drawend", function (e) {
    markerFeature = e.feature;
    markerFeature.set("geometry", markerFeature.getGeometry());
    map.removeInteraction(draw);
    document.getElementById("spUserInput").classList.toggle("clicked");
    map.addLayer(clickSelectedFeatureOverlay);
  });
}

function selectFeature(evt) {
  if (featureOverlay) {
    featureOverlay.getSource().clear();
    map.removeLayer(featureOverlay);
  }
  var selectedFeature = map.forEachFeatureAtPixel(
    evt.pixel,
    function (feature, layer) {
      return feature;
    }
  );

  if (selectedFeature) {
    featureOverlay.getSource().addFeature(selectedFeature);
  }
}

function addMapLayerList(selectElementName) {
  $("#editingLayer").empty();
  $("#selectLayer").empty();
  $("#buffSelectLayer").empty();

  $(document).ready(function () {
    $.ajax({
      type: "GET",
      url: "http://" + serverPort + "/geoserver/wfs?request=getCapabilities",
      dataType: "xml",
      success: function (xml) {
        var select = $("#" + selectElementName);
        select.append("<option class='ddindent' value=''></option>");
        $(xml)
          .find("FeatureType")
          .each(function () {
            $(this)
              .find("Name")
              .each(function () {
                var value = $(this).text();
                if (layerList.includes(value)) {
                  select.append(
                    "<option class='ddindent' value='" +
                      value +
                      "'>" +
                      value +
                      "</option>"
                  );
                }
              });
          });
      },
    });
  });
}

function newpopulateQueryTable(url) {
  if (typeof attributePanel !== "undefined") {
    if (attributePanel.parentElement !== null) {
      attributePanel.close();
    }
  }
  $.getJSON(url, function (data) {
    var col = [];
    col.push("id");
    for (var i = 0; i < data.features.length; i++) {
      for (var key in data.features[i].properties) {
        if (col.indexOf(key) === -1) {
          col.push(key);
        }
      }
    }

    var table = document.createElement("table");

    table.setAttribute(
      "class",
      "table table-bordered table-hover table-condensed"
    );
    table.setAttribute("id", "attQryTable");
    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

    var tr = table.insertRow(-1); // TABLE ROW.

    for (var i = 0; i < col.length; i++) {
      var th = document.createElement("th"); // TABLE HEADER.
      th.innerHTML = col[i];
      tr.appendChild(th);
    }

    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (var i = 0; i < data.features.length; i++) {
      tr = table.insertRow(-1);
      for (var j = 0; j < col.length; j++) {
        var tabCell = tr.insertCell(-1);
        if (j == 0) {
          tabCell.innerHTML = data.features[i]["id"];
        } else {
          tabCell.innerHTML = data.features[i].properties[col[j]];
        }
      }
    }

    // var tabDiv = document.createElement("div");
    var tabDiv = document.getElementById("attListDiv");

    var delTab = document.getElementById("attQryTable");
    if (delTab) {
      tabDiv.removeChild(delTab);
    }

    tabDiv.appendChild(table);

    document.getElementById("attListDiv").style.display = "block";
  });
}

function newaddGeoJsonToMap(url) {
  if (queryGeoJSON) {
    queryGeoJSON.getSource().clear();
    map.removeLayer(queryGeoJSON);
  }

  queryGeoJSON = new ol.layer.Vector({
    source: new ol.source.Vector({
      url: url,
      format: new ol.format.GeoJSON(),
    }),
    style: querySelectedFeatureStyle,
  });

  queryGeoJSON.getSource().on("addfeature", function () {
    map
      .getView()
      .fit(queryGeoJSON.getSource().getExtent(), {
        duration: 1590,
        size: map.getSize(),
        maxZoom: 21,
      });
  });
  map.addLayer(queryGeoJSON);
}

function newaddRowHandlers() {
  var attTable = document.getElementById("attQryTable");
  // var rows = document.getElementById("attQryTable").rows;
  var rows = attTable.rows;
  var heads = attTable.getElementsByTagName("th");
  var col_no;
  for (var i = 0; i < heads.length; i++) {
    // Take each cell
    var head = heads[i];
    if (head.innerHTML == "id") {
      col_no = i + 1;
    }
  }
  for (i = 0; i < rows.length; i++) {
    rows[i].onclick = (function () {
      return function () {
        clickSelectedFeatureOverlay.getSource().clear();

        $(function () {
          $("#attQryTable td").each(function () {
            $(this).parent("tr").css("background-color", "white");
          });
        });
        var cell = this.cells[col_no - 1];
        var id = cell.innerHTML;
        $(document).ready(function () {
          $("#attQryTable td:nth-child(" + col_no + ")").each(function () {
            if ($(this).text() == id) {
              $(this).parent("tr").css("background-color", "#d1d8e2");
            }
          });
        });

        var features = queryGeoJSON.getSource().getFeatures();

        for (i = 0; i < features.length; i++) {
          if (features[i].getId() == id) {
            clickSelectedFeatureOverlay.getSource().addFeature(features[i]);

            clickSelectedFeatureOverlay
              .getSource()
              .on("addfeature", function () {
                map
                  .getView()
                  .fit(clickSelectedFeatureOverlay.getSource().getExtent(), {
                    duration: 1500,
                    size: map.getSize(),
                    maxZoom: 24,
                  });
              });
          }
        }
      };
    })(rows[i]);
  }
}
// end : attribute query

// start : spatial query
var bufferButton = document.createElement("button");
bufferButton.innerHTML =
  '<i class="fa-solid fa-globe"></i>';
bufferButton.className = "myButton";
bufferButton.id = "bufferButton";
bufferButton.title = "Requete Saptial";

var bufferElement = document.createElement("div");
bufferElement.className = "myButtonDiv";
bufferElement.appendChild(bufferButton);
toolbarDivElement.appendChild(bufferElement);

var bufferFlag = false;
bufferButton.addEventListener("click", () => {
  // disableOtherInteraction('lengthButton');
  bufferButton.classList.toggle("clicked");
  bufferFlag = !bufferFlag;
  document.getElementById("map").style.cursor = "default";
  if (bufferFlag) {
    if (geojson) {
      geojson.getSource().clear();
      map.removeLayer(geojson);
    }

    if (featureOverlay) {
      featureOverlay.getSource().clear();
      map.removeLayer(featureOverlay);
    }
    document.getElementById("map").style.cursor = "default";
    document.getElementById("spQueryDiv").style.display = "block";

    addMapLayerList_spQry();
  } else {
    document.getElementById("map").style.cursor = "default";
    document.getElementById("spQueryDiv").style.display = "none";
    document.getElementById("attListDiv").style.display = "none";

    if (geojson) {
      geojson.getSource().clear();
      map.removeLayer(geojson);
    }

    if (featureOverlay) {
      featureOverlay.getSource().clear();
      map.removeLayer(featureOverlay);
    }
    map.removeInteraction(draw);
    if (document.getElementById("spUserInput").classList.contains("clicked")) {
      document.getElementById("spUserInput").classList.toggle("clicked");
    }
  }
});

function addMapLayerList_spQry() {
  $(document).ready(function () {
    $.ajax({
      type: "GET",
      url: "http://" + serverPort + "/geoserver/wfs?request=getCapabilities",
      dataType: "xml",
      success: function (xml) {
        var select = $("#buffSelectLayer");
        select.append("<option class='ddindent' value=''></option>");
        $(xml)
          .find("FeatureType")
          .each(function () {
            $(this)
              .find("Name")
              .each(function () {
                var value = $(this).text();
                if (layerList.includes(value)) {
                  select.append(
                    "<option class='ddindent' value='" +
                      value +
                      "'>" +
                      value +
                      "</option>"
                  );
                }
              });
          });
      },
    });
  });
}
// end : spatial query

// finally add all main control to map
var allControl = new ol.control.Control({
  element: toolbarDivElement,
});
map.addControl(allControl);

// start : live search function

var txtVal = "";
var inputBox = document.getElementById("inpt_search");
inputBox.onkeyup = function () {
  var newVal = this.value.trim();
  if (newVal == txtVal) {
  } else {
    txtVal = this.value;
    txtVal = txtVal.trim();
    if (txtVal !== "") {
      if (txtVal.length > 2) {
        clearResults();
        createLiveSearchTable();

        $.ajax({
          url: "http://localhost/web_app/fetch.php",
          type: "post",
          data: {
            request: "liveSearch",
            searchTxt: txtVal,
            searchLayer: "public." + regions,
            searchAttribute: "nom",
          },
          dataType: "json",
          success: function (response) {
            createRows(response, regions);
          },
        });


        $.ajax({
          url: "http://localhost/web_app/fetch.php",
          type: "post",
          data: {
            request: "liveSearch",
            searchTxt: txtVal,
            searchLayer: "public." + departements,
            searchAttribute: "nom",
          },
          dataType: "json",
          success: function (response) {
            createRows(response, departements);
          },
        });

        $.ajax({
          url: "http://localhost/web_app/fetch.php",
          type: "post",
          data: {
            request: "liveSearch",
            searchTxt: txtVal,
            searchLayer: "public." + communes,
            searchAttribute: "nom",
          },
          dataType: "json",
          success: function (response) {
            createRows(response, communes);
          },
        });

        $.ajax({
          url: "http://localhost/web_app/fetch.php",
          type: "post",
          data: {
            request: "liveSearch",
            searchTxt: txtVal,
            searchLayer: "public." + Localites_centre,
            searchAttribute: "village",
          },
          dataType: "json",
          success: function (response) {
            createRows(response, Localites_centre);
          },
        });
      } else {
        clearResults();
      }
    } else {
      clearResults();
    }
  }
};

// var liveDataDivEle = document.createElement('div');
// liveDataDivEle.className = 'liveDataDiv';
var liveDataDivEle = document.getElementById("liveDataDiv");
var searchTable = document.createElement("table");

function createLiveSearchTable() {
  searchTable.setAttribute("class", "assetSearchTableClass");
  searchTable.setAttribute("id", "assetSearchTableID");

  var tableHeaderRow = document.createElement("tr");
  var tableHeader1 = document.createElement("th");
  tableHeader1.innerHTML = "Layer";
  var tableHeader2 = document.createElement("th");
  tableHeader2.innerHTML = "Object";

  tableHeaderRow.appendChild(tableHeader1);
  tableHeaderRow.appendChild(tableHeader2);
  searchTable.appendChild(tableHeaderRow);
}

function createRows(data, layerName) {
  var i = 0;
  for (var key in data) {
    var data2 = data[key];
    var tableRow = document.createElement("tr");
    var td1 = document.createElement("td");
    if (i == 0) {
      td1.innerHTML = layerName;
    }
    var td2 = document.createElement("td");
    for (var key2 in data2) {
      td2.innerHTML = data2[key2];
      if (layerName == regions) {
        td2.setAttribute(
          "onClick",
          "zoomToFeature(this,'" + regions + "','" + key2 + "')"
        );
      } else if (layerName == departements) {
        td2.setAttribute(
          "onClick",
          "zoomToFeature(this,'" + departements + "','" + key2 + "')"
        );
      } else if (layerName == communes) {
        td2.setAttribute(
          "onClick",
          "zoomToFeature(this,'" + communes + "','" + key2 + "')"
        );
      } else if (layerName == Localites_centre) {
        td2.setAttribute(
          "onClick",
          "zoomToFeature(this,'" + Localites_centre + "','" + key2 + "')"
        );
      } else {
      }
    }
    tableRow.appendChild(td1);
    tableRow.appendChild(td2);
    searchTable.appendChild(tableRow);

    i = i + 1;
  }

  liveDataDivEle.appendChild(searchTable);
  var ibControl = new ol.control.Control({
    element: liveDataDivEle,
  });
  map.addControl(ibControl);
}

function clearResults() {
  liveDataDivEle.innerHTML = "";
  searchTable.innerHTML = "";
  map.removeLayer(queryGeoJSON);
}

function zoomToFeature(featureName, layerName, attributeName) {
  map.removeLayer(geojson);
  var value_layer = layerName;
  var value_attribute = attributeName;
  var value_operator = "==";
  var value_txt = featureName.innerHTML;
  var url =
    "http://localhost:8080/geoserver/beesig_w/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
    value_layer +
    "&CQL_FILTER=" +
    value_attribute +
    "+" +
    value_operator +
    "+'" +
    value_txt +
    "'&outputFormat=application/json";
  // console.log(url);
  newaddGeoJsonToMap(url);
}

// end : live search function

// start : onload functions
$(function () {
  // render layerswitcher control
  var toc = document.getElementById("layerSwitcherContent");
  layerSwitcherControl = new ol.control.LayerSwitcher.renderPanel(map, toc, {
    reverse: true,
  });

  document.getElementById("selectLayer").onchange = function () {
    var select = document.getElementById("selectAttribute");
    while (select.options.length > 0) {
      select.remove(0);
    }
    var value_layer = $(this).val();
    $(document).ready(function () {
      $.ajax({
        type: "GET",
        url:
          "http://" +
          serverPort +
          "/geoserver/wfs?service=WFS&request=DescribeFeatureType&version=1.1.0&typeName=" +
          value_layer,
        dataType: "xml",
        success: function (xml) {
          var select = $("#selectAttribute");
          //var title = $(xml).find('xsd\\:complexType').attr('name');
          //	alert(title);
          select.append("<option class='ddindent' value=''></option>");
          $(xml)
            .find("xsd\\:sequence")
            .each(function () {
              $(this)
                .find("xsd\\:element")
                .each(function () {
                  var value = $(this).attr("name");
                  //alert(value);
                  var type = $(this).attr("type");
                  //alert(type);
                  if (value != "geom" && value != "the_geom") {
                    select.append(
                      "<option class='ddindent' value='" +
                        type +
                        "'>" +
                        value +
                        "</option>"
                    );
                  }
                });
            });
        },
      });
    });
  };
  document.getElementById("selectAttribute").onchange = function () {
    var operator = document.getElementById("selectOperator");
    while (operator.options.length > 0) {
      operator.remove(0);
    }

    var value_type = $(this).val();
    // alert(value_type);
    var value_attribute = $("#selectAttribute option:selected").text();
    operator.options[0] = new Option("Select operator", "");

    if (
      value_type == "xsd:short" ||
      value_type == "xsd:int" ||
      value_type == "xsd:double"
    ) {
      var operator1 = document.getElementById("selectOperator");
      operator1.options[1] = new Option("Greater than", ">");
      operator1.options[2] = new Option("Less than", "<");
      operator1.options[3] = new Option("Equal to", "=");
    } else if (value_type == "xsd:string") {
      var operator1 = document.getElementById("selectOperator");
      operator1.options[1] = new Option("Like", "Like");
      operator1.options[2] = new Option("Equal to", "=");
    }
  };

  document.getElementById("attQryRun").onclick = function () {
    map.set("isLoading", "YES");

    if (featureOverlay) {
      featureOverlay.getSource().clear();
      map.removeLayer(featureOverlay);
    }

    var layer = document.getElementById("selectLayer");
    var attribute = document.getElementById("selectAttribute");
    var operator = document.getElementById("selectOperator");
    var txt = document.getElementById("enterValue");

    if (layer.options.selectedIndex == 0) {
      alert("Select Layer");
    } else if (attribute.options.selectedIndex == -1) {
      alert("Select Attribute");
    } else if (operator.options.selectedIndex <= 0) {
      alert("Select Operator");
    } else if (txt.value.length <= 0) {
      alert("Enter Value");
    } else {
      var value_layer = layer.options[layer.selectedIndex].value;
      var value_attribute = attribute.options[attribute.selectedIndex].text;
      var value_operator = operator.options[operator.selectedIndex].value;
      var value_txt = txt.value;
      if (value_operator == "Like") {
        value_txt = "%25" + value_txt + "%25";
      } else {
        value_txt = value_txt;
      }
      var url =
        "http://" +
        serverPort +
        "/geoserver/" +
        geoserverWorkspace +
        "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
        value_layer +
        "&CQL_FILTER=" +
        value_attribute +
        "+" +
        value_operator +
        "+'" +
        value_txt +
        "'&outputFormat=application/json";
      newaddGeoJsonToMap(url);
      newpopulateQueryTable(url);
      setTimeout(function () {
        newaddRowHandlers(url);
      }, 1000);
      map.addLayer(clickSelectedFeatureOverlay);
      map.set("isLoading", "NO");
    }
  };

  document.getElementById("srcCriteria").onchange = function () {
    if (queryGeoJSON) {
      queryGeoJSON.getSource().clear();
      map.removeLayer(queryGeoJSON);
    }

    if (clickSelectedFeatureOverlay) {
      clickSelectedFeatureOverlay.getSource().clear();
      map.removeLayer(clickSelectedFeatureOverlay);
    }
    if (document.getElementById("spUserInput").classList.contains("clicked")) {
      document.getElementById("spUserInput").classList.toggle("clicked");
    }
  };

  document.getElementById("spUserInput").onclick = function () {
    document.getElementById("spUserInput").classList.toggle("clicked");
    if (document.getElementById("spUserInput").classList.contains("clicked")) {
      if (queryGeoJSON) {
        queryGeoJSON.getSource().clear();
        map.removeLayer(queryGeoJSON);
      }

      if (clickSelectedFeatureOverlay) {
        clickSelectedFeatureOverlay.getSource().clear();
        map.removeLayer(clickSelectedFeatureOverlay);
      }
      var srcCriteriaValue = document.getElementById("srcCriteria").value;
      if (srcCriteriaValue == "pointMarker") {
        addInteractionForSpatialQuery("Point");
      }
      if (srcCriteriaValue == "lineMarker") {
        addInteractionForSpatialQuery("LineString");
      }
      if (srcCriteriaValue == "polygonMarker") {
        addInteractionForSpatialQuery("Polygon");
      }
    } else {
      coordList = "";
      markerFeature = undefined;
      map.removeInteraction(draw);
    }
  };

  document.getElementById("spQryRun").onclick = function () {
    var layer = document.getElementById("buffSelectLayer");
    var value_layer = layer.options[layer.selectedIndex].value;

    var srcCriteria = document.getElementById("srcCriteria");
    var value_src = srcCriteria.options[srcCriteria.selectedIndex].value;
    var coordList = "";
    var url;
    var markerType = "";
    if (markerFeature) {
      if (value_src == "pointMarker") {
        coordList =
          markerFeature.getGeometry().getCoordinates()[0] +
          " " +
          markerFeature.getGeometry().getCoordinates()[1];
        markerType = "Point";
      }
      if (value_src == "lineMarker") {
        var coordArray = markerFeature.getGeometry().getCoordinates();

        for (i = 0; i < coordArray.length; i++) {
          if (i == 0) {
            coordList = coordArray[i][0] + " " + coordArray[i][1];
          } else {
            coordList =
              coordList + ", " + coordArray[i][0] + " " + coordArray[i][1];
          }
        }
        markerType = "LineString";
      }
      if (value_src == "polygonMarker") {
        var coordArray = markerFeature.getGeometry().getCoordinates()[0];
        for (i = 0; i < coordArray.length; i++) {
          if (i == 0) {
            coordList = coordArray[i][0] + " " + coordArray[i][1];
          } else {
            coordList =
              coordList + ", " + coordArray[i][0] + " " + coordArray[i][1];
          }
        }
        coordList = "(" + coordList + ")";
        markerType = "Polygon";
      }

      var value_attribute = $("#qryType option:selected").text();
      if (value_attribute == "Within Distance of") {
        var dist = document.getElementById("bufferDistance");
        var value_dist = Number(dist.value);
        // value_dist = value_dist / 111.325;

        var distanceUnit = document.getElementById("distanceUnits");
        var value_distanceUnit =
          distanceUnit.options[distanceUnit.selectedIndex].value;
        url =
          "http://" +
          serverPort +
          "/geoserver/" +
          geoserverWorkspace +
          "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
          value_layer +
          "&CQL_FILTER=DWITHIN(geom," +
          markerType +
          "(" +
          coordList +
          ")," +
          value_dist +
          "," +
          value_distanceUnit +
          ")&outputFormat=application/json";
      } else if (value_attribute == "Intersecting") {
        url =
          "http://" +
          serverPort +
          "/geoserver/" +
          geoserverWorkspace +
          "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
          value_layer +
          "&CQL_FILTER=INTERSECTS(geom," +
          markerType +
          "(" +
          coordList +
          "))&outputFormat=application/json";
      } else if (value_attribute == "Completely Within") {
        url =
          "http://" +
          serverPort +
          "/geoserver/" +
          geoserverWorkspace +
          "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
          value_layer +
          "&CQL_FILTER=WITHIN(geom," +
          markerType +
          "(" +
          coordList +
          "))&outputFormat=application/json";
      }
      newaddGeoJsonToMap(url);
      coordList = "";
      markerFeature = undefined;
    }
  };

  var mapInteractions = map.getInteractions();
  for (var x = 0; x < mapInteractions.getLength(); x++) {
    var mapInteraction = mapInteractions.item(x);
    if (mapInteraction instanceof ol.interaction.DoubleClickZoom) {
      map.removeInteraction(mapInteraction);
      break;
    }
  }

  for (var x = 0; x < mapInteractions.getLength(); x++) {
    var mapInteraction = mapInteractions.item(x);
    if (mapInteraction instanceof ol.interaction.DragPan) {
      map.removeInteraction(mapInteraction);
      break;
    }
  }

  document.getElementById("qryType").onchange = function () {
    var value_attribute = $("#qryType option:selected").text();
    var buffDivElement = document.getElementById("bufferDiv");

    if (value_attribute == "Within Distance of") {
      buffDivElement.style.display = "block";
    } else {
      buffDivElement.style.display = "none";
    }
  };

  document.getElementById("spQryClear").onclick = function () {
    if (queryGeoJSON) {
      queryGeoJSON.getSource().clear();
      map.removeLayer(queryGeoJSON);
    }

    if (clickSelectedFeatureOverlay) {
      clickSelectedFeatureOverlay.getSource().clear();
      map.removeLayer(clickSelectedFeatureOverlay);
    }
    coordList = "";
    markerFeature = undefined;
  };

  document.getElementById("attQryClear").onclick = function () {
    if (queryGeoJSON) {
      queryGeoJSON.getSource().clear();
      map.removeLayer(queryGeoJSON);
    }

    if (clickSelectedFeatureOverlay) {
      clickSelectedFeatureOverlay.getSource().clear();
      map.removeLayer(clickSelectedFeatureOverlay);
    }
    coordList = "";
    markerFeature = undefined;
    document.getElementById("attListDiv").style.display = "none";
  };

  // live search input box behaviour
  $("#inpt_search").on("focus", function () {
    $(this).parent("label").addClass("active");
  });

  $("#inpt_search").on("blur", function () {
    if ($(this).val().length == 0)
      $(this).parent("label").removeClass("active");
  });

  // live location
  $("#btnCrosshair").on("click", function (event) {
    $("#btnCrosshair").toggleClass("clicked");
    if ($("#btnCrosshair").hasClass("clicked")) {
      startAutolocate();
    } else {
      stopAutolocate();
    }
  });
});
// end : onload functions


// Add a title control
map.addControl(new ol.control.CanvasTitle({ 
  title: 'Titre', 
  visible: false,
  style: new ol.style.Style({ text: new ol.style.Text({ font: '20px "Lucida Grande",Verdana,Geneva,Lucida,Arial,Helvetica,sans-serif'}) })
}));

// Print control
var printControl = new ol.control.PrintDialog({ 
  // target: document.querySelector('.info'),
  // targetDialog: map.getTargetElement() 
  // save: false,
  // copy: false,
  // pdf: false
});
printControl.setSize('A4');
map.addControl(printControl);

/* On print > save image file */
printControl.on(['print', 'error'], function(e) {
  // Print success
  if (e.image) {
    if (e.pdf) {
      // Export pdf using the print info
      var pdf = new jsPDF({
        orientation: e.print.orientation,
        unit: e.print.unit,
        format: e.print.size
      });
      pdf.addImage(e.image, 'JPEG', e.print.position[0], e.print.position[0], e.print.imageWidth, e.print.imageHeight);
      pdf.save(e.print.legend ? 'legend.pdf' : 'map.pdf');
    } else  {
      // Save image as file
      e.canvas.toBlob(function(blob) {
        var name = (e.print.legend ? 'legend.' : 'map.')+e.imageType.replace('image/','');
        saveAs(blob, name);
      }, e.imageType, e.quality);
    }
  } else {
    console.warn('No canvas to export');
  }
});


// GeoJSON layer
var vectorSource = new ol.source.Vector({
  title:'region_centre',
  url: 'RSC/GeoJson/region_centre.geojson',
  format: new ol.format.GeoJSON(),
  attribution :'@geoserver',
});

map.addLayer(new ol.layer.Vector({
  name: 'Regions',
  source: vectorSource,
  style: function(f) {
    return new ol.style.Style({ 
      image: new ol.style.RegularShape({
        radius: 5,
        radius2: 0,
        points: 4,
        stroke: new ol.style.Stroke({ color: "#000", width:1 })  
      }),
      text: new ol.style.Text ({
        text: f.get('nom').toString(),
        font: 'bold 11px sans-serif',
      }),
      stroke: new ol.style.Stroke({
        width: 1,
        color: [255,128,0]
      }),
      fill: new ol.style.Fill({
        color: [255,128,0,.2]
      })
    })
  }
  
}));

// Select  interaction
var select = new ol.interaction.Select({
  hitTolerance: 5,
  multi: true,
  condition: ol.events.condition.singleClick
});
map.addInteraction(select);

// Select control
var popup = new ol.Overlay.PopupFeature({
  popupClass: 'default anim',
  select: select,
  canFix: true,
  /** /
  template: function(f) {
    return {
      title: function(f) { return f.get('nom')+' ('+f.get('id')+')' },
      attributes: { 
        region: { title: 'Région' }, 
        arrond: 'arrond', 
        cantons: 'cantons', 
        communes: 'communes', 
        pop: 'pop' 
      }
    }
  },
  /**/

  closeBox: true,
  template: {
      title: 
        // 'nom',   // only display the name
        function(f) {
          return f.get('nom')+' ('+f.get('id_pays')+')';
        },
      attributes: // [ 'region', 'arrond', 'cantons', 'communes', 'pop' ]
      {
        'nom': { title: 'Région' },
        'nombre_departements': { title: 'Départements' },
        'nombre_communes': { title: 'Communes' },
        'nombre_population': { title: 'Population' },
        'superficie': { title: 'Superficie' },
        // with prefix and suffix
        'pop': { 
          title: 'Population',  // attribute's title
          before: '',           // something to add before
          format: ol.Overlay.PopupFeature.localString(),  // format as local string
          after: ' hab.'        // something to add after
        },
        // calculated attribute
        'pop2': {
          title: 'Population (kHab.)',  // attribute's title
          format: function(val, f) { 
            return Math.round(parseInt(f.get('pop'))/100).toLocaleString() + ' kHab.' 
          }
        }
        /* Using localString with a date * /
        'date': { 
          title: 'Date', 
          format: ol.Overlay.PopupFeature.localString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) 
        }
        /**/
      }
  }
});

map.addOverlay (popup);

function toggleLayer(eve){
  var lyrname = eve.target.value;
  var checkedStatus = eve.target.checked;
  var lyrList = map.getLayers();  

  lyrList.forEach(function(element){
      if (lyrname == element.get('title')){
          element.setVisible(checkedStatus);
      }
  });
}