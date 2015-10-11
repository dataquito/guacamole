'use strict';
var React       = require('react');
var GoogleMap   = require('../../lib/index').GoogleMap;

// var latlng = new google.maps.LatLng(19.426875, -99.134564);
// var mapOptions = {
//     center: latlng,
//     disableDefaultUI: true,
// };

// $(document).ready(function() {
//     map = new google.maps.Map(document.getElementById('mapa'), {
//         center: {lat: -34.397, lng: 150.644},
//         zoom: 8
//     });
//     console.log( "ready!" );
// })

React.render(<GoogleMap/>, document.getElementById('guacamole-main'));
