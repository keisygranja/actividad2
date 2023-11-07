//leaflet
var map = L.map('map').setView([3.457642, -76.486004], 15); 

// Definir las coordenadas de los límites máximos (zona permitida)
var maxBounds = L.latLngBounds([3.454735, -76.512571], [3.458090, -76.476249]);

// Aplicar los límites máximos al mapa
map.setMaxBounds(maxBounds);

// Limitar el zoom para que no pueda alejarse más allá de un cierto nivel
map.setMinZoom(15); // Establece el zoom mínimo permitido
map.setMaxZoom(15); // Establece el zoom máximo permitido

//mapa base

var mapabase = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
{
    maxZoom: 15,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var mapabase2 = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
	maxZoom: 16
});

L.control.scale({position:'bottomleft'}).addTo(map)	;
new L.Control.GeoSearch({provider: new L.GeoSearch.Provider.Esri()}).addTo(map);	

var base = {
    "Mapa Base": mapabase,
    "ESRI": mapabase2
};
var leyenda = L.control.layers(base).addTo(map);


//gps
L.control.locate().addTo(map);
//minimapa

var OpenStreetMap_Mapnik = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var miniMap = new L.Control.MiniMap(OpenStreetMap_Mapnik,{
    toggleDisplay: true
}).addTo(map);

//popup para mostrar el atributo
function popup(feature,layer){
    if(feature.properties && feature.properties.centro_dep){
        layer.bindPopup("<strong>Espacio deportivo: </strong>" + feature.properties.centro_dep);
    }
}

//cargar capa geojson
var capa= L.geoJson(deporte,{
    onEachFeature: popup
}).addTo(map);

// Crear ventana
var win =  L.control.window(map,{title:'Actividad 2',content:'Se ha desarrollado un Geovisor para la Comuna 7 de la ciudad de Cali con el propósito de brindar información sobre los espacios deportivos disponibles en la zona. Este Geovisor ofrece las siguientes funcionalidades: GPS, Geocodificador, mapa de calor y un minimapa, además de los elementos básicos que tiene un mapa'})
           .show()



        
var heatLayer = null; // Variable para rastrear el mapa de calor

// Crear un botón personalizado para encender/apagar el mapa de calor
var mapa_calor = L.easyButton('<img src="icono/heatmap.png" align="absmiddle" height="16px">', function() {
             if (heatLayer) {
               // Si el mapa de calor está activado, desactívalo y elimínalo
               map.removeLayer(heatLayer);
               heatLayer = null; // Reinicia la variable
             } else {
               // Si el mapa de calor está desactivado, actívalo
               heatLayer = L.heatLayer([[capa._layers[94]._latlng.lat, capa._layers[94]._latlng.lng, 10]], { radius: 50 }).addTo(map);
               for (var i = 96; i < 111; i++) {
                 heatLayer.addLatLng([capa._layers[i]._latlng.lat, capa._layers[i]._latlng.lng, 10], { radius: 25 });
               }
             }
});
           
mapa_calor.addTo(map);


//cargar wms de la idesc
var wms_barrios = L.tileLayer.wms('http://ws-idesc.cali.gov.co:8081/geoserver/wms?service=WMS&version=1.1.0', {
    layers:'idesc:mc_barrios',
    format: 'image/png',
    transparent: true
}).addTo(map);

var wms_comuna = L.tileLayer.wms('http://ws-idesc.cali.gov.co:8081/geoserver/wms?service=WMS&version=1.1.0', {
    layers:'idesc:mc_comunas',
    format: 'image/png',
    transparent: true
}).addTo(map);

var wms_rios = L.tileLayer.wms('http://ws-idesc.cali.gov.co:8081/geoserver/wms?service=WMS&version=1.1.0', {
    layers:'pot_2014:bcs_hid_rios',
    format: 'image/png',
    transparent: true
}).addTo(map);

console.log(capa)

//agregar capas a la leyenda
leyenda.addOverlay(capa, 'Espacios deportivos');
leyenda.addOverlay(wms_comuna, 'Comunas');
leyenda.addOverlay(wms_barrios, 'Barrios');
leyenda.addOverlay(wms_rios, 'Rios')

           
