var osmLayer = [
  new ol.layer.Tile({
  title: 'OSM',
  source: new ol.source.OSM(),
})];


// The map
var map = new ol.Map({
  target: 'map',
  view: new ol.View({
    center: ol.proj.fromLonLat([12.744686, 6.434886]),
    zoom: 6,
  }),
  layers : osmLayer
});

  
// GeoJSON layer
var vectorSource = new ol.source.Vector({
  url: 'RSC/GeoJson/regional.geojson',
  format: new ol.format.GeoJSON(),
  
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
        text: f.get('id').toString(),
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
  template: {
      title: 
        // 'nom',   // only display the name
        function(f) {
          return f.get('id')+' ('+f.get('province')+')';
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
map.addOverlay(popup);

    // Control
    var ctrl = new ol.control.Scale({	});
    map.addControl(ctrl);
    map.addControl(new ol.control.ScaleLine());
    
    function setDiagonal(val) {
      var res = Math.sqrt(window.screen.width*window.screen.width+window.screen.height*window.screen.height)/val; 
      res = Math.round(res);
      $('#ppi').val(res);
      ctrl.set('ppi', res); 
      ctrl.setScale()
    }


// Add a new Layerswitcher to the map
var base_map = map.addControl (new ol.control.LayerSwitcherImage());

// Redraw layer when fonts are loaded
$(window).on("load", function(){ console.log("loaded"); vector.changed(); });


const sidePanel = new SidePanel();


map.addControl(sidePanel);

const layersPane = sidePanel.definePane({
  paneId: 'layers',
  name: "Layers",
  icon: '<i class="bi bi-layers-half"></i>'
});

const layersGreeting = document.createElement('p');
layersGreeting.innerHTML = "Hi there layers!";

layersPane.addWidgetElement(layersGreeting);