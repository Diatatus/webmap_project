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
  'OrdnanceSurvey',
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




// The map
var map = new ol.Map({
  target: 'map',
  view: new ol.View({
    center: ol.proj.fromLonLat([12.744686, 6.434886]),
    zoom: 6,
  }),
  layers: layers,
});


const select = document.getElementById('layer-select');
function onChange() {
  const style = select.value;
  for (let i = 0, ii = layers.length; i < ii; ++i) {
    layers[i].setVisible(styles[i] === style);
  }

}


select.addEventListener('change', onChange);
onChange();

//Opacity
$('#contrast').on('input', function() {
  layers.setOpacity(parseFloat($(this).val())); 
});


// ProgressBar
var progress = new ol.control.ProgressBar({
  // target: $('.options').get(0)
  label: 'Chargement...',
  layers: layers
});
map.addControl(progress);


// Geoserver layer
var Regions_CM = new ol.layer.Image({
  title: "Regions",
  source: new ol.source.ImageWMS({
      url: 'http://' + serverPort + '/geoserver/' + geoserverWorkspace + '/wms',
      params: { 'LAYERS': geoserverWorkspace + ':' + regions, 'TILED': true },
      serverType: 'geoserver',
      visible: false
  })
});

var Departements_CM = new ol.layer.Image({
  title: "Departement",
  source: new ol.source.ImageWMS({
      url: 'http://' + serverPort + '/geoserver/' + geoserverWorkspace + '/wms',
      params: { 'LAYERS': geoserverWorkspace + ':' + departements, 'TILED': true },
      serverType: 'geoserver',
      visible: false
  })
});

var Communes_CM = new ol.layer.Image({
  title: "Communes",
  source: new ol.source.ImageWMS({
      url: 'http://' + serverPort + '/geoserver/' + geoserverWorkspace + '/wms',
      params: { 'LAYERS': geoserverWorkspace + ':' + communes, 'TILED': true },
      serverType: 'geoserver',
      visible: false
  })
});





var sidebar = new ol.control.Sidebar({
  element: 'sidebar',
  position: 'left'
});


map.addControl(sidebar);


// Control
// Control

map.addControl(new ol.control.ScaleLine());

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