var serverPort = 'localhost:8080';
var geoserverWorkspace = 'beesig_w';
var regions = 'region';
var departements = 'departement';
var communes = 'commune';
var identifyLayers = [];
var projectionName = 'EPSG:4326';
var layerList = [];

var geojson;
var queryGeoJSON;

var highlightStyle = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(64,244,208,0.4)',
    }),
    stroke: new ol.style.Stroke({
        color: '#40E0D0',
        width: 3,
    }),
    image: new ol.style.Circle({
        radius: 10,
        fill: new ol.style.Fill({
            color: '#40E0D0'
        })
    })
});
var featureOverlay = new ol.layer.Vector({
    source: new ol.source.Vector(),
    map: map,
    style: highlightStyle
});

var querySelectedFeatureStyle = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(64,244,208,0.4)',
    }),
    stroke: new ol.style.Stroke({
        color: '#40E0D0',
        width: 3,
    }),
    image: new ol.style.Circle({
        radius: 10,
        fill: new ol.style.Fill({
            color: '#40E0D0'
        })
    })
});
var querySelectedFeatureOverlay = new ol.layer.Vector({
    source: new ol.source.Vector(),
    map: map,
    style: querySelectedFeatureStyle
});

var clickSelectedFeatureStyle = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(255,255,0,0.4)',
    }),
    stroke: new ol.style.Stroke({
        color: '#FFFF00',
        width: 3,
    }),
    image: new ol.style.Circle({
        radius: 10,
        fill: new ol.style.Fill({
            color: '#FFFF00'
        })
    })
});
var clickSelectedFeatureOverlay = new ol.layer.Vector({
    source: new ol.source.Vector(),
    map: map,
    style: clickSelectedFeatureStyle
});
var interactionStyle = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(200, 200, 200, 0.6)',
    }),
    stroke: new ol.style.Stroke({
        color: 'rgba(0, 0, 0, 0.5)',
        lineDash: [10, 10],
        width: 2,
    }),
    image: new ol.style.Circle({
        radius: 5,
        stroke: new ol.style.Stroke({
            color: 'rgba(0, 0, 0, 0.7)',
        }),
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)',
        }),
    })
});


// Base map (Bing map)

const styles = [
  'RoadOnDemand',
  'Aerial',
  'AerialWithLabelsOnDemand',
  'CanvasDark',
];
const layers = [];
let i, ii;
for (i = 0, ii = styles.length; i < ii; ++i) {
  layers.push(
    new ol.layer.Tile({
      opacity:1,
      visible: true,
      preload: Infinity,
      source: new ol.source.BingMaps({
        key: 'AuOKP0N2ww907dY398Ci9ZKg38AqF2jc7q1QchUixWw30TpwdCt4T36ip-OyE49R',
        imagerySet: styles[i],
        // use maxZoom 19 to see stretched tiles instead of the BingMaps
        // "no photos at this zoom level" tiles
        // maxZoom: 19
      }),
    })
  );
}


// The Map
var mapView =  new ol.View({
  center: ol.proj.fromLonLat([12.744686, 6.434886]),
  zoom: 6,
});

var map = new ol.Map({
  target: 'map',
  view: mapView,
  layers: layers,
  controls : []
});





const selecte = document.getElementById('layer-select');
function onChange() {
  const style = selecte.value;
  for (let i = 0, ii = layers.length; i < ii; ++i) {
    layers[i].setVisible(styles[i] === style);
  }

}

selecte.addEventListener('change', onChange);
onChange();



// ProgressBar
var progress = new ol.control.ProgressBar({
  // target: $('.options').get(0)
  label: 'Chargement...',
  layers: layers
});
map.addControl(progress);


// GeoJSON layer
var Cameroun_Regions = new ol.layer.Image({
  title: 'Cameroun_Regions',
  source: new ol.source.ImageWMS({
      url:'http://localhost:8080/geoserver/beesig_w/wms',
      params: {'LAYERS': 'beesig_w:region', 'TILED': true},
      serverType: 'geoserver',
      visible: true,
  }),
  
});



var Cameroun_Departements = new ol.layer.Image({
  title: 'Cameroun_Departements',
  source: new ol.source.ImageWMS({
      url:'http://localhost:8080/geoserver/beesig_w/wms',
      params: {'LAYERS': 'beesig_w:departement', 'TILED': true},
      serverType: 'geoserver',
      visible: true,
  }),
  
});

map.addLayer(Cameroun_Departements);

var Cameroun_Communes = new ol.layer.Image({
  title: 'Cameroun_Regions',
  source: new ol.source.ImageWMS({
      url:'http://localhost:8080/geoserver/beesig_w/wms',
      params: {'LAYERS': 'beesig_w:commune', 'TILED': true},
      serverType: 'geoserver',
      visible: true,
  }),
  
});


var overlayGroup = new ol.layer.Group({
  title: 'Limites Administratives',
  fold: true,
  layers: [Cameroun_Regions, Cameroun_Departements, Cameroun_Communes]
})

map.addLayer(overlayGroup);



var toolbarDivElement = document.createElement('div');
toolbarDivElement.className = 'toolbarDiv';

// start : home Control
var homeButton = document.createElement('button');
homeButton.innerHTML = '<img src="RSC/IMG/home.svg" alt="" class="myImg"></img>';
homeButton.className = 'myButton';
homeButton.title = 'Home';


var homeElement = document.createElement('div');
homeElement.className = 'homeButtonDiv';
homeElement.appendChild(homeButton);
toolbarDivElement.appendChild(homeElement);

homeButton.addEventListener("click", () => {
    location.href = "HTML/index.html";
})

// map.addControl(homeControl);
// end : home Control





    // Overlay
    var menu = new ol.control.Overlay ({ 
      closeBox : true, 
      className: "slide-left menu", 
      content: $("#menu").get(0)
    });
    map.addControl(menu);
  
    // A toggle control to show/hide the menu
    var t = new ol.control.Toggle({
      html: '<i class="fa fa-bars" ></i>',
      className: "menu",
      title: "Menu",
      onToggle: function() { menu.toggle(); }
    });
    map.addControl(t);





// Control
// start : full screen Control
var fsButton = document.createElement('button');
fsButton.innerHTML = '<img src="RSC/IMG/fullscreen.svg" alt="" class="myImg"></img>';
fsButton.className = 'myButton';
fsButton.title = 'Full Screen';

var fsElement = document.createElement('div');
fsElement.className = 'myButtonDiv';
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
})

// map.addControl(fsControl);
// end : full screen Control
// start : Layers Control
var lyrsButton = document.createElement('button');
lyrsButton.innerHTML = '<img src="RSC/IMG/layers.svg" alt="" class="myImg"></img>';
lyrsButton.className = 'myButton';
lyrsButton.title = 'Layers';

var lyrElement = document.createElement('div');
lyrElement.className = 'myButtonDiv';
lyrElement.appendChild(lyrsButton);
toolbarDivElement.appendChild(lyrElement);

var layersFlag = false;
lyrsButton.addEventListener("click", () => {
    lyrsButton.classList.toggle('clicked');
    document.getElementById("map").style.cursor = "default";
    layersFlag = !layersFlag;

    if (layersFlag) {
        document.getElementById("layersDiv").style.display = "block";
    } else {
        document.getElementById("layersDiv").style.display = "none";
    }
})
// end : Layers Control

// Control

map.addControl(new ol.control.ScaleLine());


// start : FeatureInfo Control
var featureInfoButton = document.createElement('button');
featureInfoButton.innerHTML = '<img src="RSC/IMG/identify.svg" alt="" class="myImg"></img>';
featureInfoButton.className = 'myButton';
featureInfoButton.id = 'featureInfoButton';
featureInfoButton.title = 'Feature Info';

var featureInfoElement = document.createElement('div');
featureInfoElement.className = 'myButtonDiv';
featureInfoElement.appendChild(featureInfoButton);
toolbarDivElement.appendChild(featureInfoElement);

var featureInfoFlag = false;
featureInfoButton.addEventListener("click", () => {
    featureInfoButton.classList.toggle('clicked');
    featureInfoFlag = !featureInfoFlag;
})

const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');

const popup = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250,
    },
});


closer.onclick = function () {
    popup.setPosition(undefined);
    container.style.display = "none";
    closer.blur();
    return false;
};

map.addOverlay(popup);

map.on('singleclick', function (evt) {
    if (featureInfoFlag) {
        content.innerHTML = '';
        var resolution = mapView.getResolution();

        var url = Cameroun_Regions.getSource().getFeatureInfoUrl(evt.coordinate, resolution,
            'EPSG:4326', { 'INFO_FORMAT': 'application/json', 'propertyName': 'id_region,nom' });

        if (url) {
            $.getJSON(url, function (data) {
                // console.log(data);
                var feature = data.features[0];
                var props = feature.properties;
                content.innerHTML = "<h3> State : </h3> <p>" + props.nom.toUpperCase() + "</p><br><h3> District : </h3> <p>" + props.id_region.toUpperCase() + "</p>";
                popup.setPosition(evt.coordinate);
                container.style.display = "block";
            })
        } else {
            // maybe you hide the popup here
            popup.setPosition(undefined);
            container.style.display = "none";
        }
    }
});
// start : FeatureInfo Control

// start : Length and Area Measurement Control
var lengthButton = document.createElement('button');
lengthButton.innerHTML = '<img src="RSC/IMG/measure-length.png" alt="" class="myImg"></img>';
lengthButton.className = 'myButton';
lengthButton.id = 'lengthButton';
lengthButton.title = 'Measure Length';

var lengthElement = document.createElement('div');
lengthElement.className = 'myButtonDiv';
lengthElement.appendChild(lengthButton);
toolbarDivElement.appendChild(lengthElement);

var lengthFlag = false;
lengthButton.addEventListener("click", () => {
    // disableOtherInteraction('lengthButton');
    lengthButton.classList.toggle('clicked');
    lengthFlag = !lengthFlag;
    document.getElementById("map").style.cursor = "default";
    if (lengthFlag) {
        map.removeInteraction(draw);
        addInteraction('LineString');
    } else {
        map.removeInteraction(draw);
        source.clear();
        const elements = document.getElementsByClassName("ol-tooltip ol-tooltip-static");
        while (elements.length > 0) elements[0].remove();
    }

})

var areaButton = document.createElement('button');
areaButton.innerHTML = '<img src="RSC/IMG/measure-area.png" alt="" class="myImg"></img>';
areaButton.className = 'myButton';
areaButton.id = 'areaButton';
areaButton.title = 'Measure Area';

var areaElement = document.createElement('div');
areaElement.className = 'myButtonDiv';
areaElement.appendChild(areaButton);
toolbarDivElement.appendChild(areaElement);

var areaFlag = false;
areaButton.addEventListener("click", () => {
    // disableOtherInteraction('areaButton');
    areaButton.classList.toggle('clicked');
    areaFlag = !areaFlag;
    document.getElementById("map").style.cursor = "default";
    if (areaFlag) {
        map.removeInteraction(draw);
        addInteraction('Polygon');
    } else {
        map.removeInteraction(draw);
        source.clear();
        const elements = document.getElementsByClassName("ol-tooltip ol-tooltip-static");
        while (elements.length > 0) elements[0].remove();
    }
})

/**
 * Message to show when the user is drawing a polygon.
 * @type {string}
 */
var continuePolygonMsg = 'Click to continue polygon, Double click to complete';

/**
 * Message to show when the user is drawing a line.
 * @type {string}
 */
var continueLineMsg = 'Click to continue line, Double click to complete';

var draw; // global so we can remove it later

var source = new ol.source.Vector();
var vector = new ol.layer.Vector({
    source: source,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)',
        }),
        stroke: new ol.style.Stroke({
            color: '#ffcc33',
            width: 2,
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#ffcc33',
            }),
        }),
    }),
});

map.addLayer(vector);

function addInteraction(intType) {

    draw = new ol.interaction.Draw({
        source: source,
        type: intType,
        style: interactionStyle
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
        var helpMsg = 'Click to start drawing';

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

    map.on('pointermove', pointerMoveHandler);

    // var listener;
    draw.on('drawstart', function (evt) {
        // set sketch
        sketch = evt.feature;

        /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
        var tooltipCoord = evt.coordinate;

        //listener = sketch.getGeometry().on('change', function (evt) {
        sketch.getGeometry().on('change', function (evt) {
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

    draw.on('drawend', function () {
        measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
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
    helpTooltipElement = document.createElement('div');
    helpTooltipElement.className = 'ol-tooltip hidden';
    helpTooltip = new ol.Overlay({
        element: helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left',
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
    measureTooltipElement = document.createElement('div');
    measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
    measureTooltip = new ol.Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center',
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
        output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
    } else {
        output = Math.round(length * 100) / 100 + ' ' + 'm';
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
        output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
    } else {
        output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
    }
    return output;
};
// end : Length and Area Measurement Control


// start : attribute query
var qryButton = document.createElement('button');
qryButton.innerHTML = '<img src="RSC/IMG/query.svg" alt="" class="myImg"></img>';
qryButton.className = 'myButton';
qryButton.id = 'qryButton';
qryButton.title = 'Attribute Query';

var qryElement = document.createElement('div');
qryElement.className = 'myButtonDiv';
qryElement.appendChild(qryButton);
toolbarDivElement.appendChild(qryElement);

var qryFlag = false;
qryButton.addEventListener("click", () => {
    // disableOtherInteraction('lengthButton');
    qryButton.classList.toggle('clicked');
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

        addMapLayerList('selectLayer');
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

})

var markerFeature;
function addInteractionForSpatialQuery(intType) {
    draw = new ol.interaction.Draw({
        source: clickSelectedFeatureOverlay.getSource(),
        type: intType,
        style: interactionStyle
    });
    map.addInteraction(draw);

    draw.on('drawend', function (e) {
        markerFeature = e.feature;
        markerFeature.set('geometry', markerFeature.getGeometry());
        map.removeInteraction(draw);
        document.getElementById('spUserInput').classList.toggle('clicked');
        map.addLayer(clickSelectedFeatureOverlay);
    })
}


function selectFeature(evt) {
    if (featureOverlay) {
        featureOverlay.getSource().clear();
        map.removeLayer(featureOverlay);
    }
    var selectedFeature = map.forEachFeatureAtPixel(evt.pixel,
        function (feature, layer) {
            return feature;
        });

    if (selectedFeature) {
        featureOverlay.getSource().addFeature(selectedFeature);
    }
}

function addMapLayerList(selectElementName) {
    $('#editingLayer').empty();
    $('#selectLayer').empty();
    $('#buffSelectLayer').empty();
    
    
    $(document).ready(function () {
        $.ajax({
            type: "GET",
            url: "http://" + serverPort + "/geoserver/wfs?request=getCapabilities",
            dataType: "xml",
            success: function (xml) {
                var select = $('#' + selectElementName);
                select.append("<option class='ddindent' value=''></option>");
                $(xml).find('FeatureType').each(function () {
                    $(this).find('Name').each(function () {
                        var value = $(this).text();
                        if (layerList.includes(value)) {
                            select.append("<option class='ddindent' value='" + value + "'>" + value + "</option>");
                        }
                    });
                });
            }
        });
    });

};


function newpopulateQueryTable(url) {
    if (typeof attributePanel !== 'undefined') {
        if (attributePanel.parentElement !== null) {
            attributePanel.close();
        }
    }
    $.getJSON(url, function (data) {
        var col = [];
        col.push('id');
        for (var i = 0; i < data.features.length; i++) {

            for (var key in data.features[i].properties) {

                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }

        var table = document.createElement("table");

        table.setAttribute("class", "table table-bordered table-hover table-condensed");
        table.setAttribute("id", "attQryTable");
        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

        var tr = table.insertRow(-1);                   // TABLE ROW.

        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");      // TABLE HEADER.
            th.innerHTML = col[i];
            tr.appendChild(th);
        }

        // ADD JSON DATA TO THE TABLE AS ROWS.
        for (var i = 0; i < data.features.length; i++) {
            tr = table.insertRow(-1);
            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                if (j == 0) { tabCell.innerHTML = data.features[i]['id']; }
                else {
                    tabCell.innerHTML = data.features[i].properties[col[j]];
                }
            }
        }

        // var tabDiv = document.createElement("div");
        var tabDiv = document.getElementById('attListDiv');

        var delTab = document.getElementById('attQryTable');
        if (delTab) {
            tabDiv.removeChild(delTab);
        }

        tabDiv.appendChild(table);

        document.getElementById("attListDiv").style.display = "block";


    });
};

function newaddGeoJsonToMap(url) {

    if (queryGeoJSON) {
        queryGeoJSON.getSource().clear();
        map.removeLayer(queryGeoJSON);
    }

    queryGeoJSON = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: url,
            format: new ol.format.GeoJSON()
        }),
        style: querySelectedFeatureStyle,

    });

    queryGeoJSON.getSource().on('addfeature', function () {
        map.getView().fit(
            queryGeoJSON.getSource().getExtent(),
            { duration: 1590, size: map.getSize(), maxZoom: 21 }
        );
    });
    map.addLayer(queryGeoJSON);
};

function newaddRowHandlers() {
    var attTable = document.getElementById("attQryTable");
    // var rows = document.getElementById("attQryTable").rows;
    var rows = attTable.rows;
    var heads = attTable.getElementsByTagName('th');
    var col_no;
    for (var i = 0; i < heads.length; i++) {
        // Take each cell
        var head = heads[i];
        if (head.innerHTML == 'id') {
            col_no = i + 1;
        }

    }
    for (i = 0; i < rows.length; i++) {
        rows[i].onclick = function () {
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

                        clickSelectedFeatureOverlay.getSource().on('addfeature', function () {
                            map.getView().fit(
                                clickSelectedFeatureOverlay.getSource().getExtent(),
                                { duration: 1500, size: map.getSize(), maxZoom: 24 }
                            );
                        });

                    }
                }
            };
        }(rows[i]);
    }
}
// end : attribute query

// start : spatial query
var bufferButton = document.createElement('button');
bufferButton.innerHTML = '<img src="RSC/IMG/mapSearch.png" alt="" class="myImg"></img>';
bufferButton.className = 'myButton';
bufferButton.id = 'bufferButton';
bufferButton.title = 'Spatial Query';

var bufferElement = document.createElement('div');
bufferElement.className = 'myButtonDiv';
bufferElement.appendChild(bufferButton);
toolbarDivElement.appendChild(bufferElement);

var bufferFlag = false;
bufferButton.addEventListener("click", () => {
    // disableOtherInteraction('lengthButton');
    bufferButton.classList.toggle('clicked');
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
        if (document.getElementById('spUserInput').classList.contains('clicked')) { document.getElementById('spUserInput').classList.toggle('clicked'); }
    }

})

function addMapLayerList_spQry() {
    $(document).ready(function () {
        $.ajax({
            type: "GET",
            url: "http://" + serverPort + "/geoserver/wfs?request=getCapabilities",
            dataType: "xml",
            success: function (xml) {
                var select = $('#buffSelectLayer');
                select.append("<option class='ddindent' value=''></option>");
                $(xml).find('FeatureType').each(function () {
                    $(this).find('Name').each(function () {
                        var value = $(this).text();
                        if (layerList.includes(value)) {
                            select.append("<option class='ddindent' value='" + value + "'>" + value + "</option>");
                        }
                    });
                });
            }
        });
    });

};
// end : spatial query


// start : settings Control
var settingsButton = document.createElement('button');
settingsButton.innerHTML = '<img src="RSC/IMG/settings.svg" alt="" class="myImg"></img>';
settingsButton.className = 'myButton';
settingsButton.id = 'settingButton';
settingsButton.title = 'Settings';

var settingElement = document.createElement('div');
settingElement.className = 'myButtonDiv';
settingElement.appendChild(settingsButton);
toolbarDivElement.appendChild(settingElement);

var settingFlag = false;
settingsButton.addEventListener("click", () => {
    settingsButton.classList.toggle('clicked');
    settingFlag = !settingFlag;
    document.getElementById("map").style.cursor = "default";
    if (settingFlag) {
        document.getElementById("settingsDiv").style.display = "block";
        addMapLayerList('editingLayer');
    } else {
        document.getElementById("settingsDiv").style.display = "none";
    }
})
// end : settings Control

// finally add all main control to map
var allControl = new ol.control.Control({
    element: toolbarDivElement
})
map.addControl(allControl);


// start : live search function

var txtVal = "";
var inputBox = document.getElementById('inpt_search');
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
                    url: 'http://localhost/web_app/fetch.php',
                    type: 'post',
                    data: { request: 'liveSearch', searchTxt: txtVal, searchLayer: 'public.'+ regions , searchAttribute: 'nom' },
                    dataType: 'json',
                    success: function (response) {
                        createRows(response, regions);
                    }
                });

                $.ajax({
                    url: 'http://localhost/web_app/fetch.php',
                    type: 'post',
                    data: { request: 'liveSearch', searchTxt: txtVal, searchLayer: 'public.'+ departements , searchAttribute: 'nom' },
                    dataType: 'json',
                    success: function (response) {
                        createRows(response, departements);
                    }
                });

                $.ajax({
                  url: 'http://localhost/web_app/fetch.php',
                  type: 'post',
                  data: { request: 'liveSearch', searchTxt: txtVal, searchLayer: 'public.'+ communes , searchAttribute: 'nom' },
                  dataType: 'json',
                  success: function (response) {
                      createRows(response, communes);
                  }
              });

            } else { clearResults(); }

        } else {
            clearResults();
        }
    }
}

// var liveDataDivEle = document.createElement('div');
// liveDataDivEle.className = 'liveDataDiv';
var liveDataDivEle = document.getElementById('liveDataDiv');
var searchTable = document.createElement('table');

function createLiveSearchTable() {

    searchTable.setAttribute("class", "assetSearchTableClass");
    searchTable.setAttribute("id", "assetSearchTableID");

    var tableHeaderRow = document.createElement('tr');
    var tableHeader1 = document.createElement('th');
    tableHeader1.innerHTML = "Layer";
    var tableHeader2 = document.createElement('th');
    tableHeader2.innerHTML = "Object";

    tableHeaderRow.appendChild(tableHeader1);
    tableHeaderRow.appendChild(tableHeader2);
    searchTable.appendChild(tableHeaderRow);
}

function createRows(data, layerName) {
    var i = 0;
    for (var key in data) {
        var data2 = data[key];
        var tableRow = document.createElement('tr');
        var td1 = document.createElement('td');
        if (i == 0) { td1.innerHTML = layerName; }
        var td2 = document.createElement('td');
        for (var key2 in data2) {
            td2.innerHTML = data2[key2];
            if (layerName == regions) { td2.setAttribute('onClick', 'zoomToFeature(this,\'' + regions + '\',\'' + key2 + '\')'); }
            else if (layerName == departements) { td2.setAttribute('onClick', 'zoomToFeature(this,\'' + departements + '\',\'' + key2 + '\')'); }
            else if (layerName == communes) { td2.setAttribute('onClick', 'zoomToFeature(this,\'' + communes + '\',\'' + key2 + '\')'); }
            else {  }
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
    liveDataDivEle.innerHTML = '';
    searchTable.innerHTML = '';
    map.removeLayer(queryGeoJSON);
}

function zoomToFeature(featureName, layerName, attributeName) {
    map.removeLayer(geojson);
    var value_layer = layerName;
    var value_attribute = attributeName;
    var value_operator = "==";
    var value_txt = featureName.innerHTML;
    var url = "http://localhost:8080/geoserver/beesig_w/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + value_layer + "&CQL_FILTER=" + value_attribute + "+" + value_operator + "+'" + value_txt + "'&outputFormat=application/json"
    // console.log(url);
    newaddGeoJsonToMap(url);
}

// end : live search function

// Add a title control
map.addControl(new ol.control.CanvasTitle({ 
  title: 'my title', 
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