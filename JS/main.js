// Base map

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
  layers: layers
});


const Select = document.getElementById('layer-select');
function onChange() {
  const style = Select.value;
  for (let i = 0, ii = layers.length; i < ii; ++i) {
    layers[i].setVisible(styles[i] === style);
  }
}
Select.addEventListener('change', onChange);
onChange();

// GeoJSON layer
var vectorSource = new ol.source.Vector({
  url: 'RSC/GeoJson/regional.geojson',
  format: new ol.format.GeoJSON(),

});

var Cameroun_Regions = new ol.layer.Tile({
  title: 'Cameroun_Regions',
  source: new ol.source.TileWMS({
    url: 'http://localhost:8080/geoserver/beesig_w/wms',
    params: { 'LAYERS': 'beesig_w:region', 'TILED': true },
    serverType: 'geoserver',
    visible: true,
  })
});

map.addLayer(new ol.layer.Vector({
  name: 'Regions',
  source: vectorSource,
  style: function (f) {
    return new ol.style.Style({
      image: new ol.style.RegularShape({
        radius: 5,
        radius2: 0,
        points: 4,
        stroke: new ol.style.Stroke({ color: "#000", width: 1 })
      }),
      text: new ol.style.Text({
        text: f.get('id').toString(),
        font: 'bold 11px sans-serif',
      }),
      stroke: new ol.style.Stroke({
        width: 1,
        color: [255, 128, 0]
      }),
      fill: new ol.style.Fill({
        color: [255, 128, 0, .2]
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
  template: {
    title:
      // 'nom',   // only display the name
      function (f) {
        return f.get('id') + ' (' + f.get('province') + ')';
      },
    attributes: // [ 'region', 'arrond', 'cantons', 'communes', 'pop' ]
    {
      'id': { title: 'ID_Region' },
      'province': { title: 'Région' },

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
        format: function (val, f) {
          return Math.round(parseInt(f.get('pop')) / 100).toLocaleString() + ' kHab.'
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
map.addOverlay(popup);




var sidebar = new ol.control.Sidebar({
  element: 'sidebar',
  position: 'left'
});


map.addControl(sidebar);


// Control
var ctrl = new ol.control.Scale({});
function setDiagonal(val) {
  var res = Math.sqrt(window.screen.width * window.screen.width + window.screen.height * window.screen.height) / val;
  res = Math.round(res);
  $('#ppi').val(res);
  ctrl.set('ppi', res);
  ctrl.setScale()
}
map.addControl(ctrl);
map.addControl(new ol.control.ScaleLine());

